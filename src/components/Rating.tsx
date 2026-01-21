/**
 * Rating Component
 *
 * Interactive star rating component with hover effects and animations.
 * Supports both display-only and interactive modes.
 *
 * @module components/Rating
 * @category Components - Rating
 */

import { useState, useCallback, useEffect } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { motion } from 'framer-motion';
import { RatingValue } from '@/types/reviewsExtended';

interface RatingProps {
  value: number; // 0-5 scale, supports decimals (e.g., 4.5)
  max?: number;
  readonly?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (value: number) => void;
  onHover?: (value: number) => void;
  showLabel?: boolean;
  showCount?: boolean;
  count?: number;
  className?: string;
}

const SIZE_STYLES = {
  sm: { w: 4, h: 4, gap: 0.5 },
  md: { w: 5, h: 5, gap: 1 },
  lg: { w: 6, h: 6, gap: 1.5 },
} as const;

export function Rating({
  value,
  max = 5,
  readonly = false,
  disabled = false,
  size = 'md',
  onChange,
  onHover,
  showLabel = false,
  showCount = false,
  count,
  className = '',
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeStyles = SIZE_STYLES[size];
  const displayValue = hoverValue || value;

  const handleClick = useCallback((clickedValue: number) => {
    if (readonly || disabled) return;
    onChange?.(clickedValue);
  }, [readonly, disabled, onChange]);

  const handleMouseEnter = useCallback((starValue: number) => {
    if (readonly || disabled) return;
    setHoverValue(starValue);
    onHover?.(starValue);
  }, [readonly, disabled, onHover]);

  const handleMouseLeave = useCallback(() => {
    setHoverValue(0);
    onHover?.(0);
  }, [onHover]);

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFull = displayValue >= starValue;
    const isHalf = !isFull && displayValue >= starValue - 0.5 && displayValue < starValue;
    const isEmpty = !isFull && !isHalf;

    return (
      <motion.button
        key={index}
        type="button"
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        onMouseLeave={handleMouseLeave}
        disabled={readonly || disabled}
        className={`shrink-0 focus:outline-none transition-all ${
          readonly
            ? ''
            : disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:scale-110 active:scale-95'
        }`}
        aria-label={`${starValue} yıldız`}
        style={{ width: sizeStyles.w * 4, height: sizeStyles.h * 4 }}
      >
        {isFull ? (
          <Star
            className={`w-full h-full fill-yellow-400 text-yellow-400 ${
              hoverValue > 0 ? 'transition-colors' : ''
            }`}
            style={{ color: hoverValue > 0 ? '#fbbf24' : '#fbbf24' }}
          />
        ) : isHalf ? (
          <div className="relative w-full h-full">
            <Star className="absolute inset-0 w-full h-full fill-yellow-400/50 text-yellow-400/50" />
            <StarHalf className="relative w-full h-full fill-yellow-400 text-yellow-400" />
          </div>
        ) : (
          <Star
            className={`w-full h-full ${
              hoverValue > 0 ? 'text-yellow-200' : 'text-gray-300'
            } transition-colors`}
            style={{ color: hoverValue > 0 && starValue <= hoverValue ? '#fde047' : '#d1d5db' }}
          />
        )}
      </motion.button>
    );
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center" style={{ gap: sizeStyles.gap }}>
        {Array.from({ length: max }).map((_, index) => renderStar(index))}
      </div>

      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground">
          {value.toFixed(1)}
        </span>
      )}

      {showCount && count !== undefined && (
        <span className="text-sm text-muted-foreground">
          ({count.toLocaleString('tr-TR')})
        </span>
      )}
    </div>
  );
}

/**
 * Interactive Rating Component
 * For collecting user ratings with click and hover
 */
interface InteractiveRatingProps {
  value: RatingValue | null;
  onChange: (value: RatingValue) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export function InteractiveRating({
  value,
  onChange,
  size = 'lg',
  label,
  required = false,
  error,
  className = '',
}: InteractiveRatingProps) {
  const [internalValue, setInternalValue] = useState<RatingValue | null>(value);

  // Sync internal value with prop changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleClick = (clickedValue: RatingValue) => {
    const newValue = internalValue === clickedValue ? null : clickedValue;
    setInternalValue(newValue);
    if (newValue !== null) {
      onChange(newValue);
    } else {
      // If clearing, pass the last value
      onChange(clickedValue);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex items-center gap-1">
        {([1, 2, 3, 4, 5] as RatingValue[]).map((starValue) => (
          <motion.button
            key={starValue}
            type="button"
            onClick={() => handleClick(starValue)}
            className="relative focus:outline-none transition-transform"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                internalValue && internalValue >= starValue
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
            {internalValue === starValue && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 bg-yellow-400/20 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

/**
 * Multi-Criteria Rating Component
 * For detailed reviews with multiple rating categories
 */
interface MultiCriteriaRatingProps {
  criteria: {
    appearance?: RatingValue;
    attitude?: RatingValue;
    service?: RatingValue;
    punctuality?: RatingValue;
    location?: RatingValue;
  };
  onChange?: (criteria: {
    appearance?: RatingValue;
    attitude?: RatingValue;
    service?: RatingValue;
    punctuality?: RatingValue;
    location?: RatingValue;
  }) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

export function MultiCriteriaRating({
  criteria,
  onChange,
  readonly = false,
  size = 'sm',
  showLabels = true,
  className = '',
}: MultiCriteriaRatingProps) {
  const CRITERIA_CONFIG = [
    { key: 'appearance' as const, label: 'Görünüş', icon: '👤' },
    { key: 'attitude' as const, label: 'Tutum', icon: '💝' },
    { key: 'service' as const, label: 'Hizmet', icon: '⭐' },
    { key: 'punctuality' as const, label: 'Zamanlama', icon: '⏰' },
    { key: 'location' as const, label: 'Mekan', icon: '🏠' },
  ];

  const handleChange = (key: string, value: RatingValue) => {
    if (readonly || !onChange) return;
    onChange({ ...criteria, [key]: value });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {CRITERIA_CONFIG.map((config) => {
        const value = criteria[config.key];

        return (
          <div key={config.key} className="flex items-center gap-3">
            {/* Icon */}
            <span className="text-xl shrink-0">{config.icon}</span>

            {/* Label */}
            {showLabels && (
              <span className="text-sm font-medium min-w-[60px]">
                {config.label}
              </span>
            )}

            {/* Stars */}
            <div className="flex gap-0.5">
              {([1, 2, 3, 4, 5] as RatingValue[]).map((starValue) => (
                <motion.button
                  key={starValue}
                  type="button"
                  onClick={() => handleChange(config.key, starValue)}
                  disabled={readonly}
                  className={`shrink-0 focus:outline-none transition-all ${
                    readonly
                      ? 'cursor-default'
                      : 'cursor-pointer hover:scale-110 active:scale-95'
                  }`}
                  style={{ width: size === 'sm' ? 16 : size === 'md' ? 20 : 24 }}
                >
                  <Star
                    className={`w-full h-full ${
                      value && value >= starValue
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </motion.button>
              ))}
            </div>

            {/* Value */}
            {value !== undefined && (
              <span className="text-sm font-bold text-yellow-600 min-w-[20px]">
                {value}.0
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Rating Summary Component
 * Shows rating overview with distribution chart
 */
interface RatingSummaryProps {
  average: number;
  total: number;
  distribution?: Record<RatingValue, number>;
  showDistribution?: boolean;
  className?: string;
}

export function RatingSummary({
  average,
  total,
  distribution,
  showDistribution = true,
  className = '',
}: RatingSummaryProps) {
  const defaultDistribution: Record<RatingValue, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  const dist = distribution || defaultDistribution;

  // Calculate percentage for each star
  const percentages = Object.entries(dist).map(([star, count]) => ({
    star: parseInt(star) as RatingValue,
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
  }));

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Overall Rating */}
      <div className="flex items-center gap-4">
        {/* Large average rating */}
        <div className="text-5xl font-black text-primary">
          {average.toFixed(1)}
        </div>

        {/* Stars */}
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`w-5 h-5 ${
                  average >= index + 1
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {total.toLocaleString('tr-TR')} değerlendirme
          </p>
        </div>
      </div>

      {/* Distribution Chart */}
      {showDistribution && (
        <div className="space-y-2">
          {percentages.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-sm w-3">{star}</span>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 shrink-0" />
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8 text-right">
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { Rating as default };
