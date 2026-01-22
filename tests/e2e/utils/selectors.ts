/**
 * E2E Test Selectors
 * 
 * Common selectors used across E2E tests.
 * Centralized to make tests more maintainable.
 */

/**
 * Navigation selectors
 */
export const NAV = {
  header: 'header[data-testid="main-header"]',
  logo: '[data-testid="logo"]',
  searchButton: '[data-testid="search-button"]',
  userMenu: '[data-testid="user-menu-button"]',
  loginButton: '[data-testid="login-button"]',
  registerButton: '[data-testid="register-button"]',
  logoutButton: '[data-testid="logout-button"]',
  mobileMenu: '[data-testid="mobile-menu"]',
  mobileMenuToggle: '[data-testid="mobile-menu-toggle"]',
};

/**
 * Footer selectors
 */
export const FOOTER = {
  container: 'footer[data-testid="main-footer"]',
  privacyLink: '[data-testid="privacy-link"]',
  termsLink: '[data-testid="terms-link"]',
  contactLink: '[data-testid="contact-link"]',
};

/**
 * Auth selectors
 */
export const AUTH = {
  loginForm: 'form[data-testid="login-form"]',
  registerForm: 'form[data-testid="register-form"]',
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  nameInput: 'input[name="name"]',
  submitButton: 'button[type="submit"]',
  forgotPasswordLink: '[data-testid="forgot-password-link"]',
  registerLink: '[data-testid="register-link"]',
  loginLink: '[data-testid="login-link"]',
};

/**
 * Home page selectors
 */
export const HOME = {
  hero: '[data-testid="hero-section"]',
  vipCarousel: '[data-testid="vip-carousel"]',
  escortCard: '[data-testid="escort-card"]',
  searchInput: '[data-testid="search-input"]',
  citySelect: '[data-testid="city-select"]',
  featuredSection: '[data-testid="featured-section"]',
};

/**
 * Catalog selectors
 */
export const CATALOG = {
  container: '[data-testid="catalog-container"]',
  escortCard: '[data-testid="escort-card"]',
  filterPanel: '[data-testid="filter-panel"]',
  filterToggle: '[data-testid="filter-toggle"]',
  cityFilter: '[data-testid="filter-city"]',
  priceFilter: '[data-testid="filter-price"]',
  servicesFilter: '[data-testid="filter-services"]',
  applyFilters: '[data-testid="apply-filters"]',
  clearFilters: '[data-testid="clear-filters"]',
  sortSelect: '[data-testid="sort-select"]',
  pagination: '[data-testid="pagination"]',
  noResults: '[data-testid="no-results"]',
};

/**
 * Escort profile selectors
 */
export const PROFILE = {
  container: '[data-testid="profile-container"]',
  avatar: '[data-testid="profile-avatar"]',
  name: '[data-testid="profile-name"]',
  age: '[data-testid="profile-age"]',
  city: '[data-testid="profile-city"]',
  price: '[data-testid="profile-price"]',
  bio: '[data-testid="profile-bio"]',
  services: '[data-testid="profile-services"]',
  gallery: '[data-testid="photo-gallery"]',
  galleryImage: '[data-testid="gallery-image"]',
  contactButton: '[data-testid="contact-button"]',
  messageButton: '[data-testid="message-button"]',
  favoriteButton: '[data-testid="favorite-button"]',
  bookButton: '[data-testid="book-button"]',
  similarEscorts: '[data-testid="similar-escorts"]',
};

/**
 * Messages selectors
 */
export const MESSAGES = {
  container: '[data-testid="messages-container"]',
  conversationList: '[data-testid="conversation-list"]',
  conversation: '[data-testid="conversation"]',
  messageList: '[data-testid="message-list"]',
  message: '[data-testid="message"]',
  messageInput: '[data-testid="message-input"]',
  sendButton: '[data-testid="send-button"]',
  deleteButton: '[data-testid="delete-message"]',
  blockButton: '[data-testid="block-user"]',
};

/**
 * Appointments selectors
 */
export const APPOINTMENTS = {
  container: '[data-testid="appointments-container"]',
  appointmentCard: '[data-testid="appointment-card"]',
  createButton: '[data-testid="create-appointment"]',
  dateInput: '[data-testid="appointment-date"]',
  timeInput: '[data-testid="appointment-time"]',
  durationSelect: '[data-testid="appointment-duration"]',
  locationInput: '[data-testid="appointment-location"]',
  confirmButton: '[data-testid="confirm-appointment"]',
  cancelButton: '[data-testid="cancel-appointment"]',
};

/**
 * Payment selectors
 */
export const PAYMENT = {
  container: '[data-testid="payment-container"]',
  cardNumber: '[data-testid="card-number"]',
  expiry: '[data-testid="card-expiry"]',
  cvv: '[data-testid="card-cvv"]',
  name: '[data-testid="card-name"]',
  submitButton: '[data-testid="submit-payment"]',
  vipPackages: '[data-testid="vip-packages"]',
  vipPackage: '[data-testid="vip-package"]',
  selectPackage: '[data-testid="select-package"]',
};

/**
 * Common UI selectors
 */
export const UI = {
  loadingSpinner: '[data-testid="loading-spinner"]',
  toast: '[data-testid="toast"]',
  error: '[role="alert"]',
  modal: '[role="dialog"]',
  closeButton: '[data-testid="close-button"]',
  confirmButton: '[data-testid="confirm-button"]',
  cancelButton: '[data-testid="cancel-button"]',
};

/**
 * Accessibility selectors
 */
export const A11Y = {
  skipLink: '[data-testid="skip-to-main"]',
  mainContent: 'main',
  heading: 'h1, h2, h3, h4, h5, h6',
  link: 'a',
  button: 'button',
  input: 'input, textarea, select',
};
