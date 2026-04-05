# CareLog — Project Conventions

## Overview
CareLog is a React Native (Expo SDK 52) mobile app for EVV (Electronic Visit Verification) compliance. Caregivers clock in/out, the app auto-submits 6 data points to state Medicaid aggregators. Family members can view care activity and send appreciation.

**Full documentation:** Read these in order for complete context:
- `AGENTS.md` — 3-minute overview (start here)
- `docs/ABOUT.md` — Business context, users, revenue, psychology, voice guidelines
- `docs/ARCHITECTURE.md` — Tech stack, file structure, data flows, security
- `docs/GLOSSARY.md` — Domain terminology (EVV, HIPAA, aggregators, FMS, etc.)
- `docs/CONTRIBUTING.md` — Code conventions, patterns, HIPAA checklist
- `docs/API.md` — REST endpoint contracts and data models
- `ROADMAP.md` — Current build status and upcoming phases

## Tech Stack
- **Framework:** Expo SDK 52, Expo Router (file-based routing)
- **Language:** TypeScript (strict mode)
- **State:** Zustand (store/useAppStore.ts)
- **Backend:** Supabase (auth, database, edge functions)
- **Styling:** React Native StyleSheet + constants (no CSS-in-JS library)
- **Animations:** react-native-reanimated

## Project Structure
```
app/              # Expo Router screens (file-based routing)
  (auth)/         # Login, onboarding (unauthenticated)
  (tabs)/         # Main tab navigator (authenticated)
components/       # Shared components
  ui/             # Design system primitives (Button, Card, Badge)
constants/        # Colors, Layout, Typography tokens
hooks/            # Custom hooks (useLocation, useTimer)
services/         # API layer (supabase client, EVV, notifications)
store/            # Zustand state management
types/            # TypeScript interfaces
supabase/         # Database migrations
scripts/          # Build/asset generation scripts
docs/             # Full documentation suite (ABOUT, ARCHITECTURE, GLOSSARY, API, CONTRIBUTING)
```

## Conventions
- **Imports:** Use `@/` path alias (maps to project root)
- **Components:** Functional components with TypeScript interfaces for props
- **State:** All global state in Zustand store; local state with useState
- **API calls:** Always go through services/ layer, never call Supabase directly from screens
- **Colors:** Use `Colors.*` tokens from constants/Colors.ts, never hardcode hex values
- **Spacing:** Use `Layout.spacing.*` scale (xs=4, sm=8, md=16, lg=24, xl=32, xxl=48)
- **Types:** Define in types/index.ts, use Supabase-generated types where possible
- **Voice:** Warm, human language. "Mom (Dorothy)" not "Recipient #12345". See docs/ABOUT.md

## Environment Variables
- `EXPO_PUBLIC_*` — client-accessible (Supabase URL, anon key)
- Non-prefixed — server-only (service role key, DB password)
- Never commit `.env` files

## Key Patterns
- EVV submission happens on clock-out via services/evv.ts
- Auth state drives routing in app/index.tsx (redirect logic)
- RLS policies enforce data access — every table has row-level security
- Family members access data through their recipient_id link
- HIPAA: Never log PHI to console, analytics, or crash reports

## Current Status (April 2026)
Phases 1-6 complete. Next up: Phase 7 (Stripe monetization), then international.
See ROADMAP.md for detailed checklist.

## Commands
```bash
npx expo start          # Dev server
npx expo start --web    # Web dev server
npx expo export --platform web  # Build for Vercel
npm test                # Run tests (not yet configured)
```

## Critical Rules
1. If EVV auto-submit breaks, caregivers don't get paid. Reliability > features.
2. HIPAA compliance is non-negotiable. AES-256 at rest, TLS 1.3 in transit.
3. Every feature must serve compliance, family connection, or revenue.
4. No class components. No Redux. Functional + Zustand only.
5. Use semantic color tokens from constants/Colors.ts. Never hardcode hex.
