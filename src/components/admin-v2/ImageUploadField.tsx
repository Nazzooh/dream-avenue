// src/components/admin-v2/ImageUploadField.tsx — Mobile-Friendly Media Library Integrated Field
import { useState } from 'react';
import { Upload, X, Image as ImageIcon, FolderOpen, Check } from 'lucide-react';
import { MediaLibraryModal } from './MediaLibraryModal';

export interface ImageUploadFieldProps {
  label: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  onUpload?: (file: File) => Promise<string>;
  bucket?: string;
  folder?: string;
  facilityId?: string;
  error?: string;
  maxSize?: number; // in MB
  accept?: string;
  multiple?: boolean;
  values?: string[];
  onMultipleChange?: (urls: string[]) => void;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  bucket = 'facilities_images',
  folder = '',
  error,
  multiple = false,
  values = [],
  onMultipleChange,
}: ImageUploadFieldProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<'library' | 'upload'>('library');

  const openModal = (tab: 'library' | 'upload' = 'library') => {
    setModalInitialTab(tab);
    setIsModalOpen(true);
  };

  const handleSelectImage = (url: string) => {
    onChange(url);
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-semibold text-stone-800">
          {label}
        </label>
        {value && (
          <span className="text-xs text-lime-800 font-semibold flex items-center gap-1">
            <Check size={12} strokeWidth={3} /> Image Attached
          </span>
        )}
      </div>

      {value ? (
        <div className="image-field-preview-card">
          <div className="image-field-img-wrap">
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover block"
            />
            {/* Attached pill badge */}
            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-stone-900 bg-white/95 backdrop-blur-xs border border-white/60 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime-500" />
              <span>Attached</span>
            </div>
          </div>

          {/* Touch-Friendly Action Buttons Below Image */}
          <div className="image-field-actions-bar">
            <button
              type="button"
              onClick={() => openModal('library')}
              className="image-field-touch-btn bg-stone-900 text-white hover:bg-stone-800 active:scale-95 shadow-xs"
            >
              <FolderOpen size={14} />
              <span>Change Image</span>
            </button>
            <button
              type="button"
              onClick={() => openModal('upload')}
              className="image-field-touch-btn bg-white text-stone-800 border-stone-200 hover:bg-stone-50 active:scale-95 shadow-xs"
            >
              <Upload size={14} />
              <span>Upload New</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="image-field-touch-btn bg-red-50 text-red-600 border-red-200 hover:bg-red-100 active:scale-95 ml-auto"
            >
              <X size={14} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-stone-200 hover:border-lime-500 rounded-2xl p-6 sm:p-8 bg-[#FAF8F5] hover:bg-white flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all shadow-xs"
          onClick={() => openModal('library')}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-stone-900 shadow-xs"
            style={{
              background: 'rgba(182, 245, 0, 0.2)',
              border: '1.5px solid rgba(182, 245, 0, 0.5)',
            }}
          >
            <ImageIcon size={22} />
          </div>

          <div>
            <p className="m-0 font-bold text-stone-900 text-sm sm:text-base">
              Select or Upload Image
            </p>
            <p className="mt-1 text-xs text-stone-500 max-w-xs">
              Choose from your media library or upload directly from your device
            </p>
          </div>

          <div
            className="flex items-center gap-2 mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => openModal('library')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-900 active:scale-95 transition-all shadow-xs min-h-[38px] cursor-pointer"
              style={{ background: '#B6F500' }}
            >
              <FolderOpen size={14} />
              <span>Browse Library</span>
            </button>
            <button
              type="button"
              onClick={() => openModal('upload')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-stone-800 bg-white border border-stone-200 hover:bg-stone-50 active:scale-95 transition-all shadow-xs min-h-[38px] cursor-pointer"
            >
              <Upload size={14} />
              <span>Upload New</span>
            </button>
          </div>
        </div>
      )}

      {error && (
        <span className="text-xs text-red-500 font-medium mt-1">
          {error}
        </span>
      )}

      <MediaLibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectImage={handleSelectImage}
        onSelectImages={onMultipleChange}
        currentValue={value}
        currentValues={values}
        multiple={multiple}
        bucket={bucket}
        folder={folder}
        title={`Media Library — ${label}`}
        initialTab={modalInitialTab}
      />
    </div>
  );
}
