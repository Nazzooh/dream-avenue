// src/components/admin-v2/DeleteMediaConfirmModal.tsx
import React from 'react';
import { Trash2 } from 'lucide-react';
import { MediaItem } from '../../src/api/media';

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
    <div
      className="admin-modal-overlay"
      style={{ zIndex: 1200 }}
      onClick={onClose}
    >
      <div
        className="admin-modal"
        style={{ maxWidth: '420px', padding: '24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(255, 107, 107, 0.12)',
              color: 'var(--admin-error, #FF6B6B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Trash2 size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--admin-text-primary, #2A2A2A)' }}>
              Delete Image?
            </h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--admin-text-secondary, #666)' }}>
              Permanent deletion from storage
            </p>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary, #666)', lineHeight: 1.5, margin: '14px 0 20px 0' }}>
          Are you sure you want to permanently delete{' '}
          <strong style={{ color: 'var(--admin-text-primary, #2A2A2A)' }}>"{item.name}"</strong>?
          This action cannot be undone.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="admin-btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="admin-btn-danger"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  );
}
