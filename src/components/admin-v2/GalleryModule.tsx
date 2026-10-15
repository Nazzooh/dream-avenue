import React, { useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import { AdminGrid } from './AdminGrid';
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
  Sparkles,
  Layers
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
  // Access control
  const { profile, loading: authLoading } = useAdminGuard();
  const userRole = profile?.role;
  const canManage = canManageGallery(userRole);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    if (!canManage) {
      // Coordinator fallback: view-only mode
      setEditingImage(image);
      setTitle(image.title || '');
      setCategory(image.category || 'weddings');
      setEventType(image.event_type || '');
      setDescription(image.description || '');
      setImageUrl(image.image_url || '');
      setIsFeatured(Boolean(image.is_featured));
      setIsReadOnlyView(true);
      setIsModalOpen(true);
      return;
    }

    setEditingImage(image);
    setTitle(image.title || '');
    setCategory(image.category || 'weddings');
    setEventType(image.event_type || '');
    setDescription(image.description || '');
    setImageUrl(image.image_url || '');
    setIsFeatured(Boolean(image.is_featured));
    setIsReadOnlyView(false);
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
      toast.error('Permission denied: Only Owner, Developer, or Manager accounts can save gallery changes.');
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

  // Filter and search images
  const filteredImages = useMemo(() => {
    return galleryImages.filter((img) => {
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
  }, [galleryImages, selectedCategory, searchQuery]);

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
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="admin-page-title" style={{ fontFamily: 'var(--admin-font-serif)' }}>
              Gallery Management
            </h1>
            {canManage ? (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(0, 255, 65, 0.12)',
                  color: 'var(--dream-neon-green, #00FF41)',
                  border: '1px solid rgba(0, 255, 65, 0.3)',
                }}
              >
                <ShieldCheck size={13} />
                {roleLabel(userRole)} • Manager Access
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(255, 179, 0, 0.12)',
                  color: '#FFB300',
                  border: '1px solid rgba(255, 179, 0, 0.3)',
                }}
              >
                <ShieldAlert size={13} />
                {roleLabel(userRole)} • Read-Only
              </span>
            )}
          </div>
          <p className="admin-page-description">
            Admins (Owner, Developer, and Manager) can add, edit, or delete venue photos and event details
          </p>
        </div>

        {canManage && (
          <button onClick={handleAddNew} className="admin-btn admin-btn-primary">
            <Plus size={20} />
            Add Image
          </button>
        )}
      </div>

      {/* Permission Info Banner for Coordinator / Read-Only accounts */}
      {!canManage && (
        <div
          className="mb-6 p-4 rounded-xl flex items-center justify-between gap-4"
          style={{
            background: 'rgba(255, 179, 0, 0.08)',
            border: '1px solid rgba(255, 179, 0, 0.25)',
            color: '#ffc107',
          }}
        >
          <div className="flex items-center gap-3">
            <ShieldAlert size={20} className="flex-shrink-0" />
            <p className="text-sm m-0">
              <strong>Read-only access:</strong> You are currently signed in as <strong>{roleLabel(userRole)}</strong>.
              Only <strong>Owner</strong>, <strong>Developer</strong>, and <strong>Manager</strong> accounts have
              permission to add, edit, or delete gallery images and details.
            </p>
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6">
        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-gradient-neon text-[var(--dream-dark-bg)] shadow-lg border-glow'
                : 'bg-[var(--dream-dark-secondary)] text-[var(--dream-text-secondary)] border border-[rgba(0,255,65,0.2)] hover:border-[var(--dream-neon-green)] hover:text-[var(--dream-neon-green)]'
            }`}
          >
            All <span className="opacity-75">({galleryImages.length})</span>
          </button>
          {categoryOptions.map((cat) => {
            const count = galleryImages.filter((img) => img.category === cat.value).length;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === cat.value
                    ? 'bg-gradient-neon text-[var(--dream-dark-bg)] shadow-lg border-glow'
                    : 'bg-[var(--dream-dark-secondary)] text-[var(--dream-text-secondary)] border border-[rgba(0,255,65,0.2)] hover:border-[var(--dream-neon-green)] hover:text-[var(--dream-neon-green)]'
                }`}
              >
                {cat.label} <span className="opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Real-time Search Box */}
        <div className="relative min-w-[240px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--dream-text-muted, #888)' }}
          />
          <input
            type="text"
            placeholder="Search images or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input pl-9 text-sm"
            style={{ paddingLeft: '34px', height: '40px' }}
          />
        </div>
      </div>

      {/* Gallery Grid */}
      <AdminGrid columns="3">
        {filteredImages.map((image, index) => (
          <motion.div
            key={image.id || index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
            className="gallery-item"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {/* Image Preview & Badges */}
            <div className="relative h-60 overflow-hidden group bg-black/40">
              <img
                src={image.image_url}
                alt={image.title || 'Gallery image'}
                className="gallery-item-image transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80';
                }}
              />

              {/* Badges on image */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                <span className="gallery-item-category text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
                  {image.category || 'General'}
                </span>
                {image.event_type && (
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-md backdrop-blur-md"
                    style={{
                      background: 'rgba(0, 0, 0, 0.65)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {image.event_type}
                  </span>
                )}
              </div>

              {/* Featured Star Badge */}
              {image.is_featured && (
                <div
                  className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold shadow-md"
                  style={{
                    background: 'rgba(255, 215, 0, 0.9)',
                    color: '#2a2000',
                  }}
                  title="Featured in highlights"
                >
                  <Star size={12} fill="#2a2000" />
                  Featured
                </div>
              )}

              {/* Hover Overlay with Action Buttons */}
              <div className="gallery-item-overlay flex items-center justify-center gap-3">
                {canManage ? (
                  <>
                    <button
                      onClick={() => handleEdit(image)}
                      className="admin-btn admin-btn-primary admin-btn-sm"
                      title="Edit Image and Details"
                    >
                      <Edit2 size={15} />
                      Edit Details
                    </button>
                    <button
                      onClick={() => handleDeleteClick(image)}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      title="Delete Image"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEdit(image)}
                    className="admin-btn admin-btn-outline admin-btn-sm"
                    title="View Details"
                  >
                    <Eye size={15} />
                    View Details
                  </button>
                )}
              </div>
            </div>

            {/* Card Content Info */}
            <div className="gallery-item-info flex-1 flex flex-col justify-between p-4">
              <div>
                <h4 className="gallery-item-title text-base font-bold line-clamp-1 mb-1">
                  {image.title || 'Untitled'}
                </h4>
                {image.description ? (
                  <p
                    className="text-xs line-clamp-2 mb-2"
                    style={{ color: 'var(--dream-text-secondary, #a0aec0)', lineHeight: '1.4' }}
                  >
                    {image.description}
                  </p>
                ) : (
                  <p
                    className="text-xs italic mb-2 opacity-50"
                    style={{ color: 'var(--dream-text-muted, #718096)' }}
                  >
                    No description added
                  </p>
                )}
              </div>

              <div
                className="flex items-center justify-between pt-2 border-t text-xs"
                style={{ borderColor: 'rgba(255, 255, 255, 0.08)', color: 'var(--dream-text-muted, #888)' }}
              >
                <span>Category: <strong style={{ color: 'var(--dream-text-primary, #ddd)' }}>{image.category || 'General'}</strong></span>
                {image.created_at && (
                  <span>
                    {new Date(image.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AdminGrid>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="text-center py-20">
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
            style={{
              background: 'rgba(0, 255, 65, 0.1)',
              border: '2px solid rgba(0, 255, 65, 0.3)',
            }}
          >
            <ImageIcon size={48} style={{ color: 'var(--dream-neon-green)' }} />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--dream-text-primary)' }}>
            {searchQuery ? 'No matching images found' : 'No images in this category'}
          </h3>
          <p style={{ color: 'var(--dream-text-secondary)' }}>
            {searchQuery
              ? `No gallery photos matched "${searchQuery}". Try a different search query.`
              : 'Add photos showcasing venue moments, halls, and setups.'}
          </p>
          {canManage && !searchQuery && (
            <button onClick={handleAddNew} className="admin-btn admin-btn-primary mt-6">
              <Plus size={20} />
              Add First Image
            </button>
          )}
        </div>
      )}

      {/* Add / Edit / View Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        size="lg"
        title={
          isReadOnlyView
            ? 'Gallery Image Details'
            : editingImage
            ? 'Edit Gallery Image & Details'
            : 'Add New Gallery Image'
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {isReadOnlyView && (
            <div
              className="p-3 rounded-lg text-xs"
              style={{ background: 'rgba(255, 179, 0, 0.1)', color: '#ffc107', border: '1px solid rgba(255, 179, 0, 0.3)' }}
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
              placeholder="e.g., Stage Setup, Dining Hall, Poolside"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              disabled={isReadOnlyView}
              helpText="Specific celebration or architectural view"
            />
          </div>

          {/* Description */}
          <FormTextarea
            name="description"
            label="Description & Event Details (Optional)"
            placeholder="Enter notes about lighting, capacity, decor, or the celebration shown in the photo..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isReadOnlyView}
            rows={3}
            helpText="Displayed in detailed views and event highlights"
          />

          {/* Image Upload / Media Selector */}
          <div>
            <label className="admin-label mb-2 block">
              Gallery Photo {isReadOnlyView ? '' : <span style={{ color: 'var(--dream-danger)' }}>*</span>}
            </label>
            {isReadOnlyView ? (
              <div
                style={{
                  maxHeight: '260px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#000',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
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
              className="flex items-center gap-3 p-3.5 rounded-xl transition-all"
              style={{
                background: isFeatured ? 'rgba(255, 215, 0, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: isFeatured
                  ? '1px solid rgba(255, 215, 0, 0.35)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <input
                type="checkbox"
                id="is_featured_checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--dream-neon-green)' }}
              />
              <label
                htmlFor="is_featured_checkbox"
                className="cursor-pointer select-none text-sm font-medium"
                style={{ color: isFeatured ? '#ffd700' : 'var(--dream-text-primary)' }}
              >
                <div className="flex items-center gap-1.5">
                  <Star size={15} fill={isFeatured ? '#ffd700' : 'none'} color={isFeatured ? '#ffd700' : 'currentColor'} />
                  Feature this photo in homepage highlights
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--dream-text-muted)' }}>
                  Featured images appear prominently in venue promotional showcases
                </p>
              </label>
            </div>
          )}

          {/* Modal Actions */}
          <div
            className="flex gap-3 justify-end pt-5 border-t"
            style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
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
                  ? 'Update Image Details'
                  : 'Add Image to Gallery'}
              </Button>
            )}
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
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
