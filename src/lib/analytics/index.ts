/**
 * Analytics Central Export
 * 
 * Bu modül tüm analytics fonksiyonlarını ve yardımcı fonksiyonları dışa aktarır.
 * Google Analytics 4 ve Plausible Analytics entegrasyonları dahil.
 * 
 * @module lib/analytics
 * @category Analytics
 */

// GA4 exports
export {
  initGA4,
  trackPageView as ga4TrackPageView,
  trackEvent as ga4TrackEvent,
  setUserProperties,
  setUserId,
  trackProfileView as ga4TrackProfileView,
  trackSearch as ga4TrackSearch,
  trackFilterApplied as ga4TrackFilterApplied,
  trackContactClick as ga4TrackContactClick,
  trackFavorite as ga4TrackFavorite,
  trackBookingStarted as ga4TrackBookingStarted,
  trackBookingCompleted as ga4TrackBookingCompleted,
  trackRegistrationStarted as ga4TrackRegistrationStarted,
  trackRegistrationCompleted as ga4TrackRegistrationCompleted,
  trackLogin as ga4TrackLogin,
  trackLoginFailed as ga4TrackLoginFailed,
  trackVipPackageView as ga4TrackVipPackageView,
  trackVipPurchase as ga4TrackVipPurchase,
} from './ga4';

export type {
  GA4Config,
  GA4Event,
  GA4PageView,
  GA4EcommerceItem,
} from './ga4';

// Plausible exports
export {
  initPlausible,
  trackPageView as plausibleTrackPageView,
  trackEvent as plausibleTrackEvent,
  trackProfileView as plausibleTrackProfileView,
  trackSearch as plausibleTrackSearch,
  trackFilterApplied as plausibleTrackFilterApplied,
  trackContactClick as plausibleTrackContactClick,
  trackFavorite as plausibleTrackFavorite,
  trackBookingStarted as plausibleTrackBookingStarted,
  trackBookingCompleted as plausibleTrackBookingCompleted,
  trackRegistrationStarted as plausibleTrackRegistrationStarted,
  trackRegistrationCompleted as plausibleTrackRegistrationCompleted,
  trackLogin as plausibleTrackLogin,
  trackLoginFailed as plausibleTrackLoginFailed,
  trackVipPackageView as plausibleTrackVipPackageView,
  trackVipPurchase as plausibleTrackVipPurchase,
  trackOutboundLink,
  trackFileDownload,
  track404,
} from './plausible';

export type {
  PlausibleConfig,
  PlausibleEvent,
} from './plausible';

// Privacy compliance helpers
export {
  checkDoNotTrack,
  hasConsent,
  grantConsent,
  revokeConsent,
} from '../contexts/AnalyticsContext';
