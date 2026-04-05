/**
 * useAuth — Reliable auth state for all screens
 * Solves: Zustand hydration race on web + Supabase session sync
 */
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/services/supabase';
import { useAppStore } from '@/store/useAppStore';

export function useAuth() {
  const storeUser = useAppStore((s) => s.user);
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const resolved = useRef(false);

  // Source 1: Zustand store (may hydrate late)
  useEffect(() => {
    if (storeUser?.id && !resolved.current) {
      resolved.current = true;
      setUserId(storeUser.id);
      setReady(true);
    }
  }, [storeUser?.id]);

  // Source 2: Supabase session (always available if logged in)
  useEffect(() => {
    if (resolved.current) return;

    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled || resolved.current) return;
      resolved.current = true;
      setUserId(data.session?.user?.id || null);
      setReady(true);
    }).catch(() => {
      if (!cancelled && !resolved.current) {
        resolved.current = true;
        setReady(true);
      }
    });

    // Safety timeout — never spin forever
    const timeout = setTimeout(() => {
      if (!resolved.current) {
        resolved.current = true;
        setReady(true);
      }
    }, 1500);

    return () => { cancelled = true; clearTimeout(timeout); };
  }, []);

  // Keep userId in sync if store updates later
  useEffect(() => {
    if (storeUser?.id && storeUser.id !== userId) {
      setUserId(storeUser.id);
      if (!ready) setReady(true);
    }
  }, [storeUser?.id]);

  return { userId, ready, user: storeUser };
}
