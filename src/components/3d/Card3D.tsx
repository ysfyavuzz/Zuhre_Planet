import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Card3D - 3D card component with elevation and depth
 * 
 * Features:
 * - 3D appearance with layered shadows
 * - Hover animation with tilt effect
 * - Multiple elevation levels
 * - Optional glow effect
 * - Customizable padding
 * 
 * @component
 * @category Components/3D
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

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hover) return;
      
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateXValue = ((y - centerY) / centerY) * -5;
      const rotateYValue = ((x - centerX) / centerX) * 5;
      
      setRotateX(rotateXValue);
      setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          // Base styles
          'relative rounded-xl bg-gradient-to-br from-white to-gray-50',
          'border border-gray-200',
          'transition-all duration-300',
          
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
        }}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        whileHover={hover ? {
          scale: 1.02,
          boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.15)',
        } : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...(props as any)}
      >
        {/* Top shine */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
        
        {/* Inner shadow for depth */}
        <div className="absolute inset-0 rounded-xl shadow-inner pointer-events-none" style={{
          boxShadow: 'inset 0 2px 0 rgba(255, 255, 255, 0.15), inset 0 -2px 0 rgba(0, 0, 0, 0.1)'
        }} />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

Card3D.displayName = 'Card3D';
