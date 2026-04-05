# CareLog Deployment Guide

## Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli` (for native builds)
- Vercel CLI: `npm install -g vercel` (for web deployment)
- Supabase account with project created

## Environment Setup

### Local Development
Create `.env` in project root:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server-only (not exposed to client)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DB_PASSWORD=your-db-password
```

### Production (Vercel)
Set these in Vercel project settings → Environment Variables:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Database Setup

1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase/migrations/001_initial_schema.sql`
3. Verify tables created under Table Editor
4. Confirm RLS policies under Authentication → Policies

## Running Locally

```bash
# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Start web only
npx expo start --web

# Start on specific platform
npx expo start --ios
npx expo start --android
```

## Deploying to Vercel (Web)

CareLog's web build serves as both a landing page and a web-accessible version of the app.

### First-time setup
```bash
# Install Vercel CLI
npm install -g vercel

# Build for web
npx expo export --platform web

# Deploy
cd dist
vercel

# Follow prompts to link to your Vercel project
```

### Subsequent deploys
```bash
npx expo export --platform web && cd dist && vercel --prod
```

### Vercel Project Settings
- **Framework Preset:** Other
- **Build Command:** `npx expo export --platform web`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Native Builds (iOS/Android)

### Setup EAS
```bash
npm install -g eas-cli
eas login
eas build:configure
```

### Build for testing
```bash
# iOS simulator build
eas build --platform ios --profile development

# Android APK
eas build --platform android --profile development
```

### Build for production
```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

## CI/CD (GitHub Actions)

Future: Add `.github/workflows/deploy.yml` for automated:
- Lint + type-check on PR
- Web build + Vercel deploy on merge to main
- EAS build on release tags

## Troubleshooting

### "Missing asset" errors
Run `scripts/generate-assets.ps1` to create placeholder icons/splash.

### Supabase connection errors
- Verify `.env` values match Supabase dashboard → Settings → API
- Check RLS policies if getting empty results with valid auth

### Expo build failures
- Clear cache: `npx expo start --clear`
- Reset metro: `rm -rf node_modules/.cache`
- Reinstall: `rm -rf node_modules && npm install`
