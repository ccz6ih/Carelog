# CareLog Product Roadmap

> Aligned with docs/ABOUT.md, docs/API.md, docs/GLOSSARY.md

## Phase 1 — MVP ✅ Complete
**Goal:** Working app with real auth, real data, deployable web build.

- [x] Expo Router scaffolding (auth + tabs + detail screens)
- [x] Design system (Colors, Typography, Layout, glassmorphism)
- [x] Hand-drawn SVG icon set (6 comfort/care illustrations)
- [x] UI components (ClockButton, VisitCard, TaskLogger, VisitNotes, RecipientPicker)
- [x] Supabase backend (auth, database, RLS policies)
- [x] Database schema (8 tables + migration 001)
- [x] Auth wired (login/signup → Supabase Auth, session persistence)
- [x] Onboarding (recipient creation → recipients table)
- [x] Clock in/out (→ visits table, real GPS capture)
- [x] Visit history (paginated, recipient join)
- [x] Family activity feed (auto-populated on clock in/out)
- [x] Deploy to Vercel (SPA mode, env vars)

## Phase 2 — EVV Integration ✅ Complete
**Goal:** Auto-submit EVV data to state aggregators on clock-out.

- [x] EVV aggregator configs (4 APIs × 37 states)
- [x] EVV payload builder (6 data points per 21st Century Cures Act)
- [x] EVV submission on clock-out (automatic)
- [x] EVV status indicators (submitted, pending, needs attention)
- [x] Offline retry queue with AsyncStorage (exponential backoff)
- [x] EVV audit trail (evv_submissions table)
- [x] Compliance dashboard (/compliance) — stats + submission history
- [x] EVV Configuration screen (/evv-config) — per-recipient aggregator setup
- [ ] EVV aggregator authentication (OAuth2/API key/certificate) — requires vendor partnerships
- [ ] Manual retry button on compliance screen

## Phase 3 — Family Portal ✅ Complete
**Goal:** Family members can view care activity and send appreciation.

- [x] Family activity feed (queries family_activity table)
- [x] Auto-create activity entries on clock in/out
- [x] Family member invite screen (/family-members)
- [x] Appreciation modal with amount selection
- [x] Payment deep links (Venmo, Cash App, Zelle, PayPal)
- [x] Appreciation history API
- [ ] Real-time feed (Supabase Realtime subscriptions)
- [ ] Push notifications to family on visit events
- [ ] Family member accept-invite flow (email → app)

## Phase 4 — Enhanced Care Logging ✅ Complete
**Goal:** Rich visit documentation beyond clock in/out.

- [x] Task logging checklist (5 presets + custom tasks)
- [x] Visit notes with debounced auto-save
- [x] Multi-recipient picker (horizontal pill selector)
- [x] Earnings history screen (/earnings) — visits, hours, appreciation
- [ ] Photo capture during visits (expo-image-picker wired)
- [ ] Medication logging (schema ready, UI needed)
- [ ] Care plan templates (pre-defined task lists per recipient)

## Phase 5 — Full API Contract ✅ Complete
**Goal:** Every endpoint in docs/API.md has a working implementation.

- [x] api.ts covers all contract endpoints
- [x] Types match API contract exactly (types/index.ts)
- [x] Paginated visit queries with recipientId filter
- [x] Appreciation API (getHistory, generateLink)
- [x] Subscription API (get, updateTier)
- [x] Medication API (listForRecipient, log, listForVisit)
- [x] Notification preferences API (get, update)
- [x] Audit logging API (HIPAA compliance)
- [x] Migration 002 (medication_logs, audit_logs, notification_preferences, subscription fields)

## Phase 6 — Settings & Navigation ✅ Complete
**Goal:** Every settings row navigates to a functional screen.

- [x] /recipients — Care recipients CRUD with Medicaid IDs
- [x] /family-members — Invite family, view status, value prop
- [x] /subscription — Tier comparison (Basic/Pro/Family), pricing
- [x] /evv-config — Per-recipient aggregator, 6-step explainer
- [x] /compliance — EVV stats, submission history, queue status
- [x] /earnings — Monthly/all-time hours, visits, appreciation
- [x] /notification-settings — 9 toggle preferences by category
- [ ] /security — HIPAA info, data export, delete account

## Phase 7 — Monetization (Next)
**Goal:** Stripe subscriptions, tier enforcement, earnings tracking.

- [ ] Stripe integration for subscription billing
- [ ] Checkout flow (subscription.upgrade → Stripe checkout URL)
- [ ] Tier enforcement (recipient/viewer limits per tier)
- [ ] Pro tier: medication logging, 2 recipients, 3 viewers
- [ ] Family tier: unlimited recipients/viewers, care plans, community
- [ ] Earnings tracker (hourly rate × hours worked projection)

## Phase 8 — International Expansion
**Goal:** Australia (NDIS) and UK (Direct Payments) support.

- [ ] NDIA REST API integration (PRODA auth) — Australia
- [ ] PDF timesheet generator for 348 UK local councils
- [ ] GDPR compliance layer for UK version
- [ ] Currency/locale support (AUD, GBP)

## Phase 9 — B2B / FMS Tools
**Goal:** Enterprise dashboard for FMS companies.

- [ ] FMS Admin Dashboard (real-time compliance rates)
- [ ] Bulk caregiver enrollment API
- [ ] White-label branding layer ("PPL EVV, powered by CareLog")
- [ ] Weekly compliance reports (automated)
- [ ] Enterprise invoicing system

## Phase 10 — Polish & Launch
**Goal:** App store submission and production hardening.

- [x] ErrorBoundary component
- [x] Skeleton loading components
- [ ] Professional app icon and splash screen
- [ ] Onboarding tutorial / walkthrough
- [ ] Sentry error tracking
- [ ] Analytics (PostHog)
- [ ] App Store submission (iOS)
- [ ] Play Store submission (Android)
- [ ] Landing page (carelog.app)
- [ ] HIPAA compliance audit
- [ ] Security penetration test
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] E2E tests (Maestro)

---

*CareLog — Build smart. Print on automatic.*
