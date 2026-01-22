import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Input3D - Geliştirilmiş 3D Input Component
 * 
 * Gelişmiş 3D input alanı bileşeni. Focus glow ring, animated border gradient,
 * floating label, success/error state animations ve shake on error özellikleri
 * içerir. Form inputları için kullanılır.
 * 
 * @module components/3d/Input3D
 * @category Components - 3D Components
 * @author Escort Platform Team
 * @version 2.0.0
 * @since 4.0.0
 * 
 * Özellikler:
 * - Focus glow ring animasyonu
 * - Animated border gradient efekti
 * - Floating label desteği
 * - Success/error state animasyonları
 * - Shake on error animasyonu
 * - İkon desteği (left/right)
 * - Çoklu boyut desteği (sm, md, lg)
 * - Helper text ve error message desteği
 * - İnset shadow 3D efekti
 * 
 * Bağımlılıklar:
 * - react
 * - framer-motion
 * - @/lib/utils
 * 
 * @example
 * ```tsx
 * // Temel kullanım
 * <Input3D placeholder="E-posta" />
 * 
 * // Floating label ile
 * <Input3D label="Şifre" type="password" />
 * 
 * // İkon ve helper text
 * <Input3D 
 *   label="Email" 
 *   icon={<Mail />}
 *   helperText="Email adresinizi girin"
 * />
 * 
 * // Error state
 * <Input3D 
 *   label="Telefon" 
 *   error="Geçersiz telefon numarası"
 * />
 * ```
 * 
 * @see {@link Button3D} İlgili 3D buton component
 * @see {@link Toggle3D} İlgili 3D toggle component
 */

export interface Input3DProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  inputSize?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  floatingLabel?: boolean;
}

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
};

export const Input3D = React.forwardRef<HTMLInputElement, Input3DProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      success = false,
      inputSize = 'md',
      icon,
      iconPosition = 'left',
      floatingLabel = true,
      id,
      value,
      placeholder,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!value);
    const [shake, setShake] = React.useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    React.useEffect(() => {
      if (error && !shake) {
        setShake(true);
        const timer = setTimeout(() => setShake(false), 500);
        return () => clearTimeout(timer);
      }
    }, [error]);

    React.useEffect(() => {
      setHasValue(!!value);
    }, [value]);

    const isLabelFloating = floatingLabel && (isFocused || hasValue);

    return (
      <div className="w-full">
        {!floatingLabel && label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        
        <motion.div
          className="relative"
          animate={shake ? {
            x: [0, -10, 10, -10, 10, 0],
          } : {
            scale: isFocused ? 1.01 : 1,
          }}
          transition={shake ? {
            duration: 0.5,
          } : {
            duration: 0.2,
          }}
        >
          {/* Floating label */}
          {floatingLabel && label && (
            <motion.label
              htmlFor={inputId}
              className={cn(
                'absolute left-3 pointer-events-none',
                'font-medium transition-all duration-200',
                icon && iconPosition === 'left' && 'left-10',
                error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500',
              )}
              animate={{
                top: isLabelFloating ? '0.25rem' : '50%',
                y: isLabelFloating ? 0 : '-50%',
                fontSize: isLabelFloating ? '0.75rem' : '1rem',
              }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.label>
          )}
          
          {/* Icon */}
          {icon && (
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 z-10',
                'text-gray-400 transition-colors',
                isFocused && (error ? 'text-red-500' : success ? 'text-green-500' : 'text-rose-500'),
                iconPosition === 'left' ? 'left-3' : 'right-3'
              )}
            >
              {icon}
            </div>
          )}
          
          {/* Animated border gradient */}
          {isFocused && !error && (
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, #E11D48, #F43F5E, #E11D48)',
                backgroundSize: '200% 100%',
                padding: '2px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '200% 0%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
          
          <input
            ref={ref}
            id={inputId}
            value={value}
            placeholder={floatingLabel && label ? '' : placeholder}
            className={cn(
              // Base styles
              'w-full rounded-lg border-2',
              'bg-white',
              'transition-all duration-200',
              'focus:outline-none',
              
              // 3D effect
              'shadow-inner',
              
              // Size
              sizeClasses[inputSize],
              
              // Icon padding
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              
              // Floating label padding
              floatingLabel && label && 'pt-6',
              
              // States
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : success
                ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                : 'border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200',
              
              // Disabled
              'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
              
              className
            )}
            style={{
              boxShadow: isFocused
                ? error
                  ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(239, 68, 68, 0.1)'
                  : success
                  ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(16, 185, 129, 0.1)'
                  : 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(225, 29, 72, 0.1)'
                : 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => {
              setHasValue(!!e.target.value);
              if (props.onChange) {
                props.onChange(e);
              }
            }}
            {...props}
          />
          
          {/* Inner highlight */}
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 0%, transparent 10%)',
            }}
          />
        </motion.div>
        
        {/* Helper text or error */}
        {(helperText || error) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'mt-1.5 text-sm',
              error ? 'text-red-600' : 'text-gray-500'
            )}
          >
            {error || helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Input3D.displayName = 'Input3D';
