import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Icon3D - 3D icon wrapper with depth and animation
 * 
 * Features:
 * - 3D appearance with layered shadows
 * - Floating animation
 * - Multiple sizes and variants
 * - Glow effect option
 * - Hover interactions
 * 
 * @component
 * @category Components/3D
 */

export interface Icon3DProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'neutral';
  glow?: boolean;
  float?: boolean;
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
          'transition-all duration-300',
          
          // Size and variant
          sizeClasses[size],
          variantClasses[variant],
          
          // Glow
          glow && 'animate-pulse-glow',
          
          // Float
          float && 'animate-float',
          
          className
        )}
        whileHover={{
          scale: 1.1,
          rotate: [0, -5, 5, -5, 0],
          transition: { duration: 0.5 }
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
