import { useCallback } from 'react';
import { supabase } from '../../utils/supabase/client';

export function useSecurityAudit() {
  const logEvent = useCallback(async (action: string, details: Record<string, any> = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      let userRole = 'anonymous';
      let userId: string | null = null;

      if (user) {
        userId = user.id;
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        userRole = profile?.role || 'user';
      }

      await supabase.from('security_logs').insert([{
        admin_id: userId,
        action,
        details: { ...details, user_role: userRole },
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
      }]);
    } catch (e) {
      console.error('🔒 Failed to log security event:', e);
    }
  }, []);

  return { logEvent };
}
