import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.length > 0 &&
  !supabaseUrl.includes('placeholder') &&
  supabaseAnon &&
  supabaseAnon.length > 0 &&
  !supabaseAnon.includes('placeholder')
);

// Create client with safe fallback if not configured
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnon : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

/** True when no real Supabase project is configured or in fallback demo mode */
export const USE_MOCK = !isSupabaseConfigured;

/** Asynchronously tests whether the Supabase database can be reached */
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  if (!isSupabaseConfigured) {
    return {
      connected: false,
      message: 'Supabase credentials not configured in .env. Running in Local Demo Mode.',
    };
  }

  try {
    const { error } = await supabase.from('organisations').select('id').limit(1);
    if (error) {
      return {
        connected: false,
        message: `Connected to Supabase endpoint, but query failed (${error.message}). Check database tables.`,
      };
    }
    return {
      connected: true,
      message: 'Successfully connected to live Supabase PostgreSQL database.',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      message: `Connection failed: ${msg}. Running in fallback demo mode.`,
    };
  }
}
