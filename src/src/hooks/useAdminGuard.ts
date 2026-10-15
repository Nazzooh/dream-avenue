// src/hooks/useAdminGuard.ts
// SIMPLIFIED: Uses ONLY profile.role from database

import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../utils/supabase/client';
import { AdminProfile, fetchUserProfile } from '../lib/adminAuth';
import { useSecurityAudit } from './useSecurityAudit';
import { isAdminRole } from '../lib/adminPermissions';

/**
 * Hook to check admin access
 * Checks the database profile for one of the permitted workspace roles.
 * NO JWT claims, NO metadata - database profile is source of truth
 */
export function useAdminGuard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [profileError, setProfileError] = useState<null | Error>(null);
  const { logEvent } = useSecurityAudit();
  
  // Track if we already have an active verified session
  const hasInitialSessionRef = useRef(false);
  // Prevent multiple simultaneous loads
  const isLoadingRef = useRef(false);

  async function withTimeout<T>(promise: Promise<T>, label: string, timeoutMs = 10000): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(`${label} timed out`)), timeoutMs);
    });
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  async function loadProfile(isBackground = false) {
    if (isLoadingRef.current) {
      console.log('Already loading profile, skipping...');
      return;
    }
    
    const isSilent = isBackground || hasInitialSessionRef.current;
    isLoadingRef.current = true;
    console.log(`${isSilent ? 'Background' : 'Full'} loading profile...`);
    
    // Only show loading screen if not a background refresh and no session yet
    if (!isSilent) {
      setLoading(true);
    }
    
    try {
      const { data: { session }, error: sessionError } = await withTimeout(
        supabase.auth.getSession(),
        'Session check',
      );
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        if (!isSilent) {
          setProfileError(sessionError);
          setIsAdmin(false);
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
        isLoadingRef.current = false;
        return;
      }

      if (!session?.user) {
        console.log('No session');
        setIsAdmin(false);
        setUser(null);
        setProfile(null);
        setLoading(false);
        isLoadingRef.current = false;
        hasInitialSessionRef.current = false;
        return;
      }

      console.log('Session found:', session.user.id);

      // Fetch profile from database - SINGLE SOURCE OF TRUTH
      const userProfile = await withTimeout(
        fetchUserProfile(session.user.id),
        'Admin profile check',
      );

      if (!userProfile) {
        console.error('No profile found for user');
        if (!isSilent) {
          setProfileError(new Error('Profile not found'));
          setUser(session.user);
          setIsAdmin(false);
          setProfile(null);
        }
        setLoading(false);
        isLoadingRef.current = false;
        return;
      }

      // Check trusted internal-team role from profile only.
      const adminAccess = isAdminRole(userProfile.role);
      console.log('Admin check:', { 
        userId: userProfile.id, 
        profileRole: userProfile.role, 
        isAdmin: adminAccess 
      });

      if (!adminAccess && !isSilent) {
        logEvent('UNAUTHORIZED_ACCESS_ATTEMPT', { userId: userProfile.id, role: userProfile.role });
      } else if (adminAccess && !isSilent) {
        logEvent('ADMIN_ACCESS_GRANTED', { userId: userProfile.id });
      }

      // Update user, profile and admin state together atomically
      setUser(session.user);
      setProfile(userProfile);
      setIsAdmin(adminAccess);
      setProfileError(null);
      setLoading(false);
      isLoadingRef.current = false;
      hasInitialSessionRef.current = true;
      console.log('Profile load complete');

    } catch (err) {
      console.error('Error loading profile:', err);
      // Stale-while-revalidate: if we already have an established session,
      // do not wipe out admin access on transient background sleep/timeouts
      if (!isSilent) {
        setProfileError(err as Error);
        setIsAdmin(false);
        setProfile(null);
      }
      setLoading(false);
      isLoadingRef.current = false;
    }
  }

  useEffect(() => {
    console.log('useAdminGuard: Initial mount');
    loadProfile();

    // Listen for auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((event, _session) => {
      console.log('Auth state change:', event);
      
      if (event === "SIGNED_IN") {
        isLoadingRef.current = false;
        loadProfile(hasInitialSessionRef.current);
      } else if (event === "TOKEN_REFRESHED") {
        console.log('Token refreshed, performing background profile check');
        isLoadingRef.current = false;
        loadProfile(true); // Silent background reload
      } else if (event === "SIGNED_OUT") {
        console.log('User signed out');
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
        isLoadingRef.current = false;
        hasInitialSessionRef.current = false;
      }
    });

    return () => {
      console.log('useAdminGuard: Cleanup');
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  return { loading, isAdmin, user, profile, profileError };
}
