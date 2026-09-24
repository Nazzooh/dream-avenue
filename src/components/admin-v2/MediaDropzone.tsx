// src/components/admin-v2/MediaDropzone.tsx
import React, { useState, useRef } from 'react';
import { Upload, Loader2, AlertCircle } from 'lucide-react';

interface MediaDropzoneProps {
  onFileSelect: (file: File) => void;
  uploading: boolean;
  uploadProgress?: number;
  maxSize?: number; // in MB
  accept?: string;
}

export function MediaDropzone({
  onFileSelect,
  uploading,
  uploadProgress = 0,
  maxSize = 10,
  accept = 'image/jpeg,image/png,image/webp,image/jpg,image/svg+xml,image/gif',
}: MediaDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    setErrorMessage('');

    if (file.size > maxSize * 1024 * 1024) {
      setErrorMessage(`File size exceeds ${maxSize}MB limit.`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file.');
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (uploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!uploading) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && fileInputRef.current?.click()}
        style={{
          position: 'relative',
          cursor: uploading ? 'default' : 'pointer',
          borderRadius: '16px',
          padding: '36px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          border: isDragOver
            ? '2px solid var(--admin-lime-primary, #B6F500)'
            : '2px dashed var(--admin-border, #E6E6E6)',
          backgroundColor: isDragOver
            ? 'rgba(182, 245, 0, 0.08)'
            : 'var(--admin-bg-hover, #F5F5F2)',
          transition: 'all 0.2s ease',
          minHeight: '200px',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={uploading}
          style={{ display: 'none' }}
        />

        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <Loader2
              size={38}
              style={{
                color: 'var(--admin-lime-secondary, #A4DD00)',
                animation: 'spin 1s linear infinite',
              }}
            />
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--admin-text-primary, #2A2A2A)', fontSize: '0.9375rem' }}>
                Uploading to Media Library...
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--admin-text-secondary, #666)' }}>
                {uploadProgress}% completed
              </p>
            </div>
            <div
              style={{
                width: '200px',
                height: '6px',
                backgroundColor: 'var(--admin-divider, #E6E6E6)',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${uploadProgress}%`,
                  background: 'linear-gradient(90deg, var(--admin-lime-primary, #B6F500), var(--admin-lime-secondary, #A4DD00))',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'rgba(182, 245, 0, 0.15)',
                border: '1.5px solid rgba(182, 245, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--admin-text-primary, #2A2A2A)',
                boxShadow: 'var(--admin-shadow-sm)',
              }}
            >
              <Upload size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--admin-text-primary, #2A2A2A)', fontSize: '0.9375rem' }}>
                Drag & drop image here, or <span style={{ color: '#6A9E00', textDecoration: 'underline' }}>browse</span>
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--admin-text-secondary, #666)' }}>
                Supports JPG, PNG, WebP, SVG, GIF (Max {maxSize}MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '8px',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            color: 'var(--admin-error, #FF6B6B)',
            fontSize: '0.75rem',
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
