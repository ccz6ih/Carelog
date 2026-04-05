# CareLog — Project Conventions

## Overview
CareLog is a React Native (Expo SDK 52) mobile app for EVV (Electronic Visit Verification) compliance. Caregivers clock in/out, the app auto-submits 6 data points to state Medicaid aggregators. Family members can view care activity and send appreciation.

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
```

## Conventions
- **Imports:** Use `@/` path alias (maps to project root)
- **Components:** Functional components with TypeScript interfaces for props
- **State:** All global state in Zustand store; local state with useState
- **API calls:** Always go through services/ layer, never call Supabase directly from screens
- **Colors:** Use `Colors.*` tokens from constants/Colors.ts, never hardcode hex values
- **Spacing:** Use `Layout.spacing.*` scale (xs=4, sm=8, md=16, lg=24, xl=32, xxl=48)
- **Types:** Define in types/index.ts, use Supabase-generated types where possible

## Environment Variables
- `EXPO_PUBLIC_*` — client-accessible (Supabase URL, anon key)
- Non-prefixed — server-only (service role key, DB password)
- Never commit `.env` files

## Key Patterns
- EVV submission happens on clock-out via services/evv.ts
- Auth state drives routing in app/index.tsx (redirect logic)
- RLS policies enforce data access — every table has row-level security
- Family members access data through their recipient_id link

## Commands
```bash
npx expo start          # Dev server
npx expo start --web    # Web dev server
npx expo export --platform web  # Build for Vercel
npm test                # Run tests (not yet configured)
```
