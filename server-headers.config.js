/**
 * Security Headers Configuration
 *
 * HTTP security headers for production deployment.
 * These headers should be configured on your web server (Nginx, Apache, Vercel, etc.)
 *
 * @file server-headers.config.js
 * @category Security
 *
 * @example Nginx Configuration:
 * ```nginx
 * add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: http: blob:; connect-src 'self' https://api.escort-platform.com; frame-src 'self' https://iyzico.com; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self';" always;
 * add_header X-Content-Type-Options "nosniff" always;
 * add_header X-Frame-Options "DENY" always;
 * add_header X-XSS-Protection "1; mode=block" always;
 * add_header Referrer-Policy "strict-origin-when-cross-origin" always;
 * add_header Permissions-Policy "camera=(), microphone=(), geolocation=(self)" always;
 * add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
 * ```
 */

/**
 * Security Headers Configuration Object
 */
const securityHeaders = [
  /**
   * Content Security Policy (CSP)
   * Prevents XSS, clickjacking, and other code injection attacks
   */
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: http: blob:",
      "connect-src 'self' https://api.escort-platform.com https://*.libsql.dev wss://*.libsql.dev",
      "frame-src 'self' https://iyzico.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; '),
  },

  /**
   * X-Content-Type-Options
   * Prevents MIME type sniffing
   */
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },

  /**
   * X-Frame-Options
   * Prevents clickjacking attacks
   */
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },

  /**
   * X-XSS-Protection
   * Enables XSS filter (legacy browsers)
   */
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },

  /**
   * Referrer-Policy
   * Controls referrer information sent
   */
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },

  /**
   * Permissions-Policy
   * Controls browser features access
   */
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), payment=(self)',
  },

  /**
   * Strict-Transport-Security (HSTS)
   * Forces HTTPS connections
   * IMPORTANT: Only enable after valid SSL certificate is installed
   */
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },

  /**
   * Cross-Origin-Opener-Policy
   * Process isolation from same-origin documents
   */
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },

  /**
   * Cross-Origin-Resource-Policy
   * Prevents cross-origin resource loading
   */
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin',
  },

  /**
   * Cross-Origin-Embedder-Policy
   * Controls cross-origin resource embedding
   */
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'require-corp',
  },

  /**
   * Cache-Control for HTML
   * Prevents caching of sensitive HTML content
   */
  {
    key: 'Cache-Control',
    value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  },

  /**
   * Pragma
   * Legacy cache control
   */
  {
    key: 'Pragma',
    value: 'no-cache',
  },
];

/**
 * Vercel Configuration (vercel.json)
 * Use this file when deploying to Vercel
 */
export const vercelConfig = {
  headers: [
    {
      source: '/:path*',
      headers: securityHeaders,
    },
    // Static assets - longer cache
    {
      source: '/assets/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    // Images - longer cache
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=2592000', // 30 days
        },
      ],
    },
  ],
};

/**
 * Nginx Configuration
 * Copy this to your Nginx server block
 */
export const nginxConfig = `
# Security Headers
add_header Content-Security-Policy "${securityHeaders[0].value}" always;
add_header X-Content-Type-Options "${securityHeaders[1].value}" always;
add_header X-Frame-Options "${securityHeaders[2].value}" always;
add_header X-XSS-Protection "${securityHeaders[3].value}" always;
add_header Referrer-Policy "${securityHeaders[4].value}" always;
add_header Permissions-Policy "${securityHeaders[5].value}" always;
add_header Strict-Transport-Security "${securityHeaders[6].value}" always;

# Hide server version
server_tokens off;

# Disable unwanted HTTP methods
if ($request_method !~ ^(GET|HEAD|POST)$ ) {
    return 405;
}

# File upload size limit
client_max_body_size 10M;
`;

/**
 * Apache Configuration (.htaccess)
 * Copy this to your .htaccess file
 */
export const apacheConfig = `
<IfModule mod_headers.c>
    # Security Headers
    Header always set Content-Security-Policy "${securityHeaders[0].value}"
    Header always set X-Content-Type-Options "${securityHeaders[1].value}"
    Header always set X-Frame-Options "${securityHeaders[2].value}"
    Header always set X-XSS-Protection "${securityHeaders[3].value}"
    Header always set Referrer-Policy "${securityHeaders[4].value}"
    Header always set Permissions-Policy "${securityHeaders[5].value}"
    Header always set Strict-Transport-Security "${securityHeaders[6].value}"

    # Disable server signature
    Header unset Server
    Header unset X-Powered-By

    # Prevent clickjacking
    Header set X-Frame-Options "DENY"
</IfModule>

<IfModule mod_rewrite.c>
    # Disable unwanted HTTP methods
    RewriteCond %{REQUEST_METHOD} ^(TRACE|TRACK|OPTIONS)$
    RewriteRule .* - [F]
</IfModule>

# File upload size limit
LimitRequestBody 10485760
`;

/**
 * Express.js Middleware
 * Use this if you have a custom Express server
 */
export function expressSecurityMiddleware() {
  return (req: any, res: any, next: any) => {
    securityHeaders.forEach(({ key, value }) => {
      res.setHeader(key, value);
    });
    next();
  };
}

/**
 * Next.js Middleware (next.config.js)
 * Use this if you're using Next.js
 */
export const nextjsConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

/**
 * Development vs Production CSP
 * Development mode has relaxed CSP for hot reload
 */
export function getCSPHeaders(isDevelopment: boolean) {
  if (isDevelopment) {
    return {
      key: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' ws://localhost:* http://localhost:*",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: http: blob:",
        "connect-src 'self' ws://localhost:* http://localhost:*",
      ].join('; '),
    };
  }

  return securityHeaders[0];
}

/**
 * CSP Report URI
 * Send CSP violation reports to this endpoint
 */
export const cspReportConfig = {
  key: 'Content-Security-Policy-Report-Only',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "report-uri /api/csp-violation-report",
    "report-to https://your-csp-endpoint.com/csp-report",
  ].join('; '),
};

/**
 * Export all configurations
 */
export default {
  securityHeaders,
  vercelConfig,
  nginxConfig,
  apacheConfig,
  expressSecurityMiddleware,
  nextjsConfig,
  getCSPHeaders,
  cspReportConfig,
};
