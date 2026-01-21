/**
 * Reviews Page
 *
 * Complete review system with multi-criteria ratings and filtering.
 * Features review submission, management, and statistics.
 *
 * @module pages/Reviews
 * @category Pages - Public
 *
 * Features:
 * - Multi-criteria rating system (5 criteria)
 * - Photo uploads with moderation
 * - Tag-based categorization
 * - Verified booking badges
 * - Helpful voting system
 * - Response from escorts
 * - Advanced filtering and sorting
 * - Review statistics and distribution
 *
 * @example
 * ```tsx
 * // Route: /reviews?escortId=escort-123
 * <Reviews />
 * ```
 */

import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReviewsPanel } from '@/components/ReviewsPanel';
import { ReviewForm } from '@/components/ReviewForm';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { Rating } from '@/components/Rating';
import {
  Star,
  Plus,
  Shield,
  TrendingUp,
  Award,
  ChevronLeft,
  MessageSquare,
  Heart,
  Eye,
  ThumbsUp,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Review stat card
 */
interface ReviewStat {
  icon: React.ElementType;
  value: string | number;
  label: string;
  color: string;
}

export default function Reviews() {
  const { userRole, user, isAuthenticated } = useAuth();
  const isEscort = userRole === 'escort' || userRole === 'admin';
  const [escortId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'received' | 'written' | 'all'>('all');

  const {
    reviews,
    stats,
    isLoading,
    loadMoreReviews,
    submitReview,
    setFilters,
    sortReviews,
  } = useReviews({
    escortId: escortId || undefined,
    autoRefresh: false,
  });

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedEscortId, setSelectedEscortId] = useState<string | null>(null);

  // Mock escorts for demo
  const mockEscorts = [
    { id: 'escort-1', name: 'Ayşe Yılmaz', rating: 4.8, reviewCount: 24 },
    { id: 'escort-2', name: 'Zeynep Demir', rating: 4.5, reviewCount: 18 },
    { id: 'escort-3', name: 'Elif Kaya', rating: 4.9, reviewCount: 32 },
  ];

  // Role-based quick stats
  const quickStats = useMemo<ReviewStat[]>(() => {
    if (isEscort) {
      return [
        { icon: Star, value: stats.average, label: 'Ortalama Puan', color: 'bg-yellow-500/20 text-yellow-600' },
        { icon: MessageSquare, value: stats.total, label: 'Toplam Değerlendirme', color: 'bg-blue-500/20 text-blue-600' },
        { icon: TrendingUp, value: `+${stats.lastMonthCount}`, label: 'Bu Ay', color: 'bg-green-500/20 text-green-600' },
        { icon: Eye, value: stats.verifiedCount, label: 'Onaylı Randevu', color: 'bg-purple-500/20 text-purple-600' },
      ];
    } else {
      return [
        { icon: Star, value: '12', label: 'Yazılan Değerlendirme', color: 'bg-yellow-500/20 text-yellow-600' },
        { icon: Heart, value: '24', label: 'Favori Escort', color: 'bg-red-500/20 text-red-600' },
        { icon: Award, value: '8', label: 'VIP Değerlendirme', color: 'bg-purple-500/20 text-purple-600' },
        { icon: ThumbsUp, value: '45', label: 'Faydalı Oy', color: 'bg-green-500/20 text-green-600' },
      ];
    }
  }, [isEscort, stats]);

  // Handle review submission
  const handleSubmitReview = async (reviewData: any) => {
    await submitReview(reviewData);
    setShowReviewModal(false);
    // Auto refresh will update the reviews
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
        <div className="container py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
                  DEĞERLENDİRMELER
                </h1>
                <Badge variant="outline" className={isEscort ? 'bg-purple-500/10 text-purple-600 border-purple-500/30' : 'bg-blue-500/10 text-blue-600 border-blue-500/30'}>
                  <Shield className="w-3 h-3 mr-1" />
                  {isEscort ? 'Escort Paneli' : 'Müşteri Paneli'}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {isEscort
                  ? 'Hakkınızdaki değerlendirmeleri görün ve yanıt verin'
                  : 'Gerçek kullanıcı deneyimlerini okuyun ve değerlendirme yazın'}
              </p>
            </div>

            {/* Role-specific action button */}
            {!isEscort && isAuthenticated && (
              <Button
                onClick={() => setShowReviewModal(true)}
                className="bg-gradient-to-r from-primary to-accent"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Değerlendirme
              </Button>
            )}
          </div>

          {/* Quick Stats - Role Based */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat) => (
              <Card key={stat.label} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* Role-specific tabs for authenticated users */}
        {isAuthenticated && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-8">
            <TabsList>
              <TabsTrigger value="all">
                Tümü
              </TabsTrigger>
              {isEscort ? (
                <TabsTrigger value="received">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Aldığım
                </TabsTrigger>
              ) : (
                <TabsTrigger value="written">
                  <Star className="w-4 h-4 mr-2" />
                  Yazdığım
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        )}

        {/* For customers: Select Escort Section */}
        {!isEscort && !escortId && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Değerlendirebileceğiniz Escortlar</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockEscorts.map((escort) => (
                <motion.div
                  key={escort.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-xl">
                        {escort.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{escort.name}</h3>
                        <div className="flex items-center gap-2">
                          <Rating value={escort.rating} readonly size="sm" />
                          <span className="text-sm text-muted-foreground">
                            ({escort.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                    {isAuthenticated ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setSelectedEscortId(escort.id);
                          setShowReviewModal(true);
                        }}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Değerlendir
                      </Button>
                    ) : (
                      <Link href="/login-client">
                        <Button variant="outline" className="w-full">
                          Değerlendirmek için Giriş Yapın
                        </Button>
                      </Link>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Panel */}
        <ReviewsPanel
          reviews={reviews}
          stats={stats}
          isLoading={isLoading}
          hasMore={false}
          onLoadMore={loadMoreReviews}
          onFilter={setFilters}
          onSort={sortReviews}
          userRole={userRole}
        />
      </div>

      {/* Review Modal - Customer only */}
      {!isEscort && (
        <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Değerlendirme Yaz
              </DialogTitle>
            </DialogHeader>

            <ReviewForm
              escortId={selectedEscortId || mockEscorts[0].id}
              escortName={mockEscorts.find(e => e.id === selectedEscortId)?.name || mockEscorts[0].name}
              isVerifiedBooking={true}
              onSubmit={handleSubmitReview}
              onCancel={() => setShowReviewModal(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export { Reviews };
