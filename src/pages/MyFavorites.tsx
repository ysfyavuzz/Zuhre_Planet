import { useState } from 'react';
import { useLocation } from 'wouter';
import { Heart, Star, MapPin, Phone, MessageCircle, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

interface FavoriteEscort {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  rating: number;
  membership: 'standard' | 'vip' | 'premium';
  services: string[];
  phone: string;
  addedAt: string;
}

export default function MyFavorites() {
  const [, setLocation] = useLocation();
  const [favorites, setFavorites] = useState<FavoriteEscort[]>([
    {
      id: '1',
      name: 'Ayşe Y.',
      age: 25,
      location: 'İstanbul - Kadıköy',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 4.8,
      membership: 'vip',
      services: ['Masaj', 'Fantezi', 'Geyşa Masajı'],
      phone: '+90 555 123 4567',
      addedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Elif K.',
      age: 23,
      location: 'İstanbul - Beşiktaş',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 4.9,
      membership: 'premium',
      services: ['Mutlu Son', 'Vücut Masajı', 'Aromaterapi'],
      phone: '+90 555 987 6543',
      addedAt: '2024-01-14'
    },
    {
      id: '3',
      name: 'Zeynep M.',
      age: 27,
      location: 'Ankara - Çankaya',
      avatar: 'https://i.pravatar.cc/150?img=9',
      rating: 4.7,
      membership: 'standard',
      services: ['Thai Masajı', 'Spa Masajı'],
      phone: '+90 555 456 7890',
      addedAt: '2024-01-13'
    }
  ]);

  const [showPhone, setShowPhone] = useState<string | null>(null);

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const getMembershipBadge = (membership: string) => {
    const badges = {
      vip: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'VIP' },
      premium: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'PREMIUM' },
      standard: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'STANDARD' }
    };
    return badges[membership as keyof typeof badges];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Favorilerim</h1>
              <p className="text-gray-600">{favorites.length} favori escort</p>
            </div>
          </div>
        </div>

        {/* Favorites List */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Favorileriniz Boş</h2>
            <p className="text-gray-600 mb-6">
              Henüz favori escort eklemediniz. Beğendiğiniz escortları favorilere ekleyebilirsiniz.
            </p>
            <button
              onClick={() => setLocation('/')}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700"
            >
              Escortları Keşfet
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map(escort => {
              const badge = getMembershipBadge(escort.membership);

              return (
                <div
                  key={escort.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Avatar */}
                    <div className="md:w-48 h-48 md:h-auto relative">
                      <img
                        src={escort.avatar}
                        alt={escort.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">{escort.name}</h3>
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-medium">{escort.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{escort.location}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFavorite(escort.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Favorilerden Çıkar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Services */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {escort.services.map((service, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                          >
                            {service}
                          </span>
                        ))}
                      </div>

                      {/* Added Date */}
                      <p className="text-sm text-gray-500 mb-4">
                        {formatDate(escort.addedAt)} tarihinde eklendi
                      </p>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => setLocation(`/escort/${escort.id}`)}
                          className="flex-1 bg-pink-600 text-white py-2 rounded-lg font-medium hover:bg-pink-700 flex items-center justify-center gap-2"
                        >
                          Profili Gör
                        </button>
                        <button
                          onClick={() => setShowPhone(showPhone === escort.id ? null : escort.id)}
                          className="px-4 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          {showPhone === escort.id ? escort.phone : 'Ara'}
                        </button>
                        <button className="px-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Box */}
        {favorites.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Favorileriniz Hakkında</h4>
                <p className="text-sm text-blue-700">
                  Favori escortlarınız bu listede saklanır. Escortlar hesaplarını kapatabilir veya bilgilerini güncelleyebilir.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
