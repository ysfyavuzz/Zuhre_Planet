/**
 * BillingDashboard Page
 *
 * Billing and invoice management dashboard for users.
 * Shows current plan, payment methods, invoice history, and quick actions.
 *
 * @module pages/BillingDashboard
 * @category Pages - Dashboard
 *
 * Features:
 * - Current plan display with upgrade options
 * - Payment method management
 * - Invoice history with filters
 * - Download invoices
 * - Billing summary
 * - Next payment date
 * - Usage statistics
 * - Quick actions (upgrade, add payment method, support)
 *
 * Routes: /dashboard/billing, /billing, /faturas
 *
 * @example
 * ```tsx
 * // Route: /dashboard/billing
 * <BillingDashboard />
 * ```
 */

import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import SubscriptionPlanSelector, { SubscriptionPlan, BillingCycle, PlanBadge } from '@/components/SubscriptionPlanSelector';
import InvoiceHistory, { Invoice, InvoiceStatus } from '@/components/InvoiceHistory';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  CreditCard, Download, Plus, Settings, Crown, Sparkles,
  Calendar, TrendingUp, AlertCircle, CheckCircle2, FileText,
  RefreshCw, ExternalLink, HelpCircle, CreditCard as CardIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { SEO } from '@/pages/SEO';

/**
 * Mock invoice data
 */
const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-001',
    amount: 199,
    currency: '₺',
    status: 'paid',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    description: 'Premium Plan - Aylık',
    plan: 'Premium',
    billingCycle: 'monthly',
    paymentMethod: 'Kredi Kartı •••• 4242',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-002',
    amount: 199,
    currency: '₺',
    status: 'paid',
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    description: 'Premium Plan - Aylık',
    plan: 'Premium',
    billingCycle: 'monthly',
    paymentMethod: 'Kredi Kartı •••• 4242',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-003',
    amount: 199,
    currency: '₺',
    status: 'pending',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    description: 'Premium Plan - Aylık',
    plan: 'Premium',
    billingCycle: 'monthly',
    paymentMethod: 'Kredi Kartı •••• 4242',
  },
];

/**
 * Payment method interface
 */
interface PaymentMethodInfo {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

/**
 * Mock payment methods
 */
const mockPaymentMethods: PaymentMethodInfo[] = [
  {
    id: 'pm-1',
    type: 'visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2027,
    isDefault: true,
  },
];

/**
 * BillingDashboard Page Component
 */
export default function BillingDashboard() {
  const { user } = useAuth();
  const currentPlan = (user?.membership as SubscriptionPlan) || 'free';

  // Calculate next payment date
  const nextPaymentDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  // Calculate billing summary
  const billingSummary = useMemo(() => {
    const total = mockInvoices.reduce((sum, inv) => sum + (inv.status === 'paid' ? inv.amount : 0), 0);
    const pending = mockInvoices.reduce((sum, inv) => sum + (inv.status === 'pending' ? inv.amount : 0), 0);

    return { total, pending };
  }, []);

  // Handle invoice download
  const handleInvoiceDownload = async (invoiceId: string) => {
    // In real app, download PDF from server
    alert('Fatura indiriliyor: ' + invoiceId);
  };

  // Handle view invoice details
  const handleViewInvoiceDetails = (invoiceId: string) => {
    // In real app, navigate to invoice detail page
  };

  return (
    <ProtectedRoute accessLevel="customer">
      <div className="min-h-screen bg-background">
        <SEO
          title="Faturalandırma | Escort Platform"
          description="Faturalarınızı görün ve yönetin"
        />

        {/* Header */}
        <section className="bg-gradient-to-br from-purple-500/10 via-background to-pink-500/10 border-b border-border/50">
          <div className="container py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black mb-2 tracking-tighter">
                  Faturalandırma
                </h1>
                <p className="text-muted-foreground">
                  Faturalarınızı görüntüleyin ve yönetin
                </p>
              </div>

              <div className="flex gap-2">
                <Link href="/upgrade">
                  <Button variant="outline" size="sm">
                    <Crown className="w-4 h-4 mr-2" />
                    Plan Yükselt
                  </Button>
                </Link>
                <Link href="/escort/dashboard">
                  <Button size="sm">
                    Panele Dön
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Mevcut Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{currentPlan === 'premium' ? 'Premium' : currentPlan === 'vip' ? 'VIP' : 'Ücretsiz'} Plan</h3>
                        <PlanBadge plan={currentPlan} />
                      </div>
                      <p className="text-muted-foreground">
                        {currentPlan === 'free' && 'Temel özelliklerle başlayın'}
                        {currentPlan === 'premium' && 'Gelişmiş özelliklerle profilinizi öne çıkarın'}
                        {currentPlan === 'vip' && 'En iyi deneyim için sınırsız özellikler'}
                      </p>
                    </div>

                    {currentPlan !== 'vip' && (
                      <Link href="/upgrade">
                        <Button>
                          <Crown className="w-4 h-4 mr-2" />
                          Yükselt
                        </Button>
                      </Link>
                    )}
                  </div>

                  {currentPlan !== 'free' && (
                    <>
                      <Separator />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Fiyat</span>
                          <div className="font-semibold">
                            {currentPlan === 'premium' ? '₺199/ay' : '₺499/ay'}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sonraki Ödeme</span>
                          <div className="font-semibold">
                            {nextPaymentDate.toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>

                      {billingSummary.pending > 0 && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <div>
                            <span className="font-semibold">Bekleyen ödeme:</span>{' '}
                            <span>₺{billingSummary.pending.toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Invoice History */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black tracking-tighter">Fatura Geçmişi</h2>
                  <Button variant="link" className="text-purple-500 dark:text-purple-400 font-bold p-0">
                    Tümünü Gör
                  </Button>
                </div>

                <InvoiceHistory
                  invoices={mockInvoices}
                  onDownload={handleInvoiceDownload}
                  onViewDetails={handleViewInvoiceDetails}
                  showFilters={true}
                  compact={false}
                />
              </div>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardIcon className="w-5 h-5" />
                      Ödeme Yöntemleri
                    </div>
                    <Button variant="ghost" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Yeni Ekle
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mockPaymentMethods.length === 0 ? (
                    <div className="text-center py-8">
                      <CardIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                      <p className="text-muted-foreground mb-4">
                        Kayıtlı ödeme yönteminiz yok
                      </p>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Ödeme Yöntemi Ekle
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mockPaymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-muted">
                              <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {method.type === 'visa' ? 'Visa' : method.type === 'mastercard' ? 'Mastercard' : 'American Express'}
                                {method.isDefault && (
                                  <Badge variant="outline" className="text-xs">
                                    Varsayılan
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                •••• {method.last4} • {String(method.expiryMonth).padStart(2, '0')}/{String(method.expiryYear).slice(-2)}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Billing Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Özet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Toplam Harcama</span>
                    <span className="font-bold text-lg">₺{billingSummary.total.toLocaleString()}</span>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Ödenen Fatura</span>
                      <span className="font-semibold">{mockInvoices.filter(i => i.status === 'paid').length} adet</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Bekleyen</span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {mockInvoices.filter(i => i.status === 'pending').length} adet
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <Link href="/upgrade">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Crown className="w-4 h-4 mr-2" />
                      Plan Yükselt
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hızlı İşlemler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/upgrade">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Plan Değiştir
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ödeme Yöntemi Ekle
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Tüm Faturaları İndir
                  </Button>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Destek
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Next Payment */}
              {currentPlan !== 'free' && (
                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Calendar className="w-10 h-10 text-purple-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold mb-1">Sonraki Ödeme</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {formatDistanceToNow(nextPaymentDate, { addSuffix: true, locale: tr })}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">{currentPlan === 'premium' ? '₺199' : '₺499'}</span> tahsil edilecek
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
