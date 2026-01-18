/**
 * AgeVerification Component
 * 
 * Modal component for verifying user age before accessing adult content.
 * Stores verification status in localStorage to avoid repeated prompts.
 * Includes HOC and hook for protecting components/routes.
 * 
 * @module components/AgeVerification
 * @category Components - Security
 * 
 * Features:
 * - 18+ age verification modal
 * - localStorage persistence
 * - Non-dismissable until action taken
 * - Redirect option for underage users
 * - HOC for component protection
 * - Custom hook for verification status
 * 
 * @example
 * ```tsx
 * // Direct usage
 * <AgeVerification onConfirm={() => console.log('Verified')} minimumAge={18} />
 * 
 * // Using HOC
 * const ProtectedPage = withAgeVerification(MyPage);
 * 
 * // Using hook
 * const isVerified = useAgeVerification();
 * ```
 */

import { useState, useEffect } from 'react';
import { Shield, Calendar, X } from 'lucide-react';

/**
 * Props for AgeVerification component
 */
interface AgeVerificationProps {
  onConfirm: () => void;
  minimumAge?: number;
}

const STORAGE_KEY = 'age-verified';

export default function AgeVerification({ onConfirm, minimumAge = 18 }: AgeVerificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user already verified
    const verified = localStorage.getItem(STORAGE_KEY);

    if (!verified) {
      setIsVisible(true);
    }

    setIsLoading(false);
  }, []);

  const handleConfirm = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setIsVisible(false);
    onConfirm();
  };

  const handleReject = () => {
    // Redirect to a safe site
    window.location.href = 'https://www.google.com';
  };

  if (isLoading || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
        {/* Close button (disabled) */}
        <button
          disabled
          className="absolute top-4 right-4 text-gray-400 cursor-not-allowed"
          title="Yaş doğrulaması gerekli"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-pink-600" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Yaş Doğrulaması Gerekli
          </h2>

          <p className="text-gray-600 mb-4">
            Bu web sitesinde yetişkinlere yönelik içerikler bulunmaktadır.
            Devam etmek için {minimumAge} yaşından büyük olduğunuzu onaylamanız gerekmektedir.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
            <div className="flex items-start gap-2">
              <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Uyarı:</strong> Bu siteyi kullanarak {minimumAge} yaşından büyük olduğunuzu
                ve yerel yasalarına uygun davrandığınızı kabul etmiş olursunuz.
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            {minimumAge} Yaşından Büyüğüm, Devam Et
          </button>

          <button
            onClick={handleReject}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Çıkış Yap
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t text-center text-xs text-gray-500">
          <p>
            Bu siteyi kullanarak{' '}
            <a href="/terms" className="text-pink-600 hover:underline">
              Kullanım Koşullarını
            </a>
            {' '}ve{' '}
            <a href="/privacy" className="text-pink-600 hover:underline">
              Gizlilik Politikasını
            </a>
            {' '}kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
}

// Hook to check age verification
export function useAgeVerification() {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem(STORAGE_KEY);
    setIsVerified(!!verified);
  }, []);

  return isVerified;
}

// HOC to protect components
export function withAgeVerification<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedComponent(props: P) {
    const [showVerification, setShowVerification] = useState(false);
    const isVerified = useAgeVerification();

    useEffect(() => {
      if (!isVerified) {
        setShowVerification(true);
      }
    }, [isVerified]);

    if (showVerification) {
      return (
        <AgeVerification
          onConfirm={() => setShowVerification(false)}
        />
      );
    }

    return <Component {...props} />;
  };
}
