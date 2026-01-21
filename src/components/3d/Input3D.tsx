import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Input3D - 3D input field with depth and focus effects
 * 
 * Features:
 * - 3D appearance with inset shadow
 * - Focus state with glow
 * - Error and success states
 * - Label and helper text
 * - Multiple sizes
 * 
 * @component
 * @category Components/3D
 */

export interface Input3DProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  inputSize?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
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
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        
        <motion.div
          className={cn(
            'relative rounded-lg',
            'transition-all duration-200',
          )}
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
        >
          {/* Icon */}
          {icon && (
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 z-10',
                'text-gray-400',
                iconPosition === 'left' ? 'left-3' : 'right-3'
              )}
            >
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
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
              
              // States
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : success
                ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                : 'border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200',
              
              // Disabled
              'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
              
              className
            )}
            style={{
              boxShadow: isFocused
                ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(236, 72, 153, 0.1)'
                : 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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
