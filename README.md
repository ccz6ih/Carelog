# CareLog — React Native Mobile App

> The EVV Compliance Platform for Paid Family Caregivers.
> And the Infrastructure FMS Companies Need.

**AI Agents: Read `AGENTS.md` first.** It contains everything you need to
understand this project in 3 minutes.

## Quick Start

```bash
cd C:\Projects\Carelog
python scripts/generate_icons.py   # generate placeholder assets
npm install
npx expo start
```

Scan the QR with Expo Go (iOS/Android) or press `i` for iOS sim / `a` for Android emulator.

## Documentation

| Document | Purpose |
|----------|---------|
| `AGENTS.md` | Start here — 3-minute project overview for AI agents |
| `docs/ABOUT.md` | Full business context, users, revenue model, psychology |
| `docs/ARCHITECTURE.md` | Tech stack, file structure, data flows, security |
| `docs/GLOSSARY.md` | Domain terminology (EVV, HIPAA, aggregators, etc.) |
| `docs/CONTRIBUTING.md` | Code conventions, patterns, HIPAA checklist |
| `docs/API.md` | REST endpoint contracts and data models |

## Architecture

```
app/               Expo Router (file-based navigation)
  (auth)/           Login, Onboarding
  (tabs)/           Dashboard, Visits, Family, Settings
components/        Reusable UI components
  ui/              Design system primitives (Button, Card, Badge)
constants/         Colors, Typography, Layout tokens
hooks/             useLocation (GPS), useTimer (elapsed time)
services/          EVV auto-submit, API client, notifications
store/             Zustand state management
types/             TypeScript interfaces
docs/              Full documentation suite
```

## Core Features (Phase 1)

- **Clock In/Out** — GPS-verified, animated hero button with haptic feedback
- **6 EVV Data Points** — auto-captured on every visit
- **Auto-Submit** — POSTs to state Medicaid via 4 aggregator APIs (37 states)
- **Visit History** — with color-coded EVV status tracking
- **Family Portal** — real-time visit feed for family members
- **Send Appreciation** — routes to Venmo/Zelle/PayPal (no money through CareLog)
- **HIPAA Compliant** — AES-256 encryption, audit logging, secure storage

## Tech Stack

- Expo SDK 52 + React Native 0.76 (single codebase, iOS + Android)
- Expo Router v4 (file-based navigation)
- Zustand v5 (state management)
- TypeScript strict mode
- React Native Reanimated v3 (animations)

## EVV Aggregator Coverage

| Aggregator       | States | Build Time |
|------------------|--------|------------|
| HHAeXchange      | 8      | 4-5 weeks  |
| Sandata eMBS     | 20     | 5-6 weeks  |
| Tellus/Optum     | 6      | 4-5 weeks  |
| ProviderOne+CA   | 3      | 6-8 weeks  |

## Key Numbers

- **$2.7B** US open-state TAM
- **11M** paid US caregivers
- **37** open-model states (third-party apps allowed)
- **0** B2C competitors (every competitor is B2B agency-only)
- **3** revenue streams (B2C subscriptions + B2B FMS licensing + Appreciation)
- **$23.5M** Year 5 gross revenue target
- **$16.5M** Year 5 net profit target

## The Team

- **Olivier** — Co-Founder/CEO · Business, Growth & B2B Sales
- **Craig** — Co-Founder/CTO · Architecture, Build & Execution

---

*Build smart. Print on automatic. · CareLog · Confidential · April 2026*
