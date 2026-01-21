/**
 * BottomNav Component
 * 
 * Mobile-responsive bottom navigation bar for quick access to main features.
 * Displays active state and smooth animations on route changes.
 * 
 * @module components/BottomNav
 * @category Components - Navigation
 * 
 * Features:
 * - Persistent bottom navigation for mobile devices
 * - Active route highlighting
 * - Smooth transition animations
 * - Icon-based navigation
 * 
 * Navigation Items:
 * - Home (/)
 * - Search (/catalog)
 * - Favorites (/favorites)
 * - Messages (/messages)
 * - Profile (/login or /escort/dashboard)
 * 
 * @example
 * ```tsx
 * <BottomNav />
 * ```
 */

import { Link, useLocation } from 'wouter';
import { Home, Search, Heart, MessageCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: '/', icon: Home, label: 'Ana Sayfa' },
    { href: '/escorts', icon: Search, label: 'Keşfet' },
    { href: '/favorites', icon: Heart, label: 'Favoriler' },
    { href: '/messages', icon: MessageCircle, label: 'Mesajlar' },
    { href: '/escort/dashboard', icon: User, label: 'Profil' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-white/5 px-4 pb-safe">
      <div className="flex justify-between items-center h-14">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <div className="flex flex-col items-center justify-center relative px-2 py-1 cursor-pointer">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-2 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
