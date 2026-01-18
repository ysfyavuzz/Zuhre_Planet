import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield, AlertTriangle, CheckCircle2, XCircle, Clock,
  CreditCard, Star, Users, TrendingUp, Award,
  Lock, Zap, Target, Crown, Heart, Ban
} from 'lucide-react';

interface PlatformBenefitsProps {
  userType: 'customer' | 'escort';
}

export function PlatformBenefits({ userType }: PlatformBenefitsProps) {
  const [activeTab, setActiveTab] = useState<'benefits' | 'warnings' | 'comparison'>('benefits');

  if (userType === 'customer') {
    return (
      <div className="space-y-6">
        {/* Header Warning */}
        <Card className="border-red-500/30 bg-gradient-to-br from-red-500/5 to-orange-500/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
                  ⚠️ Site Dışı Randevu Tehlikelidir!
                </h3>
                <p className="text-red-600 dark:text-red-300">
                  Platform dışında iletişim kurmak veya randevu ayarlamak, sizi dolandırıcılık, güvenlik riskleri ve maddi kayba maruz bırakır.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="benefits">Platform Avantajları</TabsTrigger>
            <TabsTrigger value="warnings">Dış Riskler</TabsTrigger>
            <TabsTrigger value="comparison">Karşılaştırma</TabsTrigger>
          </TabsList>

          {/* Platform Benefits Tab */}
          <TabsContent value="benefits" className="space-y-4">
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  Site Üzerinden Randevu Almanın Avantajları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Payment Security */}
                <div className="p-4 bg-background rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-1">Güvenli Ödeme Garantisi</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Ödemeniz randevu tamamlanana kadar platform havuzunda tutulur.
                      </p>
                      <ul className="text-xs space-y-1 text-green-700 dark:text-green-400">
                        <li>• Sorun yaşarsanız paranız iade edilir</li>
                        <li>• Escort gelmezse %100 para iadesi</li>
                        <li>• Dolandırıcılık koruması</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Points & Rewards */}
                <div className="p-4 bg-background rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-1">Sadakat Puanı Kazanın</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Her başarılı randevudan puan biriktirin, ödülleri alın.
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 bg-purple-500/10 rounded text-center">
                          <p className="text-lg font-bold text-purple-600">+50</p>
                          <p className="text-xs">Randevu</p>
                        </div>
                        <div className="p-2 bg-purple-500/10 rounded text-center">
                          <p className="text-lg font-bold text-purple-600">+100</p>
                          <p className="text-xs">Sorunsuz</p>
                        </div>
                        <div className="p-2 bg-purple-500/10 rounded text-center">
                          <p className="text-lg font-bold text-purple-600">+30</p>
                          <p className="text-xs">Tekrar</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dispute Resolution */}
                <div className="p-4 bg-background rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-1">Uyuşmazlık Çözümü</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Herhangi bir sorun yaşarsanız destek ekibimiz 24 saat içinde müdahale eder.
                      </p>
                      <ul className="text-xs space-y-1 text-blue-700 dark:text-blue-400">
                        <li>• Adil ve tarafsız inceleme</li>
                        <li>• Delil toplama desteği</li>
                        <li>• Hızlı çözüm</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Verified Profiles */}
                <div className="p-4 bg-background rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-1">Onaylı Profil Garantisi</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Platformdaki tüm escortlar admin tarafından doğrulanır.
                      </p>
                      <ul className="text-xs space-y-1 text-cyan-700 dark:text-cyan-400">
                        <li>• Gerçek fotoğraflar</li>
                        <li>• Kimlik doğrulaması</li>
                        <li>• Sahte hesap engelleme</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Privacy Protection */}
                <div className="p-4 bg-background rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5 text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-1">%100 Gizlilik Koruması</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Kişisel bilgileriniz asla paylaşılmaz.
                      </p>
                      <ul className="text-xs space-y-1 text-pink-700 dark:text-pink-400">
                        <li>• Gizli ödeme (banka ekstresinde görünmez)</li>
                        <li>• Uçtan uca şifreli mesajlaşma</li>
                        <li>• KVKK uyumlu veri koruması</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success Story */}
            <Card className="border-primary/30">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">💡</div>
                  <div>
                    <h4 className="font-bold mb-2">Başarı Hikayesi</h4>
                    <p className="text-sm text-muted-foreground">
                      Platformumuzu kullanan müşteriler %98 memnuniyet oranı bildirmektedir.
                      Site dışı randevularda bu oran sadece %45'tir. Platform üzerinden randevu almak,
                      sizi hem maddi hem de manevi olarak korur.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* External Risks Tab */}
          <TabsContent value="warnings" className="space-y-4">
            <Card className="border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  Site Dışı Randevu Riskleri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    icon: '💸',
                    title: 'Maddi Kayıp Riski',
                    description: 'Ödeme yaptıktan sonra escort gelmezse paranızı geri alamazsınız.',
                    severity: 'critical'
                  },
                  {
                    icon: '🎭',
                    title: 'Sahte Profil Riski',
                    description: 'Fotoğraflar gerçek olmayabilir, karşılaşacağınız kişi farklı olabilir.',
                    severity: 'high'
                  },
                  {
                    icon: '🚨',
                    title: 'Güvenlik Riski',
                    description: 'Bilinmeyen mekânlarda buluşmak güvenlik riski taşır.',
                    severity: 'critical'
                  },
                  {
                    icon: '📵',
                    title: 'Desteksiz Kalırsınız',
                    description: 'Herhangi bir sorun yaşarsanız başvuracağınız merci yoktur.',
                    severity: 'high'
                  },
                  {
                    icon: '⭐',
                    title: 'Puan Kazanamazsınız',
                    description: 'Sadakat puanı ve diğer ödüllerden yararlanamazsınız.',
                    severity: 'medium'
                  },
                  {
                    icon: '🚫',
                    title: 'Hesap Askıya Alınabilir',
                    description: 'Site dışı randevu teşvik etmek hesabınızın kapatılmasına neden olabilir.',
                    severity: 'high'
                  }
                ].map((risk, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border ${
                      risk.severity === 'critical'
                        ? 'bg-red-500/10 border-red-500/30'
                        : risk.severity === 'high'
                        ? 'bg-orange-500/10 border-orange-500/30'
                        : 'bg-yellow-500/10 border-yellow-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{risk.icon}</span>
                      <div>
                        <h5 className="font-bold mb-1">{risk.title}</h5>
                        <p className="text-sm text-muted-foreground">{risk.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Platform Booking */}
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-500/10 rounded-lg border-2 border-green-500/30">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <h4 className="font-bold text-green-700 dark:text-green-400">Platform Üzerinden</h4>
                    </div>

                    <div className="space-y-2">
                      {[
                        '✅ Para iade garantisi',
                        '✅ Dolandırıcılık koruması',
                        '✅ Uyuşmazlık çözümü',
                        '✅ Sadakat puanı (+50-100)',
                        '✅ Gizli ödeme',
                        '✅ Onaylı profil garantisi',
                        '✅ 7/24 destek',
                        '✅ Mesajlaşma kaydı'
                      ].map((item, i) => (
                        <div key={i} className="p-2 bg-green-500/5 rounded text-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* External Booking */}
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-red-500/10 rounded-lg border-2 border-red-500/30">
                      <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                      <h4 className="font-bold text-red-700 dark:text-red-400">Site Dışı</h4>
                    </div>

                    <div className="space-y-2">
                      {[
                        '❌ Para kaybetme riski',
                        '❌ Dolandırılma riski',
                        '❌ Destek yok',
                        '❌ Puan kazanımı yok',
                        '❌ Gizlilik riski',
                        '❌ Sahte profil riski',
                        '❌ Güvenlik riski',
                        '❌ Hesap kapatılabilir'
                      ].map((item, i) => (
                        <div key={i} className="p-2 bg-red-500/5 rounded text-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center">
                  <p className="text-sm font-bold text-blue-700 dark:text-blue-400">
                    📊 İstatistik: Platform üzerinden randevu alan müşterilerin %98'i memnun kalırken,
                    site dışı randevularda memnuniyet oranı sadece %45'tir.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Escort version
  return (
    <div className="space-y-6">
      {/* Header Warning */}
      <Card className="border-red-500/30 bg-gradient-to-br from-red-500/5 to-orange-500/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
              <Ban className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
                ⚠️ Site Dışı Randevu Yasak ve Tehlikeli!
              </h3>
              <p className="text-red-600 dark:text-red-300">
                Platform dışında randevu ayarlamak, hem sizi hem de müşterinizi riske atar.
                Ayrıca bu durum hesabınızın kalıcı olarak kapatılmasına neden olabilir.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Benefits */}
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              Site Üzerinden Randevu Verin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                icon: '💰',
                title: 'Garantili Ödeme',
                description: 'Müşteri ödemeyi platforma yapar. Paranız garanti altında.'
              },
              {
                icon: '⭐',
                title: 'Puan Kazanın',
                description: 'Her randevudan +50-150 puan kazanın, ödülleri alın.'
              },
              {
                icon: '🛡️',
                title: 'Kötü Müşteriden Korunma',
                description: 'Uyarı sistemi ile sorunlu müşterileri görürsünüz.'
              },
              {
                icon: '📊',
                title: 'Detaylı İstatistik',
                description: 'Randevu, kazanç ve müşteri geçmişini takip edin.'
              },
              {
                icon: '💬',
                title: 'Mesaj Kaydı',
                description: 'Tüm mesajlarınız kayıt altında, uyuşmazlıkta delil olur.'
              },
              {
                icon: '🚀',
                title: 'Görünürlük Artışı',
                description: 'Başarılı randevular görünürlüğünüzü artırır.'
              }
            ].map((benefit, i) => (
              <div key={i} className="p-3 bg-background rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-xl">{benefit.icon}</span>
                  <div>
                    <h5 className="font-bold text-sm">{benefit.title}</h5>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Risks */}
        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <XCircle className="w-5 h-5" />
              Site Dışı Riskleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                icon: '💸',
                title: 'Ödeme Alamama Riski',
                description: 'Müşteri ödeme yapmayabilir, başvuracağınız yer yok.'
              },
              {
                icon: '🚨',
                title: 'Güvenlik Riski',
                description: 'Bilinmeyen müşteriler, doğrulanmamış profiller.'
              },
              {
                icon: '📉',
                title: 'Puan Kaybı',
                description: 'Sadakat puanı kazanamaz, görünürlük kazanırsınız.'
              },
              {
                icon: '⚠️',
                title: 'Hesap Kapatma',
                description: 'Site dışı randevu teşvik etmek = kalıcı ban.'
              },
              {
                icon: '🚫',
                title: 'Destek Yok',
                description: 'Sorun yaşarsanız platform size yardımcı olamaz.'
              },
              {
                icon: '📵',
                title: 'Delil Yok',
                description: 'Mesaj kaydı olmadan uyuşmazlıkta hakkınızı savunamazsınız.'
              }
            ].map((risk, i) => (
              <div key={i} className="p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                <div className="flex items-start gap-2">
                  <span className="text-xl">{risk.icon}</span>
                  <div>
                    <h5 className="font-bold text-sm text-red-700 dark:text-red-400">{risk.title}</h5>
                    <p className="text-xs text-red-600 dark:text-red-300">{risk.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Success Stats */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h4 className="font-bold text-lg mb-2">Platform Kullanan Escortların Başarısı</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-background rounded-lg">
              <p className="text-3xl font-black text-green-600">%94</p>
              <p className="text-xs text-muted-foreground">Ödeme Garantisi</p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <p className="text-3xl font-black text-purple-600">+50</p>
              <p className="text-xs text-muted-foreground">Puan / Randevu</p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <p className="text-3xl font-black text-blue-600">3x</p>
              <p className="text-xs text-muted-foreground">Daha Fazla Randevu</p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <p className="text-3xl font-black text-cyan-600">%87</p>
              <p className="text-xs text-muted-foreground">Tekrarlayan Müşteri</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-700 dark:text-amber-400 mb-2">
                Önemli Uyarı
              </h4>
              <p className="text-sm text-amber-600 dark:text-amber-300">
                Site dışı randevu ayarlamak teklif eden müşterileri derhal bildirin.
                Bu hem sizin hem de diğer escortların güvenliği içindir.
                Platform kurallarını ihlal eden hesaplar kalıcı olarak kapatılır.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Compact version for side panels
export function PlatformBenefitsCompact({ userType }: { userType: 'customer' | 'escort' }) {
  const benefits = userType === 'customer' ? [
    { icon: '💰', text: 'Para iade garantisi' },
    { icon: '⭐', text: '+50-100 puan' },
    { icon: '🛡️', text: 'Dolandırıcılık koruması' },
    { icon: '🔒', text: '%100 gizlilik' }
  ] : [
    { icon: '💰', text: 'Garantili ödeme' },
    { icon: '⭐', text: '+50-150 puan' },
    { icon: '👁️', text: 'Kötü müşteri görme' },
    { icon: '📊', text: 'Detaylı istatistik' }
  ];

  return (
    <Card className="border-green-500/20 bg-green-500/5">
      <CardContent className="p-4">
        <h4 className="font-bold text-sm mb-3 text-green-700 dark:text-green-400">
          {userType === 'customer' ? 'Müşteri Avantajları' : 'Escort Avantajları'}
        </h4>
        <div className="space-y-2">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="text-base">{benefit.icon}</span>
              <span>{benefit.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
