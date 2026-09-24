// src/components/admin-v2/MediaLibraryModal.tsx
import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { MediaGrid } from './MediaGrid';
import { MediaDropzone } from './MediaDropzone';
import { MediaModalHeader } from './MediaModalHeader';
import { MediaModalFooter } from './MediaModalFooter';
import { DeleteMediaConfirmModal } from './DeleteMediaConfirmModal';
import { useMediaLibrary, useUploadMedia, useDeleteMedia } from '../../src/hooks/useMediaLibrary';
import { MediaItem } from '../../src/api/media';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
  currentValue?: string | null;
  bucket?: string;
  folder?: string;
  title?: string;
  initialTab?: 'library' | 'upload';
}

export function MediaLibraryModal({
  isOpen,
  onClose,
  onSelectImage,
  currentValue,
  bucket = 'facilities_images',
  folder = '',
  title = 'Media Library',
  initialTab = 'library',
}: MediaLibraryModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<MediaItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: mediaItems = [], isLoading } = useMediaLibrary(bucket);
  const uploadMutation = useUploadMedia(bucket);
  const deleteMutation = useDeleteMedia(bucket);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return mediaItems;
    const q = searchQuery.toLowerCase();
    return mediaItems.filter(
      (item) => item.name.toLowerCase().includes(q) || item.url.toLowerCase().includes(q)
    );
  }, [mediaItems, searchQuery]);

  const activeUrl = selectedItem?.url || currentValue || null;

  const handleUploadFile = async (file: File) => {
    try {
      setUploadProgress(20);
      const interval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 15 : prev));
      }, 150);

      const newItem = await uploadMutation.mutateAsync({ file, folder });
      clearInterval(interval);
      setUploadProgress(100);

      setSelectedItem(newItem);
      onSelectImage(newItem.url);
      setTimeout(() => {
        setUploadProgress(0);
        onClose();
      }, 350);
    } catch {
      setUploadProgress(0);
    }
  };

  const handleConfirmSelect = () => {
    if (activeUrl) {
      onSelectImage(activeUrl);
      onClose();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmItem) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirmItem);
      if (selectedItem?.id === deleteConfirmItem.id) {
        setSelectedItem(null);
      }
      setDeleteConfirmItem(null);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="admin-modal"
        style={{
          maxWidth: '820px',
          width: '95%',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '88vh',
          padding: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <MediaModalHeader
          title={title}
          totalImages={mediaItems.length}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={onClose}
        />

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'library' ? (
            <>
              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--admin-text-muted, #999)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search existing images by filename..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--admin-border, #E6E6E6)',
                    background: 'var(--admin-bg-card, #FFFFFF)',
                    fontSize: '0.85rem',
                    color: 'var(--admin-text-primary, #2A2A2A)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'var(--admin-text-muted, #999)',
                    }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Grid */}
              <MediaGrid
                items={filteredItems}
                selectedUrl={activeUrl}
                onSelect={(item) => setSelectedItem(item)}
                onDelete={(item) => setDeleteConfirmItem(item)}
                isLoading={isLoading}
              />
            </>
          ) : (
            <div style={{ padding: '12px 0' }}>
              <MediaDropzone
                onFileSelect={handleUploadFile}
                uploading={uploadMutation.isPending}
                uploadProgress={uploadProgress}
              />
            </div>
          )}
        </div>

        <MediaModalFooter
          activeUrl={activeUrl}
          selectedName={selectedItem?.name}
          onClose={onClose}
          onConfirm={handleConfirmSelect}
        />
      </div>

      <DeleteMediaConfirmModal
        item={deleteConfirmItem}
        onClose={() => setDeleteConfirmItem(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
