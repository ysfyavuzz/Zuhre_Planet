/**
 * PhotoGalleryEnhanced Component
 *
 * Advanced photo gallery with fullscreen lightbox, slideshow, and editing capabilities.
 * Provides immersive viewing experience with keyboard navigation and sharing options.
 *
 * @module components/PhotoGalleryEnhanced
 * @category Components - Media
 *
 * Features:
 * - Fullscreen lightbox viewer
 * - Keyboard navigation (ESC, Arrow keys, Space)
 * - Auto slideshow with play/pause
 * - Image zoom and pan
 * - Photo sharing (copy link, social media)
 * - Photo download
 * - Photo information (date, views, likes)
 * - Delete/edit buttons for escort users
 * - Thumbnail navigation
 * - Progress indicator
 * - Lazy loading optimization
 *
 * Keyboard Shortcuts:
 * - ESC: Close lightbox
 * - Left/Right Arrows: Navigate photos
 * - Space: Play/Pause slideshow
 * - F: Toggle fullscreen
 * - I: Toggle info panel
 * - S: Share photo
 * - D: Download photo
 *
 * @example
 * ```tsx
 * // Basic usage
 * <PhotoGalleryEnhanced
 *   photos={profilePhotos}
 *   initialIndex={0}
 *   isOpen={isGalleryOpen}
 *   onClose={() => setIsGalleryOpen(false)}
 * />
 *
 * // With editing capabilities
 * <PhotoGalleryEnhanced
 *   photos={myPhotos}
 *   canEdit={true}
 *   onDelete={handleDelete}
 *   onReorder={handleReorder}
 * />
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X, ChevronLeft, ChevronRight, Download, Share2, Heart,
  Eye, Play, Pause, ZoomIn, ZoomOut, RotateCw, Trash2,
  Edit, Calendar, MessageCircle, Copy, Check, Facebook,
  Twitter, Instagram, Link2, Info, Maximize2, Minimize2,
  ExternalLink, Star
} from 'lucide-react';

/**
 * Photo metadata interface
 */
export interface Photo {
  id: string;
  url: string;
  thumbnail?: string;
  caption?: string;
  date?: string;
  views?: number;
  likes?: number;
  isPrimary?: boolean;
}

/**
 * Props for PhotoGalleryEnhanced component
 */
export interface PhotoGalleryEnhancedProps {
  /**
   * Array of photos to display
   */
  photos: Photo[];
  /**
   * Initial photo index
   */
  initialIndex?: number;
  /**
   * Whether lightbox is open
   */
  isOpen: boolean;
  /**
   * Close callback
   */
  onClose: () => void;
  /**
   * Whether user can edit/delete photos
   */
  canEdit?: boolean;
  /**
   * Delete callback
   */
  onDelete?: (photoId: string) => void;
  /**
   * Set as primary callback
   */
  onSetPrimary?: (photoId: string) => void;
  /**
   * Whether to show sharing options
   */
  showShare?: boolean;
  /**
   * Whether to show download button
   */
  showDownload?: boolean;
}

/**
 * Share platform options
 */
type SharePlatform = 'link' | 'facebook' | 'twitter' | 'whatsapp' | 'email';

/**
 * PhotoGalleryEnhanced Component
 *
 * Full-featured photo gallery with lightbox and editing capabilities.
 */
export default function PhotoGalleryEnhanced({
  photos,
  initialIndex = 0,
  isOpen,
  onClose,
  canEdit = false,
  onDelete,
  onSetPrimary,
  showShare = true,
  showDownload = true,
}: PhotoGalleryEnhancedProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [slideshowSpeed, setSlideshowSpeed] = useState(3000); // 3 seconds

  const containerRef = useRef<HTMLDivElement>(null);
  const slideshowTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Current photo
  const currentPhoto = photos[currentIndex];
  const totalPhotos = photos.length;

  // Reset to initial index when isOpen changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoomLevel(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  // Slideshow effect
  useEffect(() => {
    if (isPlaying) {
      slideshowTimerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalPhotos);
      }, slideshowSpeed);
    } else {
      if (slideshowTimerRef.current) {
        clearInterval(slideshowTimerRef.current);
      }
    }

    return () => {
      if (slideshowTimerRef.current) {
        clearInterval(slideshowTimerRef.current);
      }
    };
  }, [isPlaying, slideshowSpeed, totalPhotos]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'i':
        case 'I':
          setShowInfo((prev) => !prev);
          break;
        case 's':
        case 'S':
          setShowShareMenu((prev) => !prev);
          break;
        case 'd':
        case 'D':
          if (showDownload) {
            handleDownload();
          }
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
        case '_':
          handleZoomOut();
          break;
        case '0':
          resetZoom();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, totalPhotos, showDownload]);

  const goToNext = useCallback(() => {
    if (currentIndex < totalPhotos - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetZoom();
    } else if (isPlaying) {
      // Loop slideshow
      setCurrentIndex(0);
      resetZoom();
    }
  }, [currentIndex, totalPhotos, isPlaying]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetZoom();
    }
  }, [currentIndex]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 1));
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleDownload = () => {
    if (!currentPhoto) return;

    const link = document.createElement('a');
    link.href = currentPhoto.url;
    link.download = `photo-${currentPhoto.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (platform: SharePlatform) => {
    if (!currentPhoto) return;

    const url = window.location.href.split('?')[0] + `?photo=${currentPhoto.id}`;
    const text = `Check out this photo!`;

    switch (platform) {
      case 'link':
        await navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=Check out this photo&body=${encodeURIComponent(url)}`;
        break;
    }

    setShowShareMenu(false);
  };

  const handleDelete = () => {
    if (!currentPhoto || !onDelete) return;
    if (confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) {
      onDelete(currentPhoto.id);
      if (currentIndex >= totalPhotos - 1) {
        setCurrentIndex(Math.max(0, totalPhotos - 2));
      }
    }
  };

  const handleSetPrimary = () => {
    if (!currentPhoto || !onSetPrimary) return;
    onSetPrimary(currentPhoto.id);
  };

  // Mouse drag for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen || !currentPhoto) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
        ref={containerRef}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Top Bar - Close and Actions */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Photo Counter */}
            <div className="text-white font-medium">
              <span className="text-lg">{currentIndex + 1}</span>
              <span className="text-white/60 mx-1">/</span>
              <span className="text-white/60">{totalPhotos}</span>
            </div>

            {/* Top Actions */}
            <div className="flex items-center gap-2">
              {/* Primary Badge */}
              {currentPhoto.isPrimary && (
                <Badge className="bg-amber-500 text-white border-0">
                  <Star className="w-3 h-3 mr-1" />
                  Ana Fotoğraf
                </Badge>
              )}

              {/* Share Button */}
              {showShare && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="text-white hover:text-white/80"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>

                  {/* Share Dropdown */}
                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-12 bg-popover border border-border rounded-lg shadow-xl p-2 min-w-[200px]"
                      >
                        <button
                          onClick={() => handleShare('link')}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Link2 className="w-4 h-4" />
                          {copiedLink ? (
                            <>
                              <Check className="w-4 h-4 text-green-500" />
                              <span className="text-sm">Kopyalandı!</span>
                            </>
                          ) : (
                            <span className="text-sm">Linki Kopyala</span>
                          )}
                        </button>
                        <button
                          onClick={() => handleShare('facebook')}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Facebook className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Facebook</span>
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Twitter className="w-4 h-4 text-sky-500" />
                          <span className="text-sm">Twitter</span>
                        </button>
                        <button
                          onClick={() => handleShare('whatsapp')}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">WhatsApp</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Download Button */}
              {showDownload && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  className="text-white hover:text-white/80"
                  title="İndir (D)"
                >
                  <Download className="w-5 h-5" />
                </Button>
              )}

              {/* Fullscreen Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-white hover:text-white/80"
                title="Tam Ekran (F)"
              >
                <Maximize2 className="w-5 h-5" />
              </Button>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:text-white/80"
                title="Kapat (ESC)"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Image Area */}
        <div
          className="absolute inset-0 flex items-center justify-center p-4"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          <div className="relative max-w-full max-h-full">
            {/* Image */}
            <motion.img
              src={currentPhoto.url}
              alt={currentPhoto.caption || `Photo ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain select-none cursor-grab active:cursor-grabbing"
              style={{
                transform: `scale(${zoomLevel}) translate(${pan.x / zoomLevel}px, ${pan.y / zoomLevel}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              }}
              drag={zoomLevel > 1}
              dragMomentum={false}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={currentIndex}
            />

            {/* Caption */}
            {currentPhoto.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white text-center text-sm">{currentPhoto.caption}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
          title="Önceki (←)"
        >
          <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={goToNext}
          disabled={currentIndex === totalPhotos - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
          title="Sonraki (→)"
        >
          <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        {/* Bottom Bar - Controls and Info */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="max-w-7xl mx-auto">
            {/* Thumbnail Strip */}
            <div className="flex items-center justify-center gap-2 mb-4 overflow-x-auto pb-2">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => {
                    setCurrentIndex(index);
                    resetZoom();
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-white scale-110 shadow-lg'
                      : 'border-white/30 hover:border-white/60 hover:scale-105'
                  }`}
                >
                  <img
                    src={photo.thumbnail || photo.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {/* Play/Pause Slideshow */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying((prev) => !prev)}
                className="text-white hover:text-white/80"
                title={isPlaying ? 'Duraklat (Space)' : 'Oynat (Space)'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 mr-2" />
                ) : (
                  <Play className="w-5 h-5 mr-2" />
                )}
                {isPlaying ? 'Duraklat' : 'Slayt Gösterisi'}
              </Button>

              {/* Speed Control */}
              {isPlaying && (
                <div className="flex items-center gap-1 bg-black/30 rounded-lg p-1">
                  {[2000, 3000, 5000].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setSlideshowSpeed(speed)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        slideshowSpeed === speed
                          ? 'bg-white text-black'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {speed / 1000}s
                    </button>
                  ))}
                </div>
              )}

              {/* Zoom Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="text-white hover:text-white/80"
                  title="Uzaklaştır (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-white text-sm min-w-[3rem] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="text-white hover:text-white/80"
                  title="Yaklaştır (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                {zoomLevel > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetZoom}
                    className="text-white hover:text-white/80"
                    title="Sıfırla (0)"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Info Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowInfo((prev) => !prev)}
                className={`text-white hover:text-white/80 ${showInfo ? 'bg-white/20' : ''}`}
                title="Bilgi (I)"
              >
                <Info className="w-5 h-5" />
              </Button>

              {/* Edit Actions (Escort Only) */}
              {canEdit && (
                <>
                  {!currentPhoto.isPrimary && onSetPrimary && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSetPrimary}
                      className="text-amber-400 hover:text-amber-300"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Ana Yap
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDelete}
                      className="text-red-400 hover:text-red-300"
                      title="Sil"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Photo Info Panel */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 bg-black/50 backdrop-blur-sm rounded-lg p-4"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-white/60" />
                      <span>{currentPhoto.views || 0} görüntülenme</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-white/60" />
                      <span>{currentPhoto.likes || 0} beğeni</span>
                    </div>
                    {currentPhoto.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white/60" />
                        <span>{new Date(currentPhoto.date).toLocaleDateString('tr-TR')}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-white/60" />
                      <span className="text-white/60">ID: {currentPhoto.id}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Keyboard Shortcuts Hint */}
            <div className="text-center text-white/50 text-xs mt-2">
              <span className="hidden md:inline">
                ESC: Kapat | ← →: Gezin | Space: Oynat | F: Tam Ekran | I: Bilgi | S: Paylaş | D: İndir | +/-: Yakınlaştır
              </span>
              <span className="md:hidden">
                Kaydırarak gezin
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar (Slideshow) */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              exit={{ width: 0 }}
              transition={{ duration: slideshowSpeed / 1000, ease: 'linear' }}
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary to-accent"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
