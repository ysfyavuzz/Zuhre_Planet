/**
 * Cookie Configuration Module (cookies.ts)
 * 
 * HTTP cookie configuration and utilities for session management and authentication.
 * Defines cookie security settings and constants for the application.
 * 
 * @module lib/_core/cookies
 * @category Library - Core
 * 
 * Features:
 * - Cookie name constants (COOKIE_NAME)
 * - Secure cookie options (HttpOnly, Secure, SameSite)
 * - Session cookie configuration
 * - Environment-aware security settings
 * 
 * Cookie Security:
 * - HttpOnly: Prevents JavaScript access to cookies
 * - Secure: Only sent over HTTPS in production
 * - SameSite: Set to 'lax' to prevent CSRF attacks
 * - Path: Set to '/' for application-wide access
 * - MaxAge: 7 days (604800 seconds)
 * 
 * Environment Variables:
 * - NODE_ENV: Determines if cookies use secure flag (secure in production only)
 * 
 * @example
 * ```typescript
 * import { COOKIE_NAME, getSessionCookieOptions } from '@/lib/_core/cookies';
 * 
 * // Set cookie in response
 * const options = getSessionCookieOptions(req);
 * res.cookie(COOKIE_NAME, token, options);
 * 
 * // Clear cookie
 * res.clearCookie(COOKIE_NAME, { ...options, maxAge: -1 });
 * ```
 * 
 * @constant {string} COOKIE_NAME - The authentication cookie identifier
 */

export const COOKIE_NAME = 'auth-token';

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}
