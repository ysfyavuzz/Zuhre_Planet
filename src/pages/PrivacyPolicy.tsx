/**
 * Privacy Policy Page
 * 
 * Comprehensive Privacy Policy documentation for the Escort Platform.
 * Details data collection, usage, sharing, user rights, cookies, retention,
 * security measures and KVKK/GDPR compliance.
 * 
 * @module pages/PrivacyPolicy
 * @category Pages - Legal
 * 
 * Features:
 * - Complete privacy policy documentation
 * - Data collection information
 * - Data usage and processing details
 * - Data sharing and third-party policies
 * - User rights (KVKK/GDPR compliant)
 * - Cookies policy and management
 * - Data retention periods
 * - Security and encryption measures
 * - Contact information
 * - Smooth section navigation
 * - Mobile responsive design
 * - Last updated date tracking
 * 
 * Sections:
 * - Veri Toplama (Data Collection)
 * - Verilerin Kullanılması (Data Usage)
 * - Veri Paylaşımı (Data Sharing)
 * - Kullanıcı Hakları (User Rights)
 * - Çerez Politikası (Cookies)
 * - Veri Saklama (Retention)
 * - Güvenlik Önlemleri (Security)
 * - İletişim (Contact)
 * 
 * @example
 * ```tsx
 * // Route: /privacy
 * <PrivacyPolicy />
 * ```
 */

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield, Database, Share2, Users, Cookie, Clock, Lock,
  Mail, ChevronDown, ArrowUp, Eye, AlertCircle, CheckCircle2
} from 'lucide-react';

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const sections: Section[] = [
  {
    id: 'data-collection',
    title: 'Veri Toplama',
    icon: Database,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'data-usage',
    title: 'Verilerin Kullanılması',
    icon: Eye,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'data-sharing',
    title: 'Veri Paylaşımı',
    icon: Share2,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'user-rights',
    title: 'Kullanıcı Hakları',
    icon: Users,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'cookies',
    title: 'Çerez Politikası',
    icon: Cookie,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'data-retention',
    title: 'Veri Saklama',
    icon: Clock,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'security',
    title: 'Güvenlik Önlemleri',
    icon: Lock,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'contact',
    title: 'İletişim',
    icon: Mail,
    color: 'from-amber-500 to-orange-500'
  }
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('data-collection');
  const [expandedItems, setExpandedItems] = useState<string[]>(['data-collection']);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8" />
            <Badge className="bg-white/20 text-white border-white/30">YASAL DOKUMAN</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            Gizlilik Politikası
          </h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Zuhre Planet, kişisel verilerinizin gizliliğini ve korunmasını ciddiye alır. 
            Bu politika, verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi verir.
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
            {/* Data Collection Section */}
            <motion.div
              id="data-collection"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('data-collection')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Database className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Veri Toplama</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('data-collection') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('data-collection') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold mb-2">Hesap Bilgileri</h4>
                        <div className="bg-muted/30 rounded-lg p-3 space-y-1 text-sm">
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Adı, soyadı</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> E-posta adresi</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Telefon numarası</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Doğum tarihi</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Şifre (şifreli)</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">Profil Bilgileri</h4>
                        <div className="bg-muted/30 rounded-lg p-3 space-y-1 text-sm">
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Fotoğraflar</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Video (varsa)</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Biyografi</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Hizmetler ve özellikler</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Lokasyon bilgileri</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">Ödeme Bilgileri</h4>
                        <div className="bg-muted/30 rounded-lg p-3 space-y-1 text-sm">
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Kredi kartı numarası (kısmi)</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Banka hesap bilgileri</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> İşlem geçmişi</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Fatura adresi</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">Teknik Bilgiler</h4>
                        <div className="bg-muted/30 rounded-lg p-3 space-y-1 text-sm">
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> IP adresi</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Tarayıcı bilgileri</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Cihaz türü</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Konum verisi</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Kullanım aktiviteleri</p>
                        </div>
                      </div>

                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 text-sm">
                        <p className="text-muted-foreground">
                          Kimlik doğrulama amaçlı olarak, kimlik belgesi (pasaport, ehliyet vb.) kopyası talep edilebilir.
                          Bu belgeler üçüncü taraf doğrulama hizmetleri tarafından işlenir ve hemen silinir.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Data Usage Section */}
            <motion.div
              id="data-usage"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('data-usage')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Verilerin Kullanılması</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('data-usage') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('data-usage') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Hesap Yönetimi</h4>
                          <p className="text-sm text-muted-foreground">
                            Hesapların oluşturulması, yönetilmesi, güncellemesi ve destek sağlanması amacıyla.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Ödeme İşlemi</h4>
                          <p className="text-sm text-muted-foreground">
                            Ödemelerin işlenmesi, dolandırıcılık tespiti ve vergi hesaplaması amacıyla.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">İletişim</h4>
                          <p className="text-sm text-muted-foreground">
                            E-posta, SMS veya push bildirimler aracılığıyla sizinle iletişim kurma amacıyla.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Güvenlik ve Uyum</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform güvenliğini sağlamak, dolandırıcılığı önlemek ve yasaları yerine getirmek amacıyla.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Kişiselleştirme</h4>
                          <p className="text-sm text-muted-foreground">
                            Kullanıcı deneyimini iyileştirmek ve kişiselleştirilmiş içerik sunmak amacıyla.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Analiz ve İyileştirme</h4>
                          <p className="text-sm text-muted-foreground">
                            Hizmetlerin kalitesini artırmak, trendleri analiz etmek ve istatistik toplamak amacıyla.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Yasal İşleme</h4>
                          <p className="text-sm text-muted-foreground">
                            Yasal yükümlülükler, adli taleplar ve Veri Sorumlusunun meşru menfaatleri amacıyla.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Data Sharing Section */}
            <motion.div
              id="data-sharing"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('data-sharing')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <Share2 className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Veri Paylaşımı</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('data-sharing') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('data-sharing') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold mb-2">Üçüncü Taraf Hizmet Sağlayıcıları</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Aşağıdaki amaca yönelik olarak veriler paylaşılabilir:
                        </p>
                        <div className="bg-muted/30 rounded-lg p-3 space-y-2 text-sm">
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Ödeme işleme (Stripe, PayPal vb.)</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> E-posta hizmetleri (SendGrid, SES vb.)</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Web barındırma (AWS, Azure vb.)</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Analiz araçları (Google Analytics vb.)</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Kimlik doğrulama (Veriff, IDology vb.)</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">Yasal Gereklilikleri</h4>
                        <p className="text-sm text-muted-foreground">
                          Veriler adli, idari ve yasal taleplere cevap vermek amacıyla paylaşılabilir. 
                          Devlet organlarının yasal talepleri karşısında veriler müstesna haller dışında paylaşılacaktır.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">İşletme Aktarımları</h4>
                        <p className="text-sm text-muted-foreground">
                          Platform satılması, birleşmesi veya devralmadan, veriler devralan tarafa aktarılabilir. 
                          Bu durumda sizi bilgilendirilecek.
                        </p>
                      </div>

                      <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 text-sm">
                        <p className="text-muted-foreground">
                          <strong>PAYLAŞMA YAPMIYORUZ:</strong> Verileriniz hiçbir koşulda pazarlama veya tanıtım 
                          amacıyla, sizin açık onayınız olmadan satılmaz veya paylaşılmaz.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* User Rights Section */}
            <motion.div
              id="user-rights"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('user-rights')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Kullanıcı Hakları (KVKK)</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('user-rights') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('user-rights') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Bilgi Alma Hakkı</h4>
                          <p className="text-sm text-muted-foreground">
                            Kişisel verilerinizin işlenip işlenmediği hakkında bilgi alma hakkınız vardır. 
                            İşleniyorsa, verilerle ilgili detaylı bilgi talebinde bulunabilirsiniz.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Erişim Hakkı</h4>
                          <p className="text-sm text-muted-foreground">
                            Verilerinize erişim talep edebilir, kopyasını alabilirsiniz. 
                            Talepleriniz 30 gün içinde yerine getirilecektir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Düzeltme Hakkı</h4>
                          <p className="text-sm text-muted-foreground">
                            Eksik veya hatalı verilerinizi düzelttirebilir, tamamlayabilirsiniz. 
                            Düzeltme talebiniz 30 gün içinde yapılacaktır.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Silme Hakkı</h4>
                          <p className="text-sm text-muted-foreground">
                            Verilerinizin silinmesini talep edebilirsiniz (varsa yasal engel olmadığı takdirde). 
                            Silme talebi 30 gün içinde yerine getirilecektir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Taşınabilirlik Hakkı</h4>
                          <p className="text-sm text-muted-foreground">
                            Verilerinizin yapılandırılmış, yaygın olarak kullanılan formatta kopyasını talebinde bulunabilirsiniz. 
                            Bu kopyayı başka hizmet sağlayıcılara aktarabilirsiniz.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">İtiraz Hakkı</h4>
                          <p className="text-sm text-muted-foreground">
                            Verilerinizin işlenmesine itiraz edebilir, otomatik karar alınmasına karşı çıkabilirsiniz.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Rıza Geri Alma</h4>
                          <p className="text-sm text-muted-foreground">
                            Rızaya dayalı işlemler için, rızanızı istediğiniz zaman geri çekebilirsiniz. 
                            Geri çekilme, önceki işlemlerin geçerliliğini etkilemez.
                          </p>
                        </div>
                      </div>

                      <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 text-sm">
                        <p className="text-muted-foreground">
                          <strong>HAKLARI KULLANMAK İÇİN:</strong> Aşağıdaki bilgileri içeren bir e-posta gönderin: 
                          Ad-soyad, e-posta adresi, talebiniz, imza. E-posta: privacy@zuhreplanet.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Cookies Section */}
            <motion.div
              id="cookies"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('cookies')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                        <Cookie className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Çerez Politikası</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('cookies') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('cookies') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold mb-2">Gerekli Çerezler (Zorunlu)</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Platform'un çalışması için gerekli olan çerezler:
                        </p>
                        <div className="bg-muted/30 rounded-lg p-3 space-y-2 text-sm">
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Oturum çerezleri (session cookies)</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Güvenlik çerezleri (CSRF koruması)</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Tercih çerezleri (dil, tema)</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Kimlik doğrulama çerezleri</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Bu çerezler devre dışı bırakılamaz. Platform'u kullanmak için gereklidir.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">Analiz Çerezleri (Seçmeli)</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Hizmetleri iyileştirmek amacıyla kullanılır:
                        </p>
                        <div className="bg-muted/30 rounded-lg p-3 space-y-2 text-sm">
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Google Analytics</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Kullanıcı davranış analizi</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Sayfa performans analizi</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Hata raporlama (Sentry)</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Bu çerezleri ayarlardan devre dışı bırakabilirsiniz.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">Pazarlama Çerezleri</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Kişiselleştirilmiş reklam göstermek amacıyla kullanılır:
                        </p>
                        <div className="bg-muted/30 rounded-lg p-3 space-y-2 text-sm">
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Pixel takibi (Facebook, Google)</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Retargeting çerezleri</p>
                          <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Sosyal medya entegrasyonu</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Bu çerezleri kayıt sırasında veya ayarlardan devre dışı bırakabilirsiniz.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Data Retention Section */}
            <motion.div
              id="data-retention"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('data-retention')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Veri Saklama</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('data-retention') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('data-retention') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-2 px-2 font-bold">Veri Türü</th>
                            <th className="text-left py-2 px-2 font-bold">Saklama Süresi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          <tr>
                            <td className="py-3 px-2">Aktif Hesap Verileri</td>
                            <td className="py-3 px-2">Hesap aktif olduğu sürece</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-2">Kapalı Hesap Verileri</td>
                            <td className="py-3 px-2">30 gün sonra silinir</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-2">İşlem Verileri</td>
                            <td className="py-3 px-2">7 yıl (vergi kanunu)</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-2">Çerez Verileri</td>
                            <td className="py-3 px-2">13 ay</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-2">Konum Verileri</td>
                            <td className="py-3 px-2">30 gün</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-2">Teknik Günlükler</td>
                            <td className="py-3 px-2">90 gün</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-2">Fotoğraf ve Videolar</td>
                            <td className="py-3 px-2">Hesap kapatıldığında</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-2">Ödeme Kayıtları</td>
                            <td className="py-3 px-2">2 yıl (arşiv)</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="bg-sky-500/5 border border-sky-500/20 rounded-lg p-3 text-sm">
                        <p className="text-muted-foreground">
                          Yasal yükümlülükler, uyuşmazlıklara karşı koruma veya adli taleplerle ilgili verileri 
                          belirtilen sürelerden daha uzun süre saklayabiliriz.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Security Section */}
            <motion.div
              id="security"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('security')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Güvenlik Önlemleri</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('security') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('security') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">SSL/TLS Şifreleme</h4>
                          <p className="text-sm text-muted-foreground">
                            Tüm veriler HTTPS (SSL/TLS 1.2+) şifreleme ile iletilir. 
                            Tarayıcınız ve sunucumuz arasındaki tüm haberleşme şifrelidir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Veri Şifreleme (Enkripsiyon)</h4>
                          <p className="text-sm text-muted-foreground">
                            Hassas veriler (şifre, ödeme bilgileri) AES-256 algoritması ile şifreli olarak saklanır. 
                            Deşifreleme için benzersiz anahtarlar kullanılır.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Güvenlik Duvarı (Firewall)</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform ileri güvenlik duvarı teknolojisi ile korunur. 
                            Kuşkulu trafiğin erişimi engellenir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Çok Faktörlü Kimlik Doğrulama</h4>
                          <p className="text-sm text-muted-foreground">
                            İstenirse, 2FA (iki faktörlü kimlik doğrulama) etkinleştirilebilir. 
                            SMS, email ve authenticator uygulamaları desteklenir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Penetration Testing</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform düzenli olarak güvenlik uzmanları tarafından test edilir. 
                            Açıklar bulunduğunda hemen kapatılır.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">İçerik Güvenliği Politikası</h4>
                          <p className="text-sm text-muted-foreground">
                            CSP (Content Security Policy) başlıkları kötü amaçlı içeriğe karşı koruma sağlar. 
                            XSS ve code injection saldırıları engellenir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Erişim Kontrolü</h4>
                          <p className="text-sm text-muted-foreground">
                            Verilerindeki erişim rol tabanlı kontrol (RBAC) ile sınırlıdır. 
                            Sadece yetkili personel ilgili verileri görebilir.
                          </p>
                        </div>
                      </div>

                      <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 text-sm">
                        <p className="text-muted-foreground">
                          <strong>GÜVENLİK AÇIĞINI BİLDİRMEK İÇİN:</strong> security@zuhreplanet.com adresine e-posta gönderin.
                          Açıkları sorumlu şekilde açıklamaya karşı harekete geçeceğiz.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              id="contact"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('contact')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>İletişim</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('contact') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('contact') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold mb-2">Veri Sorumlusu</h4>
                        <p className="text-sm text-muted-foreground">
                          <strong>Zuhre Planet Platformu</strong><br />
                          Çevrimiçi İçerik Sağlama Hizmetleri
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">İletişim Adresleri</h4>
                        <div className="bg-muted/30 rounded-lg p-3 space-y-2 text-sm">
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary" />
                            <span><strong>E-posta:</strong> privacy@zuhreplanet.com</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary" />
                            <span><strong>Destek:</strong> support@zuhreplanet.com</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary" />
                            <span><strong>Güvenlik:</strong> security@zuhreplanet.com</span>
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">Veri İiş Kurulu Bildirimi</h4>
                        <p className="text-sm text-muted-foreground">
                          Kişisel verilerinizin işlenmesi hakkında şikayetleriniz varsa, 
                          Kişisel Verileri Koruma Kurulu (KVKK) kaymakamına başvurabilirsiniz.<br />
                          <strong>Adres:</strong> Atatürk Bulvarı 101 Kızılay, 06100 Ankara, Türkiye
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">Cevap Süresi</h4>
                        <p className="text-sm text-muted-foreground">
                          Taleplerınıze 30 gün içinde cevap vermeye çalışırız. Karmaşık durumlarda bu süre 30 gün daha uzatılabilir. 
                          İşlemenin imkânsız olduğu durumlarda, sebepleri açıklayan bir bildiri göndeririz.
                        </p>
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
              <Card className="border-sky-500/30 bg-sky-500/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-sky-600" />
                    <CardTitle className="text-sky-600">ÖNEMLİ BİLDİRİM</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Bu Gizlilik Politikası, Zuhre Planet tarafından herhangi bir yasal ihbar olmaksızın değiştirilebilir. 
                    Değişiklikler yayınlandığında yürürlüğe girer.
                  </p>
                  <p>
                    Platform'u kullanmaya devam ettiğiniz takdirde, bu değişiklikleri kabul etmiş sayılırsınız.
                  </p>
                  <p>
                    Sorularınız veya endişeleriniz için lütfen privacy@zuhreplanet.com adresine e-posta gönderin.
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
