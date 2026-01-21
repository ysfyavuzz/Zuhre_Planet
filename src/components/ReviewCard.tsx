/**
 * Review Card Component
 *
 * Displays a single review with rating, criteria, photos, and actions.
 * Supports response from escort and helpful voting.
 *
 * @module components/ReviewCard
 * @category Components - Reviews
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  StarHalf,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Flag,
  Share2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  User,
  Image as ImageIcon,
  Calendar,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Review, ReviewCriteria, REVIEW_CRITERIA_INFO } from '@/types/reviewsExtended';
import { Rating, RatingSummary } from './Rating';

interface ReviewCardProps {
  review: Review;
  showEscortInfo?: boolean;
  showFullContent?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
  onMarkHelpful?: () => void;
  onMarkNotHelpful?: () => void;
  onResponse?: (reviewId: string) => void;
  className?: string;
}

export function ReviewCard({
  review,
  showEscortInfo = true,
  showFullContent = true,
  onEdit,
  onDelete,
  onReport,
  onMarkHelpful,
  onMarkNotHelpful,
  onResponse,
  className = '',
}: ReviewCardProps) {
  const [showFullText, setShowFullText] = useState(false);
  const [showResponse, setShowResponse] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [voting, setVoting] = useState<'helpful' | 'notHelpful' | null>(null);

  const isLongContent = review.content.length > 200;
  const displayedContent = showFullContent || !isLongContent
    ? review.content
    : review.content.substring(0, 200) + '...';

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: tr });
  };

  const handleHelpful = () => {
    if (voting) return;
    setVoting('helpful');
    onMarkHelpful?.();
  };

  const handleNotHelpful = () => {
    if (voting) return;
    setVoting('notHelpful');
    onMarkNotHelpful?.();
  };

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header - User info and rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-lg shrink-0">
            {review.customerAvatar ? (
              <img
                src={review.customerAvatar}
                alt={review.customerName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              review.customerName.charAt(0).toUpperCase()
            )}
          </div>

          {/* User info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{review.customerName}</h4>
              {review.isVerifiedBooking && (
                <Badge className="bg-green-500 text-white text-xs" variant="secondary">
                  <Shield className="w-3 h-3 mr-1" />
                  Onaylı Randevu
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Rating value={review.rating} readonly size="sm" />
              <span>•</span>
              <span>{formatTime(review.createdAt)}</span>
              {review.serviceDate && (
                <>
                  <span>•</span>
                  <span>Hizmet: {formatTime(review.serviceDate)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status badge */}
        {review.status !== 'approved' && (
          <Badge variant="outline" className="ml-2">
            {review.status === 'pending' && 'Beklemede'}
            {review.status === 'rejected' && 'Reddedildi'}
          </Badge>
        )}
      </div>

      {/* Title */}
      {review.title && (
        <h3 className="font-bold text-lg mb-2">{review.title}</h3>
      )}

      {/* Content */}
      <p className="text-muted-foreground mb-4">
        {displayedContent}
        {isLongContent && !showFullText && (
          <button
            onClick={() => setShowFullText(true)}
            className="text-primary hover:underline ml-2"
          >
            Devamını Oku
          </button>
        )}
      </p>

      {/* Tags */}
      {review.tags && review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {review.tags.map((tag) => {
            const tagInfo = Object.values(REVIEW_CRITERIA_INFO).find(t => t.label === tag);
            return (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="flex gap-2 mb-4">
          {review.photos.map((photo) => (
            <div
              key={photo.id}
              className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0"
            >
              <img
                src={photo.url}
                alt={photo.caption || 'Review photo'}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Criteria Breakdown */}
      <div className="mb-4 p-4 bg-muted/20 rounded-lg">
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
          Detaylı Puanlar
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.entries(review.criteria) as Array<[string, number]>).map(([key, value]) => {
            const info = REVIEW_CRITERIA_INFO[key as keyof typeof REVIEW_CRITERIA_INFO];
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-lg">{info?.icon}</span>
                <span className="text-sm">{info?.label}:</span>
                <span className="text-sm font-bold text-yellow-600">{value}.0</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Escort info (optional) */}
      {showEscortInfo && (
        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold">
            {review.escortName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">{review.escortName}</p>
            <p className="text-xs text-muted-foreground">Escort</p>
          </div>
        </div>
      )}

      {/* Response from escort */}
      {review.response && (
        <div className="mb-4">
          <button
            onClick={() => setShowResponse(!showResponse)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <MessageCircle className="w-4 h-4" />
            Escort Yanıtı
            {showResponse ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence>
            {showResponse && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                  <p className="text-sm">{review.response.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatTime(review.response.createdAt)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Helpful voting */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHelpful}
              disabled={voting !== null}
              className={`h-8 px-2 ${voting === 'helpful' ? 'bg-green-100 text-green-700' : ''}`}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              {review.helpfulCount}
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNotHelpful}
              disabled={voting !== null}
              className={`h-8 px-2 ${voting === 'notHelpful' ? 'bg-red-100 text-red-700' : ''}`}
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              {review.notHelpfulCount}
            </Button>
          </div>

          {/* More actions */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(!showActions)}
            >
              <Share2 className="w-4 h-4" />
            </Button>

            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-10 bg-background border rounded-lg shadow-xl z-10 overflow-hidden min-w-[150px]"
                >
                  <div className="p-1">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Share2 className="w-4 h-4 mr-2" />
                      Paylaş
                    </Button>
                    {onReport && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-red-600"
                        onClick={() => {
                          onReport();
                          setShowActions(false);
                        }}
                      >
                        <Flag className="w-4 h-4 mr-2" />
                        Bildir
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Edit/Delete for own reviews */}
        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit}>
                Düzenle
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" className="text-red-600" onClick={onDelete}>
                Sil
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export { ReviewCard as default };
