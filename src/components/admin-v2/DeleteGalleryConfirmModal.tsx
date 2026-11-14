import { GalleryItem } from '@/schemas/gallery';
import { ConfirmationModal } from './ConfirmationModal';

interface DeleteGalleryConfirmModalProps {
  item: GalleryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteGalleryConfirmModal({
  item,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteGalleryConfirmModalProps) {
  if (!isOpen || !item) return null;

  return (
    <ConfirmationModal
      title="Delete Gallery Image?"
      message={`Are you sure you want to permanently delete "${item.title || 'this item'}"? This action cannot be undone.`}
      confirmText={isDeleting ? 'Deleting...' : 'Delete Permanently'}
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onClose}
      isDangerous
    />
  );
}
