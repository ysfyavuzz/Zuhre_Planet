/**
 * Geçmiş Randevular Sayfası
 * 
 * Müşterilerin geçmiş randevularını görüntüleyip yönetebilecekleri sayfa.
 * Tamamlanan, iptal edilen ve bekleyen randevular gösterilir.
 * 
 * @module pages/customer/History
 * @category Pages/Customer
 * 
 * Özellikler:
 * - Randevu listesi (tarih sıralı, en yeni üstte)
 * - Durum filtreleme (tamamlandı, iptal edildi, beklemede)
 * - Randevu kartları (escort bilgisi, tarih, durum, fiyat)
 * - Randevu detayları modal (tıklandığında açılır)
 * - Değerlendirme yapma butonu (henüz yapılmamışsa)
 * - Tekrar randevu al butonu
 * - Fatura görüntüleme butonu
 * - İstatistikler (toplam randevu, toplam harcama)
 * - 3D Card ve Button tasarım
 * - Arama/filtreleme özelliği
 * 
 * @example
 * ```tsx
 * import History from '@/pages/customer/History';
 * 
 * <Route path="/customer/history" element={<History />} />
 * ```
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Star,
  FileText,
  RotateCcw,
  X,
  Search,
  Filter,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
} from 'lucide-react';
import { Card3D } from '@/components/3d/Card3D';
import { Button3D } from '@/components/3d/Button3D';
import { cn } from '@/lib/utils';
import type { Appointment, AppointmentStatus } from '@/data/mockData';

/** Randevu durum konfigürasyonu */
const durumKonfig: Record<AppointmentStatus, { renk: string; etiket: string; ikon: typeof CheckCircle }> = {
  completed: { renk: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', etiket: 'Tamamlandı', ikon: CheckCircle },
  cancelled: { renk: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', etiket: 'İptal Edildi', ikon: XCircle },
  pending: { renk: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', etiket: 'Bekliyor', ikon: AlertCircle },
  confirmed: { renk: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', etiket: 'Onaylandı', ikon: CheckCircle },
  'no-show': { renk: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300', etiket: 'Gelmedi', ikon: XCircle },
};

/** Mock randevu verileri */
const mockRandevular: Appointment[] = [
  {
    id: 'apt-001',
    customerId: 'cust-001',
    customerName: 'Ahmet Kaya',
    escortId: 'esc-001',
    escortName: 'Ayşe Yılmaz',
    serviceType: 'VIP Randevu',
    date: '2025-01-15',
    time: '14:00',
    duration: 2,
    price: 1500,
    status: 'completed',
    location: {
      type: 'incall',
      city: 'İstanbul',
      district: 'Beşiktaş',
    },
    paymentStatus: 'paid',
    paymentMethod: 'wallet',
    createdAt: '2025-01-10T10:00:00',
    updatedAt: '2025-01-15T16:00:00',
    reviewId: 'rev-001',
  },
  {
    id: 'apt-002',
    customerId: 'cust-001',
    customerName: 'Ahmet Kaya',
    escortId: 'esc-002',
    escortName: 'Elif Demir',
    serviceType: 'Standart Randevu',
    date: '2025-01-12',
    time: '18:00',
    duration: 1,
    price: 800,
    status: 'completed',
    location: {
      type: 'outcall',
      address: 'Nispetiye Cad. No:15',
      city: 'İstanbul',
      district: 'Etiler',
    },
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    createdAt: '2025-01-08T14:00:00',
    updatedAt: '2025-01-12T19:00:00',
  },
  {
    id: 'apt-003',
    customerId: 'cust-001',
    customerName: 'Ahmet Kaya',
    escortId: 'esc-003',
    escortName: 'Zeynep Kara',
    serviceType: 'Premium Randevu',
    date: '2025-01-08',
    time: '20:00',
    duration: 3,
    price: 2500,
    status: 'cancelled',
    location: {
      type: 'incall',
      city: 'İstanbul',
      district: 'Şişli',
    },
    paymentStatus: 'refunded',
    paymentMethod: 'wallet',
    createdAt: '2025-01-05T09:00:00',
    updatedAt: '2025-01-07T12:00:00',
    cancelledBy: 'customer',
    cancellationReason: 'Kişisel nedenler',
  },
  {
    id: 'apt-004',
    customerId: 'cust-001',
    customerName: 'Ahmet Kaya',
    escortId: 'esc-001',
    escortName: 'Ayşe Yılmaz',
    serviceType: 'VIP Randevu',
    date: '2025-01-20',
    time: '15:00',
    duration: 2,
    price: 1500,
    status: 'confirmed',
    location: {
      type: 'incall',
      city: 'İstanbul',
      district: 'Beşiktaş',
    },
    paymentStatus: 'paid',
    paymentMethod: 'wallet',
    createdAt: '2025-01-14T11:00:00',
    updatedAt: '2025-01-14T13:00:00',
  },
  {
    id: 'apt-005',
    customerId: 'cust-001',
    customerName: 'Ahmet Kaya',
    escortId: 'esc-004',
    escortName: 'Selin Öz',
    serviceType: 'Standart Randevu',
    date: '2025-01-05',
    time: '16:00',
    duration: 1,
    price: 750,
    status: 'completed',
    location: {
      type: 'outcall',
      address: 'Bağdat Cad. No:123',
      city: 'İstanbul',
      district: 'Kadıköy',
    },
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    createdAt: '2025-01-03T10:00:00',
    updatedAt: '2025-01-05T17:00:00',
    reviewId: 'rev-002',
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

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export default function History() {
  const [, setLocation] = useLocation();
  const [randevular] = React.useState<Appointment[]>(mockRandevular);
  const [aktifFiltre, setAktifFiltre] = React.useState<AppointmentStatus | 'tumu'>('tumu');
  const [aramaMetni, setAramaMetni] = React.useState('');
  const [secilenRandevu, setSecilenRandevu] = React.useState<Appointment | null>(null);

  /** Filtrelenmiş ve aranmış randevular */
  const filtrelenmisler = React.useMemo(() => {
    let sonuc = randevular;

    // Durum filtresi
    if (aktifFiltre !== 'tumu') {
      sonuc = sonuc.filter(r => r.status === aktifFiltre);
    }

    // Arama filtresi
    if (aramaMetni) {
      const aramaTerimi = aramaMetni.toLowerCase();
      sonuc = sonuc.filter(r =>
        r.escortName.toLowerCase().includes(aramaTerimi) ||
        r.serviceType.toLowerCase().includes(aramaTerimi) ||
        r.location.city.toLowerCase().includes(aramaTerimi) ||
        r.location.district.toLowerCase().includes(aramaTerimi)
      );
    }

    // Tarihe göre sırala (en yeni üstte)
    return sonuc.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [randevular, aktifFiltre, aramaMetni]);

  /** İstatistikler */
  const istatistikler = React.useMemo(() => {
    const tamamlananlar = randevular.filter(r => r.status === 'completed');
    const toplamHarcama = tamamlananlar.reduce((toplam, r) => toplam + r.price, 0);
    const ortalamaTutar = tamamlananlar.length > 0 ? toplamHarcama / tamamlananlar.length : 0;

    return {
      toplamRandevu: randevular.length,
      tamamlananRandevu: tamamlananlar.length,
      iptalEdilenRandevu: randevular.filter(r => r.status === 'cancelled').length,
      toplamHarcama,
      ortalamaTutar,
    };
  }, [randevular]);

  /** Tarihi formatla */
  const tarihFormatla = (tarih: string) => {
    return new Date(tarih).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  /** Değerlendirme yap */
  const degerlendirmeYap = (randevu: Appointment) => {
    // TODO: Değerlendirme modalını aç
    console.log('Değerlendirme yapılacak:', randevu.id);
  };

  /** Tekrar randevu al */
  const tekrarRandevuAl = (randevu: Appointment) => {
    setLocation(`/escort/${randevu.escortId}`);
  };

  /** Fatura görüntüle */
  const faturaGoruntule = (randevu: Appointment) => {
    // TODO: Fatura modalını aç veya PDF indir
    console.log('Fatura görüntülenecek:', randevu.id);
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
            Randevu Geçmişi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tüm geçmiş randevularınızı görüntüleyin ve yönetin
          </p>
        </motion.div>

        {/* İstatistik Kartları */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card3D padding="md" className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              {istatistikler.toplamRandevu}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Randevu</div>
          </Card3D>

          <Card3D padding="md" className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {istatistikler.tamamlananRandevu}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tamamlanan</div>
          </Card3D>

          <Card3D padding="md" className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {istatistikler.toplamHarcama.toLocaleString('tr-TR')}₺
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Harcama</div>
          </Card3D>

          <Card3D padding="md" className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {istatistikler.ortalamaTutar.toLocaleString('tr-TR')}₺
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Ortalama Tutar</div>
          </Card3D>
        </motion.div>

        {/* Filtreler ve Arama */}
        <Card3D className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Arama */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Escort adı, hizmet türü, şehir veya ilçe ara..."
                  value={aramaMetni}
                  onChange={(e) => setAramaMetni(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Durum Filtreleri */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setAktifFiltre('tumu')}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  aktifFiltre === 'tumu'
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                )}
              >
                <Filter className="h-4 w-4 inline mr-2" />
                Tümü ({randevular.length})
              </button>
              <button
                onClick={() => setAktifFiltre('completed')}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  aktifFiltre === 'completed'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                )}
              >
                Tamamlandı ({randevular.filter(r => r.status === 'completed').length})
              </button>
              <button
                onClick={() => setAktifFiltre('cancelled')}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  aktifFiltre === 'cancelled'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                )}
              >
                İptal Edildi ({randevular.filter(r => r.status === 'cancelled').length})
              </button>
              <button
                onClick={() => setAktifFiltre('confirmed')}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  aktifFiltre === 'confirmed'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                )}
              >
                Bekliyor ({randevular.filter(r => r.status === 'confirmed' || r.status === 'pending').length})
              </button>
            </div>
          </div>
        </Card3D>

        {/* Randevu Listesi */}
        {filtrelenmisler.length === 0 ? (
          <Card3D className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Randevu Bulunamadı
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {aramaMetni
                ? `"${aramaMetni}" için randevu bulunamadı.`
                : aktifFiltre === 'tumu'
                ? 'Henüz hiç randevunuz yok.'
                : `${durumKonfig[aktifFiltre].etiket} durumunda randevu bulunamadı.`
              }
            </p>
          </Card3D>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filtrelenmisler.map((randevu) => {
              const durum = durumKonfig[randevu.status];
              const DurumIkon = durum.ikon;

              return (
                <motion.div key={randevu.id} variants={itemVariants}>
                  <Card3D
                    className="cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => setSecilenRandevu(randevu)}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Sol: Escort Bilgisi */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {randevu.escortName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {randevu.escortName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {randevu.serviceType}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {tarihFormatla(randevu.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {randevu.time} ({randevu.duration} saat)
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {randevu.location.district}, {randevu.location.city}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Sağ: Durum ve Fiyat */}
                      <div className="flex flex-col items-end justify-between">
                        <div className="flex flex-col items-end gap-2">
                          <span className={cn('inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium', durum.renk)}>
                            <DurumIkon className="h-3 w-3" />
                            {durum.etiket}
                          </span>
                          <div className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                            {randevu.price.toLocaleString('tr-TR')}₺
                          </div>
                        </div>

                        {/* Aksiyon Butonları */}
                        <div className="flex gap-2 mt-4">
                          {randevu.status === 'completed' && !randevu.reviewId && (
                            <Button3D
                              variant="primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                degerlendirmeYap(randevu);
                              }}
                            >
                              <Star className="h-4 w-4" />
                            </Button3D>
                          )}
                          <Button3D
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              faturaGoruntule(randevu);
                            }}
                          >
                            <FileText className="h-4 w-4" />
                          </Button3D>
                          <Button3D
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              tekrarRandevuAl(randevu);
                            }}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button3D>
                        </div>
                      </div>
                    </div>
                  </Card3D>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Randevu Detayları Modal */}
        <AnimatePresence>
          {secilenRandevu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSecilenRandevu(null)}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Card3D className="max-h-[90vh] overflow-y-auto">
                  {/* Modal Başlık */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      Randevu Detayları
                    </h2>
                    <button
                      onClick={() => setSecilenRandevu(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Escort Bilgisi */}
                  <div className="mb-6 p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {secilenRandevu.escortName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {secilenRandevu.escortName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{secilenRandevu.serviceType}</p>
                      </div>
                    </div>
                  </div>

                  {/* Detaylar Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-rose-600" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Tarih</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {tarihFormatla(secilenRandevu.date)}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-rose-600" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Saat ve Süre</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {secilenRandevu.time} ({secilenRandevu.duration} saat)
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-5 w-5 text-rose-600" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Konum</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {secilenRandevu.location.type === 'incall' ? 'İç Mekan' : 'Dış Mekan'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {secilenRandevu.location.address || `${secilenRandevu.location.district}, ${secilenRandevu.location.city}`}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-rose-600" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Ücret</span>
                      </div>
                      <p className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                        {secilenRandevu.price.toLocaleString('tr-TR')}₺
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {secilenRandevu.paymentMethod === 'wallet' && 'Cüzdan'}
                        {secilenRandevu.paymentMethod === 'credit_card' && 'Kredi Kartı'}
                        {secilenRandevu.paymentMethod === 'cash' && 'Nakit'}
                      </p>
                    </div>
                  </div>

                  {/* Durum */}
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Durum</span>
                      <span className={cn('inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium', durumKonfig[secilenRandevu.status].renk)}>
                        {React.createElement(durumKonfig[secilenRandevu.status].ikon, { className: 'h-4 w-4' })}
                        {durumKonfig[secilenRandevu.status].etiket}
                      </span>
                    </div>
                    {secilenRandevu.cancelledBy && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <strong>İptal Eden:</strong> {secilenRandevu.cancelledBy === 'customer' ? 'Müşteri' : 'Escort'}
                        {secilenRandevu.cancellationReason && ` - ${secilenRandevu.cancellationReason}`}
                      </p>
                    )}
                  </div>

                  {/* Notlar */}
                  {secilenRandevu.notes && (
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Notlar</h4>
                      <p className="text-gray-600 dark:text-gray-400">{secilenRandevu.notes}</p>
                    </div>
                  )}

                  {/* Aksiyon Butonları */}
                  <div className="flex flex-wrap gap-3">
                    {secilenRandevu.status === 'completed' && !secilenRandevu.reviewId && (
                      <Button3D
                        variant="primary"
                        size="md"
                        onClick={() => degerlendirmeYap(secilenRandevu)}
                        fullWidth
                      >
                        <Star className="h-5 w-5" />
                        Değerlendirme Yap
                      </Button3D>
                    )}
                    <Button3D
                      variant="outline"
                      size="md"
                      onClick={() => faturaGoruntule(secilenRandevu)}
                      fullWidth
                    >
                      <FileText className="h-5 w-5" />
                      Fatura Görüntüle
                    </Button3D>
                    <Button3D
                      variant="secondary"
                      size="md"
                      onClick={() => tekrarRandevuAl(secilenRandevu)}
                      fullWidth
                    >
                      <RotateCcw className="h-5 w-5" />
                      Tekrar Randevu Al
                    </Button3D>
                  </div>
                </Card3D>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
