# CareLog Landing Page Architecture
**Modern Pre-Authentication Experience — 2026 Edition**

## Overview
The landing experience positions CareLog as the essential tool for paid family caregivers navigating EVV compliance. Clinical precision meets warm, human-centered design.

## Design Philosophy
- **Clinical meets Caring:** Professional healthcare aesthetic with warm, approachable illustrations
- **Trust through Transparency:** Clear value props, no hidden costs, HIPAA messaging front & center
- **Inclusive by Design:** Appeals to 30-70 age demographic, caregivers of all backgrounds
- **2026 Modern:** Subtle glassmorphism, smooth animations, responsive across all devices
- **Conversion-Focused:** Clear CTAs, minimal friction from landing → signup → value

## Site Structure

```
/                       Landing (Hero, Features, How It Works, Social Proof, CTA)
/about                  About (Mission, Team, Why We Built This)
/pricing                Pricing Tiers (Basic, Pro, Family) + Stripe checkout
/login                  Existing login/signup flow (enhanced)
```

## Page 1: Landing Page (`app/(marketing)/index.tsx`)

### Hero Section
**Headline:** "Get Paid, Stay Compliant, Feel Seen"
**Subhead:** "The EVV compliance platform built for paid family caregivers. Clock in, auto-submit to Medicaid, and help your family see the care you provide."

**Visual:** Hand-drawn illustration of caregiver embracing recipient (from IconCaregiver), overlaid on a subtle gradient mesh background

**CTAs:**
- Primary: "Start Free Trial" (→ signup modal)
- Secondary: "See How It Works" (smooth scroll to next section)

### Value Props (3 Cards)
1. **Auto-Submit EVV** — "Clock in, clock out. We handle the 6 EVV data points and submit to your state Medicaid aggregator automatically."
   - Icon: IconVisit
   - Badge: "37 States Supported"

2. **Family Portal** — "Share your care journey. Family members see real-time updates and can send appreciation directly to you."
   - Icon: IconHeart
   - Badge: "Stay Connected"

3. **Get Paid Right** — "EVV compliance means no payment delays. Track earnings, export reports, stay audit-ready."
   - Icon: IconComfort
   - Badge: "HIPAA Compliant"

### How It Works (Timeline)
1. **Sign Up** — "Add your care recipient and Medicaid provider info (2 min)"
2. **Clock In** — "GPS-verified check-in with one tap"
3. **Provide Care** — "Log tasks, take photos, add notes"
4. **Clock Out** — "We auto-submit EVV to your state aggregator"
5. **Get Paid** — "Compliant visits = on-time payments"

### Social Proof
- "Join 12,000+ family caregivers staying compliant"
- 4.8★ rating (placeholder, will be real App Store rating)
- "Supporting caregivers in FL, NY, CA, TX, OH, PA + 31 more states"

### Aggregator Trust Bar
Logos/names: HHAeXchange, Sandata, Tellus, ProviderOne + CA-EVV

### Final CTA
Large card: "Ready to simplify EVV compliance?"
- Button: "Start Your Free Trial"
- Subtext: "No credit card required · 14-day free trial · Cancel anytime"

## Page 2: About Page (`app/(marketing)/about.tsx`)

### Mission Statement
"CareLog exists because family caregivers deserve better tools. You're navigating complex state regulations while providing essential care—often unpaid or underpaid. We built this to automate the compliance burden so you can focus on what matters: caring for your loved one."

### The Problem
- 53 million family caregivers in the U.S.
- 21st Century Cures Act mandates EVV for Medicaid personal care
- 37 states require EVV tracking (6 data points per visit)
- Caregivers face payment delays due to missing/incorrect EVV data
- Existing EVV tools are built for agencies, not individuals

### Our Solution
- Mobile-first app designed for family caregivers
- One-tap clock in/out with GPS verification
- Automatic EVV submission to state aggregators
- Family portal for transparency and appreciation
- HIPAA-compliant, secure, always-on support

### Team (Optional)
"Built by caregivers, healthcare technologists, and compliance experts who believe you shouldn't need a PhD to get paid for care work."

### Values
- **Caregiver-First:** Every feature decision starts with "does this help the caregiver?"
- **Compliance Without Complexity:** Regulations shouldn't require a law degree
- **Transparency:** You see exactly what data we collect and who we share it with
- **Family-Centered:** Care is a team sport—family members deserve visibility

## Page 3: Pricing Page (`app/(marketing)/pricing.tsx`)

### Tiers (Monthly Billing)

#### Basic — $19.99/mo
**"Essential EVV compliance for 1 caregiver"**
- ✓ Clock in/out with GPS
- ✓ Auto-submit to state aggregator
- ✓ Up to 2 care recipients
- ✓ Visit history & EVV status
- ✓ Email support
- **CTA:** "Start Free Trial"

#### Pro — $39.99/mo
**"Advanced features + priority support"**
- ✓ Everything in Basic
- ✓ Up to 5 care recipients
- ✓ Task logging & care plans
- ✓ Photo uploads
- ✓ Earnings analytics & export
- ✓ Compliance reports
- ✓ Priority email + chat support
- **CTA:** "Start Free Trial"

#### Family — $59.99/mo
**"For agencies or families with multiple caregivers"**
- ✓ Everything in Pro
- ✓ Unlimited care recipients
- ✓ Up to 5 caregiver accounts
- ✓ Real-time family notifications
- ✓ Multi-user dashboard
- ✓ Phone support
- ✓ Custom training
- **CTA:** "Contact Sales"

### FAQ Section
- "What states are supported?" → List of 37 states
- "Do I need special hardware?" → No, just your smartphone
- "How does auto-submit work?" → Explanation of aggregator integration
- "Is my data secure?" → HIPAA compliance, AES-256 encryption
- "Can I cancel anytime?" → Yes, no contracts

### Stripe Integration
- Stripe Checkout for Basic/Pro
- Typeform/Calendly link for Family (sales call)

## Page 4: Enhanced Login/Signup (`app/(marketing)/login.tsx`)

### Current State Enhancement
- Keep existing login/signup modal approach
- Add social proof above form ("Join 12,000+ caregivers")
- Add trust badges (HIPAA, SSL, state compliance logos)
- Improve error handling UX
- Add "Forgot Password?" flow
- Add "Continue with Google" option (future)

## Technical Implementation

### New Routing Structure
```
app/
  (marketing)/          # New group for public pages
    _layout.tsx         # Marketing nav header + footer
    index.tsx           # Landing page
    about.tsx           # About page
    pricing.tsx         # Pricing tiers
    login.tsx           # Login/signup (moved from (auth)/)
  (auth)/               # Keep for onboarding only
    _layout.tsx
    onboarding.tsx
  (tabs)/               # Existing authenticated app
    ...
  index.tsx             # Updated routing logic
```

### Components to Build
- `components/marketing/Hero.tsx` — Hero section with gradient mesh
- `components/marketing/FeatureCard.tsx` — 3-up value prop cards
- `components/marketing/Timeline.tsx` — How It Works visual timeline
- `components/marketing/PricingCard.tsx` — Tier comparison cards
- `components/marketing/Footer.tsx` — Links, legal, social
- `components/marketing/NavBar.tsx` — Top nav for marketing pages

### Styling Approach
- Use existing `constants/Colors.ts`, `Typography.ts`, `Layout.ts`
- Add new gradient variants for hero backgrounds
- Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)
- Glassmorphism via `backgroundColor` with alpha + `backdropFilter` (web only)

### Animation Strategy
- Scroll-triggered fade-ins for sections (react-native-reanimated)
- Smooth scroll for anchor links
- Hover states on cards (web)
- Parallax effect on hero illustration (subtle)

### Assets Needed
1. **Hero Illustration:** Large-format version of IconCaregiver (hands holding/embracing)
2. **Gradient Mesh Background:** Subtle teal/purple blend for hero
3. **Aggregator Logos:** HHAeXchange, Sandata, Tellus, ProviderOne (request permission or use text)
4. **Trust Badges:** HIPAA badge, SSL badge, state compliance icons
5. **Screenshots:** Dashboard, visit history, family portal (take from working app)

### Performance Considerations
- Lazy load below-fold sections
- Optimize images (WebP for web, optimized PNGs for native)
- Preload critical fonts
- Code-split marketing pages from app bundle

## Conversion Tracking
- Analytics events:
  - `landing_page_view`
  - `cta_click` (with location: hero, value_props, final)
  - `signup_started`
  - `signup_completed`
  - `pricing_page_view`
  - `tier_selected`

## SEO & Metadata
- Title: "CareLog — EVV Compliance for Family Caregivers"
- Description: "Clock in, auto-submit EVV to Medicaid, and get paid on time. CareLog is the mobile app built for paid family caregivers in 37 states."
- Keywords: EVV compliance, family caregiver, Medicaid EVV, HHAeXchange, Sandata
- OG image: Hero illustration with tagline

## Next Steps
1. Create `(marketing)` folder structure
2. Build landing page hero + value props
3. Wire Stripe checkout for pricing page
4. Add navigation between marketing pages
5. Update `app/index.tsx` routing to show landing for unauthenticated users
6. Test responsive layout on mobile/tablet/desktop
7. Add smooth scroll and entrance animations
8. Deploy updated web build
