/**
 * About Page
 * 
 * About the platform - mission, vision, and company information.
 * 
 * @page
 * @category General
 */

import { Shield, Heart, Users, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hakkımızda</h1>
          <p className="text-xl opacity-90">
            Türkiye'nin en güvenilir eskort platformu
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Mission */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Güvenli, profesyonel ve kaliteli eskort hizmetlerini bir araya getirerek, 
            müşterilerimize en iyi deneyimi sunmayı amaçlıyoruz. Platform olarak, 
            hem müşteri hem de eskortlarımızın güvenliğini ve memnuniyetini ön planda tutuyoruz.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Güvenlik</h3>
            <p className="text-gray-600">
              Tüm eskortlarımız kimlik doğrulamasından geçer ve platformumuz 
              güvenli ödeme sistemleri kullanır.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Kalite</h3>
            <p className="text-gray-600">
              Sadece profesyonel ve deneyimli eskortlarla çalışıyoruz. 
              Her profil dikkatle incelenir ve onaylanır.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Topluluk</h3>
            <p className="text-gray-600">
              Binlerce memnun müşteri ve yüzlerce doğrulanmış eskort ile 
              büyüyen bir topluluk oluşturduk.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mükemmellik</h3>
            <p className="text-gray-600">
              Sürekli kendimizi geliştiriyor ve müşteri memnuniyetini 
              artırmak için çalışıyoruz.
            </p>
          </Card>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">500+</p>
              <p className="text-gray-600">Doğrulanmış Eskort</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-600 mb-2">10K+</p>
              <p className="text-gray-600">Aktif Kullanıcı</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">50K+</p>
              <p className="text-gray-600">Başarılı Randevu</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600 mb-2">4.8/5</p>
              <p className="text-gray-600">Ortalama Puan</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bizimle İletişime Geçin</h2>
          <p className="text-gray-600 mb-6">
            Sorularınız için her zaman buradayız
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            İletişime Geç
          </a>
        </div>
      </div>
    </div>
  );
}
