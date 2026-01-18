/**
 * CustomerRatingForm Component
 * 
 * Comprehensive rating and review form for customers to evaluate their experience.
 * Multi-category rating system with detailed feedback options.
 * 
 * @module components/CustomerRatingForm
 * @category Components - Reviews
 * 
 * Features:
 * - Multi-category star ratings (professionalism, communication, value, etc.)
 * - Tag-based feedback selection
 * - Written review with character limit
 * - Photo upload capability
 * - Anonymous review option
 * - Real-time validation
 * - Rating summary visualization
 * 
 * Rating Categories:
 * - Overall satisfaction
 * - Professionalism
 * - Communication
 * - Appearance
 * - Value for money
 * - Punctuality
 * - Service quality
 * 
 * @example
 * ```tsx
 * <CustomerRatingForm
 *   escortId="escort-123"
 *   escortName="Ayşe Y."
 *   bookingId="booking-456"
 *   onSubmit={(rating) => console.log(rating)}
 * />
 * ```
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Star, Smile, Meh, Frown, Sparkles, Award,
  CheckCircle2, Send, Clock, Shield, TrendingUp,
  DollarSign, User, AlertTriangle, ThumbsUp, Calendar
} from 'lucide-react';
import { CustomerWarning, WARNING_TYPE_CONFIG } from '@/types/reviews';

export interface CustomerRatingFormData {
  overallRating: number; // 1-5 yıldız
  punctuality: number; // 1-5 - Zamanlama
  personalHygiene: number; // 1-5 - Kişisel bakım/temizlik
  respect: number; // 1-5 - Saygı ve iletişim
  payment: number; // 1-5 - Ödeme güvenilirliği
  behavior: number; // 1-5 - Genel davranış
  wouldRecommend: boolean;
  comment: string;
  tags?: string[];
  createWarning?: boolean;
  warningType?: CustomerWarning['warningType'];
}

interface CustomerRatingFormProps {
  bookingId: string;
  customerId: string;
  customerName: string; // Anonimleştirilmiş isim
  customerAvatar?: string;
  bookingDate: Date;
  onSubmit: (rating: CustomerRatingFormData) => void;
  onWarningCreated?: (warning: Omit<CustomerWarning, 'id' | 'date' | 'escortId' | 'upvotes' | 'verified'>) => void;
  escortId: string;
}

export function CustomerRatingForm({
  bookingId,
  customerId,
  customerName,
  customerAvatar,
  bookingDate,
  onSubmit,
  onWarningCreated,
  escortId
}: CustomerRatingFormProps) {
  const [step, setStep] = useState<'start' | 'rating' | 'warning' | 'comment' | 'confirm'>('start');
  const [formData, setFormData] = useState<CustomerRatingFormData>({
    overallRating: 0,
    punctuality: 0,
    personalHygiene: 0,
    respect: 0,
    payment: 0,
    behavior: 0,
    wouldRecommend: false,
    comment: '',
    createWarning: false
  });

  const [hoveredRating, setHoveredRating] = useState(0);

  const criteriaConfig = [
    {
      key: 'punctuality' as const,
      icon: '⏰',
      title: 'Zamanlama',
      description: 'Randevuya vaktinde gelmesi, saatlere sadakat',
      color: 'blue',
      weight: 1.0
    },
    {
      key: 'personalHygiene' as const,
      icon: '🧼',
      title: 'Kişisel Bakım',
      description: 'Temizlik, hijyen, bakım',
      color: 'cyan',
      weight: 1.2 // Daha önemli
    },
    {
      key: 'respect' as const,
      icon: '🤝',
      title: 'Saygı ve İletişim',
      description: 'Naziklik, kibarlık, sınırlara saygı',
      color: 'purple',
      weight: 1.5 // Çok önemli
    },
    {
      key: 'payment' as const,
      icon: '💰',
      title: 'Ödeme Güvenilirliği',
      description: 'Anında ödeme, pazarlık yapmama',
      color: 'green',
      weight: 2.0 // En önemli
    },
    {
      key: 'behavior' as const,
      icon: '😊',
      title: 'Genel Davranış',
      description: 'İşbirliği, anlayış, genel tavır',
      color: 'amber',
      weight: 1.0
    }
  ];

  const calculateOverallRating = () => {
    const ratings = criteriaConfig.map(c => ({
      rating: formData[c.key],
      weight: c.weight
    }));
    const validRatings = ratings.filter(r => r.rating > 0);

    if (validRatings.length === 0) return 0;

    const weightedSum = validRatings.reduce((sum, r) => sum + (r.rating * r.weight), 0);
    const totalWeight = validRatings.reduce((sum, r) => sum + r.weight, 0);

    return weightedSum / totalWeight;
  };

  const overallRating = formData.overallRating || calculateOverallRating();

  // Eğer ödeme puanı düşükse veya saygı puanı düşükse uyarı göster
  const shouldSuggestWarning = formData.payment <= 2 || formData.respect <= 2;

  const handleStarClick = (criteria: keyof CustomerRatingFormData, rating: number) => {
    setFormData(prev => ({ ...prev, [criteria]: rating }));
  };

  const handleSubmit = () => {
    if (overallRating < 1) {
      alert('Lütfen en az bir kriteri değerlendirin.');
      return;
    }

    // Uyarı oluştur gerekirse
    if (formData.createWarning && formData.warningType && onWarningCreated) {
      onWarningCreated({
        customerId,
        customerName,
        warningType: formData.warningType,
        severity: overallRating <= 2 ? 'high' : overallRating <= 3 ? 'medium' : 'low',
        comment: formData.comment || 'Randevu sonrası değerlendirme'
      });
    }

    onSubmit(formData);
  };

  const getStarIcon = (rating: number, index: number) => {
    const starValue = index + 1;
    if (rating >= starValue) {
      return <Star className="w-5 h-5 fill-amber-400 text-amber-400" />;
    }
    return <Star className="w-5 h-5 text-gray-300" />;
  };

  const getMoodForRating = (rating: number) => {
    if (rating >= 4.5) return { icon: <Sparkles className="w-6 h-6" />, color: 'text-green-500', label: 'Mükemmel Müşteri' };
    if (rating >= 4) return { icon: <Smile className="w-6 h-6" />, color: 'text-blue-500', label: 'İyi Müşteri' };
    if (rating >= 3) return { icon: <Meh className="w-6 h-6" />, color: 'text-amber-500', label: 'Orta' };
    if (rating >= 2) return { icon: <Frown className="w-6 h-6" />, color: 'text-orange-500', label: 'Zayıf' };
    return { icon: <AlertTriangle className="w-6 h-6" />, color: 'text-red-500', label: 'Problemli' };
  };

  if (step === 'start') {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Randevu Tamamlandı!</h3>
          <p className="text-muted-foreground mb-6">
            {customerName} ile randevunuzu değerlendirerek diğer escortları bilgilendirin.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-left">
                <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">
                  Escortların Koruma Ağı
                </p>
                <p className="text-blue-600 dark:text-blue-300">
                  Değerlendirmeniz sadece diğer escortlar tarafından görülecek. Müşteri kimliği gizli kalacak.
                  Problemli davranışları bildirerek topluluğu koruyun.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-background rounded-lg">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Tarih</p>
              <p className="font-semibold">{new Date(bookingDate).toLocaleDateString('tr-TR')}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Müşteri</p>
              <p className="font-semibold">{customerName}</p>
            </div>
          </div>
          <Button size="lg" onClick={() => setStep('rating')} className="w-full sm:w-auto">
            Değerlendirmeye Başla
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'rating') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            Müşteriyi Değerlendirin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Rating */}
          <div className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-3">Genel Puanınız</p>
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick('overallRating', star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  {getStarIcon(hoveredRating || formData.overallRating, star - 1)}
                </button>
              ))}
            </div>
            {formData.overallRating > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2"
              >
                {getMoodForRating(hoveredRating || formData.overallRating).icon}
                <span className={`font-bold ${getMoodForRating(hoveredRating || formData.overallRating).color}`}>
                  {getMoodForRating(hoveredRating || formData.overallRating).label}
                </span>
              </motion.div>
            )}
          </div>

          {/* Detailed Criteria */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-center text-muted-foreground">
              Aşağıdaki kriterleri detaylı şekilde puanlayın
            </p>

            {criteriaConfig.map((criteria) => {
              const rating = formData[criteria.key];
              const isCritical = criteria.weight >= 1.5;
              return (
                <div
                  key={criteria.key}
                  className={`p-4 rounded-lg ${isCritical ? 'bg-primary/5 border border-primary/20' : 'bg-muted/20'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{criteria.icon}</span>
                        <h4 className="font-bold">{criteria.title}</h4>
                        {isCritical && (
                          <Badge className="bg-primary/20 text-primary text-[10px]">Önemli</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{criteria.description}</p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleStarClick(criteria.key, star)}
                          className="transition-transform hover:scale-110"
                        >
                          {getStarIcon(rating, star - 1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  {rating > 0 && (
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(rating / 5) * 100}%` }}
                        className={`h-full rounded-full ${
                          rating >= 4 ? 'bg-green-500' :
                          rating >= 3 ? 'bg-blue-500' :
                          rating >= 2 ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Would Recommend */}
          <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Diğer escortlara önerir misiniz?</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={formData.wouldRecommend ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, wouldRecommend: true })}
                >
                  Evet
                </Button>
                <Button
                  variant={!formData.wouldRecommend ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, wouldRecommend: false })}
                >
                  Hayır
                </Button>
              </div>
            </div>
          </div>

          {/* Low Rating Warning Alert */}
          {shouldSuggestWarning && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-red-700 dark:text-red-400 mb-1">
                    Dikkat: Problemli Müşteri
                  </p>
                  <p className="text-red-600 dark:text-red-300">
                    Bu müşteride bazı sorunlar tespit edildi. Sonraki adımda diğer escortları uyarabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep('start')}>
              İptal
            </Button>
            <Button
              className="flex-1"
              onClick={() => shouldSuggestWarning ? setStep('warning') : setStep('comment')}
            >
              Devam Et
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'warning') {
    return (
      <Card className="max-w-2xl mx-auto border-orange-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="w-5 h-5" />
            Müşteri Uyarısı Oluştur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <p className="text-sm text-orange-700 dark:text-orange-400">
              Bu müşteride sorun tespit ettiniz. Diğer escortları uyarmak ister misiniz?
              Uyarınız anonim kalacak ve diğer escortlar onaylayabilecek.
            </p>
          </div>

          {/* Warning Type Selection */}
          <div>
            <label className="text-sm font-semibold mb-3 block">Uyarı Türü Seçin</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(WARNING_TYPE_CONFIG).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => setFormData({
                    ...formData,
                    createWarning: true,
                    warningType: type as CustomerWarning['warningType']
                  })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.warningType === type
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-border hover:border-orange-500/50 bg-muted/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{config.icon}</span>
                    <span className="font-bold text-sm">{config.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Skip Option */}
          <div className="p-4 bg-muted/20 rounded-lg">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                checked={!formData.createWarning}
                onChange={() => setFormData({
                  ...formData,
                  createWarning: false,
                  warningType: undefined
                })}
                className="w-5 h-5 rounded border-border mt-0.5 flex-shrink-0"
              />
              <span className="text-sm">
                <span className="font-semibold">Uyarı oluşturmak istemiyorum</span>
                <p className="text-muted-foreground mt-1">
                  Müşteri ile ilgili uyarı oluşturmadan devam et
                </p>
              </span>
            </label>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep('rating')}>
              Geri
            </Button>
            <Button className="flex-1" onClick={() => setStep('comment')}>
              Devam Et
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'comment') {
    const wordCount = formData.comment.trim().split(/\s+/).filter(w => w.length > 0).length;

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-pink-500" />
            Yorumunuzu Paylaşın
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comment */}
          <div>
            <label className="text-sm font-semibold mb-2 block">
              Deneyiminizi yazın <span className="text-muted-foreground">(Opsiyonel)</span>
            </label>
            <Textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Randevu nasıl geçti? Müşteri hakkında diğer escortların bilmesi gerekenler neler?..."
              className="min-h-[150px]"
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">{wordCount} / 500 kelime</p>
              {wordCount >= 50 && (
                <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                  Detaylı yorum bonusu!
                </Badge>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Etiketler (Opsiyonel)</label>
            <div className="flex flex-wrap gap-2">
              {[
                'Zamanında',
                'Kibar',
                'Temiz',
                'Güvenilir Ödeme',
                'Saygılı',
                'Anlayışlı',
                'Profesyonel',
                'Güler yüzlü',
                'İyi iletişim',
                'Tavsiye ederim'
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const currentTags = formData.tags || [];
                    if (currentTags.includes(tag)) {
                      setFormData({
                        ...formData,
                        tags: currentTags.filter(t => t !== tag)
                      });
                    } else {
                      setFormData({
                        ...formData,
                        tags: [...currentTags, tag]
                      });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    (formData.tags || []).includes(tag)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/70'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="font-bold text-sm mb-3">Değerlendirmeniz Özeti</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Genel Puan:</span>
                <span className="font-bold">{overallRating > 0 ? overallRating.toFixed(1) : '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Öneri:</span>
                <span className="font-bold">{formData.wouldRecommend ? 'Evet' : 'Hayır'}</span>
              </div>
              {formData.warningType && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Uyarı:</span>
                    <span className="font-bold text-orange-600">
                      {WARNING_TYPE_CONFIG[formData.warningType].label}
                    </span>
                  </div>
                </>
              )}
            </div>
            {formData.overallRating > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 p-3 bg-background rounded-lg"
              >
                <p className="text-xs text-muted-foreground">
                  Bu değerlendirme {customerName} güven skorunu etkileyecektir.
                </p>
              </motion.div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep('warning')}>
              Geri
            </Button>
            <Button className="flex-1" onClick={() => setStep('confirm')}>
              Önizle
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'confirm') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Değerlendirmenizi Onaylayın
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Info */}
          <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
            {customerAvatar && (
              <img
                src={customerAvatar}
                alt={customerName}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-bold">{customerName}</p>
              <p className="text-sm text-muted-foreground">{new Date(bookingDate).toLocaleDateString('tr-TR')}</p>
            </div>
          </div>

          {/* Rating Summary */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm">Puanlarınız</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">⏰ Zamanlama</span>
                  <span className="font-bold">{formData.punctuality > 0 ? formData.punctuality : '-'}</span>
                </div>
                {formData.punctuality > 0 && (
                  <div className="h-1 bg-blue-500/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(formData.punctuality / 5) * 100}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="p-3 bg-cyan-500/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">🧼 Bakım</span>
                  <span className="font-bold">{formData.personalHygiene > 0 ? formData.personalHygiene : '-'}</span>
                </div>
                {formData.personalHygiene > 0 && (
                  <div className="h-1 bg-cyan-500/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500"
                      style={{ width: `${(formData.personalHygiene / 5) * 100}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">🤝 Saygı</span>
                  <span className="font-bold">{formData.respect > 0 ? formData.respect : '-'}</span>
                </div>
                {formData.respect > 0 && (
                  <div className="h-1 bg-purple-500/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${(formData.respect / 5) * 100}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">💰 Ödeme</span>
                  <span className="font-bold">{formData.payment > 0 ? formData.payment : '-'}</span>
                </div>
                {formData.payment > 0 && (
                  <div className="h-1 bg-green-500/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${(formData.payment / 5) * 100}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">😊 Davranış</span>
                  <span className="font-bold">{formData.behavior > 0 ? formData.behavior : '-'}</span>
                </div>
                {formData.behavior > 0 && (
                  <div className="h-1 bg-amber-500/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${(formData.behavior / 5) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg flex items-center justify-between">
              <span className="text-sm font-semibold">Genel Puan</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => getStarIcon(overallRating, star - 1))}
                <span className="text-xl font-bold">{overallRating > 0 ? overallRating.toFixed(1) : '-'}</span>
              </div>
            </div>
          </div>

          {/* Comment */}
          {formData.comment && (
            <div>
              <h4 className="font-bold text-sm mb-2">Yorumunuz</h4>
              <p className="text-sm bg-muted/20 p-3 rounded-lg">{formData.comment}</p>
            </div>
          )}

          {/* Tags */}
          {formData.tags && formData.tags.length > 0 && (
            <div>
              <h4 className="font-bold text-sm mb-2">Etiketler</h4>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Would Recommend */}
          <div className={`p-3 rounded-lg flex items-center justify-between ${
            formData.wouldRecommend
              ? 'bg-green-500/10 text-green-700'
              : 'bg-gray-500/10 text-gray-700'
          }`}>
            <span className="text-sm font-semibold">Diğer escortlara öneri:</span>
            <span className="font-bold">{formData.wouldRecommend ? 'Evet ✓' : 'Hayır'}</span>
          </div>

          {/* Warning Notice */}
          {formData.createWarning && formData.warningType && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-orange-700 dark:text-orange-400 mb-1">
                    Müşteri Uyarısı Oluşturulacak
                  </p>
                  <p className="text-orange-600 dark:text-orange-300">
                    {WARNING_TYPE_CONFIG[formData.warningType].label} türünde uyarı gönderilecek.
                    Diğer escortlar bu uyarıyı görebilecek ve onaylayabilecek.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Impact Notice */}
          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">
                  Değerlendirmenizin Etkisi
                </p>
                <ul className="text-blue-600 dark:text-blue-300 space-y-1 text-xs">
                  <li>• {customerName} güven skorunu günceller</li>
                  <li>• Diğer escortlar bu değeri görebilecek</li>
                  <li>• {overallRating >= 4.5 ? '+30 puan kazanırsınız' : '+15 puan kazanırsınız'}</li>
                  <li>• Detaylı yorum (50+ kelime): Ekstra +20 puan</li>
                  {formData.createWarning && (
                    <li>• Müşteri uyarısı topluluğu koruyacak</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep('comment')}>
              Düzenle
            </Button>
            <Button className="flex-1" onClick={handleSubmit}>
              <Send className="w-4 h-4 mr-2" />
              Gönder
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}

// Customer Reputation Display Component
export function CustomerReputationBadge({
  rating,
  reviewCount,
  warningCount = 0
}: {
  rating: number;
  reviewCount: number;
  warningCount?: number;
}) {
  const getReputationLevel = () => {
    if (warningCount >= 3) return { label: 'Riskli', color: 'text-red-600', bg: 'bg-red-500/20', icon: '⚠️' };
    if (warningCount >= 1) return { label: 'Dikkat', color: 'text-orange-600', bg: 'bg-orange-500/20', icon: '⚡' };
    if (reviewCount < 3) return { label: 'Yeni', color: 'text-gray-500', bg: 'bg-gray-500/20', icon: '🌱' };
    if (rating >= 4.5) return { label: 'Mükemmel', color: 'text-green-600', bg: 'bg-green-500/20', icon: '🏆' };
    if (rating >= 4) return { label: 'Güvenilir', color: 'text-blue-600', bg: 'bg-blue-500/20', icon: '⭐' };
    if (rating >= 3) return { label: 'Orta', color: 'text-amber-600', bg: 'bg-amber-500/20', icon: '📊' };
    return { label: 'Zayıf', color: 'text-red-600', bg: 'bg-red-500/20', icon: '📉' };
  };

  const reputation = getReputationLevel();

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${reputation.bg}`}>
      <span>{reputation.icon}</span>
      <span className={`text-xs font-bold ${reputation.color}`}>{reputation.label}</span>
      {rating > 0 && (
        <>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold">{rating.toFixed(1)}</span>
          </div>
        </>
      )}
      {reviewCount > 0 && (
        <>
          <span className="text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{reviewCount} değerlendirme</span>
        </>
      )}
    </div>
  );
}
