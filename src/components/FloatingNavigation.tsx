/**
 * Floating Navigation Bar - Minimal Frosted Glass Design
 * 
 * Modern, minimalist alt navigasyon çubuğu.
 * Buzlu cam (frosted glass) efekti ile saydam görünüm.
 * 3D derinlik efektleri ve yumuşak animasyonlar.
 * 
 * @module components/FloatingNavigation
 * @category Components - Navigation
 * 
 * Features:
 * - Frosted glass / buzlu cam efekti
 * - Kompakt ve daraltılmış tasarım
 * - 3D derinlik efektleri
 * - Scroll ile gizlenme/gösterilme
 * - İçeriğe engel olmayan pozisyon
 * - Responsive tasarım
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, Heart, MessageSquare, Crown,
  Search, Bell, User, Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  requireAuth?: boolean;
  badge?: number;
}

const NavItemButton = ({
  item,
  isActive
}: {
  item: NavItem;
  isActive: boolean;
}) => {
  const Icon = item.icon;

  return (
    <Link href={item.href}>
      <motion.div
        whileHover={{ scale: 1.1, y: -3 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative flex flex-col items-center justify-center 
          px-3 py-2 rounded-xl cursor-pointer
          transition-all duration-300
          ${isActive
            ? 'bg-white/20 shadow-lg shadow-white/10'
            : 'hover:bg-white/10'
          }
        `}
      >
        {/* 3D Icon Container */}
        <div className={`
          relative p-1.5 rounded-lg
          ${isActive
            ? 'text-white'
            : 'text-white/70 group-hover:text-white/90'
          }
        `}>
          <Icon className={`
            w-5 h-5 transition-all duration-300
            ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}
          `} />

          {/* Badge */}
          {item.badge && item.badge > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 
                         bg-gradient-to-r from-pink-500 to-rose-500 
                         rounded-full flex items-center justify-center
                         shadow-lg shadow-pink-500/50"
            >
              <span className="text-[10px] font-bold text-white">
                {item.badge > 9 ? '9+' : item.badge}
              </span>
            </motion.div>
          )}
        </div>

        {/* Label */}
        <span className={`
          text-[10px] font-medium mt-0.5 transition-all duration-300
          ${isActive
            ? 'text-white'
            : 'text-white/60'
          }
        `}>
          {item.label}
        </span>

        {/* Active Indicator - 3D Line */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 
                       w-8 h-0.5 rounded-full
                       bg-gradient-to-r from-transparent via-white to-transparent
                       shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          />
        )}
      </motion.div>
    </Link>
  );
};

export const FloatingNavigation = React.memo(function FloatingNavigation() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll hide/show logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems: NavItem[] = [
    { icon: Home, label: 'Ana Sayfa', href: '/' },
    { icon: Users, label: 'İlanlar', href: '/escorts' },
    { icon: Crown, label: 'VIP', href: '/vip' },
    { icon: Heart, label: 'Favoriler', href: '/favorites', requireAuth: true, badge: 0 },
    { icon: MessageSquare, label: 'Mesajlar', href: '/messages', requireAuth: true, badge: 3 },
  ];

  const visibleNavItems = navItems.filter(item => !item.requireAuth || isAuthenticated);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 35
          }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {/* Main Navigation Container */}
          <div className="relative">
            {/* Outer Glow - 3D Depth */}
            <div className="absolute -inset-2 rounded-3xl 
                            bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 
                            blur-xl opacity-60" />

            {/* Navigation Bar */}
            <div className="
              relative flex items-center gap-1 px-3 py-2
              rounded-2xl overflow-hidden
              border border-white/20
              shadow-[0_8px_32px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.2)]
            "
              style={{
                background: 'rgba(30, 20, 50, 0.6)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              {/* Glass Reflection - Top */}
              <div className="absolute inset-x-0 top-0 h-px 
                              bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              {/* Glass Reflection - Inner Glow */}
              <div className="absolute inset-0 
                              bg-gradient-to-b from-white/10 to-transparent 
                              pointer-events-none" />

              {/* Bottom Shadow for 3D depth */}
              <div className="absolute inset-x-0 bottom-0 h-px 
                              bg-gradient-to-r from-transparent via-black/20 to-transparent" />

              {/* Logo */}
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-9 h-9 
                             rounded-xl mr-2
                             bg-gradient-to-br from-purple-500 to-pink-600
                             shadow-lg shadow-purple-500/40"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
              </Link>

              {/* Separator */}
              <div className="w-px h-8 bg-white/10 mr-2" />

              {/* Nav Items */}
              <div className="flex items-center gap-0.5">
                {visibleNavItems.map((item) => (
                  <NavItemButton
                    key={item.href}
                    item={item}
                    isActive={location === item.href ||
                      (item.href !== '/' && location.startsWith(item.href))}
                  />
                ))}
              </div>

              {/* Separator */}
              <div className="w-px h-8 bg-white/10 ml-2" />

              {/* Action Buttons */}
              <div className="flex items-center gap-1 ml-2">
                {/* Search */}
                <Link href="/escorts">
                  <motion.button
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg text-white/60 hover:text-white 
                               hover:bg-white/10 transition-all"
                  >
                    <Search className="w-4 h-4" />
                  </motion.button>
                </Link>

                {/* Notifications */}
                <Link href="/messages">
                  <motion.button
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2 rounded-lg text-white/60 hover:text-white 
                               hover:bg-white/10 transition-all"
                  >
                    <Bell className="w-4 h-4" />
                    {isAuthenticated && (
                      <span className="absolute top-1 right-1 w-2 h-2 
                                       bg-pink-500 rounded-full" />
                    )}
                  </motion.button>
                </Link>

                {/* Profile */}
                <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                  <motion.button
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg text-white/60 hover:text-white 
                               hover:bg-white/10 transition-all"
                  >
                    <User className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default FloatingNavigation;
