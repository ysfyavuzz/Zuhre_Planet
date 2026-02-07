/**
 * Storage Functions Module (storage.ts)
 * 
 * Cloud storage integration using Supabase Storage.
 * Handles file uploads, retrievals, and deletions for profile photos, videos, and documents.
 * 
 * @module lib/storage
 * @category Library - Storage
 */

import { supabase } from './supabase';

/**
 * Storage configuration
 */
const STORAGE_BUCKET = process.env.STORAGE_BUCKET || 'escort-platform';
// const STORAGE_PUBLIC_URL_BASE = process.env.STORAGE_PUBLIC_URL || ''; // If using a custom domain or CDN (Unused)

/**
 * Upload options
 */
interface UploadOptions {
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
}

/**
 * Upload result
 */
interface UploadResult {
  success: boolean;
  url: string;
  key: string;
  error?: string;
}

/**
 * Validate file type and size
 * (Kept simple for now, relying on Supabase bucket restrictions mostly)
 */
export function validateFile(
  data: Buffer | Uint8Array | string | Blob | File
): { valid: boolean; error?: string } {
  // Simple validation logic can be expanded
  if (!data) return { valid: false, error: 'No data provided' };
  return { valid: true };
}

/**
 * Upload file to Supabase Storage
 */
export async function storagePut(
  key: string,
  data: Buffer | Uint8Array | string | Blob | File,
  options?: UploadOptions
): Promise<UploadResult> {
  const sanitizeKey = key.replace(/^\/+/, ''); // Remove leading slashes

  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(sanitizeKey, data, {
        contentType: options?.contentType,
        cacheControl: options?.cacheControl || '3600',
        upsert: options?.upsert ?? true,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(sanitizeKey);

    return {
      success: true,
      url: publicUrl,
      key: sanitizeKey,
    };
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Supabase Storage upload error:', error);
    return {
      success: false,
      url: '',
      key: sanitizeKey,
      error: error.message,
    };
  }
}

/**
 * Retrieve file from storage (Download)
 */
export async function storageGet(key: string): Promise<Blob | null> {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(key);

    if (error) throw error;
    return data;
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Storage retrieval error:', error);
    return null;
  }
}

/**
 * Delete file from storage
 */
export async function storageDelete(key: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([key]);

    if (error) throw error;
    // console.log(`🗑️ File deleted: ${key}`);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Storage deletion error:', error);
    throw error;
  }
}

/**
 * Generate signed URL for temporary access (Private Buckets)
 */
export async function generateSignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(key, expiresIn);

    if (error) throw error;
    return data?.signedUrl || '';
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Signed URL generation error:', error);
    throw error;
  }
}

/**
 * Check if file exists (Metadata check)
 */
export async function storageExists(key: string): Promise<boolean> {
  try {
    // There isn't a direct "exists" method, so we list files with prefix
    const pathParts = key.split('/');
    const fileName = pathParts.pop();
    const folderPath = pathParts.join('/');

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folderPath, {
        search: fileName,
        limit: 1,
      });

    if (error) throw error;
    return data && data.length > 0;
  } catch (error) {
    return false;
  }
}

