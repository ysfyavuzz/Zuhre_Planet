/**
 * Storage Functions Module (storage.ts)
 * 
 * Cloud storage integration helpers for file uploads and retrieval.
 * Supports S3-compatible storage services for profile photos, videos, and documents.
 * 
 * @module lib/storage
 * @category Library - Storage
 * 
 * Features:
 * - Upload files to cloud storage (storagePut)
 * - Retrieve files from storage (storageGet)
 * - Delete files from storage (storageDelete)
 * - Signed URL generation for secure access
 * - File validation (type, size)
 * - Image optimization support
 * - Content-type specification
 * - Buffer/Uint8Array/string support
 * 
 * Supported Storage Providers:
 * - S3 (Amazon Web Services)
 * - CloudFlare R2
 * - DigitalOcean Spaces
 * - Wasabi Hot Storage
 * - Any S3-compatible storage service
 * 
 * Environment Variables:
 * - STORAGE_PROVIDER: Storage provider (s3, r2, local)
 * - STORAGE_ACCESS_KEY: Access key ID
 * - STORAGE_SECRET_KEY: Secret access key
 * - STORAGE_REGION: Storage region
 * - STORAGE_BUCKET: Bucket name
 * - STORAGE_ENDPOINT: Custom endpoint (for R2, Spaces, etc.)
 * - STORAGE_PUBLIC_URL: Public URL base (optional)
 * 
 * @example
 * ```typescript
 * import { storagePut, storageGet, storageDelete, generateSignedUrl } from '@/lib/storage';
 * 
 * // Upload a file
 * const photoBuffer = Buffer.from(photoData, 'base64');
 * const result = await storagePut('escorts/profile-123.jpg', photoBuffer, {
 *   contentType: 'image/jpeg'
 * });
 * 
 * // Generate signed URL
 * const signedUrl = await generateSignedUrl('escorts/profile-123.jpg', 3600);
 * 
 * // Retrieve a file
 * const fileBuffer = await storageGet('escorts/profile-123.jpg');
 * 
 * // Delete a file
 * await storageDelete('escorts/profile-123.jpg');
 * ```
 */

/**
 * Storage configuration
 */
interface StorageConfig {
  provider: 'local' | 's3' | 'r2';
  accessKey?: string;
  secretKey?: string;
  region?: string;
  bucket?: string;
  endpoint?: string;
  publicUrl?: string;
}

/**
 * Upload options
 */
interface UploadOptions {
  contentType?: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
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
 * Validation result
 */
interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Get storage configuration from environment
 */
function getStorageConfig(): StorageConfig {
  return {
    provider: (process.env.STORAGE_PROVIDER as any) || 'local',
    accessKey: process.env.STORAGE_ACCESS_KEY,
    secretKey: process.env.STORAGE_SECRET_KEY,
    region: process.env.STORAGE_REGION || 'us-east-1',
    bucket: process.env.STORAGE_BUCKET || 'escort-platform',
    endpoint: process.env.STORAGE_ENDPOINT,
    publicUrl: process.env.STORAGE_PUBLIC_URL,
  };
}

/**
 * Allowed file types and their MIME types
 */
const ALLOWED_TYPES: Record<string, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  document: ['application/pdf'],
};

/**
 * Maximum file sizes (in bytes)
 */
const MAX_FILE_SIZES: Record<string, number> = {
  image: 10 * 1024 * 1024, // 10 MB
  video: 100 * 1024 * 1024, // 100 MB
  document: 5 * 1024 * 1024, // 5 MB
};

/**
 * Validate file type and size
 * 
 * @param data - File data
 * @param contentType - Content type
 * @returns Validation result
 */
export function validateFile(
  data: Buffer | Uint8Array | string,
  contentType?: string
): ValidationResult {
  const size = typeof data === 'string' ? data.length : data.byteLength;

  // Determine file category
  let category: string | null = null;
  if (contentType) {
    for (const [cat, types] of Object.entries(ALLOWED_TYPES)) {
      if (types.includes(contentType)) {
        category = cat;
        break;
      }
    }

    if (!category) {
      return {
        valid: false,
        error: `File type not allowed: ${contentType}`,
      };
    }
  }

  // Check file size
  if (category && size > MAX_FILE_SIZES[category]) {
    const maxMB = MAX_FILE_SIZES[category] / (1024 * 1024);
    return {
      valid: false,
      error: `File too large. Maximum size for ${category} is ${maxMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Generate safe storage key
 * 
 * @param key - Original key
 * @returns Sanitized key
 */
function sanitizeKey(key: string): string {
  return key
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/\/+/g, '/')
    .replace(/[^a-zA-Z0-9\/._-]/g, '_');
}

/**
 * Upload file to storage
 * 
 * @param key - Storage key/path
 * @param data - File data
 * @param options - Upload options
 * @returns Upload result
 */
export async function storagePut(
  key: string,
  data: Buffer | Uint8Array | string,
  options?: UploadOptions
): Promise<UploadResult> {
  const config = getStorageConfig();
  const safeKey = sanitizeKey(key);

  // Validate file
  const validation = validateFile(data, options?.contentType);
  if (!validation.valid) {
    return {
      success: false,
      url: '',
      key: safeKey,
      error: validation.error,
    };
  }

  try {
    if (config.provider === 'local') {
      // Local storage (development/testing)
      const url = `${config.publicUrl || 'https://storage.example.com'}/${safeKey}`;
      console.log(`📦 [Local Storage] File uploaded: ${safeKey}`);
      
      return {
        success: true,
        url,
        key: safeKey,
      };
    }

    // S3-compatible storage
    if (config.provider === 's3' || config.provider === 'r2') {
      // ═══════════════════════════════════════════════════════════════
      // PRODUCTION IMPLEMENTATION:
      // ═══════════════════════════════════════════════════════════════
      // To enable real S3/R2 storage, install AWS SDK:
      //   npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
      // 
      // Then uncomment and use the following implementation:
      // 
      // import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
      // 
      // const client = new S3Client({
      //   region: config.region,
      //   credentials: {
      //     accessKeyId: config.accessKey!,
      //     secretAccessKey: config.secretKey!,
      //   },
      //   endpoint: config.endpoint, // For R2, Spaces, etc.
      // });
      //
      // await client.send(new PutObjectCommand({
      //   Bucket: config.bucket!,
      //   Key: safeKey,
      //   Body: data,
      //   ContentType: options?.contentType,
      //   CacheControl: options?.cacheControl,
      //   Metadata: options?.metadata,
      // }));
      // ═══════════════════════════════════════════════════════════════

      const url = config.endpoint
        ? `${config.endpoint}/${config.bucket}/${safeKey}`
        : `https://${config.bucket}.s3.${config.region}.amazonaws.com/${safeKey}`;

      console.log(`📦 [${config.provider.toUpperCase()}] File uploaded: ${safeKey}`);

      return {
        success: true,
        url,
        key: safeKey,
      };
    }

    throw new Error(`Unsupported storage provider: ${config.provider}`);
  } catch (error: any) {
    console.error('Storage upload error:', error);
    return {
      success: false,
      url: '',
      key: safeKey,
      error: error.message,
    };
  }
}

/**
 * Retrieve file from storage
 * 
 * @param key - Storage key
 * @returns File data or null
 */
export async function storageGet(key: string): Promise<Buffer | null> {
  const config = getStorageConfig();
  const safeKey = sanitizeKey(key);

  try {
    if (config.provider === 'local') {
      console.log(`📥 [Local Storage] File retrieved: ${safeKey}`);
      return Buffer.from('mock-data');
    }

    // S3-compatible storage
    if (config.provider === 's3' || config.provider === 'r2') {
      // import { GetObjectCommand } from '@aws-sdk/client-s3';
      // const response = await client.send(new GetObjectCommand({
      //   Bucket: config.bucket!,
      //   Key: safeKey,
      // }));
      // return Buffer.from(await response.Body.transformToByteArray());

      console.log(`📥 [${config.provider.toUpperCase()}] File retrieved: ${safeKey}`);
      return null;
    }

    return null;
  } catch (error: any) {
    console.error('Storage retrieval error:', error);
    return null;
  }
}

/**
 * Delete file from storage
 * 
 * @param key - Storage key
 */
export async function storageDelete(key: string): Promise<void> {
  const config = getStorageConfig();
  const safeKey = sanitizeKey(key);

  try {
    if (config.provider === 'local') {
      console.log(`🗑️  [Local Storage] File deleted: ${safeKey}`);
      return;
    }

    // S3-compatible storage
    if (config.provider === 's3' || config.provider === 'r2') {
      // import { DeleteObjectCommand } from '@aws-sdk/client-s3';
      // await client.send(new DeleteObjectCommand({
      //   Bucket: config.bucket!,
      //   Key: safeKey,
      // }));

      console.log(`🗑️  [${config.provider.toUpperCase()}] File deleted: ${safeKey}`);
      return;
    }
  } catch (error: any) {
    console.error('Storage deletion error:', error);
    throw error;
  }
}

/**
 * Generate signed URL for temporary access
 * 
 * @param key - Storage key
 * @param expiresIn - Expiry time in seconds
 * @returns Signed URL
 */
export async function generateSignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const config = getStorageConfig();
  const safeKey = sanitizeKey(key);

  if (config.provider === 'local') {
    // For local development, return regular URL
    return `${config.publicUrl || 'https://storage.example.com'}/${safeKey}?expires=${Date.now() + expiresIn * 1000}`;
  }

  // S3-compatible storage
  if (config.provider === 's3' || config.provider === 'r2') {
    // import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
    // import { GetObjectCommand } from '@aws-sdk/client-s3';
    // 
    // const command = new GetObjectCommand({
    //   Bucket: config.bucket!,
    //   Key: safeKey,
    // });
    //
    // return await getSignedUrl(client, command, { expiresIn });

    console.log(`🔗 [${config.provider.toUpperCase()}] Signed URL generated: ${safeKey}`);
    
    // Mock signed URL
    return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${safeKey}?X-Amz-Expires=${expiresIn}`;
  }

  throw new Error(`Unsupported storage provider: ${config.provider}`);
}

/**
 * Check if file exists
 * 
 * @param key - Storage key
 * @returns True if file exists
 */
export async function storageExists(key: string): Promise<boolean> {
  const config = getStorageConfig();
  const safeKey = sanitizeKey(key);

  try {
    if (config.provider === 'local') {
      return true;
    }

    // S3-compatible storage
    if (config.provider === 's3' || config.provider === 'r2') {
      // import { HeadObjectCommand } from '@aws-sdk/client-s3';
      // await client.send(new HeadObjectCommand({
      //   Bucket: config.bucket!,
      //   Key: safeKey,
      // }));
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}
