/**
 * CareLog Login Screen
 * Responsive, centered card on web, full-bleed on mobile
 * "Get Paid. Stay Compliant. Feel Seen."
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/services';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const setUser = useAppStore((s) => s.setUser);
  const setOnboarded = useAppStore((s) => s.setOnboarded);

  const showError = (msg: string) => {
    setError(msg);
    if (Platform.OS !== 'web') Alert.alert('Error', msg);
  };

  const handleLogin = async () => {
    if (!email || !password) { showError('Please enter your email and password.'); return; }
    setError('');
    setLoading(true);
    const { data, error: authError } = await api.auth.login(email, password);
    setLoading(false);

    if (authError) { showError(authError.message); return; }

    if (data.user) {
      const { data: profile } = await api.auth.me();
      const meta = profile.user?.user_metadata;
      setUser({
        id: data.user.id,
        firstName: meta?.first_name || '',
        lastName: meta?.last_name || '',
        email: data.user.email || '',
        tier: 'basic',
        recipients: [],
        activeVisit: null,
      });

      const { data: recipients } = await api.recipients.list();
      if (recipients && recipients.length > 0) {
        setOnboarded(true);
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/onboarding');
      }
    }
  };

  const handleSignUp = async () => {
    if (!isSignUp) { setIsSignUp(true); return; }
    if (!email || !password) { showError('Please enter your email and password.'); return; }
    if (!firstName || !lastName) { showError('Please enter your first and last name.'); return; }
    setError('');
    setLoading(true);
    const { data, error: authError } = await api.auth.register({ email, password, firstName, lastName });
    setLoading(false);

    if (authError) { showError(authError.message); return; }

    if (data.user) {
      setUser({
        id: data.user.id,
        firstName,
        lastName,
        email: data.user.email || '',
        tier: 'basic',
        recipients: [],
        activeVisit: null,
      });
      router.replace('/(auth)/onboarding');
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Brand */}
            <View style={styles.brand}>
              <LinearGradient
                colors={Colors.gradient.primary as unknown as string[]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoMark}
              >
                <Text style={styles.logoText}>CL</Text>
              </LinearGradient>
              <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 20 }]}>
                CareLog
              </Text>
              <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 6, textAlign: 'center', lineHeight: 20 }]}>
                Get Paid. Stay Compliant.{'\n'}Feel Seen.
              </Text>
            </View>

            {/* Error banner */}
            {error ? (
              <View style={styles.errorBanner}>
                <Text style={[Typography.bodySm, { color: Colors.error }]}>{error}</Text>
              </View>
            ) : null}

            {/* Form */}
            <View style={styles.form}>
              {isSignUp && (
                <View style={styles.nameRow}>
                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                      style={styles.input}
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="First"
                      placeholderTextColor={Colors.textMuted}
                      autoCapitalize="words"
                    />
                  </View>
                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                      style={styles.input}
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder="Last"
                      placeholderTextColor={Colors.textMuted}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry
                />
              </View>

              <View style={styles.buttons}>
                <Button
                  title={isSignUp ? 'Create Account' : 'Sign In'}
                  onPress={isSignUp ? handleSignUp : handleLogin}
                  loading={loading}
                  size="lg"
                  fullWidth
                />

                <Button
                  title={isSignUp ? 'Back to Sign In' : 'Create Account'}
                  onPress={isSignUp ? () => setIsSignUp(false) : handleSignUp}
                  variant="outline"
                  size="lg"
                  fullWidth
                />
              </View>
            </View>

            {/* Trust */}
            <View style={styles.trust}>
              <Text style={[Typography.micro, { color: Colors.textMuted, textAlign: 'center', letterSpacing: 1.5, textTransform: 'uppercase' }]}>
                HIPAA Compliant · AES-256 Encrypted
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.lg,
    ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}) as any,
  },
  card: {
    width: '100%',
    maxWidth: Layout.content.maxWidth,
    ...(Platform.OS === 'web' ? {
      backgroundColor: Colors.backgroundCard,
      borderRadius: Layout.radius.xl,
      borderWidth: 1,
      borderColor: Colors.border.card,
      padding: 40,
    } : {
      padding: Layout.spacing.md,
    }) as any,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoMark: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textInverse,
    letterSpacing: -0.5,
  },
  errorBanner: {
    backgroundColor: Colors.error + '15',
    borderRadius: Layout.radius.sm,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  form: {
    gap: Layout.spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  inputContainer: {
    gap: 6,
  },
  label: {
    ...Typography.micro,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.border.card,
  },
  buttons: {
    gap: Layout.spacing.sm,
    marginTop: Layout.spacing.sm,
  },
  trust: {
    marginTop: 28,
    paddingTop: Layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
  },
});
