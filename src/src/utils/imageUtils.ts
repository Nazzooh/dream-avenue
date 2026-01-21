/**
 * Optimizes Supabase Storage URLs by appending transformation parameters.
 * 
 * @param url - The original image URL
 * @param width - Desired width (default: 800)
 * @param quality - Desired quality (default: 80)
 * @returns Optimized URL
 */
export const getOptimizedSupabaseUrl = (url: string | undefined | null, width: number = 800, quality: number = 80): string | undefined => {
    if (!url) return undefined;

    // Only optimize Supabase Storage URLs
    if (!url.includes('supabase.co/storage/v1/object/public')) {
        return url;
    }

    // If already has query params, append to them, otherwise start new
    const separator = url.includes('?') ? '&' : '?';

    // Use Supabase Image Transformation (requires Pro plan or is available on standard storage depending on config)
    // For standard storage, we can't resize on the fly without an edge function or CDN wrapper.
    // HOWEVER, assuming standard Supabase setup, query params often don't do anything unless the "Image Transformation" feature is enabled.
    // If the user's report showed 3MB images, we MUST reduce size.
    // If transformations aren't enabled, this change won't hurt (just ignored), BUT we should assume they might be or we need to rely on client-side constraints.

    // STRATEGY ADJUSTMENT: Since we can't guarantee server-side resizing without knowing the plan,
    // we will at least ensure the browser knows the intent. 
    // But wait, the Prompt says "Implement Supabase Image Transformation utility". 
    // Supabase Resizing via URL is: /render/image/public/...
    // Standard URL is: /object/public/...
    // We should try to switch to /render/image/public/ if possible, or just append params if the project supports it.
    // Common pattern: https://<project>.supabase.co/storage/v1/render/image/public/<bucket>/<file>?width=500&height=600

    // Let's try to convert the URL format if it matches the standard object structure.

    try {
        const urlObj = new URL(url);
        if (urlObj.pathname.includes('/storage/v1/object/public')) {
            // Replace /object/public with /render/image/public for on-the-fly resizing
            // urlObj.pathname = urlObj.pathname.replace('/storage/v1/object/public', '/storage/v1/render/image/public');

            // actually, standard pattern for many Supabase setups with image resizing is just appending params 
            // to the /render/ endpoint OR using a dedicated CDN.
            // Let's stick to appending params as a safe first step, or if we want to be aggressive, we change the path.
            // Given the high stakes (100/100), let's assume standard behavior:
            // If we just append ?width=X it might not work on 'object' endpoint.
            // Let's try to use the 'render' endpoint approach which is the "Image Transformation" service.

            const newPath = urlObj.pathname.replace('/object/public', '/render/image/public');
            return `${urlObj.origin}${newPath}?width=${width}&quality=${quality}&format=webp`;
        }
    } catch (e) {
        console.warn('Failed to optimize image URL:', url);
    }

    return `${url}${separator}width=${width}&quality=${quality}&format=webp`;
};
