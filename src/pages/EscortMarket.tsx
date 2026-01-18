import { useState } from 'react';
import { motion } from 'framer-motion';
import { trpc } from '../lib/trpc';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Crown, Zap, CheckCircle2, Star, Shield, 
  CreditCard, ArrowRight, Sparkles, Flame,
  TrendingUp, Users, Eye, MessageCircle,
  Target, Rocket, Award, Gem
} from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function MasseuseMarket() {
  const [loading, setLoading] = useState<string | null>(null);
  const { data: user, isLoading: userLoading } = trpc.auth.me.useQuery();
  const [, setLocation] = useLocation();

  // Koruma: Eğer kullanıcı escort değilse ana sayfaya at
  if (!userLoading && user?.role !== 'escort') {
    setLocation('/');
    return null;
  }

  const purchaseVip = trpc.payments.purchaseVip.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setLoading(null);
    },
    onError: (err) => {
      toast.error(err.message);
      setLoading(null);
    }
  });

  const handlePurchase = (id: string) => {
    setLoading(id);
    // Demo amaçlı simülasyon
    setTimeout(() => {
      toast.success("İşlem başarıyla başlatıldı. Ödeme sayfasına yönlendiriliyorsunuz...");
      setLoading(null);
    }, 1500);
  };

  const features = [
    {
      id: 'vip_ultra',
      title: 'ULTRA VIP ÜYELİK',
      description: 'Platformun en üst seviye ayrıcalığı. 3D devasa kartlar ve en üst sıra garantisi.',
      price: '₺1.499',
      period: '/ay',
      icon: Gem,
      color: 'from-purple-600 to-pink-600',
      benefits: ['En Üst Sıra Garantisi', '3D Devasa VIP Kartı', 'Sınırsız Fotoğraf Yükleme', 'Öncelikli Destek Hattı']
    },
    {
      id: 'boost_pack',
      title: 'BOOST PAKETİ',
      description: 'İlanınızı anlık olarak en üste taşır ve 24 saat boyunca orada tutar.',
      price: '₺299',
      period: '/gün',
      icon: Rocket,
      color: 'from-orange-500 to-red-600',
      benefits: ['Anlık En Üste Taşıma', 'Ateş Efektli Çerçeve', 'Mobil Bildirim Gönderimi', 'Yüksek Tıklanma Oranı']
    },
    {
      id: 'verified_badge',
      title: 'ONAYLI PROFİL',
      description: 'Güvenilirliğinizi kanıtlayın ve müşterilerin ilk tercihi olun.',
      price: '₺499',
      period: 'tek seferlik',
      icon: Shield,
      color: 'from-blue-500 to-cyan-600',
      benefits: ['Mavi Onay Rozeti', 'Güvenilir Profil Etiketi', 'Arama Sonuçlarında Filtreleme', 'Sahte Profil Koruması']
    }
  ];

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1">
              ESCORT ÖZEL PANELİ
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
              KAZANCINIZI <span className="text-gradient">KATLAYIN</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Profilinizi binlerce müşteriye ulaştıracak premium özellikleri buradan yönetebilirsiniz.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-bold uppercase">Mevcut Bakiyeniz</div>
              <div className="text-2xl font-black">₺2.450,00</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full glass border-white/10 overflow-hidden flex flex-col group hover:border-primary/50 transition-all duration-500">
                  <div className={`h-2 bg-gradient-to-r ${feature.color}`} />
                  <CardHeader className="pb-8">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                    <CardDescription className="mt-2">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-8">
                      <span className="text-4xl font-black">{feature.price}</span>
                      <span className="text-muted-foreground ml-1">{feature.period}</span>
                    </div>
                    <div className="space-y-4">
                      {feature.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          </div>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button 
                      onClick={() => handlePurchase(feature.id)}
                      disabled={loading === feature.id}
                      className={`w-full py-7 font-black text-lg bg-gradient-to-r ${feature.color} hover:opacity-90 transition-all shadow-lg`}
                    >
                      {loading === feature.id ? 'İŞLENİYOR...' : 'HEMEN AKTİF ET'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Statistics Section */}
        <div className="mt-20">
          <Card className="glass border-white/10 p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-primary mb-2 flex justify-center"><Eye className="w-6 h-6" /></div>
                <div className="text-3xl font-black">12.4K</div>
                <div className="text-xs text-muted-foreground font-bold uppercase mt-1">Profil Görüntülenme</div>
              </div>
              <div className="text-center">
                <div className="text-primary mb-2 flex justify-center"><MessageCircle className="w-6 h-6" /></div>
                <div className="text-3xl font-black">458</div>
                <div className="text-xs text-muted-foreground font-bold uppercase mt-1">Gelen Mesajlar</div>
              </div>
              <div className="text-center">
                <div className="text-primary mb-2 flex justify-center"><Target className="w-6 h-6" /></div>
                <div className="text-3xl font-black">%8.4</div>
                <div className="text-xs text-muted-foreground font-bold uppercase mt-1">Tıklanma Oranı (CTR)</div>
              </div>
              <div className="text-center">
                <div className="text-primary mb-2 flex justify-center"><Award className="w-6 h-6" /></div>
                <div className="text-3xl font-black">#1</div>
                <div className="text-xs text-muted-foreground font-bold uppercase mt-1">Bölge Sıralaması</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
