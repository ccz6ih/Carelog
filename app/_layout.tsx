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
          setUser({
            id: session.user.id,
            firstName: meta?.first_name || '',
            lastName: meta?.last_name || '',
            email: session.user.email || '',
            tier: 'basic',
            recipients: [],
            activeVisit: null,
          });

          // Check if onboarded
          const { data: recipients } = await supabase
            .from('recipients')
            .select('id')
            .eq('caregiver_id', session.user.id)
            .limit(1);
          setOnboarded(!!(recipients && recipients.length > 0));
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
