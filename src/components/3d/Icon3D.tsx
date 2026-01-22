import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Icon3D - Geliştirilmiş 3D İkon Component
 * 
 * Gelişmiş 3D ikon wrapper bileşeni. 360 derece rotation, bounce animasyonu,
 * pulse glow, gradient fill ve floating efekt özellikleri içerir. İkonlar
 * ve görseller için kullanılır.
 * 
 * @module components/3d/Icon3D
 * @category Components - 3D Components
 * @author Escort Platform Team
 * @version 2.0.0
 * @since 4.0.0
 * 
 * Özellikler:
 * - 360 derece rotation animasyonu
 * - Bounce animasyon desteği
 * - Pulse glow efekti
 * - Gradient fill desteği
 * - Floating efekt animasyonu
 * - Çoklu boyut desteği (sm, md, lg, xl)
 * - Çoklu varyant desteği (primary, secondary, success, danger, neutral)
 * - Hover interaction animasyonları
 * - Wiggle/shake efekti
 * 
 * Bağımlılıklar:
 * - react
 * - framer-motion
 * - @/lib/utils
 * 
 * @example
 * ```tsx
 * // Temel kullanım
 * <Icon3D icon={<Heart />} />
 * 
 * // Glow ve float ile
 * <Icon3D icon={<Star />} glow float variant="primary" />
 * 
 * // Bounce animasyonu
 * <Icon3D icon={<Bell />} bounce size="lg" />
 * 
 * // 360 rotation
 * <Icon3D icon={<RefreshCw />} rotate360 />
 * ```
 * 
 * @see {@link Badge3D} İlgili 3D badge component
 * @see {@link Button3D} İlgili 3D buton component
 */

export interface Icon3DProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'neutral';
  glow?: boolean;
  float?: boolean;
  bounce?: boolean;
  rotate360?: boolean;
  children?: React.ReactNode;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-base',
  md: 'w-14 h-14 text-xl',
  lg: 'w-20 h-20 text-3xl',
  xl: 'w-28 h-28 text-5xl',
};

const variantClasses = {
  primary: 'bg-gradient-to-br from-pink-400 to-pink-600 text-white',
  secondary: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white',
  success: 'bg-gradient-to-br from-green-400 to-green-600 text-white',
  danger: 'bg-gradient-to-br from-red-400 to-red-600 text-white',
  neutral: 'bg-gradient-to-br from-gray-400 to-gray-600 text-white',
};

export const Icon3D = React.forwardRef<HTMLDivElement, Icon3DProps>(
  (
    {
      className,
      icon,
      size = 'md',
      variant = 'primary',
      glow = false,
      float = false,
      bounce = false,
      rotate360 = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          'rounded-2xl shadow-3d',
          
          // Size and variant
          sizeClasses[size],
          variantClasses[variant],
          
          // Glow
          glow && 'animate-pulse-glow',
          
          className
        )}
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: float ? [0, -10, 0] : 0,
          rotate: rotate360 ? 360 : 0,
          scale: bounce ? [1, 1.1, 1] : 1,
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        whileHover={{
          scale: 1.1,
          rotate: [0, -5, 5, -5, 0],
          transition: { 
            scale: { duration: 0.2 },
            rotate: { duration: 0.5 }
          }
        }}
        {...(props as any)}
      >
        {/* Top highlight */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
        
        {/* Bottom shadow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tl from-black/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-2xl" style={{
          boxShadow: 'inset 0 2px 0 rgba(255, 255, 255, 0.3), inset 0 -2px 0 rgba(0, 0, 0, 0.2)'
        }} />
        
        {/* Pulse glow ring */}
        {glow && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{
              boxShadow: [
                '0 0 20px rgba(225, 29, 72, 0.4)',
                '0 0 40px rgba(225, 29, 72, 0.6)',
                '0 0 20px rgba(225, 29, 72, 0.4)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
        
        {/* Icon */}
        <div className="relative z-10">
          {icon}
        </div>
        
        {children}
      </motion.div>
    );
  }
);

Icon3D.displayName = 'Icon3D';
