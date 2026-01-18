import * as React from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Check, X, Search, AlertCircle, Loader2 } from 'lucide-react';

/**
 * Input - Enhanced input component with micro-interactions
 *
 * Features:
 * - Floating label animation
 * - Focus border expand animation
 * - Error shake animation
 * - Success checkmark
 * - Password visibility toggle
 * - Loading state
 * - Character counter
 * - Clear button
 * - Icon prefix/suffix
 * - Multiple input types (text, password, search, number, email, tel)
 * - Accessibility: ARIA attributes, keyboard navigation
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input variant style
   */
  variant?: 'default' | 'filled' | 'outlined' | 'underlined';

  /**
   * Input size
   */
  size?: 'sm' | 'default' | 'lg';

  /**
   * Floating label
   */
  label?: string;

  /**
   * Error message
   */
  error?: string;

  /**
   * Success state
   */
  success?: boolean;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Show character counter
   */
  showCount?: boolean;

  /**
   * Max length for counter
   */
  maxLength?: number;

  /**
   * Show clear button
   */
  clearable?: boolean;

  /**
   * Icon to display on the left
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to display on the right
   */
  rightIcon?: React.ReactNode;

  /**
   * Container className
   */
  containerClassName?: string;

  /**
   * Input is in error state (triggers shake animation)
   */
  isError?: boolean;

  /**
   * Animation intensity
   */
  animationIntensity?: 'none' | 'subtle' | 'normal';
}

// ─────────────────────────────────────────────────────────────────────────────
// INPUT VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const variantStyles = {
  default: 'bg-background border border-input',
  filled: 'bg-muted border-0 border-b-2 border-input rounded-b-none',
  outlined: 'bg-transparent border-2 border-input',
  underlined: 'bg-transparent border-0 border-b-2 border-input rounded-none px-0',
};

const sizeStyles = {
  sm: 'h-8 text-sm px-2',
  default: 'h-10 text-sm px-3',
  lg: 'h-12 text-base px-4',
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN INPUT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      variant = 'default',
      size = 'default',
      type = 'text',
      label,
      error,
      success = false,
      loading = false,
      showCount = false,
      maxLength,
      clearable = false,
      leftIcon,
      rightIcon,
      isError = false,
      animationIntensity = 'normal',
      value,
      onChange,
      onFocus,
      onBlur,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);
    const controls = useAnimation();

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    // Get current value (controlled or uncontrolled)
    const currentValue = value !== undefined ? value : internalValue;

    // Shake animation on error
    React.useEffect(() => {
      if (isError) {
        controls.start({
          x: [0, -10, 10, -10, 10, -10, 10, 0],
          transition: { duration: 0.5 },
        });
      }
    }, [isError, controls]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    // Handle clear
    const handleClear = () => {
      const event = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>;
      setInternalValue('');
      onChange?.(event);
      inputRef.current?.focus();
    };

    // Determine if password type
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    // Calculate character count
    const charCount = String(currentValue || '').length;
    const isNearLimit = maxLength && charCount >= maxLength * 0.9;
    const isAtLimit = maxLength && charCount >= maxLength;

    // Focus/blur handlers
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Animation intensity values
    const intensityValues = {
      none: { scale: 1, borderScale: 1 },
      subtle: { scale: 1.005, borderScale: 1.5 },
      normal: { scale: 1.01, borderScale: 2 },
    };
    const intensity = intensityValues[animationIntensity];

    return (
      <div className={cn('relative w-full', containerClassName)}>
        {/* Floating Label */}
        {label && (
          <motion.label
            htmlFor={props.id}
            className={cn(
              'absolute left-3 pointer-events-none transition-all duration-200',
              variant === 'underlined' && 'left-0',
              size === 'sm' && 'text-xs',
              size === 'default' && 'text-sm',
              size === 'lg' && 'text-base',
              isFocused || currentValue
                ? variant === 'underlined'
                  ? '-top-5 text-xs'
                  : '-top-2.5 left-2 bg-background px-1 text-xs'
                : size === 'sm'
                ? 'top-2'
                : size === 'default'
                ? 'top-2.5'
                : 'top-3.5',
              error || isError
                ? 'text-destructive'
                : success
                ? 'text-green-500'
                : 'text-muted-foreground'
            )}
            animate={{
              scale: isFocused ? intensity.borderScale : 1,
            }}
          >
            {label}
          </motion.label>
        )}

        {/* Input Container */}
        <motion.div
          className="relative"
          animate={isError ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Glow effect on focus */}
          {isFocused && animationIntensity !== 'none' && (
            <motion.div
              className={cn(
                'absolute inset-0 rounded-xl opacity-20 blur-lg -z-10',
                error || isError ? 'bg-destructive' : success ? 'bg-green-500' : 'bg-primary'
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: intensity.borderScale, opacity: 0.2 }}
              transition={{ duration: 0.2 }}
            />
          )}

          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Main Input */}
          <input
            ref={inputRef}
            type={inputType}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled || loading}
            maxLength={maxLength}
            className={cn(
              // Base styles
              'flex w-full rounded-xl transition-all duration-200',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none',
              // Disabled
              'disabled:cursor-not-allowed disabled:opacity-50',
              // Variant
              variantStyles[variant],
              // Size
              sizeStyles[size],
              // Left icon padding
              leftIcon && 'pl-10',
              // Right icons padding
              (clearable && currentValue) || isPassword || rightIcon || success || loading ? 'pr-10' : '',
              // Border color
              (error || isError)
                ? 'border-destructive focus:border-destructive'
                : success
                ? 'border-green-500 focus:border-green-500'
                : 'focus:border-primary',
              // Focus ring
              'focus:ring-2',
              (error || isError)
                ? 'focus:ring-destructive/20'
                : success
                ? 'focus:ring-green-500/20'
                : 'focus:ring-primary/20',
              // Custom className
              className
            )}
            {...props}
          />

          {/* Right Side Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Loading */}
            {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}

            {/* Success Checkmark */}
            {success && !loading && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="text-green-500"
              >
                <Check className="w-4 h-4" />
              </motion.div>
            )}

            {/* Error Icon */}
            {(error || isError) && !loading && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.3 }}
                className="text-destructive"
              >
                <AlertCircle className="w-4 h-4" />
              </motion.div>
            )}

            {/* Clear Button */}
            {clearable && currentValue && !loading && !success && !(error || isError) && (
              <motion.button
                type="button"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: isHovered || isFocused ? 1 : 0.5 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}

            {/* Password Toggle */}
            {isPassword && !loading && !success && !(error || isError) && (
              <motion.button
                type="button"
                initial={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </motion.button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && !loading && !success && !(error || isError) && !isPassword && (
              <div className="text-muted-foreground">{rightIcon}</div>
            )}
          </div>
        </motion.div>

        {/* Character Counter */}
        {showCount && (maxLength || showCount) && (
          <motion.div
            className={cn(
              'absolute right-3 -bottom-5 text-xs transition-colors',
              isAtLimit ? 'text-destructive' : isNearLimit ? 'text-amber-500' : 'text-muted-foreground'
            )}
            animate={{ scale: isFocused ? 1.05 : 1 }}
          >
            {charCount}
            {maxLength && ` / ${maxLength}`}
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-1 mt-1.5 text-sm text-destructive"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

// ─────────────────────────────────────────────────────────────────────────────
// SPECIALIZED INPUT COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SearchInput - Search input with icon
 */
export function SearchInput(props: Omit<InputProps, 'leftIcon' | 'type'>) {
  return (
    <Input
      type="text"
      leftIcon={<Search className="w-4 h-4" />}
      clearable
      {...props}
    />
  );
}

/**
 * PasswordInput - Password input with toggle
 */
export function PasswordInput(props: Omit<InputProps, 'type'>) {
  return <Input type="password" {...props} />;
}

/**
 * EmailInput - Email input with validation
 */
export function EmailInput(props: Omit<InputProps, 'type' | 'leftIcon'>) {
  return (
    <Input
      type="email"
      leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
      {...props}
    />
  );
}

/**
 * PhoneInput - Phone input with Turkish formatting
 */
export function PhoneInput(props: Omit<InputProps, 'type' | 'leftIcon'>) {
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    if (digits.length <= 8) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
  };

  return (
    <Input
      type="tel"
      leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
      onChange={(e) => {
        const formatted = formatPhone(e.target.value);
        props.onChange?.({ ...e, target: { ...e.target, value: formatted } } as React.ChangeEvent<HTMLInputElement>);
      }}
      placeholder="(555) 123-4567"
      maxLength={15}
      {...props}
    />
  );
}

/**
 * NumberInput - Number input with controls
 */
export function NumberInput(props: Omit<InputProps, 'type'> & {
  min?: number;
  max?: number;
  step?: number;
}) {
  const { min, max, step = 1, value, onChange, ...inputProps } = props;

  const increment = () => {
    const newValue = Number(value || 0) + step;
    if (!max || newValue <= max) {
      onChange?.({ target: { value: String(newValue) } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const decrement = () => {
    const newValue = Number(value || 0) - step;
    if (!min || newValue >= min) {
      onChange?.({ target: { value: String(newValue) } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="relative flex items-center">
      <Input type="number" min={min} max={max} step={step} value={value} onChange={onChange} {...inputProps} />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
        <button
          type="button"
          onClick={increment}
          disabled={max !== undefined && Number(value) >= max}
          className="p-0.5 hover:bg-accent rounded disabled:opacity-50"
          tabIndex={-1}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
        </button>
        <button
          type="button"
          onClick={decrement}
          disabled={min !== undefined && Number(value) <= min}
          className="p-0.5 hover:bg-accent rounded disabled:opacity-50"
          tabIndex={-1}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>
    </div>
  );
}

/**
 * TextAreaInput - Multi-line text input
 */
export function TextAreaInput(props: Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> & {
  label?: string;
  error?: string;
  success?: boolean;
  showCount?: boolean;
  maxLength?: number;
  containerClassName?: string;
  autoResize?: boolean;
}) {
  const {
    className,
    containerClassName,
    label,
    error,
    success,
    showCount = false,
    maxLength,
    autoResize = false,
    value,
    onChange,
    onFocus,
    onBlur,
    rows = 3,
    ...textareaProps
  } = props;

  const [isFocused, setIsFocused] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  React.useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, autoResize]);

  const charCount = String(value || '').length;

  return (
    <div className={cn('relative w-full', containerClassName)}>
      {/* Label */}
      {label && (
        <label
          className={cn(
            'block text-sm font-medium mb-1.5 transition-colors',
            error ? 'text-destructive' : success ? 'text-green-500' : 'text-foreground'
          )}
        >
          {label}
        </label>
      )}

      {/* Textarea */}
      <motion.textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          'flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-none',
          error ? 'border-destructive focus:border-destructive' : success ? 'border-green-500' : '',
          className
        )}
        animate={isFocused ? { scale: 1.005 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
        {...(textareaProps as any)}
      />

      {/* Character Counter */}
      {showCount && (maxLength || showCount) && (
        <div className={cn(
          'absolute right-3 bottom-2 text-xs',
          charCount >= (maxLength || Infinity) ? 'text-destructive' : 'text-muted-foreground'
        )}>
          {charCount}{maxLength && ` / ${maxLength}`}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1 mt-1.5 text-sm text-destructive">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export { Input };
export default Input;
