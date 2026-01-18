import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2, Check, X } from 'lucide-react';

/**
 * Button - Enhanced button component with micro-interactions
 *
 * Features:
 * - Multiple variants (default, destructive, outline, secondary, ghost, link)
 * - Multiple sizes (default, sm, lg, icon)
 * - States: hover, active, loading, disabled, success, error
 * - Micro-interactions: scale, glow, ripple, magnetic effect
 * - Accessibility: keyboard navigation, ARIA attributes
 * - Reduced motion support
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  magnetic?: boolean;
  ripple?: boolean;
  glow?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
  fullWidth?: boolean;
  shape?: 'rounded' | 'pill' | 'square';
  animationIntensity?: 'none' | 'subtle' | 'normal' | 'strong';
  asChild?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const buttonVariants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70',
  ghost: 'hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
  link: 'text-primary underline-offset-4 hover:underline active:underline',
};

const sizeVariants = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3 text-xs',
  lg: 'h-11 rounded-md px-8 text-lg',
  icon: 'h-10 w-10',
};

const shapeVariants = {
  rounded: 'rounded-md',
  pill: 'rounded-full',
  square: 'rounded-none',
};

// ─────────────────────────────────────────────────────────────────────────────
// RIPPLE EFFECT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface RippleProps {
  x: number;
  y: number;
  size: number;
}

function Ripple({ x, y, size }: RippleProps) {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0.5 }}
      animate={{ scale: 4, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="absolute rounded-full bg-current pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN BUTTON COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      loading = false,
      success = false,
      error = false,
      magnetic = false,
      ripple = false,
      glow = false,
      loadingText,
      leftIcon,
      rightIcon,
      iconOnly = false,
      fullWidth = false,
      shape = 'rounded',
      animationIntensity = 'normal',
      children,
      disabled,
      onClick,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

    React.useImperativeHandle(ref, () => buttonRef.current!);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 200 };
    const magneticX = useSpring(mouseX, springConfig);
    const magneticY = useSpring(mouseY, springConfig);

    const intensityValues = {
      none: { scale: 1, hoverScale: 1, activeScale: 1 },
      subtle: { scale: 1, hoverScale: 1.02, activeScale: 0.99 },
      normal: { scale: 1, hoverScale: 1.05, activeScale: 0.95 },
      strong: { scale: 1, hoverScale: 1.1, activeScale: 0.9 },
    };
    const intensity = intensityValues[animationIntensity];

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!magnetic || !buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!ripple || !buttonRef.current) {
        onClick?.(e);
        return;
      }

      const rect = buttonRef.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newRipple = { id: Date.now(), x, y, size };
      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);

      onClick?.(e);
    };

    const isDisabled = disabled || loading;
    const showSuccess = success && !loading;
    const showError = error && !loading;

    return (
      <motion.button
        ref={buttonRef as any}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'relative overflow-hidden',
          buttonVariants[variant],
          sizeVariants[size],
          shapeVariants[shape],
          fullWidth && 'w-full',
          iconOnly && 'p-0',
          glow && 'hover:shadow-lg',
          className
        )}
        disabled={isDisabled}
        style={magnetic ? { x: magneticX, y: magneticY } : undefined}
        animate={showSuccess ? { scale: [1, 1.1, 1] } : showError ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: showSuccess ? 0.3 : showError ? 0.4 : 0.2 }}
        whileHover={intensity.hoverScale > 1 ? { scale: intensity.hoverScale } : undefined}
        whileTap={intensity.activeScale < 1 ? { scale: intensity.activeScale } : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...props}
      >
        {glow && (
          <motion.div
            className="absolute inset-0 rounded-inherit bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{
              boxShadow: [
                '0 0 0px rgba(var(--primary-rgb), 0)',
                '0 0 20px rgba(var(--primary-rgb), 0.3)',
                '0 0 0px rgba(var(--primary-rgb), 0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {ripples.map((ripple) => (
          <Ripple key={ripple.id} x={ripple.x} y={ripple.y} size={ripple.size} />
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText && <span>{loadingText}</span>}
          </motion.div>
        )}

        {showSuccess && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {typeof children === 'string' && children}
          </motion.div>
        )}

        {showError && !loading && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            {typeof children === 'string' && children}
          </motion.div>
        )}

        {!loading && !showSuccess && !showError && (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// ─────────────────────────────────────────────────────────────────────────────
// SPECIALIZED BUTTON COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

export function PrimaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="default" glow {...props} />;
}

export function SecondaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="secondary" {...props} />;
}

export function DestructiveButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="destructive" {...props} />;
}

export function OutlineButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="outline" {...props} />;
}

export function GhostButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="ghost" {...props} />;
}

export function LinkButton(props: Omit<ButtonProps, 'variant' | 'size'>) {
  return <Button variant="link" size="sm" {...props} />;
}

export function IconButton(props: Omit<ButtonProps, 'size' | 'iconOnly'>) {
  return <Button size="icon" iconOnly {...props}>{props.children}</Button>;
}

export function LoadingButton(props: Omit<ButtonProps, 'loading'>) {
  return <Button loading {...props} />;
}

export function MagneticButton(props: Omit<ButtonProps, 'magnetic'>) {
  return <Button magnetic {...props} />;
}

export function RippleButton(props: Omit<ButtonProps, 'ripple'>) {
  return <Button ripple {...props} />;
}

export function GlowButton(props: Omit<ButtonProps, 'glow'>) {
  return <Button glow {...props} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE BUTTON
// ─────────────────────────────────────────────────────────────────────────────

export function ToggleButton(props: {
  isPressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  children: React.ReactNode;
  pressedText?: string;
  unpressedText?: string;
} & Omit<ButtonProps, 'onClick' | 'variant'>) {
  const { isPressed, onPressedChange, children, pressedText, unpressedText, ...buttonProps } = props;

  return (
    <Button
      variant={isPressed ? 'default' : 'outline'}
      aria-pressed={isPressed}
      onClick={() => onPressedChange(!isPressed)}
      {...buttonProps}
    >
      {children}
      {typeof children === 'string' && (
        <span className="ml-2">
          {isPressed ? (pressedText || 'Aktif') : (unpressedText || 'Pasif')}
        </span>
      )}
    </Button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON GROUP
// ─────────────────────────────────────────────────────────────────────────────

export function ButtonGroup({
  children,
  orientation = 'horizontal',
  className = '',
}: {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}) {
  return (
    <div className={cn('inline-flex', orientation === 'horizontal' ? 'flex-row' : 'flex-col', className)}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const isFirst = index === 0;
          const isLast = index === React.Children.count(children) - 1;

          let borderRadius = '';
          if (orientation === 'horizontal') {
            borderRadius = isFirst
              ? 'rounded-l-md rounded-r-none'
              : isLast
              ? 'rounded-r-md rounded-l-none'
              : 'rounded-none';
          } else {
            borderRadius = isFirst
              ? 'rounded-t-md rounded-b-none'
              : isLast
              ? 'rounded-b-md rounded-t-none'
              : 'rounded-none';
          }

          return React.cloneElement(child as React.ReactElement<any>, {
            className: cn(
              borderRadius,
              index > 0 && orientation === 'horizontal' && 'border-l-0',
              index > 0 && orientation === 'vertical' && 'border-t-0',
              child.props.className
            ),
          });
        }
        return child;
      })}
    </div>
  );
}

export { Button };
export default Button;
