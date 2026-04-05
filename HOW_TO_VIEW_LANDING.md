# 🎨 How to View Your New Landing Page

## Quick Start

### 1. Start the Development Server
```bash
npx expo start
```

### 2. View on Web (Recommended for Landing Page)
Press **`w`** in the terminal to open in your browser

The landing page will appear at: `http://localhost:8081`

### 3. Navigate Between Pages
Since you're not logged in, you'll automatically see the landing page.

**Available Routes:**
- `/` — Main landing page (Hero, Features, How It Works, Social Proof)
- `/about` — About page (Mission, Problem, Solution, Values)
- `/pricing` — Pricing tiers with FAQ

## What You'll See

### Landing Page (`/`)
```
┌─────────────────────────────────────┐
│ [CareLog Logo]    About  Pricing   │ ← Sticky navbar
│                    Log In  [Sign Up]│
├─────────────────────────────────────┤
│                                     │
│        [Caregiver Icon]             │ ← Hero section
│   Get Paid. Stay Compliant.        │   (gradient background)
│        Feel Seen.                   │
│                                     │
│  [Start Free Trial] [Learn More]   │
├─────────────────────────────────────┤
│  Built for Caregivers, Not Agencies│ ← Section title
│                                     │
│  [Auto-Submit EVV] [Family Portal]  │ ← 3 feature cards
│       [Get Paid Right]              │
├─────────────────────────────────────┤
│         How It Works                │ ← Timeline section
│  ① Sign Up                          │
│  ② Clock In                         │
│  ③ Provide Care                     │
│  ④ Clock Out                        │
│  ⑤ Get Paid                         │
├─────────────────────────────────────┤
│      12,000+ caregivers             │ ← Social proof
│         ★★★★★ 4.8/5                 │
├─────────────────────────────────────┤
│  HHAeXchange  Sandata  Tellus...    │ ← Aggregator trust
├─────────────────────────────────────┤
│ Ready to simplify EVV compliance?   │ ← Final CTA
│    [Start Your Free Trial]          │
├─────────────────────────────────────┤
│ CareLog | Product | Company | Legal│ ← Footer
└─────────────────────────────────────┘
```

### About Page (`/about`)
- Hero with mission statement
- Problem stats (53M caregivers, 37 states)
- Solution cards (6 features)
- Values section (4 values)

### Pricing Page (`/pricing`)
- 3 pricing tiers (Basic, Pro, Family)
- "Most Popular" badge on Pro
- Feature comparison
- FAQ accordion (6 questions)

## Testing the Experience

### As a New User
1. **Land on homepage** → See compelling value props
2. **Click "Start Free Trial"** → Login modal appears
3. **Fill out signup form** → Creates account
4. **Complete onboarding** → Add recipient info
5. **Redirected to app** → See dashboard

### As a Returning User
1. **Land on homepage** → Click "Log In"
2. **Enter credentials** → Modal login
3. **Redirected to app** → See your active visit/dashboard

## Visual Customization

### Want to Adjust Colors?
Edit `constants/Colors.ts`:
```typescript
primary: '#00D4AA',      // Teal (change to your brand)
accent: {
  orange: '#FF9F1C',     // Highlights
  purple: '#9B72E8',     // Pro tier
  pink: '#FF4069',       // Family tier
}
```

### Want Different Fonts?
Edit `constants/Typography.ts`:
```typescript
fontFamily: Platform.select({
  web: 'Your Custom Font Stack',
  default: undefined,
});
```

### Want to Change Hero Text?
Edit `components/marketing/Hero.tsx`:
```tsx
<Text style={styles.headline}>
  Your Custom Headline Here
</Text>
```

## Adding Graphics/Photos

### Hero Background
1. Export gradient mesh as PNG/SVG
2. Place in `assets/images/` 
3. Import in `Hero.tsx`:
```tsx
import { ImageBackground } from 'react-native';
<ImageBackground source={require('@/assets/images/hero-bg.png')}>
  {/* hero content */}
</ImageBackground>
```

### Screenshots
1. Take screenshots of your app (Dashboard, Visits, Family)
2. Optimize as WebP (for web) or PNG
3. Add to landing page sections:
```tsx
<Image 
  source={require('@/assets/images/dashboard-screenshot.png')} 
  style={{ width: 600, height: 400 }}
/>
```

## Mobile Testing

### iOS Simulator
```bash
npx expo start
# Then press 'i' in terminal
```

### Android Emulator
```bash
npx expo start
# Then press 'a' in terminal
```

### Physical Device
1. Install Expo Go app from App/Play Store
2. Scan QR code from terminal
3. Landing page will load (may need to dismiss auth modal on initial load)

## Common Issues & Fixes

### "Modal won't close"
- Check state management in login modal
- Ensure `setShowLoginModal(false)` is called

### "Page looks broken on mobile"
- Check `Platform.OS === 'web'` conditionals
- Verify responsive breakpoints in styles

### "Icons not showing"
- Icons are SVG-based, should work everywhere
- Check that `@/components/icons/CareIcons` import is correct

### "Navigation doesn't work"
- Ensure `expo-router` is properly configured
- Check `app.json` for routing setup

## Next: Add Stripe Checkout

Ready to wire up payments? See **LANDING_COMPLETE.md** section "Next Steps (Stripe Integration)" for full guide.

**Quick version:**
1. `npm install @stripe/stripe-react-native`
2. Create Supabase Edge Function for checkout
3. Update `pricing.tsx` handleSelectTier()
4. Add webhook handler
5. Test with Stripe test cards

---

## Need Help?

**Documentation:**
- `LANDING.md` — Full architecture guide
- `LANDING_COMPLETE.md` — Implementation summary
- `CLAUDE.md` — Project conventions

**Key Files:**
- `app/(marketing)/index.tsx` — Landing page
- `app/(marketing)/about.tsx` — About page
- `app/(marketing)/pricing.tsx` — Pricing page
- `components/marketing/` — Reusable components

**Contact:** Check the footer links in your app 😊

---

**You're all set!** Start the dev server and see your beautiful new landing page. 🚀
