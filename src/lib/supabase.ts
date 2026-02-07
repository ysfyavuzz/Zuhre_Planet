
/**
 * Supabase Client Module (supabase.ts)
 * 
 * Initializes the Supabase client for authentication, realtime subscriptions,
 * and storage operations. Reads configuration from environment variables.
 * 
 * @module lib/supabase
 * @category Library - Database
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
