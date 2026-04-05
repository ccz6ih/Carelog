/**
 * CareLog Family Portal
 * The retention moat. Family members see visit activity.
 * "Send Appreciation" — the subscription offsetter.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const FAMILY_ACTIVITY = [
  { id: '1', type: 'visit', text: 'Maria started her visit with Mom', time: '9:02 AM', icon: '🔔' },
  { id: '2', type: 'task', text: 'Personal care ✓ · Meals ✓ · Medications ✓', time: '11:30 AM', icon: '📋' },
  { id: '3', type: 'photo', text: 'Maria shared a photo from the visit', time: '12:15 PM', icon: '📸' },
  { id: '4', type: 'complete', text: 'Maria completed a 4-hour visit with Mom', time: '1:14 PM', icon: '✅' },
];

const APPRECIATION_AMOUNTS = [10, 25, 50];

export default function FamilyScreen() {
  const [showAppreciation, setShowAppreciation] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [sent, setSent] = useState(false);

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
          Mom's Care Feed
        </Text>
        <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4, marginBottom: 24 }]}>
          Real-time updates from Maria's visits
        </Text>

        {/* Activity Feed */}
        {FAMILY_ACTIVITY.map((activity) => (
          <Card
            key={activity.id}
            borderColor={activity.type === 'complete' ? Colors.success : Colors.border.default}
            style={{ marginBottom: 12 }}
          >
            <View style={styles.activityRow}>
              <Text style={{ fontSize: 20 }}>{activity.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                  {activity.text}
                </Text>
                <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>
                  {activity.time}
                </Text>
              </View>
            </View>
          </Card>
        ))}

        {/* Send Appreciation CTA */}
        <Card borderColor={Colors.accent.orange} style={{ marginTop: 16 }}>
          <Text style={[Typography.h3, { color: Colors.accent.orange }]}>
            🙏 Send Appreciation
          </Text>
          <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 8 }]}>
            Show Maria you see her work. One appreciation covers half the subscription.
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
                    Maria will be notified. Thank you for seeing her work.
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={[Typography.h2, { color: Colors.textPrimary }]}>
                    Send Appreciation
                  </Text>
                  <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 8 }]}>
                    Maria completed a 4-hour visit with Mom
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
