# CareLog — Technical Architecture

> Reference document for developers and AI agents working on the codebase.

---

## Tech Stack

| Layer            | Technology                    | Why                                    |
|------------------|-------------------------------|----------------------------------------|
| Framework        | React Native 0.76 (Expo SDK 52) | Single codebase, iOS + Android       |
| Language         | TypeScript (strict mode)      | Type safety for medical/compliance app |
| Navigation       | Expo Router v4                | File-based routing, deep linking       |
| State            | Zustand v5                    | Minimal, fast, no boilerplate          |
| Animations       | React Native Reanimated v3    | 60fps native animations               |
| Location         | expo-location                 | GPS capture for EVV compliance         |
| Notifications    | expo-notifications            | Family portal push alerts              |
| Haptics          | expo-haptics                  | Tactile feedback on clock in/out       |
| Secure Storage   | expo-secure-store             | HIPAA-compliant token/credential storage |
| HTTP             | fetch (built-in)              | API calls to aggregators + backend     |

## NOT in the stack (and why)

- **No Redux** — Zustand is simpler and sufficient for our state complexity
- **No class components** — functional components + hooks only
- **No Axios** — native fetch is sufficient, fewer dependencies
- **No Firebase** — we need HIPAA BAA compliance, rolling our own auth
- **No Tailwind/NativeWind** — StyleSheet is more performant in RN

---

## Project Structure

```
C:\Projects\Carelog\
├── app/                    # Expo Router — file-based navigation
│   ├── _layout.tsx         # Root layout (StatusBar, dark theme)
│   ├── index.tsx           # Entry point — redirects to auth or tabs
│   ├── (auth)/             # Auth group (unauthenticated users)
│   │   ├── _layout.tsx     # Auth stack layout
│   │   ├── login.tsx       # Login screen
│   │   └── onboarding.tsx  # Add first care recipient
│   └── (tabs)/             # Main tab group (authenticated users)
│       ├── _layout.tsx     # Tab bar layout (Dashboard, Visits, Family, Settings)
│       ├── index.tsx       # Dashboard — Clock In/Out hero screen
│       ├── visits.tsx      # Visit history with EVV status
│       ├── family.tsx      # Family portal + Send Appreciation
│       └── settings.tsx    # Account, subscription, EVV config
├── components/             # Reusable UI components
│   ├── ui/                 # Design system primitives
│   │   ├── Button.tsx      # Primary CTA (gradient teal, outline, ghost)
│   │   ├── Card.tsx        # Elevated surface with optional color border
│   │   ├── Badge.tsx       # Status indicators, tier labels
│   │   └── index.ts        # Barrel exports
│   ├── ClockButton.tsx     # Hero interaction — pulsing circle, haptic
│   └── VisitCard.tsx       # Visit history card with EVV status badge
├── constants/              # Design system tokens
│   ├── Colors.ts           # Full color system (semantic + tier + EVV)
│   ├── Typography.ts       # Type scale (heroStat, h1-h3, body, caption)
│   └── Layout.ts           # Spacing, radii, sizing constants
├── hooks/                  # Custom React hooks
│   ├── useLocation.ts      # GPS capture wrapper (permissions + high accuracy)
│   ├── useTimer.ts         # Elapsed time tracking for active visits
│   └── index.ts            # Barrel exports
├── services/               # Business logic + external integrations
│   ├── evv.ts              # EVV auto-submit engine (6 data points → aggregator APIs)
│   ├── api.ts              # REST client (auth, visits, recipients, family)
│   ├── notifications.ts    # Push notification templates + registration
│   └── index.ts            # Barrel exports
├── store/                  # State management
│   └── useAppStore.ts      # Zustand store (auth, visits, EVV status, timer)
├── types/                  # TypeScript interfaces
│   └── index.ts            # User, Visit, CareRecipient, TaskLog, etc.
├── assets/                 # Static assets
│   ├── images/             # App icons, splash screen
│   └── fonts/              # Custom fonts (optional — system fonts work)
├── scripts/                # Dev utilities
│   ├── generate_icons.py   # Placeholder asset generator
│   └── generate-assets.ps1 # PowerShell wrapper for Windows
├── docs/                   # Documentation (you are here)
├── app.json                # Expo config (permissions, splash, bundleId)
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config (strict, path aliases)
├── babel.config.js         # Babel + Reanimated plugin
├── metro.config.js         # Metro bundler config
└── README.md               # Quick start guide
```

---

## Data Flow: Clock In → Auto-Submit

This is the core flow — the entire reason CareLog exists:

```
1. Caregiver taps CLOCK IN
   └─→ expo-haptics: heavy impact feedback
   └─→ expo-location: capture GPS (lat/lng + accuracy)
   └─→ Zustand store: set evvStatus = 'clocked_in', start timer
   └─→ API: POST /visits (create visit record)

2. During visit: caregiver logs tasks
   └─→ Each task tap updates visit.tasks[] in store
   └─→ Optional: photo upload, notes, medication log

3. Caregiver taps CLOCK OUT
   └─→ expo-haptics: heavy impact feedback
   └─→ expo-location: capture GPS (clock-out location)
   └─→ Zustand store: set evvStatus = 'clocked_out'
   └─→ services/evv.ts: buildEVVPayload() — assembles 6 data points
   └─→ services/evv.ts: submitEVV() — POST to aggregator API
       ├─→ SUCCESS: evvStatus = 'submitted', green checkmark
       │   └─→ Push notification to family members
       └─→ FAILURE: evvStatus = 'error', queue for retry
           └─→ Retry with exponential backoff (1s, 2s, 4s, 8s...)
```

### The 6 EVV Data Points (assembled by buildEVVPayload)

```typescript
{
  serviceType: 'PCS',                    // 1. Personal Care Services
  recipientId: recipient.recipientId,    // 2. Medicaid recipient number
  providerId: recipient.providerId,      // 3. Caregiver's provider ID
  dateOfService: '2026-04-04',           // 4. Date
  startTime: '2026-04-04T09:02:00Z',    // 5. Clock-in timestamp
  endTime: '2026-04-04T13:14:00Z',      // 6. Clock-out timestamp
  location: { lat: 39.7392, lng: -104.9903 }  // GPS verification
}
```

---

## State Management (Zustand)

Single store at `store/useAppStore.ts`. Flat structure, no nested reducers.

```
AppState {
  user: User | null          // Authenticated user profile
  isAuthenticated: boolean   // Auth gate for navigation
  isOnboarded: boolean       // Has added at least one recipient
  activeVisit: Visit | null  // Currently in-progress visit
  evvStatus: EVVStatus       // 'idle' | 'clocked_in' | 'clocked_out' | 'submitted' | 'error'
  clockInTime: Date | null   // Timer reference point
  elapsedSeconds: number     // Live timer display value
}
```

State is ephemeral — persisted data lives on the backend. Secure tokens
stored in expo-secure-store (Keychain on iOS, KeyStore on Android).

---

## Security & HIPAA Compliance

This is a medical compliance app. Security is not optional.

- **Data at rest**: AES-256 encryption via expo-secure-store for tokens/credentials
- **Data in transit**: TLS 1.3 minimum for all API calls
- **PHI handling**: Protected Health Information (recipient names, Medicaid IDs,
  visit records) must NEVER appear in console.log, analytics events, crash reports,
  or error messages sent to third parties
- **Audit logging**: Every data access event is logged server-side (who, what, when)
- **Authentication**: JWT tokens with short expiry, refresh token rotation
- **Authorization**: Caregivers can only see their own recipients and visits.
  Family members can only see recipients they're linked to.
- **BAA requirement**: Any third-party service touching PHI must have a signed
  Business Associate Agreement (BAA)

---

## Design System Summary

### Color Palette (from pitch deck)

| Token          | Hex       | Usage                                  |
|----------------|-----------|----------------------------------------|
| background     | #0B1622   | App background — deep navy             |
| backgroundCard | #142842   | Card/surface background                |
| surface        | #162231   | Input fields, subtle containers        |
| primary        | #00D4AA   | CTAs, active states, success, teal     |
| accent.orange  | #FF9F1C   | Warnings, tier highlights, B2B         |
| accent.purple  | #9B72E8   | Pro tier, premium features             |
| accent.pink    | #FF4069   | Family tier, urgent alerts             |
| textPrimary    | #FFFFFF   | Primary text                           |
| textSecondary  | #8BA3BE   | Supporting text                        |
| textMuted      | #5A7A9A   | Tertiary/disabled text                 |
| success        | #4CAF50   | EVV submitted, confirmed states        |
| error          | #EF4444   | Failed submissions, denied claims      |

### Typography Scale

| Token        | Size | Weight | Usage                                  |
|-------------|------|--------|----------------------------------------|
| heroStat    | 48px | 800    | Large numbers ($2.7B, 33.3%)           |
| h1          | 28px | 700    | Screen titles                          |
| h2          | 22px | 600    | Section headers                        |
| h3          | 18px | 600    | Card titles                            |
| body        | 16px | 400    | Body text                              |
| bodySm      | 14px | 400    | Secondary body                         |
| caption     | 12px | 500    | Labels, timestamps                     |
| sectionLabel| 11px | 700    | Spaced uppercase labels (THE PROBLEM)  |

---

*Last updated: April 2026*
