# CareLog — React Native Mobile App

> The EVV Compliance Platform for Paid Family Caregivers.
> Get Paid. Stay Compliant. Feel Seen.

## Quick Start

```bash
# Clone and install
git clone https://github.com/ccz6ih/Carelog.git
cd Carelog
npm install

# Set up environment
cp .env.example .env
# Fill in your Supabase credentials (see Environment Setup)

# Run the database migration
# Go to Supabase Dashboard → SQL Editor → paste supabase/migrations/001_initial_schema.sql

# Start dev server
npx expo start
```

Scan the QR with Expo Go (iOS/Android) or press `w` for web, `i` for iOS sim, `a` for Android emulator.

## Environment Setup

Create `.env` in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DB_PASSWORD=your-db-password
```

Get these from: Supabase Dashboard → Settings → API

## Architecture

```
app/                 Expo Router (file-based navigation)
  (auth)/            Login, Onboarding (unauthenticated)
  (tabs)/            Dashboard, Visits, Family, Settings (authenticated)
components/          Reusable UI components
  ui/                Design system primitives (Button, Card, Badge)
constants/           Colors, Typography, Layout tokens
hooks/               Custom hooks (useLocation, useTimer)
services/            Supabase client, EVV auto-submit, notifications
store/               Zustand state management
types/               TypeScript interfaces
supabase/            Database migrations
```

## Core Features

- **Clock In/Out** — GPS-verified, animated hero button with haptic feedback
- **6 EVV Data Points** — auto-captured on every visit (21st Century Cures Act)
- **Auto-Submit** — POSTs to state Medicaid via 4 aggregator APIs (37 states)
- **Visit History** — with EVV status tracking (submitted, pending, error)
- **Family Portal** — real-time care activity feed for family members
- **Send Appreciation** — routes to Venmo/Zelle/PayPal/Cash App
- **Supabase Backend** — auth, PostgreSQL database, Row Level Security

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK 52 + React Native 0.76 |
| Navigation | Expo Router (file-based) |
| Backend | Supabase (Auth, DB, Edge Functions) |
| State | Zustand |
| Language | TypeScript (strict) |
| Animations | React Native Reanimated |
| Location | expo-location |

## Database

8 tables with full RLS. See [DATABASE.md](DATABASE.md) for schema details.

Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor to set up.

## EVV Aggregator Coverage

| Aggregator | States | Auth Type |
|------------|--------|-----------|
| HHAeXchange | FL, NY, NJ, MA, MD, VA, GA, NC | OAuth2 |
| Sandata eMBS | OH, PA, TX, IL, MI + 15 more | OAuth2 |
| Tellus/Optum | AZ, OR, NV, HI, ME, NH | API Key |
| ProviderOne+CA | WA, CA, CO | Certificate |

## Design System

- **Background:** `#0B1622` (deep navy)
- **Primary:** `#00D4AA` (teal) — CTAs, active states
- **Secondary:** `#FF9F1C` (orange) — warnings, highlights
- **Tertiary:** `#9B72E8` (purple) — Pro tier
- **Accent:** `#FF4069` (pink) — Family tier, alerts

## Deployment

- **Web:** `npx expo export --platform web` → deploy `dist/` to Vercel
- **iOS/Android:** EAS Build (`eas build --platform all`)
- See [DEPLOYMENT.md](DEPLOYMENT.md) for full guide

## Documentation

- [CLAUDE.md](CLAUDE.md) — Project conventions for AI-assisted development
- [DATABASE.md](DATABASE.md) — Full schema documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) — Build and deploy instructions
- [ROADMAP.md](ROADMAP.md) — Feature roadmap (6 phases)

## License

Confidential — CareLog · April 2026
