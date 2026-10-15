// src/components/admin-v2/DeleteGalleryConfirmModal.tsx
import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { GalleryItem } from '../../src/schemas/gallery';
import { Button } from './Button';

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
    <div
      className="admin-modal-overlay"
      style={{ zIndex: 1200 }}
      onClick={onClose}
    >
      <div
        className="admin-modal"
        style={{ maxWidth: '440px', padding: '24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'rgba(255, 107, 107, 0.15)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              color: 'var(--dream-danger, #FF6B6B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Trash2 size={24} />
          </div>
          <div>
            <h4
              style={{
                margin: 0,
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--dream-text-primary, #ffffff)',
                fontFamily: 'var(--admin-font-serif, inherit)',
              }}
            >
              Delete Gallery Image?
            </h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--dream-text-muted, #999)' }}>
              Permanent deletion of image and metadata
            </p>
          </div>
        </div>

        {/* Item preview card */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '18px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '8px',
              overflow: 'hidden',
              flexShrink: 0,
              background: '#000',
            }}
          >
            <img
              src={item.image_url}
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80';
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'var(--dream-text-primary, #fff)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.title}
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(0, 255, 65, 0.1)',
                  color: 'var(--dream-neon-green, #00FF41)',
                  border: '1px solid rgba(0, 255, 65, 0.25)',
                }}
              >
                {item.category || 'General'}
              </span>
              {item.event_type && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#ccc',
                  }}
                >
                  {item.event_type}
                </span>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '10px',
            background: 'rgba(255, 107, 107, 0.08)',
            border: '1px solid rgba(255, 107, 107, 0.2)',
            marginBottom: '20px',
          }}
        >
          <AlertTriangle size={18} style={{ color: 'var(--dream-danger, #FF6B6B)', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#ffb3b3', lineHeight: 1.4 }}>
            This action cannot be undone. The image record and its details will be removed immediately from the public venue gallery.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            loading={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </div>
      </div>
    </div>
  );
}
