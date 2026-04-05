/**
 * CareLog Family Portal
 * Activity feed + appreciation. Responsive centered layout.
 */
import React, { useState, useEffect } from 'react';
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
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/services/supabase';

interface ActivityItem {
  id: string;
  activity_type: string;
  summary: string;
  actor_name: string;
  created_at: string;
}

const ACTIVITY_ICONS: Record<string, string> = {
  visit_started: '◉',
  visit_completed: '✓',
  task_logged: '▣',
  photo_shared: '◫',
};

const ACTIVITY_COLORS: Record<string, string> = {
  visit_started: Colors.primary,
  visit_completed: Colors.success,
  task_logged: Colors.accent.orange,
  photo_shared: Colors.accent.purple,
};

const APPRECIATION_AMOUNTS = [10, 25, 50];

export default function FamilyScreen() {
  const user = useAppStore((s) => s.user);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipientName, setRecipientName] = useState('');
  const [showAppreciation, setShowAppreciation] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    async function loadActivity() {
      const { data: recipients } = await supabase
        .from('recipients')
        .select('id, first_name, relationship')
        .eq('caregiver_id', user?.id)
        .eq('is_active', true)
        .limit(1);

      if (recipients && recipients.length > 0) {
        const r = recipients[0];
        const rel = r.relationship ? r.relationship.charAt(0).toUpperCase() + r.relationship.slice(1) : '';
        setRecipientName(rel ? `${rel}'s` : `${r.first_name}'s`);

        const { data: activityData } = await supabase
          .from('family_activity')
          .select('*')
          .eq('recipient_id', r.id)
          .order('created_at', { ascending: false })
          .limit(20);
        if (activityData) setActivities(activityData);
      }
      setLoading(false);

      // Subscribe to realtime inserts for live feed
      if (recipients && recipients.length > 0) {
        const channel = supabase
          .channel('family-activity')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'family_activity',
              filter: `recipient_id=eq.${recipients[0].id}`,
            },
            (payload) => {
              setActivities((prev) => [payload.new as ActivityItem, ...prev]);
            }
          )
          .subscribe();

        return () => { supabase.removeChannel(channel); };
      }
    }
    if (user?.id) loadActivity();
  }, [user?.id]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const PAYMENT_OPTIONS = [
    { id: 'venmo', label: 'Venmo', urlScheme: (amount: number) => `venmo://paycharge?txn=pay&amount=${amount}&note=CareLog%20Appreciation` },
    { id: 'cashapp', label: 'Cash App', urlScheme: (amount: number) => `cashapp://cash.app/pay?amount=${amount}&note=CareLog` },
    { id: 'zelle', label: 'Zelle', urlScheme: () => `zelle://` },
    { id: 'paypal', label: 'PayPal', urlScheme: (amount: number) => `paypal://paypalme/?amount=${amount}` },
  ];

  const handleSendAppreciation = async () => {
    if (!selectedAmount) return;

    // Try to open payment app
    const method = PAYMENT_OPTIONS.find((p) => p.id === (paymentMethod || 'venmo'));
    if (method) {
      const url = method.urlScheme(selectedAmount);
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    }

    setSent(true);
    setTimeout(() => {
      setShowAppreciation(false);
      setSent(false);
      setSelectedAmount(null);
      setPaymentMethod(null);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[Typography.sectionLabel, { color: Colors.accent.orange }]}>FAMILY PORTAL</Text>
          <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4 }]}>
            {recipientName || 'Family'} Care Feed
          </Text>
          <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4, marginBottom: 24 }]}>
            Real-time updates from visits
          </Text>

          {loading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color={Colors.primary} size="large" />
            </View>
          ) : activities.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Text style={{ fontSize: 28, opacity: 0.6 }}>♡</Text>
              </View>
              <Text style={[Typography.h3, { color: Colors.textSecondary, marginTop: 20 }]}>
                No activity yet
              </Text>
              <Text style={[Typography.bodySm, { color: Colors.textMuted, marginTop: 8, textAlign: 'center' }]}>
                Activity will appear here once visits are completed.
              </Text>
            </View>
          ) : (
            activities.map((activity) => (
              <Card key={activity.id} variant="glass" style={{ marginBottom: 10 }}>
                <View style={styles.activityRow}>
                  <View style={[
                    styles.activityIcon,
                    { backgroundColor: (ACTIVITY_COLORS[activity.activity_type] || Colors.primary) + '15' },
                  ]}>
                    <Text style={{
                      color: ACTIVITY_COLORS[activity.activity_type] || Colors.primary,
                      fontSize: 14,
                      fontWeight: '700',
                    }}>
                      {ACTIVITY_ICONS[activity.activity_type] || '●'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                      {activity.summary}
                    </Text>
                    <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 4, letterSpacing: 0.5 }]}>
                      {formatTime(activity.created_at)}
                    </Text>
                  </View>
                </View>
              </Card>
            ))
          )}

          {/* Appreciation CTA */}
          <Card borderColor={Colors.accent.orange} style={{ marginTop: 20 }}>
            <Text style={[Typography.h3, { color: Colors.accent.orange }]}>Send Appreciation</Text>
            <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 8 }]}>
              Show your caregiver you see their work. One appreciation covers half the subscription.
            </Text>
            <Button
              title="Send Appreciation"
              onPress={() => setShowAppreciation(true)}
              variant="primary"
              style={{ marginTop: 16 }}
            />
          </Card>

          {/* Appreciation Modal */}
          <Modal visible={showAppreciation} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                {sent ? (
                  <View style={{ alignItems: 'center', padding: 40 }}>
                    <View style={[styles.successIcon]}>
                      <Text style={{ fontSize: 28, color: Colors.success }}>✓</Text>
                    </View>
                    <Text style={[Typography.h2, { color: Colors.textPrimary, marginTop: 20 }]}>
                      Appreciation Sent!
                    </Text>
                    <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 8, textAlign: 'center' }]}>
                      Your caregiver will be notified.
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text style={[Typography.h2, { color: Colors.textPrimary, marginTop: 8 }]}>
                      Send Appreciation
                    </Text>

                    <View style={styles.amountRow}>
                      {APPRECIATION_AMOUNTS.map((amount) => (
                        <TouchableOpacity
                          key={amount}
                          onPress={() => setSelectedAmount(amount)}
                          style={[
                            styles.amountBtn,
                            selectedAmount === amount && styles.amountBtnActive,
                          ]}
                        >
                          <Text style={[
                            Typography.h2,
                            { color: selectedAmount === amount ? Colors.textInverse : Colors.textPrimary },
                          ]}>
                            ${amount}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={styles.paymentRow}>
                      {PAYMENT_OPTIONS.map((p) => (
                        <TouchableOpacity
                          key={p.id}
                          onPress={() => setPaymentMethod(p.id)}
                          style={[
                            styles.paymentBtn,
                            paymentMethod === p.id && styles.paymentBtnActive,
                          ]}
                        >
                          <Text style={[
                            Typography.micro,
                            {
                              color: paymentMethod === p.id ? Colors.primary : Colors.textMuted,
                              letterSpacing: 0.5,
                            },
                          ]}>
                            {p.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={{ gap: 8, marginTop: 24 }}>
                      <Button
                        title={selectedAmount ? `Send $${selectedAmount}` : 'Select Amount'}
                        onPress={handleSendAppreciation}
                        disabled={!selectedAmount}
                        size="lg"
                        fullWidth
                      />
                      <Button
                        title="Cancel"
                        onPress={() => setShowAppreciation(false)}
                        variant="ghost"
                        fullWidth
                      />
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  content: {
    width: '100%',
    maxWidth: Layout.content.maxWidth,
    padding: Layout.spacing.lg,
    paddingTop: Platform.OS === 'web' ? 24 : 16,
  },
  loadingState: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay.heavy,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: Layout.radius.xxl,
    borderTopRightRadius: Layout.radius.xxl,
    padding: Layout.spacing.xl,
    paddingBottom: 48,
    borderWidth: 1,
    borderColor: Colors.border.card,
    maxWidth: Layout.content.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
    alignSelf: 'center',
    marginBottom: 16,
    opacity: 0.4,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.success + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 28,
  },
  amountBtn: {
    width: 88,
    height: 88,
    borderRadius: Layout.radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border.cardHover,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  paymentBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Layout.radius.full,
    borderWidth: 1,
    borderColor: Colors.border.cardHover,
  },
  paymentBtnActive: {
    borderColor: Colors.primary + '60',
    backgroundColor: Colors.primary + '10',
  },
});
