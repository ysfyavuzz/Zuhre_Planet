/**
 * JWT Token Management Module
 *
 * Provides comprehensive JWT token management utilities including:
 * - Token generation with configurable expiry
 * - Token verification and validation
 * - Access and refresh token utilities
 * - Token payload interfaces
 * - Expiry management
 *
 * @module lib/security/jwt
 * @category Library - Security
 *
 * @example
 * ```typescript
 * import {
 *   generateAccessToken,
 *   generateRefreshToken,
 *   verifyAccessToken,
 *   verifyRefreshToken,
 * } from '@/lib/security/jwt';
 *
 * // Generate tokens
 * const accessToken = generateAccessToken({ userId: '123', role: 'user' });
 * const refreshToken = generateRefreshToken({ userId: '123' });
 *
 * // Verify tokens
 * try {
 *   const payload = verifyAccessToken(accessToken);
 *   console.log('Token valid:', payload);
 * } catch (error) {
 *   console.error('Token invalid:', error.message);
 * }
 *
 * // Check expiry
 * const timeToExpiry = getTimeToExpiry(token);
 * if (timeToExpiry < 60000) { // Less than 1 minute
 *   // Refresh the token
 * }
 * ```
 */

import jwt, { SignOptions, VerifyOptions, JwtPayload } from 'jsonwebtoken';

/**
 * JWT configuration
 * @internal
 */
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-refresh-secret-key-change-in-production';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

/**
 * Token payload interface for access tokens
 *
 * @interface TokenPayload
 * @property {string} userId - Unique identifier of the user
 * @property {string} [email] - User email address
 * @property {string} [role] - User role (e.g., 'user', 'admin', 'moderator')
 * @property {string[]} [permissions] - Array of user permissions
 * @property {number} [iat] - Issued at timestamp (automatically set by JWT)
 * @property {number} [exp] - Expiration timestamp (automatically set by JWT)
 */
export interface TokenPayload extends JwtPayload {
  userId: string;
  email?: string;
  role?: string;
  permissions?: string[];
}

/**
 * Refresh token payload interface
 *
 * @interface RefreshTokenPayload
 * @property {string} userId - Unique identifier of the user
 * @property {number} [iat] - Issued at timestamp (automatically set by JWT)
 * @property {number} [exp] - Expiration timestamp (automatically set by JWT)
 */
export interface RefreshTokenPayload extends JwtPayload {
  userId: string;
}

/**
 * Decoded token with metadata
 *
 * @interface DecodedToken
 * @property {TokenPayload} payload - The token payload
 * @property {number} expiresAt - Token expiration timestamp (milliseconds)
 * @property {number} issuedAt - Token issued timestamp (milliseconds)
 * @property {number} expiresIn - Milliseconds until token expires
 */
export interface DecodedToken {
  payload: TokenPayload;
  expiresAt: number;
  issuedAt: number;
  expiresIn: number;
}

/**
 * Generates an access token with optional custom claims
 *
 * @param {TokenPayload} payload - Token payload containing user information
 * @param {string} [expiresIn] - Token expiry duration (default: 15m, examples: '1h', '7d', '3600')
 * @param {SignOptions} [options] - Additional JWT sign options
 * @returns {string} Signed JWT access token
 *
 * @throws {Error} If token generation fails
 *
 * @example
 * ```typescript
 * const token = generateAccessToken({
 *   userId: 'user123',
 *   email: 'user@example.com',
 *   role: 'admin',
 *   permissions: ['read', 'write', 'delete']
 * });
 *
 * // With custom expiry
 * const shortLivedToken = generateAccessToken(
 *   { userId: 'user123' },
 *   '5m'
 * );
 * ```
 */
export function generateAccessToken(
  payload: TokenPayload,
  expiresIn: string = ACCESS_TOKEN_EXPIRY,
  options?: SignOptions
): string {
  const { iat, exp, ...cleanPayload } = payload;

  return jwt.sign(cleanPayload, JWT_SECRET, {
    expiresIn: expiresIn as unknown as number,
    algorithm: 'HS256',
    ...options,
  });
}

/**
 * Generates a refresh token
 *
 * @param {RefreshTokenPayload} payload - Refresh token payload (typically just userId)
 * @param {string} [expiresIn] - Token expiry duration (default: 7d, examples: '1h', '7d', '3600')
 * @param {SignOptions} [options] - Additional JWT sign options
 * @returns {string} Signed JWT refresh token
 *
 * @throws {Error} If token generation fails
 *
 * @example
 * ```typescript
 * const refreshToken = generateRefreshToken({ userId: 'user123' });
 *
 * // With custom expiry
 * const longerRefreshToken = generateRefreshToken(
 *   { userId: 'user123' },
 *   '30d'
 * );
 * ```
 */
export function generateRefreshToken(
  payload: RefreshTokenPayload,
  expiresIn: string = REFRESH_TOKEN_EXPIRY,
  options?: SignOptions
): string {
  const { iat, exp, ...cleanPayload } = payload;

  return jwt.sign(cleanPayload, JWT_REFRESH_SECRET, {
    expiresIn: expiresIn as unknown as number,
    algorithm: 'HS256',
    ...options,
  });
}

/**
 * Verifies an access token and returns the decoded payload
 *
 * @param {string} token - The access token to verify
 * @param {VerifyOptions} [options] - Additional JWT verify options
 * @returns {TokenPayload} Decoded token payload
 *
 * @throws {Error} If token verification fails (invalid, expired, malformed)
 *
 * @example
 * ```typescript
 * try {
 *   const payload = verifyAccessToken(token);
 *   console.log('Token valid, user ID:', payload.userId);
 * } catch (error) {
 *   if (error.name === 'TokenExpiredError') {
 *     console.error('Token has expired');
 *   } else if (error.name === 'JsonWebTokenError') {
 *     console.error('Token is invalid');
 *   }
 * }
 * ```
 */
export function verifyAccessToken(token: string, options?: VerifyOptions): TokenPayload {
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      ...options,
    }) as TokenPayload;

    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    }
    throw error;
  }
}

/**
 * Verifies a refresh token and returns the decoded payload
 *
 * @param {string} token - The refresh token to verify
 * @param {VerifyOptions} [options] - Additional JWT verify options
 * @returns {RefreshTokenPayload} Decoded refresh token payload
 *
 * @throws {Error} If token verification fails (invalid, expired, malformed)
 *
 * @example
 * ```typescript
 * try {
 *   const payload = verifyRefreshToken(refreshToken);
 *   // Generate new access token using the refresh token
 *   const newAccessToken = generateAccessToken({ userId: payload.userId });
 * } catch (error) {
 *   console.error('Refresh token invalid:', error.message);
 * }
 * ```
 */
export function verifyRefreshToken(token: string, options?: VerifyOptions): RefreshTokenPayload {
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET, {
      algorithms: ['HS256'],
      ...options,
    }) as RefreshTokenPayload;

    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
}

/**
 * Decodes a token without verification (useful for debugging or checking payload before expiry)
 *
 * @param {string} token - The token to decode
 * @returns {TokenPayload | null} Decoded payload or null if invalid
 *
 * @example
 * ```typescript
 * const payload = decodeToken(token);
 * if (payload) {
 *   console.log('Token payload:', payload);
 * }
 * ```
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = jwt.decode(token) as TokenPayload | null;
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Gets the time remaining until token expiry (in milliseconds)
 *
 * @param {string} token - The token to check
 * @returns {number | null} Milliseconds until expiry, or null if token is invalid/already expired
 *
 * @example
 * ```typescript
 * const timeToExpiry = getTimeToExpiry(token);
 * if (timeToExpiry !== null) {
 *   if (timeToExpiry < 60000) { // Less than 1 minute
 *     console.log('Token expiring soon, should refresh');
 *   }
 * }
 * ```
 */
export function getTimeToExpiry(token: string): number | null {
  try {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) {
      return null;
    }

    const expiryMs = payload.exp * 1000;
    const now = Date.now();
    const timeRemaining = expiryMs - now;

    return timeRemaining > 0 ? timeRemaining : null;
  } catch (error) {
    return null;
  }
}

/**
 * Checks if a token is expired
 *
 * @param {string} token - The token to check
 * @returns {boolean} True if token is expired or invalid, false otherwise
 *
 * @example
 * ```typescript
 * if (isTokenExpired(token)) {
 *   // Redirect to login or refresh token
 * }
 * ```
 */
export function isTokenExpired(token: string): boolean {
  const timeToExpiry = getTimeToExpiry(token);
  return timeToExpiry === null || timeToExpiry <= 0;
}

/**
 * Gets expiration timestamp from token (in milliseconds)
 *
 * @param {string} token - The token to check
 * @returns {number | null} Expiration timestamp in milliseconds, or null if invalid
 *
 * @example
 * ```typescript
 * const expiresAt = getTokenExpiresAt(token);
 * if (expiresAt) {
 *   const expiryDate = new Date(expiresAt);
 *   console.log('Token expires at:', expiryDate);
 * }
 * ```
 */
export function getTokenExpiresAt(token: string): number | null {
  try {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) {
      return null;
    }
    return payload.exp * 1000;
  } catch (error) {
    return null;
  }
}

/**
 * Gets the issued-at timestamp from token (in milliseconds)
 *
 * @param {string} token - The token to check
 * @returns {number | null} Issued-at timestamp in milliseconds, or null if invalid
 *
 * @example
 * ```typescript
 * const issuedAt = getTokenIssuedAt(token);
 * if (issuedAt) {
 *   console.log('Token was issued:', new Date(issuedAt));
 * }
 * ```
 */
export function getTokenIssuedAt(token: string): number | null {
  try {
    const payload = decodeToken(token);
    if (!payload || !payload.iat) {
      return null;
    }
    return payload.iat * 1000;
  } catch (error) {
    return null;
  }
}

/**
 * Safely decodes a token with comprehensive metadata
 *
 * @param {string} token - The token to decode
 * @returns {DecodedToken | null} Decoded token with metadata or null if invalid
 *
 * @example
 * ```typescript
 * const decoded = getTokenMetadata(token);
 * if (decoded) {
 *   console.log('User ID:', decoded.payload.userId);
 *   console.log('Expires in:', decoded.expiresIn, 'ms');
 * }
 * ```
 */
export function getTokenMetadata(token: string): DecodedToken | null {
  try {
    const payload = decodeToken(token);
    if (!payload || !payload.exp || !payload.iat) {
      return null;
    }

    const expiresAt = payload.exp * 1000;
    const issuedAt = payload.iat * 1000;
    const expiresIn = expiresAt - Date.now();

    return {
      payload,
      expiresAt,
      issuedAt,
      expiresIn,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Checks if token should be refreshed (typically when expiring soon)
 *
 * @param {string} token - The token to check
 * @param {number} [thresholdMs] - Milliseconds before expiry to trigger refresh (default: 60000 = 1 minute)
 * @returns {boolean} True if token should be refreshed, false otherwise
 *
 * @example
 * ```typescript
 * if (shouldRefreshToken(token)) {
 *   const newToken = generateAccessToken({ userId });
 *   // Update token in state/storage
 * }
 * ```
 */
export function shouldRefreshToken(token: string, thresholdMs: number = 60000): boolean {
  const timeToExpiry = getTimeToExpiry(token);
  return timeToExpiry !== null && timeToExpiry < thresholdMs;
}

/**
 * Validates token structure (without cryptographic verification)
 *
 * @param {string} token - The token to validate
 * @returns {boolean} True if token has valid JWT structure, false otherwise
 *
 * @example
 * ```typescript
 * if (!isValidTokenFormat(token)) {
 *   console.error('Invalid token format');
 * }
 * ```
 */
export function isValidTokenFormat(token: string): boolean {
  if (typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    for (const part of parts) {
      Buffer.from(part, 'base64');
    }
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Creates a token pair (access + refresh) for initial authentication
 *
 * @param {TokenPayload} accessPayload - Payload for access token
 * @param {string} userId - User ID for refresh token
 * @returns {{ accessToken: string; refreshToken: string }} Object containing both tokens
 *
 * @example
 * ```typescript
 * const { accessToken, refreshToken } = createTokenPair({
 *   userId: 'user123',
 *   role: 'user'
 * }, 'user123');
 *
 * // Store or send to client
 * res.json({ accessToken, refreshToken });
 * ```
 */
export function createTokenPair(
  accessPayload: TokenPayload,
  userId: string
): { accessToken: string; refreshToken: string } {
  const accessToken = generateAccessToken(accessPayload);
  const refreshToken = generateRefreshToken({ userId });

  return { accessToken, refreshToken };
}

/**
 * Refreshes an access token using a refresh token
 *
 * @param {string} refreshToken - The refresh token
 * @param {Partial<TokenPayload>} [additionalPayload] - Optional additional claims for new access token
 * @returns {string} New access token
 *
 * @throws {Error} If refresh token is invalid
 *
 * @example
 * ```typescript
 * try {
 *   const newAccessToken = refreshAccessToken(refreshToken, { role: 'admin' });
 *   // Use new token
 * } catch (error) {
 *   // Redirect to login
 * }
 * ```
 */
export function refreshAccessToken(
  refreshToken: string,
  additionalPayload?: Partial<TokenPayload>
): string {
  const payload = verifyRefreshToken(refreshToken);

  const newAccessPayload: TokenPayload = {
    userId: payload.userId,
    ...additionalPayload,
  };

  return generateAccessToken(newAccessPayload);
}
