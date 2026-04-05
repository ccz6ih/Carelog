# CareLog — React Native Mobile App

> The EVV Compliance Platform for Paid Family Caregivers.
> And the Infrastructure FMS Companies Need.

## Quick Start

```bash
cd C:\Projects\Carelog
npm install
npx expo start
```

Scan the QR with Expo Go (iOS/Android) or press `i` for iOS sim / `a` for Android emulator.

## Architecture

```
app/               Expo Router (file-based navigation)
  (auth)/           Login, Onboarding
  (tabs)/           Dashboard, Visits, Family, Settings
components/        Reusable UI components
  ui/              Design system primitives (Button, Card, Badge)
constants/         Colors, Typography, Layout tokens
services/          EVV auto-submit, API client
store/             Zustand state management
types/             TypeScript interfaces
```

## Core Features (Phase 1)

- **Clock In/Out** — GPS-verified, animated hero button
- **6 EVV Data Points** — auto-captured on every visit
- **Auto-Submit** — POSTs to state Medicaid via aggregator APIs
- **Visit History** — with EVV status tracking
- **Family Portal** — real-time visit feed for family members
- **Send Appreciation** — routes to Venmo/Zelle/PayPal
- **HIPAA Compliant** — AES-256, audit logging

## Design System

Extracted from pitch deck v6:
- **Background:** `#0B1622` (deep navy)
- **Primary:** `#00D4AA` (teal) — CTAs, active states
- **Secondary:** `#FF9F1C` (orange) — warnings, highlights
- **Tertiary:** `#9B72E8` (purple) — Pro tier
- **Accent:** `#FF4069` (pink) — Family tier, alerts

## Tech Stack

- Expo SDK 52 + React Native 0.76
- Expo Router (file-based navigation)
- Zustand (state management)
- TypeScript (strict mode)
- React Native Reanimated (animations)

## EVV Aggregator Coverage

| Aggregator    | States | Build Time |
|---------------|--------|------------|
| HHAeXchange   | 8      | 4-5 weeks  |
| Sandata eMBS   | 20     | 5-6 weeks  |
| Tellus/Optum   | 6      | 4-5 weeks  |
| ProviderOne+CA | 3      | 6-8 weeks  |

---
Build smart. Print on automatic. · CareLog · Confidential · April 2026
