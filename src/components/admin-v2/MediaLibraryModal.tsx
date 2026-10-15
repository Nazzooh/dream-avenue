// src/components/admin-v2/MediaLibraryModal.tsx
import { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { MediaGrid } from './MediaGrid';
import { MediaDropzone } from './MediaDropzone';
import { MediaModalHeader } from './MediaModalHeader';
import { MediaModalFooter } from './MediaModalFooter';
import { DeleteMediaConfirmModal } from './DeleteMediaConfirmModal';
import {
  useMediaLibrary,
  useUploadMedia,
  useBatchUploadMedia,
  useDeleteMedia,
} from '../../src/hooks/useMediaLibrary';
import { MediaItem } from '../../src/api/media';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (url: string) => void;
  onSelectImages?: (urls: string[]) => void;
  currentValue?: string | null;
  currentValues?: string[];
  bucket?: string;
  folder?: string;
  title?: string;
  initialTab?: 'library' | 'upload';
  multiple?: boolean;
}

export function MediaLibraryModal({
  isOpen,
  onClose,
  onSelectImage,
  onSelectImages,
  currentValue,
  currentValues = [],
  bucket = 'facilities_images',
  folder = '',
  title = 'Media Library',
  initialTab = 'library',
  multiple = false,
}: MediaLibraryModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [selectedUrls, setSelectedUrls] = useState<string[]>(() => {
    if (multiple) {
      if (currentValues.length > 0) return currentValues;
      if (currentValue) return [currentValue];
    }
    return [];
  });
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<MediaItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: mediaItems = [], isLoading } = useMediaLibrary(bucket);
  const uploadMutation = useUploadMedia(bucket);
  const batchUploadMutation = useBatchUploadMedia(bucket);
  const deleteMutation = useDeleteMedia(bucket);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return mediaItems;
    const q = searchQuery.toLowerCase();
    return mediaItems.filter(
      (item) => item.name.toLowerCase().includes(q) || item.url.toLowerCase().includes(q)
    );
  }, [mediaItems, searchQuery]);

  const activeUrl = selectedItem?.url || currentValue || (selectedUrls[0] ?? null);

  const handleSelectGridItem = (item: MediaItem) => {
    if (multiple) {
      setSelectedUrls((prev) =>
        prev.includes(item.url) ? prev.filter((u) => u !== item.url) : [...prev, item.url]
      );
      setSelectedItem(item);
    } else {
      setSelectedItem(item);
    }
  };

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
      if (onSelectImage) onSelectImage(newItem.url);
      setTimeout(() => {
        setUploadProgress(0);
        onClose();
      }, 350);
    } catch {
      setUploadProgress(0);
    }
  };

  const handleBatchUpload = async (
    files: File[],
    onProgress: (
      index: number,
      status: 'uploading' | 'completed' | 'failed',
      item?: MediaItem,
      error?: string
    ) => void
  ) => {
    try {
      const result = await batchUploadMutation.mutateAsync({
        files,
        folder,
        onItemProgress: onProgress,
      });

      if (result.successful.length > 0) {
        const newUrls = result.successful.map((i) => i.url);
        if (multiple) {
          setSelectedUrls((prev) => [...newUrls, ...prev.filter((u) => !newUrls.includes(u))]);
        }
        setSelectedItem(result.successful[0]);

        // Automatically switch to library tab to highlight newly uploaded images
        setTimeout(() => {
          setActiveTab('library');
        }, 500);
      }
    } catch (err) {
      console.error('Batch upload error:', err);
    }
  };

  const handleConfirmSelect = () => {
    if (multiple) {
      if (selectedUrls.length > 0) {
        onSelectImages?.(selectedUrls);
        if (onSelectImage && selectedUrls[0]) {
          onSelectImage(selectedUrls[0]);
        }
        onClose();
      }
    } else if (activeUrl) {
      onSelectImage?.(activeUrl);
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
      setSelectedUrls((prev) => prev.filter((u) => u !== deleteConfirmItem.url));
      setDeleteConfirmItem(null);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="media-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="media-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <MediaModalHeader
          title={title}
          totalImages={mediaItems.length}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={onClose}
        />

        {/* Responsive Scrollable Body */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 flex flex-col min-h-0">
          {activeTab === 'library' ? (
            <>
              {/* Touch-Friendly Search Bar */}
              <div className="relative mb-3 sm:mb-4 flex-shrink-0">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search existing images by filename..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-lime-500/30 focus:border-lime-500 transition-all shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 text-xs transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Responsive Grid */}
              <div className="flex-1 overflow-y-auto">
                <MediaGrid
                  items={filteredItems}
                  selectedUrl={activeUrl}
                  selectedUrls={selectedUrls}
                  multiple={multiple}
                  onSelect={handleSelectGridItem}
                  onDelete={(item) => setDeleteConfirmItem(item)}
                  isLoading={isLoading}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto py-2">
              <MediaDropzone
                onFileSelect={handleUploadFile}
                onBatchUpload={handleBatchUpload}
                uploading={batchUploadMutation.isPending || uploadMutation.isPending}
                uploadProgress={uploadProgress}
                multiple={true}
                maxFiles={10}
              />
            </div>
          )}
        </div>

        <MediaModalFooter
          activeUrl={activeUrl}
          selectedUrls={selectedUrls}
          selectedName={selectedItem?.name}
          multiple={multiple}
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
