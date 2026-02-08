/**
 * MembershipUpgrade Page
 *
 * Subscription upgrade page with plan selection and checkout flow.
 * Provides premium plan upgrade options for escorts.
 *
 * @module pages/MembershipUpgrade
 * @category Pages - Payment
 *
 * Features:
 * - Plan selection (Premium, VIP)
 * - Billing cycle toggle (monthly/yearly)
 * - Feature comparison
 * - Checkout integration
 * - Current plan indicator
 * - FAQ section
 * - Upgrade benefits
 *
 * Routes: /upgrade, /vip, /pricing
 *
 * @example
 * ```tsx
 * // Route: /upgrade
 * <MembershipUpgrade />
 * ```
 */

import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SubscriptionPlanSelector, { SubscriptionPlan, BillingCycle } from '@/components/SubscriptionPlanSelector';
import PaymentCheckout from '@/components/PaymentCheckout';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft, Crown, Sparkles, Shield, Zap, Star,
  CheckCircle2, HelpCircle, TrendingUp, Heart, MessageCircle, ChevronDown
} from 'lucide-react';
import { SEO } from '@/pages/SEO';

/**
 * Mock saved payment methods
 */
const mockPaymentMethods = [
  // In real app, fetch from user profile
];

/**
 * FAQ items
 */
const faqItems = [
  {
    question: 'Premium ve VIP plan arasındaki fark nedir?',
    answer: 'Premium plan size 30 fotoğraf, 20 video ve haftalık öne çıkma sunar. VIP plan ise sınırsız fotoğraf ve video, günlük öne çıkma, ana sayfa yerleşimi ve 7/24 öncelikli destek sağlar.',
  },
  {
    question: 'Her zaman aboneliğimi iptal edebilir miyim?',
    answer: 'Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. Mevcut dönem sonuna kadar özelliklere erişmeye devam edersiniz.',
  },
  {
    question: 'Ödeme yöntemleri nelerdir?',
    answer: 'Kredi kartı (Visa, Mastercard, American Express) ve banka kartı ile ödeme alıyoruz. Tüm işlemler 256-bit SSL şifreleme ile korunur.',
  },
  {
    question: 'Yıllık ödemede ne kadar tasarruf ederim?',
    answer: 'Yıllık ödemede %17 indirim kazanırsınız. Premium için yıllık ₺1.990 yerine aylık toplam ₺2.388 ödersiniz.',
  },
  {
    question: 'Planımı sonradan değiştirebilir miyim?',
    answer: 'Evet, istediğiniz zaman plan yükseltme veya düşürme yapabilirsiniz. Yükseltmelerde anında aktif olur, düşürmeler mevcut dönem sonunda geçerli olur.',
  },
];

/**
 * Benefits showcase
 */
const benefits = [
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Daha Fazla Görüntülenme',
    description: 'Öne çıkan listelerde yer alın ve profil görüntülenmenizi artırın',
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Sınırsız Mesajlaşma',
    description: 'Sınırsız mesaj gönderin ve müşterilerle kolayca iletişim kurun',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Daha fazla Favori',
    description: 'Profilinizi daha fazla kullanıcının favorilerine eklenmesini sağlayın',
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Öne Çıkma',
    description: 'Arama sonuçlarında ve ana sayfada profilinizi öne çıkarın',
  },
];

/**
 * MembershipUpgrade Page Component
 */
export default function MembershipUpgrade() {
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('premium');
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycle>('monthly');

  const currentPlan = (user?.membership as SubscriptionPlan) || 'free';

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    if (plan !== currentPlan) {
      setSelectedPlan(plan);
      setShowCheckout(true);
    }
  };

  const handleCheckoutCancel = () => {
    setShowCheckout(false);
  };

  const handleCheckoutSubmit = async (data: unknown) => {
    // In real app, process payment with API
    // Redirect to success page or dashboard
    window.location.href = '/payment-result?status=success';
  };

  // Get plan price
  const getPlanPrice = (plan: SubscriptionPlan, cycle: BillingCycle): number => {
    const prices: Record<SubscriptionPlan, { monthly: number; yearly: number }> = {
      free: { monthly: 0, yearly: 0 },
      premium: { monthly: 199, yearly: 1990 },
      vip: { monthly: 499, yearly: 4990 },
    };
    return prices[plan][cycle];
  };

  // If checkout is active, show checkout flow
  if (showCheckout) {
    return (
      <div className="min-h-screen bg-background py-8">
        <SEO
          title="Ödeme | Escort Platform"
          description="Güvenli ödeme ile planınızı yükseltin"
        />

        <div className="container max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/pricing">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri Dön
              </Button>
            </Link>
            <h1 className="text-3xl font-black tracking-tighter mb-2">Ödeme</h1>
            <p className="text-muted-foreground">
              {selectedPlan === 'premium' ? 'Premium' : 'VIP'} plan ({selectedBillingCycle === 'monthly' ? 'Aylık' : 'Yıllık'})
            </p>
          </div>

          {/* Checkout */}
          <PaymentCheckout
            plan={selectedPlan}
            billingCycle={selectedBillingCycle}
            amount={getPlanPrice(selectedPlan, selectedBillingCycle)}
            savedCards={mockPaymentMethods}
            onSubmit={handleCheckoutSubmit}
            onCancel={handleCheckoutCancel}
            taxRate={0.20}
            enableDiscount={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Plan Yükselt | Escort Platform"
        description="Premium ve VIP planlarla profilinizi öne çıkarın"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500/10 via-background to-cyan-500/10 border-b border-border/50">
        <div className="container py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <Crown className="w-4 h-4" />
            Premium Özellikler Kilidi Açık
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            Profilinizi Öne Çıkarın
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Premium veya VIP plan ile daha fazla görüntülenme, mesaj ve öne çıkma elde edin
          </p>

          {/* Current Plan Badge */}
          {currentPlan !== 'free' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Mevcut Plan: {currentPlan === 'premium' ? 'Premium' : 'VIP'}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black tracking-tighter mb-4">
              Neden Yükseltmelisiniz?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Premium özelliklerle profilinizi daha görünür kılın, daha fazla randevu alın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Selection */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <SubscriptionPlanSelector
            currentPlan={currentPlan}
            onSelectPlan={handlePlanSelect}
            billingCycle={selectedBillingCycle}
            onBillingCycleChange={setSelectedBillingCycle}
            showComparison={true}
          />
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black tracking-tighter mb-4">
              Detaylı Karşılaştırma
            </h2>
            <p className="text-muted-foreground">
              Hangi planın size uygun olduğunu görün
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Özellik</th>
                      <th className="text-center p-4 font-semibold">Ücretsiz</th>
                      <th className="text-center p-4 font-semibold bg-blue-500/10">Premium</th>
                      <th className="text-center p-4 font-semibold bg-cyan-500/10">VIP</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4">Fotoğraf Sayısı</td>
                      <td className="p-4 text-center font-medium">10</td>
                      <td className="p-4 text-center font-medium bg-blue-500/5">30</td>
                      <td className="p-4 text-center font-medium bg-cyan-500/5">Sınırsız</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4">Video Sayısı</td>
                      <td className="p-4 text-center font-medium">3</td>
                      <td className="p-4 text-center font-medium bg-blue-500/5">20</td>
                      <td className="p-4 text-center font-medium bg-cyan-500/5">Sınırsız</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4">Video Süresi</td>
                      <td className="p-4 text-center font-medium">2 dk</td>
                      <td className="p-4 text-center font-medium bg-blue-500/5">5 dk</td>
                      <td className="p-4 text-center font-medium bg-cyan-500/5">Sınırsız</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4">Öne Çıkarma</td>
                      <td className="p-4 text-center text-muted-foreground">✕</td>
                      <td className="p-4 text-center text-blue-500 font-medium bg-blue-500/5">Haftalık</td>
                      <td className="p-4 text-center text-cyan-500 font-medium bg-cyan-500/5">Günlük</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4">Arama Sırası</td>
                      <td className="p-4 text-center text-muted-foreground">Normal</td>
                      <td className="p-4 text-center text-blue-500 font-medium bg-blue-500/5">Öncelikli</td>
                      <td className="p-4 text-center text-cyan-500 font-medium bg-cyan-500/5">Her Zaman Üstte</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4">Ana Sayfa</td>
                      <td className="p-4 text-center text-muted-foreground">✕</td>
                      <td className="p-4 text-center text-muted-foreground bg-blue-500/5">✕</td>
                      <td className="p-4 text-center text-cyan-500 font-medium bg-cyan-500/5">✓</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4">Destek</td>
                      <td className="p-4 text-center text-muted-foreground">Standart</td>
                      <td className="p-4 text-center text-blue-500 font-medium bg-blue-500/5">Öncelikli</td>
                      <td className="p-4 text-center text-cyan-500 font-medium bg-cyan-500/5">7/24 VIP</td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="p-4">Fiyat (Aylık)</td>
                      <td className="p-4 text-center font-medium">Ücretsiz</td>
                      <td className="p-4 text-center font-bold text-blue-500 bg-blue-500/5">₺199</td>
                      <td className="p-4 text-center font-bold text-cyan-500 bg-cyan-500/5">₺499</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-4">
              Sık Sorulan Sorular
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{item.question}</h3>
                  <p className="text-muted-foreground text-sm">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-primary/20">
            <CardContent className="p-12 text-center">
              <Crown className="w-16 h-16 mx-auto mb-6 text-cyan-500" />
              <h2 className="text-3xl font-black tracking-tighter mb-4">
                Hemen Yükseltin
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Premium veya VIP plan ile profilinizi öne çıkarın ve daha fazla randevu alın
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Planları İncele
                  </Button>
                </Link>
                <Link href="/escort/dashboard">
                  <Button size="lg" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Panele Dön
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
