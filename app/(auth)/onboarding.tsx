/**
 * CareLog Onboarding — Add first care recipient
 * Provider ID + Recipient ID setup for EVV
 */
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';

export default function OnboardingScreen() {
  const [providerID, setProviderID] = useState('');
  const [recipientID, setRecipientID] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [state, setState] = useState('');
  const setOnboarded = useAppStore((s) => s.setOnboarded);

  const handleComplete = () => {
    setOnboarded(true);
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[Typography.sectionLabel, { color: Colors.primary }]}>SETUP</Text>
      <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 8 }]}>
        Add Your Care Recipient
      </Text>
      <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 8, marginBottom: 32 }]}>
        We'll validate these against your state's Medicaid API to enable auto-submit.
      </Text>

      <Card borderColor={Colors.primary}>
        <View style={styles.field}>
          <Text style={styles.label}>Recipient Name</Text>
          <TextInput
            style={styles.input}
            value={recipientName}
            onChangeText={setRecipientName}
            placeholder="e.g. Mom (Dorothy)"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Provider ID</Text>
          <TextInput
            style={styles.input}
            value={providerID}
            onChangeText={setProviderID}
            placeholder="From your FMS enrollment"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Recipient ID</Text>
          <TextInput
            style={styles.input}
            value={recipientID}
            onChangeText={setRecipientID}
            placeholder="Medicaid recipient number"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            value={state}
            onChangeText={setState}
            placeholder="e.g. CO, FL, OH"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="characters"
          />
        </View>
      </Card>

      <Button
        title="Validate & Continue"
        onPress={handleComplete}
        size="lg"
        style={{ marginTop: 24 }}
      />

      <Button
        title="Skip for Now"
        onPress={handleComplete}
        variant="ghost"
        style={{ marginTop: 12 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Layout.spacing.xl,
    paddingTop: 80,
  },
  field: {
    marginBottom: Layout.spacing.lg,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    color: Colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border.card,
  },
});
