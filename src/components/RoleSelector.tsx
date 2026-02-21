/**
 * RoleSelector Component
 *
 * Modal component presented after age verification for user role selection.
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles, Heart, Star, Shield } from 'lucide-react';

export type UserRole = 'customer' | 'escort' | null;

interface RoleSelectorProps {
  onRoleSelect?: (role: UserRole) => void;
  isOpen?: boolean;
  autoRedirect?: boolean;
}

export const ROLE_STORAGE_KEY = 'user-role-selection';
const ROLE_LAST_SEEN = 'role-selection-date';

export function getStoredRole(): UserRole {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ROLE_STORAGE_KEY) as UserRole;
}

export default function RoleSelector({
  onRoleSelect,
  isOpen = true,
  autoRedirect = true
}: RoleSelectorProps) {
  const [, navigate] = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(ROLE_STORAGE_KEY);
    if (stored && autoRedirect) {
      navigate(stored === 'customer' ? '/' : '/register-escort');
      return;
    }
    if (isOpen) setIsVisible(true);
  }, [isOpen, autoRedirect, navigate]);

  const handleRoleSelect = async (role: UserRole) => {
    if (!role) return;
    setIsAnimating(true);
    localStorage.setItem(ROLE_STORAGE_KEY, role);
    localStorage.setItem(ROLE_LAST_SEEN, Date.now().toString());
    onRoleSelect?.(role);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsVisible(false);
    if (autoRedirect) navigate(role === 'customer' ? '/' : '/register-escort');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-8 border border-primary/20">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white italic uppercase">
            NASIL DEVAM ETMEK <span className="text-primary">İSTERSİNİZ?</span>
          </h1>

          <p className="text-white/40 text-lg font-medium max-w-2xl mx-auto">
            Platformu kullanım amacınızı seçin. Bu seçimi daha sonra değiştirebilirsiniz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Customer Card */}
          <motion.button
            onClick={() => handleRoleSelect('customer')}
            disabled={isAnimating}
            className="group glass-panel border-none p-10 text-left transition-all duration-500 hover:scale-[1.02] active:scale-95"
          >
            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform border border-primary/30">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white italic uppercase mb-2">MÜŞTERİ</h3>
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest">İlanları görüntüleyin</p>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              {[
                { icon: Heart, text: 'Vitrin kartlarını görüntüle' },
                { icon: Star, text: 'Favorilerini kaydet' },
                { icon: Shield, text: 'Güvenli randevu al' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/60 font-medium">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-xs uppercase tracking-widest">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary/80">
              💡 Üyelik isteğe bağlıdır. Misafir olarak da görebilirsiniz.
            </div>
          </motion.button>

          {/* Escort Card */}
          <motion.button
            onClick={() => handleRoleSelect('escort')}
            disabled={isAnimating}
            className="group glass-panel border-none p-10 text-left transition-all duration-500 hover:scale-[1.02] active:scale-95 relative overflow-hidden"
          >
            <div className="absolute top-6 right-6 px-4 py-1.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest italic animate-pulse">
              PREMIUM
            </div>

            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform border border-primary/30">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white italic uppercase mb-2">PREMIUM</h3>
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest">İlan oluştur</p>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              {[
                { icon: Heart, text: 'Profil oluştur' },
                { icon: Star, text: 'Randevu taleplerini al' },
                { icon: Shield, text: 'VIP paketlerle öne çık' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/60 font-medium">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-xs uppercase tracking-widest">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary/80">
              💡 Üyelik zorunludur. Profil oluşturmak için kayıt olun.
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
