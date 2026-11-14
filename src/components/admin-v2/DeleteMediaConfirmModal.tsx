import { MediaItem } from '@/api/media';
import { ConfirmationModal } from './ConfirmationModal';

interface DeleteMediaConfirmModalProps {
  item: MediaItem | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteMediaConfirmModal({
  item,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteMediaConfirmModalProps) {
  if (!item) return null;

  return (
    <ConfirmationModal
      title="Delete Image?"
      message={`Are you sure you want to permanently delete "${item.name}"? This action cannot be undone.`}
      confirmText={isDeleting ? 'Deleting...' : 'Delete Permanently'}
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onClose}
      isDangerous
    />
  );
}
