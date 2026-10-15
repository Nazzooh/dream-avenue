// src/hooks/useAdminGuard.ts
// SINGLETON SHARED STORE + STALE-WHILE-REVALIDATE CACHE
// Eliminates navigation hangs, duplicate fetches, and permission drops

import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase/client';
import { AdminProfile, fetchUserProfile } from '../lib/adminAuth';
import { isAdminRole } from '../lib/adminPermissions';

const STORAGE_KEY = 'da_admin_guard_cache_v2';

export interface AdminGuardState {
  loading: boolean;
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
      if (parsed?.profile && parsed?.user) {
        return {
          loading: false,
          isAdmin: isAdminRole(parsed.profile.role),
          user: parsed.user,
          profile: parsed.profile,
          profileError: null,
        };
      }
    }
  } catch {}
  return {
    loading: true,
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
    isAdmin: false,
    user: null,
    profile: null,
    profileError: null,
  };
  emitChange();
}

// 2. Deduplicated Singleton Promise
let inFlightPromise: Promise<AdminGuardState> | null = null;

export async function refreshAdminSession(): Promise<AdminGuardState> {
  // If we already have a running fetch, reuse it to prevent concurrent thrashing
  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      // If we don't have a verified profile yet, show loading
      if (!globalState.profile) {
        updateGlobalState({ loading: true });
      }

      const { data, error: sessionError } = await supabase.auth.getSession();
      const session = data?.session;

      if (sessionError) {
        console.error('Session check error:', sessionError);
        // If we already have a cached profile, keep it to prevent lockout
        if (globalState.profile) {
          updateGlobalState({ loading: false });
          return globalState;
        }
        updateGlobalState({
          loading: false,
          isAdmin: false,
          user: null,
          profile: null,
          profileError: sessionError,
        });
        return globalState;
      }

      if (!session?.user) {
        console.log('No active session in Supabase');
        clearGlobalState();
        return globalState;
      }

      // Fetch fresh profile from database
      const userProfile = await fetchUserProfile(session.user.id);

      if (!userProfile) {
        // If profile fetch failed momentarily (network/timeout), fallback to existing verified profile
        if (globalState.profile && globalState.profile.id === session.user.id) {
          console.warn('Profile fetch returned null, retaining cached profile');
          updateGlobalState({ loading: false });
          return globalState;
        }
        updateGlobalState({
          loading: false,
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
        isAdmin: adminAccess,
        user: session.user,
        profile: userProfile,
        profileError: null,
      });
      return globalState;
    } catch (err) {
      console.error('Admin guard refresh error:', err);
      // Stale-while-revalidate: NEVER wipe out an existing valid session on transient errors
      if (globalState.profile) {
        updateGlobalState({ loading: false });
        return globalState;
      }
      updateGlobalState({
        loading: false,
        isAdmin: false,
        user: null,
        profile: null,
        profileError: err as Error,
      });
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

  supabase.auth.onAuthStateChange((event, _session) => {
    console.log('AdminGuard Auth Event:', event);
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
      refreshAdminSession();
    } else if (event === 'SIGNED_OUT') {
      clearGlobalState();
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

    // Refresh in background if needed, but UI renders immediately from cache
    refreshAdminSession();

    return () => {
      listeners.delete(setState);
    };
  }, []);

  return {
    loading: state.loading,
    isAdmin: state.isAdmin,
    user: state.user,
    profile: state.profile,
    profileError: state.profileError,
  };
}
