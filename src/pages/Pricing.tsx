import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Crown, Zap, CheckCircle2, Star, Shield,
  ArrowRight, Sparkles, Flame,
  TrendingUp, Users, Eye, Calendar, Clock
} from 'lucide-react';

// Haftalık VIP Paketleri
const weeklyPlans = [
  {
    id: 'weekly_basic',
    name: 'Haftalık Başlangıç',
    duration: '7 Gün',
    price: 149,
    period: 'hafta',
    features: [
      'Vitrinde Öncelikli Listeleme',
      'Özel VIP Rozeti',
      'Sınırsız Mesajlaşma',
      'Profil İstatistikleri',
      '5 Fotoğraf Yükleme'
    ],
    color: 'from-blue-500 to-cyan-500',
    icon: Clock,
    badge: 'HAFTALIK'
  },
  {
    id: 'weekly_pro',
    name: 'Haftalık Pro',
    duration: '7 Gün',
    price: 199,
    period: 'hafta',
    features: [
      'Başlangıç Tüm Özellikleri',
      '15 Fotoğraf Yükleme',
      '3 Video Yükleme',
      'Haftalık 1 Boost',
      'Öncelikli Müşteri Desteği'
    ],
    color: 'from-purple-500 to-pink-500',
    icon: Zap,
    badge: 'POPÜLER',
    popular: true
  },
  {
    id: 'weekly_ultra',
    name: 'Haftalık Ultra',
    duration: '7 Gün',
    price: 299,
    period: 'hafta',
    features: [
      'Pro Tüm Özellikleri',
      '20 Fotoğraf Yükleme',
      '5 Video Yükleme',
      'Haftalık 2 Boost',
      'Özel Profil Teması',
      'Anında Onay'
    ],
    color: 'from-amber-500 to-orange-500',
    icon: Flame,
    badge: 'EN İYİ'
  }
];

// Aylık VIP Paketleri
const monthlyPlans = [
  {
    id: 'monthly_starter',
    name: 'Başlangıç',
    duration: '30 Gün',
    price: 399,
    period: 'ay',
    features: [
      'Vitrinde Öncelikli Listeleme',
      'Özel VIP Rozeti',
      'Sınırsız Mesajlaşma',
      'Profil İstatistikleri',
      '10 Fotoğraf Yükleme'
    ],
    color: 'from-blue-600 to-cyan-600',
    icon: Star,
    badge: 'BAŞLANGIÇ'
  },
  {
    id: 'monthly_pro',
    name: 'Profesyonel',
    duration: '30 Gün',
    price: 699,
    period: 'ay',
    features: [
      'Başlangıç Tüm Özellikleri',
      '20 Fotoğraf Yükleme',
      '5 Video Yükleme',
      'Haftalık 1 Boost',
      'Öncelikli Müşteri Desteği'
    ],
    color: 'from-purple-600 to-pink-600',
    icon: Crown,
    badge: 'POPÜLER',
    popular: true
  },
  {
    id: 'monthly_business',
    name: 'İşletme',
    duration: '90 Gün',
    price: 1499,
    period: '3 ay',
    discount: '%28 İndirim',
    features: [
      'Profesyonel Tüm Özellikleri',
      '30 Fotoğraf Yükleme',
      '10 Video Yükleme',
      'Haftalık 2 Boost',
      'Özel Profil Teması',
      'Öncelikli Onay',
      'Reklamsız Deneyim'
    ],
    color: 'from-amber-500 to-orange-600',
    icon: Sparkles,
    badge: 'DEĞER'
  },
  {
    id: 'monthly_enterprise',
    name: 'Premium',
    duration: '180 Gün',
    price: 2499,
    period: '6 ay',
    discount: '%42 İndirim',
    features: [
      'İşletme Tüm Özellikleri',
      'Sınırsız Fotoğraf & Video',
      'Günlük 1 Boost',
      'Özel Profil Teması',
      'Anında Onay',
      'Özel Danışman',
      'Reklamsız Deneyim',
      'Özel Kampanyalar'
    ],
    color: 'from-rose-600 to-red-600',
    icon: Sparkles,
    badge: 'PREMIUM'
  }
];


const creditPackages = [
  { id: 'pkg_1', credits: 100, price: 100, bonus: 0 },
  { id: 'pkg_2', credits: 550, price: 500, bonus: 50, popular: true },
  { id: 'pkg_3', credits: 1200, price: 1000, bonus: 200 },
  { id: 'pkg_4', credits: 3000, price: 2500, bonus: 500 }
];

export default function Pricing() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [loading, setLoading] = useState<string | null>(null);

  const currentPlans = activeTab === 'weekly' ? weeklyPlans : monthlyPlans;

  const handlePurchaseVip = (plan: any) => {
    setLoading(plan.id);
    // Demo purposes - in real app, this would call the payment API
    setTimeout(() => {
      setLoading(null);
      alert(`${plan.name} paketi seçildi. Ödeme sayfasına yönlendiriliyorsunuz...`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1">
            VIP ÜYELİK PAKETLERİ
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            GÖRÜNÜRLÜĞÜNÜZÜ <span className="text-gradient">ARTIRIN</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            VIP üyelik paketleri ile profilinizi binlerce kişiye ulaştırın, kazancınızı katlayın.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-muted/50 rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-8 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'weekly'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Haftalık Paketler
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-8 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'monthly'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Aylık Paketler
            </button>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className={`grid grid-cols-1 ${activeTab === 'monthly' ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'} gap-6 mb-16`}>
          {currentPlans.map((plan, idx) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={plan.popular ? 'md:-mt-4 md:mb-[-16px]' : ''}
              >
                <Card className={`relative h-full card-3d overflow-hidden border-white/10 glass ${
                  plan.popular ? 'ring-2 ring-primary scale-105 z-10 shadow-2xl shadow-primary/20' : ''
                }`}>
                  {/* Badge */}
                  <div className={`absolute top-0 left-0 right-0 bg-gradient-to-r ${plan.color} text-white text-[10px] font-black px-3 py-1 text-center uppercase tracking-widest`}>
                    {plan.badge}
                  </div>

                  {plan.popular && (
                    <div className="absolute top-8 right-0 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-widest">
                      EN POPÜLER
                    </div>
                  )}

                  <CardHeader className="text-center pb-6 pt-12">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-sm">{plan.duration} Boyunca Geçerli</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-black">₺{plan.price}</span>
                      {plan.discount && (
                        <Badge className="ml-2 bg-green-500/20 text-green-500 border-green-500/30">
                          {plan.discount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      ≈ ₺{Math.round(plan.price / (plan.period === 'hafta' ? 1 : parseInt(plan.period) || 1))} / {plan.period === 'hafta' ? 'hafta' : 'ay'}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-3 flex-1">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </CardContent>

                  <div className="p-6 mt-auto">
                    <Button
                      onClick={() => handlePurchaseVip(plan)}
                      disabled={loading === plan.id}
                      className={`w-full py-5 font-bold bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity ${
                        plan.popular ? 'text-lg' : ''
                      }`}
                    >
                      {loading === plan.id ? 'İşleniyor...' : (
                        <>
                          HEMEN SATIN AL
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <Card className="glass border-white/10 overflow-hidden mb-16">
          <div className="p-8 text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Neden VIP Üyelik?</h2>
            <p className="text-muted-foreground">VIP üyelerimiz %300 daha fazla ilan görüntülemesi alıyor</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5">
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold mb-2">10x Daha Fazla Görüntülenme</h4>
              <p className="text-sm text-muted-foreground">Profiliniz her listenin en üstünde görünür</p>
            </div>
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold mb-2">%70 Daha Fazla Tıklama</h4>
              <p className="text-sm text-muted-foreground">VIP rozeti güven oluşturur</p>
            </div>
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold mb-2">Öncelikli Müşteri Desteği</h4>
              <p className="text-sm text-muted-foreground">Sorularınız 24 saat içinde yanıtlanır</p>
            </div>
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold mb-2">Anında Onay</h4>
              <p className="text-sm text-muted-foreground">Profiliniz 1 saat içinde yayınlanır</p>
            </div>
          </div>
        </Card>

        {/* Credit Packages */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tighter mb-2">KREDİ PAKETLERİ</h2>
            <p className="text-muted-foreground">Boost ve öne çıkarma işlemleri için kredi kullanın.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditPackages.map((pkg) => (
              <Card key={pkg.id} className="glass border-white/10 hover:border-primary/50 transition-colors cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">KREDİ</div>
                  <div className="text-3xl font-black mb-2 group-hover:text-primary transition-colors">{pkg.credits}</div>
                  {pkg.bonus > 0 && (
                    <Badge variant="secondary" className="mb-4 bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                      +{pkg.bonus} BONUS
                    </Badge>
                  )}
                  <div className="text-xl font-bold mb-4">₺{pkg.price}</div>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-all text-sm">
                    YÜKLE
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-6 py-3">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Güvenli Ödeme - 256-bit SSL Şifreleme
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
