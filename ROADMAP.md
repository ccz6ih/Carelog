# CareLog Product Roadmap

## Phase 1 — MVP ✅
**Goal:** Working app with real auth, real data, and deployable web build.

- [x] Project scaffolding (Expo Router, tabs, auth flow)
- [x] Design system (Colors, Typography, Layout constants)
- [x] UI components (ClockButton, VisitCard, Button, Card, Badge)
- [x] Hand-drawn SVG icon set (6 comfort/care illustrations)
- [x] All screen layouts (Dashboard, Visits, Family, Settings)
- [x] Zustand state management
- [x] Supabase client + env configuration
- [x] Database schema + RLS policies (8 tables, full migration)
- [x] API service layer (services/api.ts → Supabase)
- [x] Wire auth (login/signup → Supabase Auth)
- [x] Wire onboarding (recipient creation → recipients table)
- [x] Wire clock in/out (→ visits table, real GPS)
- [x] Wire visit history (→ query visits table)
- [x] Wire family activity feed (→ query family_activity table)
- [x] Placeholder assets (icon, splash, favicon)
- [x] Deploy web build to Vercel
- [x] Run Supabase migration on project
- [ ] Persist auth state across app reloads
- [ ] Supabase auth listener (auto-restore session)

## Phase 2 — EVV Integration (In Progress)
**Goal:** Auto-submit EVV data to state aggregators on clock-out.

- [x] EVV aggregator configs (4 APIs × 37 states)
- [x] EVV payload builder (6 data points)
- [x] EVV submission on clock-out (automatic)
- [x] EVV status indicators in UI (submitted, pending, error)
- [ ] EVV audit trail (evv_submissions table — wired but needs real API)
- [ ] Offline queue with AsyncStorage (retry on reconnect)
- [ ] Exponential backoff for failed submissions
- [ ] Compliance dashboard screen (submission history, success rate)
- [ ] EVV aggregator auth (OAuth2 for HHAeXchange, Sandata) — requires vendor partnerships

## Phase 3 — Family Portal (In Progress)
**Goal:** Family members can view care activity and send appreciation.

- [x] Family activity feed UI (queries family_activity table)
- [x] Appreciation modal UI (amount selection)
- [ ] Auto-create family_activity entries on clock in/out
- [ ] Family member invite flow (email invite → accept)
- [ ] Real-time activity feed (Supabase Realtime subscriptions)
- [ ] Push notifications to family on visit events
- [ ] Appreciation payment routing (Venmo/Zelle deep links)
- [ ] Payment confirmation tracking
- [ ] Family member role management (viewer vs admin)

## Phase 4 — Enhanced Care Logging
**Goal:** Rich visit documentation beyond clock in/out.

- [ ] Task logging UI (checklist during active visits)
- [ ] Visit notes input on dashboard
- [ ] Photo capture during visits (expo-image-picker)
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

- [x] Hand-drawn icon set integrated
- [x] Enterprise-grade UI overhaul (glassmorphism, responsive)
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
- [ ] Error boundary components
- [ ] Loading/skeleton states for all screens
- [ ] Add unit tests (Jest + React Native Testing Library)
- [ ] Add E2E tests (Detox or Maestro)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Supabase Edge Functions for server-side logic
- [ ] Generated Supabase types (supabase gen types)
