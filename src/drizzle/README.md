# Drizzle Database Schema

SQLite database schema tanımlamaları (Turso/libsql).

## 📋 Tablolar

### users

Kullanıcı hesapları.

```typescript
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  openId: text('open_id').notNull().unique(),
  role: text('role').notNull(),        // 'user', 'admin', 'escort'
  email: text('email'),
  displayName: text('display_name'),
});
```

### escortProfiles

Escort profilleri.

```typescript
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
```

### escortPhotos

Escort fotoğrafları.

```typescript
export const escortPhotos = sqliteTable('escort_photos', {
  id: integer('id').primaryKey(),
  profileId: integer('profile_id').notNull(),
  url: text('url').notNull(),
  order: integer('order').notNull(),
});
```

### conversations

Mesajlaşma konuşmaları.

### messages

Mesajlar.

## 🎯 Kullanım

```typescript
import { db } from '@/lib/db';
import { escortProfiles } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

// Query
const profiles = await db.select().from(escortProfiles);

// Insert
await db.insert(escortProfiles).values({...});

// Update
await db.update(escortProfiles)
  .set({ isVip: true })
  .where(eq(escortProfiles.id, id));
```

## 🔄 Migration

```bash
npm run db:generate    # Generate migrations
npm run db:migrate    # Run migrations
npm run db:push       # Push schema changes
npm run db:studio     # Open Drizzle Studio
```
