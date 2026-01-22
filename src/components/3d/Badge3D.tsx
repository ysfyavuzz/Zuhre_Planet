/**
 * Badge3D - 3D Badge Component
 * 
 * Özelleştirilmiş 3D badge bileşeni. Floating efekt, pulse glow, gradient arka plan
 * ve hover scale animasyonları içerir. Durum göstergeleri, etiketler ve sayaçlar için
 * kullanılır.
 * 
 * @module components/3d/Badge3D
 * @category Components - 3D Components
 * @author Escort Platform Team
 * @version 1.0.0
 * @since 4.0.0
 * 
 * Özellikler:
 * - 3D floating efekt animasyonu
 * - Pulse glow animasyonu (aktif durumlarda)
 * - Gradient arka plan desteği
 * - Hover scale animasyonu
 * - Çoklu varyant desteği (default, primary, success, warning, danger)
 * - Çoklu boyut desteği (sm, md, lg)
 * - Pulse animasyon kontrolü
 * 
 * Bağımlılıklar:
 * - react
 * - framer-motion
 * - @/lib/utils
 * 
 * @example
 * ```tsx
 * // Temel kullanım
 * <Badge3D>Yeni</Badge3D>
 * 
 * // Varyant ve boyut
 * <Badge3D variant="success" size="lg">Onaylandı</Badge3D>
 * 
 * // Pulse efekti ile
 * <Badge3D variant="danger" pulse>Acil</Badge3D>
 * 
 * // Floating efekt olmadan
 * <Badge3D float={false}>Sabit</Badge3D>
 * ```
 * 
 * @see {@link Card3D} İlgili 3D kart component
 * @see {@link Button3D} İlgili 3D buton component
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Badge3DProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  float?: boolean;
  children: React.ReactNode;
}

const variantClasses = {
  default: 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 border-gray-300',
  primary: 'bg-gradient-to-br from-rose-500 to-rose-600 text-white border-rose-600',
  success: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-600',
  warning: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-amber-600',
  danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white border-red-600',
  outline: 'bg-transparent text-gray-800 border-gray-400',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

const glowColors = {
  default: 'rgba(156, 163, 175, 0.4)',
  primary: 'rgba(225, 29, 72, 0.4)',
  success: 'rgba(16, 185, 129, 0.4)',
  warning: 'rgba(245, 158, 11, 0.4)',
  danger: 'rgba(239, 68, 68, 0.4)',
  outline: 'rgba(107, 114, 128, 0.3)',
};

export const Badge3D = React.forwardRef<HTMLDivElement, Badge3DProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      pulse = false,
      float = true,
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
          'inline-flex items-center justify-center gap-1.5',
          'font-semibold rounded-full border',
          'transition-all duration-300',
          
          // 3D effect
          'shadow-md',
          
          // Variant and size
          variantClasses[variant],
          sizeClasses[size],
          
          className
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          y: float ? [0, -4, 0] : 0,
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { duration: 0.3 },
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        whileHover={{
          scale: 1.05,
          boxShadow: pulse ? `0 0 30px ${glowColors[variant]}` : '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
        style={{
          boxShadow: pulse ? `0 0 20px ${glowColors[variant]}` : undefined,
        }}
        {...(props as any)}
      >
        {/* Top shine */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-full pointer-events-none" />
        
        {/* Content */}
        <span className="relative z-10">{children}</span>
        
        {/* Pulse animation */}
        {pulse && (
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: glowColors[variant] }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    );
  }
);

Badge3D.displayName = 'Badge3D';
