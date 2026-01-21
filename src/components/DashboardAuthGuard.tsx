/**
 * Dashboard Auth Guard Component
 *
 * Role-based access control component for dashboard pages.
 * Ensures users can only access dashboards appropriate to their role.
 *
 * @module components/DashboardAuthGuard
 * @category Components - Auth
 *
 * Features:
 * - Role-based access control (escort vs customer vs admin)
 * - Automatic redirect to appropriate dashboard
 * - Protected route wrapper
 * - Access level validation
 * - User role detection from auth context
 * - Loading states with spinner
 * - Custom access denied messages
 * - Unauthorized redirect configuration
 *
 * @example
 * ```tsx
 * // Escort-only dashboard
 * <DashboardAuthGuard requiredRole="escort">
 *   <EscortDashboard />
 * </DashboardAuthGuard>
 *
 * // Customer-only dashboard
 * <DashboardAuthGuard requiredRole="customer">
 *   <CustomerDashboard />
 * </DashboardAuthGuard>
 *
 * // Both roles allowed
 * <DashboardAuthGuard>
 *   <SharedDashboard />
 * </DashboardAuthGuard>
 * ```
 */

import { useEffect, ReactNode, memo } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, ArrowRight, Home, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Access level types
 */
export type AccessLevel = 'customer' | 'escort' | 'admin' | 'any';

/**
 * Dashboard auth guard props
 */
interface DashboardAuthGuardProps {
  /** Required role to access the content */
  requiredRole?: AccessLevel;
  /** Child components to protect */
  children: ReactNode;
  /** Custom fallback component */
  fallback?: ReactNode;
  /** Show access denied message instead of redirect */
  showDeniedMessage?: boolean;
  /** Redirect path for unauthorized users */
  unauthorizedRedirect?: string;
  /** Custom loading component */
  loadingComponent?: ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Access denied message component
 * Memoized for performance
 */
const AccessDeniedMessage = memo(
  ({
    requiredRole,
    currentRole,
    onRedirect,
  }: {
    requiredRole?: AccessLevel;
    currentRole?: string;
    onRedirect: () => void;
  }) => {
    const roleLabels: Record<AccessLevel, string> = {
      customer: 'Müşteri',
      escort: 'Escort',
      admin: 'Yönetici',
      any: 'Kullanıcı',
    };

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Erişim Reddedildi</h1>
            <p className="text-muted-foreground mb-6">
              {requiredRole && currentRole
                ? `Bu sayfaya erişmek için ${roleLabels[requiredRole]} rolüne sahip olmalısınız. Mevcut rolünüz: ${currentRole}`
                : 'Bu sayfaya erişim yetkiniz bulunmuyor.'}
            </p>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => (window.location.href = '/')}>
                <Home className="w-4 h-4 mr-2" />
                Ana Sayfa
              </Button>
              <Button onClick={onRedirect}>
                Doğru Sayfaya Git
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }
);
AccessDeniedMessage.displayName = 'AccessDeniedMessage';

/**
 * Loading spinner component
 * Memoized for performance
 */
const LoadingSpinner = memo(() => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Shield className="w-12 h-12 text-primary" />
      </motion.div>
    </div>
  );
});
LoadingSpinner.displayName = 'LoadingSpinner';

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * DashboardAuthGuard component
 *
 * Protects dashboard routes based on user role.
 * Redirects unauthorized users to appropriate dashboard.
 *
 * Optimized with:
 * - useEffect for side effects
 * - Early returns for performance
 * - Memoized sub-components
 */
export function DashboardAuthGuard({
  requiredRole = 'any',
  children,
  fallback,
  showDeniedMessage = false,
  unauthorizedRedirect,
  loadingComponent,
}: DashboardAuthGuardProps) {
  const { user, userRole, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      window.location.href = '/login-client';
      return;
    }

    // Determine if user has access
    const hasAccess = requiredRole === 'any' || userRole === requiredRole;

    // No access - redirect or show denied message
    if (!hasAccess && !showDeniedMessage) {
      // Redirect to appropriate dashboard
      const redirectPath =
        unauthorizedRedirect ||
        (userRole === 'escort'
          ? '/escort/dashboard'
          : userRole === 'admin'
            ? '/admin/dashboard'
            : '/dashboard');
      window.location.href = redirectPath;
    }
  }, [
    isAuthenticated,
    userRole,
    requiredRole,
    showDeniedMessage,
    unauthorizedRedirect,
  ]);

  // Show loading fallback while checking auth
  if (!isAuthenticated) {
    if (loadingComponent) return <>{loadingComponent}</>;
    return <LoadingSpinner />;
  }

  // Check access
  const hasAccess = requiredRole === 'any' || userRole === requiredRole;

  // Show access denied message
  if (!hasAccess && showDeniedMessage) {
    const redirectPath =
      userRole === 'escort'
        ? '/escort/dashboard'
        : userRole === 'admin'
          ? '/admin/dashboard'
          : '/dashboard';

    return (
      <AccessDeniedMessage
        requiredRole={requiredRole}
        currentRole={userRole}
        onRedirect={() => window.location.href = redirectPath}
      />
    );
  }

  // No access - redirecting (will redirect in useEffect)
  if (!hasAccess) {
    if (fallback) return <>{fallback}</>;
    return null; // Will redirect in useEffect
  }

  // Has access - show children
  return <>{children}</>;
}

/**
 * Higher-order component version for easier use
 *
 * @example
 * ```tsx
 * // Wrap a component with auth guard
 * const ProtectedEscortDashboard = withDashboardAuthGuard(EscortDashboard, 'escort');
 *
 * // Use in route
 * <Route path="/escort/dashboard" component={ProtectedEscortDashboard} />
 * ```
 */
export function withDashboardAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: AccessLevel
) {
  const WrappedComponent = memo(function AuthGuardedComponent(props: P) {
    return (
      <DashboardAuthGuard requiredRole={requiredRole}>
        <Component {...props} />
      </DashboardAuthGuard>
    );
  });

  WrappedComponent.displayName = `withDashboardAuthGuard(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

/**
 * Hook to check if user can access a dashboard
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { canAccess, userRole } = useDashboardAccess('escort');
 *
 *   if (!canAccess) {
 *     return <div>Access denied</div>;
 *   }
 *
 *   return <EscortDashboard />;
 * }
 * ```
 */
export function useDashboardAccess(requiredRole: AccessLevel = 'any') {
  const { userRole, isAuthenticated } = useAuth();

  const canAccess = isAuthenticated && (requiredRole === 'any' || userRole === requiredRole);

  return {
    canAccess,
    userRole,
    isAuthenticated,
    isAuthorized: canAccess,
    requiredRole,
  };
}

export { DashboardAuthGuard as default };
