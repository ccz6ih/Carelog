/**
 * CareLog Core Types
 */

export type SubscriptionTier = 'basic' | 'pro' | 'family';

export type EVVStatus = 'idle' | 'clocked_in' | 'clocked_out' | 'submitted' | 'error';

export interface CareRecipient {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  providerId: string;
  recipientId: string;
  state: string;
  aggregator: 'hhax' | 'sandata' | 'tellus' | 'providerone' | 'calevv';
}

export interface Visit {
  id: string;
  recipientId: string;
  recipientName: string;
  clockInTime: string;
  clockOutTime: string | null;
  clockInLocation: { lat: number; lng: number };
  clockOutLocation: { lat: number; lng: number } | null;
  tasks: TaskLog[];
  notes: string;
  photos: string[];
  evvStatus: EVVStatus;
}

export interface TaskLog {
  id: string;
  name: string;
  category: 'personal_care' | 'meals' | 'medication' | 'mobility' | 'companionship' | 'other';
  completed: boolean;
  timestamp: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  relationship: string;
  recipientId: string;
}

export interface AppreciationPayment {
  id: string;
  fromFamilyMemberId: string;
  toCaregiverId: string;
  amount: number;
  method: 'venmo' | 'zelle' | 'paypal' | 'cashapp';
  timestamp: string;
  message?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  tier: SubscriptionTier;
  recipients: CareRecipient[];
  activeVisit: Visit | null;
}
