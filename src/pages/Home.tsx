import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { AdBanner } from "@/components/AdBanner";
import { SEO } from "@/pages/SEO";
import { VipPremiumCard } from "@/components/VipPremiumCard";
import { StandardCard } from "@/components/StandardCard";
import { mockEscorts, mockAds } from "@/mockData";
import {
  Search, MapPin, Star, Shield, Heart, Sparkles,
  ArrowRight, Crown, CheckCircle2, Zap, Users,
  Award, ChevronRight, ChevronLeft, Flame
} from "lucide-react";
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectCoverflow } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

// StandardCard bileşeni artık dışarıdan alınıyor

export default function Home() {
  const { data: vipEscortsDb = [] } = trpc.vip.getFeatured.useQuery({ limit: 10 });
  const { data: allEscortsDb = [] } = trpc.catalog.list.useQuery({ limit: 12, offset: 0 });
  const { data: citiesDb = [] } = trpc.catalog.getCities.useQuery();

  // Veritabanı boşsa mock verileri kullan
  const vipEscorts = vipEscortsDb.length > 0 ? vipEscortsDb : mockEscorts.filter(e => e.isVip);
  const allEscorts = allEscortsDb.length > 0 ? allEscortsDb : mockEscorts;
  const cities = citiesDb.length > 0 ? citiesDb : ["İstanbul", "Bursa", "Kocaeli", "Sakarya", "Tekirdağ"];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <SEO 
        title="Marmara Escort İlanları | İstanbul, Bursa, Kocaeli VIP Escort"
        description="Marmara bölgesinin en seçkin escort ilan platformu. İstanbul, Bursa ve Kocaeli'de onaylı, VIP ve güvenilir escort profilleri ile tanışın."
        keywords="istanbul escort, bursa escort, kocaeli escort, marmara escort, vip escort istanbul, onaylı escort ilanları, şişli escort, beşiktaş escort, kadıköy escort"
      />
      {/* Header artık App.tsx'ten geliyor */}

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,70,239,0.1),transparent_50%)]" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 px-4 py-1.5 text-xs font-bold bg-primary/10 text-primary border-primary/20 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Türkiye'nin En Seçkin Platformu
              </Badge>
              
              <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
                KALİTE <br />
                <span className="text-gradient">AYRICALIKTIR</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                En seçkin escort ilanları, doğrulanmış profiller ve premium hizmet anlayışı ile tanışın.
              </p>

              {/* Search Box */}
              <Card className="glass shadow-2xl border-white/10 p-2 max-w-3xl mx-auto">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="İsim veya kategori ara..."
                      className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-lg"
                    />
                  </div>
                  <div className="h-10 w-px bg-white/10 hidden md:block self-center" />
                  <select className="bg-transparent border-none focus:ring-0 px-6 py-4 text-lg cursor-pointer">
                    <option value="">Tüm Şehirler</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <Button size="lg" className="md:px-10 py-7 bg-gradient-to-r from-primary to-accent text-lg font-bold">
                    ARA
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VIP Showcase - Carousel */}
      <section className="py-24 bg-black/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary mb-4">
                <Crown className="w-6 h-6" />
                <span className="text-sm font-black uppercase tracking-[0.3em]">Premium Seçimler</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">VIP VİTRİN</h2>
            </div>
            <Link href="/escorts?filter=vip">
              <Button variant="link" className="text-primary font-bold p-0 h-auto text-lg">
                Tüm VIP İlanları Gör <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 5,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: true,
            }}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            className="vip-swiper !pb-16"
            breakpoints={{
              320: { slidesPerView: 1.2, spaceBetween: 20 },
              768: { slidesPerView: 2.5, spaceBetween: 30 },
              1024: { slidesPerView: 3.5, spaceBetween: 40 }
            }}
          >
            {vipEscorts.length > 0 ? vipEscorts.map((escort) => (
              <SwiperSlide key={escort.id} className="!h-auto !w-[350px] md:!w-[400px] py-10">
                <VipPremiumCard escort={escort} />
              </SwiperSlide>
            )) : (
              [...Array(5)].map((_, i) => (
                <SwiperSlide key={i} className="!h-auto">
                  <div className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </section>

      {/* Main Content with Ads */}
      <section className="py-24 container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Content - Main Grid */}
          <div className="lg:col-span-9 space-y-12">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black tracking-tighter">YENİ İLANLAR</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">En Yeni</Button>
                <Button variant="outline" size="sm">Popüler</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {allEscorts.map((escort, idx) => (
                <motion.div
                  key={escort.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <StandardCard escort={escort} type={idx % 4 === 0 ? 'boost' : 'normal'} />
                </motion.div>
              ))}
            </div>

            {/* Horizontal Ad between content */}
            <AdBanner 
              type="horizontal" 
              title={mockAds[0].title} 
              description={mockAds[0].description}
              imageUrl={mockAds[0].imageUrl}
              link={mockAds[0].link}
              className="my-12"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {/* More items... */}
              {allEscorts.slice(0, 6).map((escort, idx) => (
                <StandardCard key={`more-${idx}`} escort={escort} />
              ))}
            </div>
            
            <div className="text-center pt-12">
              <Button size="lg" variant="outline" className="px-12 py-8 text-xl font-bold border-2 hover:bg-primary hover:text-white transition-all">
                DAHA FAZLA YÜKLE
              </Button>
            </div>
          </div>

          {/* Right Sidebar - Ads & Stats */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="sticky top-24 space-y-8">
              <AdBanner 
                type="vertical" 
                title={mockAds[1].title} 
                description={mockAds[1].description}
                imageUrl={mockAds[1].imageUrl}
                link={mockAds[1].link}
              />
              
              <Card className="glass p-6">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  İSTATİSTİKLER
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Aktif İlan</span>
                    <span className="font-bold">1,240</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Günlük Ziyaret</span>
                    <span className="font-bold">45,000+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Onaylı Üye</span>
                    <span className="font-bold">850</span>
                  </div>
                </div>
              </Card>

              <AdBanner 
                type="native" 
                title="GÜVENLİ ÖDEME" 
                description="Tüm işlemleriniz uçtan uca şifreli ve anonimdir."
              />
            </div>
          </aside>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/5 py-20 mt-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-black mb-6 tracking-tighter">ESCORT PLATFORM</h2>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                Türkiye'nin en güvenilir ve seçkin escort ilan platformu. Profesyonel hizmet, doğrulanmış profiller ve gizlilik odaklı yaklaşım.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">HIZLI MENÜ</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/escorts" className="hover:text-primary transition-colors">Tüm İlanlar</Link></li>
                <li><Link href="/vip" className="hover:text-primary transition-colors">VIP Paketler</Link></li>
                <li><Link href="/register" className="hover:text-primary transition-colors">İlan Ver</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">İletişim</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">YASAL</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/terms" className="hover:text-primary transition-colors">Kullanım Koşulları</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Gizlilik Politikası</Link></li>
                <li><Link href="/safety" className="hover:text-primary transition-colors">Güvenlik Rehberi</Link></li>
                <li className="text-red-500 font-bold">18+ Yetişkin İçerik</li>
              </ul>
            </div>
          </div>
          <Separator className="my-12 bg-white/5" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
            <p>© 2026 Escort Platform. Tüm hakları saklıdır.</p>
            <div className="flex gap-6">
              <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> SSL Korumalı</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> %100 Güvenli</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
