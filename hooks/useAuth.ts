/**
 * useAuth — Get the current authenticated user ID
 * Bulletproof: checks store first, then Supabase session, with timeout.
 */
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { useAppStore } from '@/store/useAppStore';

export function useAuth() {
  const storeUser = useAppStore((s) => s.user);
  const [userId, setUserId] = useState<string | null>(storeUser?.id || null);
  const [ready, setReady] = useState(!!storeUser?.id);

  useEffect(() => {
    if (storeUser?.id) {
      setUserId(storeUser.id);
      if (!ready) setReady(true);
      return;
    }

    let cancelled = false;

    // Race: Supabase session check vs 2-second timeout
    const timeout = setTimeout(() => {
      if (!cancelled) {
        console.warn('[useAuth] Timed out waiting for session');
        setReady(true);
      }
    }, 2000);

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      clearTimeout(timeout);
      if (data.session?.user) {
        console.log('[useAuth] Got session for:', data.session.user.id);
        setUserId(data.session.user.id);
      } else {
        console.log('[useAuth] No session found');
      }
      setReady(true);
    }).catch(() => {
      if (!cancelled) {
        clearTimeout(timeout);
        console.warn('[useAuth] Session check failed');
        setReady(true);
      }
    });

    return () => { cancelled = true; clearTimeout(timeout); };
  }, [storeUser?.id]);

  return { userId, ready, user: storeUser };
}
