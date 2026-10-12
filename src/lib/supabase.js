import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase URL and Anon / Publishable Key from env or localStorage
const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const envSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_KEY;

const localSupabaseUrl = typeof window !== 'undefined' ? localStorage.getItem('cvnest_supabase_url') : null;
const localSupabaseAnonKey = typeof window !== 'undefined' ? localStorage.getItem('cvnest_supabase_anon_key') : null;

export const supabaseUrl = (envSupabaseUrl || localSupabaseUrl || '').trim();
export const supabaseAnonKey = (envSupabaseAnonKey || localSupabaseAnonKey || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id')
);

// Create Supabase client (or a dummy client if not configured yet)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

/**
 * Saves custom Supabase credentials from UI settings if needed
 */
export function setCustomSupabaseCredentials(url, anonKey) {
  if (url) localStorage.setItem('cvnest_supabase_url', url.trim());
  else localStorage.removeItem('cvnest_supabase_url');

  if (anonKey) localStorage.setItem('cvnest_supabase_anon_key', anonKey.trim());
  else localStorage.removeItem('cvnest_supabase_anon_key');

  window.location.reload();
}
