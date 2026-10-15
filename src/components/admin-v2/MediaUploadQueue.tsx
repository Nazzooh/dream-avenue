// src/components/admin-v2/MediaUploadQueue.tsx
import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, X, Plus, Upload, Trash2 } from 'lucide-react';

export interface QueuedUploadItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'queued' | 'uploading' | 'completed' | 'failed';
  progress: number;
  error?: string;
}

interface MediaUploadQueueProps {
  items: QueuedUploadItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onStartUpload: () => void;
  onAddMore: () => void;
  isUploading: boolean;
  maxFiles?: number;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function MediaUploadQueue({
  items,
  onRemoveItem,
  onClearAll,
  onStartUpload,
  onAddMore,
  isUploading,
  maxFiles = 10,
}: MediaUploadQueueProps) {
  const completedCount = items.filter((i) => i.status === 'completed').length;
  const pendingCount = items.filter((i) => i.status === 'queued' || i.status === 'failed').length;
  const canAddMore = items.length < maxFiles && !isUploading;

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: 'var(--admin-bg-card, #FFFFFF)',
        border: '1.5px solid var(--admin-border, #E6E6E6)',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: 'var(--admin-shadow-sm)',
      }}
    >
      {/* Queue Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--admin-text-primary, #2A2A2A)' }}>
            Upload Queue ({items.length}/{maxFiles})
          </span>
          <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: 'var(--admin-text-secondary, #666)' }}>
            {completedCount > 0 ? `${completedCount} completed` : `${items.length} selected`}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {canAddMore && (
            <button
              type="button"
              onClick={onAddMore}
              className="admin-btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={13} />
              Add More
            </button>
          )}
          {!isUploading && (
            <button
              type="button"
              onClick={onClearAll}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--admin-text-muted, #999)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 6px',
              }}
              title="Clear all"
            >
              <Trash2 size={13} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Items list */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxHeight: '260px',
          overflowY: 'auto',
          paddingRight: '4px',
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'var(--admin-bg-hover, #F5F5F2)',
              border: item.status === 'failed'
                ? '1px solid rgba(255, 107, 107, 0.3)'
                : item.status === 'completed'
                ? '1px solid rgba(182, 245, 0, 0.4)'
                : '1px solid var(--admin-border, #E6E6E6)',
            }}
          >
            {/* Thumbnail */}
            <img
              src={item.previewUrl}
              alt={item.file.name}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                objectFit: 'cover',
                flexShrink: 0,
                border: '1px solid var(--admin-border, #E6E6E6)',
              }}
            />

            {/* Info & progress */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--admin-text-primary, #2A2A2A)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={item.file.name}
                >
                  {item.file.name}
                </p>
                <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted, #999)', flexShrink: 0 }}>
                  {formatFileSize(item.file.size)}
                </span>
              </div>

              {/* Status / Progress bar */}
              {item.status === 'uploading' && (
                <div style={{ marginTop: '6px' }}>
                  <div style={{ height: '4px', width: '100%', background: 'var(--admin-border, #E6E6E6)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${item.progress}%`,
                        background: 'var(--admin-lime-primary, #B6F500)',
                        transition: 'width 0.2s ease',
                      }}
                    />
                  </div>
                </div>
              )}

              {item.status === 'failed' && (
                <p style={{ margin: '3px 0 0 0', fontSize: '0.7rem', color: 'var(--admin-error, #FF6B6B)' }}>
                  {item.error || 'Upload failed'}
                </p>
              )}
            </div>

            {/* Status Icon */}
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              {item.status === 'uploading' && (
                <Loader2 size={16} style={{ color: 'var(--admin-lime-secondary, #A4DD00)', animation: 'spin 1s linear infinite' }} />
              )}
              {item.status === 'completed' && (
                <CheckCircle2 size={16} style={{ color: '#497300' }} />
              )}
              {item.status === 'failed' && (
                <AlertCircle size={16} style={{ color: 'var(--admin-error, #FF6B6B)' }} />
              )}
              {!isUploading && item.status !== 'completed' && (
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--admin-text-muted, #999)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      {pendingCount > 0 && (
        <button
          type="button"
          disabled={isUploading}
          onClick={onStartUpload}
          className="admin-btn-primary"
          style={{
            width: '100%',
            padding: '10px 16px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: isUploading ? 0.7 : 1,
            cursor: isUploading ? 'not-allowed' : 'pointer',
          }}
        >
          {isUploading ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Uploading {items.length} images...
            </>
          ) : (
            <>
              <Upload size={16} />
              Upload All ({pendingCount} {pendingCount === 1 ? 'image' : 'images'})
            </>
          )}
        </button>
      )}
    </div>
  );
}
