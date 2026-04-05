/**
 * CareLog Onboarding — Add first care recipient
 * Provider ID + Recipient ID setup for EVV
 */
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/services/supabase';
import { getAggregatorForState } from '@/services/evv';

export default function OnboardingScreen() {
  const [providerID, setProviderID] = useState('');
  const [recipientID, setRecipientID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, setOnboarded } = useAppStore();

  const handleComplete = async () => {
    if (!firstName || !state) {
      Alert.alert('Missing Fields', 'Please enter at least the recipient name and state.');
      return;
    }

    const aggregatorConfig = getAggregatorForState(state);
    if (!aggregatorConfig) {
      Alert.alert(
        'State Not Supported',
        `EVV auto-submit is not yet available in ${state.toUpperCase()}. You can still use CareLog for visit tracking.`
      );
    }

    setLoading(true);

    // Determine aggregator key from state
    let aggregator: 'hhax' | 'sandata' | 'tellus' | 'providerone' | 'calevv' = 'hhax';
    if (aggregatorConfig) {
      const name = aggregatorConfig.name.toLowerCase();
      if (name.includes('sandata')) aggregator = 'sandata';
      else if (name.includes('tellus')) aggregator = 'tellus';
      else if (name.includes('providerone') || name.includes('calevv')) aggregator = 'providerone';
      else if (name.includes('calevv') || name.includes('cdss')) aggregator = 'calevv';
    }

    const { error } = await supabase.from('recipients').insert({
      caregiver_id: user?.id,
      first_name: firstName,
      last_name: lastName || '',
      relationship: relationship || 'family',
      provider_id: providerID || '',
      recipient_id: recipientID || '',
      state: state.toUpperCase().slice(0, 2),
      aggregator,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    // Mark profile as onboarded
    await supabase.from('profiles').update({ is_onboarded: true }).eq('id', user?.id);
    setOnboarded(true);
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
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
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="e.g. Dorothy"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="e.g. Smith"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Relationship</Text>
          <TextInput
            style={styles.input}
            value={relationship}
            onChangeText={setRelationship}
            placeholder="e.g. Mother, Father, Spouse"
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
            maxLength={2}
          />
        </View>
      </Card>

      <Button
        title="Validate & Continue"
        onPress={handleComplete}
        loading={loading}
        size="lg"
        style={{ marginTop: 24 }}
      />

      <Button
        title="Skip for Now"
        onPress={handleSkip}
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
