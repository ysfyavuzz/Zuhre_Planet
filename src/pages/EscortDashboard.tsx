/**
 * Escort Dashboard Page
 * 
 * Comprehensive profile management hub for escort service providers.
 * Provides tabbed interface for profile editing, gallery management, appointments, and messaging.
 * Enables escorts to manage their presence, availability, and client interactions.
 * 
 * @module pages/EscortDashboard
 * @category Pages - Dashboard
 * 
 * Features:
 * - Tabbed navigation (Overview, Profile, Gallery, Appointments, Messages, Settings)
 * - Profile information editing (bio, services, rates, availability)
 * - Photo and video gallery management with upload
 * - Appointment management with acceptance/rejection
 * - Real-time messaging with clients
 * - Service and availability configuration
 * - Verification status and profile completeness tracking
 * - Earnings and booking statistics
 * - Review and rating management
 * - Notification center for alerts and updates
 * - Account settings and profile customization
 * 
 * Dashboard Sections:
 * - Overview: Quick stats and recent activity
 * - Profile: Edit bio, services, rates, verification
 * - Gallery: Upload, organize, and manage photos/videos
 * - Appointments: View, manage, and confirm bookings
 * - Messages: Chat with clients and respond to inquiries
 * - Settings: Account preferences and privacy controls
 * 
 * @example
 * ```tsx
 * // Route: /escort/dashboard
 * <EscortDashboard />
 * ```
 */

import { useState } from 'react';
import { Link, Route } from 'wouter';
import {
  Home, User, Calendar, MessageSquare, Settings,
  Star, Image, FileText, LogOut, Bell, TrendingUp
} from 'lucide-react';
import Header from '@/components/Header';

type DashboardTab = 'overview' | 'profile' | 'gallery' | 'appointments' | 'messages' | 'settings';

export default function MasseuseDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  const stats = {
    views: 1250,
    calls: 48,
    messages: 23,
    rating: 4.8,
    appointments: 12,
    revenue: 4500
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">Profil Görüntülenme</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">{stats.views}</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Mesajlar</span>
                </div>
                <div className="text-2xl font-bold text-green-900">{stats.messages}</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-purple-600 font-medium">Randevular</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">{stats.appointments}</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Son Aktiviteler</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Yeni mesaj</div>
                    <div className="text-sm text-gray-500">Ahmet K. - 2 dakika önce</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Yeni randevu talebi</div>
                    <div className="text-sm text-gray-500">Mehmet Y. - 15 dakika önce</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Profili Düzenle</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg" defaultValue="Ayşe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yaş</label>
                  <input type="number" className="w-full px-3 py-2 border rounded-lg" defaultValue={25} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>İstanbul</option>
                    <option>Ankara</option>
                    <option>İzmir</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input type="tel" className="w-full px-3 py-2 border rounded-lg" defaultValue="+90 555 123 4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea className="w-full px-3 py-2 border rounded-lg" rows={4} />
                </div>
                <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700">
                  Kaydet
                </button>
              </form>
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Galeri Yönetimi</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Fotoğraf yüklemek için tıklayın veya sürükleyin</p>
                <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700">
                  Dosya Seç
                </button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="relative group">
                    <div className="aspect-square bg-gray-200 rounded-lg"></div>
                    <button className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Randevular</h3>
              <div className="space-y-3">
                {[
                  { name: 'Mehmet Y.', date: '16 Ocak, 14:00', status: 'confirmed' },
                  { name: 'Can K.', date: '17 Ocak, 19:00', status: 'pending' },
                  { name: 'Emre A.', date: '18 Ocak, 16:30', status: 'pending' },
                ].map((apt, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{apt.name}</div>
                      <div className="text-sm text-gray-500">{apt.date}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                        Onayla
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm">
                        Reddet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Mesajlar</h3>
              <div className="space-y-3">
                {['Ahmet K.', 'Mehmet Y.', 'Can E.'].map((name, i) => (
                  <Link key={i} href={`/dashboard/messages/${i}`}>
                    <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="w-12 h-12 bg-pink-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">{name}</div>
                        <div className="text-sm text-gray-500 truncate">Son mesaj içeriği buraya...</div>
                      </div>
                      <div className="text-xs text-gray-400">10:30</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Ayarlar</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Profil Görünürlük</div>
                    <div className="text-sm text-gray-500">Profilinizi aramalarda göster</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Mesaj Bildirimleri</div>
                    <div className="text-sm text-gray-500">Yeni mesajlarda bildirim al</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Randevu Bildirimleri</div>
                    <div className="text-sm text-gray-500">Yeni randevularda bildirim al</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
              </div>
            </div>

            <button className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2">
              <LogOut className="w-5 h-5" />
              Çıkış Yap
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Panelim</h1>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow mb-6 overflow-x-auto">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="w-4 h-4" />
              Genel Bakış
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4" />
              Profil
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap ${
                activeTab === 'gallery'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Image className="w-4 h-4" />
              Galeri
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap ${
                activeTab === 'appointments'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Randevular
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap ${
                activeTab === 'messages'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Mesajlar
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              Ayarlar
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </main>
    </div>
  );
}
