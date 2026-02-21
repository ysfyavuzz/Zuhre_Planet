/**
 * Catalog Page
 *
 * Advanced escort catalog and discovery page with comprehensive filtering system.
 */

import { useState, useMemo } from 'react';
import { useSearchParams } from 'wouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { StandardCard } from '@/components/StandardCard';
import { VipPremiumCard } from '@/components/VipPremiumCard';
import { AdvancedFilterPanel } from '@/components/AdvancedFilterPanel';
import { PremiumHeroBanner } from '@/components/PremiumHeroBanner';
import { StarryBackground } from '@/components/StarryBackground';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockEscorts } from '@/data/mockData';
import { Search, SlidersHorizontal, Grid3x3, List, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { SEO } from '@/pages/SEO';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
      if (searchQuery && !escort.displayName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      const city = searchParams.get('city');
      if (city && escort.city !== city) return false;
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

  const currentCity = searchParams.get('city');
  const isVipFilter = searchParams.get('isVip') === 'true';

  // Dinamik Olarak Title, Description (Bölge ve Statüye göre Long-Tail Kurgusu)
  const seoTitle = currentCity
    ? `${currentCity} ${isVipFilter ? 'VIP ' : ''}Escort İlanları - Zühre Planet`
    : searchQuery
      ? `"${searchQuery}" Escort Araması - Zühre Planet`
      : `Türkiye VIP Escort İlanları ve Elit Katalog - Zühre Planet`;

  const seoDesc = currentCity
    ? `En güncel ve %100 onaylı ${currentCity} escort bayan ilanları. ${currentCity} profillerini inceleyin ve iletişime geçin.`
    : `Zühre planet escort platformu üzerinde yer alan tüm onaylı vip escort bayan, elit ilanlar ve ajans profillerini inceleyin.`;

  return (
    <div className="min-h-screen">
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={`${currentCity ? currentCity + ' escort, ' : ''}vip escort, escort ilanları, onaylı escort, elit escort`}
      />
      <StarryBackground />
      <Header />

      <PremiumHeroBanner
        title="SEÇKİN KATALOG"
        subtitle="Türkiye'nin en seçkin ve doğrulanmış profillerini keşfedin."
      />

      <main className="container mx-auto px-6 py-16 relative z-10 pointer-events-auto">
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-6 mb-16 items-center justify-between">
          <div className="relative w-full md:w-[400px]">
            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/20' : 'text-slate-900/20'}`} />
            <input
              type="text"
              placeholder="GALAKSİDE ARA..."
              className={`w-full glass-panel border-none pl-14 pr-6 py-6 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-black uppercase tracking-widest text-[10px] italic
                ${isDark ? 'text-white placeholder-white/20' : 'text-slate-900 placeholder-slate-900/40'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <Button
              className={`flex-1 md:flex-none gap-3 glass-panel border-none h-16 px-10 font-black uppercase tracking-[0.2em] text-[10px] italic transition-all
                ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-violet-500/10'}`}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              FİLTRELE
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="flex flex-wrap gap-3 mb-12">
            {Object.entries(activeFilters).map(([key, value]) => (
              <Badge key={key} className="glass-panel border-none text-violet-400 gap-3 py-4 px-8 font-black uppercase tracking-widest text-[9px] italic">
                {key}: {value}
                <X className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors" onClick={() => removeFilter(key)} />
              </Badge>
            ))}
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-violet-400 transition-colors" onClick={() => setSearchParams(new URLSearchParams())}>
              TÜMÜNÜ TEMİZLE
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {filterOpen && (
              <motion.aside
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="lg:col-span-3"
              >
                <div className="glass-panel border-none p-10 rounded-[2.5rem] sticky top-28 shadow-2xl">
                  <AdvancedFilterPanel onFilterChange={handleFilterChange} />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className={filterOpen ? "lg:col-span-9" : "lg:col-span-12"}>
            {/* VIP Section */}
            {vipEscorts.length > 0 && (
              <section className="mb-24">
                <div className="flex items-center gap-6 mb-12">
                  <h2 className={`text-4xl font-black italic uppercase tracking-tighter text-3d ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    VIP <span className="text-violet-500">YILDIZLAR</span>
                  </h2>
                  <div className={`h-px flex-1 ${isDark ? 'bg-white/10' : 'bg-slate-900/10'}`} />
                </div>
                <div className={`grid gap-10 ${viewMode === 'grid' ? (filterOpen ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 md:grid-cols-3 xl:grid-cols-4') : 'grid-cols-1'}`}>
                  {vipEscorts.map(escort => (
                    <VipPremiumCard key={escort.id} escort={escort} />
                  ))}
                </div>
              </section>
            )}

            {/* Standard Section */}
            <section>
              <div className="flex items-center gap-6 mb-12">
                <h2 className={`text-4xl font-black italic uppercase tracking-tighter text-3d ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  TÜM <span className="text-violet-500">İLANLAR</span>
                </h2>
                <div className={`h-px flex-1 ${isDark ? 'bg-white/10' : 'bg-slate-900/10'}`} />
              </div>
              <div className={`grid gap-10 ${viewMode === 'grid' ? (filterOpen ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 md:grid-cols-3 xl:grid-cols-4') : 'grid-cols-1'}`}>
                {standardEscorts.map(escort => (
                  <StandardCard key={escort.id} profile={escort} />
                ))}
              </div>

              {filteredEscorts.length === 0 && (
                <div className="text-center py-40 glass-panel border-none rounded-[3rem] shadow-2xl">
                  <p className={`text-xl font-black uppercase tracking-[0.2em] italic ${isDark ? 'text-white/30' : 'text-slate-900/40'}`}>
                    ARADIĞINIZ KRİTERLERE UYGUN SONUÇ BULUNAMADI.
                  </p>
                  <Button variant="link" className="text-violet-500 mt-6 font-black uppercase tracking-widest italic text-sm" onClick={() => setSearchParams(new URLSearchParams())}>
                    YÖRÜNGEYI SIFIRLA
                  </Button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
