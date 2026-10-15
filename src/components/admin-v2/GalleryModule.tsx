// src/components/admin-v2/GalleryModule.tsx — Redesigned Warm Editorial Luxury Gallery
import React, { useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import { Modal } from './Modal';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { FormTextarea } from './FormTextarea';
import { Button } from './Button';
import { ImageUploadField } from './ImageUploadField';
import { DeleteGalleryConfirmModal } from './DeleteGalleryConfirmModal';
import { toast } from 'sonner';
import { 
  useGalleryItems, 
  useCreateGalleryItem, 
  useUpdateGalleryItem, 
  useDeleteGalleryItem 
} from '../../src/hooks/useGallery';
import { useAdminGuard } from '../../src/hooks/useAdminGuard';
import { canManageGallery, roleLabel } from '../../src/lib/adminPermissions';
import { 
  Image as ImageIcon, 
  Edit2, 
  Trash2, 
  Plus, 
  Star, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  Calendar,
  X,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminLoadingFallback } from '../LoadingFallback';
import { GalleryItem } from '../../src/schemas/gallery';

const categoryOptions = [
  { value: 'weddings', label: 'Weddings' },
  { value: 'corporate', label: 'Corporate Events' },
  { value: 'birthdays', label: 'Birthdays' },
  { value: 'receptions', label: 'Receptions' },
  { value: 'conferences', label: 'Conferences' },
  { value: 'other', label: 'Other' },
];

export default function GalleryModule() {
  // Authorization
  const { profile, loading: authLoading } = useAdminGuard();
  const userRole = profile?.role;
  const canManage = canManageGallery(userRole);

  // Filters & sorting
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'featured'>('newest');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryItem | null>(null);
  const [isReadOnlyView, setIsReadOnlyView] = useState(false);
  const [deleteConfirmImage, setDeleteConfirmImage] = useState<GalleryItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('weddings');
  const [eventType, setEventType] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // React Query hooks
  const { data: galleryImages = [], isLoading } = useGalleryItems();
  const createMutation = useCreateGalleryItem();
  const updateMutation = useUpdateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();

  // Reset form helper
  const resetForm = () => {
    setTitle('');
    setCategory('weddings');
    setEventType('');
    setDescription('');
    setImageUrl('');
    setIsFeatured(false);
    setEditingImage(null);
    setIsReadOnlyView(false);
  };

  const handleAddNew = () => {
    if (!canManage) {
      toast.error('Only Owner, Developer, or Manager accounts can add gallery items.');
      return;
    }
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (image: GalleryItem) => {
    setEditingImage(image);
    setTitle(image.title || '');
    setCategory(image.category || 'weddings');
    setEventType(image.event_type || '');
    setDescription(image.description || '');
    setImageUrl(image.image_url || '');
    setIsFeatured(Boolean(image.is_featured));
    setIsReadOnlyView(!canManage);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (image: GalleryItem) => {
    if (!canManage) {
      toast.error('Only Owner, Developer, or Manager accounts can delete gallery items.');
      return;
    }
    setDeleteConfirmImage(image);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmImage?.id) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirmImage.id);
      setDeleteConfirmImage(null);
    } catch (error: any) {
      console.error('Delete error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canManage) {
      toast.error('Permission denied: Only Owner, Developer, or Manager accounts can save changes.');
      return;
    }

    if (!title.trim()) {
      toast.error('Please provide an image title');
      return;
    }

    if (!imageUrl.trim()) {
      toast.error('Please upload or select an image');
      return;
    }

    const payload = {
      title: title.trim(),
      category: category || null,
      event_type: eventType.trim() || null,
      description: description.trim() || null,
      image_url: imageUrl.trim(),
      is_featured: isFeatured,
    };

    try {
      if (editingImage?.id) {
        await updateMutation.mutateAsync({
          id: editingImage.id,
          data: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Submit error:', error);
    }
  };

  // Filter and sort images
  const filteredImages = useMemo(() => {
    let result = galleryImages.filter((img) => {
      const matchesCategory = selectedCategory === 'all' || img.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        img.title?.toLowerCase().includes(q) ||
        img.description?.toLowerCase().includes(q) ||
        img.event_type?.toLowerCase().includes(q) ||
        img.category?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'oldest') {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB;
      }
      // default: newest
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });

    return result;
  }, [galleryImages, selectedCategory, searchQuery, sortBy]);

  if (isLoading || authLoading) {
    return (
      <AdminLayout>
        <AdminLoadingFallback />
      </AdminLayout>
    );
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      {/* 1. Page Header */}
      <div className="gallery-lux-header">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <h1 className="gallery-lux-title">Photo Gallery</h1>
            {!canManage && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: "var(--lux-gold-light)",
                  color: "var(--lux-gold)",
                  border: "1px solid var(--lux-gold-border)"
                }}
              >
                <ShieldAlert size={13} />
                <span>{roleLabel(userRole)} · Read-Only</span>
              </span>
            )}
          </div>
          <p className="gallery-lux-desc">
            Curate, organize, and showcase venue settings across wedding, reception, and corporate event spaces.
          </p>
        </div>

        {canManage && (
          <button onClick={handleAddNew} className="workspace-button workspace-button-primary">
            <Plus size={18} />
            <span>Add New Photo</span>
          </button>
        )}
      </div>

      {/* 2. Permission Banner for Coordinator / Read-Only accounts */}
      {!canManage && (
        <div
          className="mb-6 p-4 rounded-2xl flex items-center gap-3.5"
          style={{
            background: 'var(--lux-gold-light)',
            border: '1px solid var(--lux-gold-border)',
            color: '#8C652D',
          }}
        >
          <ShieldAlert size={20} className="flex-shrink-0" />
          <p className="text-sm m-0 leading-relaxed">
            <strong>Viewing in read-only mode:</strong> You are currently signed in as <strong>{roleLabel(userRole)}</strong>.
            Editing or deleting photos and details requires <strong>Owner</strong>, <strong>Developer</strong>, or <strong>Manager</strong> permissions.
          </p>
        </div>
      )}

      {/* 3. Category Filter Tabs */}
      <div className="gallery-lux-tabs-bar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`gallery-lux-tab-btn ${selectedCategory === 'all' ? 'is-active' : ''}`}
        >
          <span>All Photos</span>
          <span className="gallery-lux-tab-count">{galleryImages.length}</span>
        </button>
        {categoryOptions.map((cat) => {
          const count = galleryImages.filter((img) => img.category === cat.value).length;
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`gallery-lux-tab-btn ${isActive ? 'is-active' : ''}`}
            >
              <span>{cat.label}</span>
              <span className="gallery-lux-tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Search and Toolbar Strip */}
      <div className="gallery-lux-controls">
        {/* Search Box */}
        <div className="gallery-lux-search-box">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="text"
            placeholder="Search photos by title, category, setting..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="gallery-lux-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Sort & Stats Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <SlidersHorizontal size={14} />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#EAE6DF] rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-800 cursor-pointer focus:outline-none focus:border-stone-400"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="featured">Featured First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          <span className="text-xs font-semibold text-stone-400">
            Showing {filteredImages.length} {filteredImages.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>
      </div>

      {/* 5. Redesigned Gallery Grid with Structured Aspect Cards */}
      <div className="gallery-lux-grid">
        {filteredImages.map((image, index) => (
          <motion.div
            key={image.id || index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
            className="gallery-lux-card"
          >
            {/* 16:10 Aspect Media Container */}
            <div className="gallery-lux-card-media">
              <img
                src={image.image_url}
                alt={image.title || 'Venue gallery photo'}
                className="gallery-lux-card-image"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=80';
                }}
              />

              {/* Floating Badges */}
              <div className="gallery-lux-card-badges">
                <span className="gallery-badge-category">
                  {image.category || 'General'}
                </span>
                {image.event_type && (
                  <span className="gallery-badge-event-type">
                    {image.event_type}
                  </span>
                )}
              </div>

              {/* Featured Gold Badge */}
              {image.is_featured && (
                <div className="gallery-badge-featured" title="Featured in venue highlights">
                  <Star size={12} fill="#8C652D" />
                  <span>Featured</span>
                </div>
              )}

              {/* Hover Actions Overlay */}
              <div className="gallery-lux-card-overlay">
                {canManage ? (
                  <>
                    <button
                      onClick={() => handleEdit(image)}
                      className="gallery-overlay-btn edit"
                      title="Edit photo details"
                    >
                      <Edit2 size={15} />
                      <span>Edit Details</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(image)}
                      className="gallery-overlay-btn delete"
                      title="Delete photo"
                    >
                      <Trash2 size={15} />
                      <span>Delete</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEdit(image)}
                    className="gallery-overlay-btn edit"
                    title="View photo details"
                  >
                    <Eye size={15} />
                    <span>View Details</span>
                  </button>
                )}
              </div>
            </div>

            {/* Card Body — Proper 18px-20px Padding & Refined Typography */}
            <div className="gallery-lux-card-body">
              <div>
                <h3 className="gallery-lux-card-title" title={image.title}>
                  {image.title || 'Untitled Photo'}
                </h3>

                {image.description ? (
                  <p className="gallery-lux-card-desc">
                    {image.description}
                  </p>
                ) : (
                  <p className="gallery-lux-card-desc empty">
                    No event description provided
                  </p>
                )}
              </div>

              {/* Card Footer — Strict Alignment and Spacing */}
              <div className="gallery-lux-card-footer">
                <span className="gallery-footer-category">
                  <span className="gallery-footer-dot" />
                  <span>{image.category || 'General'}</span>
                </span>

                {image.created_at && (
                  <span className="gallery-footer-date">
                    <Calendar size={13} style={{ opacity: 0.6 }} />
                    <span>
                      {new Date(image.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 6. Empty State */}
      {filteredImages.length === 0 && (
        <div className="workspace-empty mt-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
            style={{ background: 'var(--lux-olive-light)', color: 'var(--lux-olive)' }}
          >
            <ImageIcon size={32} />
          </div>
          <h2>{searchQuery ? 'No matching photos found' : 'No photos in this category'}</h2>
          <p>
            {searchQuery
              ? `No images matched "${searchQuery}". Try searching by setting name, event category, or clearing the filter.`
              : 'Add high-resolution photos showcasing stage decor, seating, and lighting setups.'}
          </p>
          {canManage && !searchQuery && (
            <button onClick={handleAddNew} className="workspace-button workspace-button-primary mt-4">
              <Plus size={18} />
              <span>Add First Photo</span>
            </button>
          )}
        </div>
      )}

      {/* 7. Add / Edit / View Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        size="lg"
        title={
          isReadOnlyView
            ? 'Gallery Photo Details'
            : editingImage
            ? 'Edit Photo & Event Details'
            : 'Add New Photo to Gallery'
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {isReadOnlyView && (
            <div
              className="p-3.5 rounded-xl text-xs font-medium"
              style={{
                background: 'var(--lux-gold-light)',
                color: '#8C652D',
                border: '1px solid var(--lux-gold-border)',
              }}
            >
              Viewing in read-only mode. You need Owner, Developer, or Manager permissions to make edits.
            </div>
          )}

          {/* Title */}
          <FormInput
            name="title"
            label="Image Title"
            placeholder="e.g., Grand Ballroom Reception & Chandeliers"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isReadOnlyView}
            required
          />

          {/* Category & Event Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              name="category"
              label="Event Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categoryOptions}
              disabled={isReadOnlyView}
              required
            />

            <FormInput
              name="event_type"
              label="Event Type / Setting (Optional)"
              placeholder="e.g., Outer Dining Counter, Stage Setup, Lawn"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              disabled={isReadOnlyView}
              helpText="Specific setting or celebration area"
            />
          </div>

          {/* Description */}
          <FormTextarea
            name="description"
            label="Description & Event Details (Optional)"
            placeholder="Enter notes about seating layout, capacity, decor, or the celebration shown in the photo..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isReadOnlyView}
            rows={3}
            helpText="Displayed in detailed views and event highlights"
          />

          {/* Image Upload / Media Selector */}
          <div>
            <label className="admin-label mb-2 block font-semibold text-stone-800 text-sm">
              Gallery Photo {isReadOnlyView ? '' : <span style={{ color: 'var(--lux-danger)' }}>*</span>}
            </label>
            {isReadOnlyView ? (
              <div
                style={{
                  maxHeight: '260px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  background: '#000',
                  border: '1px solid var(--lux-border)',
                }}
              >
                <img
                  src={imageUrl}
                  alt={title}
                  style={{ width: '100%', height: '260px', objectFit: 'contain' }}
                />
              </div>
            ) : (
              <ImageUploadField
                label=""
                value={imageUrl}
                onChange={(url) => setImageUrl(url || '')}
                bucket="facilities_images"
              />
            )}
          </div>

          {/* Featured Toggle */}
          {!isReadOnlyView && (
            <div
              className="flex items-center gap-3.5 p-3.5 rounded-xl transition-all"
              style={{
                background: isFeatured ? 'var(--lux-gold-light)' : '#FAF8F5',
                border: isFeatured
                  ? '1px solid var(--lux-gold-border)'
                  : '1px solid var(--lux-border)',
              }}
            >
              <input
                type="checkbox"
                id="is_featured_lux_checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#537517' }}
              />
              <label
                htmlFor="is_featured_lux_checkbox"
                className="cursor-pointer select-none text-sm font-medium"
                style={{ color: isFeatured ? '#8C652D' : 'var(--lux-ink)' }}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <Star size={14} fill={isFeatured ? '#8C652D' : 'none'} color={isFeatured ? '#8C652D' : 'currentColor'} />
                  Feature this photo in homepage highlights
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--lux-muted)' }}>
                  Featured photos appear prominently in venue promotional showcases
                </p>
              </label>
            </div>
          )}

          {/* Modal Actions */}
          <div
            className="flex gap-3 justify-end pt-5 border-t"
            style={{ borderColor: 'var(--lux-border)' }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              {isReadOnlyView ? 'Close' : 'Cancel'}
            </Button>

            {!isReadOnlyView && (
              <Button
                type="submit"
                variant="primary"
                loading={isSaving}
                disabled={isSaving}
              >
                {isSaving
                  ? 'Saving...'
                  : editingImage
                  ? 'Update Photo Details'
                  : 'Add Photo to Gallery'}
              </Button>
            )}
          </div>
        </form>
      </Modal>

      {/* 8. Delete Confirmation Modal */}
      <DeleteGalleryConfirmModal
        item={deleteConfirmImage}
        isOpen={Boolean(deleteConfirmImage)}
        onClose={() => setDeleteConfirmImage(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </AdminLayout>
  );
}
