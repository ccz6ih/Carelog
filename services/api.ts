/**
 * CareLog API Service
 * Supabase-backed API client for auth, visits, family, appreciation
 */

import { supabase } from './supabase';

// Auth
export const auth = {
  login: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { first_name: data.firstName, last_name: data.lastName } },
    }),
  me: () => supabase.auth.getUser(),
  logout: () => supabase.auth.signOut(),
  onAuthStateChange: (callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) =>
    supabase.auth.onAuthStateChange(callback),
};

// Visits
export const visits = {
  list: () =>
    supabase.from('visits').select('*').order('created_at', { ascending: false }),
  create: (visit: any) =>
    supabase.from('visits').insert(visit).select().single(),
  update: (id: string, data: any) =>
    supabase.from('visits').update(data).eq('id', id).select().single(),
};

// Recipients
export const recipients = {
  list: () =>
    supabase.from('recipients').select('*'),
  add: (recipient: any) =>
    supabase.from('recipients').insert(recipient).select().single(),
  validate: async (providerId: string, recipientId: string, state: string) =>
    supabase.functions.invoke('validate-recipient', {
      body: { providerId, recipientId, state },
    }),
};

// Family
export const family = {
  getActivity: (recipientId: string) =>
    supabase.from('family_activity').select('*').eq('recipient_id', recipientId),
  invite: (data: { email: string; recipientId: string; relationship: string }) =>
    supabase.functions.invoke('invite-family', { body: data }),
};
