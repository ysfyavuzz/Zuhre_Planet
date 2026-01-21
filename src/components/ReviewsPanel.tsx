/**
 * Reviews Panel Component
 *
 * Displays all reviews with filtering, sorting, and pagination.
 * Shows review statistics and distribution chart.
 *
 * @module components/ReviewsPanel
 * @category Components - Reviews
 */

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  Filter,
  TrendingUp,
  ChevronDown,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Review, ReviewStats, RatingValue, ReviewFilters } from '@/types/reviewsExtended';
import { Rating, RatingSummary } from './Rating';
import { ReviewCard } from './ReviewCard';

interface ReviewsPanelProps {
  reviews: Review[];
  stats: ReviewStats;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onFilter?: (filters: Partial<ReviewFilters>) => void;
  onSort?: (sortBy: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful') => void;
  className?: string;
  userRole?: 'escort' | 'customer' | 'admin' | null;
}

export function ReviewsPanel({
  reviews,
  stats,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onFilter,
  onSort,
  className = '',
  userRole,
}: ReviewsPanelProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [filterMinRating, setFilterMinRating] = useState<RatingValue | null>(null);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Apply filters
  const filteredReviews = useMemo(() => {
    let results = [...reviews];

    if (filterMinRating) {
      results = results.filter(r => r.rating >= filterMinRating);
    }

    if (showVerifiedOnly) {
      results = results.filter(r => r.isVerifiedBooking);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        results.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'highest':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        results.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        results.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
    }

    return results;
  }, [reviews, filterMinRating, showVerifiedOnly, sortBy]);

  const handleSort = (value: typeof sortBy) => {
    setSortBy(value);
    onSort?.(value);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <RatingSummary
            average={stats.average}
            total={stats.total}
            distribution={stats.distribution}
          />
        </Card>

        {/* Verified Badge */}
        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.verifiedCount}</p>
          <p className="text-sm text-muted-foreground">Onaylı Randevu</p>
        </Card>

        {/* Last Month */}
        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold">{stats.lastMonthCount}</p>
          <p className="text-sm text-muted-foreground">Bu Ay</p>
        </Card>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtrele
            {(filterMinRating || showVerifiedOnly) && (
              <Badge className="ml-2 bg-primary">Aktif</Badge>
            )}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>

          <AnimatePresence>
            {showFilterPanel && (
              <div className="absolute top-full left-0 mt-2 z-10 bg-background border rounded-lg shadow-xl p-4 min-w-[250px]">
                <h4 className="font-medium mb-3">Filtreler</h4>

                {/* Min Rating */}
                <div className="mb-3">
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Minimum Puan
                  </label>
                  <div className="flex gap-1">
                    {[null, 1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value ?? 0}
                        onClick={() => setFilterMinRating(value as RatingValue | null)}
                        className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                          filterMinRating === value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {value === null ? 'Tümü' : `${value}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verified Only */}
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sadece Onaylı</span>
                  <input
                    type="checkbox"
                    checked={showVerifiedOnly}
                    onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                    className="w-4 h-4"
                  />
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value as typeof sortBy)}
          className="px-4 py-2 border rounded-lg bg-background"
        >
          <option value="newest">En Yeni</option>
          <option value="oldest">En Eski</option>
          <option value="highest">En Yüksek Puan</option>
          <option value="lowest">En Düşük Puan</option>
          <option value="helpful">En Yararlı</option>
        </select>

        {/* Results count */}
        <Badge variant="secondary">
          {filteredReviews.length} değerlendirme
        </Badge>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              showEscortInfo={false}
              onMarkHelpful={() => console.log('Mark helpful:', review.id)}
              onMarkNotHelpful={() => console.log('Mark not helpful:', review.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="font-semibold mb-2">Henüz Değerlendirme Yok</h3>
          <p className="text-muted-foreground">
            Bu escort için henüz değerlendirme yapılmamış.
          </p>
        </div>
      )}

      {/* Load More */}
      {hasMore && filteredReviews.length > 0 && (
        <div className="text-center pt-4">
          <Button onClick={onLoadMore} variant="outline" size="lg">
            Daha Fazla Yükle
          </Button>
        </div>
      )}
    </div>
  );
}

export { ReviewsPanel as default };
