// src/components/admin-v2/MediaGrid.tsx
import React from 'react';
import { MediaItem } from '../../src/api/media';
import { Check, Image as ImageIcon, Trash2 } from 'lucide-react';

interface MediaGridProps {
  items: MediaItem[];
  selectedUrl?: string | null;
  selectedUrls?: string[];
  onSelect: (item: MediaItem) => void;
  onDelete?: (item: MediaItem) => void;
  isLoading?: boolean;
  multiple?: boolean;
}

export function MediaGrid({
  items,
  selectedUrl = null,
  selectedUrls,
  onSelect,
  onDelete,
  isLoading = false,
  multiple = false,
}: MediaGridProps) {
  if (isLoading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '12px',
          maxHeight: '380px',
          overflowY: 'auto',
          padding: '4px',
        }}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            style={{
              aspectRatio: '16/10',
              borderRadius: '12px',
              background: 'var(--admin-bg-hover, #F5F5F2)',
              border: '1px solid var(--admin-border, #E6E6E6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--admin-text-muted, #999)',
            }}
          >
            <ImageIcon size={24} />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
          background: 'var(--admin-bg-hover, #F5F5F2)',
          borderRadius: '16px',
          border: '1px dashed var(--admin-border, #E6E6E6)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--admin-bg-card, #FFFFFF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--admin-text-secondary, #666)',
            marginBottom: '10px',
            boxShadow: 'var(--admin-shadow-sm)',
          }}
        >
          <ImageIcon size={24} />
        </div>
        <p style={{ margin: 0, fontWeight: 600, color: 'var(--admin-text-primary, #2A2A2A)', fontSize: '0.875rem' }}>
          No images found
        </p>
        <p style={{ margin: '4px 0 0 0', color: 'var(--admin-text-muted, #999)', fontSize: '0.75rem' }}>
          Upload a new image or change your search filter.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '12px',
        maxHeight: '380px',
        overflowY: 'auto',
        padding: '4px',
      }}
    >
      {items.map((item) => {
        const isSelected = multiple && selectedUrls
          ? selectedUrls.includes(item.url)
          : selectedUrl === item.url;
        const selectionIndex = multiple && selectedUrls ? selectedUrls.indexOf(item.url) + 1 : 0;

        return (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            style={{
              position: 'relative',
              aspectRatio: '16/10',
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: isSelected
                ? '2.5px solid var(--admin-lime-primary, #B6F500)'
                : '1.5px solid var(--admin-border, #E6E6E6)',
              boxShadow: isSelected
                ? '0 0 12px rgba(182, 245, 0, 0.45)'
                : '0 2px 5px rgba(0, 0, 0, 0.04)',
              background: 'var(--admin-bg-card, #FFFFFF)',
              transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              if (!isSelected) e.currentTarget.style.borderColor = 'var(--admin-lime-secondary, #A4DD00)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              if (!isSelected) e.currentTarget.style.borderColor = 'var(--admin-border, #E6E6E6)';
            }}
          >
            <img
              src={item.url}
              alt={item.name}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            {/* Selection Check Badge */}
            {isSelected && (
              <div
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  minWidth: '22px',
                  height: '22px',
                  padding: multiple && selectionIndex > 0 ? '0 5px' : 0,
                  borderRadius: '50%',
                  background: 'var(--admin-lime-primary, #B6F500)',
                  color: 'var(--admin-text-primary, #2A2A2A)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {multiple && selectionIndex > 0 && selectedUrls && selectedUrls.length > 1 ? (
                  selectionIndex
                ) : (
                  <Check size={14} strokeWidth={3} />
                )}
              </div>
            )}

            {/* Hover bottom title bar */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                padding: '6px 8px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3) 70%, transparent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#FFFFFF',
              }}
            >
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '75%',
                }}
              >
                {item.name}
              </span>

              {onDelete && item.source === 'storage' && (
                <button
                  type="button"
                  title="Delete image"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item);
                  }}
                  style={{
                    background: 'rgba(255, 107, 107, 0.85)',
                    border: 'none',
                    borderRadius: '6px',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <Trash2 size={11} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
