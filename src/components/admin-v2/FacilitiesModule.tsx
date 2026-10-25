import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Building2, Edit3, Eye, EyeOff, Grid3X3, Image as ImageIcon, List, Loader2,
  Plus, Search, Sparkles, Trash2, Trees, Sunset, Utensils, Car, Music, Wind,
} from 'lucide-react';
import { useCreateFacility, useDeleteFacility, useFacilities, useUpdateFacility } from '../../hooks/useFacilities';
import type { Facility } from '../../api/facilities';
import { AdminLoadingFallback } from '../LoadingFallback';
import { Button } from './Button';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { FormTextarea } from './FormTextarea';
import { ImageUploadField } from './ImageUploadField';
import { Modal } from './Modal';
import { AdminActionButton } from './AdminActionButton';
import { AdminSelect } from './AdminSelect';

const iconOptions = [
  { value: 'sparkles', label: 'Sparkles', Icon: Sparkles },
  { value: 'building', label: 'Building', Icon: Building2 },
  { value: 'trees', label: 'Trees', Icon: Trees },
  { value: 'sunset', label: 'Sunset', Icon: Sunset },
  { value: 'utensils', label: 'Catering', Icon: Utensils },
  { value: 'car', label: 'Parking', Icon: Car },
  { value: 'music', label: 'Music', Icon: Music },
  { value: 'wind', label: 'Air conditioning', Icon: Wind },
];

const getIcon = (icon: string | null | undefined) => iconOptions.find((option) => option.value === icon)?.Icon || Sparkles;

export default function FacilitiesModule() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [visibility, setVisibility] = useState<'all' | 'active' | 'hidden'>('all');
  const { data: facilities = [], isLoading } = useFacilities(true);
  const createMutation = useCreateFacility();
  const updateMutation = useUpdateFacility();
  const deleteMutation = useDeleteFacility();

  const visibleFacilities = useMemo(() => facilities.filter((facility) => {
    const matchingSearch = `${facility.title} ${facility.description || ''}`.toLowerCase().includes(search.trim().toLowerCase());
    const matchingVisibility = visibility === 'all' || (visibility === 'active' ? facility.is_active : !facility.is_active);
    return matchingSearch && matchingVisibility;
  }), [facilities, search, visibility]);

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingFacility(null);
    setImageUrl(null);
  };

  const openEditor = (facility?: Facility) => {
    setEditingFacility(facility || null);
    setImageUrl(facility?.image_url || null);
    setIsEditorOpen(true);
  };

  const saveFacility = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = {
      title: String(form.get('title') || ''),
      description: String(form.get('description') || ''),
      icon: String(form.get('icon') || 'sparkles'),
      image_url: imageUrl,
      is_active: form.get('status') === 'Active',
    };
    try {
      if (editingFacility) await updateMutation.mutateAsync({ id: editingFacility.id, data });
      else await createMutation.mutateAsync(data);
      toast.success(editingFacility ? 'Facility updated' : 'Facility added');
      closeEditor();
    } catch {
      toast.error('Unable to save this facility');
    }
  };

  const toggleVisibility = async (facility: Facility) => {
    try {
      await updateMutation.mutateAsync({ id: facility.id, data: { is_active: !facility.is_active } });
      toast.success(facility.is_active ? 'Facility hidden from the website' : 'Facility is now visible');
    } catch {
      toast.error('Unable to update visibility');
    }
  };

  const removeFacility = async (facility: Facility) => {
    if (!confirm(`Delete “${facility.title}”? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(facility.id);
      toast.success('Facility deleted');
    } catch {
      toast.error('Unable to delete this facility');
    }
  };

  if (isLoading) return <AdminLoadingFallback />;

  const activeCount = facilities.filter((facility) => facility.is_active).length;
  const hasFilters = search.trim() || visibility !== 'all';

  return (
    <section className="da-catalogue-workspace da-facilities-workspace">
      <header className="da-operations-header">
        <div>
          <p className="da-page-eyebrow">Public venue showcase</p>
          <h1>Venue facilities</h1>
          <p className="da-header-copy">Curate the details guests see when deciding whether Dream Avenue is right for their event.</p>
        </div>
        <AdminActionButton type="button" data-admin-shortcut="new-facility" variant="primary" icon={<Plus size={17} />} onClick={() => openEditor()}>Add facility</AdminActionButton>
      </header>

      <div className="da-catalogue-summary" aria-label="Facilities summary">
        <span><strong>{facilities.length}</strong> facilities</span>
        <span><strong>{activeCount}</strong> live on the website</span>
        <span><strong>{facilities.length - activeCount}</strong> hidden drafts</span>
      </div>

      <section className="da-catalogue-panel">
        <div className="da-catalogue-toolbar">
          <label className="da-booking-search">
            <Search size={18} aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search facilities" />
          </label>
          <div className="da-catalogue-toolbar-actions">
            <AdminSelect value={visibility} onValueChange={(value) => setVisibility(value as typeof visibility)} ariaLabel="Filter facility visibility" options={[{ value: 'all', label: 'All visibility' }, { value: 'active', label: 'Live only' }, { value: 'hidden', label: 'Hidden only' }]} className="da-catalogue-select" />
            <div className="da-view-toggle" aria-label="Choose facilities view">
              <button type="button" className={viewMode === 'grid' ? 'is-active' : ''} onClick={() => setViewMode('grid')} aria-label="Grid view"><Grid3X3 size={17} /></button>
              <button type="button" className={viewMode === 'list' ? 'is-active' : ''} onClick={() => setViewMode('list')} aria-label="List view"><List size={18} /></button>
            </div>
          </div>
        </div>

        {!visibleFacilities.length ? (
          <div className="da-catalogue-empty"><Building2 size={34} /><h2>No facilities found</h2><p>{hasFilters ? 'Try changing the search or visibility filter.' : 'Add the first facility that helps clients picture their event.'}</p>{hasFilters && <Button type="button" variant="outline" onClick={() => { setSearch(''); setVisibility('all'); }}>Clear filters</Button>}</div>
        ) : (
          <div className={`da-facility-collection ${viewMode === 'list' ? 'is-list' : ''}`}>
            {visibleFacilities.map((facility) => {
              const Icon = getIcon(facility.icon);
              return (
                <article className="da-facility-card" key={facility.id}>
                  <div className="da-facility-image">
                    {facility.image_url ? <img src={facility.image_url} alt="" /> : <div className="da-image-placeholder"><ImageIcon size={28} /></div>}
                    <span className={facility.is_active ? 'da-status-chip live' : 'da-status-chip'}>{facility.is_active ? 'Live' : 'Hidden'}</span>
                  </div>
                  <div className="da-facility-content">
                    <div className="da-facility-icon"><Icon size={20} /></div>
                    <div className="da-facility-copy"><h2>{facility.title}</h2><p>{facility.description || 'No description has been added yet.'}</p></div>
                    <div className="da-catalogue-card-actions">
                      <button type="button" onClick={() => toggleVisibility(facility)} title={facility.is_active ? 'Hide from website' : 'Show on website'}>{facility.is_active ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                      <button type="button" onClick={() => openEditor(facility)} title="Edit facility"><Edit3 size={17} /></button>
                      <button type="button" className="is-danger" onClick={() => removeFacility(facility)} title="Delete facility"><Trash2 size={17} /></button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Modal isOpen={isEditorOpen} onClose={closeEditor} title={editingFacility ? 'Edit facility' : 'Add facility'}>
        <form onSubmit={saveFacility} className="da-catalogue-form">
          <FormInput name="title" label="Facility name" placeholder="e.g. Private bridal suite" defaultValue={editingFacility?.title} required />
          <FormTextarea name="description" label="Description" placeholder="What should clients know about it?" defaultValue={editingFacility?.description || ''} required />
          <FormSelect name="icon" label="Icon" defaultValue={editingFacility?.icon || 'sparkles'} options={iconOptions.map(({ value, label }) => ({ value, label }))} required />
          <ImageUploadField label="Facility image (optional)" value={imageUrl} onChange={setImageUrl} />
          <FormSelect name="status" label="Website visibility" defaultValue={editingFacility?.is_active === false ? 'Inactive' : 'Active'} options={[{ value: 'Active', label: 'Live on the website' }, { value: 'Inactive', label: 'Hidden draft' }]} required />
          <div className="da-catalogue-form-actions"><Button type="button" variant="outline" onClick={closeEditor}>Cancel</Button><Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{createMutation.isPending || updateMutation.isPending ? <><Loader2 size={16} className="animate-spin" /> Saving</> : editingFacility ? 'Save changes' : 'Add facility'}</Button></div>
        </form>
      </Modal>
    </section>
  );
}
