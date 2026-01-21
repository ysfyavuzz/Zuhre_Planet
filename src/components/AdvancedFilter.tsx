/**
 * Advanced Filter Component
 *
 * Comprehensive multi-criteria filtering system with collapsible sections.
 * Supports location, price, physical attributes, services, and availability filters.
 * URL state management for shareable filter links.
 *
 * @module components/AdvancedFilter
 * @category Components - Filter
 */

import { useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { PriceRangeSlider } from '@/components/PriceRangeSlider';
import { ServiceCheckboxGroup } from '@/components/ServiceCheckboxGroup';
import {
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  MapPin,
  Sparkles,
  Shield,
  Crown,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EscortFilters,
  HAIR_COLORS,
  EYE_COLORS,
  BODY_TYPES,
  SORT_OPTIONS,
  ActiveFilter,
} from '@/types/filter';

interface AdvancedFilterProps {
  filters?: EscortFilters;
  onChange?: (filters: EscortFilters) => void;
  onReset?: () => void;
  minPrice?: number;
  maxPrice?: number;
  cities?: string[];
  districts?: Record<string, string[]>;
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

// Default price range
const DEFAULT_MIN_PRICE = 500;
const DEFAULT_MAX_PRICE = 10000;
const DEFAULT_AGE_MIN = 18;
const DEFAULT_AGE_MAX = 55;

export function AdvancedFilter({
  filters = {},
  onChange,
  onReset,
  minPrice = DEFAULT_MIN_PRICE,
  maxPrice = DEFAULT_MAX_PRICE,
  cities = ['İstanbul', 'Bursa', 'Kocaeli', 'Sakarya', 'Tekirdağ'],
  districts = {
    'İstanbul': ['Kadıköy', 'Beşiktaş', 'Şişli', 'Fatih', 'Üsküdar'],
    'Bursa': ['Nilüfer', 'Osmangazi', 'Yıldırım', 'İnegöl'],
    'Kocaeli': ['İzmit', 'Gebze', 'Gölcük', 'Derince'],
  },
  className = '',
  isOpen: controlledIsOpen,
  onToggle,
}: AdvancedFilterProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['location', 'price', 'services'])
  );

  const isOpen = controlledIsOpen ?? internalIsOpen;

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const updateFilter = useCallback(<K extends keyof EscortFilters>(
    key: K,
    value: EscortFilters[K]
  ) => {
    onChange?.({ ...filters, [key]: value });
  }, [filters, onChange]);

  const resetFilters = useCallback(() => {
    onReset?.();
  }, [onReset]);

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.city) count++;
    if (filters.district) count++;
    if (filters.priceRange) count++;
    if (filters.isVip !== undefined) count++;
    if (filters.isVerified !== undefined) count++;
    if (filters.physical?.ageRange) count++;
    if (filters.physical?.hairColor?.length) count++;
    if (filters.physical?.eyeColor?.length) count++;
    if (filters.physical?.bodyType?.length) count++;
    if (filters.services?.length) count++;
    if (filters.availability?.availableToday) count++;
    if (filters.availability?.incall) count++;
    if (filters.availability?.outcall) count++;
    if (filters.sortBy) count++;
    return count;
  }, [filters]);

  // Get active filter summaries
  const activeFilters: ActiveFilter[] = useMemo(() => {
    const result: ActiveFilter[] = [];

    if (filters.city) {
      result.push({ key: 'city', label: 'Şehir', value: filters.city, removable: true });
    }
    if (filters.district) {
      result.push({ key: 'district', label: 'İlçe', value: filters.district, removable: true });
    }
    if (filters.priceRange) {
      result.push({
        key: 'priceRange',
        label: 'Fiyat',
        value: `${filters.priceRange.min} - ${filters.priceRange.max} ₺`,
        removable: true,
      });
    }
    if (filters.isVip) {
      result.push({ key: 'isVip', label: 'Sadece VIP', value: 'true', removable: true });
    }
    if (filters.isVerified) {
      result.push({ key: 'isVerified', label: 'Onaylı', value: 'true', removable: true });
    }

    return result;
  }, [filters]);

  const removeFilter = useCallback((key: string) => {
    const newFilters = { ...filters };
    switch (key) {
      case 'city':
        delete newFilters.city;
        delete newFilters.district;
        break;
      case 'district':
        delete newFilters.district;
        break;
      case 'priceRange':
        delete newFilters.priceRange;
        break;
      case 'isVip':
        delete newFilters.isVip;
        break;
      case 'isVerified':
        delete newFilters.isVerified;
        break;
    }
    onChange?.(newFilters);
  }, [filters, onChange]);

  // Get available districts for selected city
  const availableDistricts = filters.city ? districts[filters.city] || [] : [];

  return (
    <div className={className}>
      {/* Filter Toggle Button (Mobile) */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => {
            if (onToggle) {
              onToggle();
            } else {
              setInternalIsOpen(!isOpen);
            }
          }}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtreler</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </div>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Gelişmiş Filtreler</h3>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary">{activeFiltersCount} aktif</Badge>
                  )}
                </div>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-muted-foreground"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Sıfırla
                  </Button>
                )}
              </div>

              <Separator />

              {/* Active Filters Display */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter) => (
                    <Badge
                      key={filter.key}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {filter.label}: {typeof filter.value === 'string' ? filter.value : ''}
                      {filter.removable && (
                        <button
                          onClick={() => removeFilter(filter.key)}
                          className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Location Section */}
              <div>
                <button
                  onClick={() => toggleSection('location')}
                  className="w-full flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin className="w-4 h-4 text-primary" />
                    Konum
                  </div>
                  {expandedSections.has('location') ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.has('location') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 pt-4">
                        {/* City Select */}
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">Şehir</label>
                          <Select
                            value={filters.city}
                            onValueChange={(value) => {
                              updateFilter('city', value);
                              updateFilter('district', undefined);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Şehir seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* District Select */}
                        {availableDistricts.length > 0 && (
                          <div>
                            <label className="text-sm text-muted-foreground mb-2 block">İlçe</label>
                            <Select
                              value={filters.district}
                              onValueChange={(value) => updateFilter('district', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="İlçe seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableDistricts.map((district) => (
                                  <SelectItem key={district} value={district}>
                                    {district}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Separator />

              {/* Price Section */}
              <div>
                <button
                  onClick={() => toggleSection('price')}
                  className="w-full flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Fiyat Aralığı
                  </div>
                  {expandedSections.has('price') ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.has('price') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4">
                        <PriceRangeSlider
                          min={minPrice}
                          max={maxPrice}
                          value={[filters.priceRange.min, filters.priceRange.max]}
                          onChange={(value) =>
                            updateFilter('priceRange', { min: value[0], max: value[1] })
                          }
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Separator />

              {/* VIP/Verified Section */}
              <div>
                <button
                  onClick={() => toggleSection('status')}
                  className="w-full flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <Shield className="w-4 h-4 text-primary" />
                    Durum
                  </div>
                  {expandedSections.has('status') ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.has('status') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 pt-4">
                        {/* VIP Toggle */}
                        <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                          <Checkbox
                            checked={filters.isVip || false}
                            onCheckedChange={(checked) =>
                              updateFilter('isVip', checked === true ? true : undefined)
                            }
                          />
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">Sadece VIP İlanlar</span>
                          </div>
                        </label>

                        {/* Verified Toggle */}
                        <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                          <Checkbox
                            checked={filters.isVerified || false}
                            onCheckedChange={(checked) =>
                              updateFilter('isVerified', checked === true ? true : undefined)
                            }
                          />
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span className="font-medium">Onaylı Profiller</span>
                          </div>
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Separator />

              {/* Physical Attributes Section */}
              <div>
                <button
                  onClick={() => toggleSection('physical')}
                  className="w-full flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <span>🎨</span>
                    Fiziksel Özellikler
                  </div>
                  {expandedSections.has('physical') ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.has('physical') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 pt-4">
                        {/* Hair Color */}
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">Saç Rengi</label>
                          <div className="flex flex-wrap gap-2">
                            {HAIR_COLORS.map((color) => (
                              <Badge
                                key={color.value}
                                variant={
                                  filters.physical?.hairColor?.includes(color.value)
                                    ? 'default'
                                    : 'outline'
                                }
                                className="cursor-pointer hover:opacity-80"
                                onClick={() => {
                                  const current = filters.physical?.hairColor || [];
                                  const newValue = current.includes(color.value)
                                    ? current.filter((c) => c !== color.value)
                                    : [...current, color.value];
                                  updateFilter('physical', {
                                    ...filters.physical,
                                    hairColor: newValue.length > 0 ? newValue : undefined,
                                  });
                                }}
                              >
                                {color.label}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Body Type */}
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">Vücut Tipi</label>
                          <div className="flex flex-wrap gap-2">
                            {BODY_TYPES.map((type) => (
                              <Badge
                                key={type.value}
                                variant={
                                  filters.physical?.bodyType?.includes(type.value)
                                    ? 'default'
                                    : 'outline'
                                }
                                className="cursor-pointer hover:opacity-80"
                                onClick={() => {
                                  const current = filters.physical?.bodyType || [];
                                  const newValue = current.includes(type.value)
                                    ? current.filter((t) => t !== type.value)
                                    : [...current, type.value];
                                  updateFilter('physical', {
                                    ...filters.physical,
                                    bodyType: newValue.length > 0 ? newValue : undefined,
                                  });
                                }}
                              >
                                {type.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Separator />

              {/* Services Section */}
              <div>
                <button
                  onClick={() => toggleSection('services')}
                  className="w-full flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <span>✨</span>
                    Hizmetler
                  </div>
                  {expandedSections.has('services') ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.has('services') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4">
                        <ServiceCheckboxGroup
                          selectedServices={filters.services}
                          onChange={(services) =>
                            updateFilter('services', services.length > 0 ? services : undefined)
                          }
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Separator />

              {/* Sort Section */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Sıralama</label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) =>
                    updateFilter('sortBy', value as EscortFilters['sortBy'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sıralama seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { AdvancedFilter as default };
