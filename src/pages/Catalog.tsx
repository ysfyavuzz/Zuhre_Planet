import { useState } from 'react';
import { useSearchParams } from 'wouter';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { StandardCard } from '@/components/StandardCard';
import { VipPremiumCard } from '@/components/VipPremiumCard';
import { mockEscorts } from '@/mockData';
import { locations } from '@/locations';

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const city = searchParams.get('city') || 'all';
  const service = searchParams.get('service') || 'all';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEscorts = mockEscorts.filter(escort => {
    const matchesCity = city === 'all' || escort.city?.toLowerCase() === city.toLowerCase();
    const matchesService = service === 'all' || (escort.services?.some(s =>
      s.toLowerCase().includes(service.toLowerCase())
    ) ?? false);
    const matchesSearch = searchQuery === '' ||
      escort.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      escort.city?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCity && matchesService && matchesSearch;
  });

  const vipEscorts = filteredEscorts.filter(m => m.isVip === true);
  const standardEscorts = filteredEscorts.filter(m => m.isVip === false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {city === 'all' ? 'Tüm Escortlar' : locations.find(l => l.id === city)?.name || city}
          </h1>
          <p className="text-gray-600">
            {filteredEscorts.length} escort bulundu
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="İsim veya şehir ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* VIP/Premium Section */}
        {vipEscorts.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-900">Öne Çıkanlar</h2>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                VIP & PREMIUM
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vipEscorts.map(escort => (
                <VipPremiumCard key={escort.id} escort={escort} />
              ))}
            </div>
          </div>
        )}

        {/* Standard Section */}
        {standardEscorts.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-900">Diğer Escortlar</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {standardEscorts.map(escort => (
                <StandardCard key={escort.id} escort={escort} />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredEscorts.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Sonuç bulunamadı</h3>
            <p className="mt-1 text-gray-500">Arama kriterlerinize uygun escort bulunamadı.</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
