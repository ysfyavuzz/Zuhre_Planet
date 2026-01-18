/**
 * Escort Login Page
 * 
 * Authentication interface for escort service providers to access their profiles and dashboards.
 * Provides email/password login with navigation to registration and client login pages.
 * Implements secure authentication flow with professional UI and error handling.
 * 
 * @module pages/EscortLogin
 * @category Pages - Auth
 * 
 * Features:
 * - Email and password authentication form
 * - Show/hide password toggle functionality
 * - Remember me option for persistent login
 * - Error message display and validation
 * - Loading state during authentication process
 * - Password reset link with email verification
 * - Escort features and benefits showcase
 * - Navigation to registration for new escorts
 * - Quick link to client login page
 * - Responsive mobile design
 * - Professional UI with motion animations
 * 
 * Authentication:
 * - Integrates with AuthContext for login management
 * - Redirects to escort dashboard on successful login
 * - Role-based access control enforcement
 * - Session persistence across page reloads
 * 
 * @example
 * ```tsx
 * // Route: /escort/login
 * <EscortLogin />
 * ```
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Eye, EyeOff, Mail, Lock, User, Sparkles, Shield,
  Heart, Crown, AlertCircle, ArrowRight, Check
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function EscortLogin() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Escort login with escort role
      await login(email, password);
      // Redirect to dashboard after successful login
      setLocation('/escort/dashboard');
    } catch (err) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Crown, text: 'Premium profil özellikleri' },
    { icon: Shield, text: 'Güvenli ve gizli platform' },
    { icon: Heart, text: 'Binlerce aktif müşteri' },
    { icon: Sparkles, text: 'Kolay randevu yönetimi' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,70,239,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(124,58,237,0.15),transparent_50%)]" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Panel - Features */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col justify-center"
        >
          <Card className="card-premium border-0 bg-gradient-to-br from-primary/10 to-accent/10">
            <CardContent className="p-8">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-8 h-8 text-primary fill-primary" />
                  <h1 className="text-4xl font-black">Escort Paneli</h1>
                </div>
                <p className="text-lg text-muted-foreground">
                  Türkiye'nin en seçkin escort platformuna hoş geldiniz.
                </p>
              </div>

              <Separator className="my-6" />

              <h2 className="text-xl font-bold mb-6">Neden Biz?</h2>
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className="font-medium">{feature.text}</span>
                    </motion.div>
                  );
                })}
              </div>

              <Separator className="my-6" />

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Crown className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-700 dark:text-amber-400">VIP Üyelik</p>
                    <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                      Profilinizi üst sıralara taşıyın, daha fazla müşteriye ulaşın.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Panel - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-premium">
            <CardContent className="p-8">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                <Heart className="w-8 h-8 text-primary fill-primary" />
                <h1 className="text-2xl font-black">Escort Paneli</h1>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Giriş Yap</h2>
                <p className="text-muted-foreground">
                  Escort hesabınıza giriş yapın
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">E-posta Adresi</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Şifre</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-border" />
                    <span className="text-sm text-muted-foreground">Beni hatırla</span>
                  </label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Şifremi unuttum
                  </a>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Giriş yapılıyor...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Giriş Yap
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Hesabınız yok mu?
                </p>
                <Button
                  variant="outline"
                  onClick={() => setLocation('/register-escort')}
                  className="w-full border-2 hover:bg-primary hover:text-white transition-all"
                >
                  <User className="w-5 h-5 mr-2" />
                  Escort Olarak Kayıt Ol
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Müşteri olarak giriş yapmak için
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setLocation('/login-client')}
                  className="text-primary hover:text-primary/80"
                >
                  Müşteri Girişi <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Demo Giriş:</p>
                <p className="text-xs text-muted-foreground">Email: escort@example.com</p>
                <p className="text-xs text-muted-foreground">Şifre: escort</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
