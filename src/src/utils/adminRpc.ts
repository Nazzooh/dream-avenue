import { supabase } from '../../utils/supabase/client';
import { isAdminRole } from '../lib/adminPermissions';

async function getWorkspaceSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) throw new Error('No active session. Please log in again.');
  if (session.expires_at && session.expires_at * 1000 < Date.now()) throw new Error('Session expired. Please log in again.');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle();

  if (profileError || !isAdminRole(profile?.role)) throw new Error('Your account does not have workspace access.');
  return session;
}

/**
 * Compatibility wrapper for legacy admin RPCs. The profile row remains the
 * authorization source of truth; user metadata and JWT role claims are never
 * used as authorization fallbacks.
 */
export async function adminRpc<T = unknown>(fnName: string, params: Record<string, unknown>): Promise<{ data: T | null; error: unknown }> {
  const session = await getWorkspaceSession();
  return supabase.rpc(fnName, { ...params, p_admin_id: params.p_admin_id || session.user.id });
}

export async function verifyAdminAccess(): Promise<boolean> {
  try {
    await getWorkspaceSession();
    return true;
  } catch {
    return false;
  }
}

export async function getAdminUserId(): Promise<string | null> {
  try {
    return (await getWorkspaceSession()).user.id;
  } catch {
    return null;
  }
}

/** A non-sensitive support helper; it intentionally never logs access tokens. */
export const debugJWT = {
  async print() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { authenticated: false };
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
    const workspaceAccess = isAdminRole(profile?.role);
    console.info('Dream Avenue workspace session', { userId: session.user.id, email: session.user.email, role: profile?.role, workspaceAccess });
    return { authenticated: true, workspaceAccess, userId: session.user.id, email: session.user.email, role: profile?.role };
  },
};

if (typeof window !== 'undefined') (window as Window & { debugJWT?: typeof debugJWT }).debugJWT = debugJWT;
