// src/src/hooks/useMediaLibrary.ts — React Query hooks for Media Library
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMediaItems,
  uploadMediaItem,
  deleteMediaItem,
  mediaKeys,
  MediaItem,
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
