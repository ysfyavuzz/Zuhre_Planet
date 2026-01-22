/**
 * Admin Analytics Page
 *
 * Platform analitik ve istatistiklerinin görüntülendiği sayfa.
 *
 * @module pages/AdminAnalytics
 * @category Pages - Admin
 *
 * Features:
 * - Toplam ziyaret istatistikleri
 * - Aktif kullanıcı sayıları
 * - İlan görüntülenme verileri
 * - Gelir analitiği
 * - Aylık ziyaretçi grafikleri
 * - Popüler şehir analizi
 * - Son aktivite logları
 *
 * Analytics Cards:
 * - Total visits with trend indicators
 * - Active users count
 * - Listing views tracking
 * - Revenue analytics
 *
 * @example
 * ```tsx
 * // Route: /admin/analytics
 * <AdminAnalytics />
 * ```
 */

import * as React from 'react';
import { AdminSidebar } from '@/components/admin';
import { StatCard } from '@/components/admin/StatCard';
import { Card } from '@/components/ui/card';
import { TrendingUp, Users, Eye, DollarSign } from 'lucide-react';

export default function AdminAnalytics() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analitik</h1>
            <p className="text-gray-500 mt-1">Platform istatistikleri ve metrikler</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Toplam Ziyaret"
              value="125.4K"
              icon={Eye}
              variant="default"
              trend="+12%"
              description="geçen aya göre"
            />
            <StatCard
              title="Aktif Kullanıcı"
              value="8.2K"
              icon={Users}
              variant="success"
              trend="+8%"
              description="geçen aya göre"
            />
            <StatCard
              title="İlan Görüntülenme"
              value="45.8K"
              icon={TrendingUp}
              variant="info"
              trend="+23%"
              description="geçen aya göre"
            />
            <StatCard
              title="Toplam Gelir"
              value="₺325K"
              icon={DollarSign}
              variant="warning"
              trend="+18%"
              description="geçen aya göre"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aylık Ziyaretçiler</h3>
              <div className="space-y-3">
                {['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'].map((month, i) => (
                  <div key={month} className="flex items-center gap-4">
                    <span className="w-16 text-sm text-gray-600">{month}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-pink-500 h-4 rounded-full"
                        style={{ width: `${60 + i * 8}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{12000 + i * 2000}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popüler Şehirler</h3>
              <div className="space-y-3">
                {[
                  { city: 'İstanbul', count: 4520, percentage: 85 },
                  { city: 'Ankara', count: 2890, percentage: 65 },
                  { city: 'İzmir', count: 2100, percentage: 50 },
                  { city: 'Antalya', count: 1650, percentage: 40 },
                  { city: 'Bursa', count: 980, percentage: 25 },
                ].map((item) => (
                  <div key={item.city} className="flex items-center gap-4">
                    <span className="w-20 text-sm text-gray-600">{item.city}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h3>
              <button className="text-sm text-pink-600 hover:text-pink-700">Tümünü Gör</button>
            </div>
            <div className="space-y-4">
              {[
                { action: 'Yeni kayıt', user: 'Mehmet Yılmaz', time: '5 dk önce' },
                { action: 'İlan onaylandı', user: 'Ayşe Demir', time: '15 dk önce' },
                { action: 'Ödeme alındı', user: '₺1,500', time: '1 saat önce' },
                { action: 'VIP üyelik', user: 'Elif Kaya', time: '2 saat önce' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 pb-3 border-b last:border-0">
                  <div className="w-2 h-2 bg-pink-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}:</span> {activity.user}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
