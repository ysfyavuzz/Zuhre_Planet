/**
 * Google Analytics 4 Integration
 * 
 * @module lib/analytics/ga4
 * @category Analytics
 * 
 * Google Analytics 4 tracking implementation including:
 * - Page view tracking
 * - Event tracking
 * - User properties
 * - E-commerce events
 * - Privacy compliance
 * 
 * @example
 * ```typescript
 * import { initGA4, trackPageView, trackEvent } from './ga4';
 * 
 * initGA4('G-XXXXXXXXXX');
 * trackPageView('/');
 * trackEvent('button_click', { button_name: 'contact' });
 * ```
 */

/**
 * Google Analytics 4 types
 */
export interface GA4Config {
  measurementId: string;
  debug?: boolean;
  anonymizeIP?: boolean;
}

export interface GA4Event {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  params?: Record<string, unknown>;
}

export interface GA4PageView {
  page_path: string;
  page_title?: string;
  page_location?: string;
}

export interface GA4EcommerceItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_category?: string;
}

/**
 * Check if GA4 is available
 */
const isGA4Available = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag !== 'undefined';
};

/**
 * Initialize Google Analytics 4
 * 
 * @param measurementId - GA4 Measurement ID
 * @param config - Additional configuration
 */
export const initGA4 = (measurementId: string, config?: Partial<GA4Config>): void => {
  if (typeof window === 'undefined') return;

  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false, // We'll send page views manually
    anonymize_ip: config?.anonymizeIP ?? true,
    debug_mode: config?.debug ?? false,
  });

  if (config?.debug) {
    console.log('[GA4] Initialized with measurement ID:', measurementId);
  }
};

/**
 * Track page view
 * 
 * @param path - Page path
 * @param title - Page title
 */
export const trackPageView = (path: string, title?: string): void => {
  if (!isGA4Available()) return;

  const pageView: GA4PageView = {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  };

  window.gtag('event', 'page_view', pageView);
};

/**
 * Track custom event
 * 
 * @param eventName - Event name
 * @param params - Event parameters
 */
export const trackEvent = (eventName: string, params?: Record<string, unknown>): void => {
  if (!isGA4Available()) return;

  window.gtag('event', eventName, params);
};

/**
 * Set user properties
 * 
 * @param properties - User properties
 */
export const setUserProperties = (properties: Record<string, unknown>): void => {
  if (!isGA4Available()) return;

  window.gtag('set', 'user_properties', properties);
};

/**
 * Set user ID
 * 
 * @param userId - User ID
 */
export const setUserId = (userId: string): void => {
  if (!isGA4Available()) return;

  window.gtag('set', { user_id: userId });
};

/**
 * Track profile view
 * 
 * @param escortId - Escort ID
 * @param escortName - Escort name
 */
export const trackProfileView = (escortId: string, escortName: string): void => {
  trackEvent('profile_view', {
    escort_id: escortId,
    escort_name: escortName,
  });
};

/**
 * Track search
 * 
 * @param query - Search query
 * @param resultsCount - Number of results
 */
export const trackSearch = (query: string, resultsCount?: number): void => {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount,
  });
};

/**
 * Track filter applied
 * 
 * @param filterType - Type of filter
 * @param filterValue - Filter value
 */
export const trackFilterApplied = (filterType: string, filterValue: string): void => {
  trackEvent('filter_applied', {
    filter_type: filterType,
    filter_value: filterValue,
  });
};

/**
 * Track contact click
 * 
 * @param contactType - Type of contact (phone, message, whatsapp)
 * @param escortId - Escort ID
 */
export const trackContactClick = (contactType: string, escortId: string): void => {
  trackEvent('contact_click', {
    contact_type: contactType,
    escort_id: escortId,
  });
};

/**
 * Track favorite action
 * 
 * @param action - Action (add or remove)
 * @param escortId - Escort ID
 */
export const trackFavorite = (action: 'add' | 'remove', escortId: string): void => {
  trackEvent(`favorite_${action}`, {
    escort_id: escortId,
  });
};

/**
 * Track booking started
 * 
 * @param escortId - Escort ID
 * @param price - Booking price
 */
export const trackBookingStarted = (escortId: string, price: number): void => {
  trackEvent('booking_started', {
    escort_id: escortId,
    value: price,
    currency: 'TRY',
  });
};

/**
 * Track booking completed
 * 
 * @param bookingId - Booking ID
 * @param escortId - Escort ID
 * @param price - Booking price
 */
export const trackBookingCompleted = (
  bookingId: string,
  escortId: string,
  price: number
): void => {
  trackEvent('purchase', {
    transaction_id: bookingId,
    value: price,
    currency: 'TRY',
    items: [
      {
        item_id: escortId,
        item_name: 'Escort Service',
        price: price,
      },
    ],
  });
};

/**
 * Track registration started
 * 
 * @param userType - Type of user (client or escort)
 */
export const trackRegistrationStarted = (userType: string): void => {
  trackEvent('sign_up_started', {
    user_type: userType,
  });
};

/**
 * Track registration completed
 * 
 * @param userType - Type of user
 * @param userId - User ID
 */
export const trackRegistrationCompleted = (userType: string, userId: string): void => {
  trackEvent('sign_up', {
    user_type: userType,
    user_id: userId,
  });
  setUserId(userId);
};

/**
 * Track login
 * 
 * @param method - Login method
 * @param userId - User ID
 */
export const trackLogin = (method: string, userId: string): void => {
  trackEvent('login', {
    method: method,
    user_id: userId,
  });
  setUserId(userId);
};

/**
 * Track login failed
 * 
 * @param reason - Failure reason
 */
export const trackLoginFailed = (reason: string): void => {
  trackEvent('login_failed', {
    reason: reason,
  });
};

/**
 * Track VIP package view
 * 
 * @param packageId - Package ID
 * @param packageName - Package name
 * @param price - Package price
 */
export const trackVipPackageView = (
  packageId: string,
  packageName: string,
  price: number
): void => {
  trackEvent('view_item', {
    items: [
      {
        item_id: packageId,
        item_name: packageName,
        item_category: 'VIP Package',
        price: price,
      },
    ],
  });
};

/**
 * Track VIP package purchase
 * 
 * @param transactionId - Transaction ID
 * @param packageId - Package ID
 * @param packageName - Package name
 * @param price - Package price
 */
export const trackVipPurchase = (
  transactionId: string,
  packageId: string,
  packageName: string,
  price: number
): void => {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value: price,
    currency: 'TRY',
    items: [
      {
        item_id: packageId,
        item_name: packageName,
        item_category: 'VIP Package',
        price: price,
      },
    ],
  });
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
