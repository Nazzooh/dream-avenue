import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ArrowUpDown, Check, Edit3, Image as ImageIcon, IndianRupee, ListPlus, Loader2, PackageOpen, Plus, Search, Trash2, X } from 'lucide-react';
import { useAllPackages, useCreatePackage, useDeletePackage, useUpdatePackage } from '@/hooks/usePackages';
import type { Package as PackageData } from '@/schemas/packages';
import { AdminLoadingFallback } from '../LoadingFallback';
import { Button } from './Button';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { FormTextarea } from './FormTextarea';
import { ImageUploadField } from './ImageUploadField';
import { Modal } from './Modal';
import { ConfirmationModal } from './ConfirmationModal';
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
  const [packageToDelete, setPackageToDelete] = useState<PackageData | null>(null);
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

  const removePackage = (pkg: PackageData) => {
    if (!pkg.id) return;
    setPackageToDelete(pkg);
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

        {isLoading ? (
          <div className="da-package-collection">
            {[1, 2, 3].map((i) => (
              <div key={i} className="da-package-card animate-pulse" style={{ height: '260px', background: '#F5EFE8', borderRadius: '16px' }} />
            ))}
          </div>
        ) : !visiblePackages.length ? (
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
      <Modal
        isOpen={isEditorOpen}
        onClose={closeEditor}
        title={editingPackage ? 'Edit package' : 'Create package'}
        description={editingPackage ? 'Update package pricing, inclusions, and website visibility' : 'Add a new pricing package for clients to explore'}
        size="lg"
        footer={
          <div className="admin-modal-actions">
            <button type="button" className="workspace-button" onClick={closeEditor}>
              Cancel
            </button>
            <button
              type="submit"
              form="package-editor-form"
              className="workspace-button workspace-button-primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin inline mr-1.5" /> Saving...
                </>
              ) : editingPackage ? (
                'Save changes'
              ) : (
                'Create package'
              )}
            </button>
          </div>
        }
      >
        <form id="package-editor-form" onSubmit={savePackage} className="space-y-4">
          {/* Details & Pricing */}
          <div className="admin-form-section">
            <h4 className="admin-form-section-title">Details & Pricing</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormInput name="name" label="Package name" placeholder="e.g. Garden wedding" defaultValue={editingPackage?.name} required />
              <FormInput name="price" label="Price (₹)" type="number" min="0" placeholder="e.g. 85000" defaultValue={editingPackage?.price ?? ''} />
            </div>
            <FormTextarea name="description" label="Description" placeholder="Help clients understand this offer at a glance." defaultValue={editingPackage?.description || ''} required />
          </div>

          {/* Inclusions */}
          <div className="admin-form-section">
            <h4 className="admin-form-section-title">Inclusions & Highlights</h4>
            <fieldset className="da-package-editor-features" style={{ border: 'none', padding: 0, margin: 0 }}>
              {features.map((feature, index) => (
                <div key={`${index}-${feature}`} className="flex items-center gap-2 mb-2">
                  <input
                    value={feature}
                    onChange={(event) => updateFeature(index, event.target.value)}
                    placeholder={`Inclusion ${index + 1}`}
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setFeatures((current) => current.filter((_, position) => position !== index))}
                    aria-label={`Remove inclusion ${index + 1}`}
                    className="p-2 text-stone-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="da-add-feature"
                onClick={() => setFeatures((current) => [...current, ''])}
              >
                <ListPlus size={16} /> Add inclusion
              </button>
            </fieldset>
          </div>

          {/* Media */}
          <div className="admin-form-section">
            <h4 className="admin-form-section-title">Media</h4>
            <ImageUploadField label="Package image (optional)" value={imageUrl} onChange={(url) => setImageUrl(url || '')} />
          </div>

          {/* Visibility */}
          <div className="admin-form-section">
            <h4 className="admin-form-section-title">Visibility & Publishing</h4>
            <FormSelect name="status" label="Website visibility" defaultValue={editingPackage?.is_active === false ? 'Inactive' : 'Active'} options={[{ value: 'Active', label: 'Live on the website' }, { value: 'Inactive', label: 'Hidden draft' }]} required />
          </div>
        </form>
      </Modal>

      {packageToDelete && (
        <ConfirmationModal
          title="Delete Package?"
          message={`Are you sure you want to permanently delete "${packageToDelete.name}"? This action cannot be undone.`}
          confirmText={deleteMutation.isPending ? 'Deleting...' : 'Delete permanently'}
          cancelText="Cancel"
          isDangerous
          onConfirm={async () => {
            if (!packageToDelete.id) return;
            try {
              await deleteMutation.mutateAsync(packageToDelete.id);
              toast.success('Package deleted');
              setPackageToDelete(null);
            } catch {
              toast.error('Unable to delete this package');
            }
          }}
          onCancel={() => setPackageToDelete(null)}
        />
      )}
    </section>
  );
}
