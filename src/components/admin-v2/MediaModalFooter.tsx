// src/components/admin-v2/MediaModalFooter.tsx
import { Check, Copy, X } from 'lucide-react';
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
      toast.success('Image URL copied to clipboard');
    }
  };

  return (
    <div className="media-footer-wrap">
      {/* Selection Info Row */}
      <div className="flex items-center justify-between sm:justify-start gap-3 min-w-0">
        {hasSelection ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={isMulti ? selectedUrls[0] : activeUrl!}
                alt="Selected"
                className="w-10 h-10 rounded-lg object-cover border-2 border-lime-500 shadow-sm block"
              />
              {isMulti && count > 1 && (
                <div
                  className="absolute -bottom-1 -right-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-stone-900 border border-white shadow-sm"
                  style={{ background: '#B6F500' }}
                >
                  +{count - 1}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-stone-900 truncate leading-tight m-0">
                {isMulti
                  ? `${count} ${count === 1 ? 'image' : 'images'} selected`
                  : selectedName || '1 image selected'}
              </p>
              <span className="text-[11px] text-lime-800 font-semibold flex items-center gap-1 mt-0.5">
                <Check size={12} strokeWidth={3} /> Ready to apply
              </span>
            </div>
          </div>
        ) : (
          <span className="text-xs text-stone-500 italic py-1">
            Tap an image above to select it
          </span>
        )}

        {/* Copy Link shortcut for mobile (compact button) */}
        {hasSelection && (
          <button
            type="button"
            onClick={handleCopyLink}
            className="sm:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors flex-shrink-0"
            title="Copy Image URL"
            aria-label="Copy Image URL"
          >
            <Copy size={16} />
          </button>
        )}
      </div>

      {/* Touch Action Buttons */}
      <div className="media-footer-actions">
        {hasSelection && (
          <button
            type="button"
            onClick={handleCopyLink}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 active:scale-95 transition-all shadow-xs"
          >
            <Copy size={14} />
            <span>{isMulti && count > 1 ? 'Copy Links' : 'Copy Link'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 active:scale-95 transition-all shadow-xs min-h-[40px]"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={!hasSelection}
          onClick={onConfirm}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-stone-900 active:scale-95 transition-all shadow-sm min-h-[40px] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: hasSelection ? '#B6F500' : '#EAE6DF',
          }}
        >
          <Check size={16} strokeWidth={2.5} />
          <span>
            {isMulti
              ? `Apply (${count})`
              : 'Apply Image'}
          </span>
        </button>
      </div>
    </div>
  );
}
