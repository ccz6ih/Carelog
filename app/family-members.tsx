/**
 * Family Members — Invite family to view care activity
 * The retention moat: family viewers create invisible switching costs
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
import { IconGroup, IconHeart } from '@/components/icons/CareIcons';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';

interface FamilyRow {
  id: string;
  name: string;
  email: string;
  relationship: string;
  invite_accepted: boolean;
  recipients: { first_name: string } | null;
}

export default function FamilyMembersScreen() {
  const user = useAppStore((s) => s.user);
  const { userId, ready } = useAuth();
  const [members, setMembers] = useState<FamilyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [sending, setSending] = useState(false);

  // Invite form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRelationship, setInviteRelationship] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [recipientOptions, setRecipientOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (ready && userId) loadData();
    else if (ready && !userId) setLoading(false);
  }, [ready, userId]);

  async function loadData() {
    try {
      const { data: recs } = await supabase
        .from('recipients')
        .select('id, first_name')
        .eq('caregiver_id', userId!);
      if (recs) {
        setRecipientOptions(recs.map((r) => ({ id: r.id, name: r.first_name })));
        if (recs.length > 0 && !selectedRecipientId) setSelectedRecipientId(recs[0].id);
      }

      const { data: fam } = await supabase
        .from('family_members')
        .select('id, name, email, relationship, invite_accepted, recipients(first_name)')
        .eq('invited_by', userId!);
      if (fam) setMembers(fam as FamilyRow[]);
    } catch (e) {
      console.error('[FamilyMembers]', e);
    }
    setLoading(false);
  }

  const handleInvite = async () => {
    if (!inviteName || !inviteEmail) {
      const msg = 'Please enter a name and email.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Missing Fields', msg);
      return;
    }

    if (!userId || !selectedRecipientId) {
      alert('Missing account or recipient information. Please try again.');
      setSending(false);
      return;
    }

    setSending(true);
    const insertData = {
      name: inviteName,
      email: inviteEmail.toLowerCase().trim(),
      relationship: inviteRelationship || 'Family',
      recipient_id: selectedRecipientId,
      invited_by: userId!,
    };
    console.log('[FamilyMembers] Inviting:', insertData);
    const { data: insertResult, error } = await supabase.from('family_members').insert(insertData).select();
    console.log('[FamilyMembers] Result:', insertResult, 'Error:', error);
    setSending(false);

    if (error) {
      const msg = error.message.includes('idx_family_unique')
        ? 'This person is already invited for this care recipient.'
        : `Invite failed: ${error.message}`;
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);
      return;
    }

    setInviteName(''); setInviteEmail(''); setInviteRelationship('');
    setShowInvite(false);
    loadData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{ color: Colors.primary, fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>

          <Text style={[Typography.sectionLabel, { color: Colors.accent.purple }]}>FAMILY PORTAL</Text>
          <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4 }]}>
            Family Viewers
          </Text>
          <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4, marginBottom: 24 }]}>
            Invite family members to see visit updates and send appreciation. They'll get real-time notifications when you clock in and out.
          </Text>

          {loading ? (
            <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
          ) : (
            <>
              {/* Value prop card */}
              <Card borderColor={Colors.accent.purple} style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <IconHeart size={28} color={Colors.accent.purple} strokeWidth={2} />
                  <View style={{ flex: 1 }}>
                    <Text style={[Typography.h3, { color: Colors.textPrimary }]}>Your work deserves to be seen</Text>
                    <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 4 }]}>
                      Connected family members can view visit activity, see completed tasks, and send appreciation directly to you.
                    </Text>
                  </View>
                </View>
              </Card>

              {members.map((m) => (
                <Card key={m.id} variant="glass" style={{ marginBottom: 10 }}>
                  <View style={styles.memberRow}>
                    <View style={styles.memberAvatar}>
                      <Text style={[Typography.caption, { color: Colors.accent.purple, fontWeight: '700' }]}>
                        {m.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[Typography.body, { color: Colors.textPrimary }]}>{m.name}</Text>
                      <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 2 }]}>
                        {m.email} · {m.relationship}
                        {m.recipients ? ` · ${m.recipients.first_name}'s care` : ''}
                      </Text>
                    </View>
                    <Badge
                      label={m.invite_accepted ? 'Connected' : 'Invited'}
                      color={m.invite_accepted ? Colors.success : Colors.warning}
                      variant="dot"
                      size="sm"
                    />
                  </View>
                </Card>
              ))}

              {members.length === 0 && (
                <View style={styles.emptyState}>
                  <IconGroup size={48} color={Colors.textMuted} strokeWidth={1.5} />
                  <Text style={[Typography.h3, { color: Colors.textSecondary, marginTop: 20 }]}>
                    No family viewers yet
                  </Text>
                  <Text style={[Typography.bodySm, { color: Colors.textMuted, marginTop: 8, textAlign: 'center' }]}>
                    Invite a sibling, spouse, or family member to see your care activity.
                  </Text>
                </View>
              )}

              <Button
                title="Invite Family Member"
                onPress={() => setShowInvite(true)}
                fullWidth
                style={{ marginTop: 20 }}
              />
            </>
          )}

          {/* Invite Modal */}
          <Modal visible={showInvite} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <Text style={[Typography.h2, { color: Colors.textPrimary, marginTop: 8 }]}>
                  Invite Family Member
                </Text>
                <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4, marginBottom: 20 }]}>
                  They'll receive visit updates and can send you appreciation.
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput style={styles.input} value={inviteName} onChangeText={setInviteName}
                    placeholder="Sarah" placeholderTextColor={Colors.textMuted} />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput style={styles.input} value={inviteEmail} onChangeText={setInviteEmail}
                    placeholder="sarah@example.com" placeholderTextColor={Colors.textMuted}
                    keyboardType="email-address" autoCapitalize="none" />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Relationship</Text>
                  <TextInput style={styles.input} value={inviteRelationship} onChangeText={setInviteRelationship}
                    placeholder="Sister, Daughter, Spouse..." placeholderTextColor={Colors.textMuted} />
                </View>

                {recipientOptions.length > 1 && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Viewing care for</Text>
                    <View style={styles.recipientPills}>
                      {recipientOptions.map((r) => (
                        <TouchableOpacity
                          key={r.id}
                          onPress={() => setSelectedRecipientId(r.id)}
                          style={[styles.pill, selectedRecipientId === r.id && styles.pillActive]}
                        >
                          <Text style={[Typography.caption, { color: selectedRecipientId === r.id ? Colors.primary : Colors.textMuted }]}>
                            {r.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                <View style={{ gap: 8, marginTop: 16 }}>
                  <Button title="Send Invite" onPress={handleInvite} loading={sending} fullWidth size="lg" />
                  <Button title="Cancel" onPress={() => setShowInvite(false)} variant="ghost" fullWidth />
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
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  memberAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.accent.purple + '15', alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', marginTop: 48, paddingHorizontal: 32 },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay.heavy, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.backgroundElevated, borderTopLeftRadius: Layout.radius.xxl, borderTopRightRadius: Layout.radius.xxl, padding: Layout.spacing.xl, paddingBottom: 48, maxWidth: Layout.content.maxWidth, width: '100%', alignSelf: 'center' },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.textMuted, alignSelf: 'center', marginBottom: 16, opacity: 0.4 },
  inputContainer: { marginBottom: 12 },
  label: { ...Typography.micro, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 },
  input: { backgroundColor: Colors.surface, borderRadius: Layout.radius.md, padding: Layout.spacing.md, paddingVertical: 12, color: Colors.textPrimary, fontSize: 15, borderWidth: 1, borderColor: Colors.border.card },
  recipientPills: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Layout.radius.full, borderWidth: 1, borderColor: Colors.border.cardHover },
  pillActive: { borderColor: Colors.primary + '60', backgroundColor: Colors.primary + '10' },
});
