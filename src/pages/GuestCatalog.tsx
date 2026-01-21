/**
 * GuestCatalog Page
 *
 * Limited catalog view for non-authenticated (guest) users.
 * Shows basic escort information with contact details hidden.
 * Encourages registration to unlock full access.
 *
 * @module pages/GuestCatalog
 * @category Pages - Public
 *
 * Features:
 * - Blurred/hidden contact information
 * - Limited photo preview (3 photos max)
 * - No video access
 * - Hidden age and specific details
 * - Prominent CTA for registration
 * - Filter and search functionality
 * - Responsive grid layout
 * - Guest access banner
 * - Social proof elements (view counts, ratings)
 *
 * Content Limitations:
 * - Photos: Max 3 visible (out of 10-20)
 * - Videos: None visible
 * - Contact info: Hidden
 * - Age: Hidden or shown as range
 * - Location: City only (no district)
 * - Services: Limited list
 *
 * @example
 * ```tsx
 * // Route: /guest-catalog
 * // Shows limited escort listings to non-logged-in users
 * <GuestCatalog />
 * ```
 */

import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StandardCard } from '@/components/StandardCard';
import { AdBanner } from '@/components/AdBanner';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockEscorts, mockAds } from '@/mockData';
import { useGuestAccess } from '@/hooks/useGuestAccess';
import {
  Search, MapPin, Filter, Sparkles, Lock, Eye,
  Heart, Star, Crown, Shield, ChevronDown, TrendingUp,
  Flame, Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/pages/SEO';

/**
 * Filter options for catalog
 */
interface FilterOptions {
  city: string;
  ageRange: string;
  services: string[];
  sortBy: 'newest' | 'popular' | 'rating';
}

/**
 * Guest card component with limited information
 */
function GuestLimitedCard({ escort }: { escort: any }) {
  const { accessLabel } = useGuestAccess();

  return (
    <Card className="card-premium overflow-hidden group">
      <div className="relative">
        {/* Main photo */}
        <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
          <img
            src={escort.profilePhoto || escort.avatar || 'https://via.placeholder.com/150'}
            alt={escort.displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {escort.isVip && (
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg">
                <Crown className="w-3 h-3 mr-1" />
                VIP
              </Badge>
            )}
            {escort.isVerifiedByAdmin && (
              <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <Shield className="w-3 h-3 mr-1" />
                Onaylı
              </Badge>
            )}
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="text-center text-white p-4">
              <Lock className="w-12 h-12 mx-auto mb-3" />
              <p className="font-semibold mb-2">Detayları Görmek İçin</p>
              <p className="text-sm mb-3">Ücretsiz üye olun</p>
              <Link href="/register">
                <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                  Hemen Kayıt Ol
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Limited information */}
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1">{escort.displayName}</h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span>{escort.city}</span>
        </div>

        <div className="flex items-center gap-3 text-sm mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-semibold">{escort.rating || 5.0}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>{escort.reviewCount || Math.floor(Math.random() * 500) + 100}</span>
          </div>
        </div>

        {/* Hidden details indicator */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
          <Lock className="w-3 h-3" />
          <span>Giriş yaparak tüm detayları görün</span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Guest catalog page component
 */
export default function GuestCatalog() {
  const {
    isGuest,
    accessLabel,
    shouldShowUpgradePrompt,
    getVisiblePhotoCount
  } = useGuestAccess();

  const [filters, setFilters] = useState<FilterOptions>({
    city: '',
    ageRange: '',
    services: [],
    sortBy: 'newest'
  });

  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort escorts
  const filteredEscorts = useMemo(() => {
    let result = [...mockEscorts];

    // Apply city filter
    if (filters.city) {
      result = result.filter(e => e.city === filters.city);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        // Use index as proxy for "newest" since mock data doesn't have timestamps
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
    }

    return result;
  }, [filters]);

  // Get unique cities
  const cities = useMemo(() => {
    return Array.from(new Set(mockEscorts.map(e => e.city))).sort();
  }, []);

  return (
    <ProtectedRoute accessLevel="guest" showLimitedContent={true}>
      <div className="min-h-screen bg-background">
        <SEO
          title="Escort İlanları - Türkiye'nin En Seçkin Platformu"
          description="Onaylı escort profillerini görüntüleyin. Ücretsiz üye olarak detaylı bilgilere erişin."
          keywords="escort ilanları, escort profilleri, onaylı escort, vip escort, escort bul"
        />

        {/* Guest Access Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-pink-500/20 border-b border-amber-500/30">
          <div className="container py-4">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Misafir olarak görüntülüyorsunuz. Ücretsiz üye olun veya giriş yaparak tam erişim sağlayın.
                </span>
              </div>
              <div className="flex gap-2">
                <Link href="/login">
                  <Button size="sm" variant="outline" className="h-8 border-amber-500/50 hover:bg-amber-500/10">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="h-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg">
                    Ücretsiz Kayıt
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Badge className="mb-4 px-4 py-1.5 text-xs font-bold bg-primary/10 text-primary border-primary/20 uppercase tracking-widest">
                  <TrendingUp className="w-3.5 h-3.5 mr-2" />
                  Türkiye'nin En Büyük Platformu
                </Badge>

                <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">
                  ONAYLI ESCORT<br />
                  <span className="text-gradient">PROFİLLERİ</span>
                </h1>

                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Türkiye genelinde onaylı profilleri görüntüleyin. Güvenli, gizli ve kaliteli hizmet.
                </p>

                {/* Search Box */}
                <Card className="glass shadow-2xl border-white/10 p-2 max-w-2xl mx-auto">
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="İsim, şehir ara..."
                        className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0"
                      />
                    </div>
                    <div className="h-10 w-px bg-white/10 hidden md:block self-center" />
                    <select className="bg-transparent border-none focus:ring-0 px-6 py-4 cursor-pointer">
                      <option value="">Tüm Şehirler</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <Button size="lg" className="md:px-10 py-7 bg-gradient-to-r from-primary to-accent text-lg font-bold">
                      ARA
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 border-b border-border/50">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-black text-gradient mb-1">1,240+</div>
                <div className="text-sm text-muted-foreground">Aktif Profil</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gradient mb-1">850+</div>
                <div className="text-sm text-muted-foreground">Onaylı Escort</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gradient mb-1">45K+</div>
                <div className="text-sm text-muted-foreground">Günlük Ziyaret</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gradient mb-1">%100</div>
                <div className="text-sm text-muted-foreground">Güvenli</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Bar */}
        <section className="py-6 border-b border-border/50 sticky top-16 bg-background/95 backdrop-blur-sm z-30">
          <div className="container">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filtreler
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>

                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                  className="px-4 py-2 rounded-lg border border-border/50 bg-background text-sm"
                >
                  <option value="newest">En Yeni</option>
                  <option value="popular">En Popüler</option>
                  <option value="rating">En Yüksek Oy</option>
                </select>
              </div>

              <div className="text-sm text-muted-foreground">
                {filteredEscorts.length} profil bulundu
              </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div>
                  <label className="text-sm font-medium mb-2 block">Şehir</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background"
                  >
                    <option value="">Tümü</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Yaş Aralığı</label>
                  <select
                    value={filters.ageRange}
                    onChange={(e) => setFilters({ ...filters, ageRange: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background"
                  >
                    <option value="">Tümü</option>
                    <option value="18-25">18-25</option>
                    <option value="26-35">26-35</option>
                    <option value="36-45">36-45</option>
                    <option value="46+">46+</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium mb-2 block">Hizmetler</label>
                  <div className="flex flex-wrap gap-2">
                    {['Masaj', 'Eşlik', 'Akşam Yemeği', 'Etkinlik'].map((service) => (
                      <button
                        key={service}
                        onClick={() => {
                          const newServices = filters.services.includes(service)
                            ? filters.services.filter(s => s !== service)
                            : [...filters.services, service];
                          setFilters({ ...filters, services: newServices });
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          filters.services.includes(service)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* VIP Showcase - Limited */}
        <section className="py-12 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
                  <Crown className="w-5 h-5" />
                  <span className="text-sm font-black uppercase tracking-widest">Premium</span>
                </div>
                <h2 className="text-3xl font-black tracking-tighter">VIP ESKORTLAR</h2>
              </div>
              <Link href="/register">
                <Button variant="link" className="text-amber-600 dark:text-amber-400 font-bold p-0">
                  Tümünü Gör →
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredEscorts
                .filter(e => e.isVip)
                .slice(0, 4)
                .map((escort) => (
                  <motion.div
                    key={escort.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <GuestLimitedCard escort={escort} />
                  </motion.div>
                ))}
            </div>
          </div>
        </section>

        {/* Ad Banner */}
        <section className="py-12">
          <div className="container">
            <AdBanner
              type="horizontal"
              title={mockAds[0].title}
              description={mockAds[0].description}
              imageUrl={mockAds[0].imageUrl}
              link={mockAds[0].link}
            />
          </div>
        </section>

        {/* Main Grid */}
        <section className="py-12">
          <div className="container">
            <h2 className="text-3xl font-black mb-8 tracking-tighter">TÜM İLANLAR</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredEscorts.map((escort, idx) => (
                <motion.div
                  key={escort.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                >
                  <GuestLimitedCard escort={escort} />
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
                  Daha Fazlasını Görmek İçin Üye Ol
                  <Lock className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Upgrade CTA Section */}
        {shouldShowUpgradePrompt && (
          <section className="py-16 bg-gradient-to-br from-primary/10 via-accent/10 to-pink-500/10">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center">
                <Crown className="w-16 h-16 mx-auto mb-6 text-amber-500" />
                <h2 className="text-3xl font-black mb-4">Sınırsız Erişim İçin Üye Olun</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Tüm profilleri, fotoğrafları ve iletişim bilgilerini görüntüleyin.
                  Ücretsiz kayıt olun, sınırsız erişim sağlayın.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/register">
                    <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
                      Ücretsiz Kayıt Ol
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Giriş Yap
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Safety Notice */}
        <section className="py-8 border-t border-border/50">
          <div className="container">
            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-amber-700 dark:text-amber-400 mb-2">Güvenlik Uyarısı</h3>
                    <p className="text-sm text-amber-600 dark:text-amber-300 leading-relaxed">
                      Platformumuzda bulunan tüm profiller onaylıdır. Ancak görüşme öncesi kimlik doğrulaması yapmanızı öneririz.
                      Güvenliğiniz için halka açık yerlerde buluşun ve ön ödeme talep etmeyin.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

export { GuestLimitedCard };
