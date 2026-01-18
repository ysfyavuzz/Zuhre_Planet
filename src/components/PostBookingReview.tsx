/**
 * PostBookingReview Component
 * 
 * Post-appointment review form for customers to rate their experience.
 * Simplified review process immediately after booking completion.
 * 
 * @module components/PostBookingReview
 * @category Components - Reviews
 * 
 * Features:
 * - Quick star rating (1-5)
 * - Multi-category ratings (cleanliness, service, attitude, location)
 * - Optional text comment
 * - "Would return" recommendation toggle
 * - Emoji feedback indicators
 * - Fast submission process
 * - Mobile-optimized interface
 * 
 * Rating Categories:
 * - Overall satisfaction
 * - Cleanliness
 * - Service quality
 * - Attitude/professionalism
 * - Location/venue
 * - Would return (yes/no)
 * 
 * @example
 * ```tsx
 * <PostBookingReview
 *   bookingId="booking-123"
 *   escortId="escort-456"
 *   escortName="Ayşe Y."
 *   onSubmit={(review) => console.log(review)}
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
  CheckCircle2, Send, Clock, Calendar, Heart,
  Shield, TrendingUp
} from 'lucide-react';

/**
 * Review form data structure
 */
export interface ReviewFormData {
  overallRating: number; // 1-5 yıldız
  cleanliness: number; // 1-5
  serviceQuality: number; // 1-5
  attitude: number; // 1-5
  location: number; // 1-5
  wouldReturn: boolean;
  comment: string;
  tags?: string[];
}

interface PostBookingReviewProps {
  bookingId: string;
  escortId: string;
  escortName: string;
  escortAvatar?: string;
  bookingDate: Date;
  onSubmit: (review: ReviewFormData) => void;
  currentRating?: number;
  onRatingCalculated?: (newRating: number) => void;
}

export function PostBookingReview({
  bookingId,
  escortId,
  escortName,
  escortAvatar,
  bookingDate,
  onSubmit,
  currentRating = 0,
  onRatingCalculated
}: PostBookingReviewProps) {
  const [step, setStep] = useState<'start' | 'rating' | 'comment' | 'confirm'>('start');
  const [formData, setFormData] = useState<ReviewFormData>({
    overallRating: 0,
    cleanliness: 0,
    serviceQuality: 0,
    attitude: 0,
    location: 0,
    wouldReturn: false,
    comment: ''
  });

  const [hoveredRating, setHoveredRating] = useState(0);

  const criteriaConfig = [
    {
      key: 'cleanliness' as const,
      icon: '🧼',
      title: 'Temizlik ve Hijyen',
      description: 'Mekânın temizliği, escortın kişisel hijyeni',
      color: 'blue'
    },
    {
      key: 'serviceQuality' as const,
      icon: '💆',
      title: 'Hizmet Kalitesi',
      description: 'Hizmetin beklentileri karşılaması',
      color: 'purple'
    },
    {
      key: 'attitude' as const,
      icon: '😊',
      title: 'Tutum ve Davranış',
      description: 'Naziklik, profesyonellik, samimiyet',
      color: 'pink'
    },
    {
      key: 'location' as const,
      icon: '🏠',
      title: 'Mekân Konforu',
      description: 'Mekânın rahatlığı, güvenliği',
      color: 'amber'
    }
  ];

  const calculateOverallRating = () => {
    const ratings = [formData.cleanliness, formData.serviceQuality, formData.attitude, formData.location];
    const validRatings = ratings.filter(r => r > 0);
    if (validRatings.length === 0) return 0;
    return validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length;
  };

  const overallRating = formData.overallRating || calculateOverallRating();

  const handleStarClick = (criteria: keyof ReviewFormData, rating: number) => {
    setFormData(prev => ({ ...prev, [criteria]: rating }));
  };

  const handleSubmit = () => {
    if (overallRating < 1) {
      alert('Lütfen en az bir kriteri değerlendirin.');
      return;
    }

    // Yeni ortalamayı hesapla ve bildir
    if (onRatingCalculated) {
      const newAverage = ((currentRating * (currentRating > 0 ? 1 : 0)) + overallRating) / (currentRating > 0 ? 2 : 1);
      onRatingCalculated(Math.round(newAverage * 10) / 10);
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
    if (rating >= 4.5) return { icon: <Sparkles className="w-6 h-6" />, color: 'text-green-500', label: 'Mükemmel' };
    if (rating >= 4) return { icon: <Smile className="w-6 h-6" />, color: 'text-blue-500', label: 'İyi' };
    if (rating >= 3) return { icon: <Meh className="w-6 h-6" />, color: 'text-amber-500', label: 'Orta' };
    if (rating >= 2) return { icon: <Frown className="w-6 h-6" />, color: 'text-orange-500', label: 'Zayıf' };
    return { icon: <Frown className="w-6 h-6" />, color: 'text-red-500', label: 'Çok Kötü' };
  };

  if (step === 'start') {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Randevunuz Tamamlandı!</h3>
          <p className="text-muted-foreground mb-6">
            Deneyiminizi paylaşarak {escortName}'ın profilini geliştirmeye yardım edin.
          </p>
          <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-background rounded-lg">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Tarih</p>
              <p className="font-semibold">{new Date(bookingDate).toLocaleDateString('tr-TR')}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Escort</p>
              <p className="font-semibold">{escortName}</p>
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
            Randevunuzu Değerlendirin
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
              Aşağıdaki kritereleri detaylı şekilde puanlayın
            </p>

            {criteriaConfig.map((criteria) => {
              const rating = formData[criteria.key];
              return (
                <div key={criteria.key} className="p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{criteria.icon}</span>
                        <h4 className="font-bold">{criteria.title}</h4>
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
                    <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(rating / 5) * 100}%` }}
                        className={`h-full bg-${criteria.color}-500`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Would Return */}
          <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Tekrar randevu alır mısınız?</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={formData.wouldReturn ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, wouldReturn: true })}
                >
                  Evet
                </Button>
                <Button
                  variant={!formData.wouldReturn ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, wouldReturn: false })}
                >
                  Hayır
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep('start')}>
              İptal
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
            <Heart className="w-5 h-5 text-pink-500" />
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
              placeholder="Randevunuz nasıl geçti? Deneyiminizi paylaşın..."
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
                'Profesyonel',
                'Samimi',
                'Güler yüzlü',
                'Zamanında',
                'Temiz',
                'Konforlu',
                'Kaliteli',
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
                <span className="text-muted-foreground">Tekrar:</span>
                <span className="font-bold">{formData.wouldReturn ? 'Evet' : 'Hayır'}</span>
              </div>
            </div>
            {formData.overallRating > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 p-3 bg-background rounded-lg"
              >
                <p className="text-xs text-muted-foreground">
                  Bu değerlendirme {escortName}'ın genel puanını etkileyecektir.
                </p>
              </motion.div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep('rating')}>
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
          {/* Escort Info */}
          <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
            {escortAvatar && (
              <img
                src={escortAvatar}
                alt={escortName}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-bold">{escortName}</p>
              <p className="text-sm text-muted-foreground">{new Date(bookingDate).toLocaleDateString('tr-TR')}</p>
            </div>
          </div>

          {/* Rating Summary */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm">Puanlarınız</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">🧼 Temizlik</span>
                  <span className="font-bold">{formData.cleanliness > 0 ? formData.cleanliness : '-'}</span>
                </div>
                {formData.cleanliness > 0 && (
                  <div className="h-1 bg-blue-500/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(formData.cleanliness / 5) * 100}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">💆 Hizmet</span>
                  <span className="font-bold">{formData.serviceQuality > 0 ? formData.serviceQuality : '-'}</span>
                </div>
                {formData.serviceQuality > 0 && (
                  <div className="h-1 bg-purple-500/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${(formData.serviceQuality / 5) * 100}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="p-3 bg-pink-500/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">😊 Tutum</span>
                  <span className="font-bold">{formData.attitude > 0 ? formData.attitude : '-'}</span>
                </div>
                {formData.attitude > 0 && (
                  <div className="h-1 bg-pink-500/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500"
                      style={{ width: `${(formData.attitude / 5) * 100}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">🏠 Mekân</span>
                  <span className="font-bold">{formData.location > 0 ? formData.location : '-'}</span>
                </div>
                {formData.location > 0 && (
                  <div className="h-1 bg-amber-500/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${(formData.location / 5) * 100}%` }}
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

          {/* Would Return */}
          <div className={`p-3 rounded-lg flex items-center justify-between ${
            formData.wouldReturn
              ? 'bg-green-500/10 text-green-700'
              : 'bg-gray-500/10 text-gray-700'
          }`}>
            <span className="text-sm font-semibold">Tekrar randevu:</span>
            <span className="font-bold">{formData.wouldReturn ? 'Evet ✓' : 'Hayır'}</span>
          </div>

          {/* Impact Notice */}
          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">
                  Değerlendirmenizin Etkisi
                </p>
                <ul className="text-blue-600 dark:text-blue-300 space-y-1 text-xs">
                  <li>• {escortName}'ın genel puanını günceller</li>
                  <li>• Gelecek müşteriler için referans olur</li>
                  <li>• {overallRating >= 4.5 ? '+30 puan kazanırsınız' : '+15 puan kazanırsınız'}</li>
                  <li>• Detaylı yorum (50+ kelime): Ekstra +20 puan</li>
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

// Rating Display Component
export function RatingDisplay({
  rating,
  reviewCount,
  size = 'sm'
}: {
  rating: number;
  reviewCount: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className={`font-bold ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>
        {rating.toFixed(1)}
      </span>
      <span className={`text-muted-foreground ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
        ({reviewCount} değerlendirme)
      </span>
    </div>
  );
}

// Review Card Component
export function ReviewCard({ review }: { review: any }) {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <RatingDisplay rating={review.rating} reviewCount={1} size="sm" />
              <span className="text-xs text-muted-foreground">
                {new Date(review.date).toLocaleDateString('tr-TR')}
              </span>
            </div>
            <p className="text-sm font-semibold">{review.customerName}</p>
          </div>
          {review.verified && (
            <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs">
              ✓ Doğrulanmış
            </Badge>
          )}
        </div>

        <p className="text-sm mb-3">{review.comment}</p>

        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {review.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {review.response && (
          <div className="mt-3 p-3 bg-primary/5 rounded-lg">
            <p className="text-xs font-semibold text-primary mb-1">Escort Yanıtı:</p>
            <p className="text-sm text-muted-foreground">{review.response.text}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
