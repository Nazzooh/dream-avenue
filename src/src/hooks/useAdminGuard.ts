// src/hooks/useAdminGuard.ts
// SIMPLIFIED: Uses ONLY profile.role from database

import { useEffect, useState, useRef } from "react";
import { supabase } from "../../utils/supabase/client";
import { AdminProfile, fetchUserProfile } from "../lib/adminAuth";
import { useSecurityAudit } from "./useSecurityAudit";

/**
 * Hook to check admin access
 * SIMPLIFIED: Only checks profile.role === 'admin' from database
 * NO JWT claims, NO metadata - database profile is source of truth
 */
export function useAdminGuard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [profileError, setProfileError] = useState<null | Error>(null);
  const { logEvent } = useSecurityAudit();
  
  // Prevent multiple simultaneous loads
  const isLoadingRef = useRef(false);

  async function loadProfile(isBackground = false) {
    if (isLoadingRef.current) {
      console.log('⏭️ Already loading profile, skipping...');
      return;
    }
    
    isLoadingRef.current = true;
    console.log(`🔄 ${isBackground ? 'Background' : 'Full'} loading profile...`);
    
    // Only show loading screen if not a background refresh
    if (!isBackground) {
      setLoading(true);
    }
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        setProfileError(sessionError);
        setIsAdmin(false);
        setUser(null);
        setProfile(null);
        setLoading(false);
        isLoadingRef.current = false;
        return;
      }

      if (!session?.user) {
        console.log('❌ No session');
        setIsAdmin(false);
        setUser(null);
        setProfile(null);
        setLoading(false);
        isLoadingRef.current = false;
        return;
      }

      setUser(session.user);
      console.log('✅ Session found:', session.user.id);

      // Fetch profile from database - SINGLE SOURCE OF TRUTH
      const userProfile = await fetchUserProfile(session.user.id);

      if (!userProfile) {
        console.error('❌ No profile found for user');
        setProfileError(new Error('Profile not found'));
        setIsAdmin(false);
        setProfile(null);
        setLoading(false);
        isLoadingRef.current = false;
        return;
      }

      setProfile(userProfile);

      // Check admin role from profile ONLY
      const adminAccess = userProfile.role === 'admin';
      console.log('🔐 Admin check:', { 
        userId: userProfile.id, 
        profileRole: userProfile.role, 
        isAdmin: adminAccess 
      });

      if (!adminAccess && !isBackground) {
        logEvent('UNAUTHORIZED_ACCESS_ATTEMPT', { userId: userProfile.id, role: userProfile.role });
      } else if (adminAccess && !isBackground && !isAdmin) {
        logEvent('ADMIN_ACCESS_GRANTED', { userId: userProfile.id });
      }

      setIsAdmin(adminAccess);
      setProfileError(null);
      setLoading(false);
      isLoadingRef.current = false;
      console.log('🏁 Profile load complete');

    } catch (err) {
      console.error('❌ Error loading profile:', err);
      setProfileError(err as Error);
      setIsAdmin(false);
      setProfile(null);
      setLoading(false);
      isLoadingRef.current = false;
    }
  }

  useEffect(() => {
    console.log('🎬 useAdminGuard: Initial mount');
    loadProfile();

    // Listen for auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((event, _session) => {
      console.log('🔔 Auth state change:', event);
      
      // Only react to specific events
      if (event === "SIGNED_IN") {
        console.log('🔄 User signed in, reloading profile');
        loadProfile(); // Full reload on sign in
      } else if (event === "TOKEN_REFRESHED") {
        console.log('🔄 Token refreshed, performing background profile check');
        loadProfile(true); // Silent background reload
      } else if (event === "SIGNED_OUT") {
        console.log('🚪 User signed out');
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
        isLoadingRef.current = false;
      } else {
        console.log('⏭️ Ignoring event:', event);
      }
    });

    return () => {
      console.log('🧹 useAdminGuard: Cleanup');
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  return { loading, isAdmin, user, profile, profileError };
}
