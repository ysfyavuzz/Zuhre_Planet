/**
 * Header Component
 * 
 * Main navigation header with authentication, search, and theme controls.
 * Responsive design with mobile menu and user dropdown menus.
 * 
 * @module components/Header
 * @category Components - Navigation
 * 
 * Features:
 * - Responsive navigation (desktop + mobile)
 * - User authentication state display
 * - Login/Register dropdowns
 * - User profile dropdown
 * - Theme toggle (dark/light mode)
 * - Search functionality
 * - Notification bell
 * - VIP badge display
 * - Scroll-based background blur
 * - Mobile hamburger menu
 * 
 * Authentication States:
 * - Guest: Login/Register options
 * - User: Profile menu, favorites, messages, appointments
 * - Escort: Dashboard access, market access
 * - Admin: Admin dashboard access
 * 
 * @example
 * ```tsx
 * <Header />
 * ```
 */

import { Link, useLocation } from 'wouter';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  Search, Menu, X, Crown, User,
  LogOut, Settings, Bell, PlusCircle, Eye, EyeOff,
  Mail, Lock, ArrowRight, Heart, Calendar
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setShowLoginDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    try {
      await login(loginEmail, loginPassword);
      setShowLoginDropdown(false);
      setLoginEmail('');
      setLoginPassword('');
    } catch (err) {
      setLoginError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter hidden sm:block">
              ESCORT<span className="text-primary">PLATFORM</span>
            </h1>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/escorts" className={`text-sm font-bold hover:text-primary transition-colors ${location === '/escorts' ? 'text-primary' : ''}`}>İLANLAR</Link>
          {isAuthenticated && user?.role === 'escort' ? (
            <>
              <Link href="/escort/market" className={`text-sm font-bold hover:text-primary transition-colors ${location === '/maseuse/market' ? 'text-primary' : ''}`}>MARKET</Link>
              <Link href="/escort/dashboard" className={`text-sm font-bold hover:text-primary transition-colors ${location === '/escort/dashboard' ? 'text-primary' : ''}`}>PANELİM</Link>
            </>
          ) : (
            <>
              <Link href="/vip" className={`text-sm font-bold hover:text-primary transition-colors ${location === '/vip' ? 'text-primary' : ''}`}>VIP MODELLER</Link>
              <Link href="/safety" className="text-sm font-bold hover:text-primary transition-colors">GÜVENLİK</Link>
            </>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* İlan Ver Button */}
          <Link href="/register-escort">
            <Button className="hidden sm:flex bg-gradient-to-r from-primary to-accent font-bold shadow-lg shadow-primary/20">
              <PlusCircle className="w-4 h-4 mr-2" /> İLAN VER
            </Button>
          </Link>

          {/* Notifications */}
          {isAuthenticated && (
            <Link href="/messages">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
              </Button>
            </Link>
          )}

          {/* User Section */}
          {!isAuthenticated ? (
            <div className="relative" ref={loginRef}>
              {/* Login Button - Opens Quick Login Form */}
              <Button
                onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                className="bg-gradient-to-r from-primary to-accent font-bold"
              >
                <User className="w-4 h-4 mr-2" />
                Giriş Yap
              </Button>

              {/* Quick Login Dropdown */}
              <AnimatePresence>
                {showLoginDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-80 z-50"
                  >
                    <Card className="card-premium shadow-2xl">
                      <CardContent className="p-4">
                        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          Hızlı Giriş
                        </h3>

                        <form onSubmit={handleLogin} className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium mb-1">E-posta</label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <input
                                type="email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                placeholder="ornek@email.com"
                                required
                                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                                disabled={isSubmitting}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1">Şifre</label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                placeholder="••••••"
                                required
                                className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                                disabled={isSubmitting}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {loginError && (
                            <p className="text-xs text-red-500">{loginError}</p>
                          )}

                          <Button
                            type="submit"
                            disabled={isSubmitting || !loginEmail || !loginPassword}
                            className="w-full py-2 bg-gradient-to-r from-primary to-accent text-sm font-bold"
                          >
                            {isSubmitting ? (
                              <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Giriş yapılıyor...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                Giriş Yap
                                <ArrowRight className="w-4 h-4" />
                              </span>
                            )}
                          </Button>
                        </form>

                        <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                          <Link
                            href="/login"
                            onClick={() => setShowLoginDropdown(false)}
                            className="block text-xs text-center text-primary hover:underline"
                          >
                            Müşteri Girişi
                          </Link>
                          <Link
                            href="/login-escort"
                            onClick={() => setShowLoginDropdown(false)}
                            className="block text-xs text-center text-primary hover:underline"
                          >
                            Escort Girişi
                          </Link>
                        </div>

                        <div className="mt-3 pt-3 border-t border-border/50">
                          <Link
                            href="/register-client"
                            onClick={() => setShowLoginDropdown(false)}
                            className="block"
                          >
                            <Button variant="outline" className="w-full text-xs" size="sm">
                              Üye Ol
                            </Button>
                          </Link>
                        </div>

                        {/* Demo Credentials Hint */}
                        <div className="mt-3 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
                          <p className="font-semibold mb-1">Demo:</p>
                          <p>user@example.com / user</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="relative" ref={userDropdownRef}>
              <Button
                variant="outline"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="rounded-full border-white/10 bg-white/5 hover:bg-white/10"
              >
                <User className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
              </Button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 z-50"
                  >
                    <Card className="card-premium shadow-2xl">
                      <CardContent className="p-2">
                        <div className="px-3 py-2 mb-2 pb-3 border-b border-border/50">
                          <p className="text-sm font-medium">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                          {user?.membership && (
                            <div className="mt-2 flex items-center gap-1">
                              <Crown className="w-3 h-3 text-amber-500" />
                              <span className="text-xs font-semibold text-amber-500 uppercase">
                                {user.membership}
                              </span>
                            </div>
                          )}
                        </div>

                        <Link
                          href="/favorites"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          Favorilerim
                        </Link>

                        <Link
                          href="/messages"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <Bell className="w-4 h-4" />
                          Mesajlar
                        </Link>

                        <Link
                          href="/appointments"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <Calendar className="w-4 h-4" />
                          Randevularım
                        </Link>

                        <Link
                          href="/settings"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Ayarlar
                        </Link>

                        <div className="h-px bg-border/50 my-1" />

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Çıkış Yap
                        </button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
