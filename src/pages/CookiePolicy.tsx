/**
 * Cookie Policy Page
 * 
 * Comprehensive Cookie Policy documentation for the Escort Platform.
 * Explains types of cookies used, third-party cookies, cookie management,
 * and how to disable cookies.
 * 
 * @module pages/CookiePolicy
 * @category Pages - Legal
 * 
 * Features:
 * - Complete cookie policy documentation
 * - Types of cookies explanation
 * - Essential vs optional cookies breakdown
 * - Third-party cookie information
 * - Cookie management instructions
 * - How to disable cookies per browser
 * - Cookie consent options
 * - Mobile responsive design
 * - Last updated date tracking
 * 
 * Sections:
 * - Çerez Nedir? (What are Cookies?)
 * - Çerez Türleri (Types of Cookies)
 * - Üçüncü Taraf Çerezleri (Third-party Cookies)
 * - Çerez Yönetimi (Cookie Management)
 * - Tarayıcılarda Çerezleri Devre Dışı Bırakma (Disable Cookies)
 * 
 * @example
 * ```tsx
 * // Route: /cookies
 * <CookiePolicy />
 * ```
 */

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Cookie, Info, Settings, Smartphone, Chrome,
  Trash2, ChevronDown, ArrowUp, AlertCircle, CheckCircle2
} from 'lucide-react';

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sections: Section[] = [
  {
    id: 'what-are-cookies',
    title: 'Çerez Nedir?',
    icon: Info
  },
  {
    id: 'cookie-types',
    title: 'Çerez Türleri',
    icon: Settings
  },
  {
    id: 'third-party',
    title: 'Üçüncü Taraf Çerezleri',
    icon: AlertCircle
  },
  {
    id: 'management',
    title: 'Çerez Yönetimi',
    icon: Cookie
  },
  {
    id: 'disable',
    title: 'Çerezleri Devre Dışı Bırakma',
    icon: Trash2
  }
];

export default function CookiePolicy() {
  const [activeSection, setActiveSection] = useState('what-are-cookies');
  const [expandedItems, setExpandedItems] = useState<string[]>(['what-are-cookies']);
  const [selectedBrowser, setSelectedBrowser] = useState<'chrome' | 'firefox' | 'safari' | 'edge'>('chrome');
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setExpandedItems(prev => 
      prev.includes(sectionId) ? prev : [...prev, sectionId]
    );
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const toggleExpand = (sectionId: string) => {
    setExpandedItems(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getBrowserInstructions = () => {
    const instructions: Record<'chrome' | 'firefox' | 'safari' | 'edge', { title: string; steps: string[] }> = {
      chrome: {
        title: 'Google Chrome',
        steps: [
          '1. Chrome açın ve sağ üst köşedeki üç noktaya tıklayın',
          '2. "Ayarlar" seçeneğini tıklayın',
          '3. Sol menüden "Gizlilik ve güvenlik" → "Çerezler ve diğer site verileri" seçin',
          '4. İstediğiniz ayarı seçin:',
          '   • Tüm çerezleri engelle: "Tüm üçüncü taraf çerezleri engelle"',
          '   • Spesifik site çerezlerini engelle: "Siteleri engelle" bölümüne URL girin',
          '5. Değişiklikleri kaydedin'
        ]
      },
      firefox: {
        title: 'Mozilla Firefox',
        steps: [
          '1. Firefox açın ve sağ üst köşedeki hamburger menüsüne tıklayın',
          '2. "Ayarlar" seçeneğini tıklayın',
          '3. "Gizlilik & Güvenlik" sekmesine gidin',
          '4. "Çerezler ve Site Verileri" bölümünde ayar yapın:',
          '   • "Tüm çerezleri reddet" seçeneğini belirleyin',
          '   • "Özel ayarlar" ile seçici olarak devre dışı bırakın',
          '5. Değişiklikleri kaydedin'
        ]
      },
      safari: {
        title: 'Apple Safari',
        steps: [
          '1. Safari açın ve üst menü çubuğundan "Safari" seçin',
          '2. "Tercihler..." seçeneğine tıklayın',
          '3. "Gizlilik" sekmesine gidin',
          '4. "Çerezleri ve website verilerini engelle" seçeneğini işaretleyin',
          '   • "Hiçbir zaman": Tüm çerezleri kabul et',
          '   • "Sadece birinci taraf": Yalnızca site çerezlerini kabul et',
          '   • "Hiçbiri": Tüm çerezleri reddet',
          '5. Tercihler penceresini kapatın'
        ]
      },
      edge: {
        title: 'Microsoft Edge',
        steps: [
          '1. Edge açın ve sağ üst köşedeki üç noktaya tıklayın',
          '2. "Ayarlar" seçeneğini tıklayın',
          '3. "Gizlilik, arama ve hizmetler" sekmesine gidin',
          '4. "Gizlilik yönetimi" bölümünde:',
          '   • "Çerez yönetimi" seçeneğini açın',
          '   • İstediğiniz ayarı seçin',
          '5. Değişiklikleri otomatik olarak kaydedilir'
        ]
      }
    };
    return instructions[selectedBrowser];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="w-8 h-8" />
            <Badge className="bg-white/20 text-white border-white/30">YASAL DOKUMAN</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            Çerez Politikası
          </h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Escilanımız platformu çerezler kullanır. Bu politika, çerezlerin ne olduğu, 
            neden kullanıldığı ve nasıl kontrol edilebileceği hakkında bilgi verir.
          </p>
          <p className="text-sm text-white/70 mt-4">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-white/10 bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm">Bölümlere Git</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-2 text-sm font-medium ${
                        isActive
                          ? 'bg-primary text-white shadow-lg'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{section.title}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div ref={contentRef} className="lg:col-span-3 space-y-8">
            {/* What are Cookies */}
            <motion.div
              id="what-are-cookies"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('what-are-cookies')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Info className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Çerez Nedir?</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('what-are-cookies') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('what-are-cookies') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Çerezler, web siteleri tarafından cihazınızda (bilgisayar, telefon, tablet) 
                        depolanan küçük metin dosyalarıdır. Bu dosyalar, siteyi tekrar ziyaret ettiğinizde 
                        tarayıcı tarafından geri gönderilir.
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Çerezler, sizi tanımak, tercihlerinizi hatırlamak, oturum bilgilerinizi korumak ve 
                        deneyiminizi kişiselleştirmek gibi işlevler için kullanılır.
                      </p>

                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 space-y-2">
                        <h4 className="font-bold text-sm">Çerez Türlerinin Ayrımı:</h4>
                        <div className="space-y-2 text-sm">
                          <p className="flex items-start gap-2">
                            <span className="font-mono bg-primary/20 px-2 py-1 rounded text-primary text-xs shrink-0 mt-0.5">HTTP</span>
                            <span className="text-muted-foreground">HTTP-only çerezler: JavaScript ile erişilemez, daha güvenli</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="font-mono bg-primary/20 px-2 py-1 rounded text-primary text-xs shrink-0 mt-0.5">JS</span>
                            <span className="text-muted-foreground">JavaScript çerezleri: JavaScript kodu tarafından erişilebilir</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="font-mono bg-primary/20 px-2 py-1 rounded text-primary text-xs shrink-0 mt-0.5">OTURUM</span>
                            <span className="text-muted-foreground">Oturum çerezleri: Tarayıcı kapatıldığında silinir</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="font-mono bg-primary/20 px-2 py-1 rounded text-primary text-xs shrink-0 mt-0.5">KALICI</span>
                            <span className="text-muted-foreground">Kalıcı çerezler: Belirli süre cihazda kalır</span>
                          </p>
                        </div>
                      </div>

                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-sm">
                        <p className="text-muted-foreground">
                          <strong>Not:</strong> Çerezler zararlı değildir. Virüs veya casus yazılım 
                          içeremezler, ancak kötü amaçlı taraflar tarafından kötüye kullanılabilirler.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Cookie Types */}
            <motion.div
              id="cookie-types"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('cookie-types')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <Settings className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Çerez Türleri</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('cookie-types') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('cookie-types') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-4">
                      {/* Essential Cookies */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">ZORUNLU</Badge>
                          <h4 className="font-bold">Gerekli Çerezler (Essential Cookies)</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Platform'un çalışması için mutlak gerekli olan çerezlerdir. Bu çerezleri devre dışı bırakırsanız, 
                          platform çalışmayabilir.
                        </p>
                        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 space-y-2 text-sm">
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Oturum kimliği (SESSIONID)</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> CSRF koruması token</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Tercih ayarları (dil, tema)</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Kimlik doğrulama token</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Platform istatistikleri</p>
                        </div>
                      </div>

                      {/* Performance Cookies */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">OPSİYONEL</Badge>
                          <h4 className="font-bold">Performans Çerezleri (Performance Cookies)</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Platform'un performansını iyileştirmek ve hizmetlerin kalitesini artırmak için kullanılır. 
                          Devre dışı bırakılabilir ancak deneyimi etkileyebilir.
                        </p>
                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 space-y-2 text-sm">
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Sayfa yükleme zamanı ölçümü</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Hata raporlama (Sentry)</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Kullanıcı davranış analizi</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Google Analytics</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Crash raporu toplamı</p>
                        </div>
                      </div>

                      {/* Functional Cookies */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30">OPSİYONEL</Badge>
                          <h4 className="font-bold">İşlevsel Çerezler (Functional Cookies)</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Kullanıcı deneyimini kişiselleştirmek ve daha kolay hale getirmek için kullanılır. 
                          Bunlar da devre dışı bırakılabilir.
                        </p>
                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 space-y-2 text-sm">
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Son arama geçmişi</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Filtre tercihleri</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Sıralama seçimleri</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Favori listeler</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Son ziyaret edilen profiller</p>
                        </div>
                      </div>

                      {/* Marketing Cookies */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-red-500/20 text-red-600 border-red-500/30">OPSİYONEL</Badge>
                          <h4 className="font-bold">Pazarlama Çerezleri (Marketing Cookies)</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Kişiselleştirilmiş reklamlar ve pazarlama amacıyla kullanılır. 
                          Gizlilik endişeleriniz varsa devre dışı bırakabilirsiniz.
                        </p>
                        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 space-y-2 text-sm">
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-600" /> Facebook piksel takibi</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-600" /> Google Ads dönüşüm takibi</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-600" /> Yeniden pazarlama (retargeting)</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-600" /> Sosyal medya entegrasyonu</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-600" /> A/B test çerezleri</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Third-party Cookies */}
            <motion.div
              id="third-party"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('third-party')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Üçüncü Taraf Çerezleri</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('third-party') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('third-party') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Üçüncü taraf çerezleri, Escilanımız dışında başka şirketler tarafından ayarlanan çerezlerdir. 
                        Platform'a embedded hizmetler aracılığıyla yerleştirilirler.
                      </p>

                      <div>
                        <h4 className="font-bold mb-2 text-sm">Kullanılan Üçüncü Taraf Hizmetler:</h4>
                        <div className="space-y-2">
                          <div className="bg-muted/30 rounded-lg p-3">
                            <p className="font-semibold text-sm mb-1">Google Analytics</p>
                            <p className="text-xs text-muted-foreground">
                              Siteye nasıl erişildiği, hangi sayfaları ziyaret ettiğiniz gibi analiz verilerini toplar. 
                              <span className="block mt-1"><strong>İleri Bilgi:</strong> google.com/policies/privacy</span>
                            </p>
                          </div>

                          <div className="bg-muted/30 rounded-lg p-3">
                            <p className="font-semibold text-sm mb-1">Google Ads</p>
                            <p className="text-xs text-muted-foreground">
                              Kişiselleştirilmiş reklamlar göstermek için dönüşüm verilerini izler. 
                              <span className="block mt-1"><strong>İleri Bilgi:</strong> policies.google.com/technologies/ads</span>
                            </p>
                          </div>

                          <div className="bg-muted/30 rounded-lg p-3">
                            <p className="font-semibold text-sm mb-1">Facebook / Meta Pixel</p>
                            <p className="text-xs text-muted-foreground">
                              Sosyal medya reklamları ve yeniden pazarlama için etkinlikları takip eder. 
                              <span className="block mt-1"><strong>İleri Bilgi:</strong> facebook.com/privacy</span>
                            </p>
                          </div>

                          <div className="bg-muted/30 rounded-lg p-3">
                            <p className="font-semibold text-sm mb-1">Sentry (Error Tracking)</p>
                            <p className="text-xs text-muted-foreground">
                              Platform hatalarını ve sorunlarını raporlamak için kullanılır. 
                              <span className="block mt-1"><strong>İleri Bilgi:</strong> sentry.io/privacy</span>
                            </p>
                          </div>

                          <div className="bg-muted/30 rounded-lg p-3">
                            <p className="font-semibold text-sm mb-1">Stripe (Ödeme)</p>
                            <p className="text-xs text-muted-foreground">
                              Ödeme işleme ve dolandırıcılık tespiti için kullanılır. 
                              <span className="block mt-1"><strong>İleri Bilgi:</strong> stripe.com/privacy</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 text-sm">
                        <p className="text-muted-foreground">
                          <strong>Kontrol:</strong> Üçüncü taraf çerezleri devre dışı bırakmak, 
                          ilgili hizmetlerin işlevselliğini etkileyebilir.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Cookie Management */}
            <motion.div
              id="management"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('management')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Cookie className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Çerez Yönetimi</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('management') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('management') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold mb-2">Platform'da Çerez Kontrol</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Escilanımız platformunda çerez tercihlerinizi kontrol edebilirsiniz:
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">
                              <strong>1. Hesap Ayarları:</strong> Gizlilik sekmesine gidin ve çerez tercihlerinizi ayarlayın.
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">
                              <strong>2. Rıza Yönetimi:</strong> Analiz ve pazarlama çerezlerini kabul veya reddet edebilirsiniz.
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">
                              <strong>3. Bağlantı Kaldırma:</strong> Facebook, Google vb. bağlantılarını kaldırabilirsiniz.
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">
                              <strong>4. Tüm Çerezleri Sil:</strong> "Çerezleri Temizle" butonunu tıklayarak tüm çerezleri silebilirsiniz.
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">Tarayıcı Çerez Ayarları</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Tarayıcınızda doğrudan çerez ayarlarını yapabilirsiniz:
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">
                              Tüm çerezleri engelle veya belirli siteler için izin ver
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">
                              Üçüncü taraf çerezlerini engelle
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">
                              Gizli/Özel tarama modunu kullanın (çerezler kalıcı değildir)
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">
                              Çerez yönetim eklentilerini kurun
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">Reklam Tercihleriniz</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Google, Facebook vb. üzerinden kişiselleştirilmiş reklam tercihlerinizi yönetebilirsiniz:
                        </p>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            Google Ads Tercihlerini Yönet
                          </Button>
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            Facebook Reklam Tercihlerini Yönet
                          </Button>
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            Digital Advertising Alliance Tercihlerini Yönet
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Disable Cookies */}
            <motion.div
              id="disable"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('disable')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                        <Trash2 className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Çerezleri Devre Dışı Bırakma</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('disable') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('disable') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Aşağıdaki tarayıcılardan birini seçerek, çerezleri devre dışı bırakma adımlarını görebilirsiniz:
                      </p>

                      {/* Browser Selection */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          { id: 'chrome' as const, label: 'Chrome', icon: Chrome },
                          { id: 'firefox' as const, label: 'Firefox', icon: Chrome },
                          { id: 'safari' as const, label: 'Safari', icon: Smartphone },
                          { id: 'edge' as const, label: 'Edge', icon: Chrome }
                        ].map(({ id, label, icon: Icon }) => (
                          <button
                            key={id}
                            onClick={() => setSelectedBrowser(id)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                              selectedBrowser === id
                                ? 'border-primary bg-primary/10'
                                : 'border-white/10 hover:border-primary/50'
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs font-medium">{label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Instructions */}
                      <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                        <h4 className="font-bold text-sm">{getBrowserInstructions().title}</h4>
                        <ol className="space-y-2">
                          {getBrowserInstructions().steps.map((step, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              <span className="font-mono bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">
                                {step.substring(0, 1)}
                              </span>
                              <span className="ml-2">{step.substring(2)}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-sm">
                        <p className="text-muted-foreground">
                          <strong>Uyarı:</strong> Tüm çerezleri devre dışı bırakırsanız, 
                          bazı siteler düzgün çalışmayabilir. Gerekli çerezleri açık tutmanız önerilir.
                        </p>
                      </div>

                      {/* Do Not Track */}
                      <div>
                        <h4 className="font-bold mb-2 text-sm">Do Not Track (DNT) Ayarı</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Tarayıcınızda "Do Not Track" (DNT) ayarını etkinleştirerek, 
                          web siteleri ve reklam ağlarından sizi takip etmemesini talep edebilirsiniz.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">
                              <strong>Chrome:</strong> Ayarlar → Gizlilik ve Güvenlik → "Siteler ve yayımcılar tarafından takip edilmek istemiyorum" seçeneğini işaretleyin
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">
                              <strong>Firefox:</strong> Ayarlar → Gizlilik → "Takip Edilmek İstemiyorum" seçeneğini işaretleyin
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">
                              <strong>Safari:</strong> Tercihler → Gizlilik → "Takip Edilmek İstemiyorum" seçeneğini işaretleyin
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-amber-500/30 bg-amber-500/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <CardTitle className="text-amber-600">ÖNEMLİ BİLDİRİM</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Bu Çerez Politikası, Escilanımız tarafından herhangi bir yasal ihbar olmaksızın değiştirilebilir. 
                    Değişiklikler yayınlandığında yürürlüğe girer.
                  </p>
                  <p>
                    Platform'u kullanmaya devam ettiğiniz takdirde, bu değişiklikleri kabul etmiş sayılırsınız.
                  </p>
                  <p>
                    Sorularınız veya endişeleriniz için lütfen privacy@escilanimiz.com adresine e-posta gönderin.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Back to Top Button */}
            <div className="flex justify-center pt-8">
              <Button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                variant="outline"
                className="gap-2"
              >
                <ArrowUp className="w-4 h-4" />
                Başına Dön
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
