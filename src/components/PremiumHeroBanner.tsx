/**
 * Premium Hero Banner Component
 * 
 * Ana sayfa için lüks ve etkileyici hero banner bileşeni.
 * Kozmik arka plan, animasyonlu nebula efektleri ve yıldız parçacıkları içerir.
 * 
 * @module components/PremiumHeroBanner
 * @category Components - Sections
 * 
 * Features:
 * - Kozmik nebula arka plan (cosmic-bg.jpg)
 * - Animated nebula orbları (Gold, Purple, Rose)
 * - 30 adet twinkle animasyonlu yıldız parçacığı
 * - Responsive tasarım (mobile-first)
 * - Framer Motion animasyonları
 * - İstatistik kartları (Aktif İlan, Günlük Ziyaret, Doğrulanmış Profil)
 * 
 * @example
 * ```tsx
 * <PremiumHeroBanner
 *   title="Lüks ve Seçkin Deneyim"
 *   subtitle="Türkiye'nin en kaliteli platformu"
 *   ctaText="Hemen Keşfet"
 *   onCtaClick={() => navigate('/catalog')}
 * />
 * ```
 * 
 * @see {@link StatCard} - İstatistik kartı alt bileşeni
 * @see {@link PremiumDivider} - Bölüm ayırıcı
 * @see {@link PremiumSectionHeader} - Bölüm başlığı
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import '../styles/premium-theme.css';

/**
 * PremiumHeroBanner bileşeni için prop tanımları
 */
interface PremiumHeroBannerProps {
  /** Ana başlık metni */
  title: string;
  /** Alt başlık/açıklama metni */
  subtitle: string;
  /** CTA butonu metni (varsayılan: 'Keşfet') */
  ctaText?: string;
  /** CTA butonuna tıklama handler'ı */
  onCtaClick?: () => void;
  /** Parçacık animasyonlarını göster/gizle (varsayılan: true) */
  showParticles?: boolean;
}

/**
 * Yıldız parçacığı veri yapısı
 */
interface StarParticle {
  /** Benzersiz yıldız ID'si */
  id: number;
  /** Yatay konum (%) */
  left: string;
  /** Dikey konum (%) */
  top: string;
  /** Yıldız boyutu (px) */
  size: number;
  /** Animasyon gecikmesi (s) */
  delay: number;
}


export const PremiumHeroBanner: React.FC<PremiumHeroBannerProps> = ({
  title,
  subtitle,
  ctaText = 'Keşfet',
  onCtaClick,
  showParticles = true,
}) => {
  // Generate random star positions
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 2,
    delay: Math.random() * 3,
  }));

  return (
    <div className="cosmic-bg relative overflow-hidden h-screen min-h-[600px] max-h-[1000px]">
      {/* Cosmic Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/cosmic-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-[1]" />

      {/* Animated Nebula Orbs */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden z-[2] pointer-events-none">
          {/* Gold Nebula */}
          <div 
            className="nebula-orb nebula-orb-gold absolute w-64 md:w-96 h-64 md:h-96"
            style={{ top: '10%', left: '5%', animationDelay: '0s' }}
          />
          {/* Purple Nebula */}
          <div 
            className="nebula-orb nebula-orb-purple absolute w-80 md:w-[500px] h-80 md:h-[500px]"
            style={{ bottom: '5%', right: '0%', animationDelay: '-5s' }}
          />
          {/* Rose Nebula */}
          <div 
            className="nebula-orb nebula-orb-rose absolute w-48 md:w-80 h-48 md:h-80"
            style={{ top: '40%', right: '20%', animationDelay: '-10s' }}
          />

          {/* Star Particles */}
          {stars.map((star) => (
            <div
              key={star.id}
              className="star-particle"
              style={{
                left: star.left,
                top: star.top,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Content - Centered and Responsive */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center pt-20 md:pt-24">
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
