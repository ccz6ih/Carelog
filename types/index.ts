/**
 * CareLog Core Types
 * Matches API contract (docs/API.md) and glossary (docs/GLOSSARY.md)
 */

// ============================================================
// ENUMS
// ============================================================

export type SubscriptionTier = 'basic' | 'pro' | 'family';
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'trialing';
export type EVVStatus = 'idle' | 'clocked_in' | 'clocked_out' | 'submitted' | 'error';
export type AggregatorType = 'hhax' | 'sandata' | 'tellus' | 'providerone' | 'calevv';
export type TaskCategory = 'personal_care' | 'meals' | 'medication' | 'mobility' | 'companionship' | 'other';
export type PaymentMethod = 'venmo' | 'zelle' | 'paypal' | 'cashapp';
export type FamilyRole = 'viewer' | 'admin';

export type ActivityType =
  | 'visit_started'
  | 'visit_completed'
  | 'task_logged'
  | 'photo_shared'
  | 'medication_alert';

export type NotificationType =
  | 'visit_started'
  | 'visit_completed'
  | 'task_logged'
  | 'photo_shared'
  | 'medication_alert'
  | 'appreciation_received'
  | 'evv_submitted'
  | 'evv_error';

// ============================================================
// CORE MODELS (matches docs/API.md)
// ============================================================

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  tier: SubscriptionTier;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionRenewsAt?: string;
  recipients: CareRecipient[];
  activeVisit: Visit | null;
}

export interface CareRecipient {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;        // e.g., "Mother", "Father", "Spouse"
  providerId: string;           // Caregiver's Medicaid provider ID
  recipientId: string;          // Recipient's Medicaid ID
  state: string;                // 2-letter state code
  aggregator: AggregatorType;
}

export interface Visit {
  id: string;
  recipientId: string;
  recipientName: string;
  clockInTime: string;          // ISO 8601
  clockOutTime: string | null;
  clockInLocation: { lat: number; lng: number };
  clockOutLocation: { lat: number; lng: number } | null;
  tasks: TaskLog[];
  notes: string;
  photos: string[];             // S3/storage URLs
  evvStatus: EVVStatus;
}

export interface TaskLog {
  id: string;
  name: string;
  category: TaskCategory;
  completed: boolean;
  timestamp: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  relationship: string;
  recipientId: string;
  role?: FamilyRole;
  inviteAccepted?: boolean;
}

export interface AppreciationPayment {
  id: string;
  fromFamilyMemberId: string;
  toCaregiverId: string;
  amount: number;
  method: PaymentMethod;
  timestamp: string;
  message?: string;
}

// ============================================================
// MEDICATION (Pro/Family tier)
// ============================================================

export interface MedicationLog {
  id: string;
  recipientId: string;
  visitId?: string;
  medicationName: string;
  dosage?: string;              // e.g., "500mg", "2 tablets"
  scheduledTime?: string;       // ISO 8601
  administeredAt?: string;      // ISO 8601
  skipped: boolean;
  skipReason?: string;
  notes?: string;
}

// ============================================================
// SUBSCRIPTION
// ============================================================

export interface SubscriptionDetails {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  renewsAt: string;             // ISO 8601
  price: number;
  stripeCustomerId?: string;
}

// ============================================================
// FAMILY ACTIVITY
// ============================================================

export interface FamilyActivity {
  id: string;
  recipientId: string;
  visitId?: string;
  actorName: string;
  activityType: ActivityType;
  summary: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// ============================================================
// EVV SUBMISSION
// ============================================================

export interface EVVSubmission {
  id: string;
  visitId: string;
  aggregator: AggregatorType;
  payload: Record<string, any>;
  responseStatus?: number;
  responseBody?: Record<string, any>;
  confirmationId?: string;
  success: boolean;
  retryCount: number;
  nextRetryAt?: string;
  errorMessage?: string;
}

// ============================================================
// AUDIT LOG (HIPAA)
// ============================================================

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// ============================================================
// NOTIFICATION PREFERENCES
// ============================================================

export interface NotificationPreferences {
  visitStarted: boolean;
  visitCompleted: boolean;
  taskLogged: boolean;
  photoShared: boolean;
  medicationAlert: boolean;
  appreciationReceived: boolean;
  evvSubmitted: boolean;
  evvError: boolean;
  weeklySummary: boolean;
}
