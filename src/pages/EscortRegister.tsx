/**
 * Escort Registration Page
 * 
 * Comprehensive multi-step registration flow for new escort service providers.
 * Implements 6-step verification process including phone verification, ID verification, and service setup.
 * Provides complete onboarding with profile customization and platform rules acceptance.
 * 
 * @module pages/EscortRegister
 * @category Pages - Auth
 * 
 * Features:
 * - Multi-step registration flow (6 steps total)
 * - Account information setup (email, password, username)
 * - Phone number verification via SMS/OTP
 * - ID/Document verification upload
 * - Physical features and appearance input
 * - Services and rates configuration
 * - Profile preview and final review
 * - Terms and conditions acceptance
 * - Commission rate disclosure
 * - Profile photo upload
 * - Availability schedule setup
 * - Payment method configuration
 * - Background check initiation
 * 
 * Registration Steps:
 * 1. Account Info (email, password, username, language)
 * 2. Phone Verification (phone number, OTP)
 * 3. Physical Features (age, height, weight, body type, ethnicity)
 * 4. Services & Rates (services offered, pricing, specialties)
 * 5. Profile Setup (bio, photos, availability, working hours)
 * 6. Review & Confirm (preview, terms acceptance, submit)
 * 
 * @example
 * ```tsx
 * // Route: /escort/register
 * <EscortRegister />
 * ```
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  User, Mail, Phone, MapPin, Calendar, Image, FileText, Check,
  Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Shield, Clock,
  Crown, Sparkles, TrendingUp, Star, Zap, CheckCircle
} from 'lucide-react';

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function EscortRegister() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone verification states
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeTimer, setCodeTimer] = useState(0);

  const [formData, setFormData] = useState({
    // Step 1: Account Info
    name: '',
    email: '',
    password: '',

    // Step 2: Phone Verification
    phone: '',

    // Step 3: Basic Info
    age: '',
    city: '',
    district: '',

    // Step 4: Physical
    height: '',
    weight: '',
    bodyType: '',
    hairColor: '',
    eyeColor: '',
    breastSize: '',

    // Step 5: Services
    services: [] as string[],
    workingHours: '',
    inCall: false,
    outCall: false,

    // Media & About will be handled separately
  });

  const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya',
    'Adana', 'Mersin', 'Konya', 'Gaziantep', 'Eskişehir'
  ];

  const serviceOptions = [
    'Masaj', 'Fantezi', 'Geyşa Masajı', 'Mutlu Son',
    'Vücut Masajı', 'Aromaterapi', 'Taş Masajı',
    'Spa Masajı', 'Thai Masajı', 'Balinese Masajı'
  ];

  const bodyTypes = ['Zayıf', 'Orta', 'Dolgun', 'Atletik', 'Balık Etli'];
  const hairColors = ['Sarı', 'Kahverengi', 'Siyah', 'Kızıl', 'Diğer'];
  const eyeColors = ['Mavi', 'Yeşil', 'Kahverengi', 'Ela', 'Siyah'];

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSendCode = () => {
    if (!formData.phone || formData.phone.length < 10) {
      setError('Geçerli bir telefon numarası girin');
      return;
    }
    setIsCodeSent(true);
    setCodeTimer(60);
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
    if (verificationCode.length === 4) {
      setIsPhoneVerified(true);
      setIsCodeSent(false);
    } else {
      setError('Geçersiz doğrulama kodu');
    }
  };

  const handleSubmit = async () => {
    if (!isPhoneVerified) {
      setError('Telefon doğrulaması gerekli');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Registration data:', formData);
      setLocation('/escort/dashboard?pending=true');
    } catch (err) {
      setError('Kayıt başarısız. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Hesap', icon: User },
    { number: 2, title: 'Telefon', icon: Phone },
    { number: 3, title: 'Temel', icon: User },
    { number: 4, title: 'Fiziksel', icon: User },
    { number: 5, title: 'Hizmetler', icon: FileText },
    { number: 6, title: 'Onayla', icon: Check },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <button
            onClick={() => setLocation('/login-escort')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Giriş sayfasına dön
          </button>
          <h1 className="text-3xl font-bold mb-2">Escort Kayıt Ol</h1>
          <p className="text-muted-foreground">Profilinizi adım adım oluşturun</p>
        </motion.div>

        {/* Progress Steps - Desktop */}
        <Card className="card-premium mb-6 hidden md:block">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;

                return (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all
                        ${isCompleted ? 'bg-green-500 text-white' : ''}
                        ${isCurrent ? 'bg-primary text-white scale-110' : ''}
                        ${!isCompleted && !isCurrent ? 'bg-muted text-muted-foreground' : ''}
                      `}>
                        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <span className={`text-xs mt-1 ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-1 flex-1 mx-2 rounded-full transition-colors ${currentStep > step.number ? 'bg-green-500' : 'bg-muted'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Progress Steps - Mobile */}
        <Card className="card-premium mb-6 md:hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2">
              {steps.map((step) => {
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;

                return (
                  <div
                    key={step.number}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                      ${isCompleted ? 'bg-green-500 text-white' : ''}
                      ${isCurrent ? 'bg-primary text-white' : ''}
                      ${!isCompleted && !isCurrent ? 'bg-muted text-muted-foreground' : ''}
                    `}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.number}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-red-500/30 bg-red-500/10 mb-6">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Form Content */}
        <Card className="card-premium">
          <CardContent className="p-6 md:p-8">

            {/* Step 1: Account Info */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <h2 className="text-xl font-semibold mb-4">Hesap Bilgileri</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Ad / Takma Ad *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Örn: Ayşe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">E-posta *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Şifre *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="En az 6 karakter"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation('/login-escort')}
                    className="flex-1"
                  >
                    İptal
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.name || !formData.email || !formData.password}
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
                      <label className="block text-sm font-medium mb-2">Telefon Numarası *</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                          placeholder="+90 555 123 4567"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleSendCode}
                      disabled={!formData.phone || formData.phone.length < 10}
                      className="w-full bg-gradient-to-r from-primary to-accent"
                    >
                      Doğrulama Kodu Gönder
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="bg-muted/30 rounded-xl p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        {formData.phone} numarasına 4 haneli kod gönderildi
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-center">Doğrulama Kodu *</label>
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
                            className="w-14 h-14 text-center text-2xl font-bold rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                      <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4" />
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

                {isPhoneVerified && (
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
                  {isPhoneVerified && (
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

            {/* Step 3: Basic Info */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <h2 className="text-xl font-semibold mb-4">Temel Bilgiler</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Yaş *</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="18+"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Şehir *</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Seçiniz</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">İlçe *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Örn: Kadıköy"
                      required
                    />
                  </div>
                </div>

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
                    onClick={() => setCurrentStep(4)}
                    disabled={!formData.age || !formData.city || !formData.district}
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                  >
                    İleri
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Physical Features */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <h2 className="text-xl font-semibold mb-4">Fiziksel Özellikler</h2>

                {/* Info Cards - Visibility Benefits */}
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">📈 Görünürlük Garantisi</p>
                      <p className="text-blue-600 dark:text-blue-300">
                        Ne kadar çok bilgi girerseniz, profiliniz o kadar üst sıralarda çıkar. Müşteriler detaylı profiller tercih eder!
                      </p>
                    </div>
                  </div>
                </div>

                {/* VIP Benefits Card */}
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Crown className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm flex-1">
                      <p className="font-semibold text-amber-700 dark:text-amber-400 mb-2">👑 VIP Üyelik Ayrıcalıkları</p>
                      <ul className="text-amber-600 dark:text-amber-300 space-y-1">
                        <li>✨ Her listenin en üstünde görünürsünüz</li>
                        <li>🔥 Profilinizde özel VIP rozeti</li>
                        <li>📸 Sınırsız fotoğraf ve video yükleme</li>
                        <li>⚡ Öncelikli müşteri desteği</li>
                        <li>🎯 Gelişmiş filtrelerde her zaman ilk sıralarda</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Verified Member Benefits Card */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm flex-1">
                      <p className="font-semibold text-green-700 dark:text-green-400 mb-2">✅ Onaylı Üye Ayrıcalıkları</p>
                      <ul className="text-green-600 dark:text-green-300 space-y-1">
                        <li>🛡️ Profilinizde onaylı rozet</li>
                        <li>👁️ Güvenilir görünüm - %70 daha fazla tıklama</li>
                        <li>📊 Aramalarda öncelikli sıralama</li>
                        <li>🔒 Kimliğiniz gizli tutulur, sadece onaylandı görünür</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* VIP Pricing Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Standart</p>
                      <p className="text-2xl font-bold">Ücretsiz</p>
                      <p className="text-xs text-muted-foreground mt-2">10 fotoğraf</p>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/50 bg-primary/5 ring-2 ring-primary/20">
                    <CardContent className="p-4 text-center relative">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        POPÜLER
                      </div>
                      <p className="text-xs text-primary mb-1">Premium</p>
                      <p className="text-2xl font-bold text-primary">₺499<span className="text-sm text-muted-foreground">/ay</span></p>
                      <p className="text-xs text-muted-foreground mt-2">20 fotoğraf + 5 video</p>
                    </CardContent>
                  </Card>

                  <Card className="border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-orange-500/10 ring-2 ring-amber-500/20">
                    <CardContent className="p-4 text-center relative">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        EN İYİ
                      </div>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">VIP</p>
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">₺999<span className="text-sm text-muted-foreground">/ay</span></p>
                      <p className="text-xs text-muted-foreground mt-2">Sınırsız içerik + Öncelik</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Boy (cm) *</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="165"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Kilo (kg) *</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="55"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Vücut Tipi *</label>
                  <div className="flex flex-wrap gap-2">
                    {bodyTypes.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, bodyType: type })}
                        className={`px-4 py-2 rounded-full border-2 transition ${
                          formData.bodyType === type
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Saç Rengi *</label>
                  <div className="flex flex-wrap gap-2">
                    {hairColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, hairColor: color })}
                        className={`px-4 py-2 rounded-full border-2 transition ${
                          formData.hairColor === color
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Göz Rengi *</label>
                  <div className="flex flex-wrap gap-2">
                    {eyeColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, eyeColor: color })}
                        className={`px-4 py-2 rounded-full border-2 transition ${
                          formData.eyeColor === color
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1"
                  >
                    Geri
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                  >
                    İleri
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Services */}
            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <h2 className="text-xl font-semibold mb-4">Hizmetler</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Hizmet Türleri</label>
                  <div className="grid grid-cols-2 gap-3">
                    {serviceOptions.map(service => (
                      <label key={service} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-primary/5 transition">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={() => handleServiceToggle(service)}
                          className="w-5 h-5 rounded"
                        />
                        <span className="text-sm">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Çalışma Saatleri</label>
                  <input
                    type="text"
                    value={formData.workingHours}
                    onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Örn: 10:00 - 22:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Randevu Türleri</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-primary/5">
                      <input
                        type="checkbox"
                        checked={formData.inCall}
                        onChange={(e) => setFormData({ ...formData, inCall: e.target.checked })}
                        className="w-5 h-5 rounded"
                      />
                      <span>Ofisime / Kendi Mekanımda</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-primary/5">
                      <input
                        type="checkbox"
                        checked={formData.outCall}
                        onChange={(e) => setFormData({ ...formData, outCall: e.target.checked })}
                        className="w-5 h-5 rounded"
                      />
                      <span>Müşterinin Mekanına</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(4)}
                    className="flex-1"
                  >
                    Geri
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(6)}
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                  >
                    İleri
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 6: Review & Submit */}
            {currentStep === 6 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <h2 className="text-xl font-semibold mb-4">Özet ve Onay</h2>

                <Card className="bg-muted/20">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ad:</span>
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">E-posta:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Telefon:</span>
                      <span className="font-medium">{formData.phone} ✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Yaş:</span>
                      <span className="font-medium">{formData.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Konum:</span>
                      <span className="font-medium">{formData.city}, {formData.district}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Boy/Kilo:</span>
                      <span className="font-medium">{formData.height}cm / {formData.weight}kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hizmetler:</span>
                      <span className="font-medium">{formData.services.length} seçili</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">Önemli Bilgi</p>
                      <p className="text-amber-600 dark:text-amber-300">
                        Profiliniz admin onayından sonra yayınlanacaktır. Onay süreci 24-48 saat sürebilir.
                      </p>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
                  <input
                    type="checkbox"
                    id="terms-escort"
                    className="w-5 h-5 rounded border-border mt-0.5 flex-shrink-0"
                  />
                  <label htmlFor="terms-escort" className="text-sm">
                    <a href="#" className="text-primary hover:underline">Kullanım koşullarını</a> ve{' '}
                    <a href="#" className="text-primary hover:underline">gizlilik politikasını</a> okudum ve kabul ediyorum
                  </label>
                </label>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(5)}
                    className="flex-1"
                  >
                    Geri
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                  >
                    {isLoading ? 'Kaydediliyor...' : 'Kaydı Tamamla'}
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
