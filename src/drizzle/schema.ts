/**
 * Drizzle Schema
 *
 * Veritabanı şema tanımlamaları
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  openId: text('open_id').notNull().unique(),
  role: text('role').notNull(),
  email: text('email'),
  displayName: text('display_name'),
});

export const escortProfiles = sqliteTable('escort_profiles', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(),
  displayName: text('display_name').notNull(),
  city: text('city').notNull(),
  district: text('district').notNull(),
  bio: text('bio'),
  age: integer('age'),
  hourlyRate: integer('hourly_rate'),
  isVip: integer('is_vip', { mode: 'boolean' }).notNull().default(false),
  isVerifiedByAdmin: integer('is_verified', { mode: 'boolean' }).notNull().default(false),
});

export const escortPhotos = sqliteTable('escort_photos', {
  id: integer('id').primaryKey(),
  profileId: integer('profile_id').notNull(),
  url: text('url').notNull(),
  order: integer('order').notNull(),
});

export const conversations = sqliteTable('conversations', {
  id: integer('id').primaryKey(),
  participant1Id: integer('participant1_id').notNull(),
  participant2Id: integer('participant2_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey(),
  conversationId: integer('conversation_id').notNull(),
  senderId: integer('sender_id').notNull(),
  content: text('content').notNull(),
  readAt: integer('read_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
