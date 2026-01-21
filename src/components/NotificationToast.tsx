/**
 * Notification Toast Component
 *
 * Real-time toast notifications that appear on screen.
 * Supports auto-dismiss, progress bar, and custom actions.
 *
 * @module components/NotificationToast
 * @category Components - Notification
 */

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Bell,
  Star,
  Gift,
  Calendar,
  CreditCard,
  Shield,
  User,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification, NotificationCategory } from '@/types/notification';

interface NotificationToastProps {
  notification: Notification;
  onDismiss: () => void;
  onActionClick?: () => void;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
}

const CATEGORY_ICONS: Record<NotificationCategory, React.ReactNode> = {
  message: <MessageCircle className="w-5 h-5" />,
  booking: <Calendar className="w-5 h-5" />,
  review: <Star className="w-5 h-5" />,
  system: <Info className="w-5 h-5" />,
  promotion: <Gift className="w-5 h-5" />,
  security: <Shield className="w-5 h-5" />,
  payment: <CreditCard className="w-5 h-5" />,
  profile: <User className="w-5 h-5" />,
};

const CATEGORY_COLORS: Record<NotificationCategory, string> = {
  message: 'from-blue-500 to-blue-600',
  booking: 'from-purple-500 to-purple-600',
  review: 'from-yellow-500 to-yellow-600',
  system: 'from-gray-500 to-gray-600',
  promotion: 'from-pink-500 to-pink-600',
  security: 'from-red-500 to-red-600',
  payment: 'from-green-500 to-green-600',
  profile: 'from-indigo-500 to-indigo-600',
};

const PRIORITY_STYLES: Record<string, { border: string; bg: string }> = {
  low: { border: 'border-gray-300', bg: 'bg-gray-50' },
  normal: { border: 'border-blue-300', bg: 'bg-blue-50' },
  high: { border: 'border-orange-300', bg: 'bg-orange-50' },
  urgent: { border: 'border-red-400', bg: 'bg-red-50' },
};

export function NotificationToast({
  notification,
  onDismiss,
  onActionClick,
  duration = 5000,
  position = 'top-right',
  className = '',
}: NotificationToastProps) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          onDismiss();
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onDismiss, isPaused]);

  const handleActionClick = () => {
    onActionClick?.();
    onDismiss();
  };

  const categoryColor = CATEGORY_COLORS[notification.category];
  const priorityStyle = PRIORITY_STYLES[notification.priority] || PRIORITY_STYLES.normal;
  const categoryIcon = CATEGORY_ICONS[notification.category];

  return (
    <motion.div
      initial={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.9, transition: { duration: 0.3 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative w-80 sm:w-96 bg-background border-2 shadow-xl rounded-lg overflow-hidden ${priorityStyle.border} ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
        <motion.div
          className={`h-full bg-gradient-to-r ${categoryColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${categoryColor} flex items-center justify-center text-white shrink-0`}>
            {notification.icon || categoryIcon}
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-semibold text-sm line-clamp-1">{notification.title}</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 shrink-0 -mr-1 -mt-1"
                onClick={onDismiss}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {notification.body}
            </p>

            {/* Action Button */}
            {notification.actionLabel && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2 h-7 text-xs"
                onClick={handleActionClick}
              >
                {notification.actionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Priority Badge */}
      {notification.priority === 'urgent' && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-red-500 text-white text-xs">Acil</Badge>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Notification Toast Container
 * Manages multiple toasts with stacking
 */
interface NotificationToastContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onActionClick?: (notification: Notification) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  duration?: number;
  maxVisible?: number;
  className?: string;
}

export function NotificationToastContainer({
  notifications,
  onDismiss,
  onActionClick,
  position = 'top-right',
  duration = 5000,
  maxVisible = 5,
  className = '',
}: NotificationToastContainerProps) {
  const visibleNotifications = notifications.slice(0, maxVisible);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className={`fixed z-[100] ${getPositionClasses()} ${className}`}>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {visibleNotifications.map((notification) => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onDismiss={() => onDismiss(notification.id)}
              onActionClick={() => onActionClick?.(notification)}
              duration={duration}
              position={position}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
