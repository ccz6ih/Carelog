/**
 * CareLog Root Layout
 * Dark theme, auth listener, splash screen
 */
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Colors from '@/constants/Colors';
import { supabase } from '@/services/supabase';
import { useAppStore } from '@/store/useAppStore';
import ErrorBoundary from '@/components/ErrorBoundary';
import { registerForPushNotifications } from '@/services/notifications';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setUser, setOnboarded, logout } = useAppStore();

  useEffect(() => {
    // Hide splash after brief delay
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);

    // Listen for auth state changes (session restore, login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const meta = session.user.user_metadata;

          // Load profile to get role and tier
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_role, tier, is_onboarded')
            .eq('id', session.user.id)
            .single();

          const role = (profile?.user_role as 'caregiver' | 'family') || 'caregiver';

          setUser({
            id: session.user.id,
            firstName: meta?.first_name || '',
            lastName: meta?.last_name || '',
            email: session.user.email || '',
            role,
            tier: profile?.tier || 'basic',
            recipients: [],
            activeVisit: null,
          });

          // Register for push notifications
          const pushToken = await registerForPushNotifications();
          if (pushToken) {
            // Save token to profile for backend push sending
            await supabase
              .from('profiles')
              .update({ push_token: pushToken })
              .eq('id', session.user.id);
          }

          if (role === 'family') {
            // Link any pending family invites to this user
            await supabase
              .from('family_members')
              .update({ user_id: session.user.id, invite_accepted: true })
              .eq('email', session.user.email)
              .is('user_id', null);
            setOnboarded(true);
          } else {
            // Check if this caregiver email has a family invite (they might be both)
            const { data: pendingInvite } = await supabase
              .from('family_members')
              .select('id')
              .eq('email', session.user.email)
              .is('user_id', null);
            if (pendingInvite && pendingInvite.length > 0) {
              await supabase
                .from('family_members')
                .update({ user_id: session.user.id, invite_accepted: true })
                .eq('email', session.user.email)
                .is('user_id', null);
            }
            const { data: recipients } = await supabase
              .from('recipients')
              .select('id')
              .eq('caregiver_id', session.user.id)
              .limit(1);
            setOnboarded(profile?.is_onboarded || !!(recipients && recipients.length > 0));
          }
        } else if (event === 'SIGNED_OUT') {
          logout();
        }
      }
    );

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
            animation: 'fade',
          }}
        />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
