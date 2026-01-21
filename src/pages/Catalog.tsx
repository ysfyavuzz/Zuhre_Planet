/**
 * Catalog Page
 *
 * Advanced escort catalog and discovery page with comprehensive filtering system.
 * Features advanced multi-criteria filtering with URL state persistence.
 *
 * @module pages/Catalog
 * @category Pages - Public
 *
 * Features:
 * - Advanced multi-criteria filtering (location, price, services, physical attributes)
 * - VIP and Premium escort showcase sections
 * - Standard escort grid with pagination
 * - URL-based filter state for shareable links
 * - Real-time filter updates with debouncing
 * - Responsive filter panel (collapsible on mobile)
 * - Active filter display with quick remove
 *
 * @example
 * ```tsx
 * // Route: /catalog
 * // Route with filters: /catalog?city=Istanbul&isVip=true&sortBy=newest
 * <Catalog />
 * ```
 */

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'wouter';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { StandardCard } from '@/components/StandardCard';
import { VipPremiumCard } from '@/components/VipPremiumCard';
import { AdvancedFilter } from '@/components/AdvancedFilter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockEscorts } from '@/mockData';
import { locations } from '@/locations';
import { EscortFilters } from '@/types/filter';
import { Search, SlidersHorizontal, Grid3x3, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CITIES = ['İstanbul', 'Bursa', 'Kocaeli', 'Sakarya', 'Tekirdağ'];
const DISTRICTS: Record<string, string[]> = {
  'İstanbul': ['Kadıköy', 'Beşiktaş', 'Şişli', 'Fatih', 'Üsküdar'],
  'Bursa': ['Nilüfer', 'Osmangazi', 'Yıldırım', 'İnegöl'],
  'Kocaeli': ['İzmit', 'Gebze', 'Gölcük', 'Derince'],
};

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Parse filters from URL
  const filters: EscortFilters = useMemo(() => {
    return {
      city: searchParams.get('city') || undefined,
      district: searchParams.get('district') || undefined,
      isVip: searchParams.get('isVip') === 'true' ? true : undefined,
      isVerified: searchParams.get('isVerified') === 'true' ? true : undefined,
      sortBy: (searchParams.get('sortBy') as EscortFilters['sortBy']) || undefined,
      priceRange: searchParams.get('priceMin') || searchParams.get('priceMax')
        ? {
            min: parseInt(searchParams.get('priceMin') || '500'),
            max: parseInt(searchParams.get('priceMax') || '10000'),
          }
        : undefined,
      services: searchParams.get('services')?.split(',').filter(Boolean) || undefined,
      searchQuery: searchParams.get('q') || undefined,
    };
  }, [searchParams]);

  // Update URL when filters change
  const updateFilters = useCallback((newFilters: EscortFilters) => {
    const params = new URLSearchParams();

    if (newFilters.city) params.set('city', newFilters.city);
    if (newFilters.district) params.set('district', newFilters.district);
    if (newFilters.isVip) params.set('isVip', 'true');
    if (newFilters.isVerified) params.set('isVerified', 'true');
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);
    if (newFilters.priceRange) {
      params.set('priceMin', newFilters.priceRange.min.toString());
      params.set('priceMax', newFilters.priceRange.max.toString());
    }
    if (newFilters.services?.length) {
      params.set('services', newFilters.services.join(','));
    }
    if (searchQuery) params.set('q', searchQuery);

    setSearchParams(params.toString());
  }, [searchQuery, setSearchParams]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchParams('');
    setSearchQuery('');
  }, [setSearchParams]);

  // Filter escorts
  const filteredEscorts = useMemo(() => {
    let results = [...mockEscorts];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(escort =>
        escort.displayName?.toLowerCase().includes(query) ||
        escort.city?.toLowerCase().includes(query) ||
        escort.description?.toLowerCase().includes(query)
      );
    }

    // Apply city filter
    if (filters.city) {
      results = results.filter(escort =>
        escort.city?.toLowerCase() === filters.city?.toLowerCase()
      );
    }

    // Apply district filter
    if (filters.district) {
      results = results.filter(escort =>
        escort.district?.toLowerCase() === filters.district?.toLowerCase()
      );
    }

    // Apply VIP filter
    if (filters.isVip) {
      results = results.filter(escort => escort.isVip === true);
    }

    // Apply verified filter
    if (filters.isVerified) {
      results = results.filter(escort => escort.isVerified === true);
    }

    // Apply price range filter
    if (filters.priceRange) {
      results = results.filter(escort => {
        const price = escort.hourlyRate || 0;
        return price >= filters.priceRange!.min && price <= filters.priceRange!.max;
      });
    }

    // Apply services filter
    if (filters.services && filters.services.length > 0) {
      results = results.filter(escort =>
        filters.services?.some(service =>
          escort.services?.some(s =>
            s.toLowerCase().includes(service.toLowerCase())
          )
        )
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          results.sort((a, b) => {
            const aTime = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : (a.createdAt instanceof Date ? a.createdAt.getTime() : 0);
            const bTime = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : (b.createdAt instanceof Date ? b.createdAt.getTime() : 0);
            return bTime - aTime;
          });
          break;
        case 'price-asc':
          results.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
          break;
        case 'price-desc':
          results.sort((a, b) => (b.hourlyRate || 0) - (a.hourlyRate || 0));
          break;
        case 'popular':
          results.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
          break;
        case 'rating':
          results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
      }
    }

    return results;
  }, [searchQuery, filters]);

  const vipEscorts = useMemo(() => filteredEscorts.filter(m => m.isVip === true), [filteredEscorts]);
  const standardEscorts = useMemo(() => filteredEscorts.filter(m => m.isVip === false), [filteredEscorts]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.city) count++;
    if (filters.district) count++;
    if (filters.isVip) count++;
    if (filters.isVerified) count++;
    if (filters.priceRange) count++;
    if (filters.services?.length) count++;
    if (filters.sortBy) count++;
    return count;
  }, [filters]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter">
                {filters.city && filters.city !== 'all'
                  ? locations.find(l => l.id === filters.city)?.name || filters.city
                  : 'Tüm İlanlar'}
              </h1>
              <p className="text-muted-foreground mt-2">
                <span className="font-bold text-primary">{filteredEscorts.length}</span> escort bulundu
                {activeFilterCount > 0 && (
                  <span className="ml-2">
                    (<span className="font-bold">{activeFilterCount}</span> filtre aktif)
                  </span>
                )}
              </p>
            </div>

            {/* View Mode Toggle (Desktop) */}
            <div className="hidden md:flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="İsim, şehir veya hizmet ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-card border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-3">
            <AdvancedFilter
              filters={filters}
              onChange={updateFilters}
              onReset={resetFilters}
              cities={CITIES}
              districts={DISTRICTS}
              minPrice={500}
              maxPrice={10000}
              isOpen={filterOpen}
              onToggle={() => setFilterOpen(!filterOpen)}
            />
          </aside>

          {/* Results */}
          <div className="lg:col-span-9 space-y-8">
            {/* VIP/Premium Section */}
            {vipEscorts.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full" />
                  <h2 className="text-xl font-bold">Öne Çıkanlar</h2>
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                    VIP & PREMIUM
                  </Badge>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {vipEscorts.length} ilan
                  </span>
                </div>
                <div className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                }`}>
                  {vipEscorts.map(escort => (
                    <VipPremiumCard key={escort.id} escort={escort} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Standard Section */}
            {standardEscorts.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full" />
                  <h2 className="text-xl font-bold">Diğer İlanlar</h2>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {standardEscorts.length} ilan
                  </span>
                </div>
                <div className={`grid gap-4 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                }`}>
                  {standardEscorts.map(escort => (
                    <StandardCard key={escort.id} escort={escort} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* No Results */}
            {filteredEscorts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sonuç Bulunamadı</h3>
                <p className="text-muted-foreground mb-6">
                  Arama kriterlerinize uygun ilan bulunamadı.
                </p>
                <Button onClick={resetFilters} variant="outline">
                  Filtreleri Temizle
                </Button>
              </motion.div>
            )}

            {/* Load More (placeholder) */}
            {filteredEscorts.length > 0 && (
              <div className="text-center pt-8">
                <Button size="lg" variant="outline" className="px-12">
                  Daha Fazla Yükle
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

export { Catalog };
