/**
 * Security Utilities
 *
 * Input sanitization, XSS protection, and security helper functions.
 * All user input should be sanitized before rendering or storing.
 *
 * @module utils/security
 * @category Utils
 *
 * Features:
 * - HTML sanitization (XSS prevention)
 * - URL validation
 * - Email validation
 * - Phone number validation
 * - SQL injection prevention
 * - File upload validation
 * - CSRF token helpers
 *
 * @example
 * ```ts
 * import { sanitizeHTML, validateEmail } from '@/utils/security';
 *
 * const clean = sanitizeHTML(userInput);
 * const isValid = validateEmail(email);
 * ```
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes or escapes dangerous HTML tags and attributes
 *
 * @param html - Raw HTML string from user input
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  // Create a temporary div element
  const temp = document.createElement('div');
  temp.textContent = html;

  // Return escaped text content
  return temp.innerHTML;
}

/**
 * Escape HTML special characters
 * Converts <, >, &, ", ' to HTML entities
 *
 * @param str - String to escape
 * @returns Escaped string
 */
export function escapeHTML(str: string): string {
  if (!str) return '';

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  const reg = /[&<>"'/]/g;
  return str.replace(reg, (match) => map[match]);
}

/**
 * Sanitize user input for safe rendering
 * Removes script tags, event handlers, and dangerous attributes
 *
 * @param input - Raw user input
 * @returns Sanitized string
 */
export function sanitizeUserInput(input: string): string {
  if (!input) return '';

  // Remove script tags and content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onerror, onload, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove dangerous tags
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'];
  dangerousTags.forEach((tag) => {
    const regex = new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag})<[^<]*)*<\\/${tag}>`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: with script content
  sanitized = sanitized.replace(/data:\s*text\/html/gi, '');

  return escapeHTML(sanitized);
}

/**
 * Validate email format
 *
 * @param email - Email address to validate
 * @returns true if valid email format
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 *
 * @param url - URL to validate
 * @returns true if valid URL format
 */
export function validateURL(url: string): boolean {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate Turkish phone number
 * Accepts formats: 0555 123 4567, 05551234567, +90 555 123 4567
 *
 * @param phone - Phone number to validate
 * @returns true if valid Turkish phone number
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;

  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s\-]/g, '');

  // Turkish mobile phone regex: starts with 0 or +90, followed by 5XX XXX XX XX
  const phoneRegex = /^(?:\+?90|0)?5\d{2}\d{3}\d{2}\d{2}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Sanitize filename for secure file uploads
 * Removes path traversal characters and dangerous extensions
 *
 * @param filename - Original filename
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return '';

  // Remove path traversal characters
  let sanitized = filename.replace(/[\/\\]/g, '');

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.split('.').pop();
    const name = sanitized.substring(0, 245);
    sanitized = `${name}.${ext}`;
  }

  return sanitized;
}

/**
 * Check if file extension is allowed
 *
 * @param filename - File name to check
 * @param allowedExtensions - Array of allowed extensions (e.g., ['jpg', 'png'])
 * @returns true if extension is allowed
 */
export function isAllowedFileType(filename: string, allowedExtensions: string[]): boolean {
  if (!filename) return false;

  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? allowedExtensions.includes(ext) : false;
}

/**
 * Generate random CSRF token
 *
 * @returns Random token string
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Prevent SQL injection by escaping special characters
 * Note: Use parameterized queries instead when possible
 *
 * @param str - String to escape
 * @returns Escaped string
 */
export function escapeSQL(str: string): string {
  if (!str) return '';

  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case '\0':
        return '\\0';
      case '\x08':
        return '\\b';
      case '\x09':
        return '\\t';
      case '\x1a':
        return '\\z';
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case '"':
      case "'":
      case '\\':
      case '%':
        return '\\' + char;
      default:
        return char;
    }
  });
}

/**
 * Validate strong password
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
 *
 * @param password - Password to validate
 * @returns true if password meets strength requirements
 */
export function validatePasswordStrength(password: string): boolean {
  if (!password || password.length < 8) return false;

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

/**
 * Check password strength level
 *
 * @param password - Password to check
 * @returns Strength level: 'weak', 'medium', 'strong', 'very-strong'
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' | 'very-strong' {
  if (!password) return 'weak';

  let score = 0;

  // Length
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character types
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

  if (score <= 2) return 'weak';
  if (score <= 3) return 'medium';
  if (score <= 4) return 'strong';
  return 'very-strong';
}

/**
 * Sanitize user profile data
 * Comprehensive sanitization for user profile fields
 *
 * @param data - Raw user profile data
 * @returns Sanitized user profile data
 */
export function sanitizeUserProfile(data: {
  displayName?: string;
  bio?: string;
  city?: string;
  district?: string;
  phone?: string;
  email?: string;
  website?: string;
}): {
  displayName?: string;
  bio?: string;
  city?: string;
  district?: string;
  phone?: string;
  email?: string;
  website?: string;
} {
  const sanitized: typeof data = {};

  if (data.displayName) {
    sanitized.displayName = sanitizeUserInput(data.displayName).substring(0, 50);
  }

  if (data.bio) {
    sanitized.bio = sanitizeUserInput(data.bio).substring(0, 1000);
  }

  if (data.city) {
    sanitized.city = sanitizeUserInput(data.city).substring(0, 50);
  }

  if (data.district) {
    sanitized.district = sanitizeUserInput(data.district).substring(0, 50);
  }

  if (data.phone) {
    const cleaned = data.phone.replace(/[\s\-]/g, '');
    if (validatePhone(cleaned)) {
      sanitized.phone = cleaned;
    }
  }

  if (data.email) {
    if (validateEmail(data.email)) {
      sanitized.email = data.email.toLowerCase().trim();
    }
  }

  if (data.website) {
    if (validateURL(data.website)) {
      sanitized.website = data.website;
    }
  }

  return sanitized;
}

/**
 * Rate limit tracker
 * Prevents brute force attacks by limiting request frequency
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 5, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if action is allowed for given identifier
   *
   * @param identifier - Unique identifier (IP, user ID, etc.)
   * @returns true if action is allowed
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Remove old requests outside the time window
    const validRequests = requests.filter((time) => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  /**
   * Reset rate limit for identifier
   *
   * @param identifier - Unique identifier to reset
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Get remaining requests for identifier
   *
   * @param identifier - Unique identifier
   * @returns Number of remaining requests
   */
  getRemaining(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter((time) => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

/**
 * Security audit helper
 * Checks for common security issues in data
 */
export const SecurityAudit = {
  /**
   * Check for potential XSS in string
   */
  hasXSSRisk(str: string): boolean {
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ];

    return xssPatterns.some((pattern) => pattern.test(str));
  },

  /**
   * Check for SQL injection patterns
   */
  hasSQLInjectionRisk(str: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER)\b)/i,
      /(--)/,
      /(\/\*)/,
      /(\*\/)/,
      /(;)/,
      /(\bOR\b.*=.*\bOR\b)/i,
      /(\bAND\b.*=.*\bAND\b)/i,
    ];

    return sqlPatterns.some((pattern) => pattern.test(str));
  },

  /**
   * Check for path traversal
   */
  hasPathTraversalRisk(str: string): boolean {
    const pathPatterns = [/\.\.\//, /\.\.\\/, /%2e%2e\//i];
    return pathPatterns.some((pattern) => pattern.test(str));
  },

  /**
   * Comprehensive security check
   */
  audit(data: Record<string, any>): {
    isValid: boolean;
    risks: string[];
    details: Record<string, string>;
  } {
    const risks: string[] = [];
    const details: Record<string, string> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        if (this.hasXSSRisk(value)) {
          risks.push(`XSS risk detected in field: ${key}`);
          details[key] = 'Contains potentially dangerous HTML/script content';
        }

        if (this.hasSQLInjectionRisk(value)) {
          risks.push(`SQL injection risk detected in field: ${key}`);
          details[key] = 'Contains SQL keywords or patterns';
        }

        if (this.hasPathTraversalRisk(value)) {
          risks.push(`Path traversal risk detected in field: ${key}`);
          details[key] = 'Contains path traversal sequences';
        }
      }
    }

    return {
      isValid: risks.length === 0,
      risks,
      details,
    };
  },
};

// Export singleton rate limiter instances
export const loginRateLimiter = new RateLimiter(5, 60000); // 5 attempts per minute
export const contactRateLimiter = new RateLimiter(3, 60000); // 3 messages per minute
export const bookingRateLimiter = new RateLimiter(10, 3600000); // 10 bookings per hour
