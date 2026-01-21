/**
 * FinancialReports Component
 * 
 * Revenue and payment tracking interface.
 * Displays financial statistics, transactions, and reports.
 * 
 * @component
 * @category Admin
 */

import * as React from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockAppointments } from '@/data/mockData/appointments';
import { mockEscorts } from '@/data/mockData/escorts';

export function FinancialReports() {
  // Calculate financial stats
  const stats = React.useMemo(() => {
    const totalRevenue = mockAppointments
      .filter(a => a.paymentStatus === 'paid')
      .reduce((sum, a) => sum + a.price, 0);
    
    const thisMonthRevenue = mockAppointments
      .filter(a => {
        const date = new Date(a.date);
        const now = new Date();
        return date.getMonth() === now.getMonth() && 
               date.getFullYear() === now.getFullYear() &&
               a.paymentStatus === 'paid';
      })
      .reduce((sum, a) => sum + a.price, 0);

    const pendingPayments = mockAppointments
      .filter(a => a.paymentStatus === 'pending')
      .reduce((sum, a) => sum + a.price, 0);

    const totalEscortEarnings = mockEscorts
      .reduce((sum, e) => sum + e.earnings.totalEarned, 0);

    return {
      totalRevenue,
      thisMonthRevenue,
      pendingPayments,
      totalEscortEarnings,
      platformCommission: totalRevenue - totalEscortEarnings,
    };
  }, []);

  // Recent transactions
  const recentTransactions = React.useMemo(() => {
    return mockAppointments
      .filter(a => a.paymentStatus === 'paid')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finansal Raporlar</h1>
          <p className="text-gray-500 mt-1">Gelir ve ödeme takibi</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Rapor İndir
        </Button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Toplam Gelir</p>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalRevenue.toLocaleString('tr-TR')} ₺
          </p>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12.5% bu ay</span>
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Bu Ay</p>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.thisMonthRevenue.toLocaleString('tr-TR')} ₺
          </p>
          <p className="text-xs text-blue-600 mt-2">
            {mockAppointments.filter(a => {
              const date = new Date(a.date);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length} randevu
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Bekleyen Ödemeler</p>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.pendingPayments.toLocaleString('tr-TR')} ₺
          </p>
          <p className="text-xs text-orange-600 mt-2">
            {mockAppointments.filter(a => a.paymentStatus === 'pending').length} işlem
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Platform Komisyonu</p>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.platformCommission.toLocaleString('tr-TR')} ₺
          </p>
          <p className="text-xs text-purple-600 mt-2">
            %{((stats.platformCommission / stats.totalRevenue) * 100).toFixed(1)} oran
          </p>
        </Card>
      </div>

      {/* Top Earning Escorts */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">En Çok Kazanan Eskortlar</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İsim</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Kazanç</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bu Ay</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Geçen Ay</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Randevular</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockEscorts
                .sort((a, b) => b.earnings.totalEarned - a.earnings.totalEarned)
                .slice(0, 10)
                .map((escort, index) => (
                  <tr key={escort.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-semibold">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {escort.displayName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{escort.displayName}</p>
                          <p className="text-xs text-gray-500">{escort.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">
                        {escort.earnings.totalEarned.toLocaleString('tr-TR')} ₺
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">
                        {escort.earnings.thisMonth.toLocaleString('tr-TR')} ₺
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-500">
                        {escort.earnings.lastMonth.toLocaleString('tr-TR')} ₺
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge>{escort.stats.totalBookings} randevu</Badge>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Son İşlemler</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eskort</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hizmet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ödeme Yöntemi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.escortName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.serviceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="secondary">
                      {transaction.paymentMethod === 'credit_card' && 'Kredi Kartı'}
                      {transaction.paymentMethod === 'cash' && 'Nakit'}
                      {transaction.paymentMethod === 'wallet' && 'Cüzdan'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {transaction.price.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="default">Ödendi</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
