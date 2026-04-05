# AGENTS.md — Start Here

> If you are an AI agent (Claude, Cursor, Copilot, Windsurf, etc.)
> working on this codebase, read this file FIRST.

---

## What is CareLog? (30-second version)

CareLog is a React Native mobile app that helps paid family caregivers:
1. **Clock in/out** of care visits with GPS verification
2. **Auto-submit** compliance data to state Medicaid (legally required — EVV)
3. **Connect with family** via a real-time visit portal
4. **Receive appreciation** (tips) from family members via Venmo/Zelle/PayPal

It's the ONLY consumer-facing EVV product. Zero B2C competitors.
$2.7B US market. 11 million caregivers. Federal law ensures permanent demand.

---

## Read These Docs (In Order)

| File | What You'll Learn | When To Read |
|------|-------------------|-------------|
| `docs/ABOUT.md` | Full business context, users, revenue, psychology | ALWAYS read first |
| `docs/ARCHITECTURE.md` | Tech stack, file structure, data flows, security | Before writing code |
| `docs/GLOSSARY.md` | EVV, HIPAA, aggregators, all domain terms | When you hit unfamiliar terms |
| `docs/CONTRIBUTING.md` | Code conventions, patterns, HIPAA checklist | Before submitting code |
| `docs/API.md` | REST endpoint contracts, data models | When building screens or services |

---

## Critical Rules (Non-Negotiable)

1. **HIPAA compliance is mandatory.** Never log PHI (recipient names, Medicaid IDs,
   visit data) to console, analytics, or crash reports. Use expo-secure-store for
   credentials. All API calls over HTTPS.

2. **EVV reliability is the #1 priority.** If auto-submit breaks, caregivers lose
   income. Every code change must preserve the clock-in → auto-submit → green
   checkmark flow. Offline retry queue must always work.

3. **Use semantic color tokens.** Never hardcode hex values in components. Always
   import from `@/constants/Colors`. The design system is in `constants/Colors.ts`,
   `constants/Typography.ts`, and `constants/Layout.ts`.

4. **Functional components only.** No class components. No Redux. No MobX.
   State lives in Zustand (`store/useAppStore.ts`). Hooks in `hooks/`.

5. **Warm human language.** Say "Mom (Dorothy)" not "Recipient #12345".
   Say "Visit" not "Service event". Say "Appreciation" not "Tip".
   See `docs/ABOUT.md` → Voice Principles for the full guide.

6. **Every feature must earn its place.** Before building anything, ask: does this
   serve compliance, family connection, or revenue? If no, don't build it.

---

## Quick-Reference: File Locations

| You need to...                  | Look in                          |
|---------------------------------|----------------------------------|
| Add a new screen                | `app/(tabs)/` or `app/(auth)/`   |
| Build a reusable component      | `components/` or `components/ui/`|
| Add a color or spacing token    | `constants/Colors.ts` or `Layout.ts` |
| Change app state                | `store/useAppStore.ts`           |
| Add an API endpoint             | `services/api.ts`                |
| Modify EVV submission logic     | `services/evv.ts`                |
| Add a push notification type    | `services/notifications.ts`      |
| Add a TypeScript type            | `types/index.ts`                 |
| Use GPS / location               | `hooks/useLocation.ts`           |
| Use a timer                      | `hooks/useTimer.ts`              |
| Understand the business          | `docs/ABOUT.md`                  |
| Understand domain terms          | `docs/GLOSSARY.md`               |
| Check API contracts              | `docs/API.md`                    |
| Check code conventions           | `docs/CONTRIBUTING.md`           |

---

## Quick-Reference: User Personas

| Persona          | Role in App         | Pays?     | Key Emotion        |
|------------------|--------------------|-----------|--------------------|
| Caregiver        | Primary user        | Yes ($19.99-$44.99/mo) | Anxiety about getting paid |
| Family Member    | Family Portal viewer | No (free) | Guilt about not being there |
| FMS Admin        | B2B dashboard user   | Yes ($8-10/caregiver/mo) | Frustration with correction costs |

---

## Quick-Reference: Key Numbers

| Metric               | Value          | Source     |
|----------------------|----------------|------------|
| US TAM               | $2.7B          | 37 open states × $27 blended ARPU |
| Paid US Caregivers   | 11M            | Medicaid/VA funded |
| Open-model states    | 37             | Third-party apps allowed |
| B2C Competitors      | 0              | Every competitor is B2B agency-only |
| Revenue streams      | 3              | B2C + B2B FMS + Appreciation |
| EVV data points      | 6              | Federally mandated |
| Aggregator APIs      | 4              | HHAeXchange, Sandata, Tellus, ProviderOne |
| Year 5 gross target  | $23.5M         | 35K B2C + 120K B2B |
| Year 5 net target    | $16.5M         | ~70% net margin |

---

## Quick-Reference: Core User Flow

```
Caregiver opens app
  → Dashboard shows Clock In button (hero interaction)
  → Taps CLOCK IN → GPS captured → timer starts → evvStatus = 'clocked_in'
  → Logs tasks during visit (bathing, meals, meds — one tap each)
  → Taps CLOCK OUT → GPS captured → timer stops → evvStatus = 'clocked_out'
  → Auto-submit fires: 6 EVV data points POST to aggregator API
  → Success → evvStatus = 'submitted' → green checkmark → family notified
  → Failure → evvStatus = 'error' → queued for retry → caregiver sees warning
```

```
Family member receives push notification
  → "Maria completed a 4-hour visit with Mom"
  → Opens Family Portal → sees activity feed (tasks, notes, photos)
  → Taps "Send Appreciation" → selects $25 → Venmo deep link opens
  → Caregiver receives $25 → feels valued → doesn't churn
```

---

## Quick-Reference: Design Tokens

| Token               | Value     | Usage                          |
|---------------------|-----------|--------------------------------|
| Colors.background   | #0B1622   | App background (deep navy)     |
| Colors.backgroundCard | #142842 | Card surfaces                  |
| Colors.primary      | #00D4AA   | CTAs, active states, teal      |
| Colors.accent.orange | #FF9F1C  | Warnings, B2B highlights       |
| Colors.accent.purple | #9B72E8  | Pro tier, premium features     |
| Colors.accent.pink  | #FF4069   | Family tier, urgent alerts     |
| Colors.textPrimary  | #FFFFFF   | Primary text                   |
| Colors.textSecondary | #8BA3BE  | Supporting text                |
| Colors.textMuted    | #5A7A9A   | Tertiary/disabled text         |

---

*CareLog — Build smart. Print on automatic.*


## Current Project Status (April 2026)

Phases 1-6 are COMPLETE. The app has:
- Working auth (Supabase), real database with RLS policies
- Clock in/out with real GPS capture → visits table
- EVV auto-submit with retry queue and audit trail
- Family portal with activity feed and appreciation deep links
- Task logging, visit notes, multi-recipient picker
- Earnings history, compliance dashboard, EVV config screen
- Subscription screen (tiers), notification preferences
- All API contract endpoints implemented
- Deployed to Vercel (web build)

**What's next:** Phase 7 (Stripe subscriptions), Phase 8 (international AU/UK),
Phase 9 (B2B FMS tools). See `ROADMAP.md` for full checklist.
