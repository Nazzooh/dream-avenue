// src/components/admin-v2/MediaDropzone.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { MediaUploadQueue, QueuedUploadItem } from './MediaUploadQueue';
import { MediaItem } from '../../src/api/media';

export interface MediaDropzoneProps {
  onFileSelect?: (file: File) => void;
  onBatchUpload?: (
    files: File[],
    onProgress: (
      index: number,
      status: 'uploading' | 'completed' | 'failed',
      item?: MediaItem,
      error?: string
    ) => void
  ) => Promise<void>;
  uploading?: boolean;
  uploadProgress?: number;
  maxSize?: number; // in MB
  maxFiles?: number;
  accept?: string;
  multiple?: boolean;
}

export function MediaDropzone({
  onFileSelect,
  onBatchUpload,
  uploading = false,
  uploadProgress = 0,
  maxSize = 10,
  maxFiles = 10,
  accept = 'image/jpeg,image/png,image/webp,image/jpg,image/svg+xml,image/gif',
  multiple = true,
}: MediaDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [queuedItems, setQueuedItems] = useState<QueuedUploadItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      queuedItems.forEach((item) => {
        try {
          URL.revokeObjectURL(item.previewUrl);
        } catch {
          // ignore cleanup errors
        }
      });
    };
  }, []);

  const validateFiles = (fileList: File[]): File[] => {
    setErrorMessage('');
    const valid: File[] = [];
    const errors: string[] = [];

    const availableSlots = maxFiles - queuedItems.length;
    if (fileList.length > availableSlots) {
      errors.push(`Maximum ${maxFiles} images allowed at once. Extra files skipped.`);
    }

    const filesToProcess = fileList.slice(0, availableSlots);

    for (const file of filesToProcess) {
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`"${file.name}" exceeds ${maxSize}MB limit.`);
        continue;
      }
      if (!file.type.startsWith('image/')) {
        errors.push(`"${file.name}" is not a supported image file.`);
        continue;
      }
      valid.push(file);
    }

    if (errors.length > 0) {
      setErrorMessage(errors[0]);
    }

    return valid;
  };

  const handleFilesAdded = useCallback(
    (files: File[]) => {
      if (!files.length) return;

      if (!multiple || !onBatchUpload) {
        const single = files[0];
        if (single) {
          const validated = validateFiles([single]);
          if (validated.length && onFileSelect) {
            onFileSelect(validated[0]);
          }
        }
        return;
      }

      const validFiles = validateFiles(files);
      if (!validFiles.length) return;

      const newItems: QueuedUploadItem[] = validFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'queued',
        progress: 0,
      }));

      setQueuedItems((prev) => [...prev, ...newItems]);
    },
    [multiple, onBatchUpload, onFileSelect, maxFiles, queuedItems.length]
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (uploading) return;

    const droppedFiles = Array.from(e.dataTransfer.files || []);
    handleFilesAdded(droppedFiles);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFilesAdded(selectedFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveItem = (id: string) => {
    setQueuedItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        try {
          URL.revokeObjectURL(target.previewUrl);
        } catch {}
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleClearAll = () => {
    queuedItems.forEach((i) => {
      try {
        URL.revokeObjectURL(i.previewUrl);
      } catch {}
    });
    setQueuedItems([]);
    setErrorMessage('');
  };

  const handleStartUpload = async () => {
    if (!onBatchUpload || !queuedItems.length || uploading) return;

    const filesToUpload = queuedItems.map((i) => i.file);

    await onBatchUpload(filesToUpload, (index, status, _item, error) => {
      setQueuedItems((prev) =>
        prev.map((item, idx) => {
          if (idx !== index) return item;
          return {
            ...item,
            status,
            progress: status === 'completed' ? 100 : status === 'uploading' ? 65 : 0,
            error,
          };
        })
      );
    });
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        disabled={uploading}
        style={{ display: 'none' }}
      />

      {/* Drop area */}
      {queuedItems.length === 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            if (!uploading) setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
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
                Drag & drop {multiple ? 'images' : 'image'} here, or{' '}
                <span style={{ color: '#6A9E00', textDecoration: 'underline' }}>browse</span>
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--admin-text-secondary, #666)' }}>
                Supports JPG, PNG, WebP, SVG, GIF (Max {maxFiles} images, {maxSize}MB each)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Queue View when files are queued or uploading */}
      {queuedItems.length > 0 && (
        <MediaUploadQueue
          items={queuedItems}
          onRemoveItem={handleRemoveItem}
          onClearAll={handleClearAll}
          onStartUpload={handleStartUpload}
          onAddMore={() => fileInputRef.current?.click()}
          isUploading={uploading}
          maxFiles={maxFiles}
        />
      )}

      {errorMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
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
