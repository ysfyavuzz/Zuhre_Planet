/**
 * Windows-Style Bottom Navigation Bar
 * Dropdown'lar body elementine Portal ile render edilir
 */

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, Heart, MessageSquare, LayoutDashboard, Crown, Sparkles, Bell, Star, Gift, Settings, User, Search, Award, LogOut, ThumbsUp, Eye, Shield, TrendingUp, MapPin, Filter, X, BarChart3, FileText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

// Dropdownları body elementine render eden Portal bileşeni
function DropdownPortal({ children, isOpen, className }: { children: React.ReactNode; isOpen: boolean; className?: string }) {
  if (typeof document === 'undefined' || !isOpen) return null;
  return ReactDOM.createPortal(
    <div className={className} style={{ position: 'fixed', zIndex: 99999 }}>
      {children}
    </div>,
    document.body
  );
}

const mockNotifications = [
  { id: '1', type: 'message' as const, title: 'Yeni Mesaj', message: 'Ayşe size bir mesaj gönderdi', time: '2 dk önce', unread: true, actionUrl: '/messages' },
  { id: '2', type: 'like' as const, title: 'Beğenildi', message: 'Profiliniz 5 kez beğenildi', time: '15 dk önce', unread: true },
  { id: '3', type: 'view' as const, title: 'Profil Görüntülemesi', message: 'Profiliniz 23 kez görüntülendi', time: '1 saat önce', unread: false },
  { id: '4', type: 'promotion' as const, title: 'Özel Fırsat', message: '%50 VIP üyelik indirimini yakaladınız!', time: '2 saat önce', unread: true },
  { id: '5', type: 'system' as const, title: 'Hesap Güvenliği', message: 'İki faktörlü doğrulama aktif edildi', time: '1 gün önce', unread: false },
];

const NotificationIcon = ({ type }: { type: string }) => {
  const icons = { message: MessageSquare, like: ThumbsUp, view: Eye, system: Shield, promotion: Gift };
  const colors = { message: 'bg-blue-500/20 text-blue-500', like: 'bg-pink-500/20 text-pink-500', view: 'bg-purple-500/20 text-purple-500', system: 'bg-green-500/20 text-green-500', promotion: 'bg-amber-500/20 text-amber-500' };
  const Icon = icons[type as keyof typeof icons];
  return <div className={`p-2.5 rounded-xl ${colors[type as keyof typeof colors]}`}><Icon className="w-5 h-5" /></div>;
};

const NavItemHorizontal = ({ item, isActive, onClick }: { item: any; isActive: boolean; onClick?: () => void }) => {
  const Icon = item.icon;
  const iconColors: Record<string, string> = {
    'Ana Sayfa': 'text-blue-400',
    'İlanlar': 'text-pink-400',
    'VIP': 'text-yellow-400',
    'Favoriler': 'text-red-400',
    'Mesajlar': 'text-cyan-400',
  };

  const getSpanClassName = () => {
    if (isActive) {
      return 'text-xs font-medium transition-colors text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400 font-bold';
    }
    const color = iconColors[item.label] || 'text-purple-300';
    return `text-xs font-medium transition-colors ${color} group-hover:text-white`;
  };

  return (
    <Link href={item.href} onClick={onClick}>
      <motion.div whileHover={{ scale: 1.15, y: -4 }} whileTap={{ scale: 0.9 }} className="relative flex flex-col items-center justify-center gap-1.5 px-4 py-1.5 group">
        <div className={`relative p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-gradient-to-br from-primary/30 to-accent/30 shadow-2xl shadow-primary/20' : 'hover:bg-white/10'} backdrop-blur-xl`}>
          <Icon className={"w-6 h-6 transition-all duration-300 " + (isActive ? "drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400" : `drop-shadow-md ${iconColors[item.label] || 'text-purple-300'}`)} />
          {item.badge && Number(item.badge) > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} className="absolute -top-1 -right-1">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 rounded-full blur-md animate-pulse" />
              <div className="relative w-5 h-5 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20">
                <span className="text-[9px] font-black text-white leading-none">{item.badge}</span>
              </div>
            </motion.div>
          )}
        </div>
        <span className={getSpanClassName()}>
          {item.label}
        </span>
      </motion.div>
    </Link>
  );
};

export const FloatingNavigation = React.memo(function FloatingNavigation() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const [isVisible] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLoyalty, setShowLoyalty] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ bottom: 0, right: 0 });

  const updateDropdownPosition = () => {
    const navBar = document.querySelector('[data-nav-bar]');
    if (navBar) {
      const rect = navBar.getBoundingClientRect();
      setDropdownPosition({ bottom: window.innerHeight - rect.top + 8, right: window.innerWidth - rect.right + 16 });
    } else {
      setDropdownPosition({ bottom: 100, right: 16 });
    }
  };

  useEffect(() => {
    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);
    return () => window.removeEventListener('resize', updateDropdownPosition);
  }, []);

  const navItems = [
    { icon: Home, label: 'Ana Sayfa', href: '/' },
    { icon: Users, label: 'İlanlar', href: '/escorts' },
    { icon: Crown, label: 'VIP', href: '/vip' },
    { icon: Heart, label: 'Favoriler', href: '/favorites', requireAuth: true, badge: 0 },
    { icon: MessageSquare, label: 'Mesajlar', href: '/messages', requireAuth: true, badge: 3 },
  ];

  const visibleNavItems = navItems.filter(item => !item.requireAuth || isAuthenticated);
  const unreadNotifications = mockNotifications.filter(n => n.unread).length;

  return (
    <TooltipProvider delayDuration={200}>
      <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: isVisible ? 0 : 100, opacity: isVisible ? 1 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed bottom-0 left-0 right-0 z-[100]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }} data-nav-bar>
        <div className="mx-auto max-w-screen-2xl">
          <div className="mx-4 mb-2">
            <div
              className="relative bg-purple-900/70 backdrop-blur-4xl border border-purple-400/70 rounded-2xl shadow-2xl overflow-hidden"
              style={{
                boxShadow: '0 0 0 1px rgba(168, 85, 247, 0.6), 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 25px 30px -5px rgba(168, 85, 247, 0.3), 0 10px 15px -6px rgba(168, 85, 247, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.2)'
              }}
            >
              {/* Ana akan sıvı - sağa doğru, yukarı eğimli */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  x: ['-20%', '120%'],
                  y: ['5%', '-5%'],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  background: 'linear-gradient(120deg, transparent 0%, rgba(168, 85, 247, 0.7) 25%, transparent 50%, rgba(139, 92, 246, 0.6) 75%, transparent 100%)',
                  width: '150%',
                  height: '120%',
                }}
              />

              {/* İkinci akan sıvı - daha hızlı, zıt yönde */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  x: ['120%', '-20%'],
                  y: ['-5%', '5%'],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  background: 'linear-gradient(-60deg, transparent 0%, rgba(147, 51, 234, 0.6) 30%, transparent 60%, rgba(192, 132, 252, 0.5) 90%, transparent 100%)',
                  width: '140%',
                  height: '110%',
                }}
              />

              {/* Yukarı dalgalan sıvı - göney doğu hareket */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  y: ['80%', '-20%'],
                  x: ['0%', '30%'],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  background: 'linear-gradient(80deg, transparent 0%, rgba(168, 85, 247, 0.5) 40%, transparent 80%)',
                  width: '120%',
                  height: '150%',
                }}
              />

              {/* Dalgalar - yan yana hareket */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  x: ['-50%', '150%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  background: 'repeating-linear-gradient(90deg, transparent 0%, rgba(168, 85, 247, 0.4) 0%, transparent 20%)',
                  backgroundSize: '200% 100%',
                  width: '200%',
                }}
              />

              {/* Küçük dalgalar - hızlı */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  x: ['150%', '-50%'],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  background: 'repeating-linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.35) 0%, transparent 15%)',
                  backgroundSize: '150% 100%',
                  width: '150%',
                }}
              />

              {/* Sıvı seviyesi göstergesi - üstteki parlak çizgi */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1"
                animate={{
                  x: ['-100%', '100%'],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
                }}
              />

              {/* Parlayan noktalar - rastgele hareket */}
              {[0, 0.3, 0.6, 0.2, 0.5].map((delay, i) => {
                const xStart = i * 20;
                const xEnd = i * 20 + 80;
                const yStart = 20 + Math.random() * 60;
                const yEnd = 10 + Math.random() * 40;
                return (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    animate={{
                      x: [xStart + '%', xEnd + '%'],
                      y: [yStart + '%', yEnd + '%'],
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 4 + i * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.8,
                    }}
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent)',
                      left: i * 20 + '%',
                    }}
                  />
                );
              })}

              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-transparent to-violet-600/30" />
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent" />

              {/* 3D Depth - Inner shadow from top */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />

              {/* 3D Depth - Inner shadow from bottom */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-900/50 to-transparent" />

              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-transparent to-violet-500/20 rounded-2xl blur-md -z-10" />

              <div className="relative flex items-center justify-between px-4 py-2">
                {/* Logo */}
                <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                  <motion.div className="flex items-center gap-1.5" whileHover={{ scale: 1.05 }}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-[10px] font-black text-foreground tracking-wider">ESCORT</p>
                      <p className="text-[8px] text-muted-foreground font-semibold">PLATFORM</p>
                    </div>
                  </motion.div>
                </div>

                {/* Center Nav Items */}
                <div className="flex items-center gap-2">
                  {visibleNavItems.map((item, index) => (
                    <motion.div key={item.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                      <NavItemHorizontal item={item} isActive={location === item.href} onClick={() => { setShowNotifications(false); setShowProfile(false); setShowLoyalty(false); }} />
                    </motion.div>
                  ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1 pl-4 border-l border-purple-400/30">
                  {/* Search */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }} onClick={() => setShowSearch(!showSearch)} className="relative p-2 rounded-lg text-green-400 hover:text-green-300 hover:bg-green-500/20 transition-all">
                        <Search className="w-5 h-5" />
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">Ara</TooltipContent>
                  </Tooltip>

                  {/* Notifications */}
                  <div className="relative">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            updateDropdownPosition();
                            setShowNotifications(!showNotifications);
                            setShowProfile(false);
                            setShowLoyalty(false);
                          }}
                          className={"relative p-2 rounded-lg transition-all " + (showNotifications ? "text-cyan-400 bg-cyan-500/20" : "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20")}
                        >
                          <Bell className="w-5 h-5" />
                          {unreadNotifications > 0 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-[8px] font-black text-white">{unreadNotifications}</span>
                            </div>
                          )}
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center">Bildirimler</TooltipContent>
                    </Tooltip>

                    <DropdownPortal isOpen={showNotifications}>
                      <AnimatePresence>
                        {showNotifications && (
                          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ duration: 0.2 }} style={{ position: 'fixed', bottom: `${dropdownPosition.bottom}px`, right: `${dropdownPosition.right}px` }}>
                            <Card className="bg-white/10 backdrop-blur-3xl border-2 border-white/20 shadow-2xl" style={{ width: '384px' }}>
                              <CardContent className="p-0">
                                <div className="p-4 border-b border-white/10">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-bold flex items-center gap-2"><Bell className="w-4 h-4 text-blue-500" />Bildirimler</h3>
                                    <Badge className="bg-blue-500 text-white text-xs">{unreadNotifications} yeni</Badge>
                                  </div>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                  {mockNotifications.map((notification, index) => (
                                    <motion.div key={notification.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }} className={`p-4 border-b border-white/5 cursor-pointer ${notification.unread ? 'bg-primary/10' : ''}`} onClick={() => { if (notification.actionUrl) window.location.href = notification.actionUrl; }}>
                                      <div className="flex gap-3">
                                        <NotificationIcon type={notification.type} />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between mb-1">
                                            <p className="font-bold text-sm">{notification.title}</p>
                                            <span className="text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">{notification.time}</span>
                                          </div>
                                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                                        </div>
                                        {notification.unread && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </DropdownPortal>
                  </div>

                  {/* Loyalty */}
                  <div className="relative">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            updateDropdownPosition();
                            setShowLoyalty(!showLoyalty);
                            setShowNotifications(false);
                            setShowProfile(false);
                          }}
                          className={"relative p-2 rounded-lg transition-all " + (showLoyalty ? "text-yellow-400 bg-yellow-500/20" : "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20")}
                        >
                          <Award className="w-5 h-5" />
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center">Sadakat</TooltipContent>
                    </Tooltip>

                    <DropdownPortal isOpen={showLoyalty}>
                      <AnimatePresence>
                        {showLoyalty && (
                          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} style={{ position: 'fixed', bottom: `${dropdownPosition.bottom}px`, right: `${dropdownPosition.right}px` }}>
                            <Card className="bg-white/10 backdrop-blur-3xl border-2 border-white/20 shadow-2xl" style={{ width: '288px' }}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="font-bold flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" />Sadakat</h3>
                                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">Gold</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                  <div className="bg-primary/10 rounded-xl p-3 text-center"><Star className="w-5 h-5 mx-auto mb-1 text-primary" /><p className="text-lg font-black">2450</p><p className="text-[10px] text-muted-foreground">Puan</p></div>
                                  <div className="bg-green-500/10 rounded-xl p-3 text-center"><Gift className="w-5 h-5 mx-auto mb-1 text-green-500" /><p className="text-lg font-black">3</p><p className="text-[10px] text-muted-foreground">Ödül</p></div>
                                </div>
                                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm py-5" size="sm"><TrendingUp className="w-4 h-4 mr-2" />Ödülleri Gör</Button>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </DropdownPortal>
                  </div>

                  {/* Profile */}
                  {isAuthenticated && (
                    <div className="relative">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }} onClick={() => { updateDropdownPosition(); setShowProfile(!showProfile); setShowNotifications(false); setShowLoyalty(false); }} className={"relative p-2 rounded-lg transition-all " + (showProfile ? "text-pink-400 bg-pink-500/20" : "text-pink-400 hover:text-pink-300 hover:bg-pink-500/20")}>
                            <User className="w-5 h-5" />
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">Profil</TooltipContent>
                      </Tooltip>

                      <DropdownPortal isOpen={showProfile}>
                        <AnimatePresence>
                          {showProfile && (
                            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} style={{ position: 'fixed', bottom: `${dropdownPosition.bottom}px`, right: `${dropdownPosition.right}px` }}>
                              <Card className="bg-white/10 backdrop-blur-3xl border-2 border-white/20 shadow-2xl" style={{ width: '224px' }}>
                                <CardContent className="p-2">
                                  <div className="space-y-1">
                                    <Link href="/dashboard" onClick={() => setShowProfile(false)}><Button variant="ghost" className="w-full justify-start py-5 text-sm"><LayoutDashboard className="w-4 h-4 mr-2" />Panelim</Button></Link>
                                    <Link href="/favorites" onClick={() => setShowProfile(false)}><Button variant="ghost" className="w-full justify-start py-5 text-sm"><Heart className="w-4 h-4 mr-2" />Favorilerim</Button></Link>
                                    <Link href="/messages" onClick={() => setShowProfile(false)}><Button variant="ghost" className="w-full justify-start py-5 text-sm"><MessageSquare className="w-4 h-4 mr-2" />Mesajlar</Button></Link>
                                    <Separator className="my-2 bg-white/10" />
                                    <Link href="/analytics" onClick={() => setShowProfile(false)}><Button variant="ghost" className="w-full justify-start py-5 text-sm"><BarChart3 className="w-4 h-4 mr-2" />Analitik</Button></Link>
                                    <Link href="/reviews" onClick={() => setShowProfile(false)}><Button variant="ghost" className="w-full justify-start py-5 text-sm"><Star className="w-4 h-4 mr-2" />Değerlendirmeler</Button></Link>
                                    <Separator className="my-2 bg-white/10" />
                                    <Link href="/settings" onClick={() => setShowProfile(false)}><Button variant="ghost" className="w-full justify-start py-5 text-sm"><Settings className="w-4 h-4 mr-2" />Ayarlar</Button></Link>
                                    <Button variant="ghost" className="w-full justify-start py-5 text-sm text-red-500 hover:text-red-600 hover:bg-red-500/10"><LogOut className="w-4 h-4 mr-2" />Çıkış Yap</Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </DropdownPortal>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm" onClick={() => setShowSearch(false)}>
            <motion.div initial={{ scale: 0.9, y: -50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: -50 }} onClick={(e) => e.stopPropagation()} className="max-w-2xl mx-auto mt-32 px-4">
              <Card className="bg-white/10 backdrop-blur-3xl border-2 border-white/20 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Search className="w-6 h-6 text-primary" /></div>
                    <input type="text" placeholder="İlan, escort veya kategori ara..." className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground font-medium" autoFocus />
                    <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)} className="h-10 w-10"><X className="w-5 h-5" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="text-xs"><MapPin className="w-3 h-3 mr-1" />İstanbul</Button>
                    <Button variant="outline" size="sm" className="text-xs"><Filter className="w-3 h-3 mr-1" />Filtrele</Button>
                    <Button variant="outline" size="sm" className="text-xs"><Crown className="w-3 h-3 mr-1" />VIP</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
});

export default FloatingNavigation;
