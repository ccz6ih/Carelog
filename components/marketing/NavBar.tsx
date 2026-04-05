/**
 * Marketing Navigation Bar
 * Sticky header with logo, nav links, and login/signup CTAs
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Button from '@/components/ui/Button';

interface NavBarProps {
  onLoginPress: () => void;
  onSignUpPress: () => void;
}

export default function NavBar({ onLoginPress, onSignUpPress }: NavBarProps) {
  const handleNavigate = (path: string) => {
    if (Platform.OS === 'web') {
      // Use router for navigation
      router.push(path as any);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Pressable onPress={() => handleNavigate('/')} style={styles.logoContainer}>
          <LinearGradient
            colors={['#00D4AA', '#0B9488'] as const}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoMark}
          >
            <Text style={styles.logoText}>CL</Text>
          </LinearGradient>
          <Text style={styles.logoName}>CareLog</Text>
        </Pressable>

        {/* Nav Links (web only) */}
        {Platform.OS === 'web' && (
          <View style={styles.navLinks}>
            <Pressable onPress={() => handleNavigate('/about')}>
              <Text style={styles.navLink}>About</Text>
            </Pressable>
            <Pressable onPress={() => handleNavigate('/pricing')}>
              <Text style={styles.navLink}>Pricing</Text>
            </Pressable>
          </View>
        )}

        {/* Auth CTAs */}
        <View style={styles.authButtons}>
          <Pressable onPress={onLoginPress} style={styles.loginButton}>
            <Text style={styles.loginText}>Log In</Text>
          </Pressable>
          <Button
            title="Sign Up"
            onPress={onSignUpPress}
            variant="primary"
            size="sm"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: `${Colors.background}E6`,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    ...Typography.body,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  logoName: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontSize: 20,
  },
  navLinks: {
    flexDirection: 'row',
    gap: Layout.spacing.xl,
  },
  navLink: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  loginButton: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  loginText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});
