/**
 * Entry point — routes to landing, auth, or main tabs
 */
import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export default function Index() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isOnboarded = useAppStore((s) => s.isOnboarded);

  // Unauthenticated: show landing page
  if (!isAuthenticated) {
    return <Redirect href="/(marketing)" />;
  }

  // Authenticated but not onboarded: onboarding flow
  if (!isOnboarded) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  // Fully authenticated and onboarded: main app
  return <Redirect href="/(tabs)" />;
}
