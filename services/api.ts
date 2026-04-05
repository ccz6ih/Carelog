/**
 * CareLog API Service
 * Central API client for auth, visits, family, appreciation
 */

const API_BASE = __DEV__
  ? 'http://localhost:3001/api'
  : 'https://api.carelog.app';

interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    return {
      data: null as T,
      error: error instanceof Error ? error.message : 'Request failed',
      status: 0,
    };
  }
}

// Auth
export const auth = {
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/auth/me'),
};

// Visits
export const visits = {
  list: () => request('/visits'),
  create: (visit: any) =>
    request('/visits', { method: 'POST', body: JSON.stringify(visit) }),
  update: (id: string, data: any) =>
    request(`/visits/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// Recipients
export const recipients = {
  list: () => request('/recipients'),
  add: (recipient: any) =>
    request('/recipients', { method: 'POST', body: JSON.stringify(recipient) }),
  validate: (providerId: string, recipientId: string, state: string) =>
    request('/recipients/validate', { method: 'POST', body: JSON.stringify({ providerId, recipientId, state }) }),
};

// Family
export const family = {
  getActivity: (recipientId: string) => request(`/family/activity/${recipientId}`),
  invite: (data: { email: string; recipientId: string; relationship: string }) =>
    request('/family/invite', { method: 'POST', body: JSON.stringify(data) }),
};
