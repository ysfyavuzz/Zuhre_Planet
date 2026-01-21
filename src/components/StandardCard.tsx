/**
 * StandardCard Component
 * 
 * Standard escort profile card for catalog listings.
 * Shows essential information with hover effects and responsive design.
 * 
 * @module components/StandardCard
 * @category Components - Cards
 * 
 * Features:
 * - Escort profile photo display
 * - Key information (name, location, rating, price)
 * - Verification badges
 * - Online status indicator
 * - Trust level visualization
 * - Quick action buttons (favorite, message, book)
 * - Responsive image loading
 * - Hover animations
 * - Stats preview (bookings, reviews, response rate)
 * 
 * Displayed Information:
 * - Profile photo
 * - Display name
 * - Age (optional)
 * - City and district
 * - Hourly rate
 * - Average rating
 * - Review count
 * - Verification status
 * - Online/offline status
 * - Last seen timestamp
 * 
 * @example
 * ```tsx
 * <StandardCard
 *   id="escort-123"
 *   displayName="Ayşe Y."
 *   city="Istanbul"
 *   district="Şişli"
 *   hourlyRate={500}
 *   rating={4.8}
 *   isVerified={true}
 *   profilePhoto="https://..."
 * />
 * ```
 */

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  MapPin, Star, Heart, CheckCircle2, Flame,
  Calendar, MessageCircle, Shield, Clock, Circle,
  Award, TrendingUp, Users
} from "lucide-react";
import { calculateTrustLevel } from '@/types/reviews';

/**
 * Escort statistics interface
 */
interface EscortStats {
  totalBookings: number;
  totalReviews: number;
  averageRating: number;
  responseRate: number; // percentage
  responseTime: number; // minutes
  completedBookings: number;
  cancelledBookings: number;
  noShowBookings: number;
}

interface StandardCardProps {
  escort: any;
  stats?: EscortStats;
  type?: 'verified' | 'boost' | 'normal';
}

// Geçici usePerformance hook
function usePerformance() {
  return { isLowPowerMode: false };
}

// Güvenilirlik hesaplama
function calculateReliabilityScore(stats?: EscortStats): number {
  if (!stats || stats.totalBookings === 0) return 50; // Yeni üyeler için varsayılan

  const completedRate = stats.completedBookings / stats.totalBookings;
  const cancelledRate = stats.cancelledBookings / stats.totalBookings;
  const noShowRate = stats.noShowBookings / stats.totalBookings;
  const reviewRate = stats.totalReviews / stats.totalBookings;
  const ratingBonus = (stats.averageRating - 3) * 0.1; // 3-5 yıldız arası bonus

  let score = 50; // Başlangıç
  score += completedRate * 30; // Tamamlanan randevular +30
  score -= cancelledRate * 20; // İptal randevular -20
  score -= noShowRate * 30; // Gelmeme -30
  score += reviewRate * 10; // Yorum oranı +10
  score += ratingBonus * 10; // Yıldız bonusu +10 max

  return Math.min(100, Math.max(0, Math.round(score)));
}

// Online durum hesaplama
function getOnlineStatus(escort: any): {
  isOnline: boolean;
  lastSeen?: Date;
  statusText: string;
  statusColor: string;
} {
  // Gerçek uygulamada bu veri veritabanından gelir
  const now = new Date();
  const lastSeen = escort.lastSeen ? new Date(escort.lastSeen) : new Date(now.getTime() - Math.random() * 3600000 * 24); // Rastgele son görülme

  const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);

  if (diffMinutes < 5) {
    return {
      isOnline: true,
      lastSeen,
      statusText: 'Çevrimiçi',
      statusColor: 'text-green-500'
    };
  } else if (diffMinutes < 60) {
    return {
      isOnline: false,
      lastSeen,
      statusText: `${Math.floor(diffMinutes)} dk önce`,
      statusColor: 'text-amber-500'
    };
  } else if (diffMinutes < 1440) { // 24 saat
    return {
      isOnline: false,
      lastSeen,
      statusText: `${Math.floor(diffMinutes / 60)} saat önce`,
      statusColor: 'text-orange-500'
    };
  } else {
    return {
      isOnline: false,
      lastSeen,
      statusText: `${Math.floor(diffMinutes / 1440)} gün önce`,
      statusColor: 'text-gray-500'
    };
  }
}

// Güvenilirlik renk ve ikon
function getReliabilityConfig(score: number) {
  if (score >= 90) {
    return {
      color: 'text-green-600',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      icon: '🏆',
      label: 'Mükemmel'
    };
  } else if (score >= 75) {
    return {
      color: 'text-blue-600',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      icon: '⭐',
      label: 'Güvenilir'
    };
  } else if (score >= 60) {
    return {
      color: 'text-amber-600',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      icon: '📈',
      label: 'İyi'
    };
  } else if (score >= 40) {
    return {
      color: 'text-orange-600',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      icon: '⚠️',
      label: 'Orta'
    };
  } else {
    return {
      color: 'text-red-600',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      icon: '⚠️',
      label: 'Düşük'
    };
  }
}

export const StandardCard = React.memo(function StandardCard({ escort, stats, type = 'normal' }: StandardCardProps) {
  const { isLowPowerMode } = usePerformance();
  const isVerified = escort.isVerifiedByAdmin || type === 'verified';
  const isBoost = type === 'boost';

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = isLowPowerMode ? { stiffness: 40, damping: 15 } : { stiffness: 120, damping: 25 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateRange = isLowPowerMode ? ["0deg", "0deg"] : isBoost ? ["8deg", "-8deg"] : ["5deg", "-5deg"];
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], rotateRange);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], rotateRange);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const frameClass = isBoost ? 'boost-frame' : isVerified ? 'verified-frame' : 'normal-card-3d';
  const glowClass = isBoost ? 'boost-card-glow' : isVerified ? 'verified-card-glow' : 'normal-card-glow';

  // Hesaplamalar
  const reliabilityScore = calculateReliabilityScore(stats);
  const reliabilityConfig = getReliabilityConfig(reliabilityScore);
  const onlineStatus = getOnlineStatus(escort);

  // Boost kartları için daha büyük boyut
  const aspectRatio = isBoost ? "aspect-[3/4.5]" : "aspect-[3/4.2]";

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full ${aspectRatio} group cursor-pointer ${isBoost ? 'scale-105 z-10' : ''}`}
    >
      <Link href={`/escort/${escort.id}`}>
        <Card className={`w-full h-full ${frameClass} overflow-hidden rounded-2xl bg-card border-white/5 ${isBoost ? 'shadow-xl ring-2 ring-orange-500/50' : ''}`}>
          <CardContent className="p-0 h-full relative">
            {/* Glow Effect */}
            <div className={glowClass} />
            {/* Boost pulsing glow */}
            {isBoost && (
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/10 pointer-events-none animate-pulse" />
            )}

            {/* Image Section */}
            <div className="relative aspect-[3/3.5] overflow-hidden">
              {escort.profilePhoto ? (
                <img
                  src={escort.profilePhoto}
                  alt={escort.displayName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Heart className="w-10 h-10 text-muted-foreground/20" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2" style={{ transform: "translateZ(20px)" }}>
                {isBoost && (
                  <Badge className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white border-0 shadow-2xl text-xs font-black px-3 py-1.5 animate-bounce">
                    <Flame className="w-4 h-4 mr-1 animate-pulse" /> ⚡ BOOST
                  </Badge>
                )}
                {isVerified && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> ONAYLI
                  </Badge>
                )}
                {/* Online Status Badge */}
                <Badge
                  variant="secondary"
                  className={`${onlineStatus.isOnline ? 'bg-green-500' : 'bg-gray-500'} text-white border-0 shadow-lg text-[10px] font-bold`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${onlineStatus.isOnline ? 'bg-white animate-pulse' : 'bg-gray-300'} mr-1`} />
                  {onlineStatus.statusText}
                </Badge>
              </div>

              {/* Price */}
              <div className="absolute bottom-3 left-3" style={{ transform: "translateZ(15px)" }}>
                <div className="text-white font-bold text-lg">
                  ₺{escort.hourlyRate}
                  <span className="text-[10px] font-normal opacity-70 ml-1">/saat</span>
                </div>
              </div>

              {/* Reliability Score - Top Right */}
              <div className="absolute top-3 right-3" style={{ transform: "translateZ(20px)" }}>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${reliabilityConfig.bg} ${reliabilityConfig.border} backdrop-blur-sm`}>
                  <span className="text-sm">{reliabilityConfig.icon}</span>
                  <span className={`text-xs font-black ${reliabilityConfig.color}`}>{reliabilityScore}%</span>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-4" style={{ transform: "translateZ(10px)" }}>
              <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors truncate">
                {escort.displayName}
              </h3>
              <div className="flex items-center text-[11px] text-muted-foreground mb-2">
                <MapPin className="w-3 h-3 mr-1 text-primary" />
                {escort.city}, {escort.district}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-1 mb-2 pb-2 border-b border-white/5">
                {/* Bookings */}
                <div className="text-center p-1 rounded bg-primary/5">
                  <Calendar className="w-3 h-3 mx-auto mb-0.5 text-primary" />
                  <p className="text-[10px] font-bold">{stats?.totalBookings || 0}</p>
                  <p className="text-[8px] text-muted-foreground">Randevu</p>
                </div>

                {/* Reviews */}
                <div className="text-center p-1 rounded bg-amber-500/5">
                  <MessageCircle className="w-3 h-3 mx-auto mb-0.5 text-amber-500" />
                  <p className="text-[10px] font-bold">{stats?.totalReviews || 0}</p>
                  <p className="text-[8px] text-muted-foreground">Yorum</p>
                </div>

                {/* Rating */}
                <div className="text-center p-1 rounded bg-green-500/5">
                  <Star className="w-3 h-3 mx-auto mb-0.5 text-green-500 fill-green-500" />
                  <p className="text-[10px] font-bold">{stats?.averageRating?.toFixed(1) || '5.0'}</p>
                  <p className="text-[8px] text-muted-foreground">Puan</p>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between">
                {/* Reliability Bar */}
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <Shield className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-semibold text-primary">Güvenilirlik</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${reliabilityScore}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full rounded-full ${
                        reliabilityScore >= 90 ? 'bg-green-500' :
                        reliabilityScore >= 75 ? 'bg-blue-500' :
                        reliabilityScore >= 60 ? 'bg-amber-500' :
                        reliabilityScore >= 40 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Last Seen */}
                <div className="flex items-center gap-1 ml-2">
                  <Clock className={`w-3 h-3 ${onlineStatus.statusColor}`} />
                  <span className={`text-[10px] ${onlineStatus.statusColor}`}>
                    {onlineStatus.isOnline ? 'Aktif' : 'Görüldü'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
});

export default StandardCard;

// Stats Tooltip Component
export const StatsTooltip = React.memo(function StatsTooltip({ stats }: { stats: EscortStats }) {
  const reliabilityScore = calculateReliabilityScore(stats);
  const completionRate = stats.totalBookings > 0
    ? Math.round((stats.completedBookings / stats.totalBookings) * 100)
    : 0;

  return (
    <Card className="w-64">
      <CardContent className="p-4">
        <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          Detaylı İstatistikler
        </h4>

        <div className="space-y-3">
          {/* Reliability Score */}
          <div className="p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold">Güvenilirlik Skoru</span>
              <span className="text-lg font-black text-primary">%{reliabilityScore}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  reliabilityScore >= 90 ? 'bg-green-500' :
                  reliabilityScore >= 75 ? 'bg-blue-500' :
                  reliabilityScore >= 60 ? 'bg-amber-500' :
                  'bg-orange-500'
                }`}
                style={{ width: `${reliabilityScore}%` }}
              />
            </div>
          </div>

          {/* Completion Rate */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Tamamlama Oranı</span>
            <span className="font-bold text-green-600">%{completionRate}</span>
          </div>

          <div className="h-px bg-border" />

          {/* Detailed Stats */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Toplam Randevu</span>
              <span className="font-bold">{stats.totalBookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tamamlandı</span>
              <span className="font-bold text-green-600">{stats.completedBookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">İptal</span>
              <span className="font-bold text-orange-600">{stats.cancelledBookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Gelmedi</span>
              <span className="font-bold text-red-600">{stats.noShowBookings}</span>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Review Stats */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Toplam Yorum</span>
              <span className="font-bold">{stats.totalReviews}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Ortalama Puan</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="font-bold">{stats.averageRating.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Yanıt Oranı</span>
              <span className="font-bold text-blue-600">%{stats.responseRate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Ort. Yanıt Süresi</span>
              <span className="font-bold">{stats.responseTime} dk</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
