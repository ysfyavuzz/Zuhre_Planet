/**
 * Escort List Page
 * 
 * Advanced escort search and discovery page with comprehensive filtering capabilities.
 * Provides extensive physical attribute filtering, verification status toggles, and pagination.
 * Enables users to find escorts matching specific preferences with refined search criteria.
 * 
 * @module pages/EscortList
 * @category Pages - Public
 * 
 * Features:
 * - Full-text search by name, bio, or keywords
 * - Physical attribute filters (age range, height, body type, ethnicity)
 * - Service-based filtering (available services)
 * - Price range filtering (hourly to overnight rates)
 * - Availability status filtering
 * - VIP and verified escort toggles
 * - Sorting options (newest, popular, rating, price)
 * - Pagination with adjustable results per page
 * - Grid and list view toggle
 * - Real-time search results update
 * - Mobile-responsive filter sidebar with toggle
 * - Active filter count display
 * - Clear filters button for quick reset
 * 
 * Filters:
 * - Age, Height, Weight, Body Type
 * - Hair Color, Ethnicity, Nationality
 * - Languages Spoken, Services Offered
 * - City/Location, Availability
 * - Price Range, Rating Range
 * - Verification Status, VIP Status
 * 
 * @example
 * ```tsx
 * // Route: /escorts
 * // Route with filters: /escorts?age=20-30&city=Istanbul&services=companion
 * <EscortList />
 * ```
 */

import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { AdBanner } from '@/components/AdBanner';
import { SEO } from '@/pages/SEO';
import { StandardCard } from '@/components/StandardCard';
import { mockEscorts, mockAds } from '@/mockData';
import { marmaraLocations } from '@/locations';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, Heart, Search, Loader2, Crown,
  CheckCircle2, ArrowRight, Filter, SlidersHorizontal,
  Flame, Sparkles, ChevronDown, X, Ruler, Weight,
  Palette, Eye, Sparkles as SparklesIcon, Baby, User,
  Droplets, Gauge, Minus, Plus
} from 'lucide-react';

// Filtre seçenekleri
const HEIGHT_OPTIONS = [
  { min: 150, max: 160, label: '150-160 cm' },
  { min: 160, max: 170, label: '160-170 cm' },
  { min: 170, max: 180, label: '170-180 cm' },
  { min: 180, max: 190, label: '180-190 cm' },
  { min: 190, max: 200, label: '190+ cm' },
];

const WEIGHT_OPTIONS = [
  { min: 40, max: 50, label: '40-50 kg' },
  { min: 50, max: 60, label: '50-60 kg' },
  { min: 60, max: 70, label: '60-70 kg' },
  { min: 70, max: 80, label: '70-80 kg' },
  { min: 80, max: 90, label: '80+ kg' },
];

const ETHNICITY_OPTIONS = [
  'Avrupalı', 'Asyalı', 'Latin', 'Afrikalı', 'Orta Doğulu',
  'Karışık', 'Rus', 'Ukraynalı', 'Arap', 'Diğer'
];

const BODY_TYPE_OPTIONS = [
  'Zayıf', 'İnce', 'Orta', 'Dolgun', 'Balık Etli',
  'Atletik', 'Fit', 'Kıvraklı', 'Seksi'
];

const BREAST_SIZE_OPTIONS = [
  'Küçük', 'Orta', 'Büyük', 'Çok Büyük',
  'Doğal', 'Silikonlu'
];

const HIP_TYPE_OPTIONS = [
  'Dar', 'Orta', 'Geniş', 'Kıvraklı',
  'Yuvarlak', 'Seksi'
];

const HAIR_COLOR_OPTIONS = [
  'Sarı', 'Kumral', 'Kahverengi', 'Siyah', 'Kızıl',
  'Açık Kahverengi', 'Koyu Kahverengi', 'Gri', 'Platin', 'Renkli'
];

const EYE_COLOR_OPTIONS = [
  'Mavi', 'Yeşil', 'Kahverengi', 'Ela', 'Siyah',
  'Gri', 'Hazel', 'Amber'
];

export default function EscortList() {
  // Temel filtreler
  const [searchCity, setSearchCity] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Yeni genişletilmiş filtreler
  const [heightRange, setHeightRange] = useState<{min?: number, max?: number}>({});
  const [weightRange, setWeightRange] = useState<{min?: number, max?: number}>({});
  const [selectedEthnicity, setSelectedEthnicity] = useState<string[]>([]);
  const [selectedBodyType, setSelectedBodyType] = useState<string[]>([]);
  const [selectedBreastSize, setSelectedBreastSize] = useState<string[]>([]);
  const [selectedHipType, setSelectedHipType] = useState<string[]>([]);
  const [selectedHairColor, setSelectedHairColor] = useState<string[]>([]);
  const [selectedEyeColor, setSelectedEyeColor] = useState<string[]>([]);

  // Toggle filtreler
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [vipOnly, setVipOnly] = useState(false);
  const [hasPhotos, setHasPhotos] = useState(false);
  const [hasVideos, setHasVideos] = useState(false);

  const escorts = mockEscorts;
  const cities = Object.keys(marmaraLocations);

  // Filtreleme mantığı
  const filteredEscorts = escorts?.filter(escort => {
    // Şehir filtresi
    if (searchCity !== 'all' && escort.city !== searchCity) return false;

    // Fiyat filtresi
    if (minPrice && escort.hourlyRate < parseFloat(minPrice)) return false;
    if (maxPrice && escort.hourlyRate > parseFloat(maxPrice)) return false;

    // Boy filtresi
    if (heightRange.min && (!escort.height || escort.height < heightRange.min)) return false;
    if (heightRange.max && (!escort.height || escort.height > heightRange.max)) return false;

    // Kilo filtresi
    if (weightRange.min && (!escort.weight || escort.weight < weightRange.min)) return false;
    if (weightRange.max && (!escort.weight || escort.weight > weightRange.max)) return false;

    // Onaylı filtresi
    if (verifiedOnly && !escort.isVerifiedByAdmin) return false;

    // VIP filtresi
    if (vipOnly && !escort.isVip) return false;

    // Fotoğraf filtresi
    if (hasPhotos && (!escort.photos || escort.photos.length === 0)) return false;

    // Video filtresi
    if (hasVideos && (!escort.videos || escort.videos.length === 0)) return false;

    // Etnik köken filtresi
    if (selectedEthnicity.length > 0) {
      const escortEthnicity = escort.ethnicity || 'Diğer';
      if (!selectedEthnicity.includes(escortEthnicity)) return false;
    }

    // Beden tipi filtresi
    if (selectedBodyType.length > 0) {
      const escortBodyType = escort.bodyType || 'Orta';
      if (!selectedBodyType.includes(escortBodyType)) return false;
    }

    // Göğüs boyutu filtresi
    if (selectedBreastSize.length > 0) {
      const escortBreastSize = escort.breastSize || 'Orta';
      if (!selectedBreastSize.includes(escortBreastSize)) return false;
    }

    // Kalça tipi filtresi
    if (selectedHipType.length > 0) {
      const escortHipType = escort.hipType || 'Orta';
      if (!selectedHipType.includes(escortHipType)) return false;
    }

    // Saç rengi filtresi
    if (selectedHairColor.length > 0) {
      const escortHairColor = escort.hairColor || 'Kahverengi';
      if (!selectedHairColor.includes(escortHairColor)) return false;
    }

    // Göz rengi filtresi
    if (selectedEyeColor.length > 0) {
      const escortEyeColor = escort.eyeColor || 'Kahverengi';
      if (!selectedEyeColor.includes(escortEyeColor)) return false;
    }

    return true;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setSearchCity('all');
    setMinPrice('');
    setMaxPrice('');
    setHeightRange({});
    setWeightRange({});
    setSelectedEthnicity([]);
    setSelectedBodyType([]);
    setSelectedBreastSize([]);
    setSelectedHipType([]);
    setSelectedHairColor([]);
    setSelectedEyeColor([]);
    setVerifiedOnly(true);
    setVipOnly(false);
    setHasPhotos(false);
    setHasVideos(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchCity !== 'all') count++;
    if (minPrice) count++;
    if (maxPrice) count++;
    if (heightRange.min || heightRange.max) count++;
    if (weightRange.min || weightRange.max) count++;
    if (selectedEthnicity.length > 0) count++;
    if (selectedBodyType.length > 0) count++;
    if (selectedBreastSize.length > 0) count++;
    if (selectedHipType.length > 0) count++;
    if (selectedHairColor.length > 0) count++;
    if (selectedEyeColor.length > 0) count++;
    if (verifiedOnly) count++;
    if (vipOnly) count++;
    if (hasPhotos) count++;
    if (hasVideos) count++;
    return count;
  };

  // Toggle helper functions
  const toggleMultiSelect = (items: string[], value: string, setter: (items: string[]) => void) => {
    if (items.includes(value)) {
      setter(items.filter(i => i !== value));
    } else {
      setter([...items, value]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${searchCity !== 'all' ? searchCity : 'Marmara'} Escort İlanları | En Seçkin Profiller`}
        description={`${searchCity !== 'all' ? searchCity : 'Marmara'} bölgesindeki en yeni ve onaylı escort ilanlarını keşfedin. VIP ve güvenilir hizmet seçenekleri.`}
        keywords={`${searchCity}, escort, ilan, vip, onaylı, marmara, istanbul, bursa, kocaeli`}
      />
      {/* Hero Header */}
      <div className="relative py-16 bg-black/40 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(217,70,239,0.05),transparent_50%)]" />
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Sparkles className="w-3 h-3 mr-2" /> KEŞFET
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">
                İLAN <span className="text-gradient">KATALOĞU</span>
              </h1>
              <p className="text-muted-foreground text-lg">Aradığınız kriterlere uygun en iyi sonuçlar.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={showFilters ? "primary" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 font-bold"
              >
                <Filter className="w-4 h-4" /> FİLTRELE
                {getActiveFilterCount() > 0 && (
                  <Badge className="bg-red-500 text-white border-0 h-5 w-5 flex items-center justify-center p-0">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
              <div className="h-10 w-px bg-white/10 mx-2" />
              <div className="text-right">
                <div className="text-2xl font-black text-primary">{filteredEscorts?.length || 0}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Sonuç Bulundu</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Filters */}
          <aside className={`lg:col-span-3 space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="glass p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" /> FİLTRELER
                </h3>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary" onClick={clearFilters}>
                  Temizle
                </Button>
              </div>

              <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                {/* Şehir Seçimi */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Şehir</label>
                  <Select value={searchCity} onValueChange={setSearchCity}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Tüm Şehirler" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Şehirler</SelectItem>
                      {cities?.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fiyat Aralığı */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Fiyat Aralığı (₺)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>

                {/* Boy Seçeneği */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                    <Ruler className="w-3 h-3" /> Boy
                  </label>
                  <div className="grid grid-cols-1 gap-1">
                    {HEIGHT_OPTIONS.map((option) => (
                      <button
                        key={option.label}
                        onClick={() => {
                          if (heightRange.min === option.min && heightRange.max === option.max) {
                            setHeightRange({});
                          } else {
                            setHeightRange({ min: option.min, max: option.max });
                          }
                        }}
                        className={`text-xs px-3 py-2 rounded-lg border transition-all text-left ${
                          heightRange.min === option.min && heightRange.max === option.max
                            ? 'border-primary bg-primary/20 text-primary font-medium'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kilo Aralığı */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                    <Weight className="w-3 h-3" /> Kilo
                  </label>
                  <div className="grid grid-cols-1 gap-1">
                    {WEIGHT_OPTIONS.map((option) => (
                      <button
                        key={option.label}
                        onClick={() => {
                          if (weightRange.min === option.min && weightRange.max === option.max) {
                            setWeightRange({});
                          } else {
                            setWeightRange({ min: option.min, max: option.max });
                          }
                        }}
                        className={`text-xs px-3 py-2 rounded-lg border transition-all text-left ${
                          weightRange.min === option.min && weightRange.max === option.max
                            ? 'border-primary bg-primary/20 text-primary font-medium'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Etnik Köken */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Etnik Köken</label>
                  <div className="flex flex-wrap gap-1">
                    {ETHNICITY_OPTIONS.map((ethnicity) => (
                      <button
                        key={ethnicity}
                        onClick={() => toggleMultiSelect(selectedEthnicity, ethnicity, setSelectedEthnicity)}
                        className={`text-xs px-2 py-1.5 rounded-full border transition-all ${
                          selectedEthnicity.includes(ethnicity)
                            ? 'border-primary bg-primary/20 text-primary'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        {ethnicity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Beden Tipi */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" /> Beden Tipi
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {BODY_TYPE_OPTIONS.map((type) => (
                      <button
                        key={type}
                        onClick={() => toggleMultiSelect(selectedBodyType, type, setSelectedBodyType)}
                        className={`text-xs px-2 py-1.5 rounded-full border transition-all ${
                          selectedBodyType.includes(type)
                            ? 'border-primary bg-primary/20 text-primary'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Göğüs Boyutu */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Göğüs Boyutu</label>
                  <div className="flex flex-wrap gap-1">
                    {BREAST_SIZE_OPTIONS.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleMultiSelect(selectedBreastSize, size, setSelectedBreastSize)}
                        className={`text-xs px-2 py-1.5 rounded-full border transition-all ${
                          selectedBreastSize.includes(size)
                            ? 'border-primary bg-primary/20 text-primary'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kalça Tipi */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Kalça Tipi</label>
                  <div className="flex flex-wrap gap-1">
                    {HIP_TYPE_OPTIONS.map((type) => (
                      <button
                        key={type}
                        onClick={() => toggleMultiSelect(selectedHipType, type, setSelectedHipType)}
                        className={`text-xs px-2 py-1.5 rounded-full border transition-all ${
                          selectedHipType.includes(type)
                            ? 'border-primary bg-primary/20 text-primary'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Saç Rengi */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                    <Palette className="w-3 h-3" /> Saç Rengi
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {HAIR_COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        onClick={() => toggleMultiSelect(selectedHairColor, color, setSelectedHairColor)}
                        className={`text-xs px-2 py-1.5 rounded-full border transition-all ${
                          selectedHairColor.includes(color)
                            ? 'border-primary bg-primary/20 text-primary'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Göz Rengi */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Göz Rengi
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {EYE_COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        onClick={() => toggleMultiSelect(selectedEyeColor, color, setSelectedEyeColor)}
                        className={`text-xs px-2 py-1.5 rounded-full border transition-all ${
                          selectedEyeColor.includes(color)
                            ? 'border-primary bg-primary/20 text-primary'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4 space-y-3">
                  {/* Quick Toggles */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={verifiedOnly}
                        onCheckedChange={setVerifiedOnly}
                        className="border-border/50"
                      />
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        Onaylı Profiller
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={vipOnly}
                        onCheckedChange={setVipOnly}
                        className="border-border/50"
                      />
                      <span className="flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 text-amber-500" />
                        Sadece VIP
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={hasPhotos}
                        onCheckedChange={setHasPhotos}
                        className="border-border/50"
                      />
                      <span className="flex items-center gap-1">
                        <SparklesIcon className="w-3.5 h-3.5 text-purple-500" />
                        Fotoğraflı
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={hasVideos}
                        onCheckedChange={setHasVideos}
                        className="border-border/50"
                      />
                      <span className="flex items-center gap-1">
                        <VideoIcon className="w-3.5 h-3.5 text-pink-500" />
                        Videolu
                      </span>
                    </label>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-primary to-accent font-bold py-6">
                  FİLTRELERİ UYGULA
                  {getActiveFilterCount() > 0 && ` (${getActiveFilterCount()})`}
                </Button>
              </div>
            </Card>

            <AdBanner
              type="vertical"
              title="REKLAM ALANI"
              description="Burada yer almak için bizimle iletişime geçin."
              className="hidden lg:block"
            />
          </aside>

          {/* Main Grid */}
          <main className="lg:col-span-9">
            {filteredEscorts && filteredEscorts.length > 0 ? (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredEscorts.map((escort, idx) => (
                      <StandardCard
                        key={escort.id}
                        escort={escort}
                        stats={escort.stats}
                        type={escort.isVerifiedByAdmin ? 'verified' : 'normal'}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Native Ad in Grid */}
                <AdBanner
                  type="horizontal"
                  title="PREMIUM ÜYELİK AVANTAJLARI"
                  description="Daha fazla görünürlük ve özel rozetler için hemen yükseltin."
                  className="my-12"
                />
              </div>
            ) : (
              <Card className="glass p-20 text-center">
                <Search className="w-20 h-20 mx-auto mb-6 text-muted-foreground/20" />
                <h3 className="text-2xl font-bold mb-2">Sonuç Bulunamadı</h3>
                <p className="text-muted-foreground mb-8">Arama kriterlerinize uygun ilan bulunamadı.</p>
                <Button onClick={clearFilters} variant="outline">Filtreleri Temizle</Button>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Video icon component
function VideoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="5 3 19 12 5 21 19" />
    </svg>
  );
}
