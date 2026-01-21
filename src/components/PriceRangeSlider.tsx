/**
 * Price Range Slider Component
 *
 * Dual-handle slider for selecting minimum and maximum price range.
 * Uses Radix UI Slider with custom styling and real-time value display.
 *
 * @module components/PriceRangeSlider
 * @category Components - Form
 */

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  defaultValue?: [number, number];
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
  className?: string;
}

export function PriceRangeSlider({
  min,
  max,
  step = 100,
  defaultValue = [min, max],
  value: controlledValue,
  onChange,
  className = '',
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(controlledValue || defaultValue);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

  const value = controlledValue || localValue;
  const [currentMin, currentMax] = value;

  // Calculate percentages for thumb positioning
  const minPercent = ((currentMin - min) / (max - min)) * 100;
  const maxPercent = ((currentMax - min) / (max - min)) * 100;

  const handleMinChange = useCallback((newValue: number) => {
    const clampedValue = Math.max(min, Math.min(newValue, currentMax - step));
    const newValueTuple: [number, number] = [clampedValue, currentMax];
    setLocalValue(newValueTuple);
    onChange?.(newValueTuple);
  }, [currentMax, min, step, onChange]);

  const handleMaxChange = useCallback((newValue: number) => {
    const clampedValue = Math.max(currentMin + step, Math.min(newValue, max));
    const newValueTuple: [number, number] = [currentMin, clampedValue];
    setLocalValue(newValueTuple);
    onChange?.(newValueTuple);
  }, [currentMin, max, step, onChange]);

  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPercent = (e.clientX - rect.left) / rect.width;
    const clickValue = min + (clickPercent * (max - min));

    // Decide which handle to move based on which is closer
    const minDiff = Math.abs(clickValue - currentMin);
    const maxDiff = Math.abs(clickValue - currentMax);

    if (minDiff < maxDiff) {
      handleMinChange(clickValue);
    } else {
      handleMaxChange(clickValue);
    }
  }, [currentMin, currentMax, min, max, handleMinChange, handleMaxChange]);

  const handleReset = useCallback(() => {
    const defaultValueTuple: [number, number] = [min, max];
    setLocalValue(defaultValueTuple);
    onChange?.(defaultValueTuple);
  }, [min, max, onChange]);

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with value display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Fiyat Aralığı</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {formatPrice(currentMin)} - {formatPrice(currentMax)}
          </Badge>
          {(currentMin !== min || currentMax !== max) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={handleReset}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Custom slider track */}
      <div className="relative h-6">
        {/* Background track */}
        <div className="absolute inset-y-0 left-0 right-0 h-2 top-2 rounded-full bg-primary/20 cursor-pointer"
             onClick={handleTrackClick}>
          {/* Active range */}
          <div
            className="absolute h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
        </div>

        {/* Min thumb */}
        <div
          className={`absolute w-6 h-6 top-0 -ml-3 rounded-full bg-background border-2 border-primary shadow-lg cursor-grab active:cursor-grabbing transition-transform hover:scale-110 ${
            isDragging === 'min' ? 'scale-125 ring-4 ring-primary/20' : ''
          }`}
          style={{ left: `${minPercent}%` }}
          onMouseDown={() => setIsDragging('min')}
          onMouseUp={() => setIsDragging(null)}
          onMouseLeave={() => setIsDragging(null)}
        >
          {/* Tooltip showing value */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            {formatPrice(currentMin)}
          </div>
        </div>

        {/* Max thumb */}
        <div
          className={`absolute w-6 h-6 top-0 -ml-3 rounded-full bg-background border-2 border-accent shadow-lg cursor-grab active:cursor-grabbing transition-transform hover:scale-110 ${
            isDragging === 'max' ? 'scale-125 ring-4 ring-accent/20' : ''
          }`}
          style={{ left: `${maxPercent}%` }}
          onMouseDown={() => setIsDragging('max')}
          onMouseUp={() => setIsDragging(null)}
          onMouseLeave={() => setIsDragging(null)}
        >
          {/* Tooltip showing value */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-accent text-accent-foreground text-xs rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            {formatPrice(currentMax)}
          </div>
        </div>

        {/* Global mouse move handler for dragging */}
        {isDragging && (
          <div
            className="fixed inset-0 z-50 cursor-grabbing"
            onMouseMove={(e) => {
              const track = e.currentTarget.parentElement?.querySelector('[class*="rounded-full bg-primary/20"]') as HTMLElement;
              if (!track) return;

              const rect = track.getBoundingClientRect();
              const movePercent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              const moveValue = min + (movePercent * (max - min));

              if (isDragging === 'min') {
                handleMinChange(moveValue);
              } else {
                handleMaxChange(moveValue);
              }
            }}
            onMouseUp={() => setIsDragging(null)}
          />
        )}
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  );
}

export { PriceRangeSlider as default };
