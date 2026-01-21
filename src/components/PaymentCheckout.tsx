/**
 * PaymentCheckout Component
 *
 * Complete checkout flow with order summary, payment method, and confirmation.
 * Handles subscription upgrades, one-time purchases, and invoice management.
 *
 * @module components/PaymentCheckout
 * @category Components - Payment
 *
 * Features:
 * - Order summary with line items
 * - Discount code application
 * - Tax calculation
 * - Payment method selection
 * - Billing address form
 * - Terms acceptance checkbox
 * - Multi-step checkout flow
 * - Loading states
 * - Error handling
 * - Success confirmation
 *
 * @example
 * ```tsx
 * <PaymentCheckout
 *   plan="premium"
 *   billingCycle="monthly"
 *   amount={199}
 *   onSubmit={handleCheckout}
 *   onCancel={handleCancel}
 * />
 * ```
 */

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import SubscriptionPlanSelector, { SubscriptionPlan, BillingCycle, type PlanConfig } from './SubscriptionPlanSelector';
import PaymentMethodForm, { PaymentMethod, type CardFormData } from './PaymentMethodForm';
import {
  ArrowLeft, ArrowRight, CheckCircle2, AlertCircle,
  Crown, Sparkles, Shield, CreditCard, MapPin, Phone, Mail,
  Percent, Calendar, FileText, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Checkout step enum
 */
export type CheckoutStep = 'review' | 'payment' | 'confirm' | 'success';

/**
 * Line item interface
 */
export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/**
 * Discount interface
 */
export interface Discount {
  code: string;
  percentage: number;
  amount: number;
}

/**
 * Billing address interface
 */
export interface BillingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  taxNumber?: string;
}

/**
 * Checkout summary interface
 */
export interface CheckoutSummary {
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  total: number;
  currency: string;
}

/**
 * Props for PaymentCheckout component
 */
export interface PaymentCheckoutProps {
  /**
   * Selected plan
   */
  plan?: SubscriptionPlan;
  /**
   * Billing cycle
   */
  billingCycle?: BillingCycle;
  /**
   * Base amount before tax/discount
   */
  amount: number;
  /**
   * Line items for invoice
   */
  lineItems?: LineItem[];
  /**
   * Saved payment methods
   */
  savedCards?: PaymentMethod[];
  /**
   * Checkout submit handler
   */
  onSubmit: (data: {
    plan: SubscriptionPlan;
    billingCycle: BillingCycle;
    paymentMethod: CardFormData & { paymentMethodId?: string };
    billingAddress: BillingAddress;
    discount?: Discount;
    summary: CheckoutSummary;
  }) => void | Promise<void>;
  /**
   * Cancel handler
   */
  onCancel?: () => void;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Tax rate (decimal, e.g., 0.20 for 20%)
   */
  taxRate?: number;
  /**
   * Enable discount codes
   */
  enableDiscount?: boolean;
  /**
   * Require billing address
   */
  requireBillingAddress?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Calculate checkout summary
 */
function calculateSummary(
  amount: number,
  taxRate: number,
  discount?: Discount
): CheckoutSummary {
  const subtotal = amount;
  const discountAmount = discount ? (subtotal * discount.percentage) / 100 : 0;
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * taxRate;
  const total = taxableAmount + tax;

  return {
    subtotal,
    tax,
    taxRate,
    discount: discountAmount,
    total,
    currency: '₺',
  };
}

/**
 * Format currency
 */
function formatCurrency(amount: number): string {
  return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Get plan config
 */
function getPlanConfig(plan: SubscriptionPlan, billingCycle: BillingCycle): { price: number; name: string } {
  const configs: Record<SubscriptionPlan, { monthly: number; yearly: number; name: string }> = {
    free: { monthly: 0, yearly: 0, name: 'Ücretsiz' },
    premium: { monthly: 199, yearly: 1990, name: 'Premium' },
    vip: { monthly: 499, yearly: 4990, name: 'VIP' },
  };

  const config = configs[plan];
  return {
    price: billingCycle === 'monthly' ? config.monthly : config.yearly,
    name: config.name,
  };
}

/**
 * PaymentCheckout Component
 *
 * Main checkout component with multi-step flow.
 */
export default function PaymentCheckout({
  plan = 'premium',
  billingCycle = 'monthly',
  amount,
  lineItems,
  savedCards = [],
  onSubmit,
  onCancel,
  loading = false,
  taxRate = 0.20,
  enableDiscount = true,
  requireBillingAddress = false,
  className = '',
}: PaymentCheckoutProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('review');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(plan);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycle>(billingCycle);
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | undefined>();
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Billing address
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Türkiye',
  });

  // Calculate summary
  const planConfig = getPlanConfig(selectedPlan, selectedBillingCycle);
  const effectiveAmount = lineItems ? amount : planConfig.price;
  const summary = useMemo(
    () => calculateSummary(effectiveAmount, taxRate, appliedDiscount),
    [effectiveAmount, taxRate, appliedDiscount]
  );

  // Apply discount code
  const handleApplyDiscount = () => {
    setDiscountError('');

    if (!discountCode.trim()) {
      setDiscountError('Lütfen indirim kodu girin');
      return;
    }

    // Mock discount validation - in real app, validate with API
    const discounts: Record<string, { percentage: number; description: string }> = {
      WELCOME10: { percentage: 10, description: 'Hoş geldin indirimi' },
      VIP20: { percentage: 20, description: 'VIP indirimleri' },
      SAVE15: { percentage: 15, description: 'Tasarruf indirimi' },
    };

    const discount = discounts[discountCode.toUpperCase()];
    if (discount) {
      setAppliedDiscount({
        code: discountCode.toUpperCase(),
        percentage: discount.percentage,
        amount: (effectiveAmount * discount.percentage) / 100,
      });
    } else {
      setDiscountError('Geçersiz indirim kodu');
    }
  };

  // Remove discount
  const handleRemoveDiscount = () => {
    setAppliedDiscount(undefined);
    setDiscountCode('');
    setDiscountError('');
  };

  // Handle payment method submit
  const handlePaymentSubmit = async (paymentMethod: CardFormData & { paymentMethodId?: string }) => {
    await onSubmit({
      plan: selectedPlan,
      billingCycle: selectedBillingCycle,
      paymentMethod,
      billingAddress,
      discount: appliedDiscount,
      summary,
    });
    setCurrentStep('success');
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'review':
        return (
          <div className="space-y-6">
            {/* Plan Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Plan Seçimi</h3>
              <SubscriptionPlanSelector
                currentPlan={selectedPlan}
                onSelectPlan={setSelectedPlan}
                billingCycle={selectedBillingCycle}
                onBillingCycleChange={setSelectedBillingCycle}
                compact
                showComparison={false}
              />
            </div>

            {/* Discount Code */}
            {enableDiscount && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="İndirim kodu"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      disabled={!!appliedDiscount}
                      className="flex-1"
                    />
                    {!appliedDiscount ? (
                      <Button onClick={handleApplyDiscount} variant="outline">
                        <Percent className="w-4 h-4 mr-2" />
                        Uygula
                      </Button>
                    ) : (
                      <Button onClick={handleRemoveDiscount} variant="outline" className="text-red-500">
                        Kaldır
                      </Button>
                    )}
                  </div>
                  {discountError && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {discountError}
                    </p>
                  )}
                  {appliedDiscount && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {appliedDiscount.code} kodu uygulandı - %{appliedDiscount.percentage} indirim
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Line Items */}
                {lineItems ? (
                  <div className="space-y-2">
                    {lineItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.description}</span>
                        <span className="font-semibold">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span>{planConfig.name} Plan ({selectedBillingCycle === 'monthly' ? 'Aylık' : 'Yıllık'})</span>
                    <span className="font-semibold">{formatCurrency(planConfig.price)}</span>
                  </div>
                )}

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ara Toplam</span>
                    <span>{formatCurrency(summary.subtotal)}</span>
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>İndirim ({appliedDiscount.code})</span>
                      <span>-{formatCurrency(summary.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">KDV (%{(summary.taxRate * 100).toFixed(0)})</span>
                    <span>{formatCurrency(summary.tax)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Toplam</span>
                    <span className="text-primary">{formatCurrency(summary.total)}</span>
                  </div>
                </div>

                {/* Billing Cycle Note */}
                {selectedBillingCycle === 'yearly' && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Yıllık ödemede %17 tasarruf edin!</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Continue Button */}
            <Button
              onClick={() => setCurrentStep('payment')}
              className="w-full"
              size="lg"
            >
              Ödemeye Geç
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            {/* Order Summary (Compact) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{planConfig.name} Plan</span>
                  <span>{formatCurrency(summary.subtotal)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Toplam</span>
                  <span className="text-primary">{formatCurrency(summary.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            {requireBillingAddress && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Fatura Adresi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Ad Soyad *</span>
                      <Input
                        id="fullName"
                        value={billingAddress.fullName}
                        onChange={(e) => setBillingAddress({ ...billingAddress, fullName: e.target.value })}
                        placeholder="Ad Soyad"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium">E-posta *</span>
                      <Input
                        id="email"
                        type="email"
                        value={billingAddress.email}
                        onChange={(e) => setBillingAddress({ ...billingAddress, email: e.target.value })}
                        placeholder="ornek@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium">Telefon *</span>
                      <Input
                        id="phone"
                        type="tel"
                        value={billingAddress.phone}
                        onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                        placeholder="+90 555 123 4567"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium">Vergi No</span>
                      <Input
                        id="taxNumber"
                        value={billingAddress.taxNumber || ''}
                        onChange={(e) => setBillingAddress({ ...billingAddress, taxNumber: e.target.value })}
                        placeholder="1234567890"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Adres *</span>
                    <Input
                      id="address"
                      value={billingAddress.address}
                      onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })}
                      placeholder="Mahalle, Sokak, No"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Şehir *</span>
                      <Input
                        id="city"
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                        placeholder="İstanbul"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium">Posta Kodu *</span>
                      <Input
                        id="postalCode"
                        value={billingAddress.postalCode}
                        onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
                        placeholder="34000"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium">Ülke *</span>
                      <Input
                        id="country"
                        value={billingAddress.country}
                        onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Ödeme Yöntemi</h3>
              <PaymentMethodForm
                savedCards={savedCards}
                onSubmit={handlePaymentSubmit}
                loading={loading}
                showSaveOption={true}
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <span className="text-sm leading-relaxed cursor-pointer">
                <a href="/terms" className="text-primary hover:underline">Hizmet şartlarını</a> ve{' '}
                <a href="/privacy" className="text-primary hover:underline">gizlilik politikasını</a> okudum ve kabul ediyorum.
              </span>
            </div>

            {/* Back Button */}
            <Button
              onClick={() => setCurrentStep('review')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Button>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6 py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center"
            >
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </motion.div>

            <div>
              <h2 className="text-2xl font-black mb-2">Ödeme Başarılı!</h2>
              <p className="text-muted-foreground">
                {planConfig.name} planınız aktif.
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-semibold">{planConfig.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Fatura Tutarı</span>
                  <span className="font-bold text-primary">{formatCurrency(summary.total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ödeme Yöntemi</span>
                  <span className="font-semibold">Kredi Kartı</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>İşlem Tarihi</span>
                  <span>{new Date().toLocaleDateString('tr-TR')}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={() => window.location.href = '/escort/dashboard'} className="flex-1">
                Panele Git
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Faturayı İndir
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Progress Steps */}
      {currentStep !== 'success' && (
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${currentStep === 'review' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep === 'review' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              1
            </div>
            <span className="hidden sm:inline font-medium">Özet</span>
          </div>

          <div className={`w-12 h-0.5 ${currentStep === 'payment' ? 'bg-primary' : 'bg-muted'}`} />

          <div className={`flex items-center gap-2 ${currentStep === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              2
            </div>
            <span className="hidden sm:inline font-medium">Ödeme</span>
          </div>
        </div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Cancel Button */}
      {onCancel && currentStep !== 'success' && (
        <button
          onClick={onCancel}
          className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          İptal ve Ana Sayfaya Dön
        </button>
      )}
    </div>
  );
}
