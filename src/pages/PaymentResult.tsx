/**
 * Payment Result Page
 * 
 * Displays payment success or error status after a transaction.
 * Handles both successful and failed payment scenarios with appropriate feedback.
 * Provides next steps and support options based on payment outcome.
 * 
 * @module pages/PaymentResult
 * @category Pages - Payment
 * 
 * Features:
 * - Success/Error states based on query parameter (?status=success|error)
 * - Confetti animation for successful payments
 * - Transaction details display
 * - Next steps and action buttons
 * - Error handling with retry option
 * - Support contact for failed payments
 * - Order summary information
 * - Downloadable invoice/receipt option
 * - Redirect to dashboard/home
 * - Responsive design with animations
 * - Email confirmation notice
 * 
 * Query Parameters:
 * - status: "success" | "error" - Payment outcome
 * - orderId: Optional transaction ID
 * - amount: Optional payment amount
 * 
 * @example
 * ```tsx
 * // Route: /payment-result?status=success
 * // Route: /payment-result?status=error
 * <PaymentResult />
 * ```
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  fadeInUp, 
  scaleIn, 
  pageTransition,
  bounce,
} from '@/lib/animations';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Download,
  Mail,
  Home,
  RotateCcw,
  HeadphonesIcon,
  AlertCircle,
  Sparkles,
  Receipt,
  CreditCard,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';

// Confetti component for success animation
const Confetti = () => {
  const confettiCount = 50;
  const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: confettiCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 20,
            opacity: 0,
            rotate: Math.random() * 720 - 360,
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

export default function PaymentResult() {
  const [location] = useLocation();
  const [showConfetti, setShowConfetti] = useState(false);

  // Parse query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const status = searchParams.get('status') || 'success'; // Default to success for demo
  const orderId = searchParams.get('orderId') || `ORD-${Date.now()}`;
  const amount = searchParams.get('amount') || '149.00';

  const isSuccess = status === 'success';

  // Show confetti on success
  useEffect(() => {
    if (isSuccess) {
      setShowConfetti(true);
      // Hide confetti after 4 seconds
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  // Success content
  const SuccessContent = () => (
    <motion.div
      {...pageTransition}
      className="min-h-screen bg-background py-20 flex items-center justify-center"
    >
      {showConfetti && <Confetti />}

      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div variants={scaleIn} className="text-center mb-8">
          {/* Success Icon */}
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl" />
              <div className="relative bg-green-500/10 p-6 rounded-full">
                <CheckCircle2 className="w-20 h-20 text-green-500" />
              </div>
            </div>
          </motion.div>

          {/* Success Badge */}
          <motion.div
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <Badge className="mb-4 px-4 py-1.5 bg-green-500/10 text-green-500 border-green-500/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Ödeme Başarılı
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Ödemeniz Tamamlandı!
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-lg max-w-md mx-auto"
          >
            Ödemeniz başarıyla işlendi. Sipariş detaylarınız e-posta adresinize gönderildi.
          </motion.p>
        </motion.div>

        {/* Transaction Details Card */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-2 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                İşlem Detayları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sipariş No</span>
                <span className="font-mono font-semibold">{orderId}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tutar</span>
                <span className="text-2xl font-bold text-green-500">₺{amount}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Ödeme Yöntemi</span>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="font-medium">Kredi Kartı</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tarih</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Notice */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.7 }}
          className="mb-6"
        >
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-500 mb-1">
                E-posta Onayı Gönderildi
              </p>
              <p className="text-sm text-muted-foreground">
                Sipariş detaylarınız ve fatura bilgileriniz kayıtlı e-posta adresinize gönderilmiştir.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full">
              <Home className="w-5 h-5 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </Link>
          <Button size="lg" className="w-full">
            <Download className="w-5 h-5 mr-2" />
            Faturayı İndir
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );

  // Error content
  const ErrorContent = () => (
    <motion.div
      {...pageTransition}
      className="min-h-screen bg-background py-20 flex items-center justify-center"
    >
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div variants={scaleIn} className="text-center mb-8">
          {/* Error Icon */}
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
              <div className="relative bg-red-500/10 p-6 rounded-full">
                <XCircle className="w-20 h-20 text-red-500" />
              </div>
            </div>
          </motion.div>

          {/* Error Badge */}
          <motion.div
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <Badge className="mb-4 px-4 py-1.5 bg-red-500/10 text-red-500 border-red-500/20">
              <AlertCircle className="w-4 h-4 mr-2" />
              Ödeme Başarısız
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Ödeme Tamamlanamadı
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-lg max-w-md mx-auto"
          >
            Ödemeniz işlenirken bir hata oluştu. Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın.
          </motion.p>
        </motion.div>

        {/* Error Reasons Card */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-2 border-red-500/20 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <AlertCircle className="w-5 h-5" />
                Olası Nedenler
              </CardTitle>
              <CardDescription>
                Ödemenizin başarısız olmasının olası sebepleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  Yetersiz bakiye veya kredi kartı limiti
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  Hatalı kart bilgileri (numara, CVV, son kullanma tarihi)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  3D Secure doğrulamasının tamamlanmaması
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  Banka tarafından işlemin reddedilmesi
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  Geçici sistem veya bağlantı hatası
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Support Notice */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.7 }}
          className="mb-6"
        >
          <div className="flex items-start gap-3 p-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
            <HeadphonesIcon className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-sky-500 mb-1">
                Yardıma mı ihtiyacınız var?
              </p>
              <p className="text-sm text-muted-foreground">
                Ödeme işleminizde sorun yaşıyorsanız, destek ekibimiz size yardımcı olmaktan mutluluk duyar.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <Button variant="outline" size="lg" className="w-full">
            <RotateCcw className="w-5 h-5 mr-2" />
            Tekrar Dene
          </Button>
          <Link href="/contact">
            <Button size="lg" className="w-full">
              <HeadphonesIcon className="w-5 h-5 mr-2" />
              Destek Al
            </Button>
          </Link>
        </motion.div>

        {/* Return Home Link */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.9 }}
          className="text-center mt-6"
        >
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );

  return isSuccess ? <SuccessContent /> : <ErrorContent />;
}
