# CareLog — Domain Glossary

> Every specialized term used in the CareLog codebase and documentation.
> Read this if you encounter unfamiliar acronyms or industry-specific language.

---

## Core Concepts

### EVV (Electronic Visit Verification)
A federally mandated system (21st Century Cures Act, 2016) requiring electronic
documentation of home care visits. Every visit must capture 6 specific data points
and submit them to state Medicaid. If EVV data is not submitted correctly, the
caregiver does not get paid. CareLog automates this entire process.

### The 6 EVV Data Points
1. Type of service (e.g., Personal Care Services / PCS)
2. Individual receiving service (care recipient's Medicaid ID)
3. Individual providing service (caregiver's provider ID)
4. Date of service
5. Time service begins (clock-in)
6. Time service ends (clock-out)

### Auto-Submit
CareLog's core technical feature. When a caregiver clocks out, CareLog
automatically POSTs all 6 EVV data points to the appropriate state aggregator
API. The caregiver sees a green checkmark. The family gets notified. The
caregiver gets paid. One tap. Done.

### Aggregator
A company that operates the EVV submission infrastructure for multiple states.
Rather than each state building its own API, states contract with aggregators.
CareLog connects to 4 aggregators to cover 37 states.

### Open-Model State
A state that allows third-party apps (like CareLog) to submit EVV data via
published APIs. 37 US states are open-model. The remaining 13 are closed-model
(state-mandated system only, CareLog cannot operate there).

### Care Recipient
The person receiving care — typically an aging parent, disabled spouse, or
family member. In our UI, we use their name ("Mom (Dorothy)") not their ID.
In the database, they have a Medicaid recipient ID and a linked provider ID.

### Caregiver (Paid Family Caregiver)
The person providing care and using CareLog. They are typically a family member
(daughter, son, spouse) who is paid by state Medicaid to provide personal care
services. They are NOT medical professionals and NOT employed by CareLog.

### Family Member / Family Viewer
A relative of the care recipient who uses the Family Portal to monitor visits.
They can see real-time notifications, task logs, photos, and send appreciation.
They do NOT pay for CareLog — their access is free with every tier.

### Appreciation
A voluntary payment from a family member to a caregiver, routed through
Venmo/Zelle/PayPal/Cash App. CareLog NEVER handles the money — we just
provide the deep link. This feature serves two purposes: it makes the
caregiver feel valued (retention) and it offsets the subscription cost
(reduces churn from price sensitivity).

---

## Business & Financial Terms

### FMS (Financial Management Services)
Companies that act as intermediaries between state Medicaid programs and
individual caregivers. They handle payroll, tax withholding, and compliance
for self-directed care programs. Examples: PPL (Public Partnerships),
Palco, Maximus, Acumen Fiscal Agent, Allied Community Resources.

### PPL (Public Partnerships LLC)
The largest FMS company in the US. Manages 200K+ caregivers in the NY CDPAP
program alone, plus operations in CO, PA, and other states. A single PPL
contract at $9/caregiver/month = $21.6M ARR. This is CareLog's biggest B2B target.

### CDPAP (Consumer Directed Personal Assistance Program)
New York State's self-directed care program. The largest in the US with 200K+
caregivers. Managed primarily by PPL. A key target market for CareLog.

### CDASS (Consumer Directed Attendant Support Services)
Colorado's self-directed care program. ~72K caregivers, managed by Palco.
This is the planned pilot market for CareLog's B2B channel.

### ARPU (Average Revenue Per User)
CareLog's blended target is $27/month across all tiers. Basic ($19.99) is 76%
of users, Pro ($29.99) is 18%, Family ($44.99) is 6%.

### B2C vs B2B
- B2C: Individual caregivers paying $19.99-$44.99/month directly
- B2B: FMS companies paying $8-10/caregiver/month via enterprise contracts
  (no App Store cut, no affiliate commission, 85%+ net margin)

### White-Label
B2B option where CareLog is branded as the FMS company's own tool.
Example: "PPL EVV, powered by CareLog." Creates stickier contracts.

---

## Regulatory & Compliance Terms

### 21st Century Cures Act
Federal law (2016) that mandates EVV for all Medicaid-funded personal care
and home health services. Creates permanent demand — this law does not expire.

### Medicaid
Federal-state health insurance program for low-income individuals. Funds the
personal care services that CareLog's users provide. Each state administers
its own Medicaid program with different rules.

### HIPAA (Health Insurance Portability and Accountability Act)
Federal law protecting patient health information. CareLog must comply because
we handle PHI (Protected Health Information) including care recipient names,
Medicaid IDs, and visit records. Requirements include AES-256 encryption,
audit logging, and BAAs with third-party services.

### PHI (Protected Health Information)
Any health-related data that can identify an individual. In CareLog's context:
care recipient names, Medicaid IDs, visit records, task logs, medication logs,
and photos from visits. PHI must NEVER appear in logs, analytics, or error reports.

### BAA (Business Associate Agreement)
A legal agreement required by HIPAA between a covered entity and any third-party
service that handles PHI. CareLog needs BAAs with cloud providers, analytics
tools, crash reporting services, etc.

### Hard Denial
When a state Medicaid program permanently rejects an EVV claim. Unlike soft
denials (which can be corrected and resubmitted), hard denials mean the
caregiver loses that income permanently. Now enforced in 15+ states.

---

## Aggregator-Specific Terms

### HHAeXchange
EVV aggregator covering 8 states (FL, NY, NJ, MA, MD, VA, GA, NC).
REST API with OAuth2 authentication. CareLog's first integration target,
starting with Florida.

### Sandata eMBS
EVV aggregator covering 20 states (OH, PA, TX, IL, MI, and 15 others).
The largest single aggregator by state coverage. REST API with OAuth2.

### Tellus / Optum
EVV aggregator covering 6 states (AZ, OR, NV, HI, ME, NH).
REST API with API key authentication.

### ProviderOne
Washington State's EVV system. REST API with certificate-based authentication.
Combined with CalEVV/CDSS (California) to cover 3 states (WA, CA, CO).

### CalEVV / CDSS
California's EVV system operated by the Department of Social Services.
REST API with OAuth2.

---

## International Terms

### NDIS (National Disability Insurance Scheme)
Australia's disability support program. 500K+ participants. The NDIA
(National Disability Insurance Agency) publishes a REST API via the Digital
Partnership Program. CareLog's first international market (Month 13).

### PRODA (Provider Digital Access)
Australia's authentication system for accessing NDIA APIs. Similar to OAuth2.

### Direct Payments (UK)
The UK equivalent of US self-directed care. 450K+ recipients under the NHS
Care Act. Unlike the US, the UK does not have centralized EVV APIs — CareLog
generates PDF timesheets for submission to 348 local councils.

### GDPR (General Data Protection Regulation)
EU/UK data protection law. CareLog's UK version must comply with GDPR
requirements for data storage, consent, right to deletion, and cross-border
data transfers.

---

## Technical Terms (CareLog-Specific)

### Clock In / Clock Out
The primary user action. Tapping "Clock In" captures GPS + timestamp and starts
the visit timer. Tapping "Clock Out" captures GPS + timestamp, stops the timer,
and triggers auto-submit of all 6 EVV data points.

### Retry Queue
When an EVV auto-submit fails (network error, aggregator timeout), the visit
data is stored locally and retried with exponential backoff (1s, 2s, 4s, 8s...).
This ensures offline-first resilience — caregivers in areas with poor connectivity
can still clock in/out and the data will submit when connectivity returns.

### Family Portal
The free companion feature available to family members. Pushes real-time visit
data (arrival/departure alerts, task logs, photos) to connected family members.
Built on top of the same EVV data the caregiver already captures — zero extra
data entry, zero extra infrastructure.

### Send Appreciation
A deep-link feature in the Family Portal. After receiving a visit notification,
family members can tap preset amounts ($10, $25, $50) which opens their
Venmo/Zelle/PayPal app with the caregiver pre-filled as recipient. CareLog
never handles the money.

### Subscription Tiers

| Tier   | Code     | Price     | Recipients | Family Viewers | Color   |
|--------|----------|-----------|------------|----------------|---------|
| Basic  | `basic`  | $19.99/mo | 1          | 1              | Teal    |
| Pro    | `pro`    | $29.99/mo | 2          | 3              | Green   |
| Family | `family` | $44.99/mo | Unlimited  | Unlimited      | Purple  |

### EVV Status Values

| Status       | Code          | Color   | Meaning |
|-------------|---------------|---------|---------|
| Idle         | `idle`        | Gray    | No active visit |
| Clocked In   | `clocked_in`  | Teal    | Visit in progress, timer running |
| Clocked Out  | `clocked_out` | Orange  | Visit ended, auto-submit in progress |
| Submitted    | `submitted`   | Green   | All 6 EVV points accepted by Medicaid |
| Error        | `error`       | Red     | Submission failed, queued for retry |

### Task Categories

Tasks logged during a visit fall into these categories:
- `personal_care` — Bathing, grooming, dressing, toileting
- `meals` — Meal preparation and feeding assistance
- `medication` — Medication reminders and administration logging
- `mobility` — Transfer assistance, walking support, wheelchair
- `companionship` — Social interaction, reading, activities
- `other` — Housekeeping, errands, transportation

---

*CareLog — Build smart. Print on automatic.*
