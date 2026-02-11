/**
 * Escort Listings Page (Galaxy Edition)
 * 
 * Dinamik Tetris Grid yapısı, gelişmiş filtreleme ve Quick View özelliği ile
 * zenginleştirilmiş ilan listeleme sayfası.
 * "Deep Space Luxury" temasına uygun.
 * 
 * @module pages/EscortList
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, Sparkles, SlidersHorizontal, Search, MapPin, 
  ChevronDown, X, Star, Crown 
} from 'lucide-react';

// Domain Types & Service
import { ListingProfile } from '@/types/domain';
import { listingService } from '@/services/listingService';

// UI Components
import { StandardCard } from '@/components/StandardCard';
import { QuickViewModal } from '@/components/ui/QuickViewModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/pages/SEO';

export default function EscortList() {
  const [listings, setListings] = useState<ListingProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Quick View Modal State
  const [selectedProfile, setSelectedProfile] = useState<ListingProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Veri Çekme (Simüle edilmiş API çağrısı)
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const data = await listingService.getListings();
        setListings(data);
      } catch (error) {
        console.error("İlanlar yüklenirken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Quick View Handler
  const handleQuickView = (profile: ListingProfile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white">
      <SEO 
        title="Zuhre Planet | Seçkin İlanlar" 
        description="Galaksinin en parlak yıldızlarını keşfedin." 
      />

      {/* --- HERO HEADER --- */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-[#020205] to-[#020205]" />
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }} 
        />

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <Badge className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/20 backdrop-blur-md px-4 py-1.5">
              <Sparkles className="w-4 h-4 mr-2" /> KEŞFET
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black font-orbitron tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
              YILDIZLAR GEÇİDİ
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl font-light">
              Aradığınız deneyimi bulmak için galaksinin en seçkin profillerini inceleyin.
            </p>
          </div>

          {/* --- FILTER BAR (Simplified) --- */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 max-w-5xl mx-auto shadow-2xl">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="İsim, şehir veya özellik ara..." 
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-gray-600"
                />
              </div>
              
              <div className="h-8 w-px bg-white/10 hidden md:block" />
              
              <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 text-gray-300">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>İstanbul</span>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </button>
            </div>

            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-6 px-8 rounded-xl shadow-lg shadow-purple-900/40">
              <Filter className="w-4 h-4 mr-2" />
              FİLTRELE
            </Button>
          </div>
        </div>
      </div>

      {/* --- LISTING GRID (TETRIS LAYOUT) --- */}
      <div className="container mx-auto px-4 pb-32">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
            <span className="text-gray-500 animate-pulse">Yıldızlar taranıyor...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[300px] gap-6 grid-flow-dense">
            {listings.map((profile) => (
              <StandardCard
                key={profile.id}
                profile={profile}
                onQuickView={handleQuickView}
                showVideoOnHover={true}
              />
            ))}
            
            {/* Promo Card Inserted into Grid */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 relative rounded-[24px] overflow-hidden group cursor-pointer border border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-black">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8">
                <Crown className="w-12 h-12 text-amber-400 mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-white mb-2 font-orbitron">VİTRİN SİZİN OLSUN</h3>
                <p className="text-amber-200/80 mb-6">Profilinizi binlerce kişiye ulaştırın.</p>
                <Button variant="outline" className="border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black transition-all">
                  Reklam Ver
                </Button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- QUICK VIEW MODAL --- */}
      <QuickViewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={selectedProfile}
      />
    </div>
  );
}