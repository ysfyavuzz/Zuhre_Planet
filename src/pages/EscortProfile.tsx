/**
 * Escort Profile Page
 * 
 * Detailed individual escort profile page with comprehensive information display.
 * Shows photo gallery, video content, bio, services, availability, rates, and contact options.
 * Implements VIP content locks and social proof elements for premium profiles.
 * 
 * @module pages/EscortProfile
 * @category Pages - Public
 * 
 * Features:
 * - High-resolution photo gallery with fullscreen lightbox viewer
 * - Photo carousel with navigation arrows and counter
 * - Video content gallery with thumbnail previews
 * - Fullscreen video player modal with playback controls
 * - Complete bio and personal description
 * - Services offered with detailed descriptions
 * - Hourly, overnight, and custom rate displays
 * - Real-time availability status
 * - Verified badge and profile badges
 * - Review section with ratings and testimonials
 * - Recommendation and booking statistics
 * - Contact buttons (call, message, WhatsApp)
 * - Add to favorites functionality
 * - Responsive design for mobile and desktop
 * - VIP content locks for premium information
 * 
 * Profile Sections:
 * - Header: Photo, name, rating, verification badges
 * - Gallery: Photo lightbox, video gallery with modal player
 * - About: Bio, personality description, languages
 * - Services: Full service menu with pricing
 * - Availability: Schedule display
 * - Reviews: Client testimonials and ratings
 * - Contact: Multiple contact methods
 * 
 * @example
 * ```tsx
 * // Route: /escort/:id
 * // Route: /profile/:escortId
 * <EscortProfile />
 * ```
 */

import { useState, useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  MapPin, Phone, MessageCircle, Star, Eye, Calendar, ArrowLeft,
  Crown, CheckCircle2, Heart, Clock, User, Ruler, Weight,
  Palette, Eye as EyeIcon, Sparkles, Shield, Info, AlertTriangle,
  Mail, Share2, Flag, ChevronLeft, ChevronRight, X, Lock, Play,
  Video, LogIn, Edit, BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { mockMasseuses, getVisiblePhotoCount, getVisibleVideoCount, VIEW_LIMITS, type UserRole } from '@/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { getStoredRole } from '@/components/RoleSelector';
import ContactLock, { ContactLockCompact } from '@/components/ContactLock';
import PhotoGalleryEnhanced from '@/components/PhotoGalleryEnhanced';
import { ReportEscortDialog } from '@/components/ReportEscortDialog';

export default function EscortProfile() {
  const { id } = useParams<{ id: string }>();
  const { viewRole, isAuthenticated, user } = useAuth();
  const userRole = getStoredRole();

  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  // Escort profili görüntüleme kontrolü
  // Escort kullanıcıları doğrudan kendi profillerini görebilir
  // Müşteri kullanıcıları için giriş gerekli
  const isEscortViewing = userRole === 'escort';
  const requiresAuthForContact = !isAuthenticated && !isEscortViewing;

  // Mock data'dan profil bul
  const profile = mockMasseuses.find(m => m.id === id);

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="card-premium p-16 text-center max-w-2xl mx-auto">
          <AlertTriangle className="w-20 h-20 mx-auto mb-6 text-muted-foreground/30" />
          <h3 className="text-3xl font-bold mb-3">Profil Bulunamadı</h3>
          <p className="text-muted-foreground mb-8 text-lg">
            Aradığınız profil bulunamadı veya kaldırılmış olabilir.
          </p>
          <Link href="/escorts">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kataloga Dön
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Fallback değerler
  const displayProfile = {
    ...profile,
    avatar: profile.profilePhoto || 'https://via.placeholder.com/150',
    name: profile.displayName,
    location: `${profile.city}, ${profile.district}`,
    bio: 'Merhaba! Ben kaliteli zaman geçirmeyi seven, bakımlı ve zarif bir bayanım. ' +
      'Güler yüzlü ve samimi tavırlarımla sizleri rahat ettirmeyi hedefliyorum. ' +
      'Temizliğe ve hijyene önem veriyorum.',
    phone: '+90 555 123 4567',
    whatsapp: '+90 555 123 4567',
    services: ['Masaj', 'Eşlik Hizmeti', 'Akşam Yemeği', 'Etkinliklere Katılım', 'Gezi Turu'],
    languages: ['Türkçe', 'İngilizce'],
    availableDays: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    availableHours: '10:00 - 22:00',
    hairColor: 'Kahverengi',
    eyeColor: 'Kahverengi',
    bodyType: 'Atletik',
    viewCount: Math.floor(Math.random() * 500) + 100
  };

  // Profilin toplam fotoğraf ve video sayıları
  const totalPhotos = profile.photos?.length || 1;
  const totalVideos = profile.videos?.length || 0;

  // Kullanıcının görebileceği fotoğraf ve video sayıları
  const visiblePhotoCount = useMemo(
    () => getVisiblePhotoCount(totalPhotos, viewRole),
    [totalPhotos, viewRole]
  );
  const visibleVideoCount = useMemo(
    () => getVisibleVideoCount(totalVideos, viewRole),
    [totalVideos, viewRole]
  );

  // Görüntülenebilir fotoğraflar
  const visiblePhotos = profile.photos?.slice(0, visiblePhotoCount) || [displayProfile.avatar];

  // Görüntülenebilir videolar
  const visibleVideos = profile.videos?.slice(0, visibleVideoCount) || [];

  // Kilitli içerik var mı?
  const hasLockedPhotos = totalPhotos > visiblePhotoCount;
  const hasLockedVideos = totalVideos > visibleVideoCount;

  // Mevcut limitler
  const currentLimits = VIEW_LIMITS[viewRole];
  const canViewAllPhotos = !hasLockedPhotos;
  const canViewAllVideos = !hasLockedVideos;

  const nextPhoto = () => {
    if (selectedPhoto < visiblePhotos.length - 1) {
      setSelectedPhoto(prev => prev + 1);
    }
  };
  const prevPhoto = () => {
    if (selectedPhoto > 0) {
      setSelectedPhoto(prev => prev - 1);
    }
  };

  const physicalFeatures = [
    { label: 'Yaş', value: displayProfile.age, icon: User },
    { label: 'Boy', value: `${displayProfile.height} cm`, icon: Ruler },
    { label: 'Kilo', value: `${displayProfile.weight} kg`, icon: Weight },
    { label: 'Saç Rengi', value: displayProfile.hairColor, icon: Palette },
    { label: 'Göz Rengi', value: displayProfile.eyeColor, icon: EyeIcon },
    { label: 'Vücut Tipi', value: displayProfile.bodyType, icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/escorts">
              <Button variant="ghost" size="lg" className="hover:text-primary">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Geri Dön
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              {/* Escort-specific actions */}
              {isEscortViewing && (
                <>
                  <Link href="/escort/dashboard/private">
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                      <Shield className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/escort/dashboard/analytics">
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analitik
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                </>
              )}
              <Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsReportDialogOpen(true)}
                title="İhbar Et"
              >
                <Flag className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* View Role Banner - Show when user has limited access */}
      {!canViewAllPhotos && (
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/30">
          <div className="container py-3">
            <div className="flex items-center justify-center gap-3">
              <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                {currentLimits.label} olarak {visiblePhotoCount} fotoğraf görebilirsiniz.
              </span>
              <Link href="/vip">
                <Button size="sm" variant="outline" className="h-7 text-xs border-amber-500/50 hover:bg-amber-500/10">
                  <Crown className="w-3 h-3 mr-1" />
                  VIP'e Geç
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="container py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Photos */}
            <div className="lg:col-span-2 space-y-4">
              {/* Main Photo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="card-premium overflow-hidden group">
                  <div className="aspect-[4/3] relative bg-gradient-to-br from-primary/10 to-accent/10">
                    <img
                      src={visiblePhotos[selectedPhoto]}
                      alt={displayProfile.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setIsGalleryOpen(true)}
                    />

                    {/* Navigation Arrows */}
                    {visiblePhotos.length > 1 && (
                      <>
                        <button
                          onClick={prevPhoto}
                          disabled={selectedPhoto === 0}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextPhoto}
                          disabled={selectedPhoto === visiblePhotos.length - 1}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}

                    {/* Photo Counter with lock status */}
                    <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/70 text-white text-sm">
                      {selectedPhoto + 1} / {hasLockedPhotos ? `${visiblePhotoCount}+` : totalPhotos}
                      {hasLockedPhotos && <Lock className="w-3 h-3 inline ml-1 text-amber-400" />}
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {displayProfile.isVip && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg animate-pulse px-3 py-1">
                          <Crown className="w-4 h-4 mr-1" />
                          VIP
                        </Badge>
                      )}
                      {displayProfile.isVerifiedByAdmin && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg px-3 py-1">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Onaylı
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Thumbnail Grid with Lock Overlays */}
              <div className="grid grid-cols-5 gap-2">
                {visiblePhotos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhoto(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${selectedPhoto === index
                      ? 'border-primary shadow-lg scale-105'
                      : 'border-border/50 hover:border-primary/50'
                      }`}
                  >
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}

                {/* Locked Photo Thumbnails */}
                {hasLockedPhotos && [...Array(Math.min(5, totalPhotos - visiblePhotoCount))].map((_, index) => (
                  <div
                    key={`locked-${index}`}
                    className="aspect-square rounded-lg overflow-hidden border-2 border-border/50 relative bg-muted/20 group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80">
                      <Link href="/vip">
                        <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                          <Crown className="w-4 h-4 mr-1" />
                          Aç
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Videos Section */}
              {totalVideos > 0 && (
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-primary" />
                      Videolar
                      <span className="text-sm font-normal text-muted-foreground">
                        ({hasLockedVideos ? `${visibleVideoCount}/${totalVideos}+` : `${totalVideos}/${totalVideos}`})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {visibleVideos.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {visibleVideos.map((video, index) => (
                          <div
                            key={index}
                            className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer group"
                            onClick={() => setSelectedVideo(index)}
                          >
                            <video
                              src={video}
                              className="w-full h-full object-cover"
                              poster={profile.photos?.[0] || displayProfile.avatar}
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-8 h-8 text-white fill-white ml-1" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Lock className="w-12 h-12 mx-auto mb-3 text-amber-500/50" />
                        <p className="text-muted-foreground mb-4">
                          Videoları görüntülemek için üye olmalısınız.
                        </p>
                        <Link href="/login">
                          <Button className="bg-gradient-to-r from-primary to-accent">
                            Giriş Yap
                          </Button>
                        </Link>
                      </div>
                    )}

                    {/* Locked Videos */}
                    {hasLockedVideos && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(Math.min(3, totalVideos - visibleVideoCount))].map((_, index) => (
                          <div
                            key={`locked-video-${index}`}
                            className="relative aspect-video rounded-lg overflow-hidden bg-muted/20 border border-dashed border-border/50 group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center">
                              <div className="text-center">
                                <Lock className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                                <p className="text-xs text-muted-foreground px-2">Kilitli</p>
                              </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80">
                              <Link href="/vip">
                                <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                  <Crown className="w-4 h-4 mr-1" />
                                  VIP'e Geç
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Details Tabs */}
              <Card className="card-premium">
                <CardContent className="p-6">
                  <Tabs defaultValue="about" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="about">Hakkında</TabsTrigger>
                      <TabsTrigger value="services">Hizmetler</TabsTrigger>
                      <TabsTrigger value="reviews">Yorumlar</TabsTrigger>
                    </TabsList>

                    <TabsContent value="about" className="space-y-6 mt-6">
                      {/* Bio */}
                      <div>
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                          <Info className="w-5 h-5 text-primary" />
                          Hakkımda
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{displayProfile.bio}</p>
                      </div>

                      <Separator />

                      {/* Physical Features */}
                      <div>
                        <h3 className="font-bold text-lg mb-4">Fiziksel Özellikler</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {physicalFeatures.map((feature) => {
                            const Icon = feature.icon;
                            return (
                              <div key={feature.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                <div className="p-2 rounded-lg bg-primary/10">
                                  <Icon className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">{feature.label}</div>
                                  <div className="font-semibold">{feature.value}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Languages */}
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-bold text-lg mb-3">Konuşulan Diller</h3>
                          <div className="flex flex-wrap gap-2">
                            {displayProfile.languages.map((lang) => (
                              <Badge key={lang} variant="secondary" className="px-3 py-1">{lang}</Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    </TabsContent>

                    <TabsContent value="services" className="space-y-6 mt-6">
                      <div>
                        <h3 className="font-bold text-lg mb-4">Sunulan Hizmetler</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {displayProfile.services.map((service) => (
                            <div key={service} className="flex items-center gap-2 p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-sm">{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Availability */}
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-bold text-lg mb-3">Müsaitlik</h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                              <Calendar className="w-5 h-5 text-primary" />
                              <div>
                                <div className="text-sm text-muted-foreground">Çalışma Günleri</div>
                                <div className="font-semibold">{displayProfile.availableDays.join(', ')}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                              <Clock className="w-5 h-5 text-primary" />
                              <div>
                                <div className="text-sm text-muted-foreground">Çalışma Saatleri</div>
                                <div className="font-semibold">{displayProfile.availableHours}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-6">
                      <div className="text-center py-12">
                        <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                        <h3 className="text-xl font-bold mb-2">Henüz Yorum Yok</h3>
                        <p className="text-muted-foreground">Bu profil için henüz değerlendirme yapılmamış.</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Contact & Info */}
            <div className="space-y-6">
              {/* Profile Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="card-premium">
                  <CardContent className="p-6">
                    <h1 className="text-3xl font-bold mb-3">{displayProfile.name}</h1>

                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{displayProfile.location}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-sky-500 fill-sky-500" />
                        <span className="font-bold">{displayProfile.rating || 5.0}</span>
                        <span className="text-sm text-muted-foreground">(128 yorum)</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        {displayProfile.viewCount} görüntülenme
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Price */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                      <div className="text-sm text-muted-foreground mb-1">Saatlik Ücret</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          ₺{displayProfile.hourlyRate}
                        </span>
                        <span className="text-muted-foreground">/saat</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle className="text-lg">İletişim</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Contact Lock Component */}
                    <ContactLock
                      contact={{
                        phone: displayProfile.phone,
                        whatsapp: displayProfile.whatsapp,
                      }}
                      isLocked={requiresAuthForContact}
                      isVip={user?.membership === 'vip'}
                      lockMessage="İletişim Bilgileri Kilidi"
                    />

                    {/* Additional Actions - Only visible when unlocked */}
                    {!requiresAuthForContact && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Mesaj
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Calendar className="w-4 h-4 mr-2" />
                          Randevu
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Safety Warning */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="card-premium border-amber-500/20 bg-amber-500/5">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">Güvenlik Uyarısı</p>
                        <p className="text-amber-600 dark:text-amber-300 text-xs leading-relaxed">
                          Görüşme öncesi kimlik doğrulaması yapın. Ön ödeme talep eden kişilere güvenmeyin.
                          Güvenliğiniz için halka açık yerlerde buluşun.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upgrade CTA for non-VIP users */}
              {!canViewAllPhotos && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="card-premium bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
                    <CardContent className="p-6 text-center">
                      <Crown className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                      <h3 className="text-xl font-bold mb-2">VIP'e Geçin</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Tüm {totalPhotos} fotoğrafı ve {totalVideos} videoyu sınırsız görüntüleyin.
                      </p>
                      <Link href="/vip">
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg">
                          <Crown className="w-4 h-4 mr-2" />
                          VIP Üyelik Al
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery Modal - Enhanced */}
      <PhotoGalleryEnhanced
        photos={visiblePhotos.map((url, index) => ({
          id: `photo-${index}`,
          url,
          caption: displayProfile.name,
          views: Math.floor(Math.random() * 500) + 100,
          likes: Math.floor(Math.random() * 100) + 20,
          isPrimary: index === 0,
        }))}
        initialIndex={selectedPhoto}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        canEdit={isEscortViewing}
        showShare={true}
        showDownload={canViewAllPhotos}
      />

      {/* Video Modal */}
      {selectedVideo !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full max-w-4xl">
            <video
              src={visibleVideos[selectedVideo]}
              controls
              autoPlay
              className="w-full rounded-lg shadow-2xl"
              poster={profile.photos?.[0] || displayProfile.avatar}
            />
          </div>
        </div>
      )}

      {/* Report Dialog */}
      <ReportEscortDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        escortId={displayProfile.id}
        escortName={displayProfile.name}
        escortPhoto={displayProfile.avatar}
      />
    </div>
  );
}
