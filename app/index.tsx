/**
 * Entry point — routes to auth or main tabs
 */
import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export default function Index() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isOnboarded = useAppStore((s) => s.isOnboarded);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!isOnboarded) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
