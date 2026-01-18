/**
 * Cookie Configuration
 *
 * Bu dosya cookie yönetimi için gerekli yapılandırmaları içerir.
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
