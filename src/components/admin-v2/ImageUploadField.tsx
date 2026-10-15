// src/components/admin-v2/ImageUploadField.tsx — Enhanced Media Library Integrated Field
import React, { useState } from 'react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--admin-text-primary, #2A2A2A)',
          }}
        >
          {label}
        </label>
        {value && (
          <span
            style={{
              fontSize: '0.75rem',
              color: '#497300',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Check size={12} strokeWidth={3} /> Image Attached
          </span>
        )}
      </div>

      {value ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '200px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid var(--admin-border, #E6E6E6)',
            boxShadow: 'var(--admin-shadow-sm)',
            background: 'var(--admin-bg-hover, #F5F5F2)',
          }}
        >
          <img
            src={value}
            alt={label}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* Action overlay buttons */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px',
            }}
          >
            <button
              type="button"
              onClick={() => openModal('library')}
              className="admin-btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8125rem' }}
            >
              <FolderOpen size={14} />
              Browse Library
            </button>
            <button
              type="button"
              onClick={() => openModal('upload')}
              className="admin-btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.8125rem', background: '#FFFFFF' }}
            >
              <Upload size={14} />
              Upload New
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="admin-btn-danger"
              style={{ padding: '8px 14px', fontSize: '0.8125rem', background: '#FFFFFF' }}
            >
              <X size={14} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            border: '2px dashed var(--admin-border, #E6E6E6)',
            borderRadius: '16px',
            padding: '28px 16px',
            background: 'var(--admin-bg-hover, #F5F5F2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all var(--admin-transition-base)',
          }}
          onClick={() => openModal('library')}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--admin-lime-secondary, #A4DD00)';
            e.currentTarget.style.background = 'rgba(182, 245, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--admin-border, #E6E6E6)';
            e.currentTarget.style.background = 'var(--admin-bg-hover, #F5F5F2)';
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'rgba(182, 245, 0, 0.2)',
              border: '1.5px solid rgba(182, 245, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--admin-text-primary, #2A2A2A)',
            }}
          >
            <ImageIcon size={22} />
          </div>

          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--admin-text-primary, #2A2A2A)',
              }}
            >
              Select or Upload Image
            </p>
            <p
              style={{
                margin: '3px 0 0 0',
                fontSize: '0.75rem',
                color: 'var(--admin-text-secondary, #666)',
              }}
            >
              Browse existing database images or upload new on the fly
            </p>
          </div>

          <div
            style={{ display: 'flex', gap: '8px', marginTop: '4px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => openModal('library')}
              className="admin-btn-primary"
              style={{ padding: '7px 14px', fontSize: '0.75rem' }}
            >
              <FolderOpen size={13} />
              Browse Library
            </button>
            <button
              type="button"
              onClick={() => openModal('upload')}
              className="admin-btn-secondary"
              style={{ padding: '7px 14px', fontSize: '0.75rem' }}
            >
              <Upload size={13} />
              Upload File
            </button>
          </div>
        </div>
      )}

      {error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--admin-error, #FF6B6B)' }}>
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
