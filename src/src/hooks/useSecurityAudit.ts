import { useCallback } from 'react';
import { supabase } from '../../utils/supabase/client';

export function useSecurityAudit() {
  const logEvent = useCallback(async (action: string, details: Record<string, any> = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (profile?.role !== 'admin') {
        console.warn(`🔒 Unauthorized attempt blocked for action: ${action}`);
        return;
      }

      await supabase.from('security_logs').insert([{
        admin_id: user.id,
        action,
        details,
        user_agent: navigator.userAgent
      }]);
    } catch (e) {
      console.error('🔒 Failed to log security event:', e);
    }
  }, []);

  return { logEvent };
}
