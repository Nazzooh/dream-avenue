// src/lib/adminAuth.ts
// SIMPLIFIED: Uses ONLY profile.role from database as source of truth
// NO JWT claims checking - profile.role is the single source of authority

import { supabase } from '../../utils/supabase/client';
import { AdminPermission, can, isAdminRole } from './adminPermissions';

export interface AdminProfile {
  id: string;
  email: string | null;
  role: string | null;
}

/**
 * Fetch user profile from database
 * This is the ONLY source of truth for role checking
 */
export async function fetchUserProfile(userId: string): Promise<AdminProfile | null> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Failed to fetch profile:', error);
      return null;
    }

    console.log('📋 Profile fetched:', { id: profile.id, email: profile.email, role: profile.role });
    return profile;
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    return null;
  }
}

/**
 * Check if the current user belongs to the trusted internal team.
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      console.log('❌ No session');
      return false;
    }

    const profile = await fetchUserProfile(session.user.id);
    
    if (!profile) {
      console.log('❌ No profile found');
      return false;
    }

    const isAdminUser = isAdminRole(profile.role);
    console.log('🔐 Admin check:', { userId: profile.id, role: profile.role, isAdmin: isAdminUser });
    
    return isAdminUser;
  } catch (error) {
    console.error('❌ isAdmin check failed:', error);
    return false;
  }
}

/**
 * Assert admin access (throws if not admin)
 * Use before admin RPC calls
 */
export async function assertAdmin(action?: string): Promise<AdminProfile> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error('You are not logged in');
  }

  const profile = await fetchUserProfile(session.user.id);
  
  if (!profile) {
    throw new Error('Profile not found');
  }

  if (!isAdminRole(profile.role)) {
    const message = action 
      ? `You are not authorized as admin to ${action}`
      : 'You are not authorized as admin';
    throw new Error(message);
  }

  console.log(`✅ Admin access granted for: ${action || 'action'}`);
  return profile;
}

/**
 * Get current user profile (without admin check)
 */
export async function getCurrentProfile(): Promise<AdminProfile | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return null;
    }

    return await fetchUserProfile(session.user.id);
  } catch (error) {
    console.error('Error getting current profile:', error);
    return null;
  }
}

/**
 * Get admin ID or throw (Patch 6)
 * Helper to check admin role before calling admin RPCs
 */
export async function getAdminIdOrThrow(): Promise<string> {
  const profile = await assertAdmin();
  return profile.id;
}

export async function assertPermission(permission: AdminPermission, action?: string): Promise<AdminProfile> {
  const profile = await assertAdmin(action);
  if (!can(profile.role, permission)) {
    throw new Error(`You are not authorized to ${action || 'perform this action'}`);
  }
  return profile;
}
