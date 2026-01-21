/**
 * ProtectedRoute Component
 *
 * Route-level protection component for controlling access based on authentication status and user role.
 * Displays appropriate UI (login prompt, upgrade CTA, or content) based on access rules.
 * Supports role-based access control (customer, escort, admin) and guest access limitations.
 *
 * @module components/ProtectedRoute
 * @category Components - Security
 *
 * Features:
 * - Authentication check (login required)
 * - Role-based access control (customer, escort, admin)
 * - Guest access with content limitations
 * - Custom fallback UI for unauthorized access
 * - Redirect to login with return URL
 * - VIP upgrade prompts for premium content
 * - Loading states during authentication check
 * - Configurable access rules per route
 *
 * Access Levels:
 * - 'public': No authentication required
 * - 'guest': Optional auth, limited content
 * - 'customer': Customer role required
 * - 'escort': Escort role required
 * - 'admin': Admin role required
 * - 'vip': VIP membership required
 *
 * @example
 * ```tsx
 * // Basic authentication check
 * <ProtectedRoute accessLevel="customer">
 *   <CustomerDashboard />
 * </ProtectedRoute>
 *
 * // With custom fallback
 * <ProtectedRoute accessLevel="escort" fallback={<EscortsOnly />}>
 *   <EscortProfile />
 * </ProtectedRoute>
 *
 * // Guest access with limitations
 * <ProtectedRoute accessLevel="guest" showLimitedContent={true}>
 *   <Catalog />
 * </ProtectedRoute>
 * ```
 */

import { ReactNode, useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Crown, User as UserIcon, Shield, AlertCircle, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoredRole } from '@/components/RoleSelector';
import { motion } from 'framer-motion';

/**
 * Access levels for route protection
 */
export type AccessLevel =
  | 'public'        // No authentication required
  | 'guest'         // Optional auth, limited content
  | 'customer'      // Customer role required
  | 'escort'        // Escort role required
  | 'admin'         // Admin role required
  | 'vip';          // VIP membership required

/**
 * Props for ProtectedRoute component
 */
interface ProtectedRouteProps {
  /**
   * Child components to render if access is granted
   */
  children: ReactNode;
  /**
   * Required access level for this route
   * @default 'public'
   */
  accessLevel?: AccessLevel;
  /**
   * Whether to show limited content to guests instead of blocking
   * Only applies when accessLevel is 'guest'
   * @default false
   */
  showLimitedContent?: boolean;
  /**
   * Custom fallback UI for unauthorized access
   * If not provided, default UI will be used
   */
  fallback?: ReactNode;
  /**
   * Whether to redirect to login instead of showing fallback
   * @default false
   */
  redirectToLogin?: boolean;
  /**
   * Custom message for unauthorized access
   */
  message?: string;
  /**
   * Custom title for unauthorized access UI
   */
  title?: string;
}

/**
 * Loading state component
 */
function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-muted-foreground">Kontrol ediliyor...</p>
      </div>
    </div>
  );
}

/**
 * Default unauthorized access UI
 */
function UnauthorizedAccess({
  icon: Icon,
  title,
  message,
  accessLevel,
  returnUrl
}: {
  icon: React.ElementType;
  title: string;
  message: string;
  accessLevel: AccessLevel;
  returnUrl: string;
}) {
  const getCTA = () => {
    switch (accessLevel) {
      case 'vip':
        return (
          <Link href="/vip">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg">
              <Crown className="w-5 h-5 mr-2" />
              VIP'e Geç
            </Button>
          </Link>
        );
      case 'guest':
        return (
          <div className="flex gap-3">
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
                <LogIn className="w-4 h-4 mr-2" />
                Giriş Yap
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">
                Kayıt Ol
              </Button>
            </Link>
          </div>
        );
      default:
        return (
          <Link href="/login">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
              <LogIn className="w-4 h-4 mr-2" />
              Giriş Yap
            </Button>
          </Link>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="card-premium max-w-md w-full">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
            >
              <Icon className="w-10 h-10 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">{message}</p>

            {accessLevel === 'vip' && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">
                      VIP Ayrıcalıkları
                    </p>
                    <p className="text-amber-600 dark:text-amber-300 text-xs">
                      Sınırsız fotoğraf, video ve profil detaylarına erişim.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">{getCTA()}</div>

            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Ana sayfaya dön
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

/**
 * ProtectedRoute Component
 *
 * Wraps children components with access control logic.
 * Shows appropriate UI based on authentication status and user role.
 */
export default function ProtectedRoute({
  children,
  accessLevel = 'public',
  showLimitedContent = false,
  fallback,
  redirectToLogin = false,
  message,
  title
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, viewRole } = useAuth();
  const [location] = useLocation();
  const storedRole = getStoredRole();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Simulate async check
    const timer = setTimeout(() => setIsChecking(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Still checking
  if (isLoading || isChecking) {
    return <LoadingState />;
  }

  // Public access - always render
  if (accessLevel === 'public') {
    return <>{children}</>;
  }

  // Guest access - render with optional limitations
  if (accessLevel === 'guest') {
    if (isAuthenticated) {
      // Logged in users get full content
      return <>{children}</>;
    }

    // Not logged in
    if (showLimitedContent) {
      // Show limited content to guests
      return <>{children}</>;
    }

    // Block with login prompt
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <UnauthorizedAccess
        icon={UserIcon}
        title={title || "Giriş Gerekli"}
        message={message || "Bu içeriği görmek için giriş yapmalısınız."}
        accessLevel={accessLevel}
        returnUrl={location}
      />
    );
  }

  // VIP access check
  if (accessLevel === 'vip') {
    const isVip = user?.membership === 'vip' || user?.membership === 'premium';

    if (!isAuthenticated || !isVip) {
      if (redirectToLogin) {
        // Redirect would happen here, but for now show UI
        window.location.href = `/login?return=${encodeURIComponent(location)}`;
        return <LoadingState />;
      }

      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <UnauthorizedAccess
          icon={Crown}
          title={title || "VIP Üyelik Gerekli"}
          message={message || "Bu içeriği görüntülemek için VIP üyelik gerekli."}
          accessLevel={accessLevel}
          returnUrl={location}
        />
      );
    }

    return <>{children}</>;
  }

  // Role-based access check
  if (!isAuthenticated) {
    if (redirectToLogin) {
      window.location.href = `/login?return=${encodeURIComponent(location)}`;
      return <LoadingState />;
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <UnauthorizedAccess
        icon={Lock}
        title={title || "Giriş Gerekli"}
        message={message || "Bu sayfaya erişmek için giriş yapmalısınız."}
        accessLevel={accessLevel}
        returnUrl={location}
      />
    );
  }

  // Check specific role requirements
  if (accessLevel === 'customer') {
    const isCustomer = storedRole === 'customer' || user?.role === 'user' || user?.role === 'client';

    if (!isCustomer) {
      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <UnauthorizedAccess
          icon={Shield}
          title={title || "Müşteri Gerekli"}
          message={message || "Bu sayfa sadece müşteriler içindir."}
          accessLevel={accessLevel}
          returnUrl={location}
        />
      );
    }
  }

  if (accessLevel === 'escort') {
    const isEscort = storedRole === 'escort' || user?.role === 'escort';

    if (!isEscort) {
      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <UnauthorizedAccess
          icon={Shield}
          title={title || "Escort Gerekli"}
          message={message || "Bu sayfa sadece escortlar içindir."}
          accessLevel={accessLevel}
          returnUrl={location}
        />
      );
    }
  }

  if (accessLevel === 'admin') {
    if (user?.role !== 'admin') {
      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <UnauthorizedAccess
          icon={AlertCircle}
          title={title || "Yetki Gerekli"}
          message={message || "Bu sayfaya erişmek için yönetici yetkisi gerekli."}
          accessLevel={accessLevel}
          returnUrl={location}
        />
      );
    }
  }

  // All checks passed - render children
  return <>{children}</>;
}

/**
 * HOC for wrapping components with ProtectedRoute
 */
export function withProtection<P extends object>(
  Component: React.ComponentType<P>,
  accessLevel: AccessLevel = 'public'
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute accessLevel={accessLevel}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Hook to check if current user has required access level
 */
export function useAccessLevel(requiredLevel: AccessLevel): {
  hasAccess: boolean;
  isLoading: boolean;
  reason?: string;
} {
  const { isAuthenticated, isLoading, user } = useAuth();
  const storedRole = getStoredRole();

  if (isLoading) {
    return { hasAccess: false, isLoading: true };
  }

  // Public access
  if (requiredLevel === 'public') {
    return { hasAccess: true, isLoading: false };
  }

  // Guest access
  if (requiredLevel === 'guest') {
    return { hasAccess: true, isLoading: false };
  }

  // Not authenticated
  if (!isAuthenticated) {
    return { hasAccess: false, isLoading: false, reason: 'Giriş yapmalısınız' };
  }

  // VIP access
  if (requiredLevel === 'vip') {
    const isVip = user?.membership === 'vip' || user?.membership === 'premium';
    return {
      hasAccess: isVip,
      isLoading: false,
      reason: isVip ? undefined : 'VIP üyelik gerekli'
    };
  }

  // Customer access
  if (requiredLevel === 'customer') {
    const isCustomer = storedRole === 'customer' || user?.role === 'user' || user?.role === 'client';
    return {
      hasAccess: isCustomer,
      isLoading: false,
      reason: isCustomer ? undefined : 'Bu sayfa sadece müşteriler içindir'
    };
  }

  // Escort access
  if (requiredLevel === 'escort') {
    const isEscort = storedRole === 'escort' || user?.role === 'escort';
    return {
      hasAccess: isEscort,
      isLoading: false,
      reason: isEscort ? undefined : 'Bu sayfa sadece escortlar içindir'
    };
  }

  // Admin access
  if (requiredLevel === 'admin') {
    return {
      hasAccess: user?.role === 'admin',
      isLoading: false,
      reason: user?.role === 'admin' ? undefined : 'Yönetici yetkisi gerekli'
    };
  }

  return { hasAccess: true, isLoading: false };
}
