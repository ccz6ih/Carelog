/**
 * CareLog API Service
 * Supabase-backed — matches docs/API.md contract
 */

import { supabase } from './supabase';

// ============================================================
// AUTH
// ============================================================

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

// ============================================================
// CARE RECIPIENTS
// ============================================================

export const recipients = {
  list: () =>
    supabase.from('recipients').select('*').eq('is_active', true),

  add: (recipient: any) =>
    supabase.from('recipients').insert(recipient).select().single(),

  update: (id: string, data: any) =>
    supabase.from('recipients').update(data).eq('id', id).select().single(),

  remove: (id: string) =>
    supabase.from('recipients').update({ is_active: false }).eq('id', id),
};

// ============================================================
// VISITS (paginated per API contract)
// ============================================================

export const visits = {
  list: (options?: { page?: number; limit?: number; recipientId?: string }) => {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('visits')
      .select('*, recipients(first_name, last_name, relationship)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (options?.recipientId) {
      query = query.eq('recipient_id', options.recipientId);
    }

    return query;
  },

  create: (visit: any) =>
    supabase.from('visits').insert(visit).select().single(),

  update: (id: string, data: any) =>
    supabase.from('visits').update(data).eq('id', id).select().single(),

  submitEVV: (visitId: string) =>
    supabase.functions.invoke('submit-evv', { body: { visitId } }),
};

// ============================================================
// TASK LOGS
// ============================================================

export const tasks = {
  listForVisit: (visitId: string) =>
    supabase.from('task_logs').select('*').eq('visit_id', visitId).order('timestamp'),

  add: (task: any) =>
    supabase.from('task_logs').insert(task).select().single(),

  remove: (id: string) =>
    supabase.from('task_logs').delete().eq('id', id),
};

// ============================================================
// FAMILY
// ============================================================

export const family = {
  getActivity: (recipientId: string, limit = 20) =>
    supabase
      .from('family_activity')
      .select('*')
      .eq('recipient_id', recipientId)
      .order('created_at', { ascending: false })
      .limit(limit),

  getMembers: (recipientId: string) =>
    supabase.from('family_members').select('*').eq('recipient_id', recipientId),

  invite: (data: { name: string; email: string; relationship: string; recipientId: string; invitedBy: string }) =>
    supabase.from('family_members').insert({
      name: data.name,
      email: data.email,
      relationship: data.relationship,
      recipient_id: data.recipientId,
      invited_by: data.invitedBy,
    }).select().single(),

  removeMember: (id: string) =>
    supabase.from('family_members').delete().eq('id', id),
};

// ============================================================
// APPRECIATION
// ============================================================

export const appreciation = {
  getHistory: async (caregiverId: string) => {
    const { data, error } = await supabase
      .from('appreciation_payments')
      .select('*')
      .eq('to_caregiver_id', caregiverId)
      .order('created_at', { ascending: false });

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const total = data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    const monthPayments = data?.filter((p) => new Date(p.created_at) >= thisMonth) || [];
    const thisMonthTotal = monthPayments.reduce((sum, p) => sum + Number(p.amount), 0);

    return { data: { total, thisMonth: thisMonthTotal, history: data || [] }, error };
  },

  generateLink: (method: string, amount: number, recipientHandle?: string) => {
    const links: Record<string, string> = {
      venmo: `venmo://paycharge?txn=pay&amount=${amount}&note=CareLog%20Appreciation`,
      cashapp: `cashapp://cash.app/pay?amount=${amount}&note=CareLog`,
      zelle: `zelle://`,
      paypal: `paypal://paypalme/?amount=${amount}`,
    };
    return links[method] || '';
  },
};

// ============================================================
// MEDICATION LOGS (Pro/Family)
// ============================================================

export const medication = {
  listForRecipient: (recipientId: string) =>
    supabase
      .from('medication_logs')
      .select('*')
      .eq('recipient_id', recipientId)
      .order('created_at', { ascending: false }),

  log: (entry: any) =>
    supabase.from('medication_logs').insert(entry).select().single(),

  listForVisit: (visitId: string) =>
    supabase.from('medication_logs').select('*').eq('visit_id', visitId),
};

// ============================================================
// SUBSCRIPTION
// ============================================================

export const subscription = {
  get: (userId: string) =>
    supabase
      .from('profiles')
      .select('tier, subscription_status, subscription_renews_at, subscription_price, stripe_customer_id')
      .eq('id', userId)
      .single(),

  updateTier: (userId: string, tier: string) =>
    supabase.from('profiles').update({ tier }).eq('id', userId),
};

// ============================================================
// EVV SUBMISSIONS
// ============================================================

export const evvSubmissions = {
  listForUser: async (userId: string) => {
    const { data: userVisits } = await supabase
      .from('visits')
      .select('id')
      .eq('caregiver_id', userId);

    if (!userVisits || userVisits.length === 0) return { data: [], error: null };

    return supabase
      .from('evv_submissions')
      .select('*')
      .in('visit_id', userVisits.map((v) => v.id))
      .order('created_at', { ascending: false });
  },
};

// ============================================================
// NOTIFICATION PREFERENCES
// ============================================================

export const notifications = {
  getPreferences: (userId: string) =>
    supabase.from('notification_preferences').select('*').eq('user_id', userId).single(),

  updatePreferences: (userId: string, prefs: Record<string, boolean>) =>
    supabase.from('notification_preferences').update(prefs).eq('user_id', userId),
};

// ============================================================
// AUDIT LOGS (HIPAA)
// ============================================================

export const audit = {
  log: (entry: { userId: string; action: string; resourceType: string; resourceId?: string; metadata?: any }) =>
    supabase.from('audit_logs').insert({
      user_id: entry.userId,
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId,
      metadata: entry.metadata || {},
    }),

  getForUser: (userId: string, limit = 50) =>
    supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit),
};
