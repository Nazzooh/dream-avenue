/**
 * Shared Supabase Client Instance
 * This is the single source of truth for the Supabase client.
 * All other modules should import this client to avoid multiple GoTrueClient instances.
 */
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Create a single, shared Supabase client instance
export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Auto-heal stale or revoked session tokens in browser localStorage
if (typeof window !== 'undefined') {
  const storageKey = `sb-${projectId}-auth-token`;
  
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'TOKEN_REFRESH_FAILED' || event === 'SIGNED_OUT') {
      try {
        localStorage.removeItem(storageKey);
      } catch (_) {}
    }
  });

  // Verify session on startup and purge if token is dead
  supabase.auth.getSession().then(({ error }) => {
    if (error && error.message?.toLowerCase().includes('refresh token')) {
      try {
        localStorage.removeItem(storageKey);
        supabase.auth.signOut({ scope: 'local' }).catch(() => {});
      } catch (_) {}
    }
  }).catch(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (_) {}
  });
}
