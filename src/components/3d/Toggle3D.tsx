/**
 * Toggle3D - 3D Toggle/Switch Component
 * 
 * Gelişmiş 3D toggle/switch bileşeni. 3D knob hareketi, renk geçişi,
 * aktif durumda glow efekti ve smooth animasyon özellikleri içerir.
 * Ayarlar ve tercih seçimleri için kullanılır.
 * 
 * @module components/3d/Toggle3D
 * @category Components - 3D Components
 * @author Escort Platform Team
 * @version 1.0.0
 * @since 4.0.0
 * 
 * Özellikler:
 * - 3D knob hareketi ve animasyonu
 * - Renk geçişi animasyonu (checked/unchecked)
 * - Aktif durumda glow efekti
 * - Smooth spring animasyonları
 * - Disabled state desteği
 * - Çoklu boyut desteği (sm, md, lg)
 * - Label desteği
 * - Controlled ve uncontrolled mode
 * 
 * Bağımlılıklar:
 * - react
 * - framer-motion
 * - @/lib/utils
 * 
 * @example
 * ```tsx
 * // Temel kullanım
 * <Toggle3D checked={enabled} onChange={setEnabled} />
 * 
 * // Label ile
 * <Toggle3D 
 *   checked={notifications} 
 *   onChange={setNotifications}
 *   label="Bildirimleri etkinleştir"
 * />
 * 
 * // Büyük boyut
 * <Toggle3D 
 *   size="lg"
 *   checked={premium}
 *   onChange={setPremium}
 *   label="Premium özellikler"
 * />
 * 
 * // Disabled
 * <Toggle3D checked disabled label="Devre dışı" />
 * ```
 * 
 * @see {@link Button3D} İlgili 3D buton component
 * @see {@link Input3D} İlgili 3D input component
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Toggle3DProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  labelPosition?: 'left' | 'right';
}

const sizeClasses = {
  sm: {
    container: 'w-10 h-5',
    knob: 'w-4 h-4',
    translate: 'translateX(20px)',
  },
  md: {
    container: 'w-12 h-6',
    knob: 'w-5 h-5',
    translate: 'translateX(24px)',
  },
  lg: {
    container: 'w-16 h-8',
    knob: 'w-7 h-7',
    translate: 'translateX(32px)',
  },
};

const labelSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export const Toggle3D = React.forwardRef<HTMLDivElement, Toggle3DProps>(
  (
    {
      className,
      checked = false,
      onChange,
      disabled = false,
      size = 'md',
      label,
      labelPosition = 'right',
      ...props
    },
    ref
  ) => {
    const handleToggle = () => {
      if (!disabled && onChange) {
        onChange(!checked);
      }
    };

    const { container, knob, translate } = sizeClasses[size];

    const toggleElement = (
      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          // Base styles
          'relative inline-flex items-center rounded-full',
          'transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2',
          
          // Size
          container,
          
          // Background color
          checked 
            ? 'bg-gradient-to-r from-rose-500 to-rose-600' 
            : 'bg-gradient-to-r from-gray-300 to-gray-400',
          
          // Disabled state
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer',
          
          // Shadow
          'shadow-inner',
        )}
        whileHover={!disabled ? { 
          boxShadow: checked 
            ? '0 0 20px rgba(225, 29, 72, 0.5)' 
            : '0 4px 8px rgba(0, 0, 0, 0.15)',
        } : undefined}
        whileTap={!disabled ? { scale: 0.95 } : undefined}
        style={{
          boxShadow: checked ? '0 0 15px rgba(225, 29, 72, 0.3)' : undefined,
        }}
      >
        {/* Track inner shadow */}
        <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none" 
          style={{
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        />
        
        {/* Knob */}
        <motion.div
          className={cn(
            'relative rounded-full',
            'bg-white shadow-lg',
            knob,
            'mx-0.5'
          )}
          animate={{
            x: checked ? translate : '0px',
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          {/* Knob shine */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-white/80 to-gray-100 pointer-events-none" />
          
          {/* Knob highlight */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />
        </motion.div>
      </motion.button>
    );

    if (!label) {
      return (
        <div ref={ref} className={className} {...props}>
          {toggleElement}
        </div>
      );
    }

    return (
      <div 
        ref={ref}
        className={cn(
          'inline-flex items-center gap-3',
          className
        )}
        {...props}
      >
        {labelPosition === 'left' && label && (
          <label 
            className={cn(
              'font-medium text-gray-700 select-none',
              labelSizes[size],
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            )}
            onClick={!disabled ? handleToggle : undefined}
          >
            {label}
          </label>
        )}
        
        {toggleElement}
        
        {labelPosition === 'right' && label && (
          <label 
            className={cn(
              'font-medium text-gray-700 select-none',
              labelSizes[size],
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            )}
            onClick={!disabled ? handleToggle : undefined}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Toggle3D.displayName = 'Toggle3D';
