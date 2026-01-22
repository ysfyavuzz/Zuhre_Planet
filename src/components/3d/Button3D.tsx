import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * Button3D - Geliştirilmiş 3D Buton Component
 * 
 * Gelişmiş 3D buton bileşeni. Press efekti, ripple animasyonu, gradient shine
 * sweep, hover glow ve active state depth özellikleri içerir. Tüm aksiyon
 * butonları için kullanılır.
 * 
 * @module components/3d/Button3D
 * @category Components - 3D Components
 * @author Escort Platform Team
 * @version 2.0.0
 * @since 4.0.0
 * 
 * Özellikler:
 * - Geliştirilmiş 3D görünüm ve gölge katmanları
 * - Press efekti (translateY + scale) animasyonu
 * - Ripple click animasyonu
 * - Gradient shine sweep efekti
 * - Hover floating glow efekti
 * - Active state depth animasyonu
 * - Çoklu varyant desteği (primary, secondary, success, danger, outline)
 * - Çoklu boyut desteği (sm, md, lg)
 * - Loading ve disabled state desteği
 * - Smooth cubic-bezier transitions
 * 
 * Bağımlılıklar:
 * - react
 * - framer-motion
 * - lucide-react
 * - @/lib/utils
 * 
 * @example
 * ```tsx
 * // Temel kullanım
 * <Button3D>Gönder</Button3D>
 * 
 * // Varyant ve boyut
 * <Button3D variant="success" size="lg">Kaydet</Button3D>
 * 
 * // Loading state
 * <Button3D loading>Yükleniyor...</Button3D>
 * 
 * // Full width
 * <Button3D fullWidth variant="primary">Devam Et</Button3D>
 * ```
 * 
 * @see {@link Card3D} İlgili 3D kart component
 * @see {@link Input3D} İlgili 3D input component
 */

export interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-gradient-to-b from-pink-500 to-pink-600 text-white border-pink-600 hover:from-pink-600 hover:to-pink-700',
  secondary: 'bg-gradient-to-b from-purple-500 to-purple-600 text-white border-purple-600 hover:from-purple-600 hover:to-purple-700',
  success: 'bg-gradient-to-b from-green-500 to-green-600 text-white border-green-600 hover:from-green-600 hover:to-green-700',
  danger: 'bg-gradient-to-b from-red-500 to-red-600 text-white border-red-600 hover:from-red-600 hover:to-red-700',
  outline: 'bg-gradient-to-b from-white to-gray-50 text-gray-900 border-gray-300 hover:from-gray-50 hover:to-gray-100',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const Button3D = React.forwardRef<HTMLButtonElement, Button3DProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;

      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = { x, y, id: Date.now() };
      setRipples((prev) => [...prev, ripple]);
      
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);

      if (props.onClick) {
        props.onClick(e);
      }
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center gap-2',
          'font-semibold rounded-lg border-2 overflow-hidden',
          'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2',
          
          // 3D effect
          'shadow-3d',
          
          // Transform style for 3D
          'transform-gpu',
          
          // Disabled state
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
          
          // Variant and size
          variantClasses[variant],
          sizeClasses[size],
          
          // Full width
          fullWidth && 'w-full',
          
          className
        )}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        disabled={isDisabled}
        whileHover={!isDisabled ? { 
          y: -4,
          scale: 1.02,
          boxShadow: '0 12px 24px rgba(225, 29, 72, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        } : undefined}
        whileTap={!isDisabled ? { 
          y: 0,
          scale: 0.98,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        } : undefined}
        onClick={handleClick}
        {...props}
      >
        {/* Gradient shine sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.2) 50%, transparent 60%)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '200% 0%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        {/* Top highlight */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-lg pointer-events-none" />
        
        {/* Bottom shadow */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/10 to-transparent rounded-b-lg pointer-events-none" />
        
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 0,
              height: 0,
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
        
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

Button3D.displayName = 'Button3D';
