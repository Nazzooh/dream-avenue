// src/components/admin-v2/MediaGrid.tsx
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
      <div className="media-grid-container">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[16/11] rounded-xl bg-stone-100 animate-pulse border border-stone-200/60 flex items-center justify-center text-stone-300"
          >
            <ImageIcon size={24} />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-[#FAF8F5] rounded-2xl border border-dashed border-stone-300">
        <div
          className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 mb-3 shadow-sm"
        >
          <ImageIcon size={24} />
        </div>
        <p className="font-semibold text-stone-800 text-sm m-0">No images found</p>
        <p className="text-stone-500 text-xs mt-1 mb-0 max-w-xs">
          Upload images using the "Upload New" tab or try a different search filter.
        </p>
      </div>
    );
  }

  return (
    <div className="media-grid-container">
      {items.map((item) => {
        const isSelected = multiple && selectedUrls
          ? selectedUrls.includes(item.url)
          : selectedUrl === item.url;
        const selectionIndex = multiple && selectedUrls ? selectedUrls.indexOf(item.url) + 1 : 0;

        return (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className={`media-grid-card ${isSelected ? 'selected' : ''}`}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            aria-label={`Select ${item.name}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(item);
              }
            }}
          >
            <img
              src={item.url}
              alt={item.name}
              loading="lazy"
              className="w-full h-full object-cover block"
            />

            {/* Selection Check Badge */}
            {isSelected && (
              <div
                className="absolute top-2 right-2 min-w-[24px] h-6 px-1.5 rounded-full flex items-center justify-center shadow-md text-xs font-bold text-stone-900"
                style={{
                  background: '#B6F500',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                }}
              >
                {multiple && selectionIndex > 0 && selectedUrls && selectedUrls.length > 1 ? (
                  selectionIndex
                ) : (
                  <Check size={14} strokeWidth={3} />
                )}
              </div>
            )}

            {/* Bottom Title Bar + Quick Delete Button */}
            <div
              className="absolute inset-x-0 bottom-0 p-2 pt-6 flex items-center justify-between text-white"
              style={{
                background: 'linear-gradient(to top, rgba(15,20,16,0.92) 0%, rgba(15,20,16,0.4) 65%, transparent 100%)',
              }}
            >
              <span className="text-[11px] font-medium truncate max-w-[75%] leading-tight text-stone-100">
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
                  className="w-6 h-6 rounded-md bg-red-600/90 hover:bg-red-700 active:scale-95 flex items-center justify-center text-white p-0 border-0 transition-transform cursor-pointer flex-shrink-0"
                  aria-label="Delete image from storage"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
