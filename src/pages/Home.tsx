/**
 * Home Page - Ana Sayfa
 * 
 * Platform ana sayfası - kozmik hero banner, VIP vitrini, özellik kartları,
 * son ilanlar ve üyelik CTA bölümlerini içerir.
 * 
 * @module pages/Home
 * @category Pages
 * 
 * Sections:
 * 1. PremiumHeroBanner - Kozmik temalı ana banner
 * 2. VIP Vitrin - Öne çıkan VIP profiller (3 adet)
 * 3. Features - Platform özellikleri (4 kart)
 * 4. Yeni İlanlar - Son eklenen profiller (6 adet)
 * 5. Join CTA - Üyelik teşvik bölümü
 * 
 * @example
 * ```tsx
 * <Route path="/" component={Home} />
 * ```
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from "wouter";
import { Footer } from '@/components/Footer';
import CosmicNav from "@/components/CosmicNav";
import { PremiumHeroBanner, PremiumSectionHeader, PremiumDivider } from "@/components/PremiumHeroBanner";
import { VipPremiumCard } from "@/components/VipPremiumCard";
import { StandardCard } from "@/components/StandardCard";
import { mockEscorts } from "@/data/mockData";
import { Crown, Shield, Star, Zap, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedContainer, AnimatedItem } from "@/components/PremiumAnimations";

/**
 * Ana sayfa bileşeni
 * 
 * @returns {JSX.Element} Render edilmiş ana sayfa
 */
export default function Home(): JSX.Element {
  /** VIP profiller - sadece ilk 3 tanesi gösteriliyor */
  const vipEscorts = mockEscorts.filter(e => e.isVip).slice(0, 3);
  
  /** Son eklenen profiller - VIP olmayanlardan ilk 6 tanesi */
  const recentEscorts = mockEscorts.filter(e => !e.isVip).slice(0, 6);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero Section - Kozmik temalı ana banner */}
      <PremiumHeroBanner 
        title="Lüks ve Seçkin Deneyim"
        subtitle="Türkiye'nin en kaliteli ve güvenilir eskort platformuna hoş geldiniz. Sizin için en iyileri bir araya getirdik."
        onCtaClick={() => window.location.href = '/catalog'}
        ctaText="Hemen Keşfet"
      />

      <main className="container mx-auto px-4 py-16 space-y-24">
        
        {/* VIP Section */}
        <section>
          <PremiumSectionHeader 
            title="VIP Vitrini" 
            subtitle="En seçkin üyelerimizle tanışın. Kalite ve zarafetin buluşma noktası."
          />
          <AnimatedContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {vipEscorts.map((escort, index) => (
              <AnimatedItem key={escort.id} delay={index * 0.1}>
                <VipPremiumCard escort={escort} />
              </AnimatedItem>
            ))}
          </AnimatedContainer>
          <div className="flex justify-center mt-12">
            <Link href="/catalog?isVip=true">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-gold-500 font-bold border-b border-gold-500 pb-1"
              >
                Tüm VIP Profilleri Gör <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </section>

        <PremiumDivider variant="gradient" />

        {/* Features Section */}
        <section className="bg-card rounded-3xl p-12 border border-border relative overflow-hidden glass-frost">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-sky-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Shield className="w-8 h-8 text-gold-500" />}
              title="Güvenli ve Gizli"
              description="Tüm verileriniz uçtan uca şifrelenir ve gizliliğiniz en üst düzeyde tutulur."
            />
            <FeatureCard 
              icon={<Star className="w-8 h-8 text-gold-500" />}
              title="Doğrulanmış Profiller"
              description="Fotoğraf doğrulama sistemimizle gerçek ve güncel profillerle tanışın."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-gold-500" />}
              title="Hızlı İletişim"
              description="Gelişmiş mesajlaşma sistemiyle anında bağlantı kurun."
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-gold-500" />}
              title="Geniş Katalog"
              description="Türkiye genelinde binlerce seçkin profil arasından seçim yapın."
            />
          </div>
        </section>

        {/* Recent Listings */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-2">Yeni İlanlar</h2>
              <p className="text-muted-foreground">Platformumuza en son katılan seçkin üyeler.</p>
            </div>
            <Link href="/catalog">
              <Button variant="outline" className="border-dark-border hover:border-gold-500">
                Tümünü Gör
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEscorts.map(escort => (
              <StandardCard key={escort.id} escort={escort} />
            ))}
          </div>
        </section>

        {/* Join CTA */}
        <section className="card-cosmic relative rounded-3xl overflow-hidden py-16 md:py-20 px-8 text-center border-animated">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-sky-900/30 z-0" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="icon-3d p-4 mx-auto mb-6 w-fit">
              <Crown className="w-12 h-12 md:w-16 md:h-16 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-cosmic-glow">Kendi İlanınızı Oluşturun</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              Siz de seçkin üyelerimiz arasına katılın ve binlerce kullanıcıya ulaşın. 
              Hemen kayıt olun ve profilinizi oluşturun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/escort/register">
                <Button className="btn-premium px-10 py-6 text-lg rounded-xl w-full sm:w-auto">
                  Üye Ol
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="border-white/20 px-10 py-6 text-lg rounded-xl w-full sm:w-auto">
                  Daha Fazla Bilgi
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />

      <CosmicNav />
    </div>
  );
}

/**
 * FeatureCard - Özellik Kartı Bileşeni
 * 
 * Platform özelliklerini sergileyen 3D ikon kartları.
 * Kozmik tema ile uyumlu hover efektleri ve floating animasyonlar.
 * 
 * @param {Object} props - Bileşen props'ları
 * @param {React.ReactNode} props.icon - Lucide ikon bileşeni
 * @param {string} props.title - Özellik başlığı
 * @param {string} props.description - Özellik açıklaması
 * @returns {JSX.Element} Render edilmiş özellik kartı
 */
function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}): JSX.Element {
  return (
    <div className="flex flex-col items-center text-center space-y-4 group">
      {/* 3D Floating Icon Container */}
      <div className="icon-3d icon-floating p-5">
        {icon}
      </div>
      {/* Title with hover gradient effect */}
      <h3 className="text-xl font-bold text-foreground group-hover:text-gradient-cosmic transition-all">
        {title}
      </h3>
      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
