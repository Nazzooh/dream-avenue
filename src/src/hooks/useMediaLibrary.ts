// src/src/hooks/useMediaLibrary.ts — React Query hooks for Media Library
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMediaItems,
  uploadMediaItem,
  uploadMediaBatch,
  deleteMediaItem,
  mediaKeys,
  MediaItem,
  BatchUploadResult,
} from '../api/media';
import { toast } from 'sonner';

export const useMediaLibrary = (bucket = 'facilities_images') => {
  return useQuery({
    queryKey: mediaKeys.bucket(bucket),
    queryFn: () => getMediaItems(bucket),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useUploadMedia = (bucket = 'facilities_images') => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
      uploadMediaItem(file, bucket, folder),
    onSuccess: (newItem: MediaItem) => {
      queryClient.setQueryData<MediaItem[]>(mediaKeys.bucket(bucket), (old = []) => [
        newItem,
        ...old.filter((item) => item.url !== newItem.url),
      ]);
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
      toast.success('Image uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload image');
    },
  });
};

export const useBatchUploadMedia = (bucket = 'facilities_images') => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      files,
      folder,
      onItemProgress,
    }: {
      files: File[];
      folder?: string;
      onItemProgress?: (
        index: number,
        status: 'uploading' | 'completed' | 'failed',
        item?: MediaItem,
        error?: string
      ) => void;
    }) => uploadMediaBatch(files, bucket, folder, onItemProgress),
    onSuccess: (result: BatchUploadResult) => {
      if (result.successful.length > 0) {
        queryClient.setQueryData<MediaItem[]>(mediaKeys.bucket(bucket), (old = []) => [
          ...result.successful,
          ...old.filter((item) => !result.successful.some((s) => s.url === item.url)),
        ]);
        queryClient.invalidateQueries({ queryKey: mediaKeys.all });
      }
      if (result.failed.length === 0) {
        toast.success(
          result.successful.length === 1
            ? 'Image uploaded successfully'
            : `All ${result.successful.length} images uploaded successfully`
        );
      } else if (result.successful.length > 0) {
        toast.warning(
          `Uploaded ${result.successful.length} images, ${result.failed.length} failed`
        );
      } else {
        toast.error('Batch upload failed. Please try again.');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload batch');
    },
  });
};

export const useDeleteMedia = (bucket = 'facilities_images') => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: { bucket?: string; path?: string; id?: string }) =>
      deleteMediaItem(item),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<MediaItem[]>(mediaKeys.bucket(bucket), (old = []) =>
        old.filter(
          (item) =>
            item.id !== variables.id &&
            item.path !== variables.path
        )
      );
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
      toast.success('Image removed from storage');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete image');
    },
  });
};
