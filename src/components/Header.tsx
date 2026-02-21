import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Crown, Sparkles, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { useState, useEffect } from 'react';

export function Header() {
  const [location] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/escorts', label: 'KEŞFET' },
    { href: '/vip', label: 'VIP' },
    { href: '/blog', label: 'BLOG' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4 md:py-6
      ${isScrolled ? 'backdrop-blur-2xl bg-background/60 border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/">
          <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
            <h2 className={`text-xl md:text-2xl font-black italic uppercase tracking-tighter text-3d
              ${isDark ? 'text-white' : 'text-slate-950'}`}>
              ZÜHRE<span className="text-violet-500">PLANET</span>
            </h2>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer transition-colors hover:text-violet-400
                ${location === link.href ? 'text-violet-500' : (isDark ? 'text-white/40' : 'text-slate-900/40')}`}>
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <ThemeToggle />
          
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/escort/dashboard">
                  <div className="flex items-center gap-3 glass-panel border-none px-4 py-2 cursor-pointer hover:bg-white/10 transition-all">
                    <User className="w-4 h-4 text-violet-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{user?.name?.split(' ')[0]}</span>
                  </div>
                </Link>
                <button onClick={logout} className="p-2 text-red-500/50 hover:text-red-500 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <button className="bg-white text-black px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest italic shadow-xl shadow-white/5 hover:bg-violet-500 hover:text-white transition-all">
                  YÖRÜNGEYE GİR
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-violet-500">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass-panel border border-white/10 m-6 p-8 flex flex-col gap-6 md:hidden shadow-2xl bg-slate-900/90 backdrop-blur-3xl"
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span onClick={() => setMobileMenuOpen(false)} className={`text-xs font-black uppercase tracking-widest italic ${location === link.href ? 'text-violet-400' : 'text-white/60'}`}>
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="h-px bg-white/10 w-full" />
            {!isAuthenticated ? (
              <Link href="/login">
                <button onClick={() => setMobileMenuOpen(false)} className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest italic shadow-xl shadow-white/5">
                  YÖRÜNGEYE GİR
                </button>
              </Link>
            ) : (
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest italic">
                ÇIKIŞ YAP
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
