/**
 * Entry point — routes based on auth state and user role
 * Caregivers → tabs, Family viewers → family dashboard
 */
import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export default function Index() {
  const { isAuthenticated, isOnboarded, user } = useAppStore();

  if (!isAuthenticated) {
    return <Redirect href="/(marketing)" />;
  }

  // Family viewers go to their read-only dashboard
  if (user?.role === 'family') {
    return <Redirect href="/family-dashboard" />;
  }

  if (!isOnboarded) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
