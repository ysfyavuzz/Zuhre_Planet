/**
 * Premium Hero Banner Component
 * 
 * Ana sayfa için lüks ve etkileyici hero banner.
 * Gradient arka planı, animasyonlar ve premium tasarım öğeleri içerir.
 * 
 * @module components/PremiumHeroBanner
 * @category Components - Sections
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FloatingElement, PulseGlow, AnimatedText } from './PremiumAnimations';
import { Sparkles, ArrowRight } from 'lucide-react';
import '../styles/premium-theme.css';

interface PremiumHeroBannerProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  onCtaClick?: () => void;
  backgroundImage?: string;
  showParticles?: boolean;
}

export const PremiumHeroBanner: React.FC<PremiumHeroBannerProps> = ({
  title,
  subtitle,
  ctaText = 'Keşfet',
  onCtaClick,
  backgroundImage,
  showParticles = true,
}) => {
  return (
    <div className="relative overflow-hidden h-screen min-h-[600px] max-h-[1000px]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-premium-dark" />
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-background z-0" />
      </div>

      {/* Animated Background Elements */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs */}
          <FloatingElement
            className="absolute top-10 left-10 w-20 md:w-32 h-20 md:h-32 rounded-full bg-gradient-gold-purple opacity-10 blur-3xl"
            duration={4}
          >
            <div />
          </FloatingElement>
          <FloatingElement
            className="absolute bottom-20 right-10 w-24 md:w-40 h-24 md:h-40 rounded-full bg-gradient-purple-rose opacity-10 blur-3xl"
            duration={5}
          >
            <div />
          </FloatingElement>
        </div>
      )}

      {/* Content - Centered and Responsive */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center pt-16 md:pt-20">
        {/* Large Logo - Responsive sizing */}
        <motion.div
          className="mb-4 md:mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img 
            src="/logo-full.png" 
            alt="ZEVK EVRENİ" 
            className="w-48 sm:w-64 md:w-80 lg:w-96 h-auto drop-shadow-2xl mx-auto"
          />
        </motion.div>

        {/* Title - Responsive font sizes */}
        <motion.h1
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-gradient-gold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {title}
        </motion.h1>

        {/* Subtitle - Responsive */}
        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-4 md:mb-6 max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>

        {/* CTA Button - Responsive */}
        {onCtaClick && (
          <motion.button
            className="btn-premium flex items-center gap-2 text-sm md:text-base lg:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg"
            onClick={onCtaClick}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {ctaText}
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
        )}

        {/* Stats Row - Responsive and Compact */}
        <motion.div
          className="mt-6 md:mt-10 grid grid-cols-3 gap-4 md:gap-8 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <StatCard number="1,240+" label="Aktif İlan" />
          <StatCard number="45K+" label="Günlük Ziyaret" />
          <StatCard number="850+" label="Doğrulanmış Profil" />
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

interface StatCardProps {
  number: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label }) => (
  <motion.div
    className="text-center"
    whileHover={{ scale: 1.05 }}
  >
    <div className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-gradient-premium mb-1">
      {number}
    </div>
    <div className="text-muted-foreground text-xs sm:text-sm md:text-base">
      {label}
    </div>
  </motion.div>
);

/* ========================================
   Premium Section Divider
   ======================================== */

interface PremiumDividerProps {
  variant?: 'gold' | 'purple' | 'gradient';
  className?: string;
}

export const PremiumDivider: React.FC<PremiumDividerProps> = ({
  variant = 'gold',
  className = '',
}) => {
  const variantClasses = {
    gold: 'separator-gold',
    purple: 'bg-gradient-to-r from-transparent via-purple-600 to-transparent h-1',
    gradient: 'bg-gradient-to-r from-transparent via-gold-500 to-transparent h-1',
  };

  return (
    <motion.div
      className={`${variantClasses[variant]} ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    />
  );
};

/* ========================================
   Premium Section Header
   ======================================== */

interface PremiumSectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export const PremiumSectionHeader: React.FC<PremiumSectionHeaderProps> = ({
  title,
  subtitle,
  centered = true,
  className = '',
}) => (
  <motion.div
    className={`${centered ? 'text-center' : ''} ${className}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <h2 className="text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
      {title}
    </h2>
    {subtitle && (
      <p className="text-lg text-dark-text-secondary max-w-2xl mx-auto">
        {subtitle}
      </p>
    )}
  </motion.div>
);
