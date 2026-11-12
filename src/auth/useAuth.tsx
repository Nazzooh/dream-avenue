// src/auth/useAuth.tsx
import { useCallback, useMemo } from "react";
import { supabase } from "@/utils/supabase/client";
import { refreshAdminSession, useAdminGuard } from "../hooks/useAdminGuard";

export function useAuth() {
  const guard = useAdminGuard();

  const user = guard.user;
  const profile = guard.profile;
  const isAdmin = guard.isAdmin;
  const isLoading = guard.loading;

  const session = useMemo(() => {
    return user ? { user } : null;
  }, [user]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    await refreshAdminSession(data.session);
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const loadProfile = useCallback(async () => {
    const state = await refreshAdminSession();
    return state.profile;
  }, []);

  return { 
    session, 
    user,
    profile, 
    loadProfile, 
    isAdmin, 
    isLoading,
    signIn,
    signOut,
  };
}
