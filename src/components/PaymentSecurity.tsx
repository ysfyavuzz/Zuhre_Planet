/**
 * PaymentSecurity Component
 * 
 * Displays payment security information, guarantees, and platform fee structure.
 * Educates users about secure payment handling and dispute resolution.
 * 
 * @module components/PaymentSecurity
 * @category Components - Payments
 * 
 * Features:
 * - Payment security guarantees display
 * - Platform fee calculation visualization
 * - Customer protection policies
 * - Escort payout information
 * - Secure payment methods showcase
 * - Dispute resolution process
 * - Transaction timeline
 * - Payment status tracking
 * 
 * Security Features:
 * - PCI-DSS compliance information
 * - 3D Secure verification
 * - Money-back guarantee details
 * - Escrow service explanation
 * - ID verification requirements
 * 
 * Fee Structure:
 * - Platform commission: 15-20%
 * - Payment processing: 2-3%
 * - Net payout calculation
 * - VIP member discounts
 * 
 * @example
 * ```tsx
 * <PaymentSecurity
 *   userType="customer"
 *   bookingAmount={500}
 *   showFeeBreakdown={true}
 * />
 * ```
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield, Lock, CheckCircle2, AlertCircle, Star,
  Clock, Users, CreditCard, Ban, ArrowRight,
  Info, Award, TrendingUp, Eye
} from 'lucide-react';
import {
  CUSTOMER_PAYMENT_SECURITY,
  ESCORT_PAYMENT_SECURITY,
  PAYMENT_SECURITY,
  PAYMENT_METHODS,
  calculatePlatformFee,
  calculateEscortNet,
  BOOKING_STATUS_POINTS
} from '@/types/payment';

interface PaymentSecurityPanelProps {
  userType: 'customer' | 'escort';
  totalBookings?: number;
}

export function PaymentSecurityPanel({ userType, totalBookings = 0 }: PaymentSecurityPanelProps) {
  const [activeTab, setActiveTab] = useState<'benefits' | 'process' | 'refund'>('benefits');

  const benefits = userType === 'customer' ? CUSTOMER_PAYMENT_SECURITY.benefits : ESCORT_PAYMENT_SECURITY.benefits;
  const title = userType === 'customer' ? CUSTOMER_PAYMENT_SECURITY.title : ESCORT_PAYMENT_SECURITY.title;

  if (userType === 'customer') {
    return (
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center shrink-0">
                <Shield className="w-8 h-8 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground">
                  Ödemeniz randevu tamamlanana kadar güvende. Sorun yaşarsanız paranız iade edilir.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="text-center px-3 py-2 bg-background rounded-lg">
                  <Lock className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-xs font-semibold">256-bit SSL</p>
                </div>
                <div className="text-center px-3 py-2 bg-background rounded-lg">
                  <Shield className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-xs font-semibold">PCI DSS</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="benefits">Avantajlar</TabsTrigger>
            <TabsTrigger value="process">Nasıl Çalışır?</TabsTrigger>
            <TabsTrigger value="refund">İade Politikası</TabsTrigger>
          </TabsList>

          {/* Benefits Tab */}
          <TabsContent value="benefits" className="space-y-4">
            {benefits.map((benefit, i) => (
              <Card key={i} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{benefit.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{benefit.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {benefit.highlights.map((highlight, j) => (
                          <Badge key={j} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Loyalty Points Bonus */}
            <Card className="border-purple-500/30 bg-purple-500/5">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Star className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Sadakat Puanı Bonusu</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Platform üzerinden ödeme yaparak her randevudan ekstra puan kazanın!
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-background rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">+50</p>
                        <p className="text-xs text-muted-foreground">Her başarılı randevu</p>
                      </div>
                      <div className="p-3 bg-background rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">+100</p>
                        <p className="text-xs text-muted-foreground">Sorunsuz onay</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Process Tab */}
          <TabsContent value="process" className="space-y-4">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

              {CUSTOMER_PAYMENT_SECURITY.howItWorks.map((step) => (
                <div key={step.step} className="relative flex gap-6 pb-8 last:pb-0">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold z-10 shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1 pt-3">
                    <h4 className="font-bold text-lg">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kabul Edilen Ödeme Yöntemleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(PAYMENT_METHODS)
                    .filter(([_, method]) => method.enabled)
                    .map(([key, method]) => (
                      <div key={key} className="p-4 border rounded-lg flex items-center gap-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <p className="font-semibold">{method.name}</p>
                          <p className="text-xs text-muted-foreground">Komisyonsuz</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Refund Policy Tab */}
          <TabsContent value="refund" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  {CUSTOMER_PAYMENT_SECURITY.refundPolicy.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {CUSTOMER_PAYMENT_SECURITY.refundPolicy.conditions.map((condition, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg ${
                      condition.refund === 'İade yok'
                        ? 'bg-red-500/10 border border-red-500/20'
                        : 'bg-green-500/10 border border-green-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{condition.scenario}</p>
                        <p className={`text-sm ${condition.refund === 'İade yok' ? 'text-red-600' : 'text-green-600'}`}>
                          {condition.refund}
                        </p>
                      </div>
                      <Badge variant={condition.refund === 'İade yok' ? 'destructive' : 'default'}>
                        {condition.timeline}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">
                      Kötü Müşteri Olmayın
                    </p>
                    <p className="text-amber-600 dark:text-amber-300">
                      Kurallara uymayan, saygısız veya ödeme yapmayan kullanıcılar platformdan uzaklaştırılır.
                      Escortlar siz hakkında uyarı bırakabilir.
                    </p>
                  </div>
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
      {/* Header Card */}
      <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0">
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">{title}</h3>
              <p className="text-muted-foreground">
                Ödemeleriniz garanti altında. Kötü müşterileri seçmeme hakkınız var.
              </p>
            </div>
            <div className="text-right px-4 py-2 bg-background rounded-lg">
              <p className="text-sm text-muted-foreground">Mevcut Komisyon</p>
              <p className="text-2xl font-bold text-primary">
                %{(totalBookings < 50 ? 20 : totalBookings < 200 ? 15 : 10)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{benefit.icon}</span>
                <div>
                  <h4 className="font-bold mb-2">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{benefit.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {benefit.highlights.map((highlight, j) => (
                      <Badge key={j} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bad Customer Protection */}
      <Card className="border-orange-500/30 bg-orange-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
            <AlertCircle className="w-5 h-5" />
            {ESCORT_PAYMENT_SECURITY.badCustomerProtection.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ESCORT_PAYMENT_SECURITY.badCustomerProtection.features.map((feature, i) => (
              <div key={i} className="p-4 bg-background rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h5 className="font-bold text-sm mb-1">{feature.title}</h5>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commission Calculator */}
      <Card>
        <CardHeader>
          <CardTitle>Komisyon Oranları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ESCORT_PAYMENT_SECURITY.commission.rates.map((rate, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  totalBookings >= (i === 3 ? 200 : i === 2 ? 200 : i === 1 ? 50 : 0)
                    ? 'bg-primary/10 border-primary/30'
                    : 'bg-muted/20'
                }`}
              >
                <div>
                  <span className="font-semibold">{rate.tier}</span>
                  <p className="text-xs text-muted-foreground">{rate.description}</p>
                </div>
                <Badge variant={rate.commission <= 10 ? 'default' : 'secondary'}>
                  %{rate.commission}
                </Badge>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {ESCORT_PAYMENT_SECURITY.commission.note}
          </p>
        </CardContent>
      </Card>

      {/* Points Calculator */}
      <Card className="border-purple-500/30 bg-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-500" />
            Sadakat Puanı Avantajları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-background rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">+50</p>
              <p className="text-xs text-muted-foreground">Başarılı randevu</p>
            </div>
            <div className="p-3 bg-background rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">+100</p>
              <p className="text-xs text-muted-foreground">İki taraf onaylı</p>
            </div>
            <div className="p-3 bg-background rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">+50</p>
              <p className="text-xs text-muted-foreground">Tekrarlayan müşteri</p>
            </div>
            <div className="p-3 bg-background rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">+30</p>
              <p className="text-xs text-muted-foreground">5 yıldızlı yorum</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Customer Warnings Display for Escorts
export function CustomerWarningsCard({ customerId }: { customerId: string }) {
  // Mock data - in real app, fetch from API
  const warnings = [
    {
      id: '1',
      type: 'respect',
      severity: 'medium',
      count: 3,
      description: 'Randevuya geç kaldı, saygısız davrandı'
    },
    {
      id: '2',
      type: 'payment',
      severity: 'high',
      count: 7,
      description: 'Ödeme yapmadı, kaçtı'
    }
  ];

  const totalWarnings = warnings.reduce((sum, w) => sum + w.count, 0);
  const riskLevel = totalWarnings >= 10 ? 'high' : totalWarnings >= 5 ? 'medium' : 'low';

  return (
    <Card className={`${
      riskLevel === 'high' ? 'border-red-500/50 bg-red-500/5' :
      riskLevel === 'medium' ? 'border-orange-500/50 bg-orange-500/5' :
      'border-green-500/30 bg-green-500/5'
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className={`w-5 h-5 ${
              riskLevel === 'high' ? 'text-red-500' :
              riskLevel === 'medium' ? 'text-orange-500' :
              'text-green-500'
            }`} />
            Müşteri Uyarı Geçmişi
          </div>
          <Badge variant={
            riskLevel === 'high' ? 'destructive' :
            riskLevel === 'medium' ? 'default' :
            'secondary'
          }>
            {riskLevel === 'high' ? 'Yüksek Risk' :
             riskLevel === 'medium' ? 'Orta Risk' :
             'Düşük Risk'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-background rounded-lg">
          <span className="text-sm">Toplam Uyarı Sayısı:</span>
          <span className="text-2xl font-bold">{totalWarnings}</span>
        </div>

        {warnings.map((warning) => (
          <div key={warning.id} className="p-3 bg-background/50 rounded-lg">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-semibold text-sm">{warning.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {warning.count} escort tarafından bildirildi
                </p>
              </div>
              <Badge variant={warning.severity === 'high' ? 'destructive' : 'secondary'} className="shrink-0">
                {warning.severity === 'high' ? 'Ciddi' : 'Orta'}
              </Badge>
            </div>
          </div>
        ))}

        {riskLevel === 'high' && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400 font-semibold">
              ⚠️ Dikkat: Bu müşteri yüksek riskli. Randevu kabul etmeden önce dikkatli olun.
            </p>
          </div>
        )}

        <Button variant="outline" className="w-full" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Detaylı Geçmişi Gör
        </Button>
      </CardContent>
    </Card>
  );
}

// Payment Calculator Component
export function PaymentCalculator({
  amount,
  totalBookings = 0
}: {
  amount: number;
  totalBookings?: number;
}) {
  const platformFee = calculatePlatformFee(amount, totalBookings);
  const escortNet = calculateEscortNet(amount, totalBookings);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ödeme Hesaplayıcı</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b">
          <span className="text-sm">Randevu Tutarı</span>
          <span className="font-bold">₺{amount}</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b">
          <span className="text-sm text-muted-foreground">Platform Komisyonu</span>
          <span className="font-semibold text-red-500">-₺{platformFee}</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="font-bold">Net Ödeme (Escort)</span>
          <span className="text-xl font-bold text-primary">₺{escortNet}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          * Randevu başarıyla tamamlandığında 24 saat içinde hesabınıza geçer
        </p>
      </CardContent>
    </Card>
  );
}
