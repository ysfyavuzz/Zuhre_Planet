/**
 * Seed Data Script (Local PostgreSQL Version)
 *
 * Populates local database with test escort profiles for development.
 * Run with: npm run db:seed
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import * as schema from '../src/lib/db/schema'; // Ensure this path is correct based on your project structure, or define simplified schema here if needed for seed only.
// If schema import is tricky due to path alias, we can use raw sql.

// Database configuration
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/zuhre_db';
const client = postgres(connectionString);
const db = drizzle(client);

// Helper data
const cities = ["İstanbul", "Ankara", "İzmir", "Antalya", "Bursa"];
const districts = {
  İstanbul: ["Kadıköy", "Beyoğlu", "Beşiktaş", "Şişli"],
  Ankara: ["Çankaya", "Kızılay"],
  İzmir: ["Konak", "Alsancak"],
  Antalya: ["Muratpaşa", "Lara"],
  Bursa: ["Osmangazi"]
};
const firstNames = ["Ayşe", "Fatma", "Zeynep", "Elif", "Merve", "Selin", "Deniz"];
const lastNames = ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız"];

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function seed() {
  console.log("🌱 Starting seed process (Local DB)...\n");

  try {
    // 1. Create Admin User
    console.log("📝 Creating admin user...");
    
    // Hash for 'Test123!': $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hZ1.WnN6m
    const passwordHash = "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hZ1.WnN6m"; 

    await client`
      INSERT INTO users (email, password_hash, role, full_name, created_at)
      VALUES ('admin@zuhre.com', ${passwordHash}, 'admin', 'System Admin', NOW())
      ON CONFLICT (email) DO NOTHING
    `;

    // 2. Create Escort Users & Profiles
    console.log("🎭 Creating escort profiles...");
    
    for (let i = 1; i <= 10; i++) {
      const email = `escort${i}@example.com`;
      const firstName = randomItem(firstNames);
      const lastName = randomItem(lastNames);
      const fullName = `${firstName} ${lastName}`;
      const city = randomItem(cities);
      
      // Create User and Get ID
      const users = await client`
        INSERT INTO users (email, password_hash, role, full_name, created_at)
        VALUES (${email}, ${passwordHash}, 'escort', ${fullName}, NOW())
        ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
        RETURNING id
      `;
      
      const userId = users[0].id;

      // Create Profile
      const existing = await client`SELECT id FROM escort_profiles WHERE user_id = ${userId}`;
      
      if (existing.length === 0) {
        await client`
          INSERT INTO escort_profiles (
            user_id, slug, display_name, stage_name, city, district, age, bio, 
            tier, is_boosted
          ) VALUES (
            ${userId}, 
            ${`${firstName}-${city}-${i}`.toLowerCase()}, 
            ${fullName},
            ${firstName},
            ${city}, 
            ${randomItem(districts[city] || [])}, 
            ${Math.floor(Math.random() * 10) + 20}, 
            'Profesyonel hizmet.', 
            'gold',
            ${Math.random() > 0.8}
          )
        `;
        console.log(`   ✓ Created ${email} (ID: ${userId})`);
      }
    }

    console.log("\n✅ Seed completed successfully!");
    console.log("\n🔐 Credentials:");
    console.log("   Admin: admin@zuhre.com / Test123!");
    console.log("   Escort: escort1@example.com / Test123!");

  } catch (error) {
    console.error("\n❌ Seed failed:", error);
  } finally {
    await client.end();
  }
}

seed();
