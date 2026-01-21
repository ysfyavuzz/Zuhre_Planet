/**
 * useReviews Hook
 *
 * Manages reviews, ratings, and review submissions.
 * Integrates with multi-criteria rating system.
 *
 * @module hooks/useReviews
 * @category Hooks
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Review,
  ReviewStats,
  ReviewFilters,
  ReviewCriteria,
  RatingValue,
  ReviewResponse,
  ReviewDraft,
  canSubmitReview,
  calculateOverallRating,
  DEFAULT_REVIEW_CRITERIA,
  SAMPLE_REVIEWS,
} from '@/types/reviewsExtended';

interface UseReviewsOptions {
  escortId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onReviewSubmitted?: (review: Review) => void;
  onReviewUpdated?: (review: Review) => void;
  onError?: (error: Error) => void;
}

interface UseReviewsReturn {
  // State
  reviews: Review[];
  stats: ReviewStats;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;

  // Draft
  draft: ReviewDraft | null;
  setDraft: (draft: ReviewDraft | null) => void;

  // Actions - Reviews
  loadReviews: (filters?: Partial<ReviewFilters>) => Promise<void>;
  loadMoreReviews: () => Promise<void>;
  submitReview: (review: Partial<Review>) => Promise<Review>;
  updateReview: (reviewId: string, updates: Partial<Review>) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  reportReview: (reviewId: string, reason: string, description?: string) => Promise<void>;

  // Actions - Helpful
  markHelpful: (reviewId: string) => Promise<void>;
  markNotHelpful: (reviewId: string) => Promise<void>;

  // Actions - Response
  submitResponse: (reviewId: string, content: string) => Promise<ReviewResponse>;
  updateResponse: (responseId: string, content: string) => Promise<void>;
  deleteResponse: (responseId: string) => Promise<void>;

  // Actions - Filters
  setFilters: (filters: Partial<ReviewFilters>) => void;
  clearFilters: () => void;
  sortReviews: (sortBy: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful') => void;
}

export function useReviews(options: UseReviewsOptions = {}): UseReviewsReturn {
  const {
    escortId,
    autoRefresh = false,
    refreshInterval = 60000,
    onReviewSubmitted,
    onReviewUpdated,
    onError,
  } = options;

  // State
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [filters, setFiltersState] = useState<ReviewFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [draft, setDraftState] = useState<ReviewDraft | null>(null);
  const [totalCount, setTotalCount] = useState(SAMPLE_REVIEWS.length);

  // Calculate stats from reviews
  const stats: ReviewStats = useMemo(() => {
    const allReviews = escortId
      ? reviews.filter(r => r.escortId === escortId)
      : reviews;

    const total = allReviews.length;
    const verifiedCount = allReviews.filter(r => r.isVerifiedBooking).length;
    const withPhotosCount = allReviews.filter(r => r.photos && r.photos.length > 0).length;

    // Calculate average rating
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    const average = total > 0 ? Math.round((sum / total) * 10) / 10 : 0;

    // Calculate distribution
    const distribution: Record<RatingValue, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    allReviews.forEach(r => {
      distribution[r.rating]++;
    });

    // Calculate criteria averages
    const criteriaSums: Record<keyof ReviewCriteria, number[]> = {
      appearance: [],
      attitude: [],
      service: [],
      punctuality: [],
      location: [],
    };

    allReviews.forEach(r => {
      Object.entries(r.criteria).forEach(([key, value]) => {
        criteriaSums[key as keyof ReviewCriteria]?.push(value);
      });
    });

    const criteriaAverages: ReviewCriteria = {
      appearance: 5,
      attitude: 5,
      service: 5,
      punctuality: 5,
      location: 5,
    };

    Object.entries(criteriaSums).forEach(([key, values]) => {
      if (values.length > 0) {
        const sum = values.reduce((acc, v) => acc + v, 0);
        criteriaAverages[key as keyof ReviewCriteria] = Math.round((sum / values.length) * 10) / 10 as RatingValue;
      }
    });

    // Last month and 6 months counts
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastSixMonths = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());

    const lastMonthCount = allReviews.filter(r => r.createdAt >= lastMonth).length;
    const lastSixMonthsCount = allReviews.filter(r => r.createdAt >= lastSixMonths).length;

    return {
      total,
      average,
      distribution,
      criteriaAverages,
      verifiedCount,
      withPhotosCount,
      lastMonthCount,
      lastSixMonthsCount,
    };
  }, [reviews, escortId]);

  // Load reviews
  const loadReviews = useCallback(async (newFilters?: Partial<ReviewFilters>) => {
    setIsLoading(true);
    setError(null);

    try {
      if (newFilters) {
        setFiltersState(prev => ({ ...prev, ...newFilters }));
      }

      // In production, call API
      // const response = await api.reviews.list({ escortId, ...filters });
      // setReviews(response.reviews);
      // setTotalCount(response.totalCount);
      // setHasMore(response.hasMore);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsLoading(false);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
      setIsLoading(false);
    }
  }, [escortId, filters, onError]);

  // Load more reviews (pagination)
  const loadMoreReviews = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);

    try {
      // In production, call API with offset
      // const response = await api.reviews.list({ escortId, ...filters, offset: reviews.length });
      // setReviews(prev => [...prev, ...response.reviews]);
      // setHasMore(response.hasMore);

      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
      setIsLoading(false);
    }
  }, [hasMore, isLoading, reviews.length, filters, escortId, onError]);

  // Submit review
  const submitReview = useCallback(async (reviewData: Partial<Review>): Promise<Review> => {
    // Validate review
    const validation = canSubmitReview(reviewData);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    // Create review
    const newReview: Review = {
      id: `review-${Date.now()}`,
      escortId: reviewData.escortId || '',
      escortName: reviewData.escortName || '',
      customerId: 'current-user',
      customerName: 'Ben',
      isVerifiedBooking: reviewData.isVerifiedBooking || false,
      rating: reviewData.rating!,
      criteria: reviewData.criteria || DEFAULT_REVIEW_CRITERIA,
      title: reviewData.title!,
      content: reviewData.content!,
      tags: reviewData.tags || [],
      status: 'pending',
      createdAt: new Date(),
      helpfulCount: 0,
      notHelpfulCount: 0,
      reportCount: 0,
      ...reviewData.bookingId && { bookingId: reviewData.bookingId },
      ...reviewData.serviceDate && { serviceDate: reviewData.serviceDate },
    };

    // In production, call API
    // const createdReview = await api.reviews.create(newReview);

    // Update local state
    setReviews(prev => [newReview, ...prev]);
    setTotalCount(prev => prev + 1);

    onReviewSubmitted?.(newReview);

    return newReview;
  }, [onReviewSubmitted]);

  // Update review
  const updateReview = useCallback(async (reviewId: string, updates: Partial<Review>) => {
    // In production, call API
    // await api.reviews.update(reviewId, updates);

    setReviews(prev =>
      prev.map(r =>
        r.id === reviewId
          ? { ...r, ...updates, updatedAt: new Date() }
          : r
      )
    );

    const updatedReview = reviews.find(r => r.id === reviewId);
    if (updatedReview) {
      onReviewUpdated?.(updatedReview);
    }
  }, [reviews, onReviewUpdated]);

  // Delete review
  const deleteReview = useCallback(async (reviewId: string) => {
    // In production, call API
    // await api.reviews.delete(reviewId);

    setReviews(prev => prev.filter(r => r.id !== reviewId));
    setTotalCount(prev => prev - 1);
  }, []);

  // Report review
  const reportReview = useCallback(async (reviewId: string, reason: string, description?: string) => {
    // In production, call API
    // await api.reports.create({ reviewId, reason, description });
    console.log('Review reported:', { reviewId, reason, description });
  }, []);

  // Mark helpful
  const markHelpful = useCallback(async (reviewId: string) => {
    // In production, call API
    // await api.reviews.markHelpful(reviewId);

    setReviews(prev =>
      prev.map(r =>
        r.id === reviewId
          ? { ...r, helpfulCount: r.helpfulCount + 1 }
          : r
      )
    );
  }, []);

  // Mark not helpful
  const markNotHelpful = useCallback(async (reviewId: string) => {
    // In production, call API
    // await api.reviews.markNotHelpful(reviewId);

    setReviews(prev =>
      prev.map(r =>
        r.id === reviewId
          ? { ...r, notHelpfulCount: r.notHelpfulCount + 1 }
          : r
      )
    );
  }, []);

  // Submit response
  const submitResponse = useCallback(async (reviewId: string, content: string): Promise<ReviewResponse> => {
    const response: ReviewResponse = {
      id: `resp-${Date.now()}`,
      reviewId,
      content,
      createdAt: new Date(),
    };

    // In production, call API
    // const createdResponse = await api.reviews.responses.create(reviewId, { content });

    // Update review with response
    setReviews(prev =>
      prev.map(r =>
        r.id === reviewId
          ? { ...r, response }
          : r
      )
    );

    return response;
  }, []);

  // Update response
  const updateResponse = useCallback(async (responseId: string, content: string) => {
    // In production, call API
    // await api.reviews.responses.update(responseId, { content });

    setReviews(prev =>
      prev.map(r => {
        if (r.response?.id === responseId) {
          return {
            ...r,
            response: {
              ...r.response,
              content,
              updatedAt: new Date(),
            },
          };
        }
        return r;
      })
    );
  }, []);

  // Delete response
  const deleteResponse = useCallback(async (responseId: string) => {
    // In production, call API
    // await api.reviews.responses.delete(responseId);

    setReviews(prev =>
      prev.map(r => {
        if (r.response?.id === responseId) {
          const { response, ...rest } = r;
          return rest;
        }
        return r;
      })
    );
  }, []);

  // Set filters
  const setFilters = useCallback((newFilters: Partial<ReviewFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  // Sort reviews
  const sortReviews = useCallback((sortBy: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful') => {
    setReviews(prev => {
      const sorted = [...prev];
      switch (sortBy) {
        case 'newest':
          sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case 'oldest':
          sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
          break;
        case 'highest':
          sorted.sort((a, b) => b.rating - a.rating);
          break;
        case 'lowest':
          sorted.sort((a, b) => a.rating - b.rating);
          break;
        case 'helpful':
          sorted.sort((a, b) => b.helpfulCount - a.helpfulCount);
          break;
      }
      return sorted;
    });
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadReviews();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadReviews]);

  // Save draft
  const setDraft = useCallback((newDraft: ReviewDraft | null) => {
    setDraftState(newDraft);

    // Save to localStorage
    if (newDraft) {
      localStorage.setItem('review-draft', JSON.stringify(newDraft));
    } else {
      localStorage.removeItem('review-draft');
    }
  }, []);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('review-draft');
    if (savedDraft) {
      try {
        setDraftState(JSON.parse(savedDraft));
      } catch (error) {
        console.error('Failed to parse review draft:', error);
      }
    }
  }, []);

  return {
    // State
    reviews,
    stats,
    isLoading,
    error,
    hasMore,
    totalCount,

    // Draft
    draft,
    setDraft,

    // Actions - Reviews
    loadReviews,
    loadMoreReviews,
    submitReview,
    updateReview,
    deleteReview,
    reportReview,

    // Actions - Helpful
    markHelpful,
    markNotHelpful,

    // Actions - Response
    submitResponse,
    updateResponse,
    deleteResponse,

    // Actions - Filters
    setFilters,
    clearFilters,
    sortReviews,
  };
}
