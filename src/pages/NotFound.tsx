import { useLocation } from 'wouter';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center pb-20">
      <div className="max-w-lg w-full mx-4 text-center">
        {/* 404 Animation/Graphic */}
        <div className="mb-8 relative">
          <div className="text-[180px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 leading-none">
            404
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg className="w-24 h-24 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Sayfa Bulunamadı
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setLocation('/')}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg"
          >
            <Home className="w-5 h-5" />
            Ana Sayfaya Dön
          </button>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition shadow-md border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Geri Git
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aramak mı istiyorsunuz?</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLocation('/')}
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition text-left"
            >
              <Search className="w-5 h-5 text-pink-600" />
              <span className="text-gray-700">Katalog</span>
            </button>
            <button
              onClick={() => setLocation('/catalog')}
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition text-left"
            >
              <Search className="w-5 h-5 text-purple-600" />
              <span className="text-gray-700">Şehirlere Göre</span>
            </button>
            <button
              onClick={() => setLocation('/favorites')}
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition text-left"
            >
              <Search className="w-5 h-5 text-red-500" />
              <span className="text-gray-700">Favorilerim</span>
            </button>
            <button
              onClick={() => setLocation('/register')}
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition text-left"
            >
              <Search className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Kayıt Ol</span>
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 text-sm text-gray-500">
          Sorun yaşıyorsanız{' '}
          <a href="mailto:destek@example.com" className="text-pink-600 hover:underline">
            destek@example.com
          </a>
          {' '}adresinden bizimle iletişime geçin.
        </div>
      </div>
    </div>
  );
}
