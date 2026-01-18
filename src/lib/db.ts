/**
 * Database Module (db.ts)
 * 
 * Core database configuration and initialization using Drizzle ORM with Turso (libsql) backend.
 * This module provides the main database client instance and helper functions for querying
 * escort profiles, photos, users, and related data.
 * 
 * @module lib/db
 * @category Library - Database
 * 
 * Features:
 * - Database connection setup for production (Turso/libsql)
 * - Health check functionality for database connectivity
 * - Escort profile queries (list, search, get by ID)
 * - Photo management functions
 * - City/location queries
 * - Credit and VIP management (mock implementations)
 * 
 * Database Provider:
 * - Primary: Turso (libsql) - SQLite-compatible cloud database
 * - Alternative providers supported: PostgreSQL, MySQL, SQLite
 * 
 * Environment Variables Required:
 * - VITE_TURSO_URL: Database connection URL
 * - VITE_TURSO_AUTH_TOKEN: Authentication token for database
 * 
 * @example
 * ```typescript
 * import { db, getEscortProfileById, searchEscortsAdvanced } from '@/lib/db';
 * 
 * // Get single escort profile
 * const profile = await getEscortProfileById(1);
 * 
 * // Search with filters
 * const results = await searchEscortsAdvanced({
 *   city: 'İstanbul',
 *   minAge: 18,
 *   maxAge: 35,
 *   minRate: 1000,
 *   limit: 20
 * });
 * ```
 * 
 * @todo Implement actual credit transaction logic
 * @todo Implement actual VIP activation persistence
 * @todo Add proper view count tracking with separate table
 */

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql-client';
import { users, escortProfiles, escortPhotos } from '../drizzle/schema';
import { eq, desc, like, and, or, sql } from 'drizzle-orm';

// Database client setup for production
// Note: This is for Turso (libsql), you can replace with your preferred database

const isDev = process.env.NODE_ENV === 'development';

// Get environment variables
const TURSO_URL = process.env.VITE_TURSO_URL || process.env.TURSO_URL || '';
const TURSO_AUTH_TOKEN = process.env.VITE_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || '';

// Create Turso client
const turso = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN,
});

// Create Drizzle instance
export const db = drizzle(turso, {
  logger: isDev,
});

// Alternative: For other databases, you can use:

// For PostgreSQL:
// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
//
// const connectionString = process.env.DATABASE_URL!;
// const client = postgres(connectionString);
// export const db = drizzle(client);

// For MySQL:
// import { drizzle } from 'drizzle-orm/mysql2';
// import mysql from 'mysql2/promise';
//
// const connection = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });
// export const db = drizzle(connection);

// For SQLite (local development):
// import { drizzle } from 'drizzle-orm/better-sqlite3';
// import Database from 'better-sqlite3';
//
// const sqlite = new Database('local.db');
// export const db = drizzle(sqlite);

// Health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Simple query to check connection
    await db.select().from(users).limit(1);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Close database connection
export async function closeDatabaseConnection(): Promise<void> {
  try {
    // For Turso/libsql, there's no explicit close method
    // For other databases, you might need to close the connection
    // await client.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}

// Export schema types
export * from '@/schema';

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

// Escort Profile Functions
export async function getAllApprovedEscorts(limit?: number, offset?: number) {
  const query = db
    .select()
    .from(escortProfiles)
    .where(eq(escortProfiles.isVerifiedByAdmin, true))
    .orderBy(desc(escortProfiles.id));

  if (limit) query.limit(limit);
  if (offset) query.offset(offset);

  return query;
}

export async function searchEscortsAdvanced(params: {
  city?: string;
  district?: string;
  minAge?: number;
  maxAge?: number;
  minRate?: number;
  maxRate?: number;
  isVip?: boolean;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}) {
  const conditions = [];

  if (params.city) {
    conditions.push(eq(escortProfiles.city, params.city));
  }
  if (params.district) {
    conditions.push(eq(escortProfiles.district, params.district));
  }
  if (params.minAge) {
    conditions.push(sql`${escortProfiles.age} >= ${params.minAge}`);
  }
  if (params.maxAge) {
    conditions.push(sql`${escortProfiles.age} <= ${params.maxAge}`);
  }
  if (params.minRate) {
    conditions.push(sql`${escortProfiles.hourlyRate} >= ${params.minRate}`);
  }
  if (params.maxRate) {
    conditions.push(sql`${escortProfiles.hourlyRate} <= ${params.maxRate}`);
  }
  if (params.isVip !== undefined) {
    conditions.push(eq(escortProfiles.isVip, params.isVip));
  }
  if (params.searchTerm) {
    const displayNameCondition = like(escortProfiles.displayName, `%${params.searchTerm}%`);
    const bioConditions = escortProfiles.bio
      ? like(escortProfiles.bio, `%${params.searchTerm}%`)
      : undefined;
    conditions.push(
      bioConditions
        ? or(displayNameCondition, bioConditions)
        : displayNameCondition
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const query = db
    .select()
    .from(escortProfiles)
    .where(whereClause)
    .orderBy(desc(escortProfiles.isVip), desc(escortProfiles.id));

  if (params.limit) query.limit(params.limit);
  if (params.offset) query.offset(params.offset);

  return query;
}

export async function getEscortProfileById(id: number | string) {
  const numericId = typeof id === 'string' ? parseInt(id) : id;
  const result = await db
    .select()
    .from(escortProfiles)
    .where(eq(escortProfiles.id, numericId))
    .limit(1);
  return result[0] || null;
}

export async function getEscortProfileByUserId(userId: number) {
  const result = await db
    .select()
    .from(escortProfiles)
    .where(eq(escortProfiles.userId, userId))
    .limit(1);
  return result[0] || null;
}

export async function incrementViewCount(profileId: number | string) {
  const numericId = typeof profileId === 'string' ? parseInt(profileId) : profileId;
  // Note: This is a simplified version. You should implement proper view count tracking
  // with a separate table to avoid concurrent updates
  await db
    .update(escortProfiles)
    .set({ /* viewCount: sql`${escortProfiles.viewCount} + 1` */ })
    .where(eq(escortProfiles.id, numericId));
}

export async function getEscortPhotos(profileId: number | string) {
  const numericId = typeof profileId === 'string' ? parseInt(profileId) : profileId;
  return db
    .select()
    .from(escortPhotos)
    .where(eq(escortPhotos.profileId, numericId))
    .orderBy(escortPhotos.order);
}

export async function getCities() {
  const result = await db
    .selectDistinct({ city: escortProfiles.city })
    .from(escortProfiles)
    .orderBy(escortProfiles.city);
  return result.map(r => r.city);
}

// Payment & Credit Functions (Mock implementations)
export async function createCreditTransaction(userId: number, amount: number, type: 'purchase' | 'spend') {
  // TODO: Implement actual credit transaction logic
  return { success: true, balance: amount };
}

export async function getUserCredits(userId: number) {
  // TODO: Implement actual credit retrieval logic
  return 0;
}

export async function activateVip(profileId: number, duration: number) {
  // TODO: Implement VIP activation logic
  return { success: true };
}
