import { useEffect, useRef } from 'react';
import { useAuth } from '../../src/auth/useAuth';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function AutoLogout() {
  const { signOut, session, isAdmin } = useAuth();
  const user = session?.user;
  const location = useLocation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!user || !isAdmin) return;

    timerRef.current = setTimeout(async () => {
      toast.error('Session expired due to inactivity. For your security, please log in again.', {
        duration: 5000,
      });
      console.warn('🔒 Auto-Logout: Session timed out because of inactivity.');
      await signOut();
    }, TIMEOUT_MS);
  };

  useEffect(() => {
    // Only run if the user is an admin
    if (!user || !isAdmin) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    
    // Reset timer on path change
    resetTimer();

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach((e) => window.addEventListener(e, handleActivity));

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, isAdmin, location.pathname]);

  return null;
}
