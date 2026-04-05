/**
 * useAuth — Get the current authenticated user ID
 * Falls back to Supabase session if Zustand store hasn't hydrated yet.
 * Use this instead of useAppStore for screens that need user.id on mount.
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
      setReady(true);
      return;
    }

    // Store not hydrated — check Supabase session directly
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUserId(data.session.user.id);
      }
      setReady(true);
    });
  }, [storeUser?.id]);

  return { userId, ready, user: storeUser };
}
