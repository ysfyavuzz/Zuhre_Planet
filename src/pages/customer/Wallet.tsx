/**
 * Cüzdan ve Kredi Yönetimi Sayfası
 * 
 * Müşterilerin cüzdan bakiyesi, kredi yükleme ve işlem geçmişini yönetebilecekleri sayfa.
 * Sadakat puanları ve puan kullanımı da bu sayfada gösterilir.
 * 
 * @module pages/customer/Wallet
 * @category Pages/Customer
 * 
 * Özellikler:
 * - Mevcut bakiye kartı (büyük, gösterişli)
 * - Sadakat puanları kartı
 * - Kredi yükleme paketleri (100₺, 250₺, 500₺, 1000₺)
 * - İşlem geçmişi tablosu (tarih, açıklama, tutar, bakiye)
 * - Puan kazanma kuralları bölümü (info card)
 * - Puan harcama seçenekleri
 * - İstatistikler (toplam yükleme, toplam harcama, kazanılan puan)
 * - 3D Card ve Button tasarım
 * - Gradient renk temaları
 * 
 * @example
 * ```tsx
 * import Wallet from '@/pages/customer/Wallet';
 * 
 * <Route path="/customer/wallet" element={<Wallet />} />
 * ```
 */

import * as React from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Card3D } from '@/components/3d/Card3D';
import { Button3D } from '@/components/3d/Button3D';
import { cn } from '@/lib/utils';

/** İşlem türü */
type IslemTuru = 'yukleme' | 'harcama' | 'puan_kazanma' | 'puan_harcama' | 'iade';

/** İşlem arayüzü */
interface Islem {
  id: string;
  tarih: string;
  tur: IslemTuru;
  aciklama: string;
  tutar: number;
  bakiye: number;
  puan?: number;
}

/** Kredi paketi arayüzü */
interface KrediPaketi {
  id: string;
  tutar: number;
  bonus: number;
  ekPuan: number;
  populer?: boolean;
}

/** Mock işlem verileri */
const mockIslemler: Islem[] = [
  {
    id: '1',
    tarih: '2025-01-15T16:00:00',
    tur: 'harcama',
    aciklama: 'Ayşe Yılmaz - VIP Randevu',
    tutar: -1500,
    bakiye: 2500,
    puan: 150,
  },
  {
    id: '2',
    tarih: '2025-01-14T10:30:00',
    tur: 'yukleme',
    aciklama: 'Kredi Yüklemesi (500₺ Paket)',
    tutar: 500,
    bakiye: 4000,
  },
  {
    id: '3',
    tarih: '2025-01-12T19:00:00',
    tur: 'harcama',
    aciklama: 'Elif Demir - Standart Randevu',
    tutar: -800,
    bakiye: 3500,
    puan: 80,
  },
  {
    id: '4',
    tarih: '2025-01-10T14:00:00',
    tur: 'puan_kazanma',
    aciklama: 'Arkadaş Davet Bonusu',
    tutar: 0,
    bakiye: 4300,
    puan: 100,
  },
  {
    id: '5',
    tarih: '2025-01-08T12:00:00',
    tur: 'iade',
    aciklama: 'İptal Edilen Randevu İadesi',
    tutar: 2500,
    bakiye: 4300,
  },
  {
    id: '6',
    tarih: '2025-01-07T18:45:00',
    tur: 'yukleme',
    aciklama: 'Kredi Yüklemesi (1000₺ Paket)',
    tutar: 1000,
    bakiye: 1800,
  },
  {
    id: '7',
    tarih: '2025-01-05T17:00:00',
    tur: 'harcama',
    aciklama: 'Selin Öz - Standart Randevu',
    tutar: -750,
    bakiye: 800,
    puan: 75,
  },
  {
    id: '8',
    tarih: '2025-01-03T10:00:00',
    tur: 'yukleme',
    aciklama: 'Kredi Yüklemesi (250₺ Paket)',
    tutar: 250,
    bakiye: 1550,
  },
  {
    id: '9',
    tarih: '2025-01-02T09:00:00',
    tur: 'puan_harcama',
    aciklama: '500 Puan ile 50₺ İndirim',
    tutar: 50,
    bakiye: 1300,
    puan: -500,
  },
  {
    id: '10',
    tarih: '2025-01-01T20:00:00',
    tur: 'puan_kazanma',
    aciklama: 'Yeni Yıl Bonusu',
    tutar: 0,
    bakiye: 1250,
    puan: 200,
  },
];

/** Kredi paketleri */
const krediPaketleri: KrediPaketi[] = [
  {
    id: 'paket-100',
    tutar: 100,
    bonus: 0,
    ekPuan: 10,
  },
  {
    id: 'paket-250',
    tutar: 250,
    bonus: 25,
    ekPuan: 30,
  },
  {
    id: 'paket-500',
    tutar: 500,
    bonus: 75,
    ekPuan: 75,
    populer: true,
  },
  {
    id: 'paket-1000',
    tutar: 1000,
    bonus: 200,
    ekPuan: 200,
  },
];

/** Animasyon varyantları */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Wallet() {
  const [bakiye] = React.useState(2500);
  const [sadakatPuani] = React.useState(1250);
  const [islemler] = React.useState<Islem[]>(mockIslemler);
  const [seciliPaket, setSeciliPaket] = React.useState<KrediPaketi | null>(null);

  /** İstatistikler */
  const istatistikler = React.useMemo(() => {
    const yuklemeler = islemler.filter(i => i.tur === 'yukleme');
    const harcamalar = islemler.filter(i => i.tur === 'harcama');
    const puanKazanmalar = islemler.filter(i => i.tur === 'puan_kazanma' || (i.puan !== undefined && i.puan > 0));

    const toplamYukleme = yuklemeler.reduce((toplam, i) => toplam + i.tutar, 0);
    const toplamHarcama = Math.abs(harcamalar.reduce((toplam, i) => toplam + i.tutar, 0));
    const toplamPuan = puanKazanmalar.reduce((toplam, i) => toplam + (i.puan || 0), 0);

    return {
      toplamYukleme,
      toplamHarcama,
      toplamPuan,
      yuklemeAdedi: yuklemeler.length,
    };
  }, [islemler]);

  /** Tarihi formatla */
  const tarihFormatla = (tarih: string) => {
    return new Date(tarih).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /** Kredi yükle */
  const krediYukle = (paket: KrediPaketi) => {
    setSeciliPaket(paket);
    // TODO: Ödeme modalını aç
  };

  /** İşlem türü konfigurasyon */
  const islemTurKonfig: Record<IslemTuru, { ikon: typeof ArrowUpRight; renk: string; etiket: string }> = {
    yukleme: { ikon: ArrowUpRight, renk: 'text-green-600', etiket: 'Yükleme' },
    harcama: { ikon: ArrowDownRight, renk: 'text-red-600', etiket: 'Harcama' },
    puan_kazanma: { ikon: Star, renk: 'text-sky-600', etiket: 'Puan Kazanma' },
    puan_harcama: { ikon: Gift, renk: 'text-purple-600', etiket: 'Puan Harcama' },
    iade: { ikon: ArrowUpRight, renk: 'text-blue-600', etiket: 'İade' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Cüzdan ve Kredi Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bakiyenizi yönetin, kredi yükleyin ve sadakat puanlarınızı kullanın
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol: Bakiye ve Paketler */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bakiye ve Sadakat Kartları */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Bakiye Kartı */}
              <Card3D
                padding="lg"
                className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 border-none"
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <WalletIcon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white/90 font-medium">Mevcut Bakiye</span>
                    </div>
                    <CreditCard className="h-6 w-6 text-white/60" />
                  </div>
                  <div className="mb-2">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-1">
                      {bakiye.toLocaleString('tr-TR')}₺
                    </div>
                    <div className="text-white/70 text-sm">
                      Son işlem: {tarihFormatla(islemler[0].tarih)}
                    </div>
                  </div>
                </div>
              </Card3D>

              {/* Sadakat Puanları Kartı */}
              <Card3D
                padding="lg"
                className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 border-none"
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white/90 font-medium">Sadakat Puanı</span>
                    </div>
                    <Award className="h-6 w-6 text-white/60" />
                  </div>
                  <div className="mb-2">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-1">
                      {sadakatPuani.toLocaleString('tr-TR')}
                    </div>
                    <div className="text-white/70 text-sm">
                      500 puan = 50₺ indirim
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>

            {/* İstatistikler */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <Card3D padding="sm" className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {istatistikler.toplamYukleme.toLocaleString('tr-TR')}₺
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Toplam Yükleme</div>
              </Card3D>

              <Card3D padding="sm" className="text-center">
                <TrendingDown className="h-8 w-8 mx-auto text-red-600 mb-2" />
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {istatistikler.toplamHarcama.toLocaleString('tr-TR')}₺
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Toplam Harcama</div>
              </Card3D>

              <Card3D padding="sm" className="text-center">
                <Star className="h-8 w-8 mx-auto text-sky-600 mb-2" />
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {istatistikler.toplamPuan.toLocaleString('tr-TR')}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Kazanılan Puan</div>
              </Card3D>

              <Card3D padding="sm" className="text-center">
                <ShoppingBag className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {istatistikler.yuklemeAdedi}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Yükleme Adedi</div>
              </Card3D>
            </motion.div>

            {/* Kredi Paketleri */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card3D>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-rose-600" />
                  Kredi Yükleme Paketleri
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {krediPaketleri.map((paket) => (
                    <motion.div
                      key={paket.id}
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        'relative p-6 rounded-xl border-2 transition-all cursor-pointer',
                        paket.populer
                          ? 'border-rose-600 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-rose-300'
                      )}
                      onClick={() => krediYukle(paket)}
                    >
                      {paket.populer && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-rose-600 to-pink-600 text-white">
                            <Zap className="h-3 w-3" />
                            En Popüler
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                          {paket.tutar}₺
                        </div>
                        
                        {paket.bonus > 0 && (
                          <div className="text-green-600 font-semibold mb-2">
                            + {paket.bonus}₺ Bonus
                          </div>
                        )}
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 text-sky-600" />
                            +{paket.ekPuan} Sadakat Puanı
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                          Toplam Kazanç: {paket.tutar + paket.bonus}₺
                        </div>
                        
                        <Button3D
                          variant={paket.populer ? 'primary' : 'outline'}
                          size="sm"
                          fullWidth
                          onClick={() => krediYukle(paket)}
                        >
                          <Plus className="h-4 w-4" />
                          Yükle
                        </Button3D>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card3D>
            </motion.div>

            {/* İşlem Geçmişi */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card3D>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  İşlem Geçmişi
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Tarih
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Açıklama
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Tutar
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Bakiye
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {islemler.map((islem) => {
                        const konfig = islemTurKonfig[islem.tur];
                        const Ikon = konfig.ikon;

                        return (
                          <tr
                            key={islem.id}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                              {new Date(islem.tarih).toLocaleDateString('tr-TR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Ikon className={cn('h-4 w-4 flex-shrink-0', konfig.renk)} />
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {islem.aciklama}
                                  </div>
                                  {islem.puan !== undefined && islem.puan !== 0 && (
                                    <div className="text-xs text-sky-600 flex items-center gap-1">
                                      <Star className="h-3 w-3" />
                                      {islem.puan > 0 ? '+' : ''}{islem.puan} puan
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className={cn(
                              'py-3 px-4 text-sm font-semibold text-right',
                              islem.tutar > 0 ? 'text-green-600' : islem.tutar < 0 ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'
                            )}>
                              {islem.tutar > 0 && '+'}
                              {islem.tutar !== 0 ? `${islem.tutar.toLocaleString('tr-TR')}₺` : '-'}
                            </td>
                            <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                              {islem.bakiye.toLocaleString('tr-TR')}₺
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card3D>
            </motion.div>
          </div>

          {/* Sağ: Bilgi Kartları */}
          <div className="space-y-6">
            {/* Puan Kazanma Kuralları */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card3D>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-br from-sky-500 to-blue-500 rounded-lg">
                    <Info className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Puan Kazanma Kuralları
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        Randevu Tamamlama
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Her 10₺ harcama için 1 puan
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        Kredi Yükleme
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Paket bonuslarıyla ek puan kazanın
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        Arkadaş Daveti
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Her davet için 100 puan
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        Değerlendirme Yapma
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Her değerlendirme için 25 puan
                      </div>
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>

            {/* Puan Harcama Seçenekleri */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card3D>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Puan Harcama
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        500 Puan
                      </span>
                      <span className="text-purple-600 font-bold">
                        = 50₺
                      </span>
                    </div>
                    <Button3D
                      variant="primary"
                      size="sm"
                      fullWidth
                      disabled={sadakatPuani < 500}
                    >
                      <Gift className="h-4 w-4" />
                      Kullan
                    </Button3D>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        1000 Puan
                      </span>
                      <span className="text-purple-600 font-bold">
                        = 120₺
                      </span>
                    </div>
                    <Button3D
                      variant="primary"
                      size="sm"
                      fullWidth
                      disabled={sadakatPuani < 1000}
                    >
                      <Gift className="h-4 w-4" />
                      Kullan
                    </Button3D>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        2000 Puan
                      </span>
                      <span className="text-purple-600 font-bold">
                        = 300₺
                      </span>
                    </div>
                    <Button3D
                      variant="primary"
                      size="sm"
                      fullWidth
                      disabled={sadakatPuani < 2000}
                    >
                      <Gift className="h-4 w-4" />
                      Kullan
                    </Button3D>
                  </div>
                </div>
              </Card3D>
            </motion.div>

            {/* Özel Kampanyalar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card3D className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border-2 border-sky-200 dark:border-sky-800">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-6 w-6 text-amber-600" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Özel Kampanyalar
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <div className="font-semibold mb-1">🎉 Yeni Yıl Kampanyası</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      1000₺ ve üzeri yüklemelerde %20 bonus!
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <div className="font-semibold mb-1">💝 İlk Randevu Hediyesi</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      İlk randevunuzda 200 puan kazanın!
                    </div>
                  </div>
                  <Button3D variant="primary" size="sm" fullWidth>
                    Tüm Kampanyalar
                  </Button3D>
                </div>
              </Card3D>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
