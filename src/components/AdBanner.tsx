/**
 * AdBanner Component
 * 
 * Displays advertisement banners in various formats (horizontal, vertical, native).
 * Supports animated transitions and responsive layouts.
 * 
 * @module components/AdBanner
 * @category Components
 * 
 * @example
 * ```tsx
 * <AdBanner 
 *   type="horizontal" 
 *   title="VIP Üyelik"
 *   description="Şimdi %50 indirimle"
 *   link="https://example.com/vip"
 * />
 * ```
 */

import { motion } from 'framer-motion';
import { ExternalLink, Info } from 'lucide-react';

/**
 * Props for AdBanner component
 */
interface AdBannerProps {
  type: 'horizontal' | 'vertical' | 'native';
  title?: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  className?: string;
}

export function AdBanner({ type, title, description, imageUrl, link, className = '' }: AdBannerProps) {
  const isHorizontal = type === 'horizontal';
  const isVertical = type === 'vertical';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-2xl glass border border-white/10 group ${
        isHorizontal ? 'w-full h-32 md:h-40' : isVertical ? 'w-full h-[600px]' : 'w-full p-6'
      } ${className}`}
    >
      <a href={link || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
        {imageUrl ? (
          <div className="absolute inset-0">
            <img src={imageUrl} alt="Advertisement" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 animate-pulse" />
        )}

        <div className="relative h-full flex flex-col justify-end p-6 z-10">
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded bg-black/40 backdrop-blur-md border border-white/10 text-[10px] text-white/60 uppercase tracking-widest">
            <Info className="w-3 h-3" />
            Reklam
          </div>

          {title && (
            <h4 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
              {title}
            </h4>
          )}
          {description && (
            <p className="text-sm text-white/70 line-clamp-2">
              {description}
            </p>
          )}
          
          <div className="mt-3 flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Hemen İncele <ExternalLink className="w-3 h-3 ml-1" />
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export default AdBanner;
