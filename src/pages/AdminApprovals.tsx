import { useState } from 'react';
import { Check, X, Eye, Search, Filter, Download } from 'lucide-react';
import Header from '@/components/Header';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface PendingEscort {
  id: string;
  name: string;
  age: number;
  city: string;
  phone: string;
  email: string;
  avatar: string;
  services: string[];
  bio: string;
  membership: 'standard' | 'vip' | 'premium';
  submittedAt: string;
  status: ApprovalStatus;
}

export default function AdminApprovals() {
  const [activeTab, setActiveTab] = useState<ApprovalStatus>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEscort, setSelectedEscort] = useState<PendingEscort | null>(null);

  // Mock data - replace with actual API call
  const [pendingEscorts, setPendingEscorts] = useState<PendingEscort[]>([
    {
      id: '1',
      name: 'Ayşe Y.',
      age: 25,
      city: 'İstanbul',
      phone: '+90 555 123 4567',
      email: 'ayse@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      services: ['Masaj', 'Fantezi', 'Geyşa Masajı'],
      bio: 'Profesyonel escort, 5 yıllık deneyim.',
      membership: 'standard',
      submittedAt: '2024-01-15T10:30:00',
      status: 'pending'
    },
    {
      id: '2',
      name: 'Elif K.',
      age: 23,
      city: 'Ankara',
      phone: '+90 555 987 6543',
      email: 'elif@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5',
      services: ['Mutlu Son', 'Vücut Masajı', 'Aromaterapi'],
      bio: 'Genç ve dinamik, size unutulmaz anlar yaşatacağım.',
      membership: 'vip',
      submittedAt: '2024-01-15T09:15:00',
      status: 'pending'
    },
    {
      id: '3',
      name: 'Zeynep M.',
      age: 27,
      city: 'İzmir',
      phone: '+90 555 456 7890',
      email: 'zeynep@example.com',
      avatar: 'https://i.pravatar.cc/150?img=9',
      services: ['Thai Masajı', 'Spa Masajı', 'Balinese Masajı'],
      bio: 'Uzman escort, lüks spa merkezinde çalışıyorum.',
      membership: 'premium',
      submittedAt: '2024-01-14T16:45:00',
      status: 'pending'
    }
  ]);

  const filteredEscorts = pendingEscorts.filter(escort => {
    const matchesTab = escort.status === activeTab;
    const matchesSearch = searchQuery === '' ||
      escort.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      escort.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      escort.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleApprove = (id: string) => {
    setPendingEscorts(prev =>
      prev.map(e => e.id === id ? { ...e, status: 'approved' } : e)
    );
    setSelectedEscort(null);
  };

  const handleReject = (id: string) => {
    setPendingEscorts(prev =>
      prev.map(e => e.id === id ? { ...e, status: 'rejected' } : e)
    );
    setSelectedEscort(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Bekliyor' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Onaylandı' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Reddedildi' }
    };
    const badge = badges[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const stats = {
    pending: pendingEscorts.filter(e => e.status === 'pending').length,
    approved: pendingEscorts.filter(e => e.status === 'approved').length,
    rejected: pendingEscorts.filter(e => e.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Escort Onay Paneli</h1>
          <p className="text-gray-600">Kayıt başvurularını inceleyin ve onaylayın</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Bekleyen</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Filter className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Onaylanan</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Reddedilen</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b">
            <div className="flex">
              {(['pending', 'approved', 'rejected'] as ApprovalStatus[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium transition ${
                    activeTab === tab
                      ? 'text-pink-600 border-b-2 border-pink-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'pending' && 'Bekleyen'}
                  {tab === 'approved' && 'Onaylanan'}
                  {tab === 'rejected' && 'Reddedilen'}
                  {stats[tab] > 0 && (
                    <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {stats[tab]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="İsim, şehir veya e-posta ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Escorts List */}
        <div className="space-y-4">
          {filteredEscorts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'pending' && 'Bekleyen başvuru bulunmuyor'}
                {activeTab === 'approved' && 'Onaylanan başvuru bulunmuyor'}
                {activeTab === 'rejected' && 'Reddedilen başvuru bulunmuyor'}
              </h3>
              <p className="text-gray-500">
                {searchQuery && 'Arama kriterlerinize uygun sonuç bulunamadı.'}
              </p>
            </div>
          ) : (
            filteredEscorts.map(escort => (
              <div key={escort.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <img
                    src={escort.avatar}
                    alt={escort.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{escort.name}</h3>
                        <p className="text-gray-600">{escort.city} • {escort.age} yaş</p>
                      </div>
                      {getStatusBadge(escort.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-gray-500">Telefon:</span>
                        <span className="ml-2 text-gray-900">{escort.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">E-posta:</span>
                        <span className="ml-2 text-gray-900">{escort.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Üyelik:</span>
                        <span className="ml-2 text-gray-900 uppercase">{escort.membership}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Başvuru:</span>
                        <span className="ml-2 text-gray-900">{formatDate(escort.submittedAt)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {escort.services.map((service, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs"
                        >
                          {service}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-700 text-sm line-clamp-2">{escort.bio}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedEscort(escort)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                      title="Detayları Gör"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {activeTab === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(escort.id)}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition"
                          title="Onayla"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleReject(escort.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                          title="Reddet"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Modal */}
        {selectedEscort && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Başvuru Detayı</h2>
                  <button
                    onClick={() => setSelectedEscort(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex gap-6 mb-6">
                  <img
                    src={selectedEscort.avatar}
                    alt={selectedEscort.name}
                    className="w-32 h-32 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedEscort.name}</h3>
                    <p className="text-gray-600 mb-2">{selectedEscort.city} • {selectedEscort.age} yaş</p>
                    {getStatusBadge(selectedEscort.status)}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">İletişim Bilgileri</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Telefon:</span>
                        <span className="ml-2">{selectedEscort.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">E-posta:</span>
                        <span className="ml-2">{selectedEscort.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Hizmetler</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEscort.services.map((service, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Hakkında</h4>
                    <p className="text-gray-700">{selectedEscort.bio}</p>
                  </div>
                </div>

                {activeTab === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(selectedEscort.id)}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Onayla
                    </button>
                    <button
                      onClick={() => handleReject(selectedEscort.id)}
                      className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Reddet
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
