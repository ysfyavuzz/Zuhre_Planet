/**
 * Analytics Context - Analitik İzleme Bağlamı
 * 
 * Bu modül, Google Analytics 4 ve Plausible Analytics entegrasyonunu sağlar.
 * Çerez onayı kontrolü, Do Not Track desteği ve GDPR uyumluluğu içerir.
 * 
 * @module contexts/AnalyticsContext
 * @category Analytics
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import * as GA4 from '../lib/analytics/ga4';
import * as Plausible from '../lib/analytics/plausible';

/**
 * Çerez onayı depolama anahtarı
 */
const CONSENT_STORAGE_KEY = 'cookie-consent';

/**
 * Analytics yapılandırma arayüzü
 */
interface AnalyticsConfig {
  ga4MeasurementId?: string;
  plausibleDomain?: string;
  enabled: boolean;
}

/**
 * Analytics Context değer arayüzü
 */
interface AnalyticsContextValue {
  isEnabled: boolean;
  hasConsent: boolean;
  grantConsent: () => void;
  revokeConsent: () => void;
  trackPageView: (path?: string, title?: string) => void;
  trackEvent: (eventName: string, params?: Record<string, unknown>) => void;
  trackProfileView: (escortId: string, escortName?: string, city?: string) => void;
  trackSearch: (query: string, resultsCount?: number) => void;
  trackFilter: (filterType: string, filterValue: string) => void;
  trackContact: (contactType: string, escortId: string) => void;
  trackFavorite: (action: 'add' | 'remove', escortId: string) => void;
  trackBooking: (action: 'started' | 'completed', escortId: string, price: number, bookingId?: string) => void;
  trackLogin: (method: string, userId?: string) => void;
  trackRegistration: (action: 'started' | 'completed', userType: string, userId?: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

/**
 * Do Not Track kontrolü yapar
 * 
 * @returns {boolean} Do Not Track etkin mi?
 */
export const checkDoNotTrack = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const dnt = navigator.doNotTrack || (window as any).doNotTrack || (navigator as any).msDoNotTrack;
  return dnt === '1' || dnt === 'yes';
};

/**
 * Çerez onayı kontrolü yapar
 * 
 * @returns {boolean} Kullanıcı onay verdi mi?
 */
export const hasConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
    return consent === 'true';
  } catch {
    return false;
  }
};

/**
 * Çerez onayını kaydeder
 */
export const grantConsent = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'true');
  } catch (error) {
    console.error('[Analytics] Onay kaydedilemedi:', error);
  }
};

/**
 * Çerez onayını iptal eder ve izlemeyi devre dışı bırakır
 */
export const revokeConsent = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    // Sayfa yenilenerek analytics devre dışı bırakılır
    window.location.reload();
  } catch (error) {
    console.error('[Analytics] Onay iptal edilemedi:', error);
  }
};

/**
 * Analytics yapılandırmasını environment variables'dan okur
 */
const getAnalyticsConfig = (): AnalyticsConfig => {
  const ga4MeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  const enabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

  return {
    ga4MeasurementId,
    plausibleDomain,
    enabled,
  };
};

/**
 * Analytics Provider bileşeni
 * 
 * Çocuk bileşenlere analytics tracking işlevselliği sağlar.
 * Çerez onayı ve Do Not Track kontrolü yapar.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Alt bileşenler
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [config] = useState<AnalyticsConfig>(getAnalyticsConfig);
  const [consent, setConsent] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  // Sayfa yüklendiğinde onay durumunu kontrol et
  useEffect(() => {
    setConsent(hasConsent());
  }, []);

  // Analytics'i başlat (sadece onay varsa ve DNT kapalıysa)
  useEffect(() => {
    if (!config.enabled || initialized) return;

    const shouldInitialize = consent && !checkDoNotTrack();

    if (shouldInitialize) {
      // GA4'ü başlat
      if (config.ga4MeasurementId) {
        GA4.initGA4(config.ga4MeasurementId, {
          anonymizeIP: true,
          debug: import.meta.env.DEV,
        });
      }

      // Plausible'ı başlat
      if (config.plausibleDomain) {
        Plausible.initPlausible(config.plausibleDomain, {
          trackLocalhost: import.meta.env.DEV,
        });
      }

      setInitialized(true);
    }
  }, [config, consent, initialized]);

  // Sayfa değişikliklerini otomatik izle
  useEffect(() => {
    if (!initialized || !consent) return;

    const path = location;
    const title = document.title;

    // GA4 sayfa görüntüleme
    if (config.ga4MeasurementId) {
      GA4.trackPageView(path, title);
    }

    // Plausible sayfa görüntüleme
    if (config.plausibleDomain) {
      Plausible.trackPageView(path);
    }
  }, [location, initialized, consent, config]);

  /**
   * Sayfa görüntüleme izleme
   */
  const trackPageViewMethod = (path?: string, title?: string) => {
    if (!initialized || !consent) return;

    const finalPath = path || location;
    const finalTitle = title || document.title;

    if (config.ga4MeasurementId) {
      GA4.trackPageView(finalPath, finalTitle);
    }

    if (config.plausibleDomain) {
      Plausible.trackPageView(finalPath);
    }
  };

  /**
   * Özel olay izleme
   */
  const trackEventMethod = (eventName: string, params?: Record<string, unknown>) => {
    if (!initialized || !consent) return;

    if (config.ga4MeasurementId) {
      GA4.trackEvent(eventName, params);
    }

    if (config.plausibleDomain) {
      // Plausible string değerleri kabul eder, bu yüzden dönüştürme yapıyoruz
      const plausibleProps = params
        ? Object.entries(params).reduce((acc, [key, value]) => {
            acc[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
            return acc;
          }, {} as Record<string, string | number | boolean>)
        : undefined;

      Plausible.trackEvent(eventName, plausibleProps);
    }
  };

  /**
   * Profil görüntüleme izleme
   */
  const trackProfileViewMethod = (escortId: string, escortName?: string, city?: string) => {
    if (!initialized || !consent) return;

    if (config.ga4MeasurementId && escortName) {
      GA4.trackProfileView(escortId, escortName);
    }

    if (config.plausibleDomain && city) {
      Plausible.trackProfileView(escortId, city);
    }
  };

  /**
   * Arama izleme
   */
  const trackSearchMethod = (query: string, resultsCount?: number) => {
    if (!initialized || !consent) return;

    if (config.ga4MeasurementId) {
      GA4.trackSearch(query, resultsCount);
    }

    if (config.plausibleDomain && resultsCount !== undefined) {
      Plausible.trackSearch(query, resultsCount);
    }
  };

  /**
   * Filtre izleme
   */
  const trackFilterMethod = (filterType: string, filterValue: string) => {
    if (!initialized || !consent) return;

    if (config.ga4MeasurementId) {
      GA4.trackFilterApplied(filterType, filterValue);
    }

    if (config.plausibleDomain) {
      Plausible.trackFilterApplied(filterType, filterValue);
    }
  };

  /**
   * İletişim tıklama izleme
   */
  const trackContactMethod = (contactType: string, escortId: string) => {
    if (!initialized || !consent) return;

    if (config.ga4MeasurementId) {
      GA4.trackContactClick(contactType, escortId);
    }

    if (config.plausibleDomain) {
      Plausible.trackContactClick(contactType, escortId);
    }
  };

  /**
   * Favori izleme
   */
  const trackFavoriteMethod = (action: 'add' | 'remove', escortId: string) => {
    if (!initialized || !consent) return;

    if (config.ga4MeasurementId) {
      GA4.trackFavorite(action, escortId);
    }

    if (config.plausibleDomain) {
      Plausible.trackFavorite(action, escortId);
    }
  };

  /**
   * Rezervasyon izleme
   */
  const trackBookingMethod = (
    action: 'started' | 'completed',
    escortId: string,
    price: number,
    bookingId?: string
  ) => {
    if (!initialized || !consent) return;

    if (action === 'started') {
      if (config.ga4MeasurementId) {
        GA4.trackBookingStarted(escortId, price);
      }
      if (config.plausibleDomain) {
        Plausible.trackBookingStarted(escortId, price);
      }
    } else if (action === 'completed' && bookingId) {
      if (config.ga4MeasurementId) {
        GA4.trackBookingCompleted(bookingId, escortId, price);
      }
      if (config.plausibleDomain) {
        Plausible.trackBookingCompleted(bookingId, escortId, price);
      }
    }
  };

  /**
   * Giriş izleme
   */
  const trackLoginMethod = (method: string, userId?: string) => {
    if (!initialized || !consent) return;

    if (config.ga4MeasurementId && userId) {
      GA4.trackLogin(method, userId);
    }

    if (config.plausibleDomain) {
      Plausible.trackLogin(method);
    }
  };

  /**
   * Kayıt izleme
   */
  const trackRegistrationMethod = (
    action: 'started' | 'completed',
    userType: string,
    userId?: string
  ) => {
    if (!initialized || !consent) return;

    if (action === 'started') {
      if (config.ga4MeasurementId) {
        GA4.trackRegistrationStarted(userType);
      }
      if (config.plausibleDomain) {
        Plausible.trackRegistrationStarted(userType);
      }
    } else if (action === 'completed') {
      if (config.ga4MeasurementId && userId) {
        GA4.trackRegistrationCompleted(userType, userId);
      }
      if (config.plausibleDomain) {
        Plausible.trackRegistrationCompleted(userType);
      }
    }
  };

  /**
   * Onay verme işlemi
   */
  const grantConsentMethod = () => {
    grantConsent();
    setConsent(true);
  };

  /**
   * Onay iptal etme işlemi
   */
  const revokeConsentMethod = () => {
    revokeConsent();
  };

  const value: AnalyticsContextValue = {
    isEnabled: config.enabled && initialized,
    hasConsent: consent,
    grantConsent: grantConsentMethod,
    revokeConsent: revokeConsentMethod,
    trackPageView: trackPageViewMethod,
    trackEvent: trackEventMethod,
    trackProfileView: trackProfileViewMethod,
    trackSearch: trackSearchMethod,
    trackFilter: trackFilterMethod,
    trackContact: trackContactMethod,
    trackFavorite: trackFavoriteMethod,
    trackBooking: trackBookingMethod,
    trackLogin: trackLoginMethod,
    trackRegistration: trackRegistrationMethod,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

/**
 * Analytics hook'u
 * 
 * Analytics Context'ine erişim sağlar.
 * AnalyticsProvider içinde kullanılmalıdır.
 * 
 * @returns {AnalyticsContextValue} Analytics context değeri
 * @throws {Error} Provider dışında kullanılırsa hata fırlatır
 */
export function useAnalytics() {
  const context = useContext(AnalyticsContext);

  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }

  return context;
}
