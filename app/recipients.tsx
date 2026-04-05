/**
 * Care Recipients — Manage the people you care for
 * Add, view, and edit care recipients with Medicaid/EVV details
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { IconCaregiver } from '@/components/icons/CareIcons';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';
import { getAggregatorForState } from '@/services/evv';

interface RecipientRow {
  id: string;
  first_name: string;
  last_name: string;
  relationship: string;
  provider_id: string;
  recipient_id: string;
  state: string;
  aggregator: string;
  is_active: boolean;
}

export default function RecipientsScreen() {
  const { userId, ready } = useAuth();
  const user = useAppStore((s) => s.user);
  const [recipients, setRecipients] = useState<RecipientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [providerId, setProviderId] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    if (ready && userId) loadRecipients();
    else if (ready && !userId) setLoading(false);
  }, [ready, userId]);

  async function loadRecipients() {
    try {
      const { data, error } = await supabase
        .from('recipients')
        .select('*')
        .eq('caregiver_id', userId!)
        .order('created_at', { ascending: true });
      console.log('[Recipients] Loaded:', data?.length, 'Error:', error?.message);
      if (data) setRecipients(data);
    } catch (e) {
      console.error('[Recipients]', e);
    }
    setLoading(false);
  }

  const handleAdd = async () => {
    if (!firstName || !state) {
      const msg = 'Please enter at least a first name and state.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Missing Fields', msg);
      return;
    }

    setSaving(true);
    const aggregatorConfig = getAggregatorForState(state);
    let aggregator = 'hhax';
    if (aggregatorConfig) {
      const name = aggregatorConfig.name.toLowerCase();
      if (name.includes('sandata')) aggregator = 'sandata';
      else if (name.includes('tellus')) aggregator = 'tellus';
      else if (name.includes('providerone')) aggregator = 'providerone';
      else if (name.includes('calevv')) aggregator = 'calevv';
    }

    if (!userId) {
      alert('Not signed in. Please sign out and sign back in.');
      setSaving(false);
      return;
    }

    const insertData = {
      caregiver_id: userId,
      first_name: firstName,
      last_name: lastName || '',
      relationship: relationship || 'family',
      provider_id: providerId || '',
      recipient_id: recipientId || '',
      state: state.toUpperCase().slice(0, 2),
      aggregator,
    };

    console.log('[Recipients] Inserting:', insertData);
    const { data: insertResult, error } = await supabase.from('recipients').insert(insertData).select();
    console.log('[Recipients] Result:', insertResult, 'Error:', error);

    setSaving(false);
    if (error) {
      const msg = `Failed to add recipient: ${error.message}`;
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);
      return;
    }

    // Reset form
    setFirstName(''); setLastName(''); setRelationship('');
    setProviderId(''); setRecipientId(''); setState('');
    setShowAdd(false);
    loadRecipients();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{ color: Colors.primary, fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>

          <Text style={[Typography.sectionLabel, { color: Colors.primary }]}>CARE RECIPIENTS</Text>
          <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4 }]}>
            People You Care For
          </Text>
          <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4, marginBottom: 24 }]}>
            Each recipient is linked to your Medicaid provider ID for EVV auto-submit.
          </Text>

          {/* Debug info — remove after fixing */}
          <Text style={[Typography.micro, { color: Colors.textMuted, marginBottom: 8 }]}>
            Auth: {ready ? 'ready' : 'waiting'} | User: {userId ? userId.slice(0, 8) + '...' : 'none'} | Items: {recipients.length}
          </Text>

          {loading ? (
            <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
          ) : (
            <>
              {recipients.map((r) => (
                <Card key={r.id} style={{ marginBottom: 12 }}>
                  <View style={styles.recipientHeader}>
                    <View style={styles.recipientAvatar}>
                      <IconCaregiver size={20} color={Colors.primary} strokeWidth={2} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
                        {r.first_name} {r.last_name}
                      </Text>
                      <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>
                        {r.relationship ? r.relationship.charAt(0).toUpperCase() + r.relationship.slice(1) : 'Family'} · {r.state}
                      </Text>
                    </View>
                    <Badge
                      label={r.is_active ? 'Active' : 'Inactive'}
                      color={r.is_active ? Colors.success : Colors.textMuted}
                      variant="dot"
                      size="sm"
                    />
                  </View>

                  <View style={styles.detailsGrid}>
                    <View style={styles.detail}>
                      <Text style={[Typography.micro, { color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 }]}>
                        Provider ID
                      </Text>
                      <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 2 }]}>
                        {r.provider_id || 'Not set'}
                      </Text>
                    </View>
                    <View style={styles.detail}>
                      <Text style={[Typography.micro, { color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 }]}>
                        Recipient ID
                      </Text>
                      <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 2 }]}>
                        {r.recipient_id || 'Not set'}
                      </Text>
                    </View>
                    <View style={styles.detail}>
                      <Text style={[Typography.micro, { color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 }]}>
                        EVV Aggregator
                      </Text>
                      <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 2 }]}>
                        {r.aggregator.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}

              {recipients.length === 0 && (
                <View style={styles.emptyState}>
                  <IconCaregiver size={48} color={Colors.textMuted} strokeWidth={1.5} />
                  <Text style={[Typography.h3, { color: Colors.textSecondary, marginTop: 20 }]}>
                    No care recipients yet
                  </Text>
                  <Text style={[Typography.bodySm, { color: Colors.textMuted, marginTop: 8, textAlign: 'center' }]}>
                    Add the person you care for to start tracking visits and auto-submitting EVV.
                  </Text>
                </View>
              )}

              <Button
                title="Add Care Recipient"
                onPress={() => setShowAdd(true)}
                fullWidth
                style={{ marginTop: 20 }}
              />
            </>
          )}

          {/* Add Recipient Modal */}
          <Modal visible={showAdd} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <Text style={[Typography.h2, { color: Colors.textPrimary, marginTop: 8 }]}>
                  Add Care Recipient
                </Text>
                <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4, marginBottom: 20 }]}>
                  Add the person you provide care for.
                </Text>

                <View style={styles.formRow}>
                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput style={styles.input} value={firstName} onChangeText={setFirstName}
                      placeholder="Dorothy" placeholderTextColor={Colors.textMuted} />
                  </View>
                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput style={styles.input} value={lastName} onChangeText={setLastName}
                      placeholder="Smith" placeholderTextColor={Colors.textMuted} />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Text style={styles.label}>Relationship</Text>
                    <TextInput style={styles.input} value={relationship} onChangeText={setRelationship}
                      placeholder="Mother" placeholderTextColor={Colors.textMuted} />
                  </View>
                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Text style={styles.label}>State</Text>
                    <TextInput style={styles.input} value={state} onChangeText={setState}
                      placeholder="CO" placeholderTextColor={Colors.textMuted}
                      autoCapitalize="characters" maxLength={2} />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Provider ID</Text>
                  <TextInput style={styles.input} value={providerId} onChangeText={setProviderId}
                    placeholder="From your FMS enrollment" placeholderTextColor={Colors.textMuted} />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Recipient ID</Text>
                  <TextInput style={styles.input} value={recipientId} onChangeText={setRecipientId}
                    placeholder="Medicaid recipient number" placeholderTextColor={Colors.textMuted} />
                </View>

                <View style={{ gap: 8, marginTop: 16 }}>
                  <Button title="Add Recipient" onPress={handleAdd} loading={saving} fullWidth size="lg" />
                  <Button title="Cancel" onPress={() => setShowAdd(false)} variant="ghost" fullWidth />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { alignItems: 'center', paddingBottom: 48 },
  content: { width: '100%', maxWidth: Layout.content.maxWidth, padding: Layout.spacing.lg, paddingTop: Platform.OS === 'web' ? 24 : 16 },
  backBtn: { marginBottom: 16 },
  recipientHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  recipientAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '12', alignItems: 'center', justifyContent: 'center' },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border.subtle },
  detail: { minWidth: '30%' },
  emptyState: { alignItems: 'center', marginTop: 48, paddingHorizontal: 32 },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay.heavy, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.backgroundElevated, borderTopLeftRadius: Layout.radius.xxl, borderTopRightRadius: Layout.radius.xxl, padding: Layout.spacing.xl, paddingBottom: 48, maxWidth: Layout.content.maxWidth, width: '100%', alignSelf: 'center' },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.textMuted, alignSelf: 'center', marginBottom: 16, opacity: 0.4 },
  formRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  inputContainer: { marginBottom: 12 },
  label: { ...Typography.micro, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 },
  input: { backgroundColor: Colors.surface, borderRadius: Layout.radius.md, padding: Layout.spacing.md, paddingVertical: 12, color: Colors.textPrimary, fontSize: 15, borderWidth: 1, borderColor: Colors.border.card },
});
