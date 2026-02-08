/**
 * Terms of Service Page
 * 
 * Comprehensive Terms of Service documentation for the Escort Platform.
 * Covers platform rules, user responsibilities, payment terms, liability limitations,
 * dispute resolution, and account termination policies.
 * 
 * @module pages/TermsOfService
 * @category Pages - Legal
 * 
 * Features:
 * - Complete platform terms and conditions
 * - User and escort responsibilities
 * - Payment and billing terms
 * - Liability limitations and disclaimers
 * - Dispute resolution procedures
 * - Account suspension and termination policies
 * - KVKK (Turkish GDPR) compliance
 * - Turkish legal requirements
 * - Smooth section navigation
 * - Mobile responsive design
 * - Last updated date tracking
 * 
 * Sections:
 * - Platform Rules & Regulations
 * - User Responsibilities
 * - Escort Responsibilities
 * - Payment Terms & Conditions
 * - Liability Limitations
 * - Dispute Resolution
 * - Account Management & Termination
 * - Turkish Legal Framework
 * 
 * @example
 * ```tsx
 * // Route: /terms
 * <TermsOfService />
 * ```
 */

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText, CheckCircle2, AlertCircle, Scale, Lock,
  MessageSquare, Trash2, Shield, ChevronDown, ArrowUp
} from 'lucide-react';

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const sections: Section[] = [
  {
    id: 'platform-rules',
    title: 'Platform Kuralları ve Düzenlemeleri',
    icon: Scale,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'user-responsibilities',
    title: 'Kullanıcı Sorumlulukları',
    icon: Shield,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'escort-responsibilities',
    title: 'Escort Sorumlulukları',
    icon: CheckCircle2,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'payment-terms',
    title: 'Ödeme Koşulları',
    icon: MessageSquare,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'liability',
    title: 'Sorumluluk Sınırlamaları',
    icon: AlertCircle,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'dispute-resolution',
    title: 'Uyuşmazlık Çözümü',
    icon: MessageSquare,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'account-termination',
    title: 'Hesap Yönetimi ve Kapatma',
    icon: Trash2,
    color: 'from-slate-500 to-gray-500'
  },
  {
    id: 'legal-framework',
    title: 'Türk Hukuk Çerçevesi',
    icon: FileText,
    color: 'from-amber-500 to-orange-500'
  }
];

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('platform-rules');
  const [expandedItems, setExpandedItems] = useState<string[]>(['platform-rules']);
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
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8" />
            <Badge className="bg-white/20 text-white border-white/30">YASAL DOKUMAN</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            Hizmet Şartları ve Koşulları
          </h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Escilanımız platformunu kullanarak, aşağıdaki şartları ve koşulları kabul etmiş sayılırsınız.
            Lütfen dikkatle okuyunuz.
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
            {/* Platform Rules Section */}
            <motion.div
              id="platform-rules"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('platform-rules')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Scale className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Platform Kuralları ve Düzenlemeleri</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('platform-rules') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('platform-rules') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Yasal Yaş Şartı</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform'u kullanabilmek için en az 18 yaşında olmanız gerekmektedir. 18 yaşından küçük 
                            kişilerin platform'u kullanması kesinlikle yasaktır.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Kimlik Doğrulama</h4>
                          <p className="text-sm text-muted-foreground">
                            Tüm kullanıcılar ve escort'lar kimlik doğrulaması yapmalıdır. Sahte bilgi veya belge 
                            kullanımı hesabın kalıcı olarak kapatılmasına neden olur.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Düzensiz Davranış Yasağı</h4>
                          <p className="text-sm text-muted-foreground">
                            Cinsel istismar, ırkçılık, ayrımcılık, tehdit, dolandırıcılık veya herhangi bir yasa 
                            dışı faaliyette bulunulması kesinlikle yasaktır.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">İçerik Politikası</h4>
                          <p className="text-sm text-muted-foreground">
                            Profil fotoğrafları ve açıklamaları yasa dışı, müstehcen veya şiddet içeren içerik 
                            barındırmamalıdır. Tüm içerik insan tarafından kontrol edilir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Spam ve Kötüye Kullanım</h4>
                          <p className="text-sm text-muted-foreground">
                            Spam mesajlar, otomatik araçlar, bot kullanımı veya platform'un kötüye kullanımı yasaktır. 
                            Bu durumlar hesabın kapatılmasına neden olur.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Dış Platform Bağlantıları</h4>
                          <p className="text-sm text-muted-foreground">
                            Profilinizde diğer web siteleri veya sosyal medya hesaplarına yönlendirme yapmak yasaktır. 
                            Tüm işlemler Escilanımız platformu üzerinden gerçekleştirilmelidir.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* User Responsibilities Section */}
            <motion.div
              id="user-responsibilities"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('user-responsibilities')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Kullanıcı Sorumlulukları</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('user-responsibilities') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('user-responsibilities') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Hesap Güvenliği</h4>
                          <p className="text-sm text-muted-foreground">
                            Hesap şifrenizin güvenliğini sağlamak sizin sorumluluğunuzdur. Şifrenizi kimseyle 
                            paylaşmayınız. Hesabınıza yapılan tüm işlemlerden siz sorumlusunuz.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Dolandırıcılıktan Koruma</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform dışında hiçbir yerde ödeme yapmayınız. Tüm ödemeler Escilanımız güvenli ödeme 
                            sistemi üzerinden yapılmalıdır. Ödeme yöntemlerinizi hiçbir kişiye söylemeyin.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Hakikaten İlgilenen Müşteri</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform'u yalnızca gerçek escort bulma amaçlı kullanınız. Prank, test veya sahte 
                            rezervasyonlar yapılması kesinlikle yasaktır ve hesabın kapatılmasına neden olur.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Gizlilik Saygısı</h4>
                          <p className="text-sm text-muted-foreground">
                            Escort'ların kişisel bilgilerini veya görüntülerini izinsiz olarak başka yerlerde 
                            paylaşmamalısınız. Bu eylem yasal sonuçlara neden olabilir.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Escort Responsibilities Section */}
            <motion.div
              id="escort-responsibilities"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('escort-responsibilities')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Escort Sorumlulukları</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('escort-responsibilities') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('escort-responsibilities') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Gerçek Bilgi</h4>
                          <p className="text-sm text-muted-foreground">
                            Profilinizde yer alan tüm bilgiler (yaş, boy, ağırlık, hizmetler vb.) gerçek ve 
                            doğru olmalıdır. Yanlış bilgi verilmesi müşteri memnuniyetsizliğine ve hesap kapatılmasına neden olur.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Gerçek Fotoğraflar</h4>
                          <p className="text-sm text-muted-foreground">
                            Profil fotoğraflarınız sizin gerçek fotoğraflarınız olmalıdır. Başka kişilerin 
                            fotoğraflarını veya düzenlenmiş görüntüleri kullanmak yasaktır.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Randevu Tutma</h4>
                          <p className="text-sm text-muted-foreground">
                            Randevular hakkında bilgi aldıktan sonra, istenmedikçe veya zorlayıcı bir neden olmadıkça 
                            iptal etmeyin. Sık iptal edilmiş randevular hesabın silinmesine neden olabilir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Sağlık ve Güvenlik</h4>
                          <p className="text-sm text-muted-foreground">
                            Hizmetlerinizde sağlık ve güvenlik standartlarını sağlayın. Hastalıkla ilgili müşteri 
                            şikayetleri hesabın devre dışı bırakılmasına neden olabilir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Uygun Fiyatlandırma</h4>
                          <p className="text-sm text-muted-foreground">
                            Fiyatlandırmanız makul ve pazar standartlarıyla tutarlı olmalıdır. Aşırı fiyatlandırma 
                            nedeniyle şikayetler hesabınıza zarar verebilir.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Payment Terms Section */}
            <motion.div
              id="payment-terms"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('payment-terms')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Ödeme Koşulları</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('payment-terms') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('payment-terms') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Ödeme Yöntemi</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform üstü ödemeler kredi kartı, banka transferi ve mobil ödeme yöntemleri ile 
                            kabul edilmektedir. Tüm ödemeler şifreli olarak işlenir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Ödeme Onayı</h4>
                          <p className="text-sm text-muted-foreground">
                            Tüm ödemeler 24 saat içinde onaylanır. İptal veya geri ödeme talepleri ödeme tarihinden 
                            itibaren 48 saat içinde yapılmalıdır.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Ödeme Sahtecilik</h4>
                          <p className="text-sm text-muted-foreground">
                            Sahte veya yetkisiz ödeme yapılan hesaplar derhal bloke edilir ve yasal işlem başlatılır. 
                            Chargeback veya dispute açılması hesap kapatılmasına neden olur.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">VIP Abonelik</h4>
                          <p className="text-sm text-muted-foreground">
                            VIP abonelikler otomatik olarak yenilenir. Aboneliği iptal etmek için hesap ayarlarınızdan 
                            "Aboneliği İptal Et" butonunu tıklayın. İptal sonrasında ödeme hesaplanmaz.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Para İade</h4>
                          <p className="text-sm text-muted-foreground">
                            İade istekleri sadece belirli durumlarda kabul edilir. Hizmet alındıktan sonra para iadesi 
                            yapılmaz. İade taleplerinin incelenmesi 5-7 iş günü sürer.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Platform Ücreti</h4>
                          <p className="text-sm text-muted-foreground">
                            Tüm randevular platform tarafından %15 işlem ücreti ile işlenir. Bu ücret Escilanımız 
                            hizmetlerini yürütmek için kullanılır.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Liability Limitations Section */}
            <motion.div
              id="liability"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('liability')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Sorumluluk Sınırlamaları</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('liability') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('liability') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1 text-red-600">Araştırmadır, Onay Değildir</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform, profil bilgilerinin doğruluğunu veya escort'ların kalitesini garanti etmez. 
                            Tüm randevular kullanıcıların sorumluluğundadır.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1 text-red-600">Yasal Sorumluluk</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform ve escort'lar arasında başka anlaşmalar yoktur. Tüm hukuki ilişkiler bu koşullar 
                            ve uygulanabilir yasa tarafından yönetilir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1 text-red-600">Dolaylı Zararlardan Sorumlu Değilim</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform, cihaz arızası, veri kaybı veya direkt olmayan zararlardan sorumlu değildir. 
                            Platform'un sorumluluğu, ödediğiniz tutarla sınırlandırılır.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1 text-red-600">Üçüncü Taraf Sorumlulukları</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform üçüncü taraf ödeme işlemcileri, web barındırma sağlayıcıları veya başka 
                            servis sağlayıcılardan sorumlu değildir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1 text-red-600">Hizmet Kesintisi</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform bakım veya teknik sorunlar nedeniyle kesintiye uğrayabilir. Platform bu kesintilerden 
                            sorumlu değildir.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Dispute Resolution Section */}
            <motion.div
              id="dispute-resolution"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('dispute-resolution')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Uyuşmazlık Çözümü</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('dispute-resolution') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('dispute-resolution') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Şikayet Süreci</h4>
                          <p className="text-sm text-muted-foreground">
                            Herhangi bir şikayeti Destek Merkezi aracılığıyla yapabilirsiniz. Tüm şikayetler 24 saat 
                            içinde incelenecek ve gerekli işlemler yapılacaktır.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Delil Sunma</h4>
                          <p className="text-sm text-muted-foreground">
                            Şikayetinizi desteklemek için fotoğraf, mesaj, ödemeler vb. delil sunabilirsiniz. 
                            Delilsiz şikayetler incelenmeyebilir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Arabuluculuk</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform tarafından uyuşmazlıkların çözüleceği arabuluculuk hizmetini sunuyoruz. 
                            Taraflar arabulucu kararını kabul etmelidir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Yasal Hakim</h4>
                          <p className="text-sm text-muted-foreground">
                            Arabuluculuk başarısız olursa, uyuşmazlıklar Türkiye'deki yetkili mahkemeler tarafından 
                            çözülecektir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Bildirim Süresi</h4>
                          <p className="text-sm text-muted-foreground">
                            Herhangi bir uyuşmazlık durumunda, taraflar olaya bir ay içinde haber vermelidir. 
                            Süre sonunda hak talebi yapılamaz.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Account Termination Section */}
            <motion.div
              id="account-termination"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('account-termination')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-500 to-gray-500 flex items-center justify-center">
                        <Trash2 className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Hesap Yönetimi ve Kapatma</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('account-termination') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('account-termination') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Gönüllü Kapatma</h4>
                          <p className="text-sm text-muted-foreground">
                            Hesabınızı istiyor olursanız, Ayarlar bölümünden "Hesabı Sil" seçeneğini tıklayarak 
                            kalıcı olarak silebilirsiniz.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Zorunlu Kapatma</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform kurallarını ihlal eden hesaplar derhal kapatılabilir. Bunlara sahte bilgi, 
                            spam, dolandırıcılık, şiddet veya cinsel içerik dahildir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Geçici Askıya Alma</h4>
                          <p className="text-sm text-muted-foreground">
                            Hafif ihlaller için hesablar 7-30 gün askıya alınabilir. Bu süre içinde, hesap 
                            kilitlenir ve kullanılamaz.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Verilerin Silinmesi</h4>
                          <p className="text-sm text-muted-foreground">
                            Hesap kapatıldıktan sonra, kişisel verileriniz 30 gün içinde silinir. Fotoğraflar ve 
                            mesajlar hemen silinir, ancak yedekler 90 gün tutulabilir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Yeniden Kayıt</h4>
                          <p className="text-sm text-muted-foreground">
                            Kapatılan hesaplar tekrar açılamaz. Yeni bir hesap açmak isterseniz, yeni bir e-posta 
                            adresi ile kayıt yapmanız gerekmektedir.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Legal Framework Section */}
            <motion.div
              id="legal-framework"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleExpand('legal-framework')}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>Türk Hukuk Çerçevesi</CardTitle>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedItems.includes('legal-framework') ? 'rotate-180' : ''
                    }`} />
                  </CardHeader>
                </button>

                {expandedItems.includes('legal-framework') && (
                  <CardContent className="space-y-4 border-t border-white/10 pt-6">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Kişisel Verileri Koruma Kanunu (KVKK)</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform, Kişisel Verileri Koruma Kanunu (KVKK) uyumludur. Verileriniz korunur ve 
                            yalnızca belirtilen amaçlarla kullanılır.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">E-Ticaret Kanunu</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform, E-Ticaret Kanunu hükümleri ve teknoloji iş kanunları ile uyumludur. 
                            Tüm hukuki yükümlülükler yerine getirilmiştir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Ceza Kanunu</h4>
                          <p className="text-sm text-muted-foreground">
                            Türk Ceza Kanunu'na göre cinsel sömürü, zulüm veya başka suçlar kesinlikle yasaktır. 
                            Suç niteliğine sahip davranışlar hemen adli makamlara bildirilir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Gümrük ve Dış Ticaret Kanunu</h4>
                          <p className="text-sm text-muted-foreground">
                            Platform uluslararası işlemleri ve veri aktarımını, ilgili kanunlar doğrultusunda 
                            gerçekleştirir.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Tüketici Hakları</h4>
                          <p className="text-sm text-muted-foreground">
                            Tüm taraflar Türkiye'nin tüketici koruma kanunları altında haklarına sahiptir. 
                            Platform bu haklara saygı göstermekle yükümlüdür.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-1">Uygulanabilir Yasa ve Yetki</h4>
                          <p className="text-sm text-muted-foreground">
                            Bu hizmet şartları Türkiye Cumhuriyeti yasalarına tabidir. Tüm uyuşmazlıklar 
                            Türkiye'deki yetkili mahkemeler tarafından çözülecektir.
                          </p>
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
              <Card className="border-sky-500/30 bg-sky-500/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-sky-600" />
                    <CardTitle className="text-sky-600">ÖNEMLİ BİLDİRİM</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Bu Hizmet Şartları ve Koşulları, Escilanımız tarafından herhangi bir yasal ihbar olmaksızın 
                    değiştirilebilir. Değişiklikler yayınlandığında yürürlüğe girer.
                  </p>
                  <p>
                    Platform'u kullanmaya devam ettiğiniz takdirde, bu değişiklikleri kabul etmiş sayılırsınız.
                  </p>
                  <p>
                    Sorularınız veya endişeleriniz için lütfen destek@escilanimiz.com adresine e-posta gönderin.
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
