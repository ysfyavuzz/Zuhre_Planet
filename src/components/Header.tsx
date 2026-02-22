import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Crown, Sparkles, Menu, X, Gem } from 'lucide-react';
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
    { href: '/blog', label: 'BLOG' },
  ];

  return (
    <header className={`fixed top-4 left-4 right-4 z-[100] transition-all duration-500 rounded-2xl pointer-events-auto
      bg-[#F1F4F6]/75 backdrop-blur-[20px] 
      border border-white/30 
      shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.12)]
      ${isDark ? 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)] bg-[#1e293b]/70 border-white/10' : ''}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-1.5 md:py-2">

        {/* Logo */}
        <Link href="/">
          <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
            <h2 className={`text-lg md:text-xl font-black italic uppercase tracking-tighter text-3d
              ${isDark ? 'text-white' : 'text-slate-950'}`}>
              ZÜHRE<span className="text-violet-500">PLANET</span>
            </h2>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/escorts">
            <span className={`text-[16px] font-black uppercase tracking-[0.2em] cursor-pointer transition-colors hover:text-violet-400
              ${location === '/escorts' ? 'text-violet-500' : (isDark ? 'text-white/40' : 'text-slate-900/40')}`}>
              KEŞFET
            </span>
          </Link>

          {/* 3 Boyutlu Mavi Elmas & Küçültülmüş VIP Etiketi */}
          <Link href="/vip">
            <div className="relative flex flex-col items-center justify-center cursor-pointer group px-2">
              <span className="absolute -top-3 text-[9px] font-black uppercase tracking-widest text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity">
                VİP
              </span>
              <span className="text-3xl filter saturate-200 hue-rotate-[15deg] drop-shadow-[0_0_15px_rgba(34,211,238,0.7)] group-hover:drop-shadow-[0_0_25px_rgba(34,211,238,1)] group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                💎
              </span>
            </div>
          </Link>

          <Link href="/blog">
            <span className={`text-[16px] font-black uppercase tracking-[0.2em] cursor-pointer transition-colors hover:text-violet-400
              ${location === '/blog' ? 'text-violet-500' : (isDark ? 'text-white/40' : 'text-slate-900/40')}`}>
              BLOG
            </span>
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <ThemeToggle />

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/escort/dashboard">
                  <div className="flex items-center gap-2 glass-panel border-none px-3 py-1 cursor-pointer hover:bg-white/10 transition-all">
                    <User className="w-3.5 h-3.5 text-violet-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{user?.name?.split(' ')[0]}</span>
                  </div>
                </Link>
                <button onClick={logout} className="p-2 text-red-500/50 hover:text-red-500 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <button className="bg-white text-black px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest italic shadow-xl shadow-white/5 hover:bg-violet-500 hover:text-white transition-all">
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
            <Link href="/escorts">
              <span onClick={() => setMobileMenuOpen(false)} className={`text-base font-black uppercase tracking-widest italic ${location === '/escorts' ? 'text-violet-400' : 'text-white/60'}`}>
                KEŞFET
              </span>
            </Link>

            <Link href="/vip">
              <div onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                <span className="text-2xl filter saturate-200 hue-rotate-15 drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]">
                  💎
                </span>
                <span className="text-sm font-black uppercase tracking-widest text-cyan-400 italic">VİP</span>
              </div>
            </Link>

            <Link href="/blog">
              <span onClick={() => setMobileMenuOpen(false)} className={`text-base font-black uppercase tracking-widest italic ${location === '/blog' ? 'text-violet-400' : 'text-white/60'}`}>
                BLOG
              </span>
            </Link>
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
