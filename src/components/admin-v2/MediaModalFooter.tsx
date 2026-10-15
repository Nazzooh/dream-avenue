// src/components/admin-v2/MediaModalFooter.tsx
import React from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface MediaModalFooterProps {
  activeUrl: string | null;
  selectedUrls?: string[];
  selectedName?: string;
  multiple?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function MediaModalFooter({
  activeUrl,
  selectedUrls = [],
  selectedName,
  multiple = false,
  onClose,
  onConfirm,
}: MediaModalFooterProps) {
  const isMulti = multiple && selectedUrls.length > 0;
  const count = selectedUrls.length;
  const hasSelection = isMulti ? count > 0 : Boolean(activeUrl);

  const handleCopyLink = () => {
    if (isMulti) {
      navigator.clipboard.writeText(selectedUrls.join('\n'));
      toast.success(`${count} image URLs copied to clipboard`);
    } else if (activeUrl) {
      navigator.clipboard.writeText(activeUrl);
      toast.success('Image URL copied');
    }
  };

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
        {hasSelection ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <img
                src={isMulti ? selectedUrls[0] : activeUrl!}
                alt="Selected"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '1.5px solid var(--admin-lime-secondary, #A4DD00)',
                }}
              />
              {isMulti && count > 1 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-6px',
                    background: 'var(--admin-lime-primary, #B6F500)',
                    color: 'var(--admin-text-primary, #2A2A2A)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    borderRadius: '999px',
                    padding: '1px 5px',
                    border: '1px solid #FFFFFF',
                    boxShadow: 'var(--admin-shadow-sm)',
                  }}
                >
                  +{count - 1}
                </div>
              )}
            </div>

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
                {isMulti
                  ? `${count} ${count === 1 ? 'Image' : 'Images'} Selected`
                  : selectedName || 'Selected Image'}
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
                <Check size={11} strokeWidth={3} /> Ready to apply
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
        {hasSelection && (
          <button
            type="button"
            onClick={handleCopyLink}
            className="admin-btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.8125rem' }}
          >
            <Copy size={13} />
            {isMulti && count > 1 ? 'Copy Links' : 'Copy Link'}
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
          disabled={!hasSelection}
          onClick={onConfirm}
          className="admin-btn-primary"
          style={{ padding: '8px 20px', fontSize: '0.8125rem', opacity: hasSelection ? 1 : 0.5 }}
        >
          <Check size={14} strokeWidth={2.5} />
          {isMulti
            ? `Use Selected (${count})`
            : 'Use Selected Image'}
        </button>
      </div>
    </div>
  );
}
