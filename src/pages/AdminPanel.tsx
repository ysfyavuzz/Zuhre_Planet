/**
 * AdminPanel Page
 * 
 * Main admin panel page with tabbed interface.
 * Provides access to all admin functions in one place.
 * 
 * @page
 * @category Admin
 */

import * as React from 'react';
import { AdminSidebar, UserManagement, ListingManagement, MediaModeration, FinancialReports } from '@/components/admin';
import { Card } from '@/components/ui/card';
import { Users, FileCheck, Image, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminPanel() {
  const [activeSection, setActiveSection] = React.useState<'dashboard' | 'users' | 'listings' | 'media' | 'financial'>('dashboard');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Platform genel görünümü</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Toplam Kullanıcı</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">1,245</p>
                    <p className="text-xs text-green-600 mt-1">+12% bu ay</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Bekleyen İlanlar</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">23</p>
                    <p className="text-xs text-orange-600 mt-1">İnceleme gerekli</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Bekleyen Medya</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">47</p>
                    <p className="text-xs text-purple-600 mt-1">Moderasyon</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Image className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Bu Ay Gelir</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">₺125K</p>
                    <p className="text-xs text-green-600 mt-1">+18% artış</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { type: 'user', message: 'Yeni kullanıcı kaydı: Mehmet Yılmaz', time: '5 dk önce' },
                  { type: 'listing', message: 'Yeni ilan onaylandı: Ayşe', time: '15 dk önce' },
                  { type: 'payment', message: 'Ödeme alındı: 1,500₺', time: '1 saat önce' },
                  { type: 'report', message: 'Yeni şikayet: İlan #456', time: '2 saat önce' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveSection('users')}
                className="p-6 bg-white rounded-lg border border-gray-200 hover:border-pink-500 hover:shadow-md transition-all text-left"
              >
                <Users className="w-8 h-8 text-pink-600 mb-3" />
                <h3 className="font-semibold text-gray-900">Kullanıcı Yönetimi</h3>
                <p className="text-sm text-gray-500 mt-1">Kullanıcıları görüntüle ve yönet</p>
              </button>

              <button
                onClick={() => setActiveSection('listings')}
                className="p-6 bg-white rounded-lg border border-gray-200 hover:border-pink-500 hover:shadow-md transition-all text-left"
              >
                <FileCheck className="w-8 h-8 text-pink-600 mb-3" />
                <h3 className="font-semibold text-gray-900">İlan Onayları</h3>
                <p className="text-sm text-gray-500 mt-1">Bekleyen ilanları incele</p>
              </button>

              <button
                onClick={() => setActiveSection('financial')}
                className="p-6 bg-white rounded-lg border border-gray-200 hover:border-pink-500 hover:shadow-md transition-all text-left"
              >
                <DollarSign className="w-8 h-8 text-pink-600 mb-3" />
                <h3 className="font-semibold text-gray-900">Finansal Raporlar</h3>
                <p className="text-sm text-gray-500 mt-1">Gelir ve ödemeler</p>
              </button>
            </div>
          </div>
        )}

        {activeSection === 'users' && <UserManagement />}
        {activeSection === 'listings' && <ListingManagement />}
        {activeSection === 'media' && <MediaModeration />}
        {activeSection === 'financial' && <FinancialReports />}
      </main>
    </div>
  );
}
