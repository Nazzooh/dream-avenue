// src/components/admin-v2/MediaModalFooter.tsx
import React from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface MediaModalFooterProps {
  activeUrl: string | null;
  selectedName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function MediaModalFooter({
  activeUrl,
  selectedName,
  onClose,
  onConfirm,
}: MediaModalFooterProps) {
  return (
    <div
      className="admin-modal-footer"
      style={{
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--admin-bg-hover, #F5F5F2)',
        borderTop: '1px solid var(--admin-divider, #F0F0F0)',
        margin: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {activeUrl ? (
          <>
            <img
              src={activeUrl}
              alt="Selected"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                objectFit: 'cover',
                border: '1.5px solid var(--admin-lime-secondary, #A4DD00)',
              }}
            />
            <div style={{ maxWidth: '240px' }}>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--admin-text-primary, #2A2A2A)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {selectedName || 'Selected Image'}
              </p>
              <span
                style={{
                  fontSize: '0.7rem',
                  color: '#497300',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Check size={11} strokeWidth={3} /> Selected & ready
              </span>
            </div>
          </>
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted, #999)', fontStyle: 'italic' }}>
            No image selected
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {activeUrl && (
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(activeUrl);
              toast.success('Image URL copied');
            }}
            className="admin-btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.8125rem' }}
          >
            <Copy size={13} />
            Copy Link
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="admin-btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.8125rem' }}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!activeUrl}
          onClick={onConfirm}
          className="admin-btn-primary"
          style={{ padding: '8px 20px', fontSize: '0.8125rem', opacity: activeUrl ? 1 : 0.5 }}
        >
          <Check size={14} strokeWidth={2.5} />
          Use Selected Image
        </button>
      </div>
    </div>
  );
}
