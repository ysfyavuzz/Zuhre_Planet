/**
 * ContactLock Component
 *
 * Lock overlay for contact information to encourage user registration.
 * Displays locked contact details with upgrade/login call-to-action.
 * Provides secure access control for sensitive contact information.
 *
 * @module components/ContactLock
 * @category Components - Access Control
 *
 * Features:
 * - Blurred/locked contact information display
 * - Unlock button with login/signup flow
 * - VIP bypass for premium members
 * - Responsive lock overlay design
 * - Animated lock icon
 * - Upgrade CTA integration
 * - Multiple contact types support
 * - Customizable lock messages
 *
 * Use Cases:
 * - Guest users viewing escort profiles
 * - Non-VIP members accessing premium contacts
 * - Demo/preview mode for contact information
 * - Tiered access control implementation
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ContactLock
 *   phone="+90 555 123 4567"
 *   whatsapp="+90 555 123 4567"
 *   email="escort@example.com"
 *   isLocked={!isAuthenticated}
 * />
 *
 * // With VIP bypass
 * <ContactLock
 *   phone={profile.phone}
 *   whatsapp={profile.whatsapp}
 *   isLocked={!isAuthenticated && !isVip}
 *   vipBypass={isVip}
 * />
 * ```
 */

import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Lock, Phone, MessageCircle, Mail, Crown, Shield,
  Eye, EyeOff, Sparkles, ChevronRight, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Contact information types
 */
export interface ContactInfo {
  phone?: string;
  whatsapp?: string;
  email?: string;
  telegram?: string;
}

/**
 * Props for ContactLock component
 */
export interface ContactLockProps {
  /**
   * Contact information to display/lock
   */
  contact: ContactInfo;
  /**
   * Whether contact is locked for current user
   */
  isLocked: boolean;
  /**
   * Whether user has VIP access (auto-unlock)
   */
  isVip?: boolean;
  /**
   * Custom lock message
   */
  lockMessage?: string;
  /**
   * Custom unlock button text
   */
  unlockButtonText?: string;
  /**
   * Whether to show blur effect on locked content
   */
  showBlur?: boolean;
  /**
   * Size variant
   */
  size?: 'compact' | 'default' | 'large';
  /**
   * Layout direction
   */
  direction?: 'horizontal' | 'vertical';
}

/**
 * Get contact icon by type
 */
function getContactIcon(type: keyof ContactInfo) {
  const icons = {
    phone: Phone,
    whatsapp: MessageCircle,
    email: Mail,
    telegram: MessageCircle,
  };
  return icons[type] || Phone;
}

/**
 * Get contact label by type
 */
function getContactLabel(type: keyof ContactInfo): string {
  const labels = {
    phone: 'Telefon',
    whatsapp: 'WhatsApp',
    email: 'E-posta',
    telegram: 'Telegram',
  };
  return labels[type] || 'İletişim';
}

/**
 * Format phone number for display (partial when locked)
 */
function formatPhone(phone: string, isLocked: boolean): string {
  if (!isLocked) return phone;

  // Show first 3 digits only when locked
  if (phone.length >= 10) {
    return phone.substring(0, 6) + ' ** **';
  }
  return '*** *** ** **';
}

/**
 * ContactLock Component
 *
 * Displays locked contact information with unlock CTA.
 */
export default function ContactLock({
  contact,
  isLocked,
  isVip = false,
  lockMessage,
  unlockButtonText,
  showBlur = true,
  size = 'default',
  direction = 'vertical',
}: ContactLockProps) {
  const [isHovered, setIsHovered] = useState(false);

  // VIP users bypass the lock
  const effectiveLocked = isLocked && !isVip;

  // Available contact types
  const contactTypes = Object.keys(contact).filter(
    (key): key is keyof ContactInfo =>
      contact[key as keyof ContactInfo] !== undefined &&
      contact[key as keyof ContactInfo] !== ''
  );

  if (contactTypes.length === 0) {
    return null;
  }

  const sizeClasses = {
    compact: {
      container: 'p-3',
      button: 'text-xs py-1.5 px-3',
      icon: 'w-4 h-4',
      text: 'text-sm',
    },
    default: {
      container: 'p-4',
      button: 'text-sm py-2 px-4',
      icon: 'w-5 h-5',
      text: 'text-base',
    },
    large: {
      container: 'p-6',
      button: 'text-base py-3 px-6',
      icon: 'w-6 h-6',
      text: 'text-lg',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={`
        relative rounded-xl border bg-card overflow-hidden
        ${effectiveLocked ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5' : 'border-border'}
        ${direction === 'horizontal' ? 'flex items-center gap-4' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* VIP Badge - Only when VIP bypass is active */}
      {isVip && isLocked && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg">
            <Crown className="w-3 h-3 mr-1" />
            VIP
          </Badge>
        </div>
      )}

      {/* Lock Overlay - Only when locked */}
      <AnimatePresence>
        {effectiveLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/95 via-orange-500/95 to-amber-600/95 backdrop-blur-sm p-4"
          >
            {/* Lock Icon */}
            <motion.div
              animate={{
                scale: isHovered ? [1, 1.1, 1] : 1,
                rotate: isHovered ? [0, -5, 5, -5, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
              className="mb-3"
            >
              <Lock className="w-12 h-12 text-white" />
            </motion.div>

            {/* Lock Message */}
            <h4 className="text-white font-bold text-lg mb-1 text-center">
              {lockMessage || 'İletişim Bilgileri'}
            </h4>
            <p className="text-white/80 text-sm text-center mb-4 max-w-xs">
              İletişim bilgilerini görmek için giriş yapın veya ücretsiz kayıt olun
            </p>

            {/* Unlock Button */}
            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
              <Link href="/login" className="flex-1">
                <Button
                  variant="secondary"
                  size={size === 'compact' ? 'sm' : 'default'}
                  className="w-full bg-white text-amber-600 hover:bg-white/90 font-semibold"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/register-client" className="flex-1">
                <Button
                  variant="outline"
                  size={size === 'compact' ? 'sm' : 'default'}
                  className="w-full border-white text-white hover:bg-white/10"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Üye Ol
                </Button>
              </Link>
            </div>

            {/* VIP Upgrade CTA */}
            {!isVip && (
              <div className="mt-4 pt-4 border-t border-white/20 w-full max-w-xs">
                <Link href="/vip">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-white/90 hover:text-white hover:bg-white/10"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    VIP ile Eriş
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Information - Blurred when locked */}
      <div
        className={`
          ${classes.container}
          ${effectiveLocked && showBlur ? 'blur-sm select-none' : ''}
          transition-all duration-300
          ${direction === 'horizontal' ? 'flex-1' : ''}
        `}
      >
        {/* Contact Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${effectiveLocked ? 'bg-amber-500/20' : 'bg-primary/20'}`}>
              {effectiveLocked ? (
                <EyeOff className={classes.icon + ' text-amber-600'} />
              ) : (
                <Eye className={classes.icon + ' text-primary'} />
              )}
            </div>
            <div>
              <h4 className={`font-semibold ${effectiveLocked ? 'text-amber-700' : 'text-foreground'}`}>
                {effectiveLocked ? 'Kilitli İletişim' : 'İletişim Bilgileri'}
              </h4>
              {isVip && isLocked && (
                <p className="text-xs text-amber-600">VIP erişimi aktif</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Items */}
        <div className={`space-y-2 ${direction === 'horizontal' ? 'flex items-center gap-4 space-y-0' : ''}`}>
          {contactTypes.map((type) => {
            const Icon = getContactIcon(type);
            const value = contact[type];
            const label = getContactLabel(type);

            return (
              <div
                key={type}
                className={`
                  flex items-center gap-3 p-2 rounded-lg
                  ${effectiveLocked ? 'bg-amber-500/10' : 'bg-muted/30'}
                `}
              >
                <div className={`p-2 rounded-full ${effectiveLocked ? 'bg-amber-500/20' : 'bg-primary/20'}`}>
                  <Icon className={classes.icon + (effectiveLocked ? ' text-amber-600' : ' text-primary')} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs text-muted-foreground mb-0.5 ${effectiveLocked ? 'text-amber-600/70' : ''}`}>
                    {label}
                  </div>
                  <div className={`font-medium ${classes.text} truncate ${effectiveLocked ? 'text-amber-800' : 'text-foreground'}`}>
                    {type === 'phone' || type === 'whatsapp' || type === 'telegram'
                      ? formatPhone(value || '', effectiveLocked)
                      : effectiveLocked
                        ? '***@***.***'
                        : value}
                  </div>
                </div>
                {effectiveLocked && (
                  <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Lock Status Badge - When unlocked */}
        {!effectiveLocked && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/30">
              <Shield className="w-3 h-3 mr-1" />
              İletişim Bilgileri Açık
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compact version for card embedding
 */
export function ContactLockCompact({
  contact,
  isLocked,
  isVip = false,
}: {
  contact: ContactInfo;
  isLocked: boolean;
  isVip?: boolean;
}) {
  return (
    <ContactLock
      contact={contact}
      isLocked={isLocked}
      isVip={isVip}
      size="compact"
      direction="horizontal"
      showBlur={false}
    />
  );
}

/**
 * Minimal version for inline contact display
 */
export function ContactLockMinimal({
  phone,
  whatsapp,
  isLocked,
  isVip = false,
}: {
  phone?: string;
  whatsapp?: string;
  isLocked: boolean;
  isVip?: boolean;
}) {
  const effectiveLocked = isLocked && !isVip;

  return (
    <div className="flex items-center gap-2">
      {effectiveLocked ? (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <Lock className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">Kilitli</span>
        </div>
      ) : (
        <>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-700 hover:bg-green-500/20 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">{phone}</span>
            </a>
          )}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600/10 border border-green-600/30 text-green-700 hover:bg-green-600/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">WhatsApp</span>
            </a>
          )}
        </>
      )}
    </div>
  );
}
