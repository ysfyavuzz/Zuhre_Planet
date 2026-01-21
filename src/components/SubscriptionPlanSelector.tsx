/**
 * SubscriptionPlanSelector Component
 *
 * Interactive subscription plan selector with comparison and upgrade options.
 * Displays available plans (Free, Premium, VIP) with features and pricing.
 *
 * @module components/SubscriptionPlanSelector
 * @category Components - Payment
 *
 * Features:
 * - 3 plan tiers (Free, Premium, VIP)
 * - Feature comparison table
 * - Price display with monthly/yearly toggle
 * - Popular plan highlight
 * - Current plan indicator
 * - Upgrade flow integration
 * - Responsive card layout
 * - Animated plan cards
 * - Discount badges
 *
 * Plans:
 * - Free: Basic features, limited photos/videos
 * - Premium: Enhanced features, more media, priority support
 * - VIP: Unlimited everything, featured placement, dedicated support
 *
 * @example
 * ```tsx
 * <SubscriptionPlanSelector
 *   currentPlan="premium"
 *   onSelectPlan={handlePlanSelect}
 *   billingCycle="monthly"
 *   onBillingCycleChange={setBillingCycle}
 *   showComparison={true}
 * />
 * ```
 */

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Check, Crown, Sparkles, Zap, ArrowRight, Star,
  Shield, Video, Image as ImageIcon, MessageCircle,
  TrendingUp, Users, Heart, ExternalLink, Info, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Subscription plan type
 */
export type SubscriptionPlan = 'free' | 'premium' | 'vip';

/**
 * Billing cycle type
 */
export type BillingCycle = 'monthly' | 'yearly';

/**
 * Plan feature interface
 */
export interface PlanFeature {
  id: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
}

/**
 * Subscription plan configuration
 */
export interface PlanConfig {
  id: SubscriptionPlan;
  name: string;
  displayName: string;
  description: string;
  icon: React.ReactNode;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyDiscount: number;
  features: PlanFeature[];
  limitations: string[];
  highlight?: boolean;
  popular?: boolean;
}

/**
 * Props for SubscriptionPlanSelector component
 */
export interface SubscriptionPlanSelectorProps {
  /**
   * Current active plan
   */
  currentPlan?: SubscriptionPlan;
  /**
   * Plan selection handler
   */
  onSelectPlan?: (plan: SubscriptionPlan) => void;
  /**
   * Current billing cycle
   */
  billingCycle?: BillingCycle;
  /**
   * Billing cycle change handler
   */
  onBillingCycleChange?: (cycle: BillingCycle) => void;
  /**
   * Show comparison table
   */
  showComparison?: boolean;
  /**
   * Compact mode for smaller spaces
   */
  compact?: boolean;
  /**
   * Display upgrade buttons only
   */
  upgradeOnly?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Plan configurations
 */
const PLAN_CONFIGS: Record<SubscriptionPlan, PlanConfig> = {
  free: {
    id: 'free',
    name: 'free',
    displayName: 'Ücretsiz',
    description: 'Başlamak için ideal',
    icon: <Users className="w-6 h-6" />,
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyDiscount: 0,
    features: [
      { id: 'photos', icon: <ImageIcon className="w-4 h-4" />, label: '10 fotoğraf' },
      { id: 'videos', icon: <Video className="w-4 h-4" />, label: '3 video (2 dakika)' },
      { id: 'search', icon: <Search className="w-4 h-4" />, label: 'Temel arama' },
      { id: 'messages', icon: <MessageCircle className="w-4 h-4" />, label: 'Mesajlaşma' },
    ],
    limitations: [
      'Öne çıkan liste yok',
      'Öncelikli destek yok',
      'Reklamlar gösterilir',
    ],
  },
  premium: {
    id: 'premium',
    name: 'premium',
    displayName: 'Premium',
    description: 'Popüler seçim',
    icon: <Sparkles className="w-6 h-6" />,
    monthlyPrice: 199,
    yearlyPrice: 1990,
    yearlyDiscount: 17,
    features: [
      { id: 'photos', icon: <ImageIcon className="w-4 h-4" />, label: '30 fotoğraf' },
      { id: 'videos', icon: <Video className="w-4 h-4" />, label: '20 video (5 dakika)' },
      { id: 'search', icon: <TrendingUp className="w-4 h-4" />, label: 'Öncelikli arama' },
      { id: 'messages', icon: <MessageCircle className="w-4 h-4" />, label: 'Sınırsız mesaj' },
      { id: 'featured', icon: <Star className="w-4 h-4" />, label: 'Haftalık öne çıkarma' },
      { id: 'support', icon: <Shield className="w-4 h-4" />, label: 'Öncelikli destek' },
    ],
    limitations: [
      'Ana sayfa yerleşimi yok',
      'Logo gösterimi yok',
    ],
    popular: true,
    highlight: true,
  },
  vip: {
    id: 'vip',
    name: 'vip',
    displayName: 'VIP',
    description: 'En iyi deneyim',
    icon: <Crown className="w-6 h-6" />,
    monthlyPrice: 499,
    yearlyPrice: 4990,
    yearlyDiscount: 17,
    features: [
      { id: 'photos', icon: <ImageIcon className="w-4 h-4" />, label: 'Sınırsız fotoğraf' },
      { id: 'videos', icon: <Video className="w-4 h-4" />, label: 'Sınırsız video' },
      { id: 'search', icon: <TrendingUp className="w-4 h-4" />, label: 'Her zaman üstte' },
      { id: 'messages', icon: <MessageCircle className="w-4 h-4" />, label: 'Sınırsız her şey' },
      { id: 'featured', icon: <Star className="w-4 h-4" />, label: 'Günlük öne çıkarma' },
      { id: 'support', icon: <Shield className="w-4 h-4" />, label: '7/24 destek' },
      { id: 'homepage', icon: <Heart className="w-4 h-4" />, label: 'Ana sayfada gösterim' },
      { id: 'badge', icon: <Zap className="w-4 h-4" />, label: 'VIP rozeti' },
    ],
    limitations: [],
    highlight: true,
  },
};

/**
 * Format price with currency
 */
function formatPrice(price: number): string {
  if (price === 0) return 'Ücretsiz';
  return `₺${price.toLocaleString('tr-TR')}`;
}

/**
 * Get plan color classes
 */
function getPlanColorClasses(plan: SubscriptionPlan, isSelected: boolean): string {
  const baseClasses = 'relative overflow-hidden transition-all duration-300';
  const borderClasses = isSelected ? 'ring-2 ring-offset-2' : '';

  const colorMap = {
    free: {
      border: isSelected ? 'ring-gray-500' : 'border-gray-500/30 hover:border-gray-500/50',
      bg: isSelected ? 'bg-gray-500/5' : 'bg-card',
      gradient: '',
    },
    premium: {
      border: isSelected ? 'ring-purple-500' : 'border-purple-500/30 hover:border-purple-500/50',
      bg: isSelected ? 'bg-purple-500/5' : 'bg-card',
      gradient: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10',
    },
    vip: {
      border: isSelected ? 'ring-amber-500' : 'border-amber-500/30 hover:border-amber-500/50',
      bg: isSelected ? 'bg-amber-500/5' : 'bg-card',
      gradient: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10',
    },
  };

  return `${baseClasses} ${borderClasses} ${colorMap[plan].border} ${colorMap[plan].bg} ${colorMap[plan].gradient}`;
}

/**
 * SubscriptionPlanSelector Component
 *
 * Main component for selecting subscription plans.
 */
export default function SubscriptionPlanSelector({
  currentPlan = 'free',
  onSelectPlan,
  billingCycle = 'monthly',
  onBillingCycleChange,
  showComparison = true,
  compact = false,
  upgradeOnly = false,
  className = '',
}: SubscriptionPlanSelectorProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(currentPlan);

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    if (onSelectPlan) {
      onSelectPlan(plan);
    }
  };

  const handleBillingCycleChange = (cycle: BillingCycle) => {
    if (onBillingCycleChange) {
      onBillingCycleChange(cycle);
    }
  };

  const getPrice = (plan: PlanConfig) => {
    return billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getPriceDisplay = (plan: PlanConfig) => {
    const price = getPrice(plan);
    if (price === 0) return 'Ücretsiz';

    const period = billingCycle === 'yearly' ? '/yıl' : '/ay';
    return `${formatPrice(price)}${period}`;
  };

  const getSavings = (plan: PlanConfig) => {
    if (plan.monthlyPrice === 0) return null;
    if (billingCycle === 'monthly') return null;

    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = monthlyTotal - plan.yearlyPrice;
    const percentage = Math.round((savings / monthlyTotal) * 100);

    return { amount: savings, percentage };
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter mb-2">
            Size Uygun Planı Seçin
          </h2>
          <p className="text-muted-foreground">
            İhtiyaçlarınıza en uygun abonelik planını seçin
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="inline-flex items-center gap-4 p-1 rounded-lg bg-muted">
          <button
            onClick={() => handleBillingCycleChange('monthly')}
            className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Aylık
          </button>
          <button
            onClick={() => handleBillingCycleChange('yearly')}
            className={`px-6 py-2 rounded-md text-sm font-semibold transition-all relative ${
              billingCycle === 'yearly'
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Yıllık
            <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0">
              %17 indirim
            </Badge>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className={`grid gap-6 ${
        compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'
      }`}>
        {(Object.entries(PLAN_CONFIGS) as [SubscriptionPlan, PlanConfig][]).map(([planId, plan]) => {
          const isSelected = selectedPlan === planId;
          const isCurrent = currentPlan === planId;
          const savings = getSavings(plan);

          return (
            <motion.div
              key={planId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: planId === 'free' ? 0 : planId === 'premium' ? 0.1 : 0.2 }}
              className={getPlanColorClasses(planId, isSelected)}
            >
              <Card className={`border-2 h-full ${plan.popular ? 'card-premium' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    En Popüler
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-3 rounded-xl ${
                      planId === 'free' ? 'bg-gray-500/10 text-gray-600 dark:text-gray-400' :
                      planId === 'premium' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                      'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}>
                      {plan.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{plan.displayName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black">{getPriceDisplay(plan)}</span>
                    </div>
                    {savings && (
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <Zap className="w-4 h-4" />
                        <span>₺{savings.amount.toLocaleString()} tasarruf edin ({savings.percentage}%)</span>
                      </div>
                    )}
                  </div>

                  {isCurrent && (
                    <Badge variant="outline" className="mt-3 border-green-500/30 text-green-600 dark:text-green-400">
                      <Check className="w-3 h-3 mr-1" />
                      Mevcut Plan
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Upgrade/Select Button */}
                  {!upgradeOnly && (
                    <Button
                      onClick={() => handlePlanSelect(planId)}
                      disabled={isCurrent}
                      className={`w-full ${
                        planId === 'vip'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                          : planId === 'premium'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                          : ''
                      }`}
                      size="lg"
                    >
                      {isCurrent ? 'Mevcut Plan' : planId === currentPlan ? 'Aynı Plan' : 'Yükselt'}
                      {!isCurrent && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  )}

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Özellikler:</h4>
                    <div className="space-y-2">
                      {plan.features.map((feature) => (
                        <div key={feature.id} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="text-sm font-medium">{feature.label}</span>
                            {feature.description && (
                              <p className="text-xs text-muted-foreground">{feature.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && !compact && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Sınırlamalar:</h4>
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Upgrade from current plan */}
                  {upgradeOnly && !isCurrent && (
                    <Button
                      onClick={() => handlePlanSelect(planId)}
                      className={`w-full ${
                        planId === 'vip'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                      size="lg"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      {plan.displayName}'e Yükselt
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Table */}
      {showComparison && !compact && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Plan Karşılaştırması
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Özellik</th>
                    <th className="text-center p-4 font-semibold">Ücretsiz</th>
                    <th className="text-center p-4 font-semibold bg-purple-500/10">Premium</th>
                    <th className="text-center p-4 font-semibold bg-amber-500/10">VIP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-4">Fotoğraf Sayısı</td>
                    <td className="p-4 text-center font-medium">10</td>
                    <td className="p-4 text-center font-medium bg-purple-500/5">30</td>
                    <td className="p-4 text-center font-medium bg-amber-500/5">Sınırsız</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-4">Video Sayısı</td>
                    <td className="p-4 text-center font-medium">3</td>
                    <td className="p-4 text-center font-medium bg-purple-500/5">20</td>
                    <td className="p-4 text-center font-medium bg-amber-500/5">Sınırsız</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-4">Video Süresi</td>
                    <td className="p-4 text-center font-medium">2 dakika</td>
                    <td className="p-4 text-center font-medium bg-purple-500/5">5 dakika</td>
                    <td className="p-4 text-center font-medium bg-amber-500/5">Sınırsız</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-4">Öne Çıkarma</td>
                    <td className="p-4 text-center text-muted-foreground">✕</td>
                    <td className="p-4 text-center text-purple-500 font-medium bg-purple-500/5">Haftalık</td>
                    <td className="p-4 text-center text-amber-500 font-medium bg-amber-500/5">Günlük</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="p-4">Ana Sayfa</td>
                    <td className="p-4 text-center text-muted-foreground">✕</td>
                    <td className="p-4 text-center text-muted-foreground bg-purple-500/5">✕</td>
                    <td className="p-4 text-center text-amber-500 font-medium bg-amber-500/5">✓</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="p-4">Destek</td>
                    <td className="p-4 text-center text-muted-foreground">Standart</td>
                    <td className="p-4 text-center text-purple-500 font-medium bg-purple-500/5">Öncelikli</td>
                    <td className="p-4 text-center text-amber-500 font-medium bg-amber-500/5">7/24</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Compact plan selector for embedding in cards
 */
export function SubscriptionPlanCompact({
  currentPlan = 'free',
  onSelectPlan,
}: {
  currentPlan?: SubscriptionPlan;
  onSelectPlan?: (plan: SubscriptionPlan) => void;
}) {
  return (
    <SubscriptionPlanSelector
      currentPlan={currentPlan}
      onSelectPlan={onSelectPlan}
      compact
      showComparison={false}
    />
  );
}

/**
 * Plan badge component for displaying current plan
 */
export function PlanBadge({ plan }: { plan: SubscriptionPlan }) {
  const config = PLAN_CONFIGS[plan];

  const badgeClasses = {
    free: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/30',
    premium: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
    vip: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
  };

  return (
    <Badge className={`${badgeClasses[plan]} gap-1.5 px-3 py-1`}>
      {config.icon}
      <span className="font-semibold">{config.displayName}</span>
    </Badge>
  );
}
