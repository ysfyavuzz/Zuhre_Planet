/**
 * EscUserProfileCard Component
 *
 * Special profile card component for escort users to manage their own profile.
 * Shows profile statistics, quick actions, and visibility status.
 * Used in escort dashboard and profile management pages.
 *
 * @module components/EscUserProfileCard
 * @category Components - Dashboard
 *
 * Features:
 * - Profile overview with photo and stats
 * - Visibility status (public/hidden/pending)
 * - Quick action buttons (edit, preview, share)
 * - Profile completion percentage
 * - Statistics display (views, favorites, bookings)
 * - VIP status indicator
 * - Last update timestamp
 * - Responsive design for all screen sizes
 *
 * @example
 * ```tsx
 * // In escort dashboard
 * <EscUserProfileCard
 *   profile={escortProfile}
 *   onEdit={() => navigate('/profile/edit')}
 *   stats={profileStats}
 * />
 * ```
 */

import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Eye, Heart, Calendar, Star, Edit, Share2, Settings,
  CheckCircle2, Clock, TrendingUp, Shield, Crown,
  AlertCircle, ChevronRight, ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Profile statistics interface
 */
export interface ProfileStats {
  views: number;
  favorites: number;
  bookings: number;
  reviews: number;
  averageRating: number;
  responseRate: number;
}

/**
 * Profile visibility status
 */
export type ProfileVisibility = 'public' | 'hidden' | 'pending' | 'suspended';

/**
 * Props for EscUserProfileCard component
 */
interface EscUserProfileCardProps {
  /**
   * Escort profile data
   */
  profile: {
    id: string;
    displayName: string;
    city: string;
    district: string;
    age?: number;
    profilePhoto?: string;
    isVip: boolean;
    isVerifiedByAdmin: boolean;
    photos?: string[];
    videos?: string[];
    hourlyRate?: number;
    rating?: number;
    reviewCount?: number;
    membership?: 'standard' | 'premium' | 'vip';
    visibility?: ProfileVisibility;
    createdAt?: string;
    lastUpdated?: string;
    completionPercentage?: number;
  };
  /**
   * Profile statistics
   */
  stats?: ProfileStats;
  /**
   * Callback when edit button is clicked
   */
  onEdit?: () => void;
  /**
   * Whether to show extended stats
   */
  showExtendedStats?: boolean;
  /**
   * Whether to show quick actions
   */
  showActions?: boolean;
}

/**
 * Get visibility badge configuration
 */
function getVisibilityConfig(visibility: ProfileVisibility) {
  const configs = {
    public: {
      label: 'Aktif',
      color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
      icon: CheckCircle2,
    },
    hidden: {
      label: 'Gizli',
      color: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
      icon: Eye,
    },
    pending: {
      label: 'Onay Bekliyor',
      color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
      icon: Clock,
    },
    suspended: {
      label: 'Askıya Alındı',
      color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
      icon: AlertCircle,
    },
  };

  return configs[visibility] || configs.hidden;
}

/**
 * Calculate profile completion percentage
 */
function calculateCompletion(profile: EscUserProfileCardProps['profile']): number {
  if (profile.completionPercentage) {
    return profile.completionPercentage;
  }

  // Calculate from available fields
  let completed = 0;
  let total = 8;

  if (profile.displayName) completed++;
  if (profile.age) completed++;
  if (profile.city) completed++;
  if (profile.district) completed++;
  if (profile.profilePhoto) completed++;
  if (profile.photos && profile.photos.length > 0) completed++;
  if (profile.hourlyRate) completed++;
  if (profile.videos && profile.videos.length > 0) completed++;

  return Math.round((completed / total) * 100);
}

/**
 * EscUserProfileCard Component
 *
 * Displays escort's own profile card with stats and actions.
 */
export default function EscUserProfileCard({
  profile,
  stats,
  onEdit,
  showExtendedStats = false,
  showActions = true,
}: EscUserProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate completion percentage
  const completion = useMemo(() => calculateCompletion(profile), [profile]);

  // Get visibility config
  const visibilityConfig = useMemo(
    () => getVisibilityConfig(profile.visibility || 'public'),
    [profile.visibility]
  );

  const VisibilityIcon = visibilityConfig.icon;

  // Format last updated
  const formattedLastUpdate = useMemo(() => {
    if (!profile.lastUpdated) return 'Son güncelleme: Bilinmiyor';

    const date = new Date(profile.lastUpdated);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Bugün güncellendi';
    if (diffDays === 1) return 'Dün güncellendi';
    if (diffDays < 7) return `${diffDays} gün önce güncellendi`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;

    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  }, [profile.lastUpdated]);

  return (
    <Card className="card-premium overflow-hidden">
      {/* Profile Header */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6">
        {/* VIP Badge */}
        {profile.isVip && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg px-3 py-1">
              <Crown className="w-3.5 h-3.5 mr-1" />
              VIP
            </Badge>
          </div>
        )}

        <div className="flex items-start gap-4">
          {/* Profile Photo */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30">
              <img
                src={profile.profilePhoto || 'https://via.placeholder.com/80'}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            {profile.isVerifiedByAdmin && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-background">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold truncate">{profile.displayName}</h3>
              <Badge variant={profile.visibility === 'public' ? 'default' : 'secondary'} className={visibilityConfig.color}>
                <VisibilityIcon className="w-3 h-3 mr-1" />
                {visibilityConfig.label}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              {profile.city}, {profile.district}
              {profile.age && ` • ${profile.age} yaş`}
            </p>

            {/* Completion Progress */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{completion}%</span>
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              Profil tamamlığı
            </p>
          </div>
        </div>

        {/* Last Update */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-4">
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedLastUpdate}</span>
        </div>
      </div>

      {/* Stats Section */}
      {(stats || showExtendedStats) && (
        <CardContent className="p-4 border-t border-border/50">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-black text-gradient mb-1">
                <Eye className="w-4 h-4" />
                <span>{stats?.views || 0}</span>
              </div>
              <div className="text-xs text-muted-foreground">Görüntülenme</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-black text-gradient mb-1">
                <Heart className="w-4 h-4" />
                <span>{stats?.favorites || 0}</span>
              </div>
              <div className="text-xs text-muted-foreground">Favori</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-black text-gradient mb-1">
                <Calendar className="w-4 h-4" />
                <span>{stats?.bookings || 0}</span>
              </div>
              <div className="text-xs text-muted-foreground">Randevu</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-black text-gradient mb-1">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{stats?.averageRating?.toFixed(1) || '5.0'}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {stats?.reviews || 0} değerlendirme
              </div>
            </div>
          </div>

          {/* Extended Stats (when expanded) */}
          {isExpanded && stats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50"
            >
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">Yanıt oranı: %{stats.responseRate || 0}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span className="text-muted-foreground">Onay durumu: Aktif</span>
              </div>
            </motion.div>
          )}
        </CardContent>
      )}

      {/* Actions */}
      {showActions && (
        <CardContent className="p-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4 mr-2" />
              Düzenle
            </Button>

            <Link href={`/escort/${profile.id}`} className="flex-1">
              <Button size="sm" variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Önizle
              </Button>
            </Link>

            {showExtendedStats && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-2"
              >
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
              </Button>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <Link href="/escort/dashboard/settings">
              <Button size="sm" variant="ghost" className="w-full justify-start text-xs">
                <Settings className="w-3.5 h-3.5 mr-1" />
                Ayarlar
              </Button>
            </Link>
            <Link href="/escort/dashboard/analytics">
              <Button size="sm" variant="ghost" className="w-full justify-start text-xs">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                Analitik
              </Button>
            </Link>
            <Link href="/escort/dashboard/bookings">
              <Button size="sm" variant="ghost" className="w-full justify-start text-xs">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                Randevular
              </Button>
            </Link>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Compact version for sidebar use
 */
export function EscUserProfileCardCompact({
  profile,
  onClick,
}: {
  profile: EscUserProfileCardProps['profile'];
  onClick?: () => void;
}) {
  const completion = useMemo(() => calculateCompletion(profile), [profile]);

  return (
    <Card
      className="card-premium hover:border-primary/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Photo */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
              <img
                src={profile.profilePhoto || 'https://via.placeholder.com/48'}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            {profile.isVerifiedByAdmin && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-background">
                <Shield className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold truncate">{profile.displayName}</h4>
              {profile.isVip && (
                <Crown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{profile.city}</p>
          </div>

          {/* Chevron */}
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Profil tamamlığı</span>
            <span>{completion}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
