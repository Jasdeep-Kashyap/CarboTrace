import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  ?? 'https://placeholder.supabase.co';
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnon);

/** True when no real Supabase project is configured */
export const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL;
