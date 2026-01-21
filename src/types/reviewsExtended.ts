/**
 * Review Types
 *
 * Type definitions for the rating and review system.
 * Supports multi-criteria ratings, photos, and moderation.
 *
 * @module types/reviews
 * @category Types
 */

/**
 * Review status in moderation workflow
 */
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

/**
 * Rating scale (1-5 stars)
 */
export type RatingValue = 1 | 2 | 3 | 4 | 5;

/**
 * Base review interface
 */
export interface Review {
  id: string;
  escortId: string;
  escortName: string;
  escortAvatar?: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  isVerifiedBooking: boolean; // From a real booking
  rating: RatingValue;
  criteria: ReviewCriteria;
  title: string;
  content: string;
  photos?: ReviewPhoto[];
  tags?: string[];
  status: ReviewStatus;
  createdAt: Date;
  updatedAt?: Date;
  moderatedAt?: Date;
  moderatedBy?: string;
  response?: ReviewResponse;
  helpfulCount: number;
  notHelpfulCount: number;
  reportCount: number;
  bookingId?: string;
  serviceDate?: Date;
}

/**
 * Multi-criteria ratings for detailed reviews
 */
export interface ReviewCriteria {
  appearance: RatingValue;      // Görünüş
  attitude: RatingValue;        // Tutum
  service: RatingValue;         // Hizmet kalitesi
  punctuality: RatingValue;     // Zamanlama
  location: RatingValue;        // Mekan hijyeni
}

/**
 * Review response from escort
 */
export interface ReviewResponse {
  id: string;
  reviewId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Review photo with moderation status
 */
export interface ReviewPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  status: 'pending' | 'approved' | 'rejected';
  moderationNote?: string;
}

/**
 * Review tag/predefined label
 */
export interface ReviewTag {
  id: string;
  label: string;
  icon?: string;
  category: 'positive' | 'negative' | 'neutral';
}

/**
 * Review statistics for an escort
 */
export interface ReviewStats {
  total: number;
  average: number;
  distribution: Record<RatingValue, number>; // Count per star rating
  criteriaAverages: ReviewCriteria;
  verifiedCount: number;
  withPhotosCount: number;
  lastMonthCount: number;
  lastSixMonthsCount: number;
}

/**
 * Review report for flagging inappropriate content
 */
export interface ReviewReport {
  id: string;
  reviewId: string;
  reporterId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  resolution?: string;
}

/**
 * Review draft for auto-save functionality
 */
export interface ReviewDraft {
  bookingId?: string;
  escortId: string;
  rating: RatingValue | null;
  criteria: Partial<ReviewCriteria>;
  title: string;
  content: string;
  photos: ReviewPhoto[];
  tags: string[];
  timestamp: Date;
}

/**
 * Review filter options
 */
export interface ReviewFilters {
  escortId?: string;
  customerId?: string;
  minRating?: RatingValue;
  maxRating?: RatingValue;
  hasPhotos?: boolean;
  isVerified?: boolean;
  status?: ReviewStatus;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
}

/**
 * Aggregated review data for display
 */
export interface AggregatedReviews {
  stats: ReviewStats;
  reviews: Review[];
  filters: ReviewFilters;
  totalCount: number;
}

/**
 * Review summary for quick display
 */
export interface ReviewSummary {
  escortId: string;
  averageRating: number;
  totalReviews: number;
  verifiedCount: number;
  topTags: string[];
  recentReviews: Review[];
}

/**
 * Predefined review tags
 */
export const REVIEW_TAGS: ReviewTag[] = [
  // Positive
  { id: 'professional', label: 'Profesyonel', icon: '💼', category: 'positive' },
  { id: 'friendly', label: 'Samimi', icon: '😊', category: 'positive' },
  { id: 'punctual', label: 'Zamanında', icon: '⏰', category: 'positive' },
  { id: 'beautiful', label: 'Güzel', icon: '💖', category: 'positive' },
  { id: 'clean', label: 'Hijyenik', icon: '✨', category: 'positive' },
  { id: 'skilled', label: 'Uzman', icon: '🎯', category: 'positive' },
  { id: 'passionate', label: 'Tutkulu', icon: '🔥', category: 'positive' },
  { id: 'relaxing', label: 'Rahatlatıcı', icon: '😌', category: 'positive' },
  { id: 'excellent-service', label: 'Mükemmel Hizmet', icon: '⭐', category: 'positive' },
  { id: 'recommended', label: 'Tavsiye Ediyorum', icon: '👍', category: 'positive' },

  // Negative
  { id: 'late', label: 'Geç Kaldı', icon: '⏰', category: 'negative' },
  { id: 'rude', label: 'Kaba', icon: '😠', category: 'negative' },
  { id: 'no-show', label: 'Gelmedi', icon: '❌', category: 'negative' },
  { id: 'inaccurate', label: 'Fotoğrafla Uyumlu Değil', icon: '📷', category: 'negative' },
  { id: 'unprofessional', label: 'Profesyonel Değil', icon: '⚠️', category: 'negative' },

  // Neutral
  { id: 'okay', label: 'İdare Eder', icon: '😐', category: 'neutral' },
  { id: 'average', label: 'Orta', icon: '📊', category: 'neutral' },
];

/**
 * Review criteria descriptions
 */
export const REVIEW_CRITERIA_INFO = {
  appearance: {
    label: 'Görünüş',
    description: 'Fotoğrafla uyumlu mu?',
    icon: '👤',
  },
  attitude: {
    label: 'Tutum',
    description: 'İlgili ve samimi mi?',
    icon: '💝',
  },
  service: {
    label: 'Hizmet Kalitesi',
    description: 'Beklentileri karşılıyor mu?',
    icon: '⭐',
  },
  punctuality: {
    label: 'Zamanlama',
    description: 'Randevu saatine uydu mu?',
    icon: '⏰',
  },
  location: {
    label: 'Mekan',
    description: 'Temiz ve konforlu mu?',
    icon: '🏠',
  },
} as const;

/**
 * Review validation rules
 */
export const REVIEW_VALIDATION = {
  title: {
    minLength: 5,
    maxLength: 100,
    required: true,
  },
  content: {
    minLength: 20,
    maxLength: 2000,
    required: true,
  },
  photos: {
    maxCount: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  tags: {
    maxCount: 5,
  },
  response: {
    minLength: 10,
    maxLength: 1000,
  },
} as const;

/**
 * Helper to calculate overall rating from criteria
 */
export function calculateOverallRating(criteria: ReviewCriteria): number {
  const values = Object.values(criteria);
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

/**
 * Helper to format rating
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Helper to get star count for display
 */
export function getStarCount(rating: number): number {
  return Math.round(rating);
}

/**
 * Default review criteria values
 */
export const DEFAULT_REVIEW_CRITERIA: ReviewCriteria = {
  appearance: 5,
  attitude: 5,
  service: 5,
  punctuality: 5,
  location: 5,
};

/**
 * Sample reviews for testing
 */
export const SAMPLE_REVIEWS: Review[] = [
  {
    id: '1',
    escortId: 'escort-1',
    escortName: 'Ayşe Yılmaz',
    customerId: 'customer-1',
    customerName: 'Mehmet K.',
    isVerifiedBooking: true,
    rating: 5,
    criteria: {
      appearance: 5,
      attitude: 5,
      service: 5,
      punctuality: 5,
      location: 5,
    },
    title: 'Mükemmel deneyim!',
    content: 'Gerçekten harika bir deneyimdi. Ayşe hanım çok samimi ve ilgili. Tüm detaylara dikkat ediyor, kesinlikle tavsiye ederim.',
    tags: ['professional', 'friendly', 'punctual', 'recommended'],
    status: 'approved',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    helpfulCount: 24,
    notHelpfulCount: 1,
    reportCount: 0,
    serviceDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    response: {
      id: 'resp-1',
      reviewId: '1',
      content: 'Teşekkür ederim Mehmet bey! Geri bildiriminiz beni çok mutlu etti. Sizi tekrar beklerim 💖',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000),
    },
  },
  {
    id: '2',
    escortId: 'escort-1',
    escortName: 'Ayşe Yılmaz',
    customerId: 'customer-2',
    customerName: 'Ahmet Y.',
    isVerifiedBooking: true,
    rating: 4,
    criteria: {
      appearance: 4,
      attitude: 5,
      service: 4,
      punctuality: 5,
      location: 5,
    },
    title: 'İyi',
    content: 'Genel olarak memnun kaldım. Güler yüzüyle karşılandı ve zamanında geldi. Mekan da temizdi.',
    tags: ['friendly', 'punctual', 'clean'],
    status: 'approved',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    helpfulCount: 12,
    notHelpfulCount: 2,
    reportCount: 0,
    serviceDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

/**
 * Helper to validate if review can be submitted
 */
export function canSubmitReview(
  review: Partial<Review>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!review.rating) {
    errors.push('Puan gereklidir');
  }
  if (!review.title || review.title.length < REVIEW_VALIDATION.title.minLength) {
    errors.push(`Başlık en az ${REVIEW_VALIDATION.title.minLength} karakter olmalıdır`);
  }
  if (!review.content || review.content.length < REVIEW_VALIDATION.content.minLength) {
    errors.push(`İçerik en az ${REVIEW_VALIDATION.content.minLength} karakter olmalıdır`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

