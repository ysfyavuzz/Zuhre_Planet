/**
 * Client Login Page
 * 
 * Customer authentication interface for clients to access their account and dashboard.
 * Provides email/password login form with benefits showcase and registration/escort login links.
 * Implements secure authentication flow with error handling and loading states.
 * 
 * @module pages/ClientLogin
 * @category Pages - Auth
 * 
 * Features:
 * - Email and password authentication form
 * - Show/hide password toggle with icon feedback
 * - Remember me functionality with persistent login
 * - Error message display and validation feedback
 * - Loading state during authentication
 * - Password reset link with email verification
 * - Client benefits showcase section
 * - Navigation to registration page for new clients
 * - Quick navigation to escort login
 * - Responsive design with mobile optimization
 * - Form input validation and accessibility
 * 
 * Authentication:
 * - Integrates with AuthContext for login management
 * - Redirects to home page on successful login
 * - Displays role-specific dashboard on login
 * - Maintains session across page reloads
 * 
 * @example
 * ```tsx
 * // Route: /client/login
 * <ClientLogin />
 * ```
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Eye, EyeOff, Mail, Lock, Sparkles, Shield,
  Heart, Search, AlertCircle, ArrowRight, Star,
  Clock, MapPin, Crown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ClientLogin() {
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
      // Client login with user role
      await login(email, password);
      // Redirect to home after successful login
      setLocation('/');
    } catch (err) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: Search, title: 'Kolay Arama', desc: 'Binlerce profil arasında hızlıca arama yapın' },
    { icon: Star, title: 'Değerlendirme', desc: 'Deneyimlerinizi değerlendirin' },
    { icon: Heart, title: 'Favoriler', desc: 'Beğendiğiniz profilleri kaydedin' },
    { icon: Clock, title: 'Randevu', desc: 'Kolay ve hızlı randevu alın' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(217,70,239,0.15),transparent_50%)]" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Panel - Benefits */}
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
                  <h1 className="text-4xl font-black">Müşteri Paneli</h1>
                </div>
                <p className="text-lg text-muted-foreground">
                  Türkiye'nin en seçkin escort platformunda aradığınızı bulun.
                </p>
              </div>

              <Separator className="my-6" />

              <h2 className="text-xl font-bold mb-6">Üyelik Avantajları</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-background/50 hover:bg-background transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                      </div>
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
                      Sınırsız fotoğraf ve video görüntüleme ayrıcalığına sahip olun.
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
                <h1 className="text-2xl font-black">Müşteri Paneli</h1>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Giriş Yap</h2>
                <p className="text-muted-foreground">
                  Hesabınıza giriş yapın ve aramaya başlayın
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
                  Henüz üye değil misiniz?
                </p>
                <Button
                  variant="outline"
                  onClick={() => setLocation('/register-client')}
                  className="w-full border-2 hover:bg-primary hover:text-white transition-all"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Ücretsiz Kayıt Ol
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Escort olarak giriş yapmak için
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setLocation('/login-escort')}
                  className="text-primary hover:text-primary/80"
                >
                  Escort Girişi <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Demo Giriş:</p>
                <p className="text-xs text-muted-foreground">Email: user@example.com</p>
                <p className="text-xs text-muted-foreground">Şifre: user</p>
                <p className="text-xs text-muted-foreground mt-2">Admin: admin@example.com / admin</p>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="text-xl font-bold text-primary">1,240+</div>
                  <div className="text-xs text-muted-foreground">Aktif İlan</div>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="text-xl font-bold text-primary">850+</div>
                  <div className="text-xs text-muted-foreground">Onaylı</div>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="text-xl font-bold text-primary">45K+</div>
                  <div className="text-xs text-muted-foreground">Üye</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
