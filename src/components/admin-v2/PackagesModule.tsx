import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ArrowUpDown, Check, Edit3, Image as ImageIcon, IndianRupee, ListPlus, Loader2, PackageOpen, Plus, Search, Trash2, X } from 'lucide-react';
import { useAllPackages, useCreatePackage, useDeletePackage, useUpdatePackage } from '../../src/hooks/usePackages';
import type { Package as PackageData } from '../../src/schemas/packages';
import { AdminLoadingFallback } from '../LoadingFallback';
import { Button } from './Button';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { FormTextarea } from './FormTextarea';
import { ImageUploadField } from './ImageUploadField';
import { Modal } from './Modal';
import { PackageReorderModal } from './PackageReorderModal';
import { AdminActionButton } from './AdminActionButton';
import { AdminSelect } from './AdminSelect';

const priceFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

function displayPrice(pkg: PackageData) {
  if (typeof pkg.price === 'number') return priceFormatter.format(pkg.price);
  if (typeof pkg.price_min === 'number' && typeof pkg.price_max === 'number') return `${priceFormatter.format(pkg.price_min)} – ${priceFormatter.format(pkg.price_max)}`;
  if (typeof pkg.price_min === 'number') return `From ${priceFormatter.format(pkg.price_min)}`;
  if (typeof pkg.price_max === 'number') return `Up to ${priceFormatter.format(pkg.price_max)}`;
  return 'Price on request';
}

export default function PackagesModule() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isReorderOpen, setIsReorderOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageData | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [visibility, setVisibility] = useState<'all' | 'active' | 'hidden'>('all');
  const { data: packages = [], isLoading } = useAllPackages();
  const createMutation = useCreatePackage();
  const updateMutation = useUpdatePackage();
  const deleteMutation = useDeletePackage();

  const visiblePackages = useMemo(() => packages.filter((pkg) => {
    const content = `${pkg.name} ${pkg.description || ''} ${(pkg.features || []).join(' ')}`.toLowerCase();
    const matchingSearch = content.includes(search.trim().toLowerCase());
    const matchingVisibility = visibility === 'all' || (visibility === 'active' ? pkg.is_active : !pkg.is_active);
    return matchingSearch && matchingVisibility;
  }), [packages, search, visibility]);

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingPackage(null);
    setImageUrl('');
    setFeatures([]);
  };

  const openEditor = (pkg?: PackageData) => {
    setEditingPackage(pkg || null);
    setImageUrl(pkg?.image_url || '');
    setFeatures(pkg?.features || []);
    setIsEditorOpen(true);
  };

  const savePackage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const priceInput = String(form.get('price') || '').trim();
    const data = {
      name: String(form.get('name') || ''),
      description: String(form.get('description') || ''),
      price: priceInput ? Number(priceInput) : null,
      features: features.map((feature) => feature.trim()).filter(Boolean),
      image_url: imageUrl || '',
      is_active: form.get('status') === 'Active',
    };
    try {
      if (editingPackage?.id) await updateMutation.mutateAsync({ id: editingPackage.id, data });
      else await createMutation.mutateAsync(data);
      toast.success(editingPackage ? 'Package updated' : 'Package created');
      closeEditor();
    } catch {
      toast.error('Unable to save this package');
    }
  };

  const removePackage = async (pkg: PackageData) => {
    if (!pkg.id || !confirm(`Delete “${pkg.name}”? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(pkg.id);
      toast.success('Package deleted');
    } catch {
      toast.error('Unable to delete this package');
    }
  };

  const toggleVisibility = async (pkg: PackageData) => {
    if (!pkg.id) return;
    try {
      await updateMutation.mutateAsync({ id: pkg.id, data: { is_active: !pkg.is_active } });
      toast.success(pkg.is_active ? 'Package hidden from the website' : 'Package is now live');
    } catch {
      toast.error('Unable to update package visibility');
    }
  };

  const updateFeature = (index: number, value: string) => setFeatures((current) => current.map((feature, position) => position === index ? value : feature));

  if (isLoading) return <AdminLoadingFallback />;
  const liveCount = packages.filter((pkg) => pkg.is_active).length;
  const hasFilters = search.trim() || visibility !== 'all';

  return (
    <section className="da-catalogue-workspace da-packages-workspace">
      <header className="da-operations-header">
        <div>
          <p className="da-page-eyebrow">Offer builder</p>
          <h1>Packages & pricing</h1>
          <p className="da-header-copy">Shape clear, elegant offers that make it easy for clients to compare what Dream Avenue provides.</p>
        </div>
        <div className="da-operations-actions">
          <AdminActionButton type="button" icon={<ArrowUpDown size={17} />} onClick={() => setIsReorderOpen(true)} disabled={!packages.length}>Reorder</AdminActionButton>
          <AdminActionButton type="button" data-admin-shortcut="new-package" variant="primary" icon={<Plus size={17} />} onClick={() => openEditor()}>Add package</AdminActionButton>
        </div>
      </header>

      <div className="da-catalogue-summary" aria-label="Packages summary">
        <span><strong>{packages.length}</strong> total offers</span>
        <span><strong>{liveCount}</strong> live on the website</span>
        <span><strong>{packages.length - liveCount}</strong> hidden drafts</span>
      </div>

      <section className="da-catalogue-panel">
        <div className="da-catalogue-toolbar">
          <label className="da-booking-search"><Search size={18} aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search offers or inclusions" /></label>
          <AdminSelect value={visibility} onValueChange={(value) => setVisibility(value as typeof visibility)} ariaLabel="Filter package visibility" options={[{ value: 'all', label: 'All visibility' }, { value: 'active', label: 'Live only' }, { value: 'hidden', label: 'Hidden only' }]} className="da-catalogue-select" />
        </div>

        {!visiblePackages.length ? (
          <div className="da-catalogue-empty"><PackageOpen size={34} /><h2>No packages found</h2><p>{hasFilters ? 'Try changing the current search or visibility filter.' : 'Create your first offer to help clients understand your venue options.'}</p>{hasFilters ? <Button type="button" variant="outline" onClick={() => { setSearch(''); setVisibility('all'); }}>Clear filters</Button> : <Button type="button" onClick={() => openEditor()}><Plus size={16} /> Add package</Button>}</div>
        ) : (
          <div className="da-package-collection">
            {visiblePackages.map((pkg) => (
              <article className="da-package-card" key={pkg.id}>
                <div className="da-package-image">
                  {pkg.image_url ? <img src={pkg.image_url} alt="" /> : <div className="da-image-placeholder"><PackageOpen size={29} /></div>}
                  <span className={pkg.is_active ? 'da-status-chip live' : 'da-status-chip'}>{pkg.is_active ? 'Live offer' : 'Hidden draft'}</span>
                </div>
                <div className="da-package-content">
                  <div className="da-package-title-row"><div><h2>{pkg.name}</h2><p className="da-package-price"><IndianRupee size={16} />{displayPrice(pkg).replace('₹', '')}</p></div></div>
                  <p className="da-package-description">{pkg.description || 'No package description has been added.'}</p>
                  <ul className="da-package-features">
                    {(pkg.features || []).slice(0, 4).map((feature, index) => <li key={`${pkg.id}-${index}`}><Check size={15} />{feature}</li>)}
                    {(pkg.features || []).length > 4 && <li className="is-more">+{(pkg.features || []).length - 4} more inclusions</li>}
                  </ul>
                  <div className="da-package-actions">
                    <button type="button" onClick={() => toggleVisibility(pkg)}>{pkg.is_active ? 'Hide' : 'Publish'}</button>
                    <button type="button" onClick={() => openEditor(pkg)}><Edit3 size={16} /> Edit</button>
                    <button type="button" className="is-danger" onClick={() => removePackage(pkg)} aria-label={`Delete ${pkg.name}`}><Trash2 size={16} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <PackageReorderModal isOpen={isReorderOpen} onClose={() => setIsReorderOpen(false)} packages={packages} />
      <Modal isOpen={isEditorOpen} onClose={closeEditor} title={editingPackage ? 'Edit package' : 'Create package'}>
        <form onSubmit={savePackage} className="da-catalogue-form">
          <FormInput name="name" label="Package name" placeholder="e.g. Garden wedding" defaultValue={editingPackage?.name} required />
          <FormTextarea name="description" label="Description" placeholder="Help clients understand this offer at a glance." defaultValue={editingPackage?.description || ''} required />
          <FormInput name="price" label="Price (₹)" type="number" min="0" placeholder="e.g. 85000" defaultValue={editingPackage?.price ?? ''} />
          <ImageUploadField label="Package image (optional)" value={imageUrl} onChange={(url) => setImageUrl(url || '')} />
          <fieldset className="da-package-editor-features"><legend>Inclusions</legend>{features.map((feature, index) => <div key={`${index}-${feature}`}><input value={feature} onChange={(event) => updateFeature(index, event.target.value)} placeholder={`Inclusion ${index + 1}`} /><button type="button" onClick={() => setFeatures((current) => current.filter((_, position) => position !== index))} aria-label={`Remove inclusion ${index + 1}`}><X size={16} /></button></div>)}<button type="button" className="da-add-feature" onClick={() => setFeatures((current) => [...current, ''])}><ListPlus size={16} /> Add inclusion</button></fieldset>
          <FormSelect name="status" label="Website visibility" defaultValue={editingPackage?.is_active === false ? 'Inactive' : 'Active'} options={[{ value: 'Active', label: 'Live on the website' }, { value: 'Inactive', label: 'Hidden draft' }]} required />
          <div className="da-catalogue-form-actions"><Button type="button" variant="outline" onClick={closeEditor}>Cancel</Button><Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{createMutation.isPending || updateMutation.isPending ? <><Loader2 size={16} className="animate-spin" /> Saving</> : editingPackage ? 'Save changes' : 'Create package'}</Button></div>
        </form>
      </Modal>
    </section>
  );
}
