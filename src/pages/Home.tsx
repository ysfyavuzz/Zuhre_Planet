import React from 'react';
import { CosmicNav } from '@/components/CosmicNav';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'wouter';

export default function Home(): JSX.Element {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between overflow-x-hidden">
      <Header />
      
      {/* 
          Hero Section (Removed static text as it is now in 3D SpaceBackground)
          Keeping this empty div to maintain structure if needed 
      */}
      <div className="w-full max-w-7xl px-6 pt-32 md:pt-48 pb-10 md:pb-20 content-layer pointer-events-none select-none" />

      {/* Spacer for 3D View */}
      <div className="h-[30vh] md:h-[40vh] w-full pointer-events-none" />

      {/* Interactive Bottom Layer */}
      <div className="w-full flex flex-col items-center gap-16 md:gap-24 relative z-20 pb-20 pointer-events-none">
        
        {/* CTA Button - MUST BE AUTO FOR CLICKS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
          className="pointer-events-auto px-6 w-full max-w-xs md:max-w-none flex justify-center"
        >
          <Link href="/escorts" className="w-full md:w-auto">
            <button className="group relative w-full md:w-auto px-12 md:px-20 py-8 md:py-10 bg-primary text-white rounded-[2rem] md:rounded-[3rem] font-black text-[10px] md:text-sm uppercase tracking-[0.5em] md:tracking-[0.8em] italic shadow-[0_30px_60px_rgba(139,92,246,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-6 cursor-pointer">
              <span className="relative z-10">YÖRÜNGEYE GİR</span>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 relative z-10 group-hover:translate-x-3 transition-transform" />
              <div className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </Link>
        </motion.div>

        <div className="w-full pointer-events-auto">
          <Footer />
        </div>

        <div className="pointer-events-auto">
          <CosmicNav />
        </div>
      </div>
    </div>
  );
}
