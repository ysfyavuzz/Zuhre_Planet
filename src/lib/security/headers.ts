/**
 * Security Headers Configuration Module
 *
 * Provides security headers configuration utilities:
 * - CORS (Cross-Origin Resource Sharing)
 * - CSP (Content Security Policy)
 * - HSTS (HTTP Strict Transport Security)
 * - X-Frame-Options (Clickjacking protection)
 * - X-Content-Type-Options (MIME type sniffing prevention)
 * - Referrer-Policy
 * - Permissions-Policy
 *
 * @module lib/security/headers
 * @category Library - Security
 *
 * @example
 * ```typescript
 * import {
 *   securityHeaders,
 *   corsHeaders,
 *   cspHeaders,
 *   applySecurityHeaders,
 * } from '@/lib/security/headers';
 *
 * // Get all security headers
 * const headers = securityHeaders();
 *
 * // Custom CORS configuration
 * const corsConfig = corsHeaders({
 *   origin: ['https://example.com', 'https://app.example.com'],
 *   credentials: true,
 * });
 *
 * // Use with Express
 * app.use((req, res, next) => {
 *   applySecurityHeaders(res);
 *   next();
 * });
 * ```
 */

/**
 * CORS configuration
 *
 * @interface CORSConfig
 * @property {string | string[]} origin - Allowed origins
 * @property {string[]} methods - Allowed HTTP methods
 * @property {string[]} allowedHeaders - Allowed request headers
 * @property {string[]} exposedHeaders - Exposed response headers
 * @property {boolean} credentials - Allow credentials
 * @property {number} maxAge - Max cache age in seconds
 */
export interface CORSConfig {
  origin?: string | string[];
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

/**
 * CSP configuration
 *
 * @interface CSPConfig
 * @property {string} defaultSrc - Default source directive
 * @property {string} scriptSrc - Script source directive
 * @property {string} styleSrc - Style source directive
 * @property {string} imgSrc - Image source directive
 * @property {string} fontSrc - Font source directive
 * @property {string} frameSrc - Frame source directive
 * @property {string} connectSrc - Connect source directive
 * @property {boolean} blockAllMixedContent - Block mixed HTTP/HTTPS
 * @property {boolean} upgradeInsecureRequests - Upgrade HTTP to HTTPS
 */
export interface CSPConfig {
  defaultSrc?: string;
  scriptSrc?: string;
  styleSrc?: string;
  imgSrc?: string;
  fontSrc?: string;
  frameSrc?: string;
  connectSrc?: string;
  blockAllMixedContent?: boolean;
  upgradeInsecureRequests?: boolean;
}

/**
 * HSTS configuration
 *
 * @interface HSTSConfig
 * @property {number} maxAge - Cache duration in seconds
 * @property {boolean} includeSubDomains - Include subdomains
 * @property {boolean} preload - Allow preload list inclusion
 */
export interface HSTSConfig {
  maxAge?: number;
  includeSubDomains?: boolean;
  preload?: boolean;
}

/**
 * Security headers configuration
 *
 * @interface SecurityHeadersConfig
 * @property {CORSConfig} cors - CORS configuration
 * @property {CSPConfig} csp - CSP configuration
 * @property {HSTSConfig} hsts - HSTS configuration
 */
export interface SecurityHeadersConfig {
  cors?: CORSConfig;
  csp?: CSPConfig | false;
  hsts?: HSTSConfig | false;
}

// ============================================================================
// CORS Headers
// ============================================================================

/**
 * Generates CORS headers
 *
 * @param {CORSConfig} config - CORS configuration
 * @returns {Record<string, string>} CORS headers
 *
 * @example
 * ```typescript
 * const headers = corsHeaders({
 *   origin: ['https://example.com', 'https://app.example.com'],
 *   methods: ['GET', 'POST', 'PUT', 'DELETE'],
 *   credentials: true,
 * });
 *
 * Object.entries(headers).forEach(([key, value]) => {
 *   res.setHeader(key, value);
 * });
 * ```
 */
export function corsHeaders(config: CORSConfig = {}): Record<string, string> {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization'],
    exposedHeaders = ['Content-Length', 'X-Total-Count'],
    credentials = false,
    maxAge = 86400,
  } = config;

  const originValue = Array.isArray(origin) ? origin.join(', ') : origin;

  return {
    'Access-Control-Allow-Origin': originValue,
    'Access-Control-Allow-Methods': methods.join(', '),
    'Access-Control-Allow-Headers': allowedHeaders.join(', '),
    'Access-Control-Expose-Headers': exposedHeaders.join(', '),
    'Access-Control-Allow-Credentials': String(credentials),
    'Access-Control-Max-Age': String(maxAge),
  };
}

/**
 * Validates if origin is allowed
 *
 * @param {string} origin - Origin to validate
 * @param {string | string[]} allowedOrigins - Allowed origins
 * @returns {boolean} True if origin is allowed
 *
 * @example
 * ```typescript
 * const allowed = isOriginAllowed(
 *   req.headers.origin,
 *   ['https://example.com', 'https://app.example.com']
 * );
 * ```
 */
export function isOriginAllowed(origin: string, allowedOrigins: string | string[]): boolean {
  if (allowedOrigins === '*') return true;

  const origins = Array.isArray(allowedOrigins) ? allowedOrigins : [allowedOrigins];
  return origins.includes(origin);
}

// ============================================================================
// CSP Headers
// ============================================================================

/**
 * Generates Content Security Policy (CSP) header
 *
 * @param {CSPConfig} config - CSP configuration
 * @param {boolean} reportOnly - Use report-only mode (header will be CSP-Report-Only)
 * @returns {Record<string, string>} CSP headers
 *
 * @example
 * ```typescript
 * const headers = cspHeaders({
 *   defaultSrc: "'self'",
 *   scriptSrc: "'self' 'unsafe-inline' cdn.example.com",
 *   styleSrc: "'self' 'unsafe-inline'",
 *   imgSrc: "'self' data: https:",
 * });
 * ```
 */
export function cspHeaders(config: CSPConfig = {}, reportOnly: boolean = false): Record<string, string> {
  const {
    defaultSrc = "'self'",
    scriptSrc = "'self'",
    styleSrc = "'self'",
    imgSrc = "'self' data: https:",
    fontSrc = "'self' data:",
    frameSrc = "'none'",
    connectSrc = "'self'",
    blockAllMixedContent = true,
    upgradeInsecureRequests = true,
  } = config;

  const directives: string[] = [
    `default-src ${defaultSrc}`,
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    `img-src ${imgSrc}`,
    `font-src ${fontSrc}`,
    `frame-src ${frameSrc}`,
    `connect-src ${connectSrc}`,
  ];

  if (blockAllMixedContent) {
    directives.push('block-all-mixed-content');
  }

  if (upgradeInsecureRequests) {
    directives.push('upgrade-insecure-requests');
  }

  const headerName = reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
  const headerValue = directives.join('; ');

  return {
    [headerName]: headerValue,
  };
}

/**
 * Generates strict CSP for production
 *
 * Stricter policy suitable for production environments.
 * Disables inline scripts and styles.
 *
 * @returns {Record<string, string>} Strict CSP headers
 *
 * @example
 * ```typescript
 * const headers = strictCSP();
 * ```
 */
export function strictCSP(): Record<string, string> {
  return cspHeaders({
    defaultSrc: "'self'",
    scriptSrc: "'self'",
    styleSrc: "'self'",
    imgSrc: "'self' data: https:",
    fontSrc: "'self'",
    frameSrc: "'none'",
    connectSrc: "'self'",
    blockAllMixedContent: true,
    upgradeInsecureRequests: true,
  });
}

/**
 * Generates development-friendly CSP
 *
 * More permissive policy for development environment.
 * Allows inline scripts and styles for development tools.
 *
 * @returns {Record<string, string>} Development CSP headers
 *
 * @example
 * ```typescript
 * const isDev = process.env.NODE_ENV === 'development';
 * const headers = isDev ? devCSP() : strictCSP();
 * ```
 */
export function devCSP(): Record<string, string> {
  return cspHeaders(
    {
      defaultSrc: "'self'",
      scriptSrc: "'self' 'unsafe-inline' 'unsafe-eval'",
      styleSrc: "'self' 'unsafe-inline'",
      imgSrc: "'self' data: https:",
      fontSrc: "'self' data:",
      frameSrc: "'self'",
      connectSrc: "'self' http: https: ws: wss:",
    },
    true // Use report-only mode in development
  );
}

// ============================================================================
// HSTS Headers
// ============================================================================

/**
 * Generates HTTP Strict Transport Security (HSTS) header
 *
 * @param {HSTSConfig} config - HSTS configuration
 * @returns {Record<string, string>} HSTS headers
 *
 * @example
 * ```typescript
 * const headers = hstsHeaders({
 *   maxAge: 31536000, // 1 year
 *   includeSubDomains: true,
 *   preload: true,
 * });
 * ```
 */
export function hstsHeaders(config: HSTSConfig = {}): Record<string, string> {
  const {
    maxAge = 31536000, // 1 year default
    includeSubDomains = true,
    preload = false,
  } = config;

  let headerValue = `max-age=${maxAge}`;

  if (includeSubDomains) {
    headerValue += '; includeSubDomains';
  }

  if (preload) {
    headerValue += '; preload';
  }

  return {
    'Strict-Transport-Security': headerValue,
  };
}

// ============================================================================
// Other Security Headers
// ============================================================================

/**
 * Gets all other security headers
 *
 * Includes:
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - Referrer-Policy
 * - Permissions-Policy
 * - X-XSS-Protection
 *
 * @returns {Record<string, string>} Security headers
 *
 * @example
 * ```typescript
 * const headers = otherSecurityHeaders();
 * ```
 */
export function otherSecurityHeaders(): Record<string, string> {
  return {
    // Prevent clickjacking attacks
    'X-Frame-Options': 'DENY',

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Disable XSS protection (rely on CSP instead)
    'X-XSS-Protection': '0',

    // Control feature access
    'Permissions-Policy':
      'accelerometer=(), camera=(), microphone=(), geolocation=(), gyroscope=(), magnetometer=(), payment=(), usb=()',
  };
}

// ============================================================================
// Complete Security Headers
// ============================================================================

/**
 * Gets all security headers with default configuration
 *
 * @param {SecurityHeadersConfig} config - Custom configuration
 * @param {boolean} isDev - Whether in development mode
 * @returns {Record<string, string>} All security headers
 *
 * @example
 * ```typescript
 * const headers = securityHeaders({
 *   cors: {
 *     origin: process.env.ALLOWED_ORIGINS?.split(','),
 *     credentials: true,
 *   },
 * });
 *
 * Object.entries(headers).forEach(([key, value]) => {
 *   res.setHeader(key, value);
 * });
 * ```
 */
export function securityHeaders(
  config: SecurityHeadersConfig = {},
  isDev: boolean = false
): Record<string, string> {
  const headers: Record<string, string> = {};

  // CORS headers
  if (config.cors) {
    Object.assign(headers, corsHeaders(config.cors));
  }

  // CSP headers
  if (config.csp !== false) {
    const cspConfig = isDev ? devCSP() : cspHeaders(config.csp);
    Object.assign(headers, cspConfig);
  }

  // HSTS headers
  if (config.hsts !== false && !isDev) {
    Object.assign(headers, hstsHeaders(config.hsts));
  }

  // Other security headers
  Object.assign(headers, otherSecurityHeaders());

  return headers;
}

/**
 * Gets production security headers
 *
 * Strict security configuration suitable for production.
 *
 * @param {string | string[]} allowedOrigins - Allowed origins
 * @returns {Record<string, string>} Production security headers
 *
 * @example
 * ```typescript
 * const headers = productionHeaders(['https://example.com', 'https://app.example.com']);
 * ```
 */
export function productionHeaders(allowedOrigins: string | string[]): Record<string, string> {
  return securityHeaders({
    cors: {
      origin: allowedOrigins,
      credentials: true,
      maxAge: 86400,
    },
    csp: undefined,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  });
}

/**
 * Gets development security headers
 *
 * More permissive configuration for development.
 *
 * @param {string} [localOrigin] - Local development origin (default: http://localhost:5173)
 * @returns {Record<string, string>} Development security headers
 *
 * @example
 * ```typescript
 * const headers = developmentHeaders();
 * ```
 */
export function developmentHeaders(localOrigin: string = 'http://localhost:5173'): Record<string, string> {
  return securityHeaders(
    {
      cors: {
        origin: [localOrigin, 'http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true,
        maxAge: 3600,
      },
      csp: undefined,
      hsts: false,
    },
    true
  );
}

// ============================================================================
// Header Application Utilities
// ============================================================================

/**
 * Type for response object with setHeader method
 *
 * @interface ResponseWithHeaders
 * @property {(name: string, value: string | number) => void} setHeader - Set header method
 */
export interface ResponseWithHeaders {
  setHeader(name: string, value: string | number): void;
}

/**
 * Applies security headers to response object
 *
 * @param {ResponseWithHeaders} res - Response object
 * @param {SecurityHeadersConfig} config - Configuration
 * @param {boolean} isDev - Whether in development mode
 *
 * @example
 * ```typescript
 * app.use((req, res, next) => {
 *   applySecurityHeaders(res);
 *   next();
 * });
 * ```
 */
export function applySecurityHeaders(
  res: ResponseWithHeaders,
  config: SecurityHeadersConfig = {},
  isDev: boolean = false
): void {
  const headers = securityHeaders(config, isDev);

  for (const [name, value] of Object.entries(headers)) {
    res.setHeader(name, value);
  }
}

/**
 * Applies CORS headers to response object
 *
 * @param {ResponseWithHeaders} res - Response object
 * @param {CORSConfig} config - CORS configuration
 *
 * @example
 * ```typescript
 * app.use((req, res, next) => {
 *   applyCorsHeaders(res, {
 *     origin: process.env.ALLOWED_ORIGINS?.split(','),
 *     credentials: true,
 *   });
 *   next();
 * });
 * ```
 */
export function applyCorsHeaders(res: ResponseWithHeaders, config: CORSConfig = {}): void {
  const headers = corsHeaders(config);

  for (const [name, value] of Object.entries(headers)) {
    res.setHeader(name, value);
  }
}

/**
 * Applies CSP headers to response object
 *
 * @param {ResponseWithHeaders} res - Response object
 * @param {CSPConfig} config - CSP configuration
 * @param {boolean} isDev - Whether in development mode
 *
 * @example
 * ```typescript
 * app.use((req, res, next) => {
 *   applyCspHeaders(res);
 *   next();
 * });
 * ```
 */
export function applyCspHeaders(
  res: ResponseWithHeaders,
  config?: CSPConfig,
  isDev: boolean = false
): void {
  const headers = isDev ? devCSP() : cspHeaders(config);

  for (const [name, value] of Object.entries(headers)) {
    res.setHeader(name, value);
  }
}

/**
 * Applies HSTS headers to response object
 *
 * @param {ResponseWithHeaders} res - Response object
 * @param {HSTSConfig} config - HSTS configuration
 *
 * @example
 * ```typescript
 * app.use((req, res, next) => {
 *   applyHstsHeaders(res);
 *   next();
 * });
 * ```
 */
export function applyHstsHeaders(res: ResponseWithHeaders, config: HSTSConfig = {}): void {
  const headers = hstsHeaders(config);

  for (const [name, value] of Object.entries(headers)) {
    res.setHeader(name, value);
  }
}

/**
 * Creates a middleware function for applying security headers
 *
 * @param {SecurityHeadersConfig} config - Configuration
 * @returns {(res: ResponseWithHeaders) => void} Middleware function
 *
 * @example
 * ```typescript
 * app.use((req, res, next) => {
 *   const applyHeaders = securityHeadersMiddleware({
 *     cors: { origin: 'https://example.com', credentials: true }
 *   });
 *   applyHeaders(res);
 *   next();
 * });
 * ```
 */
export function securityHeadersMiddleware(
  config: SecurityHeadersConfig = {}
): (res: ResponseWithHeaders) => void {
  const isDev = process.env.NODE_ENV === 'development';

  return (res: ResponseWithHeaders) => {
    applySecurityHeaders(res, config, isDev);
  };
}
