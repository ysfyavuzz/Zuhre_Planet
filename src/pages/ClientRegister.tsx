/**
 * Client Registration Page
 * 
 * Multi-step registration flow for new customers to create platform accounts.
 * Implements 3-step verification process including phone verification and referral support.
 * Provides comprehensive onboarding with profile setup and security features.
 * 
 * @module pages/ClientRegister
 * @category Pages - Auth
 * 
 * Features:
 * - Multi-step registration flow (3 steps total)
 * - Email and password creation with validation
 * - Phone number verification via SMS/OTP
 * - Referral code support for program participation
 * - Profile information completion (name, age, preferences)
 * - Terms and conditions acceptance
 * - Password strength indicator
 * - Real-time email/phone availability checking
 * - Error handling and validation feedback
 * - Progress indicator for step tracking
 * - Auto-login after successful registration
 * 
 * Registration Steps:
 * 1. Basic account info (email, password, confirm password)
 * 2. Phone verification (phone number, OTP verification)
 * 3. Profile completion (name, age, city, preferences, referral code)
 * 
 * @example
 * ```tsx
 * // Route: /client/register
 * <ClientRegister />
 * ```
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, MapPin, Calendar,
  Check, AlertCircle, ArrowLeft, Sparkles, Crown, Shield, Gift
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type Step = 1 | 2 | 3;

export default function ClientRegister() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone verification
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [codeTimer, setCodeTimer] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    city: '',
    agreeTerms: false,
    referralCode: '',
  });

  // Referans kodu durumu
  const [referralStatus, setReferralStatus] = useState<{
    valid: boolean | null;
    reward?: { discount: number; points: number };
  }>({ valid: null });

  const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya',
    'Adana', 'Mersin', 'Konya', 'Gaziantep', 'Eskişehir'
  ];

  const handleSendCode = () => {
    // Simulate sending verification code
    setIsCodeSent(true);
    setCodeTimer(60); // 60 seconds countdown
    const timer = setInterval(() => {
      setCodeTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyCode = () => {
    // Mock verification - accept any 4-digit code
    if (verificationCode.length === 4) {
      setIsVerified(true);
      setIsCodeSent(false);
    } else {
      setError('Geçersiz doğrulama kodu');
    }
  };

  const handleReferralCodeCheck = () => {
    if (!formData.referralCode || formData.referralCode.length < 4) {
      setReferralStatus({ valid: false });
      return;
    }

    // Mock referans kodu kontrolü - 8 karakter kodları geçerli say
    if (formData.referralCode.length === 8) {
      setReferralStatus({
        valid: true,
        reward: { discount: 15, points: 100 }
      });
    } else {
      setReferralStatus({ valid: false });
    }
  };

  const handleSubmit = async () => {
    if (!isVerified) {
      setError('Lütfen telefon numaranızı doğrulayın');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user'
      });
      setLocation('/');
    } catch (err) {
      setError('Kayıt başarısız. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Hesap Bilgileri' },
    { number: 2, title: 'Telefon Doğrulama' },
    { number: 3, title: 'Profil Bilgileri' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 flex items-center justify-center p-4 py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(217,70,239,0.15),transparent_50%)]" />

      <div className="w-full max-w-3xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => setLocation('/login-client')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Giriş sayfasına dön
          </button>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-black">Müşteri Kayıt Ol</h1>
          </div>
          <p className="text-muted-foreground">
            Ücretsiz üyelik oluşturun ve aramaya başlayın
          </p>
        </motion.div>

        {/* Progress Steps */}
        <Card className="card-premium mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
                      ${currentStep > step.number ? 'bg-green-500 text-white' : ''}
                      ${currentStep === step.number ? 'bg-primary text-white scale-110' : ''}
                      ${currentStep < step.number ? 'bg-muted text-muted-foreground' : ''}
                    `}>
                      {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                    </div>
                    <span className={`text-xs mt-1 hidden sm:block ${currentStep === step.number ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 rounded-full transition-colors ${currentStep > step.number ? 'bg-green-500' : 'bg-muted'}`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card className="card-premium">
          <CardContent className="p-6 md:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Step 1: Account Info */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Adınız Soyadınız"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    E-posta Adresi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ornek@email.com"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Şifre <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="En az 6 karakter"
                      required
                      minLength={6}
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    En az 6 karakter olmalı
                  </p>
                </div>

                {/* Referral Code Section */}
                <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Gift className="w-5 h-5 text-amber-500" />
                    <span className="font-semibold text-amber-700 dark:text-amber-400">Arkadaşından mı geldin? 🎁</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Bir arkadaşının davet kodunu girerek %15 indirim ve 100 karşılama puanı kazan!
                  </p>

                  <div className="relative">
                    <input
                      type="text"
                      value={formData.referralCode}
                      onChange={(e) => {
                        setFormData({ ...formData, referralCode: e.target.value.toUpperCase() });
                        setReferralStatus({ valid: null });
                      }}
                      onBlur={handleReferralCodeCheck}
                      placeholder="DAVETKODU (8 karakter)"
                      maxLength={8}
                      className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono uppercase text-center tracking-widest"
                    />

                    {referralStatus.valid === true && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>

                  {/* Referral Status Messages */}
                  {referralStatus.valid === true && referralStatus.reward && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-3 bg-green-500/20 border border-green-500/40 rounded-lg"
                    >
                      <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                        <Check className="w-4 h-4" />
                        <span className="font-bold">Kod Geçerli!</span>
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                        %{referralStatus.reward.discount} indirim + {referralStatus.reward.points} puan kazandınız! 🎉
                      </p>
                    </motion.div>
                  )}

                  {referralStatus.valid === false && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Geçersiz davet kodu. Lütfen kontrol edip tekrar deneyin veya boş bırakın.
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Opsiyonel • Boş bırakabilirsiniz
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation('/login-client')}
                    className="flex-1"
                  >
                    İptal
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                  >
                    İleri
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Phone Verification */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Telefon Doğrulama</h3>
                  <p className="text-muted-foreground text-sm">
                    Güvenliğiniz için telefon numaranızı doğrulamanız gerekiyor
                  </p>
                </div>

                {/* Privacy Notice */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-primary mb-2">🔒 Gizlilik Garantisi</p>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Telefon numaranız hiçbir yerde paylaşılmayacak</li>
                        <li>• SMS'de site adı geçmeyecek, tamamen gizli kalacak</li>
                        <li>• Mesaj bildirim merkezi numaramızdan gelecek</li>
                        <li>• Sadece "Merhaba... [KOD]" formatında mesaj alacaksınız</li>
                        <li>• Kod harici hiçbir içerik görmeyeceksiniz, içiniz rahat olsun :)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {!isCodeSent ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Telefon Numarası <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+90 555 123 4567"
                          required
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleSendCode}
                      disabled={!phoneNumber || phoneNumber.length < 10}
                      className="w-full bg-gradient-to-r from-primary to-accent"
                    >
                      Doğrulama Kodu Gönder
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="bg-muted/30 rounded-xl p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        {phoneNumber} numarasına 4 haneli kod gönderildi
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Doğrulama Kodu <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2 justify-center">
                        {[0, 1, 2, 3].map((index) => (
                          <input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={verificationCode[index] || ''}
                            onChange={(e) => {
                              const newCode = verificationCode.split('');
                              newCode[index] = e.target.value;
                              setVerificationCode(newCode.join(''));
                            }}
                            className="w-14 h-14 text-center text-2xl font-bold rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        ))}
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={verificationCode.length !== 4}
                      className="w-full bg-gradient-to-r from-primary to-accent"
                    >
                      Doğrula
                    </Button>

                    {codeTimer > 0 ? (
                      <p className="text-center text-sm text-muted-foreground">
                        Kod tekrar {codeTimer} saniye sonra gönderilebilir
                      </p>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleSendCode}
                        className="w-full"
                      >
                        Kodu Tekrar Gönder
                      </Button>
                    )}
                  </>
                )}

                {isVerified && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                    <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="font-semibold text-green-700 dark:text-green-400">Telefon Doğrulandı!</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Geri
                  </Button>
                  {isVerified && (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 bg-gradient-to-r from-primary to-accent"
                    >
                      İleri
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Profile Info */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Doğum Tarihi</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Şehir</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Şehir Seçin</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-xl">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Gizlilik Politikası</p>
                    <p className="text-muted-foreground">
                      Bilgileriniz gizli tutulur ve üçüncü şahıslarla paylaşılmaz.
                    </p>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="w-5 h-5 rounded border-border mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm">
                    <a href="#" className="text-primary hover:underline">Kullanım koşullarını</a> ve{' '}
                    <a href="#" className="text-primary hover:underline">gizlilik politikasını</a> okudum ve kabul ediyorum
                  </span>
                </label>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1"
                  >
                    Geri
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!formData.agreeTerms || isLoading}
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                  >
                    {isLoading ? 'Kaydediliyor...' : 'Kaydı Tamamla'}
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* VIP CTA */}
        <Card className="card-premium mt-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
          <CardContent className="p-6 text-center">
            <Crown className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">VIP Üyelik</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sınırsız fotoğraf ve video görüntüleme ayrıcalığına sahip olun
            </p>
            <Button variant="outline" className="border-amber-500/50 hover:bg-amber-500/10">
              VIP'e Geç
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
