# CareLog — API Contracts

> Planned REST API endpoints for the CareLog backend.
> Use this as a reference when building screens, services, or backend routes.

Base URL: `https://api.carelog.app` (production) / `http://localhost:3001/api` (dev)

All requests require `Authorization: Bearer <jwt_token>` except auth endpoints.
All responses follow: `{ data: T, error?: string, status: number }`

---

## Authentication

### POST /auth/register
Create a new caregiver account.
```json
Request:  { "email": "string", "password": "string", "firstName": "string", "lastName": "string" }
Response: { "data": { "user": User, "token": "string", "refreshToken": "string" } }
```

### POST /auth/login
```json
Request:  { "email": "string", "password": "string" }
Response: { "data": { "user": User, "token": "string", "refreshToken": "string" } }
```

### POST /auth/refresh
```json
Request:  { "refreshToken": "string" }
Response: { "data": { "token": "string", "refreshToken": "string" } }
```

### GET /auth/me
Returns the authenticated user's profile.
```json
Response: { "data": User }
```

---

## Care Recipients

### GET /recipients
List all care recipients for the authenticated caregiver.
```json
Response: { "data": CareRecipient[] }
```

### POST /recipients
Add a new care recipient.
```json
Request: {
  "firstName": "string",
  "lastName": "string",
  "relationship": "string",
  "providerId": "string",
  "recipientId": "string",
  "state": "string (2-letter code)"
}
Response: { "data": CareRecipient }
```

### POST /recipients/validate
Validate provider/recipient IDs against the state aggregator API.
Returns the aggregator type and confirmation status.
```json
Request:  { "providerId": "string", "recipientId": "string", "state": "string" }
Response: { "data": { "valid": boolean, "aggregator": "hhax|sandata|tellus|providerone", "error?": "string" } }
```

---

## Visits

### GET /visits
List visit history for the authenticated caregiver. Paginated.
```json
Query:    ?page=1&limit=20&recipientId=optional
Response: { "data": { "visits": Visit[], "total": number, "page": number } }
```

### POST /visits
Create a new visit (triggered on clock-in).
```json
Request: {
  "recipientId": "string",
  "clockInTime": "ISO 8601",
  "clockInLocation": { "lat": number, "lng": number }
}
Response: { "data": Visit }
```

### PATCH /visits/:id
Update a visit (add tasks, clock out, update EVV status).
```json
Request: {
  "clockOutTime?": "ISO 8601",
  "clockOutLocation?": { "lat": number, "lng": number },
  "tasks?": TaskLog[],
  "notes?": "string",
  "photos?": "string[] (S3 URLs)",
  "evvStatus?": "clocked_out | submitted | error"
}
Response: { "data": Visit }
```

### POST /visits/:id/submit-evv
Manually trigger EVV re-submission (for retry after error).
```json
Response: { "data": { "success": boolean, "confirmationId?": "string", "error?": "string" } }
```

---

## Family Portal

### GET /family/activity/:recipientId
Get the activity feed for a care recipient (visible to linked family members).
```json
Response: { "data": {
  "activities": [
    {
      "id": "string",
      "type": "visit_started | visit_completed | task_logged | photo_shared | medication_alert",
      "text": "string",
      "timestamp": "ISO 8601",
      "caregiverName": "string",
      "visitId": "string"
    }
  ]
} }
```

### POST /family/invite
Invite a family member to view a care recipient's activity feed.
```json
Request:  { "email": "string", "recipientId": "string", "relationship": "string" }
Response: { "data": { "inviteId": "string", "status": "sent" } }
```

### GET /family/members/:recipientId
List all family members linked to a care recipient.
```json
Response: { "data": FamilyMember[] }
```

---

## Appreciation

CareLog does NOT process payments. These endpoints generate deep links to
external payment apps. No money flows through CareLog's systems.

### POST /appreciation/link
Generate a deep link for a family member to send appreciation.
```json
Request: {
  "caregiverId": "string",
  "amount": number,
  "method": "venmo | zelle | paypal | cashapp",
  "message?": "string"
}
Response: { "data": { "deepLink": "string (URL)", "method": "string" } }
```

### GET /appreciation/history/:caregiverId
Get appreciation history for a caregiver (for stats display).
```json
Response: { "data": {
  "total": number,
  "thisMonth": number,
  "history": AppreciationPayment[]
} }
```

---

## Subscription

### GET /subscription
Get the authenticated user's subscription details.
```json
Response: { "data": { "tier": "basic|pro|family", "status": "active|past_due|cancelled", "renewsAt": "ISO 8601", "price": number } }
```

### POST /subscription/upgrade
```json
Request:  { "tier": "pro | family" }
Response: { "data": { "tier": "string", "price": number, "checkoutUrl": "string" } }
```

---

## Data Models (TypeScript Reference)

```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  tier: 'basic' | 'pro' | 'family';
  recipients: CareRecipient[];
  activeVisit: Visit | null;
}

interface CareRecipient {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;       // e.g., "Mother", "Father", "Spouse"
  providerId: string;          // Caregiver's Medicaid provider ID
  recipientId: string;         // Recipient's Medicaid ID
  state: string;               // 2-letter state code
  aggregator: 'hhax' | 'sandata' | 'tellus' | 'providerone' | 'calevv';
}

interface Visit {
  id: string;
  recipientId: string;
  recipientName: string;
  clockInTime: string;         // ISO 8601
  clockOutTime: string | null;
  clockInLocation: { lat: number; lng: number };
  clockOutLocation: { lat: number; lng: number } | null;
  tasks: TaskLog[];
  notes: string;
  photos: string[];            // S3 URLs
  evvStatus: 'idle' | 'clocked_in' | 'clocked_out' | 'submitted' | 'error';
}

interface TaskLog {
  id: string;
  name: string;
  category: 'personal_care' | 'meals' | 'medication' | 'mobility' | 'companionship' | 'other';
  completed: boolean;
  timestamp: string;
}

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  relationship: string;
  recipientId: string;
}

interface AppreciationPayment {
  id: string;
  fromFamilyMemberId: string;
  toCaregiverId: string;
  amount: number;
  method: 'venmo' | 'zelle' | 'paypal' | 'cashapp';
  timestamp: string;
  message?: string;
}
```

---

*CareLog API — Confidential — April 2026*
