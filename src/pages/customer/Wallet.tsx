/**
 * Customer Wallet Page
 *
 * This page allows customers to manage their balance, credit deposits, and transaction history.
 * Wrapped in CustomerDashboardLayout for consistent navigation.
 * Uses the "Deep Space Luxury" theme with glassmorphism.
 *
 * @module pages/customer/Wallet
 * @category Pages - Customer Dashboard
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet as WalletIcon,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Gift,
  Star,
  Info,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Zap,
  ShoppingBag,
  History,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CustomerDashboardLayout } from '@/components/layout/CustomerDashboardLayout';
import { SEO } from '@/pages/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

/** Mock transaction data */
const mockTransactions = [
  {
    id: '1',
    date: '2026-01-15T16:00:00',
    type: 'spend',
    description: 'Ayşe Yılmaz - Randevu Ödemesi',
    amount: -1500,
    balance: 2500,
  },
  {
    id: '2',
    date: '2026-01-14T10:30:00',
    type: 'deposit',
    description: 'Kredi Yüklemesi (₺500 Paket)',
    amount: 500,
    balance: 4000,
  },
  {
    id: '3',
    date: '2026-01-12T19:00:00',
    type: 'spend',
    description: 'Elif Demir - Randevu Ödemesi',
    amount: -800,
    balance: 3500,
  },
  {
    id: '4',
    date: '2026-01-10T14:00:00',
    type: 'bonus',
    description: 'Sadakat Puanı Dönüşümü',
    amount: 100,
    balance: 4300,
  },
];

/** Credit packages */
const creditPackages = [
  { id: 'pkg1', amount: 250, bonus: 0, points: 25 },
  { id: 'pkg2', amount: 500, bonus: 50, points: 60, popular: true },
  { id: 'pkg3', amount: 1000, bonus: 150, points: 150 },
  { id: 'pkg4', amount: 2500, bonus: 500, points: 400 },
];

export default function CustomerWallet() {
  const { isAdmin } = useAuth();
  const [balance] = React.useState(2500);
  const [points] = React.useState(1250);

  return (
    <ProtectedRoute accessLevel={isAdmin ? "admin" : "customer"}>
      <CustomerDashboardLayout>
        <SEO
          title="Cüzdanım | Müşteri Paneli"
          description="Bakiyenizi yönetin, kredi yükleyin ve işlem geçmişinizi takip edin."
        />

        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold font-orbitron text-white">Cüzdanım</h1>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1">
              <ShieldCheck className="w-4 h-4 mr-2" /> Güvenli Ödeme
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Balance & Points Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Balance Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-600 to-cyan-600 p-8 text-white shadow-2xl shadow-blue-500/20">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <WalletIcon className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-100 font-medium tracking-wider">TOPLAM BAKİYE</span>
                        <CreditCard className="w-6 h-6 text-blue-100" />
                      </div>
                      <div>
                        <span className="text-5xl font-black">₺{balance.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-6">
                          <Plus className="w-4 h-4 mr-2" /> Yükle
                        </Button>
                        <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold">
                          Para Gönder
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Loyalty Points Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="relative overflow-hidden border-none bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-8 text-white border border-white/5 shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Star className="w-32 h-32 text-fuchsia-500" />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-400 font-medium tracking-wider uppercase">Galaxy Puan</span>
                        <Award className="w-6 h-6 text-fuchsia-500" />
                      </div>
                      <div>
                        <span className="text-5xl font-black text-white">{points.toLocaleString('tr-TR')}</span>
                        <p className="text-xs text-blue-400 mt-2 font-medium">₺125 Değerinde</p>
                      </div>
                      <div className="pt-4">
                        <Button className="w-full bg-fuchsia-500/10 text-fuchsia-500 border border-fuchsia-500/30 hover:bg-fuchsia-500/20 font-bold">
                          Bakiyeye Dönüştür
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Credit Packages */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-fuchsia-500" />
                  <h2 className="text-xl font-bold font-orbitron text-white">Hızlı Kredi Yükleme</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {creditPackages.map((pkg) => (
                    <Card key={pkg.id} className={cn(
                      "glass border-white/10 p-4 text-center group cursor-pointer hover:border-blue-500/50 transition-all",
                      pkg.popular && "border-blue-500/50 bg-blue-500/5 ring-1 ring-blue-500/30"
                    )}>
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full text-white">
                          POPÜLER
                        </div>
                      )}
                      <div className="text-2xl font-black text-white mb-1">₺{pkg.amount}</div>
                      {pkg.bonus > 0 && (
                        <div className="text-[10px] font-bold text-green-400 mb-2">+₺{pkg.bonus} BONUS</div>
                      )}
                      <div className="text-[10px] text-muted-foreground mb-4">{pkg.points} Puan Hediye</div>
                      <Button size="sm" className="w-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30">
                        Yükle
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Transaction History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-500" />
                    <h2 className="text-xl font-bold font-orbitron text-white">İşlem Geçmişi</h2>
                  </div>
                  <Button variant="link" className="text-blue-400 p-0 h-auto">Tümünü Gör</Button>
                </div>
                <Card className="glass border-white/10 overflow-hidden">
                  <div className="divide-y divide-white/5">
                    {mockTransactions.map((tx) => (
                      <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            tx.type === 'deposit' ? "bg-green-500/10 text-green-500" :
                              tx.type === 'bonus' ? "bg-fuchsia-500/10 text-fuchsia-500" :
                                "bg-blue-500/10 text-blue-500"
                          )}>
                            {tx.type === 'deposit' ? <ArrowUpRight className="w-5 h-5" /> :
                              tx.type === 'bonus' ? <Star className="w-5 h-5" /> :
                                <ArrowDownRight className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{tx.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(tx.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "text-sm font-black",
                            tx.amount > 0 ? "text-green-500" : "text-white"
                          )}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount} ₺
                          </p>
                          <p className="text-[10px] text-muted-foreground">Bakiye: {tx.balance} ₺</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Sidebar / Info Column */}
            <div className="space-y-6">
              <Card className="glass border-white/10 overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/10">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-400" /> Galaxy Puan Sistemi
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <p className="text-xs text-gray-400"><span className="text-white font-bold">Harca Kazan:</span> Her 10₺ harcamanızda 1 puan kazanırsınız.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <p className="text-xs text-gray-400"><span className="text-white font-bold">Yükle Kazan:</span> Yüksek tutarlı yüklemelerde ekstra bonus puanlar.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <p className="text-xs text-gray-400"><span className="text-white font-bold">Değerlendir:</span> Her onaylı randevu değerlendirmesi 10 puan.</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full glass border-white/10 hover:bg-white/5 text-xs h-8">
                    Tüm Kuralları Gör
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass border-white/10 bg-gradient-to-br from-blue-600/10 to-transparent">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto">
                    <Gift className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-white text-sm">Arkadaşını Davet Et</h3>
                  <p className="text-xs text-gray-400">Her başarılı referans için ₺100 değerinde 1000 Galaxy Puan kazanın.</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 h-8 text-xs font-bold">Davet Linkini Kopyala</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CustomerDashboardLayout>
    </ProtectedRoute>
  );
}