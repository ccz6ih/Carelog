# CareLog — Project Context for AI Agents & Developers

> Read this document FIRST before working on any part of the CareLog codebase.
> It contains everything you need to understand what this app is, who it serves,
> why it exists, and how every piece fits together.

---

## What is CareLog?

CareLog is a mobile app (iOS + Android, React Native) that solves a specific,
federally-mandated compliance problem for paid family caregivers in the United States,
Australia, and the United Kingdom.

In simple terms: **CareLog helps family caregivers clock in and out of care visits,
automatically submits their compliance data to the government, and connects them
with the family members who benefit from their care.**

It is the ONLY consumer-facing (B2C) product in this space. Every competitor
(HHAeXchange, Sandata, Time4Care) is built for agencies (B2B). CareLog is built
for the individual caregiver and their family.

---

## The Regulatory Context (Why This App Must Exist)

### The 21st Century Cures Act (2016)

The US Congress passed the 21st Century Cures Act, which requires all states to
implement Electronic Visit Verification (EVV) for Medicaid-funded personal care
services. This is FEDERAL LAW — it does not expire, it cannot be opted out of,
and it creates permanent demand for EVV tools.

### What is EVV?

EVV (Electronic Visit Verification) requires that every home care visit captures
and submits 6 specific data points to state Medicaid:

1. **Type of service** performed (e.g., Personal Care Services)
2. **Individual receiving service** (the care recipient's Medicaid ID)
3. **Individual providing service** (the caregiver's provider ID)
4. **Date of service**
5. **Time service begins** (clock-in with GPS verification)
6. **Time service ends** (clock-out with GPS verification)

If these 6 data points are not submitted correctly, the caregiver DOES NOT GET PAID.
The average caregiver loses $1,500+/year to EVV errors. In Ohio, only 44% of claims
were compliant in a recent audit. Hard denials are now enforced in 15+ states.

### Open-Model vs Closed-Model States

States fall into two categories for EVV:
- **Open-model states (37 states)**: Allow third-party apps like CareLog to submit
  EVV data via published REST APIs. This is our market.
- **Closed-model states (13 states)**: Require use of a state-mandated system.
  CareLog cannot operate in these states.

### The Aggregator System

Open-model states don't each have their own API. Instead, they contract with
EVV aggregators — large companies that provide the submission infrastructure.
CareLog connects to 4 aggregators to unlock 37 states:

| Aggregator       | States Covered | API Type   | Build Time |
|------------------|---------------|------------|------------|
| HHAeXchange      | 8 (FL, NY, NJ, MA, MD, VA, GA, NC) | REST/OAuth2 | 4-5 weeks |
| Sandata eMBS     | 20 (OH, PA, TX, IL, MI, etc.)      | REST/OAuth2 | 5-6 weeks |
| Tellus/Optum     | 6 (AZ, OR, NV, HI, ME, NH)         | REST/API Key | 4-5 weeks |
| ProviderOne + CA | 3 (WA, CA, CO)                      | REST/Cert   | 6-8 weeks |

**This aggregator integration IS the technical moat.** Building and maintaining
these integrations takes months and requires compliance expertise. Competitors
cannot easily replicate this.

---

## Who Are Our Users?

### Primary User: The Paid Family Caregiver

- 11 million paid caregivers in the US (Medicaid/VA funded)
- Typically a family member (daughter, son, spouse) who is paid by the state
  to care for an aging or disabled relative
- They are NOT medical professionals — they are family members doing personal
  care (bathing, meals, medication reminders, mobility assistance)
- They are often tech-unsavvy, stressed, underpaid, and invisible
- Their biggest pain: getting paid. EVV errors = lost income.

### Secondary User: The Family Member (Free — Family Portal)

- Siblings, spouses, adult children of the care recipient
- They have ZERO visibility into what happens during care visits
- They worry. They call. The caregiver resents the surveillance.
- CareLog gives them a free portal with real-time visit notifications,
  task logs, photo updates, and the ability to "Send Appreciation"
- The family member is the RETENTION mechanism — a caregiver whose family
  is watching through CareLog will not switch to a competitor

### Tertiary User: FMS Companies (B2B Channel)

- Financial Management Services (FMS) companies are the intermediaries
  between state Medicaid programs and individual caregivers
- They earn $80-120/consumer/month from the state
- Their biggest cost: correction teams fixing EVV errors ($12-18/consumer/month)
- CareLog at $8-10/caregiver/month eliminates that cost center entirely
- Target FMS companies: PPL (200K+ caregivers), Palco (~72K in CO),
  Maximus (100K+), Acumen Fiscal Agent (8+ states)

---

## The Three Revenue Streams

### 1. B2C Subscriptions (Direct to Caregiver)

| Tier    | Price     | Key Features |
|---------|-----------|-------------|
| Basic   | $19.99/mo | EVV clock in/out, GPS, auto-submit, 1 recipient, 1 family viewer |
| Pro     | $29.99/mo | 2 recipients, 3 family viewers, training videos, medication log |
| Family  | $44.99/mo | Unlimited recipients/viewers, premium videos, medication alerts, community |

The upsell gate is the number of care recipients. 24% of caregivers support 2+
recipients, which naturally pushes them into Pro or Family tiers.

### 2. B2B FMS Licensing ($8-10/caregiver/month)

- FMS companies pay per caregiver, enterprise invoicing
- No App Store cut, no affiliate commission — 85%+ net margin
- White-label option: "PPL EVV, powered by CareLog"
- One PPL contract (200K caregivers x $9/mo) = $21.6M ARR alone

### 3. Appreciation (Indirect — Subscription Offsetter)

- After a visit notification, family members see a "Send Appreciation" button
- Preset amounts: $10, $25, $50, or custom
- Routes to Venmo/Zelle/PayPal/Cash App — CareLog NEVER touches the money
  (no money transmitter license required)
- One $25 appreciation per month covers the Basic subscription
- This removes price friction and dramatically reduces churn

---

## Financial Projections

| Year | B2C Revenue | B2B Revenue | Total    | Net Profit |
|------|------------|------------|----------|-----------|
| 1    | $280K      | —          | $280K    | $175K     |
| 2    | $1.4M      | $162K      | $1.56M   | $1.1M     |
| 3    | $3.8M      | $2.2M      | $6.0M    | $4.2M     |
| 5    | $10.5M     | $13M       | $23.5M   | $16.5M    |

Key assumptions: Family portal cuts monthly churn from 5% to 3%. Appreciation
removes price friction for better conversion. Higher ARPU from Pro upgrades.
Year 5 target: ~35K B2C users, ~120K B2B caregivers across US + AU + UK.

---

## International Expansion

### Australia (NDIS) — Month 13

- NDIA published REST API (Digital Partnership Program) — auto-submit supported
- 500K+ NDIS participants, English-speaking, zero B2C competitors
- Same patterns as US APIs, PRODA auth, 6-10 weeks build time
- Family portal works identically on existing notification infrastructure

### United Kingdom — Month 19

- PARTIAL auto-submit: PDF timesheet generator for 348 local councils
- 450K+ Direct Payment recipients under NHS Care Act
- PDF generator + GDPR compliance layer, 3-5 weeks build time
- Family portal is the key differentiator in UK market

---

## Build Phases (Technical Roadmap)

### Phase 1: Core App (Months 1-3)
- iOS + Android via React Native (Expo)
- GPS clock in/out capturing all 6 EVV data points
- Multi-recipient onboarding flow
- HIPAA compliance: AES-256 encryption + audit logging
- App Store deployment

### Phase 2: US Auto-Submit (Months 3-7)
- HHAeXchange integration (FL first, then 8 states)
- Sandata eMBS integration (OH first, then 20 states)
- ProviderOne (WA) + CalEVV/CDSS (CA)
- Retry queue with exponential backoff for failed submissions
- Error handling and offline-first resilience

### Phase 3: Family Layer + International (Months 8-13)
- Family portal with push notifications
- Visit notes + photo uploads
- Send Appreciation flow (Venmo/PayPal/Zelle/Cash App deep links)
- Medication log during visits
- NDIA API integration (Australia)
- UK PDF generator + GDPR compliance layer

### Phase 4: B2B Tools (Months 12-16)
- FMS Admin Dashboard (real-time EVV compliance rates, error queue)
- Admin Enrollment API for bulk caregiver onboarding
- White-label branding layer
- Weekly compliance reports (automated)
- Enterprise invoicing system

### Phase 5: Scale (Months 16+)
- Tellus + Optum integration (6 additional states)
- AU/UK FMS business development
- Community features (caregiver forums, weekly calls)
- Annual compliance updates as regulations change
- Additional FMS contract acquisition

---

## The Team

### Olivier — Co-Founder / CEO
- Business, Growth & B2B Sales
- Serial entrepreneur who scaled Gaia to hundreds of thousands of paying subscribers
- Deep expertise in subscription pricing, churn reduction, ARPU optimization, and
  affiliate program design
- Personally runs B2B FMS outreach starting Month 18
- Owns GTM strategy: TikTok/Reels organic, community, affiliate + family viral loop

### Craig — Co-Founder / CTO
- Architecture, Build & Execution
- Builds the state API integrations, family portal, appreciation flow, and B2B tools
- Full-stack mobile: iOS + Android, React Native, single codebase
- HIPAA compliance: AES-256 encryption, audit logging, BAAs
- State aggregator APIs (the technical moat)
- Family portal + Appreciation flow (the retention moat)

---

## Brand Voice & Tone Guidelines

### Core Message
"Get Paid. Stay Compliant. Feel Seen."

This tagline captures the three layers of value:
1. **Get Paid** — EVV compliance = the caregiver actually receives their paycheck
2. **Stay Compliant** — auto-submit handles the government paperwork invisibly
3. **Feel Seen** — the family portal and appreciation feature make caregivers feel valued

### Voice Principles

- **Warm, not clinical.** We're talking to exhausted family members, not nurses.
  "Mom's visit is complete" not "Service event #4521 has been processed."
- **Confident, not corporate.** We save people money and reduce their stress.
  Don't hedge. "CareLog pays for itself" is a real claim.
- **Simple, not dumbed down.** Our users are smart but not technical.
  "Auto-submitted to Medicaid" not "POST request to aggregator API endpoint."
- **Human names, not IDs.** Always "Mom (Dorothy)" not "Recipient #12345."
  The app deals in relationships, not database records.
- **Action-oriented.** Every screen should have a clear primary action.
  The dashboard's hero is the Clock In button. The family portal's hero is
  Send Appreciation. Nothing is passive.

### Words We Use
- "Visit" (not "shift" or "service event")
- "Clock in / Clock out" (not "start/stop service")
- "Care recipient" or their name (not "consumer" or "client")
- "Family member" or "family viewer" (not "authorized representative")
- "Appreciation" (not "tip" or "payment")
- "Auto-submit" (not "transmit" or "upload")
- "Compliant" (not "verified" or "validated")

### Words We Avoid
- "Patient" (too clinical — these are family members)
- "Employee" (caregivers are independent, not employed by CareLog)
- "Claim" (that's Medicaid jargon — say "visit" or "submission")
- "Error" in user-facing copy (say "needs attention" or "retry needed")
- "Data" when talking to users (say "visit details" or "information")

---

## Psychological Architecture

CareLog's product design is built on specific behavioral psychology principles:

### Acquisition Trigger: Compliance Anxiety
Caregivers live in fear of losing income to EVV errors. CareLog's acquisition
message targets this fear directly: "Stop losing $1,500/year to EVV errors."
The green checkmark after auto-submit is an anxiety-relief dopamine hit.

### Retention Mechanism 1: Family Embedding
Once a family member is watching visits through the portal, the caregiver
cannot switch to a competitor without losing that family connection. The
family member would need to re-onboard. This creates invisible switching costs.

### Retention Mechanism 2: Appreciation as Price Offset
When a sibling sends $25 appreciation after a visit, it psychologically
reframes the $19.99 subscription as "free" — the family is paying for the
tool. This removes price sensitivity as a churn driver entirely.

### Retention Mechanism 3: Identity Integration
CareLog positions caregivers as professionals doing important work, not
invisible labor. Visit logs, task completion stats, and appreciation messages
create an identity around "I am a professional caregiver who uses CareLog."
Leaving CareLog means giving up that identity.

### Viral Loop: Family-to-Caregiver
Family member downloads app → sees appreciation feature → tells their
sibling (who is also a caregiver) to get CareLog → new caregiver subscribes
→ invites THEIR family members. This is free, organic growth.

---

## Competitive Landscape

| Company        | Model | Users      | CareLog Advantage |
|----------------|-------|------------|-------------------|
| HHAeXchange    | B2B   | Agencies   | No B2C product. Built for agencies, not families. |
| Sandata/eMBS   | B2B   | Agencies   | Same — agency-first. No family portal. |
| Time4Care      | B2B   | Agencies   | State-contracted, not available to individuals. |
| CareLog        | B2C+B2B | Individuals + FMS | ONLY consumer product. Family portal. Appreciation. |

There are ZERO direct B2C competitors. Every existing EVV tool is built for
agencies. CareLog is the first and only product built for the individual
caregiver and their family.

---

## Key Metrics to Track

- **EVV Submission Rate**: % of clock-outs that successfully auto-submit (target: 99%+)
- **Monthly Churn**: Target 3% with family portal (industry avg without: 5-7%)
- **ARPU**: Average revenue per user across tiers (target: $27 blended)
- **Family Portal Adoption**: % of subscribers with 1+ family viewer connected
- **Appreciation Rate**: % of visits that receive an appreciation from family
- **Pro/Family Upgrade Rate**: % of Basic users upgrading (target: 24% = 2+ recipients)
- **Affiliate Referral Rate**: Active referrers as % of subscriber base
- **B2B Pipeline**: Number of FMS companies in outreach/pilot/contract stages

---

## Summary for Agents

If you are an AI agent working on this codebase, here is what you need to know:

1. **This is a compliance tool first.** If the EVV auto-submit breaks, caregivers
   don't get paid. Reliability > features. Always.

2. **The family portal is the business moat.** It's not a nice-to-have — it's the
   reason churn is 3% instead of 7%. Treat it as a first-class feature.

3. **Appreciation never touches money.** CareLog deep-links to Venmo/Zelle/PayPal.
   We do NOT handle transactions. No money transmitter license needed.

4. **HIPAA compliance is non-negotiable.** All data at rest uses AES-256. All API
   calls use TLS 1.3. Audit logging on every data access. PHI (Protected Health
   Information) never appears in logs, analytics, or error reports.

5. **The design is dark-first.** Navy background (#0B1622), teal primary (#00D4AA).
   This matches the pitch deck and positions CareLog as premium, not clinical.

6. **User-facing copy must be warm and human.** See the Voice Principles section.
   Never use clinical/corporate language. These are family members caring for
   their parents, not enterprise IT admins.

7. **Every feature earns its place or gets cut.** This is from the pitch deck and
   it's a real principle. Don't add features speculatively. Everything must serve
   one of: compliance, family connection, or revenue.

8. **The codebase is React Native (Expo) with TypeScript.** Single codebase for
   iOS + Android. Expo Router for navigation. Zustand for state. No Redux, no
   MobX, no class components.

---

*CareLog — Build smart. Print on automatic.*
*Confidential — April 2026*
