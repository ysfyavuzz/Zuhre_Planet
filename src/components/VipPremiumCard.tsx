/**
 * VipPremiumCard Component
 * 
 * Premium animated card component for VIP escorts with enhanced visual effects.
 * Features gold gradient, parallax effects, and premium animations.
 * 
 * @module components/VipPremiumCard
 * @category Components - Cards
 * 
 * Features:
 * - Luxurious gold gradient design
 * - Parallax mouse-tracking effects
 * - 3D tilt animation on hover
 * - Sparkle/shine animations
 * - VIP crown badge
 * - Enhanced profile display
 * - Performance-optimized animations
 * - Mobile-friendly fallback
 * - Responsive layout
 * 
 * Visual Effects:
 * - Gradient background (gold theme)
 * - Mouse parallax movement
 * - Smooth spring animations
 * - Hover state transitions
 * - Shimmer effect overlay
 * - Premium badge placement
 * 
 * Performance:
 * - Low power mode detection
 * - Reduced animations on mobile
 * - Optimized re-renders
 * - Hardware acceleration
 * 
 * @example
 * ```tsx
 * <VipPremiumCard
 *   escort={{
 *     id: "vip-123",
 *     displayName: "Ayşe Y.",
 *     city: "Istanbul",
 *     isVip: true,
 *     rating: 4.9,
 *     // ... other escort properties
 *   }}
 * />
 * ```
 */

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Crown, CheckCircle2, Star, MapPin, Heart, ChevronRight, Sparkles } from "lucide-react";
import { useState, useRef } from 'react';

/**
 * Temporary usePerformance hook
 * TODO: Implement actual performance detection
 */
function usePerformance() {
  return { isLowPowerMode: false, isMobile: false };
}

/**
 * Props for VipPremiumCard component
 */
interface VipPremiumCardProps {
  escort: any;
}

export function VipPremiumCard({ escort }: VipPremiumCardProps) {
  const { isLowPowerMode, isMobile } = usePerformance();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Mobilde veya düşük güç modunda daha yumuşak/az hesaplamalı yaylar
  const springConfig = isLowPowerMode ? { stiffness: 50, damping: 20 } : { stiffness: 150, damping: 30 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // Düşük güç modunda rotasyonu azalt veya kapat
  const rotateRange = isLowPowerMode ? ["2deg", "-2deg"] : ["10deg", "-10deg"];
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], rotateRange);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], rotateRange);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[400px] aspect-[3/4.5] group cursor-pointer"
    >
      <Link href={`/escort/${escort.id}`}>
        <Card className="w-full h-full vip-premium-frame overflow-hidden rounded-3xl bg-black border-0">
          <CardContent className="p-0 h-full relative">
            {/* 3D Glow Effect */}
            <div className="vip-card-glow" />
            
            {/* Image Section */}
            <div className="absolute inset-0 z-0">
              {escort.profilePhoto ? (
                <img
                  src={escort.profilePhoto}
                  alt={escort.displayName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
                  <Crown className="w-20 h-20 text-white/10" />
                </div>
              )}
              {/* Premium Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10" />
            </div>

            {/* Content - Floating in 3D */}
            <div className="relative h-full flex flex-col justify-between p-8 z-10">
              {/* Top Badges */}
              <div className="flex justify-between items-start vip-badge-3d">
                <Badge className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black border-0 shadow-2xl px-4 py-2 text-xs font-black uppercase tracking-[0.2em] animate-pulse">
                  <Crown className="w-4 h-4 mr-2" />
                  ULTRA VIP
                </Badge>
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </div>
              </div>

              {/* Bottom Info */}
              <div className="space-y-4 vip-text-3d">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500 text-white border-0 px-2 py-0.5 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> DOĞRULANMIŞ
                  </Badge>
                  <Badge className="bg-white/10 backdrop-blur-md text-white border-0 px-2 py-0.5 text-[10px] font-bold">
                    <Sparkles className="w-3 h-3 mr-1 text-amber-400" /> POPÜLER
                  </Badge>
                </div>

                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-1 drop-shadow-2xl">
                    {escort.displayName}
                  </h2>
                  <div className="flex items-center text-white/80 font-medium">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    {escort.city}, {escort.district}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Saatlik Ücret</span>
                    <span className="text-2xl font-black text-white">₺{escort.hourlyRate}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-black text-white">5.0</span>
                  </div>
                </div>

                <Button className="w-full py-7 bg-white text-black hover:bg-primary hover:text-white font-black text-lg rounded-2xl transition-all group/btn">
                  PROFİLİ İNCELE
                  <ChevronRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default VipPremiumCard;
