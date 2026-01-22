/**
 * Plausible Analytics Integration
 * 
 * @module lib/analytics/plausible
 * @category Analytics
 * 
 * Plausible Analytics implementation for privacy-focused analytics:
 * - Page view tracking
 * - Custom events
 * - Goal tracking
 * - No cookies, GDPR compliant
 * 
 * @example
 * ```typescript
 * import { initPlausible, trackPageView, trackEvent } from './plausible';
 * 
 * initPlausible('escortplatform.com');
 * trackPageView('/');
 * trackEvent('Contact Click');
 * ```
 */

/**
 * Plausible configuration
 */
export interface PlausibleConfig {
  domain: string;
  apiHost?: string;
  trackLocalhost?: boolean;
}

export interface PlausibleEvent {
  name: string;
  props?: Record<string, string | number | boolean>;
}

/**
 * Check if Plausible is available
 */
const isPlausibleAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.plausible !== 'undefined';
};

/**
 * Initialize Plausible Analytics
 * 
 * @param domain - Your domain name
 * @param config - Additional configuration
 */
export const initPlausible = (domain: string, config?: Partial<PlausibleConfig>): void => {
  if (typeof window === 'undefined') return;

  const apiHost = config?.apiHost || 'https://plausible.io';
  const trackLocalhost = config?.trackLocalhost ?? false;

  // Load Plausible script
  const script = document.createElement('script');
  script.defer = true;
  script.setAttribute('data-domain', domain);
  script.setAttribute('data-api', `${apiHost}/api/event`);
  
  if (trackLocalhost) {
    script.setAttribute('data-track-localhost', 'true');
  }
  
  script.src = `${apiHost}/js/script.js`;
  document.head.appendChild(script);

  // Initialize plausible function
  window.plausible = window.plausible || function() {
    // eslint-disable-next-line prefer-rest-params
    (window.plausible.q = window.plausible.q || []).push(arguments);
  };
};

/**
 * Track page view
 * 
 * @param path - Page path (optional, defaults to current path)
 */
export const trackPageView = (path?: string): void => {
  if (!isPlausibleAvailable()) return;

  if (path) {
    window.plausible('pageview', { props: { path } });
  } else {
    window.plausible('pageview');
  }
};

/**
 * Track custom event
 * 
 * @param eventName - Event name
 * @param props - Event properties
 */
export const trackEvent = (eventName: string, props?: Record<string, string | number | boolean>): void => {
  if (!isPlausibleAvailable()) return;

  if (props) {
    window.plausible(eventName, { props });
  } else {
    window.plausible(eventName);
  }
};

/**
 * Track profile view
 * 
 * @param escortId - Escort ID
 * @param city - City name
 */
export const trackProfileView = (escortId: string, city: string): void => {
  trackEvent('Profile View', {
    escort_id: escortId,
    city: city,
  });
};

/**
 * Track search
 * 
 * @param query - Search query
 * @param resultsCount - Number of results
 */
export const trackSearch = (query: string, resultsCount: number): void => {
  trackEvent('Search', {
    query: query,
    results: resultsCount,
  });
};

/**
 * Track filter applied
 * 
 * @param filterType - Type of filter
 * @param filterValue - Filter value
 */
export const trackFilterApplied = (filterType: string, filterValue: string): void => {
  trackEvent('Filter Applied', {
    type: filterType,
    value: filterValue,
  });
};

/**
 * Track contact click
 * 
 * @param contactType - Type of contact (phone, message, whatsapp)
 * @param escortId - Escort ID
 */
export const trackContactClick = (contactType: string, escortId: string): void => {
  trackEvent('Contact Click', {
    type: contactType,
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
  trackEvent(`Favorite ${action === 'add' ? 'Added' : 'Removed'}`, {
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
  trackEvent('Booking Started', {
    escort_id: escortId,
    price: price,
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
  trackEvent('Booking Completed', {
    booking_id: bookingId,
    escort_id: escortId,
    price: price,
  });
};

/**
 * Track registration started
 * 
 * @param userType - Type of user (client or escort)
 */
export const trackRegistrationStarted = (userType: string): void => {
  trackEvent('Registration Started', {
    user_type: userType,
  });
};

/**
 * Track registration completed
 * 
 * @param userType - Type of user
 */
export const trackRegistrationCompleted = (userType: string): void => {
  trackEvent('Registration Completed', {
    user_type: userType,
  });
};

/**
 * Track login success
 * 
 * @param method - Login method
 */
export const trackLogin = (method: string): void => {
  trackEvent('Login Success', {
    method: method,
  });
};

/**
 * Track login failed
 * 
 * @param reason - Failure reason
 */
export const trackLoginFailed = (reason: string): void => {
  trackEvent('Login Failed', {
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
  trackEvent('VIP Package Viewed', {
    package_id: packageId,
    package_name: packageName,
    price: price,
  });
};

/**
 * Track VIP package purchase
 * 
 * @param transactionId - Transaction ID
 * @param packageId - Package ID
 * @param price - Package price
 */
export const trackVipPurchase = (
  transactionId: string,
  packageId: string,
  price: number
): void => {
  trackEvent('VIP Purchased', {
    transaction_id: transactionId,
    package_id: packageId,
    price: price,
  });
};

/**
 * Track outbound link click
 * 
 * @param url - Destination URL
 */
export const trackOutboundLink = (url: string): void => {
  trackEvent('Outbound Link', {
    url: url,
  });
};

/**
 * Track file download
 * 
 * @param fileName - Downloaded file name
 */
export const trackFileDownload = (fileName: string): void => {
  trackEvent('File Download', {
    file: fileName,
  });
};

/**
 * Track 404 error
 * 
 * @param path - Path that resulted in 404
 */
export const track404 = (path: string): void => {
  trackEvent('404', {
    path: path,
  });
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    plausible: {
      (...args: unknown[]): void;
      q?: unknown[];
    };
  }
}
