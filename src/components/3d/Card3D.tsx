import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Card3D - Geliştirilmiş 3D Kart Component
 * 
 * Gelişmiş 3D kart bileşeni. Shine/glare overlay efekti, floating shadow,
 * parallax iç elemanlar ve gelişmiş tilt animasyonları içerir. Tüm kart
 * görünümleri için kullanılır.
 * 
 * @module components/3d/Card3D
 * @category Components - 3D Components
 * @author Escort Platform Team
 * @version 2.0.0
 * @since 4.0.0
 * 
 * Özellikler:
 * - Artırılmış perspective derinliği (1500px)
 * - Daha smooth tilt animasyonu
 * - Shine/glare overlay efekti
 * - Floating shadow animasyonu
 * - Parallax iç eleman desteği
 * - Çoklu elevation seviyesi (low, medium, high)
 * - Glow efekt desteği
 * - Hover animasyon kontrolü
 * - Özelleştirilebilir padding
 * 
 * Bağımlılıklar:
 * - react
 * - framer-motion
 * - @/lib/utils
 * 
 * @example
 * ```tsx
 * // Temel kullanım
 * <Card3D>İçerik</Card3D>
 * 
 * // Elevation ve glow
 * <Card3D elevation="high" glow>
 *   Premium içerik
 * </Card3D>
 * 
 * // Hover devre dışı
 * <Card3D hover={false} padding="lg">
 *   Sabit kart
 * </Card3D>
 * ```
 * 
 * @see {@link Button3D} İlgili 3D buton component
 * @see {@link Badge3D} İlgili 3D badge component
 */

export interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 'low' | 'medium' | 'high';
  glow?: boolean;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const elevationClasses = {
  low: 'shadow-3d',
  medium: 'shadow-3d-lg',
  high: 'shadow-3d-lg',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card3D = React.forwardRef<HTMLDivElement, Card3DProps>(
  (
    {
      className,
      elevation = 'medium',
      glow = false,
      hover = true,
      padding = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const [rotateX, setRotateX] = React.useState(0);
    const [rotateY, setRotateY] = React.useState(0);
    const [mouseX, setMouseX] = React.useState(0);
    const [mouseY, setMouseY] = React.useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hover) return;
      
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateXValue = ((y - centerY) / centerY) * -8;
      const rotateYValue = ((x - centerX) / centerX) * 8;
      
      setRotateX(rotateXValue);
      setRotateY(rotateYValue);
      setMouseX((x / rect.width) * 100);
      setMouseY((y / rect.height) * 100);
    };

    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
      setMouseX(50);
      setMouseY(50);
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          // Base styles
          'relative rounded-xl bg-gradient-to-br from-white to-gray-50',
          'border border-gray-200',
          
          // Elevation
          elevationClasses[elevation],
          
          // Padding
          paddingClasses[padding],
          
          // Glow effect
          glow && 'animate-pulse-glow',
          
          className
        )}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1500px',
        }}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
        whileHover={hover ? {
          scale: 1.02,
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.15)',
        } : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...(props as any)}
      >
        {/* Shine overlay - follows mouse */}
        <motion.div 
          className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
          style={{
            background: `radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)`,
            opacity: hover ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Gradient shine sweep */}
        <div 
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 60%)',
          }}
        />
        
        {/* Top shine */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
        
        {/* Inner shadow for depth */}
        <div className="absolute inset-0 rounded-xl shadow-inner pointer-events-none" style={{
          boxShadow: 'inset 0 2px 0 rgba(255, 255, 255, 0.15), inset 0 -2px 0 rgba(0, 0, 0, 0.1)'
        }} />
        
        {/* Content with parallax */}
        <div 
          className="relative z-10"
          style={{
            transform: hover ? `translateZ(20px)` : 'translateZ(0)',
            transition: 'transform 0.3s ease',
          }}
        >
          {children}
        </div>
        
        {/* Floating shadow */}
        <motion.div
          className="absolute -inset-4 rounded-xl -z-10 blur-xl"
          style={{
            background: 'radial-gradient(circle, rgba(0,0,0,0.15) 0%, transparent 70%)',
          }}
          animate={{
            y: hover ? 15 : 5,
            opacity: hover ? 0.5 : 0.3,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    );
  }
);

Card3D.displayName = 'Card3D';
