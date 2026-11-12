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
    <div className="image-field-container">
      <div className="image-field-label-bar">
        <label className="image-field-label">
          {label}
        </label>
        {value && (
          <span className="image-field-attached-badge">
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

          {/* Action Buttons Below Image */}
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
              className="image-field-touch-btn bg-white text-stone-700 border-stone-200 hover:bg-stone-50 active:scale-95 shadow-xs"
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
        <div className="image-field-empty-dropzone">
          <div className="image-field-dropzone-icon">
            <ImageIcon size={22} />
          </div>

          <p className="image-field-dropzone-title">
            Add image
          </p>
          <p className="image-field-dropzone-desc">
            Select an image from the library or upload from your device
          </p>

          <div className="image-field-dropzone-actions">
            <button
              type="button"
              onClick={() => openModal('library')}
              className="workspace-button workspace-button-primary inline-flex items-center gap-2 cursor-pointer"
            >
              <FolderOpen size={15} />
              <span>Select image</span>
            </button>
            <button
              type="button"
              onClick={() => openModal('upload')}
              className="image-field-direct-upload-btn"
            >
              <Upload size={13} />
              <span>or upload directly</span>
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
