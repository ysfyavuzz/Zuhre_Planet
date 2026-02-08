/**
 * HowItWorks Page
 * 
 * Explains how the platform works with step-by-step guides.
 * Separate guides for customers and escorts.
 * 
 * @page
 * @category General
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { 
  UserPlus, Search, Heart, Calendar, MessageCircle, Star,
  FileText, Image, Settings, TrendingUp, Shield, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO } from '@/pages/SEO';

interface Step {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const customerSteps: Step[] = [
  {
    title: 'Üye Ol',
    description: 'E-posta adresinizle hızlıca kayıt olun. Kayıt işlemi tamamen ücretsizdir.',
    icon: UserPlus,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Profilleri İncele',
    description: 'Binlerce escort profili arasından filtreleme yaparak size en uygun olanları bulun.',
    icon: Search,
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Favorilere Ekle',
    description: 'Beğendiğiniz profilleri favorilerinize ekleyerek daha sonra kolayca ulaşın.',
    icon: Heart,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Mesaj Gönder',
    description: 'Güvenli mesajlaşma sistemi ile escortlarla iletişime geçin.',
    icon: MessageCircle,
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'Randevu Al',
    description: 'Tarih, saat ve hizmet seçimi yaparak randevu talebi oluşturun.',
    icon: Calendar,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Değerlendirme Yap',
    description: 'Deneyiminizi paylaşın ve diğer kullanıcılara yardımcı olun.',
    icon: Star,
    color: 'from-sky-500 to-blue-500',
  },
];

const escortSteps: Step[] = [
  {
    title: 'Kayıt Ol',
    description: 'Escort olarak kayıt olun ve kimlik doğrulama sürecini tamamlayın.',
    icon: UserPlus,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Profil Oluştur',
    description: 'Detaylı profil bilgilerinizi girin, hizmetlerinizi ve fiyatlarınızı belirleyin.',
    icon: FileText,
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Fotoğraf Yükle',
    description: 'Profesyonel fotoğraflarınızı yükleyin. Tüm fotoğraflar moderatörler tarafından onaylanır.',
    icon: Image,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Ayarları Yönet',
    description: 'Çalışma saatlerinizi, müsaitlik takviminizi ve hizmet bölgelerinizi ayarlayın.',
    icon: Settings,
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'Randevuları Kabul Et',
    description: 'Gelen randevu taleplerini inceleyin, onaylayın veya reddedin.',
    icon: Calendar,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Kazanç Takibi',
    description: 'Dashboard\'dan kazançlarınızı takip edin ve detaylı raporlara ulaşın.',
    icon: TrendingUp,
    color: 'from-sky-500 to-blue-500',
  },
];

const features = [
  {
    title: 'Güvenli Platform',
    description: 'SSL şifreleme ve KVKK uyumlu veri güvenliği',
    icon: Shield,
  },
  {
    title: 'Doğrulanmış Profiller',
    description: 'Tüm profiller admin onayından geçer',
    icon: CheckCircle,
  },
  {
    title: 'Güvenli Ödeme',
    description: 'PCI-DSS uyumlu ödeme altyapısı',
    icon: Shield,
  },
  {
    title: '7/24 Destek',
    description: 'Her zaman yanınızdayız',
    icon: MessageCircle,
  },
];

export default function HowItWorks() {
  return (
    <>
      <SEO 
        title="Nasıl Çalışır"
        description="Platformumuzun nasıl çalıştığını adım adım öğrenin"
      />
      
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nasıl Çalışır?
            </h1>
            <p className="text-xl text-gray-600">
              Platformumuzu kullanmak çok kolay. Adım adım takip edin.
            </p>
          </div>

          {/* Tabs for Customer/Escort */}
          <Tabs defaultValue="customer" className="mb-16">
            <TabsList className="grid grid-cols-2 max-w-md mx-auto mb-12">
              <TabsTrigger value="customer" className="text-lg">
                Müşteri İçin
              </TabsTrigger>
              <TabsTrigger value="escort" className="text-lg">
                Escort İçin
              </TabsTrigger>
            </TabsList>

            {/* Customer Steps */}
            <TabsContent value="customer">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customerSteps.map((step, index) => (
                    <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                      <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${step.color}`} />
                      
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                            <step.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-3xl font-bold text-gray-200">
                            {(index + 1).toString().padStart(2, '0')}
                          </div>
                        </div>
                        <CardTitle className="text-xl">
                          {step.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-gray-600">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-lg px-8 py-6"
                  >
                    Hemen Başla
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Escort Steps */}
            <TabsContent value="escort">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {escortSteps.map((step, index) => (
                    <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                      <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${step.color}`} />
                      
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                            <step.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-3xl font-bold text-gray-200">
                            {(index + 1).toString().padStart(2, '0')}
                          </div>
                        </div>
                        <CardTitle className="text-xl">
                          {step.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-gray-600">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-lg px-8 py-6"
                  >
                    Escort Olarak Kayıt Ol
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Features */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Neden Bizi Seçmelisiniz?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
