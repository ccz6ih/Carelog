# CareLog Product Roadmap

## Phase 1 — MVP (Current Sprint)
**Goal:** Working app with real auth, real data, and deployable web build.

- [x] Project scaffolding (Expo Router, tabs, auth flow)
- [x] Design system (Colors, Typography, Layout constants)
- [x] UI components (ClockButton, VisitCard, Button, Card, Badge)
- [x] All screen layouts (Dashboard, Visits, Family, Settings)
- [x] Zustand state management
- [x] Supabase client + env configuration
- [x] Database schema + RLS policies
- [x] API service layer (services/api.ts → Supabase)
- [ ] Wire auth (login/signup → Supabase Auth)
- [ ] Wire onboarding (recipient creation → recipients table)
- [ ] Wire clock in/out (→ visits table, real GPS)
- [ ] Wire visit history (→ query visits table)
- [ ] Wire family activity feed (→ query family_activity table)
- [ ] Placeholder assets (icon, splash, favicon)
- [ ] Deploy web build to Vercel
- [ ] Run Supabase migration on project

## Phase 2 — EVV Integration
**Goal:** Auto-submit EVV data to state aggregators on clock-out.

- [ ] EVV aggregator auth (OAuth2 for HHAeXchange, Sandata)
- [ ] EVV payload formatting per aggregator API spec
- [ ] EVV submission on clock-out (automatic)
- [ ] EVV audit trail (evv_submissions table)
- [ ] Offline queue with AsyncStorage (retry on reconnect)
- [ ] Exponential backoff for failed submissions
- [ ] EVV status indicators in UI (submitted, pending, error)
- [ ] Compliance dashboard (submission history, success rate)

## Phase 3 — Family Portal
**Goal:** Family members can view care activity and send appreciation.

- [ ] Family member invite flow (email invite → accept)
- [ ] Real-time activity feed (Supabase Realtime subscriptions)
- [ ] Push notifications to family on visit events
- [ ] Appreciation payment routing (Venmo/Zelle deep links)
- [ ] Payment confirmation tracking
- [ ] Family member role management (viewer vs admin)

## Phase 4 — Enhanced Care Logging
**Goal:** Rich visit documentation beyond clock in/out.

- [ ] Task logging UI (checklist during visits)
- [ ] Photo capture during visits (expo-image-picker)
- [ ] Visit notes (rich text)
- [ ] Care plan templates (pre-defined task lists)
- [ ] Medication reminders + logging
- [ ] Multi-recipient support (switch between care recipients)

## Phase 5 — Monetization & Scale
**Goal:** Subscription tiers and agency support.

- [ ] Stripe integration for subscription billing
- [ ] Pro tier features (export reports, analytics)
- [ ] Family tier features (multi-family, priority notifications)
- [ ] Agency dashboard (manage multiple caregivers)
- [ ] Compliance reporting (state-specific report generation)
- [ ] Earnings tracker + tax document generation

## Phase 6 — Polish & Launch
**Goal:** App store submission and production hardening.

- [ ] Custom app icon and splash screen (professional design)
- [ ] Onboarding tutorial / walkthrough
- [ ] Sentry error tracking
- [ ] Analytics (Mixpanel or PostHog)
- [ ] App Store submission (iOS)
- [ ] Play Store submission (Android)
- [ ] Landing page (carelog.app)
- [ ] HIPAA compliance review
- [ ] Security audit

## Technical Debt
- [ ] Add unit tests (Jest + React Native Testing Library)
- [ ] Add E2E tests (Detox or Maestro)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Supabase Edge Functions for server-side logic
- [ ] Generated Supabase types (supabase gen types)
- [ ] Remove all hardcoded mock data
- [ ] Error boundary components
- [ ] Loading/skeleton states for all screens
