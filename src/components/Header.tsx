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

import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  Search, Menu, X, Crown, User, Home,
  LogOut, Settings, Bell, PlusCircle, Eye, EyeOff,
  Mail, Lock, ArrowRight, Heart, Calendar, MessageCircle, XCircle, Send,
  LayoutDashboard, Shield, Users, Sparkles
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

export const Header = React.memo(function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated, login, logout, isLoading, isAdmin, isSuperAdmin } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMessengerPopup, setShowMessengerPopup] = useState(false);
  const [messengerMessage, setMessengerMessage] = useState('');
  const [messengerMessages, setMessengerMessages] = useState<Array<{
    id: string;
    text: string;
    sent: boolean;
    time: string;
  }>>([
    { id: '1', text: 'Merhaba! Size nasıl yardımcı olabilirim?', sent: false, time: '10:30' },
  ]);

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
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/60 backdrop-blur-xl border-b border-white/5 py-2' : 'bg-transparent/60 backdrop-blur-sm py-3'
      }`}>
        <div className="container flex items-center justify-between">
          {/* Left: Toggle + Logo */}
          <div className="flex items-center gap-3">
            {/* Nav Toggle Button - Desktop */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNavExpanded(!isNavExpanded)}
              className="hidden md:flex hover:bg-white/10 transition-all"
              title={isNavExpanded ? "Menüyü Gizle" : "Menüyü Göster"}
            >
              <Menu className={`w-5 h-5 transition-transform duration-300 ${isNavExpanded ? 'rotate-90' : ''}`} />
            </Button>

            {/* Mobile Hamburger */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden hover:bg-white/10 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Logo Image */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
                <motion.img
                  src="/logo-full.png"
                  alt="ZEVK EVRENİ"
                  className="h-16 md:h-20 w-auto object-contain hidden sm:block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
                 {/* Mobile Logo (Symbol Only) */}
                <motion.img
                  src="/logo-symbol.png"
                  alt="ZEVK EVRENİ"
                  className="h-12 w-auto object-contain sm:hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </Link>
          </div>

          {/* Desktop Nav - Expandable */}
          <AnimatePresence mode="wait">
            {(isNavExpanded || window.innerWidth < 768) && (
              <motion.nav
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden md:flex items-center gap-3 overflow-hidden"
              >
                <Link href="/"
                  className={`text-xs font-bold hover:text-primary transition-colors ${location === '/' ? 'text-primary' : ''}`}
                >
                  <Home className="w-3 h-3 inline mr-1" />
                  ANA SAYFA
                </Link>
                <Link href="/escorts" className={`text-xs font-bold hover:text-primary transition-colors ${location === '/escorts' ? 'text-primary' : ''}`}>İLANLAR</Link>
                {isAuthenticated && user?.role === 'escort' ? (
                  <>
                    <Link href="/escort/market" className={`text-xs font-bold hover:text-primary transition-colors ${location === '/maseuse/market' ? 'text-primary' : ''}`}>MARKET</Link>
                    <Link href="/escort/dashboard" className={`text-xs font-bold hover:text-primary transition-colors ${location === '/escort/dashboard' ? 'text-primary' : ''}`}>PANELİM</Link>
                  </>
                ) : (
                  <>
                    <Link href="/vip" className={`text-xs font-bold hover:text-primary transition-colors ${location === '/vip' ? 'text-primary' : ''}`}>VIP MODELLER</Link>
                    <Link href="/safety" className="text-xs font-bold hover:text-primary transition-colors">GÜVENLİK</Link>
                  </>
                )}
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Messenger Button - Popup */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMessengerPopup(!showMessengerPopup)}
                className="relative h-8 w-8 hover:bg-white/10"
                title="Hızlı Mesajlaşma"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full border border-background" />
              </Button>

              {/* Messenger Popup */}
              <AnimatePresence>
                {showMessengerPopup && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50"
                  >
                    <Card className="card-premium shadow-2xl overflow-hidden">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-primary to-accent p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                          <MessageCircle className="w-5 h-5" />
                          <div>
                            <p className="font-bold text-sm">Hızlı Mesajlaşma</p>
                            <p className="text-xs opacity-80">Çevrimiçi desteğe bağlanın</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowMessengerPopup(false)}
                          className="h-6 w-6 text-white hover:bg-white/20"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Messages */}
                      <div className="h-64 overflow-y-auto p-3 space-y-2 bg-background">
                        {messengerMessages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[75%] rounded-lg px-3 py-2 ${
                              msg.sent
                                ? 'bg-gradient-to-r from-primary to-accent text-white'
                                : 'bg-muted'
                            }`}>
                              <p className="text-sm">{msg.text}</p>
                              <p className={`text-xs mt-1 ${msg.sent ? 'text-white/70' : 'text-muted-foreground'}`}>{msg.time}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Input */}
                      <div className="p-3 border-t border-border/50">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={messengerMessage}
                            onChange={(e) => setMessengerMessage(e.target.value)}
                            placeholder="Mesajınızı yazın..."
                            className="flex-1 px-3 py-2 text-sm rounded-lg border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && messengerMessage.trim()) {
                                setMessengerMessages([
                                  ...messengerMessages,
                                  {
                                    id: Date.now().toString(),
                                    text: messengerMessage,
                                    sent: true,
                                    time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                                  },
                                ]);
                                setMessengerMessage('');
                              }
                            }}
                          />
                          <Button
                            size="icon"
                            onClick={() => {
                              if (messengerMessage.trim()) {
                                setMessengerMessages([
                                  ...messengerMessages,
                                  {
                                    id: Date.now().toString(),
                                    text: messengerMessage,
                                    sent: true,
                                    time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                                  },
                                ]);
                                setMessengerMessage('');
                              }
                            }}
                            disabled={!messengerMessage.trim()}
                            className="bg-gradient-to-r from-primary to-accent"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* İlan Ver Button - Only show when nav is expanded */}
            <AnimatePresence>
              {isNavExpanded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/register-escort">
                    <Button className="hidden sm:flex bg-gradient-to-r from-primary to-accent font-bold shadow-lg shadow-primary/20 text-xs px-3 py-1 h-8">
                      <PlusCircle className="w-3 h-3 mr-1" /> İLAN VER
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notifications */}
            {isAuthenticated && (
              <Link href="/messages">
                <Button variant="ghost" size="icon" className="relative h-8 w-8 hover:bg-white/10">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full border border-background" />
                </Button>
              </Link>
            )}

            {/* User Section */}
            {!isAuthenticated ? (
              <div className="relative" ref={loginRef}>
                {/* Login Button - Opens Quick Login Form */}
                <Button
                  onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                  className="bg-gradient-to-r from-primary to-accent font-bold text-xs px-3 py-1 h-8"
                >
                  <User className="w-3 h-3 mr-1" />
                  Giriş
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
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="h-8 w-8 hover:bg-white/10 rounded-full"
                >
                  <User className="w-4 h-4" />
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
                            href="/dashboard"
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted/50 rounded-lg transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Panelim
                          </Link>

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
                            <MessageCircle className="w-4 h-4" />
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

                          {/* Admin Links */}
                          {(isAdmin || isSuperAdmin) && (
                            <>
                              <div className="h-px bg-border/50 my-1" />
                              <div className="px-3 py-2 text-xs font-semibold text-primary">
                                Admin
                              </div>
                              <Link
                                href="/admin/dashboard"
                                onClick={() => setShowUserDropdown(false)}
                                className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted/50 rounded-lg transition-colors"
                              >
                                <Shield className="w-4 h-4" />
                                Admin Panel
                              </Link>
                              <Link
                                href="/admin/users"
                                onClick={() => setShowUserDropdown(false)}
                                className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted/50 rounded-lg transition-colors"
                              >
                                <Users className="w-4 h-4" />
                                Kullanıcılar
                              </Link>
                              <Link
                                href="/admin/listings"
                                onClick={() => setShowUserDropdown(false)}
                                className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted/50 rounded-lg transition-colors"
                              >
                                <Sparkles className="w-4 h-4" />
                                İlanlar
                              </Link>
                            </>
                          )}

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
    </>
  );
});

export default Header;
