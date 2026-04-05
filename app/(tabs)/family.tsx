/**
 * CareLog Family Portal
 * The retention moat. Family members see visit activity.
 * "Send Appreciation" — the subscription offsetter.
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
  visit_started: '🔔',
  visit_completed: '✅',
  task_logged: '📋',
  photo_shared: '📸',
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
      // Get first recipient to load their activity
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
    }
    if (user?.id) loadActivity();
  }, [user?.id]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const handleSendAppreciation = () => {
    setSent(true);
    setTimeout(() => {
      setShowAppreciation(false);
      setSent(false);
      setSelectedAmount(null);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Typography.sectionLabel, { color: Colors.accent.orange }]}>
          FAMILY PORTAL
        </Text>
        <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4 }]}>
          {recipientName || "Family"} Care Feed
        </Text>
        <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4, marginBottom: 24 }]}>
          Real-time updates from visits
        </Text>

        {/* Activity Feed */}
        {loading ? (
          <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
        ) : activities.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>👨‍👩‍👧</Text>
            <Text style={[Typography.h3, { color: Colors.textSecondary, marginTop: 16 }]}>
              No activity yet
            </Text>
            <Text style={[Typography.bodySm, { color: Colors.textMuted, marginTop: 8, textAlign: 'center' }]}>
              Activity will appear here once visits are completed.
            </Text>
          </View>
        ) : (
          activities.map((activity) => (
            <Card
              key={activity.id}
              borderColor={activity.activity_type === 'visit_completed' ? Colors.success : Colors.border.default}
              style={{ marginBottom: 12 }}
            >
              <View style={styles.activityRow}>
                <Text style={{ fontSize: 20 }}>
                  {ACTIVITY_ICONS[activity.activity_type] || '📌'}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                    {activity.summary}
                  </Text>
                  <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>
                    {formatTime(activity.created_at)}
                  </Text>
                </View>
              </View>
            </Card>
          ))
        )}

        {/* Send Appreciation CTA */}
        <Card borderColor={Colors.accent.orange} style={{ marginTop: 16 }}>
          <Text style={[Typography.h3, { color: Colors.accent.orange }]}>
            🙏 Send Appreciation
          </Text>
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
              {sent ? (
                <View style={{ alignItems: 'center', padding: 40 }}>
                  <Text style={{ fontSize: 48 }}>💚</Text>
                  <Text style={[Typography.h2, { color: Colors.textPrimary, marginTop: 16 }]}>
                    Appreciation Sent!
                  </Text>
                  <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 8, textAlign: 'center' }]}>
                    Your caregiver will be notified. Thank you for seeing their work.
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={[Typography.h2, { color: Colors.textPrimary }]}>
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
                          Typography.h3,
                          { color: selectedAmount === amount ? Colors.textInverse : Colors.textPrimary },
                        ]}>
                          ${amount}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[Typography.caption, { color: Colors.textMuted, textAlign: 'center', marginTop: 12 }]}>
                    Routes to Venmo · Zelle · PayPal · Cash App
                  </Text>
                  <Text style={[Typography.caption, { color: Colors.textMuted, textAlign: 'center', marginTop: 2 }]}>
                    No money through CareLog
                  </Text>

                  <Button
                    title={selectedAmount ? `Send $${selectedAmount}` : 'Select Amount'}
                    onPress={handleSendAppreciation}
                    disabled={!selectedAmount}
                    size="lg"
                    style={{ marginTop: 24 }}
                  />
                  <Button
                    title="Cancel"
                    onPress={() => setShowAppreciation(false)}
                    variant="ghost"
                    style={{ marginTop: 8 }}
                  />
                </>
              )}
            </View>
          </View>
        </Modal>
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
    padding: Layout.spacing.xl,
    paddingTop: 16,
  },
  empty: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 32,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: Layout.radius.xl,
    borderTopRightRadius: Layout.radius.xl,
    padding: Layout.spacing.xl,
    paddingBottom: 48,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 24,
  },
  amountBtn: {
    width: 80,
    height: 80,
    borderRadius: Layout.radius.lg,
    borderWidth: 2,
    borderColor: Colors.border.card,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
});
