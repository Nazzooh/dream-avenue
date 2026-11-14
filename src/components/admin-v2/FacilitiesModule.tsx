import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Building2, Edit3, Eye, EyeOff, Grid3X3, Image as ImageIcon, List, Loader2,
  Plus, Search, Sparkles, Trash2, Trees, Sunset, Utensils, Car, Music, Wind,
} from 'lucide-react';
import { useCreateFacility, useDeleteFacility, useFacilities, useUpdateFacility } from '@/hooks/useFacilities';
import type { Facility } from '@/api/facilities';
import { AdminLoadingFallback } from '../LoadingFallback';
import { Button } from './Button';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { FormTextarea } from './FormTextarea';
import { ImageUploadField } from './ImageUploadField';
import { Modal } from './Modal';
import { ConfirmationModal } from './ConfirmationModal';
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
  const [facilityToDelete, setFacilityToDelete] = useState<Facility | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [visibility, setVisibility] = useState<'all' | 'active' | 'hidden'>('all');
  const { data: facilities = [], isLoading } = useFacilities(true);
  const createMutation = useCreateFacility();
  const updateMutation = useUpdateFacility();
  const deleteMutation = useDeleteFacility();

  const visibleFacilities = useMemo(() => facilities.filter((facility) => {
    const matchingSearch = `${facility.title} ${facility.category || ''} ${facility.subtitles || ''} ${facility.description || ''}`.toLowerCase().includes(search.trim().toLowerCase());
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
      title: String(form.get('title') || '').trim(),
      category: String(form.get('category') || '').trim() || null,
      capacity: String(form.get('capacity') || '').trim() || null,
      subtitles: String(form.get('subtitles') || '').trim() || null,
      description: String(form.get('description') || '').trim(),
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

  const removeFacility = (facility: Facility) => {
    setFacilityToDelete(facility);
  };

  const activeCount = facilities.filter((facility) => facility.is_active).length;
  const hasFilters = search.trim() || visibility !== 'all';

  return (
    <section className="da-catalogue-workspace da-facilities-workspace">
      <header className="da-operations-header">
        <div>
          <p className="da-page-eyebrow">Public venue showcase</p>
          <h1>Venue facilities</h1>
          <p className="da-header-copy">Curate the spaces, titles, badges, and subtitles guests see when exploring Dream Avenue.</p>
        </div>
        <div className="da-operations-actions">
          <AdminActionButton type="button" data-admin-shortcut="new-facility" variant="primary" icon={<Plus size={17} />} onClick={() => openEditor()}>Add facility</AdminActionButton>
        </div>
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
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search facilities or tags" />
          </label>
          <div className="da-catalogue-toolbar-actions">
            <AdminSelect value={visibility} onValueChange={(value) => setVisibility(value as typeof visibility)} ariaLabel="Filter facility visibility" options={[{ value: 'all', label: 'All visibility' }, { value: 'active', label: 'Live only' }, { value: 'hidden', label: 'Hidden only' }]} className="da-catalogue-select" />
            <div className="da-view-toggle" aria-label="Choose facilities view">
              <button type="button" className={viewMode === 'grid' ? 'is-active' : ''} onClick={() => setViewMode('grid')} aria-label="Grid view"><Grid3X3 size={17} /></button>
              <button type="button" className={viewMode === 'list' ? 'is-active' : ''} onClick={() => setViewMode('list')} aria-label="List view"><List size={18} /></button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className={`da-facility-collection ${viewMode === 'list' ? 'is-list' : ''}`}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="da-facility-card animate-pulse" style={{ height: '220px', background: '#F5EFE8', borderRadius: '16px' }} />
            ))}
          </div>
        ) : !visibleFacilities.length ? (
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
                    <div className="da-facility-header">
                      <div className="da-facility-icon"><Icon size={20} /></div>
                      <div className="da-facility-title-wrap">
                        <h2>{facility.title}</h2>
                        {facility.category && (
                          <span className="da-status-chip" style={{ background: '#edf6de', color: '#31511b', borderColor: '#c1d986', fontSize: '0.68rem', padding: '2px 8px', marginTop: '4px', display: 'inline-block' }}>
                            {facility.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="da-facility-copy">
                      {facility.subtitles && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', margin: '4px 0 8px' }}>
                          {facility.subtitles.split(',').map((sub, i) => (
                            <span key={i} style={{ fontSize: '0.72rem', background: '#f5f0e8', color: '#534d3c', padding: '2px 7px', borderRadius: '4px', border: '1px solid #e4dacb' }}>
                              {sub.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <p>{facility.description || 'No description has been added yet.'}</p>
                    </div>
                  </div>
                  <div className="da-facility-actions">
                    <button type="button" onClick={() => toggleVisibility(facility)} title={facility.is_active ? 'Hide from website' : 'Show on website'}>
                      {facility.is_active ? <><EyeOff size={15} /> Hide</> : <><Eye size={15} /> Publish</>}
                    </button>
                    <button type="button" onClick={() => openEditor(facility)} title="Edit facility">
                      <Edit3 size={15} /> Edit
                    </button>
                    <button type="button" className="is-danger" onClick={() => removeFacility(facility)} title="Delete facility" aria-label={`Delete ${facility.title}`}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Modal
        isOpen={isEditorOpen}
        onClose={closeEditor}
        title={editingFacility ? 'Edit facility' : 'Add facility'}
        description={editingFacility ? 'Update facility highlights, image, and visibility' : 'Add a new facility to help clients picture their event'}
        size="lg"
        footer={
          <div className="admin-modal-actions">
            <button type="button" className="workspace-button" onClick={closeEditor}>
              Cancel
            </button>
            <button
              type="submit"
              form="facility-editor-form"
              className="workspace-button workspace-button-primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin inline mr-1.5" /> Saving...
                </>
              ) : editingFacility ? (
                'Save changes'
              ) : (
                'Add facility'
              )}
            </button>
          </div>
        }
      >
        <form id="facility-editor-form" onSubmit={saveFacility} className="space-y-4">
          {/* Details Section */}
          <div className="admin-form-section">
            <h4 className="admin-form-section-title">Details</h4>
            <FormInput name="title" label="Facility name" placeholder="e.g. The Grand Event Hall" defaultValue={editingFacility?.title} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormInput name="category" label="Badge title / Category" placeholder="e.g. Main Auditorium" defaultValue={editingFacility?.category || ''} />
              <FormInput name="capacity" label="Capacity badge (optional)" placeholder="e.g. 1,000+ Guests" defaultValue={editingFacility?.capacity || ''} />
            </div>
            <FormInput name="subtitles" label="Subtitles & Highlights (comma-separated)" placeholder="e.g. 800+ Guests, Sound System, Central AC" defaultValue={editingFacility?.subtitles || ''} />
            <FormTextarea name="description" label="Description" placeholder="What should clients know about it?" defaultValue={editingFacility?.description || ''} required />
            <FormSelect name="icon" label="Icon" defaultValue={editingFacility?.icon || 'sparkles'} options={iconOptions.map(({ value, label }) => ({ value, label }))} required />
          </div>

          {/* Media Section */}
          <div className="admin-form-section">
            <h4 className="admin-form-section-title">Media</h4>
            <ImageUploadField label="Facility image" value={imageUrl} onChange={setImageUrl} />
          </div>

          {/* Visibility Section */}
          <div className="admin-form-section">
            <h4 className="admin-form-section-title">Visibility & Publishing</h4>
            <FormSelect name="status" label="Website visibility" defaultValue={editingFacility?.is_active === false ? 'Inactive' : 'Active'} options={[{ value: 'Active', label: 'Live on the website' }, { value: 'Inactive', label: 'Hidden draft' }]} required />
          </div>
        </form>
      </Modal>

      {facilityToDelete && (
        <ConfirmationModal
          title="Delete Facility?"
          message={`Are you sure you want to permanently delete "${facilityToDelete.title}"? This action cannot be undone.`}
          confirmText={deleteMutation.isPending ? 'Deleting...' : 'Delete permanently'}
          cancelText="Cancel"
          isDangerous
          onConfirm={async () => {
            try {
              await deleteMutation.mutateAsync(facilityToDelete.id);
              toast.success('Facility deleted');
              setFacilityToDelete(null);
            } catch {
              toast.error('Unable to delete this facility');
            }
          }}
          onCancel={() => setFacilityToDelete(null)}
        />
      )}
    </section>
  );
}
