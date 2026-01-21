/**
 * Filter Types
 *
 * Type definitions for advanced search and filtering system.
 * Supports multi-criteria filtering with URL state management.
 *
 * @module types/filter
 * @category Types
 */

/**
 * Price range filter with min/max values
 */
export interface PriceRange {
  min: number;
  max: number;
}

/**
 * Service category with available options
 */
export interface ServiceOption {
  id: string;
  label: string;
  icon?: string;
  category: 'massage' | 'companion' | 'special' | 'other';
}

/**
 * Physical attribute filters
 */
export interface PhysicalFilters {
  ageRange?: [number, number]; // [min, max]
  heightRange?: [number, number]; // [min, max] in cm
  weightRange?: [number, number]; // [min, max] in kg
  hairColor?: string[];
  eyeColor?: string[];
  bodyType?: string[];
}

/**
 * Availability filters
 */
export interface AvailabilityFilters {
  availableToday?: boolean;
  availableTonight?: boolean;
  availableWeekend?: boolean;
  incall?: boolean;
  outcall?: boolean;
}

/**
 * Complete filter state
 */
export interface EscortFilters {
  // Search
  searchQuery?: string;

  // Location
  city?: string;
  district?: string;

  // Pricing
  priceRange?: PriceRange;

  // VIP status
  isVip?: boolean;
  isVerified?: boolean;

  // Physical attributes
  physical?: PhysicalFilters;

  // Services
  services?: string[];

  // Availability
  availability?: AvailabilityFilters;

  // Sorting
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating';
}

/**
 * Filter section configuration for UI
 */
export interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox' | 'range' | 'select' | 'multiselect' | 'toggle';
  options?: Array<{ value: string; label: string; count?: number }>;
  min?: number;
  max?: number;
  step?: number;
  icon?: string;
}

/**
 * Active filter summary for display
 */
export interface ActiveFilter {
  key: string;
  label: string;
  value: string | number | [number, number];
  removable: boolean;
}

/**
 * Filter configuration presets
 */
export const HAIR_COLORS = [
  { value: 'blonde', label: 'Sarı', count: 120 },
  { value: 'brunette', label: 'Kumral', count: 95 },
  { value: 'black', label: 'Siyah', count: 88 },
  { value: 'red', label: 'Kızıl', count: 32 },
  { value: 'colored', label: 'Renkli', count: 18 },
] as const;

export const EYE_COLORS = [
  { value: 'brown', label: 'Kahverengi', count: 140 },
  { value: 'blue', label: 'Mavi', count: 65 },
  { value: 'green', label: 'Yeşil', count: 42 },
  { value: 'hazel', label: 'Ela', count: 38 },
  { value: 'gray', label: 'Gri', count: 15 },
] as const;

export const BODY_TYPES = [
  { value: 'slim', label: 'Zayıf', count: 85 },
  { value: 'athletic', label: 'Atletik', count: 92 },
  { value: 'average', label: 'Orta', count: 110 },
  { value: 'curvy', label: 'Dolgun', count: 78 },
  { value: 'voluptuous', label: 'Balık Etli', count: 45 },
] as const;

export const SERVICE_CATEGORIES = [
  { id: 'massage', label: 'Masaj', icon: '💆', services: [
    { id: 'swedish', label: 'İsveç Masajı' },
    { id: 'thai', label: 'Thai Masajı' },
    { id: 'deep-tissue', label: 'Derin Doku Masajı' },
    { id: 'aromatherapy', label: 'Aromaterapi' },
    { id: 'hot-stone', label: 'Sıcak Taş Masajı' },
  ]},
  { id: 'companion', label: 'Refakat', icon: '👥', services: [
    { id: 'dinner', label: 'Yemek Daveti' },
    { id: 'event', label: 'Etkinliklere Katılım' },
    { id: 'travel', label: 'Seyahat Dostu' },
    { id: 'overnight', label: 'Gece Konaklama' },
    { id: 'weekend', label: 'Hafta Sonu Kaçamağı' },
  ]},
  { id: 'special', label: 'Özel Hizmetler', icon: '✨', services: [
    { id: 'couple', label: 'Çiftlere Hizmet' },
    { id: 'bachelor', label: ' Bekarlığa Veda' },
    { id: 'roleplay', label: 'Rol Oyunu' },
    { id: 'domination', label: 'Dominasyon' },
    { id: 'submission', label: 'Teslimiyet' },
  ]},
] as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'popular', label: 'En Popüler' },
  { value: 'rating', label: 'En Yüksek Puan' },
  { value: 'price-asc', label: 'Fiyat (Düşükten Yükseğe)' },
  { value: 'price-desc', label: 'Fiyat (Yüksekten Düşüğe)' },
] as const;
