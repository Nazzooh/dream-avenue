// src/components/admin-v2/MediaModalHeader.tsx
import { X, Image as ImageIcon, Upload } from 'lucide-react';

interface MediaModalHeaderProps {
  title: string;
  totalImages: number;
  activeTab: 'library' | 'upload';
  onTabChange: (tab: 'library' | 'upload') => void;
  onClose: () => void;
}

export function MediaModalHeader({
  title,
  totalImages,
  activeTab,
  onTabChange,
  onClose,
}: MediaModalHeaderProps) {
  return (
    <div className="media-header-wrap">
      {/* Top row: Title info + Close button */}
      <div className="media-header-title-row">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #FAF2E3, #EFE3CE)',
              border: '1.5px solid #DFC9A6',
              color: '#8C652D',
            }}
          >
            <ImageIcon size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-stone-900 truncate leading-snug m-0">
              {title}
            </h3>
            <p className="text-xs text-stone-500 font-medium m-0 flex items-center gap-1.5 mt-0.5">
              <span>{totalImages} {totalImages === 1 ? 'image' : 'images'} in library</span>
            </p>
          </div>
        </div>

        {/* Mobile & Desktop Touch-Friendly Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 active:scale-95 transition-all flex-shrink-0"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
      </div>

      {/* Segmented Touch Tab Switcher */}
      <div className="media-header-tabs">
        <button
          type="button"
          onClick={() => onTabChange('library')}
          className={`media-header-tab-btn ${activeTab === 'library' ? 'active' : ''}`}
        >
          <ImageIcon size={15} />
          <span>Browse Library</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold ml-0.5">
            {totalImages}
          </span>
        </button>
        <button
          type="button"
          onClick={() => onTabChange('upload')}
          className={`media-header-tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
        >
          <Upload size={15} />
          <span>Upload New</span>
        </button>
      </div>
    </div>
  );
}
