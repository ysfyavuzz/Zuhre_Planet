/**
 * Cosmic Floating Navigator
 * 
 * Temaya uygun açılır/kapanır floating navigation bileşeni.
 * Kozmik tema ile uyumlu glass-morphism, glow efektleri ve smooth animasyonlar.
 * 
 * @module components/CosmicNav
 * @category Components - Navigation
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Search, 
  Heart, 
  MessageCircle, 
  User, 
  Menu, 
  X,
  Crown,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  requiresAuth?: boolean;
}

export function CosmicNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const navItems: NavItem[] = [
    { href: '/', icon: Home, label: 'Ana Sayfa' },
    { href: '/escorts', icon: Search, label: 'Keşfet' },
    { href: '/favorites', icon: Heart, label: 'Favoriler', requiresAuth: true },
    { href: '/messages', icon: MessageCircle, label: 'Mesajlar', requiresAuth: true },
  ];

  const userItems: NavItem[] = user ? [
    { href: '/escort/dashboard', icon: User, label: 'Profilim' },
    { href: '/settings', icon: Settings, label: 'Ayarlar' },
  ] : [
    { href: '/login', icon: User, label: 'Giriş Yap' },
    { href: '/escort/register', icon: Crown, label: 'Kayıt Ol' },
  ];

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Floating Menu Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 md:hidden w-14 h-14 rounded-full 
                   bg-gradient-to-br from-amber-500 to-amber-700 
                   shadow-lg shadow-amber-500/30
                   flex items-center justify-center
                   border border-amber-400/50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isOpen 
            ? '0 0 30px rgba(212, 175, 55, 0.5)' 
            : '0 10px 40px rgba(212, 175, 55, 0.3)',
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-black" />
          ) : (
            <Menu className="w-6 h-6 text-black" />
          )}
        </motion.div>
        
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-amber-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.button>

      {/* Floating Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 left-4 z-50 md:hidden
                       card-cosmic rounded-2xl p-4 
                       border border-amber-500/20
                       max-w-sm mx-auto"
          >
            {/* Sparkle decoration */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>

            {/* Main Nav Items */}
            <div className="grid grid-cols-4 gap-2 mb-4 pb-4 border-b border-white/10">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                const isDisabled = item.requiresAuth && !user;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={isDisabled ? '/login' : item.href}>
                      <div className={`flex flex-col items-center p-3 rounded-xl transition-all
                                      ${isActive 
                                        ? 'bg-amber-500/20 text-amber-400' 
                                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}
                                      ${isDisabled ? 'opacity-50' : ''}`}>
                        <Icon className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="cosmicActiveIndicator"
                            className="absolute -bottom-1 w-1 h-1 bg-amber-400 rounded-full"
                          />
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* User Items */}
            <div className="space-y-1">
              {userItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location === item.href;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <Link href={item.href}>
                      <div className={`flex items-center gap-3 p-3 rounded-xl transition-all
                                      ${isActive 
                                        ? 'bg-amber-500/20 text-amber-400' 
                                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}>
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Logout Button */}
              {user && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl w-full
                             text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Çıkış Yap</span>
                </motion.button>
              )}
            </div>

            {/* VIP Banner */}
            {!user?.isVip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <Link href="/vip">
                  <div className="flex items-center gap-3 p-3 rounded-xl 
                                  bg-gradient-to-r from-amber-500/20 to-purple-500/20
                                  border border-amber-500/30
                                  hover:from-amber-500/30 hover:to-purple-500/30 transition-all">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-foreground">VIP Ol</div>
                      <div className="text-[10px] text-muted-foreground">Özel ayrıcalıklar kazan</div>
                    </div>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                </Link>
              </motion.div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

export default CosmicNav;
