/**
 * Catalog Page
 *
 * Advanced escort catalog and discovery page with comprehensive filtering system.
 * Features advanced multi-criteria filtering with URL state persistence.
 */

import { useState, useMemo } from 'react';
import { useSearchParams } from 'wouter';
import { Header } from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { StandardCard } from '@/components/StandardCard';
import { VipPremiumCard } from '@/components/VipPremiumCard';
import { AdvancedFilterPanel } from '@/components/AdvancedFilterPanel';
import { PremiumHeroBanner } from '@/components/PremiumHeroBanner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockEscorts } from '@/data/mockData';
import { Search, SlidersHorizontal, Grid3x3, List, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Active filters from URL
  const activeFilters = useMemo(() => {
    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      filters[key] = value;
    });
    return filters;
  }, [searchParams]);

  // Filtered escorts
  const filteredEscorts = useMemo(() => {
    return mockEscorts.filter(escort => {
      // Search query filter
      if (searchQuery && !escort.displayName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // City filter
      const city = searchParams.get('city');
      if (city && escort.city !== city) return false;
      
      // VIP filter
      const isVip = searchParams.get('isVip');
      if (isVip === 'true' && !escort.isVip) return false;

      return true;
    });
  }, [searchParams, searchQuery]);

  const vipEscorts = useMemo(() => filteredEscorts.filter(e => e.isVip), [filteredEscorts]);
  const standardEscorts = useMemo(() => filteredEscorts.filter(e => !e.isVip), [filteredEscorts]);

  const handleFilterChange = (newFilters: Record<string, string | number | boolean | null>) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
    setSearchParams(params);
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Header />
      
      <PremiumHeroBanner 
        title="Seçkin Katalog"
        subtitle="Türkiye'nin en seçkin ve doğrulanmış profillerini keşfedin."
      />

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-secondary w-5 h-5" />
            <input 
              type="text" 
              placeholder="İsim ile ara..."
              className="w-full bg-dark-card border border-dark-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-gold-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="flex-1 md:flex-none gap-2 border-dark-border"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtrele
            </Button>
            <div className="hidden md:flex border border-dark-border rounded-lg overflow-hidden">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="icon"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(activeFilters).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="bg-dark-card border-dark-border text-gold-500 gap-1 py-1 px-3">
                {key}: {value}
                <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter(key)} />
              </Badge>
            ))}
            <Button variant="ghost" size="sm" className="text-xs text-dark-text-secondary" onClick={() => setSearchParams(new URLSearchParams())}>
              Tümünü Temizle
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {filterOpen && (
              <motion.aside 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:col-span-1"
              >
                <AdvancedFilterPanel onFilterChange={handleFilterChange} />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className={filterOpen ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* VIP Section */}
            {vipEscorts.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-2xl font-bold text-gradient-gold">VIP Üyeler</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-gold-500/50 to-transparent" />
                </div>
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {vipEscorts.map(escort => (
                    <VipPremiumCard key={escort.id} escort={escort} />
                  ))}
                </div>
              </section>
            )}

            {/* Standard Section */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-bold text-white">Tüm İlanlar</h2>
                <div className="h-px flex-1 bg-dark-border" />
              </div>
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {standardEscorts.map(escort => (
                  <StandardCard key={escort.id} escort={escort} />
                ))}
              </div>
              
              {filteredEscorts.length === 0 && (
                <div className="text-center py-20 bg-dark-card rounded-xl border border-dark-border">
                  <p className="text-dark-text-secondary text-lg">Aradığınız kriterlere uygun sonuç bulunamadı.</p>
                  <Button variant="link" className="text-gold-500 mt-2" onClick={() => setSearchParams(new URLSearchParams())}>
                    Filtreleri Sıfırla
                  </Button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}
