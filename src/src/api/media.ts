// src/src/api/media.ts — Media Library API
import { supabase } from '../../utils/supabase/client';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size?: number;
  created_at?: string;
  source: 'storage' | 'database';
  bucket?: string;
  path?: string;
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'image/svg+xml',
  'image/gif',
];

/**
 * Fetch all media items across Supabase Storage and database tables
 */
export const getMediaItems = async (bucket = 'facilities_images'): Promise<MediaItem[]> => {
  const items: MediaItem[] = [];
  const seenUrls = new Set<string>();

  // 1. Fetch from Supabase Storage bucket
  try {
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from(bucket)
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (!storageError && storageFiles) {
      for (const file of storageFiles) {
        if (!file.name || file.name === '.emptyFolderPlaceholder') continue;
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(file.name);
        if (urlData?.publicUrl) {
          seenUrls.add(urlData.publicUrl);
          items.push({
            id: `${bucket}:${file.name}`,
            name: file.name,
            url: urlData.publicUrl,
            size: file.metadata?.size,
            created_at: file.created_at || file.updated_at,
            source: 'storage',
            bucket,
            path: file.name,
          });
        }
      }
    }
  } catch (err) {
    console.warn('Could not list storage files:', err);
  }

  // 2. Fetch images recorded in gallery table
  try {
    const { data: galleryRecords } = await supabase
      .from('gallery')
      .select('id, title, image_url, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (galleryRecords) {
      for (const record of galleryRecords) {
        if (record.image_url && !seenUrls.has(record.image_url)) {
          seenUrls.add(record.image_url);
          items.push({
            id: `gallery:${record.id}`,
            name: record.title || 'Gallery Image',
            url: record.image_url,
            created_at: record.created_at,
            source: 'database',
          });
        }
      }
    }
  } catch (err) {
    console.warn('Could not query gallery records:', err);
  }

  // 3. Fetch images recorded in facilities table
  try {
    const { data: facilityRecords } = await supabase
      .from('facilities')
      .select('id, title, image_url, created_at')
      .not('image_url', 'is', null)
      .limit(50);

    if (facilityRecords) {
      for (const record of facilityRecords) {
        if (record.image_url && !seenUrls.has(record.image_url)) {
          seenUrls.add(record.image_url);
          items.push({
            id: `facility:${record.id}`,
            name: record.title || 'Facility Image',
            url: record.image_url,
            created_at: record.created_at,
            source: 'database',
          });
        }
      }
    }
  } catch (err) {
    console.warn('Could not query facility records:', err);
  }

  return items;
};

/**
 * Upload a new image file directly to Supabase Storage
 */
export const uploadMediaItem = async (
  file: File,
  bucket = 'facilities_images',
  folder = ''
): Promise<MediaItem> => {
  // Authentication check
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Authentication required to upload media.');
  }

  // MIME validation
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Invalid format. Please upload JPEG, PNG, WebP, SVG, or GIF.');
  }

  // File size validation (default 10MB ceiling)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size exceeds maximum allowable limit of 10MB.');
  }

  // Sanitize file name & extension
  const rawExt = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
  const validExt = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(rawExt) ? rawExt : 'png';
  const cleanBase = file.name.substring(0, file.name.lastIndexOf('.')) || 'img';
  const sanitizedBase = cleanBase.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 30) || 'media';
  const fileName = `${sanitizedBase}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${validExt}`;
  const sanitizedFolder = folder ? folder.replace(/[^a-zA-Z0-9_-]/g, '') : '';
  const filePath = sanitizedFolder ? `${sanitizedFolder}/${fileName}` : fileName;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message || 'Failed to upload image to storage.');
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
  if (!urlData?.publicUrl) {
    throw new Error('Failed to obtain public URL for uploaded media.');
  }

  return {
    id: `${bucket}:${filePath}`,
    name: file.name,
    url: urlData.publicUrl,
    size: file.size,
    created_at: new Date().toISOString(),
    source: 'storage',
    bucket,
    path: filePath,
  };
};

export interface BatchUploadResult {
  successful: MediaItem[];
  failed: { file: File; error: string }[];
}

/**
 * Upload multiple image files to Supabase Storage with concurrency pooling
 */
export const uploadMediaBatch = async (
  files: File[],
  bucket = 'facilities_images',
  folder = '',
  onItemProgress?: (index: number, status: 'uploading' | 'completed' | 'failed', item?: MediaItem, error?: string) => void,
  concurrency = 3
): Promise<BatchUploadResult> => {
  const successful: MediaItem[] = [];
  const failed: { file: File; error: string }[] = [];

  let nextIndex = 0;
  const workerCount = Math.min(concurrency, files.length);

  const workers = Array.from({ length: workerCount }, async () => {
    while (nextIndex < files.length) {
      const currentIndex = nextIndex++;
      const file = files[currentIndex];
      try {
        onItemProgress?.(currentIndex, 'uploading');
        const item = await uploadMediaItem(file, bucket, folder);
        successful.push(item);
        onItemProgress?.(currentIndex, 'completed', item);
      } catch (err: any) {
        const errorMsg = err?.message || 'Failed to upload image';
        failed.push({ file, error: errorMsg });
        onItemProgress?.(currentIndex, 'failed', undefined, errorMsg);
      }
    }
  });

  await Promise.all(workers);
  return { successful, failed };
};

/**
 * Delete a media file from Supabase Storage
 */
export const deleteMediaItem = async (
  item: { bucket?: string; path?: string; id?: string }
): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Authentication required to delete media.');
  }

  const bucket = item.bucket || 'facilities_images';
  const path = item.path || (item.id?.includes(':') ? item.id.split(':')[1] : item.id);
  if (!path) {
    throw new Error('Cannot delete item: missing storage path.');
  }

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    throw new Error(error.message || 'Failed to delete file from storage.');
  }
};

export const mediaKeys = {
  all: ['media'] as const,
  bucket: (b: string) => [...mediaKeys.all, b] as const,
};
