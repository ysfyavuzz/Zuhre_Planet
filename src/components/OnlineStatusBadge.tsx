/**
 * Online Status Badge Component
 *
 * Kullanıcının online durumunu gösteren renkli badge.
 * 4 farklı durum: online, away, busy, offline.
 *
 * @module components/OnlineStatusBadge
 * @category Components - Chat
 *
 * Features:
 * - 4 durum: online (yeşil), away (sarı), busy (kırmızı), offline (gri)
 * - Pulse animasyonu (online durumda)
 * - Tooltip ile son görülme
 * - Farklı boyutlar (sm, md, lg)
 * - Responsive tasarım
 * - Dark mode uyumlu
 *
 * @example
 * ```tsx
 * <OnlineStatusBadge
 *   status="online"
 *   lastSeen={new Date()}
 *   showTooltip={true}
 *   size="md"
 * />
 * ```
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export type OnlineStatus = 'online' | 'away' | 'busy' | 'offline';

export interface OnlineStatusBadgeProps {
  /**
   * Kullanıcının durumu
   */
  status: OnlineStatus;

  /**
   * Son görülme zamanı (offline için)
   */
  lastSeen?: Date;

  /**
   * Tooltip gösterilsin mi?
   */
  showTooltip?: boolean;

  /**
   * Badge boyutu
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Ek CSS sınıfları
   */
  className?: string;

  /**
   * Pulse animasyonu gösterilsin mi? (varsayılan: online durumda true)
   */
  showPulse?: boolean;
}

/**
 * OnlineStatusBadge Component
 *
 * Kullanıcı online durumu göstergesi.
 */
export function OnlineStatusBadge({
  status,
  lastSeen,
  showTooltip = true,
  size = 'md',
  className,
  showPulse,
}: OnlineStatusBadgeProps) {
  // Size classes
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  // Status colors and labels
  const statusConfig = {
    online: {
      color: 'bg-green-500',
      label: 'Çevrimiçi',
      showPulse: showPulse !== false,
    },
    away: {
      color: 'bg-fuchsia-500',
      label: 'Uzakta',
      showPulse: false,
    },
    busy: {
      color: 'bg-red-500',
      label: 'Meşgul',
      showPulse: false,
    },
    offline: {
      color: 'bg-gray-400 dark:bg-gray-600',
      label: 'Çevrimdışı',
      showPulse: false,
    },
  };

  const config = statusConfig[status];

  // Format last seen
  const getLastSeenText = () => {
    if (status === 'online') {
      return 'Çevrimiçi';
    }

    if (status === 'away') {
      return 'Uzakta';
    }

    if (status === 'busy') {
      return 'Meşgul';
    }

    if (lastSeen) {
      try {
        return `Son görülme: ${formatDistanceToNow(lastSeen, {
          addSuffix: true,
          locale: tr,
        })}`;
      } catch (error) {
        return 'Çevrimdışı';
      }
    }

    return 'Çevrimdışı';
  };

  const badge = (
    <div className={cn('relative inline-flex', className)}>
      {/* Main dot */}
      <motion.div
        className={cn(
          'rounded-full border-2 border-background',
          sizeClasses[size],
          config.color
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />

      {/* Pulse animation */}
      {config.showPulse && (
        <motion.div
          className={cn(
            'absolute rounded-full',
            sizeClasses[size],
            config.color,
            'opacity-75'
          )}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.75, 0, 0.75],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{getLastSeenText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Online Status Text Component
 *
 * Status badge ile birlikte metin gösterir.
 */
export interface OnlineStatusTextProps extends OnlineStatusBadgeProps {
  /**
   * Kullanıcı adı
   */
  userName?: string;

  /**
   * Sadece durum metni gösterilsin mi?
   */
  statusOnly?: boolean;
}

export function OnlineStatusText({
  status,
  lastSeen,
  size = 'md',
  className,
  userName,
  statusOnly = false,
}: OnlineStatusTextProps) {
  const statusConfig = {
    online: { label: 'Çevrimiçi', color: 'text-green-600 dark:text-green-400' },
    away: { label: 'Uzakta', color: 'text-fuchsia-600 dark:text-fuchsia-400' },
    busy: { label: 'Meşgul', color: 'text-red-600 dark:text-red-400' },
    offline: { label: 'Çevrimdışı', color: 'text-gray-500 dark:text-gray-400' },
  };

  const config = statusConfig[status];

  const getStatusText = () => {
    if (statusOnly || status !== 'offline') {
      return config.label;
    }

    if (lastSeen) {
      try {
        return `Son görülme: ${formatDistanceToNow(lastSeen, {
          addSuffix: true,
          locale: tr,
        })}`;
      } catch (error) {
        return config.label;
      }
    }

    return config.label;
  };

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <OnlineStatusBadge status={status} size={size} showTooltip={false} />
      <span className={cn('text-sm font-medium', config.color)}>
        {userName && !statusOnly && `${userName} - `}
        {getStatusText()}
      </span>
    </div>
  );
}
