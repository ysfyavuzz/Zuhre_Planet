/**
 * Standard Card Component
 * 
 * Kozmik temaya uygun, okunaklılığı artırılmış profil kartı.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { Star, MapPin, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { ListingProfile } from '@/types/domain';
import { VerifiedBadge } from './VerifiedBadge';

interface StandardCardProps {
  profile: ListingProfile;
}

export const StandardCard: React.FC<StandardCardProps> = ({ profile }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      className="glass-panel group overflow-hidden border-none"
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Section */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={profile.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'}
          alt={profile.displayName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Status Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <div className="flex flex-col gap-2">
            {profile.tier === 'vip' && (
              <span className="bg-primary text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg italic">
                VIP
              </span>
            )}
            {profile.hasVerifiedBadge && (
              <VerifiedBadge size="sm" showText={false} />
            )}
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-xl border border-white/10 shadow-lg
            ${profile.isOnline ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${profile.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-white text-[8px] font-black uppercase tracking-widest italic">
              {profile.isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Info Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter drop-shadow-lg">
                {profile.displayName}
              </h3>
              <div className="flex items-center gap-1 text-white/70">
                <MapPin className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">
                  {profile.city || 'İstanbul'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-black italic">{profile.rating || '4.9'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className={`text-[10px] font-black uppercase tracking-widest italic ${isDark ? 'text-white/60' : 'text-orange-950/70'}`}>
              Saatlik
            </span>
          </div>
          <span className="text-xl font-black italic text-primary">
            ₺{profile.rates?.hourly || '5000'}
          </span>
        </div>

        <div className={`flex items-center gap-2 p-3 rounded-xl border border-dashed
          ${isDark ? 'bg-white/5 border-white/10' : 'bg-orange-500/5 border-orange-500/20'}`}>
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className={`text-[9px] font-black uppercase tracking-widest italic ${isDark ? 'text-white/40' : 'text-orange-900/60'}`}>
            GÜVENİLİR VE DOĞRULANMIŞ PROFİL
          </span>
        </div>

        <motion.button
          className="w-full py-4 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] italic shadow-lg shadow-primary/20"
          whileTap={{ scale: 0.95 }}
        >
          Profili İncele
        </motion.button>
      </div>
    </motion.div>
  );
};
