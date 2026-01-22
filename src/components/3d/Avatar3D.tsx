/**
 * Avatar3D - 3D Avatar Component
 * 
 * Gelişmiş 3D avatar bileşeni. Ring glow efekti, online pulse indicator,
 * hover zoom animasyonu ve border gradient özellikleri içerir. Kullanıcı
 * profil resimleri ve avatarlar için kullanılır.
 * 
 * @module components/3d/Avatar3D
 * @category Components - 3D Components
 * @author Escort Platform Team
 * @version 1.0.0
 * @since 4.0.0
 * 
 * Özellikler:
 * - 3D ring glow efekti
 * - Online/offline pulse indicator
 * - Hover zoom animasyonu
 * - Gradient border desteği
 * - Çoklu boyut desteği (xs, sm, md, lg, xl)
 * - Online durum göstergesi
 * - İnitial'ler için fallback desteği
 * - Resim yüklenme durumu
 * 
 * Bağımlılıklar:
 * - react
 * - framer-motion
 * - @/lib/utils
 * 
 * @example
 * ```tsx
 * // Temel kullanım
 * <Avatar3D src="/avatar.jpg" alt="Kullanıcı" />
 * 
 * // Online indicator ile
 * <Avatar3D 
 *   src="/avatar.jpg" 
 *   alt="Kullanıcı" 
 *   online 
 *   size="lg"
 * />
 * 
 * // Fallback ile
 * <Avatar3D fallback="AB" size="md" />
 * 
 * // Gradient border ile
 * <Avatar3D 
 *   src="/avatar.jpg" 
 *   gradient
 *   online
 * />
 * ```
 * 
 * @see {@link Badge3D} İlgili 3D badge component
 * @see {@link Card3D} İlgili 3D kart component
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Avatar3DProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  gradient?: boolean;
  fallback?: string;
}

const sizeClasses = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const indicatorSizes = {
  xs: 'w-2 h-2 bottom-0 right-0',
  sm: 'w-2.5 h-2.5 bottom-0 right-0',
  md: 'w-3 h-3 bottom-0.5 right-0.5',
  lg: 'w-4 h-4 bottom-1 right-1',
  xl: 'w-5 h-5 bottom-1.5 right-1.5',
};

const fallbackSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-3xl',
};

export const Avatar3D = React.forwardRef<HTMLDivElement, Avatar3DProps>(
  (
    {
      className,
      src,
      alt = 'Avatar',
      size = 'md',
      online = false,
      gradient = false,
      fallback,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);
    const [imageLoaded, setImageLoaded] = React.useState(false);

    const showFallback = !src || imageError || !imageLoaded;

    return (
      <motion.div
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          'rounded-full overflow-hidden',
          'border-2',
          
          // Gradient border
          gradient 
            ? 'border-transparent bg-gradient-to-br from-rose-500 via-purple-500 to-rose-500 p-0.5'
            : 'border-gray-200',
          
          // Size
          sizeClasses[size],
          
          className
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{
          scale: 1.1,
          boxShadow: gradient 
            ? '0 0 30px rgba(225, 29, 72, 0.5)' 
            : '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
        {...(props as any)}
      >
        {/* Inner container for gradient border */}
        <div className={cn(
          'relative w-full h-full rounded-full overflow-hidden',
          gradient && 'bg-white'
        )}>
          {/* Image */}
          {src && !imageError && (
            <img
              src={src}
              alt={alt}
              className={cn(
                'w-full h-full object-cover transition-opacity duration-300',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
          
          {/* Fallback */}
          {showFallback && fallback && (
            <div className={cn(
              'absolute inset-0 flex items-center justify-center',
              'bg-gradient-to-br from-gray-200 to-gray-300',
              'text-gray-600 font-semibold uppercase',
              fallbackSizes[size]
            )}>
              {fallback}
            </div>
          )}
          
          {/* Default fallback */}
          {showFallback && !fallback && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
          )}
          
          {/* Shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
        </div>
        
        {/* Online indicator */}
        {online && (
          <motion.div
            className={cn(
              'absolute rounded-full',
              'bg-emerald-500 border-2 border-white',
              'shadow-lg',
              indicatorSizes[size]
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-500"
              animate={{
                scale: [1, 1.5],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </motion.div>
        )}
      </motion.div>
    );
  }
);

Avatar3D.displayName = 'Avatar3D';
