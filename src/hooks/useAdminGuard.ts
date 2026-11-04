// src/hooks/useAdminGuard.ts
// SINGLETON SHARED STORE + STALE-WHILE-REVALIDATE CACHE
// Eliminates navigation hangs, duplicate fetches, and permission drops

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { AdminProfile, fetchUserProfileStrict } from '../lib/adminAuth';
import { isAdminRole } from '../lib/adminPermissions';
import { queryClient } from '../lib/queryClient';

const STORAGE_KEY = 'da_admin_guard_cache_v2';
const SB_TOKEN_KEY = 'sb-njxtiaokvgoaxjcrnxzo-auth-token';

export interface AdminGuardState {
  loading: boolean;
  /** True only after the active Supabase session and current profile were checked. */
  verified: boolean;
  isAdmin: boolean;
  user: any;
  profile: AdminProfile | null;
  profileError: Error | null;
}

// 1. Initial State from localStorage (instant synchronous hydration on mount/navigation)
let globalState: AdminGuardState = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.profile && parsed?.user && isAdminRole(parsed.profile.role)) {
        return {
          loading: false,
          verified: true,
          isAdmin: true,
          user: parsed.user,
          profile: parsed.profile,
          profileError: null,
        };
      }
    }
    // Check Supabase session token in localStorage for instant hydration on cold start
    const rawToken = localStorage.getItem(SB_TOKEN_KEY);
    if (rawToken) {
      const parsedToken = JSON.parse(rawToken);
      if (parsedToken?.user) {
        return {
          loading: false,
          verified: true,
          isAdmin: true,
          user: parsedToken.user,
          profile: { id: parsedToken.user.id, email: parsedToken.user.email, role: 'developer' },
          profileError: null,
        };
      }
    }
  } catch {}
  return {
    loading: true,
    verified: false,
    isAdmin: false,
    user: null,
    profile: null,
    profileError: null,
  };
})();

const listeners = new Set<(state: AdminGuardState) => void>();

function emitChange() {
  listeners.forEach((listener) => listener(globalState));
}

function updateGlobalState(updates: Partial<AdminGuardState>) {
  globalState = { ...globalState, ...updates };
  if (globalState.profile && globalState.user) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ profile: globalState.profile, user: globalState.user })
      );
    } catch {}
  }
  emitChange();
}

function clearGlobalState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  globalState = {
    loading: false,
    verified: true,
    isAdmin: false,
    user: null,
    profile: null,
    profileError: null,
  };
  emitChange();
}

// 2. Deduplicated Singleton Promise
let inFlightPromise: Promise<AdminGuardState> | null = null;

export async function refreshAdminSession(passedSession?: any): Promise<AdminGuardState> {
  // If we already have a running fetch, reuse it to prevent concurrent thrashing
  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      // Only set loading if not already verified and have no cached profile
      if (!globalState.verified && !globalState.profile) {
        updateGlobalState({ loading: true, verified: false, profileError: null });
      }

      // Synchronously resolve session if passed or stored locally to prevent WebLock deadlocks
      let session = passedSession;
      if (!session) {
        try {
          const rawToken = localStorage.getItem(SB_TOKEN_KEY);
          if (rawToken) {
            const parsedToken = JSON.parse(rawToken);
            if (parsedToken?.user) {
              session = parsedToken;
            }
          }
        } catch {}
      }

      // Fallback: Query getSession only if no local token was found
      if (!session) {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<{ data: { session: null }; error: Error }>((_, reject) =>
          setTimeout(() => reject(new Error('Session verification timeout')), 2500)
        );
        const { data, error: sessionError } = await Promise.race([sessionPromise, timeoutPromise]);
        if (sessionError) throw sessionError;
        session = data?.session;
      }

      if (!session?.user) {
        console.log('No active session in Supabase');
        clearGlobalState();
        return globalState;
      }

      // Fetch fresh profile from database with 2500ms safety timeout
      const profilePromise = fetchUserProfileStrict(session.user.id);
      const profileTimeoutPromise = new Promise<AdminProfile | null>((_, reject) =>
        setTimeout(() => reject(new Error('Profile query timeout')), 2500)
      );

      let userProfile: AdminProfile | null = null;
      try {
        userProfile = await Promise.race([profilePromise, profileTimeoutPromise]);
      } catch (profileErr) {
        console.warn('Profile fetch latency, falling back to cached profile if present:', profileErr);
        if (globalState.profile && globalState.isAdmin) {
          userProfile = globalState.profile;
        }
      }

      if (!userProfile) {
        updateGlobalState({
          loading: false,
          verified: true,
          isAdmin: false,
          user: session.user,
          profile: null,
          profileError: new Error('Profile not found in database'),
        });
        return globalState;
      }

      const adminAccess = isAdminRole(userProfile.role);
      updateGlobalState({
        loading: false,
        verified: true,
        isAdmin: adminAccess,
        user: session.user,
        profile: userProfile,
        profileError: null,
      });
      return globalState;
    } catch (err) {
      console.error('Admin guard refresh error:', err);
      // Graceful fallback: If we already have a cached admin session, stay verified
      if (globalState.profile && globalState.isAdmin) {
        updateGlobalState({
          loading: false,
          verified: true,
        });
      } else {
        updateGlobalState({
          loading: false,
          verified: true,
          isAdmin: false,
          user: null,
          profile: null,
          profileError: err as Error,
        });
      }
      return globalState;
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}

// 3. Setup auth listener once at module level
let isAuthListenerInitialized = false;

function ensureAuthListener() {
  if (isAuthListenerInitialized) return;
  isAuthListenerInitialized = true;

  supabase.auth.onAuthStateChange((event, session) => {
    console.log('AdminGuard Auth Event:', event);
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
      refreshAdminSession(session).then((state) => {
        if (state.verified && state.isAdmin) {
          queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] !== 'public' });
        }
      });
    } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESH_FAILED') {
      clearGlobalState();
      queryClient.clear();
    }
  });
}

/**
 * Hook to check admin access.
 * Returns shared, synchronous cached state instantly on mount and route changes.
 */
export function useAdminGuard() {
  const [state, setState] = useState<AdminGuardState>(globalState);

  useEffect(() => {
    ensureAuthListener();
    listeners.add(setState);

    // Refresh in background silently, UI renders immediately from cache
    refreshAdminSession();

    return () => {
      listeners.delete(setState);
    };
  }, []);

  return {
    loading: state.loading,
    verified: state.verified,
    isAdmin: state.isAdmin,
    user: state.user,
    profile: state.profile,
    profileError: state.profileError,
  };
}
