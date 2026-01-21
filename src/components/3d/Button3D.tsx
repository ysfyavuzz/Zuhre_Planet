import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * Button3D - 3D button component with depth and elevation effects
 * 
 * Features:
 * - 3D appearance with shadow layers
 * - Hover and active state animations
 * - Multiple variants and sizes
 * - Loading and disabled states
 * - Smooth transitions
 * 
 * @component
 * @category Components/3D
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

    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center gap-2',
          'font-semibold rounded-lg border-2',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2',
          
          // 3D effect
          'shadow-3d',
          
          // Disabled state
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
          
          // Variant and size
          variantClasses[variant],
          sizeClasses[size],
          
          // Full width
          fullWidth && 'w-full',
          
          className
        )}
        disabled={isDisabled}
        whileHover={!isDisabled ? { 
          y: -2,
          boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.15)'
        } : undefined}
        whileTap={!isDisabled ? { 
          y: 1,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        } : undefined}
        {...(props as any)}
      >
        {/* Top highlight */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-lg pointer-events-none" />
        
        {/* Bottom shadow */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/10 to-transparent rounded-b-lg pointer-events-none" />
        
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

Button3D.displayName = 'Button3D';
