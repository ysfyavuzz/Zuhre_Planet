/**
 * RoleSelector Component
 *
 * Modal component presented after age verification for user role selection.
 * Allows users to choose between Customer (Müşteri) and Escort (Bayan) roles.
 * Stores selection in localStorage and redirects accordingly.
 *
 * @module components/RoleSelector
 * @category Components - Navigation
 *
 * Features:
 * - Two large selection cards with icons and descriptions
 * - Customer role: Optional signup, browse showcase cards
 * - Escort role: Mandatory signup, profile access
 * - localStorage persistence for role selection
 * - Gradient buttons with hover effects
 * - Responsive design for mobile and desktop
 * - Framer Motion animations for smooth transitions
 * - Auto-redirect after selection
 *
 * User Flow:
 * - AgeVerification → RoleSelector → CustomerFlow | EscortFlow
 *
 * @example
 * ```tsx
 * // Usage in Home or after AgeVerification
 * <RoleSelector onRoleSelect={(role) => console.log(role)} />
 * ```
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles, Heart, Star, Shield } from 'lucide-react';

/**
 * User role types for platform access
 */
export type UserRole = 'customer' | 'escort' | null;

/**
 * Props for RoleSelector component
 */
interface RoleSelectorProps {
  /**
   * Callback when role is selected
   * @param role - Selected user role
   */
  onRoleSelect?: (role: UserRole) => void;
  /**
   * Whether to show the modal
   * @default true
   */
  isOpen?: boolean;
  /**
   * Whether to auto-redirect after selection
   * @default true
   */
  autoRedirect?: boolean;
}

const ROLE_STORAGE_KEY = 'user-role-selection';
const ROLE_LAST_SEEN = 'role-selection-date';

/**
 * Check if role selection is still valid (7 days)
 */
function isRoleSelectionValid(): boolean {
  const lastSeen = localStorage.getItem(ROLE_LAST_SEEN);
  if (!lastSeen) return false;

  const daysSinceSelection = (Date.now() - parseInt(lastSeen)) / (1000 * 60 * 60 * 24);
  return daysSinceSelection < 7; // Valid for 7 days
}

/**
 * Get stored role from localStorage
 */
export function getStoredRole(): UserRole {
  if (!isRoleSelectionValid()) {
    localStorage.removeItem(ROLE_STORAGE_KEY);
    localStorage.removeItem(ROLE_LAST_SEEN);
    return null;
  }

  const stored = localStorage.getItem(ROLE_STORAGE_KEY);
  return (stored === 'customer' || stored === 'escort') ? stored : null;
}

/**
 * Store role selection in localStorage
 */
function storeRole(role: UserRole) {
  if (role) {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
    localStorage.setItem(ROLE_LAST_SEEN, Date.now().toString());
  }
}

/**
 * RoleSelector Component
 *
 * Displays a modal with two large cards for role selection:
 * - Customer (Müşteri): Browse listings, optional signup
 * - Escort (Bayan): Create profile, mandatory signup
 *
 * Selection is stored and user is redirected to appropriate flow.
 */
export default function RoleSelector({
  onRoleSelect,
  isOpen = true,
  autoRedirect = true
}: RoleSelectorProps) {
  const [, navigate] = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user already selected a role
    const storedRole = getStoredRole();

    if (storedRole && autoRedirect) {
      // Redirect based on stored role
      if (storedRole === 'customer') {
        navigate('/');
      } else if (storedRole === 'escort') {
        navigate('/register-escort');
      }
      return;
    }

    // Show selector if no role stored
    if (isOpen && !storedRole) {
      setIsVisible(true);
    }
  }, [isOpen, autoRedirect, navigate]);

  const handleRoleSelect = async (role: UserRole) => {
    if (!role) return;

    setIsAnimating(true);

    // Store role selection
    storeRole(role);

    // Notify parent component
    onRoleSelect?.(role);

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 300));

    setIsVisible(false);

    // Redirect after animation
    if (autoRedirect) {
      await new Promise(resolve => setTimeout(resolve, 200));

      if (role === 'customer') {
        navigate('/');
      } else if (role === 'escort') {
        navigate('/register-escort');
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-6"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
            NASIL DEVAM ETMEK <span className="text-gradient">İSTERSİNİZ?</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Platformu kullanım amacınızı seçin. Bu seçimi daha sonra değiştirebilirsiniz.
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Customer Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="group"
          >
            <button
              onClick={() => handleRoleSelect('customer')}
              disabled={isAnimating}
              className="w-full text-left p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">MÜŞTERİ</h3>
                  <p className="text-sm text-muted-foreground">İlanları görüntüleyin</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span>Vitrin kartlarını görüntüle</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-pink-500" />
                  <span>Favorilerini kaydet</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-pink-500" />
                  <span>Güvenli randevu al</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-pink-500/10 rounded-lg p-3 border border-pink-500/20">
                💡 Üyelik isteğe bağlıdır. Misafir olarak da görebilirsiniz.
              </div>
            </button>
          </motion.div>

          {/* Escort Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="group"
          >
            <button
              onClick={() => handleRoleSelect('escort')}
              disabled={isAnimating}
              className="w-full text-left p-8 rounded-3xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 relative overflow-hidden"
            >
              {/* VIP Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white">
                PREMIUM
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">ESCORT</h3>
                  <p className="text-sm text-muted-foreground">İlan oluştur</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4 text-purple-500" />
                  <span>Profil oluştur</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-purple-500" />
                  <span>Randevu taleplerini al</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span>VIP paketlerle öne çık</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                💡 Üyelik zorunludur. Profil oluşturmak için kayıt olun.
              </div>
            </button>
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Bu seçimi daha sonra{' '}
          <a href="/profile" className="text-primary hover:underline">
            profil sayfasından
          </a>
          {' '}değiştirebilirsiniz.
        </motion.p>
      </div>
    </div>
  );
}

/**
 * Hook to check if user has selected a role
 */
export function useRoleSelection() {
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedRole = getStoredRole();
    setRole(storedRole);
    setIsLoading(false);
  }, []);

  return { role, isLoading, hasSelected: !!role };
}

/**
 * HOC to protect routes that require role selection
 */
export function withRoleSelection<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedComponent(props: P) {
    const { role, isLoading } = useRoleSelection();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      );
    }

    if (!role) {
      return <RoleSelector />;
    }

    return <Component {...props} />;
  };
}
