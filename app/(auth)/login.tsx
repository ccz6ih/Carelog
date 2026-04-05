/**
 * CareLog Login Screen
 * Clean, trust-building. Dark background, teal accent.
 * Psychological anchor: "Get Paid. Stay Compliant. Feel Seen."
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
  const setUser = useAppStore((s) => s.setUser);
  const setOnboarded = useAppStore((s) => s.setOnboarded);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    const { data, error } = await api.auth.login(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Sign In Failed', error.message);
      return;
    }

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

      // Check if user has recipients (onboarded)
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
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    if (isSignUp && (!firstName || !lastName)) {
      Alert.alert('Missing Fields', 'Please enter your first and last name.');
      return;
    }

    if (!isSignUp) {
      setIsSignUp(true);
      return;
    }

    setLoading(true);
    const { data, error } = await api.auth.register({
      email,
      password,
      firstName,
      lastName,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
      return;
    }

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand */}
        <View style={styles.brand}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>CL</Text>
          </View>
          <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 16 }]}>
            CareLog
          </Text>
          <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 8, textAlign: 'center' }]}>
            Get Paid. Stay Compliant.{'\n'}Feel Seen.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {isSignUp && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="words"
                />
              </View>
            </>
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

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading && !isSignUp}
            size="lg"
            style={{ marginTop: 8 }}
          />

          <Button
            title={isSignUp ? 'Create Account' : 'Create Account'}
            onPress={handleSignUp}
            loading={loading && isSignUp}
            variant="outline"
            size="lg"
            style={{ marginTop: 12 }}
          />

          {isSignUp && (
            <Button
              title="Back to Sign In"
              onPress={() => setIsSignUp(false)}
              variant="ghost"
              style={{ marginTop: 4 }}
            />
          )}
        </View>

        {/* Trust signals */}
        <View style={styles.trust}>
          <Text style={[Typography.caption, { color: Colors.textMuted, textAlign: 'center' }]}>
            🔒 HIPAA Compliant · AES-256 Encrypted
          </Text>
          <Text style={[Typography.caption, { color: Colors.textMuted, textAlign: 'center', marginTop: 4 }]}>
            Your data never leaves your control
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Layout.spacing.xl,
  },
  brand: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xxl,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    ...Typography.h2,
    color: Colors.textInverse,
    fontWeight: '800',
  },
  form: {
    gap: Layout.spacing.md,
  },
  inputContainer: {
    gap: 6,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    color: Colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border.card,
  },
  trust: {
    marginTop: Layout.spacing.xxl,
    paddingTop: Layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.card,
  },
});
