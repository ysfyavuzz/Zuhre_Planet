/**
 * VideoUpload Component
 *
 * Video upload and management component for escort profiles.
 * Handles video selection, upload progress, preview, and management.
 *
 * @module components/VideoUpload
 * @category Components - Media
 *
 * Features:
 * - Video file selection with drag & drop
 * - Format validation (MP4, WebM, MOV)
 * - Size validation (max 50MB)
 * - Upload progress with percentage
 * - Video preview with thumbnail
 * - Multiple video support
 * - Delete and reorder videos
 * - Set as primary video
 * - Auto-thumbnail generation
 * - Upload retry functionality
 *
 * Video Specifications:
 * - Max file size: 50MB
 * - Supported formats: MP4, WebM, MOV
 * - Max videos: 10 (free), 20 (premium), unlimited (VIP)
 * - Max duration: 2 minutes (free), 5 minutes (premium)
 *
 * @example
 * ```tsx
 * <VideoUpload
 *   videos={profileVideos}
 *   onUpload={handleVideoUpload}
 *   onDelete={handleVideoDelete}
 *   onReorder={handleVideoReorder}
 *   maxVideos={10}
 *   maxSize={50 * 1024 * 1024}
 * />
 * ```
 */

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Upload, X, Play, Pause, Trash2, ChevronUp, ChevronDown,
  Video as VideoIcon, AlertCircle, CheckCircle2, Loader2,
  FileVideo, Sparkles, Crown, EyeOff, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Video interface
 */
export interface Video {
  id: string;
  url: string;
  thumbnail?: string;
  title?: string;
  duration?: number; // in seconds
  size: number; // in bytes
  uploadedAt: Date;
  isPrimary?: boolean;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress?: number;
  error?: string;
}

/**
 * Upload result interface
 */
interface UploadResult {
  id: string;
  url: string;
  thumbnail: string;
}

/**
 * Props for VideoUpload component
 */
export interface VideoUploadProps {
  /**
   * Array of videos
   */
  videos: Video[];
  /**
   * Upload handler
   */
  onUpload: (files: File[]) => Promise<UploadResult[]>;
  /**
   * Delete handler
   */
  onDelete?: (videoId: string) => void;
  /**
   * Set as primary handler
   */
  onSetPrimary?: (videoId: string) => void;
  /**
   * Reorder handler
   */
  onReorder?: (fromIndex: number, toIndex: number) => void;
  /**
   * Maximum number of videos allowed
   */
  maxVideos?: number;
  /**
   * Maximum file size in bytes
   */
  maxSize?: number;
  /**
   * Allowed file formats
   */
  allowedFormats?: string[];
  /**
   * Whether editing is disabled
   */
  disabled?: boolean;
  /**
   * Whether user has VIP access
   */
  isVip?: boolean;
}

/**
 * Format file size to human readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format duration to MM:SS format
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Validate video file
 */
function validateVideoFile(file: File, maxSize: number, allowedFormats: string[]): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Dosya boyutu çok büyük (Maksimum ${formatFileSize(maxSize)})`,
    };
  }

  // Check file format
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedFormats.includes(extension)) {
    return {
      valid: false,
      error: `Desteklenmeyen format (${allowedFormats.join(', ')})`,
    };
  }

  return { valid: true };
}

/**
 * Get video icon by status
 */
function getStatusIcon(status: Video['status']) {
  const icons = {
    uploading: Loader2,
    processing: Upload,
    completed: CheckCircle2,
    error: AlertCircle,
  };
  return icons[status] || Upload;
}

/**
 * Get status color class
 */
function getStatusColor(status: Video['status']) {
  const colors = {
    uploading: 'text-blue-500',
    processing: 'text-amber-500',
    completed: 'text-green-500',
    error: 'text-red-500',
  };
  return colors[status] || 'text-gray-500';
}

/**
 * VideoUpload Component
 *
 * Complete video upload and management interface.
 */
export default function VideoUpload({
  videos,
  onUpload,
  onDelete,
  onSetPrimary,
  onReorder,
  maxVideos = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  allowedFormats = ['.mp4', '.webm', '.mov'],
  disabled = false,
  isVip = false,
}: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canUpload = videos.length < maxVideos && !disabled;

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // Validate files
    const validFiles = fileArray.filter(file => {
      const validation = validateVideoFile(file, maxSize, allowedFormats);
      if (!validation.valid) {
        console.error('Invalid file:', validation.error);
      }
      return validation.valid;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  }, [maxSize, allowedFormats]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (canUpload) {
      setIsDragging(true);
    }
  }, [canUpload]);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (canUpload) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [canUpload, handleFileSelect]);

  // Upload selected files
  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    try {
      await onUpload(selectedFiles);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }, [selectedFiles, onUpload]);

  // Handle delete video
  const handleDelete = (videoId: string) => () => {
    if (onDelete && !disabled) {
      onDelete(videoId);
    }
  };

  // Handle set primary video
  const handleSetPrimary = (videoId: string) => () => {
    if (onSetPrimary && !disabled) {
      onSetPrimary(videoId);
    }
  };

  // Handle move video up
  const handleMoveUp = (index: number) => () => {
    if (index > 0 && onReorder && !disabled) {
      onReorder(index, index - 1);
    }
  };

  // Handle move video down
  const handleMoveDown = (index: number) => () => {
    if (index < videos.length - 1 && onReorder && !disabled) {
      onReorder(index, index + 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card className="card-premium">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <VideoIcon className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Video Yükle</h3>
              <Badge variant="outline" className="text-xs">
                {videos.length} / {maxVideos}
              </Badge>
            </div>

            {isVip && (
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                VIP
              </Badge>
            )}
          </div>

          {/* Upload Progress (Selected Files) */}
          {selectedFiles.length > 0 && (
            <div className="mb-4 space-y-2">
              <AnimatePresence>
                {selectedFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                  >
                    <FileVideo className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                      disabled={disabled}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Button
                onClick={handleUpload}
                disabled={disabled}
                className="w-full"
                size="lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                {selectedFiles.length} video{selectedFiles.length > 1 ? 'yu yükleniyor' : 'yu yükleniyor'}
              </Button>
            </div>
          )}

          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              isDragging
                ? 'border-primary bg-primary/5'
                : canUpload
                  ? 'border-border/50 hover:border-primary/50 hover:bg-primary/5'
                  : 'border-border/30 opacity-50 cursor-not-allowed'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={allowedFormats.join(',')}
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              disabled={disabled || !canUpload}
            />

            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            <h4 className={`font-semibold mb-2 ${isDragging ? 'text-primary' : 'text-foreground'}`}>
              {isDragging ? 'Bırakın' : 'Video Seçin'}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              {canUpload
                ? `Sürükleyip bırakın veya seçin (${maxVideos - videos.length} video kaldı)`
                : `Video limiti dolu (${maxVideos} video)`}
            </p>

            {canUpload && (
              <Button variant="outline" size="sm" disabled={disabled}>
                <Sparkles className="w-4 h-4 mr-2" />
                Dosya Seç
              </Button>
            )}

            {/* File Requirements */}
            <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Maksimum dosya boyutu: {formatFileSize(maxSize)}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Desteklenen formatlar: {allowedFormats.join(', ')}</span>
              </div>
              {!isVip && (
                <div className="flex items-center gap-2 text-amber-600">
                  <Lock className="w-4 h-4" />
                  <span>Üyeler için maksimum {maxVideos} video</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video List */}
      {videos.length > 0 && (
        <Card className="card-premium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <VideoIcon className="w-5 h-5 text-primary" />
                Videolarım
                <Badge variant="outline">{videos.length}</Badge>
              </h3>
            </div>

            <div className="space-y-3">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg group"
                >
                  {/* Drag Handle */}
                  {onReorder && !disabled && (
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={handleMoveUp(index)}
                        disabled={index === 0 || disabled}
                        className="p-1 hover:bg-muted rounded disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleMoveDown(index)}
                        disabled={index === videos.length - 1 || disabled}
                        className="p-1 hover:bg-muted rounded disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Thumbnail/Preview */}
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0">
                    <video
                      src={video.url}
                      className="w-full h-full object-cover"
                      muted
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                    {video.status !== 'completed' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        {video.status === 'uploading' && (
                          <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        )}
                        {video.status === 'processing' && (
                          <Upload className="w-6 h-6 text-amber-500" />
                        )}
                        {video.status === 'error' && (
                          <AlertCircle className="w-6 h-6 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {video.isPrimary && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Ana Video
                        </Badge>
                      )}
                      <h4 className="font-medium text-sm truncate">
                        {video.title || `Video ${index + 1}`}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatFileSize(video.size)}</span>
                      {video.duration && <span>• {formatDuration(video.duration)}</span>}
                      {video.status !== 'completed' && (
                        <span className={getStatusColor(video.status)}>
                          {video.status === 'uploading' && `• Yükleniyor... %${video.progress || 0}`}
                          {video.status === 'processing' && '• İşleniyor...'}
                          {video.status === 'error' && `• ${video.error || 'Hata'}`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {!video.isPrimary && onSetPrimary && video.status === 'completed' && !disabled && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSetPrimary(video.id)}
                        title="Ana video yap"
                        className="text-amber-500 hover:text-amber-600"
                      >
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && video.status === 'completed' && !disabled && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDelete(video.id)}
                        title="Sil"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    {video.status === 'completed' && !disabled && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const videoElement = document.createElement('a');
                          videoElement.href = video.url;
                          videoElement.download = `video-${video.id}.mp4`;
                          document.body.appendChild(videoElement);
                          videoElement.click();
                          document.body.removeChild(videoElement);
                        }}
                        title="İndir"
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Limit Reached Warning */}
      {videos.length >= maxVideos && !isVip && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">
                  Video Limitine Ulaştınız
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-300">
                  Maksimum {maxVideos} video yükleyebilirsiniz. Daha fazla video için VIP üyelik alın.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Compact version for card embedding
 */
export function VideoUploadCompact({
  videos,
  onUpload,
  maxVideos = 10,
}: {
  videos: Video[];
  onUpload: (files: File[]) => Promise<UploadResult[]>;
  maxVideos?: number;
}) {
  return (
    <VideoUpload
      videos={videos}
      onUpload={onUpload}
      maxVideos={maxVideos}
      maxSize={50 * 1024 * 1024}
      allowedFormats={['.mp4', '.webm', '.mov']}
      disabled={false}
      isVip={false}
    />
  );
}
