/**
 * Family Dashboard — Read-only view for family members
 * Shows care activity, visit history, and send appreciation
 * This is the primary screen for users with role='family'
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { format } from 'date-fns';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { IconHeart, IconVisit, IconComfort } from '@/components/icons/CareIcons';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/services/supabase';

interface ActivityItem {
  id: string;
  activity_type: string;
  summary: string;
  actor_name: string;
  created_at: string;
}

interface VisitSummary {
  id: string;
  clock_in_time: string;
  clock_out_time: string | null;
  evv_status: string;
  caregiver_name: string;
}

const ACTIVITY_ICONS: Record<string, string> = {
  visit_started: '◉',
  visit_completed: '✓',
  task_logged: '▣',
  photo_shared: '◫',
  medication_alert: '●',
};

const APPRECIATION_AMOUNTS = [10, 25, 50];

export default function FamilyDashboard() {
  const { user, logout } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [recipientName, setRecipientName] = useState('');
  const [caregiverName, setCaregiverName] = useState('');
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [recentVisits, setRecentVisits] = useState<VisitSummary[]>([]);
  const [showAppreciation, setShowAppreciation] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (user?.id) loadData();
  }, [user?.id]);

  async function loadData() {
    try {
      // Find family_members record for this user
      const { data: familyRecord } = await supabase
        .from('family_members')
        .select('id, recipient_id, recipients(id, first_name, last_name, relationship, caregiver_id)')
        .eq('user_id', user!.id)
        .limit(1);

      if (!familyRecord || familyRecord.length === 0) {
        // No linked recipient yet — show waiting state
        setLoading(false);
        return;
      }

      const fm = familyRecord[0];
      const rec = fm.recipients as any;
      if (rec) {
        const rel = rec.relationship ? rec.relationship.charAt(0).toUpperCase() + rec.relationship.slice(1) : '';
        setRecipientName(rel ? `${rel} (${rec.first_name})` : `${rec.first_name} ${rec.last_name}`);

        // Get caregiver name
        const { data: caregiver } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', rec.caregiver_id)
          .single();
        if (caregiver) setCaregiverName(caregiver.first_name);

        // Load activity feed
        const { data: activityData } = await supabase
          .from('family_activity')
          .select('*')
          .eq('recipient_id', rec.id)
          .order('created_at', { ascending: false })
          .limit(20);
        if (activityData) setActivities(activityData);

        // Load recent visits
        const { data: visitData } = await supabase
          .from('visits')
          .select('id, clock_in_time, clock_out_time, evv_status')
          .eq('recipient_id', rec.id)
          .order('created_at', { ascending: false })
          .limit(10);
        if (visitData) setRecentVisits(visitData);

        // Subscribe to realtime
        supabase
          .channel('family-live')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'family_activity',
            filter: `recipient_id=eq.${rec.id}`,
          }, (payload) => {
            setActivities((prev) => [payload.new as ActivityItem, ...prev]);
          })
          .subscribe();
      }
    } catch (e) {
      console.error('[FamilyDashboard]', e);
    }
    setLoading(false);
  }

  const formatTime = (ts: string) => {
    try { return format(new Date(ts), 'EEE, MMM d · h:mm a'); } catch { return ts; }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    logout();
    router.replace('/(auth)/login');
  };

  const handleSendAppreciation = async () => {
    if (!selectedAmount) return;
    const links: Record<string, string> = {
      venmo: `venmo://paycharge?txn=pay&amount=${selectedAmount}&note=CareLog%20Appreciation`,
      cashapp: `cashapp://cash.app/pay?amount=${selectedAmount}&note=CareLog`,
      zelle: `zelle://`,
      paypal: `paypal://paypalme/?amount=${selectedAmount}`,
    };
    const url = links[paymentMethod || 'venmo'];
    if (url) {
      try { await Linking.openURL(url); } catch {}
    }
    setSent(true);
    setTimeout(() => { setShowAppreciation(false); setSent(false); setSelectedAmount(null); setPaymentMethod(null); }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[Typography.sectionLabel, { color: Colors.accent.purple }]}>FAMILY PORTAL</Text>
              <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4 }]}>
                {recipientName ? `${recipientName}'s Care` : 'Family Dashboard'}
              </Text>
              {caregiverName ? (
                <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4 }]}>
                  Cared for by {caregiverName}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={handleSignOut}>
              <Text style={[Typography.caption, { color: Colors.textMuted }]}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          <Badge label="FREE VIEWER" color={Colors.accent.purple} variant="dot" />

          {loading ? (
            <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 60 }} />
          ) : !recipientName ? (
            // No linked recipient
            <View style={styles.emptyState}>
              <IconHeart size={56} color={Colors.textMuted} strokeWidth={1.5} />
              <Text style={[Typography.h3, { color: Colors.textSecondary, marginTop: 24 }]}>
                Waiting for invite
              </Text>
              <Text style={[Typography.bodySm, { color: Colors.textMuted, marginTop: 8, textAlign: 'center' }]}>
                Your caregiver needs to link your account. Ask them to go to Settings → Family Viewers and add your email.
              </Text>
            </View>
          ) : (
            <>
              {/* Send Appreciation CTA */}
              <Card borderColor={Colors.accent.orange} style={{ marginTop: 20, marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <IconHeart size={28} color={Colors.accent.orange} strokeWidth={2} />
                  <View style={{ flex: 1 }}>
                    <Text style={[Typography.h3, { color: Colors.accent.orange }]}>Send Appreciation</Text>
                    <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>
                      Show {caregiverName || 'your caregiver'} you see their work
                    </Text>
                  </View>
                </View>
                <Button
                  title="Send Appreciation"
                  onPress={() => setShowAppreciation(true)}
                  style={{ marginTop: 14 }}
                />
              </Card>

              {/* Activity Feed */}
              <Text style={[Typography.sectionLabel, { color: Colors.textMuted, marginBottom: 12 }]}>
                RECENT ACTIVITY
              </Text>

              {activities.length === 0 ? (
                <Card variant="glass">
                  <Text style={[Typography.bodySm, { color: Colors.textMuted, textAlign: 'center' }]}>
                    No activity yet. Updates will appear here when visits happen.
                  </Text>
                </Card>
              ) : (
                activities.map((a) => (
                  <Card key={a.id} variant="glass" padding="sm" style={{ marginBottom: 8 }}>
                    <View style={styles.activityRow}>
                      <View style={[styles.activityDot, { backgroundColor: a.activity_type === 'visit_completed' ? Colors.success : Colors.primary }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={[Typography.body, { color: Colors.textPrimary }]}>{a.summary}</Text>
                        <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 3 }]}>
                          {formatTime(a.created_at)}
                        </Text>
                      </View>
                    </View>
                  </Card>
                ))
              )}

              {/* Recent Visits */}
              {recentVisits.length > 0 && (
                <>
                  <Text style={[Typography.sectionLabel, { color: Colors.textMuted, marginTop: 24, marginBottom: 12 }]}>
                    RECENT VISITS
                  </Text>
                  {recentVisits.map((v) => (
                    <Card key={v.id} variant="glass" padding="sm" style={{ marginBottom: 8 }}>
                      <View style={styles.visitRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={[Typography.bodySm, { color: Colors.textPrimary }]}>
                            {formatTime(v.clock_in_time)}
                          </Text>
                          {v.clock_out_time && (
                            <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 2 }]}>
                              Duration: {Math.round((new Date(v.clock_out_time).getTime() - new Date(v.clock_in_time).getTime()) / 3600000 * 10) / 10}h
                            </Text>
                          )}
                        </View>
                        <Badge
                          label={v.evv_status === 'submitted' ? 'Compliant' : v.evv_status === 'clocked_in' ? 'In Progress' : 'Pending'}
                          color={v.evv_status === 'submitted' ? Colors.success : v.evv_status === 'clocked_in' ? Colors.primary : Colors.warning}
                          variant="dot"
                          size="sm"
                        />
                      </View>
                    </Card>
                  ))}
                </>
              )}
            </>
          )}

          {/* Appreciation Modal */}
          <Modal visible={showAppreciation} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                {sent ? (
                  <View style={{ alignItems: 'center', padding: 40 }}>
                    <View style={styles.successIcon}>
                      <Text style={{ fontSize: 28, color: Colors.success }}>✓</Text>
                    </View>
                    <Text style={[Typography.h2, { color: Colors.textPrimary, marginTop: 20 }]}>Appreciation Sent!</Text>
                    <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 8, textAlign: 'center' }]}>
                      {caregiverName || 'Your caregiver'} will be notified.
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text style={[Typography.h2, { color: Colors.textPrimary, marginTop: 8 }]}>Send Appreciation</Text>
                    <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4, marginBottom: 20 }]}>
                      Show {caregiverName || 'your caregiver'} their work matters
                    </Text>

                    <View style={styles.amountRow}>
                      {APPRECIATION_AMOUNTS.map((amt) => (
                        <TouchableOpacity
                          key={amt}
                          onPress={() => setSelectedAmount(amt)}
                          style={[styles.amountBtn, selectedAmount === amt && styles.amountBtnActive]}
                        >
                          <Text style={[Typography.h2, { color: selectedAmount === amt ? Colors.textInverse : Colors.textPrimary }]}>${amt}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={styles.paymentRow}>
                      {['venmo', 'cashapp', 'zelle', 'paypal'].map((m) => (
                        <TouchableOpacity key={m} onPress={() => setPaymentMethod(m)}
                          style={[styles.paymentBtn, paymentMethod === m && styles.paymentBtnActive]}>
                          <Text style={[Typography.micro, { color: paymentMethod === m ? Colors.primary : Colors.textMuted, letterSpacing: 0.5 }]}>
                            {m === 'cashapp' ? 'Cash App' : m.charAt(0).toUpperCase() + m.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text style={[Typography.micro, { color: Colors.textMuted, textAlign: 'center', marginTop: 12 }]}>
                      CareLog never handles money — opens your payment app directly
                    </Text>

                    <View style={{ gap: 8, marginTop: 20 }}>
                      <Button title={selectedAmount ? `Send $${selectedAmount}` : 'Select Amount'} onPress={handleSendAppreciation} disabled={!selectedAmount} size="lg" fullWidth />
                      <Button title="Cancel" onPress={() => setShowAppreciation(false)} variant="ghost" fullWidth />
                    </View>
                  </>
                )}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 32 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: Layout.spacing.sm },
  activityDot: { width: 8, height: 8, borderRadius: 4 },
  visitRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: Layout.spacing.sm },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay.heavy, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.backgroundElevated, borderTopLeftRadius: Layout.radius.xxl, borderTopRightRadius: Layout.radius.xxl, padding: Layout.spacing.xl, paddingBottom: 48, maxWidth: Layout.content.maxWidth, width: '100%', alignSelf: 'center' },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.textMuted, alignSelf: 'center', marginBottom: 16, opacity: 0.4 },
  successIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.success + '15', alignItems: 'center', justifyContent: 'center' },
  amountRow: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: 8 },
  amountBtn: { width: 88, height: 88, borderRadius: Layout.radius.lg, borderWidth: 1.5, borderColor: Colors.border.cardHover, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  amountBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  paymentRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 16, flexWrap: 'wrap' },
  paymentBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Layout.radius.full, borderWidth: 1, borderColor: Colors.border.cardHover },
  paymentBtnActive: { borderColor: Colors.primary + '60', backgroundColor: Colors.primary + '10' },
});
