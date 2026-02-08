/**
 * Support Page
 * 
 * Customer support and help center page.
 * Provides multiple ways to contact support and access help resources.
 * 
 * @page
 * @category General
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, Mail, Phone, Clock, HelpCircle, 
  Send, MapPin, Facebook, Twitter, Instagram, CheckCircle
} from 'lucide-react';
import { SEO } from '@/pages/SEO';

export default function Support() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with actual API call
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  const contactMethods = [
    {
      title: 'Canlı Destek',
      description: 'Anında yardım almak için canlı destek hattımız',
      icon: MessageCircle,
      color: 'from-blue-500 to-blue-600',
      action: 'Sohbet Başlat',
      available: '7/24 Aktif',
    },
    {
      title: 'E-posta',
      description: 'destek@platform.com',
      icon: Mail,
      color: 'from-purple-500 to-purple-600',
      action: 'E-posta Gönder',
      available: '24 saat içinde yanıt',
    },
    {
      title: 'Telefon',
      description: '+90 212 xxx xx xx',
      icon: Phone,
      color: 'from-green-500 to-green-600',
      action: 'Ara',
      available: 'Hafta içi 09:00-18:00',
    },
    {
      title: 'SSS',
      description: 'Sıkça sorulan soruları inceleyin',
      icon: HelpCircle,
      color: 'from-cyan-500 to-blue-600',
      action: 'SSS\'ye Git',
      available: 'Her zaman erişilebilir',
    },
  ];

  const officeHours = [
    { day: 'Pazartesi - Cuma', hours: '09:00 - 18:00' },
    { day: 'Cumartesi', hours: '10:00 - 16:00' },
    { day: 'Pazar', hours: 'Kapalı' },
  ];

  return (
    <>
      <SEO 
        title="Destek ve Yardım"
        description="Size yardımcı olmak için buradayız. Destek ekibimizle iletişime geçin."
      />
      
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Size Nasıl Yardımcı Olabiliriz?
            </h1>
            <p className="text-xl text-gray-600">
              Destek ekibimiz size yardımcı olmak için burada.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${method.color} rounded-full flex items-center justify-center`}>
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg mb-2">
                      {method.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 mb-2 text-sm">
                      {method.description}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      {method.available}
                    </p>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Bize Ulaşın</CardTitle>
                <p className="text-gray-600">
                  Formu doldurun, en kısa sürede size dönüş yapalım.
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adınız
                    </label>
                    <Input
                      type="text"
                      placeholder="Adınız ve Soyadınız"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta
                    </label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konu
                    </label>
                    <Input
                      type="text"
                      placeholder="Konu başlığı"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mesajınız
                    </label>
                    <Textarea
                      placeholder="Detaylı açıklama..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  {isSubmitted && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Destek talebiniz alındı. En kısa sürede size dönüş yapacağız.</span>
                    </div>
                  )}

                  <Button 
                    type="submit"
                    disabled={isSubmitted}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitted ? 'Gönderildi' : 'Gönder'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info & Office Hours */}
            <div className="space-y-6">
              {/* Office Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Çalışma Saatleri
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {officeHours.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                        <span className="text-gray-700 font-medium">{item.day}</span>
                        <span className="text-gray-600">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Office Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Ofis Adresi
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Maslak Mahallesi, Büyükdere Cad.<br />
                    No: 123, 34398<br />
                    Sarıyer / İstanbul
                  </p>
                  
                  <Button variant="outline" className="w-full">
                    <MapPin className="w-4 h-4 mr-2" />
                    Haritada Göster
                  </Button>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Sosyal Medya</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="flex gap-4 justify-center">
                    <button className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors">
                      <Facebook className="w-6 h-6 text-white" />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center transition-colors">
                      <Twitter className="w-6 h-6 text-white" />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 flex items-center justify-center transition-colors">
                      <Instagram className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12 max-w-6xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Hızlı Bağlantılar
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto py-4">
                    SSS
                  </Button>
                  <Button variant="outline" className="h-auto py-4">
                    Nasıl Çalışır
                  </Button>
                  <Button variant="outline" className="h-auto py-4">
                    Kullanım Koşulları
                  </Button>
                  <Button variant="outline" className="h-auto py-4">
                    Gizlilik Politikası
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
