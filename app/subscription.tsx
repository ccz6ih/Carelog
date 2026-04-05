/**
 * Subscription — Tier management and upgrade flow
 * Basic → Pro → Family upsell based on recipient count
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { IconHeart } from '@/components/icons/CareIcons';
import { useAppStore } from '@/store/useAppStore';

const TIERS = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$19.99/mo',
    color: Colors.primary,
    features: [
      'EVV clock in/out with GPS',
      'Auto-submit to state Medicaid',
      '1 care recipient',
      '1 family viewer',
      'Visit history',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29.99/mo',
    color: Colors.success,
    popular: true,
    features: [
      'Everything in Basic',
      '2 care recipients',
      '3 family viewers',
      'Medication log',
      'Training videos',
      'Priority support',
    ],
  },
  {
    id: 'family',
    name: 'Family',
    price: '$44.99/mo',
    color: Colors.accent.purple,
    features: [
      'Everything in Pro',
      'Unlimited recipients',
      'Unlimited family viewers',
      'Premium training content',
      'Medication alerts',
      'Community access',
      'Compliance reports export',
    ],
  },
];

export default function SubscriptionScreen() {
  const user = useAppStore((s) => s.user);
  const currentTier = user?.tier || 'basic';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{ color: Colors.primary, fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>

          <Text style={[Typography.sectionLabel, { color: Colors.accent.orange }]}>SUBSCRIPTION</Text>
          <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4 }]}>
            Choose Your Plan
          </Text>
          <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4, marginBottom: 24 }]}>
            CareLog pays for itself — one $25 appreciation from family covers the Basic subscription.
          </Text>

          {TIERS.map((tier) => {
            const isCurrent = tier.id === currentTier;
            return (
              <Card
                key={tier.id}
                borderColor={isCurrent ? tier.color : undefined}
                style={{ marginBottom: 16 }}
              >
                <View style={styles.tierHeader}>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={[Typography.h2, { color: tier.color }]}>{tier.name}</Text>
                      {tier.popular && <Badge label="POPULAR" color={Colors.success} size="sm" />}
                    </View>
                    <Text style={[Typography.display, { color: Colors.textPrimary, marginTop: 4 }]}>
                      {tier.price}
                    </Text>
                  </View>
                  {isCurrent && (
                    <Badge label="CURRENT" color={tier.color} variant="dot" />
                  )}
                </View>

                <View style={styles.features}>
                  {tier.features.map((feature, i) => (
                    <View key={i} style={styles.featureRow}>
                      <Text style={{ color: tier.color, fontSize: 12 }}>✓</Text>
                      <Text style={[Typography.bodySm, { color: Colors.textSecondary }]}>
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>

                {!isCurrent && (
                  <Button
                    title={tier.id === 'basic' ? 'Downgrade' : 'Upgrade'}
                    variant={tier.id === 'basic' ? 'outline' : 'primary'}
                    fullWidth
                    style={{ marginTop: 16 }}
                    onPress={() => {
                      const msg = 'Subscription management coming soon. Your current plan continues.';
                      Platform.OS === 'web' ? alert(msg) : null;
                    }}
                  />
                )}
              </Card>
            );
          })}

          {/* Appreciation reminder */}
          <Card variant="glass" style={{ marginTop: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <IconHeart size={24} color={Colors.accent.orange} strokeWidth={2} />
              <View style={{ flex: 1 }}>
                <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
                  Family appreciation offsets your cost
                </Text>
                <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 4 }]}>
                  When family members send appreciation through CareLog, one $25 tip covers your entire Basic subscription. Connect family viewers to get started.
                </Text>
              </View>
            </View>
          </Card>
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
  tierHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  features: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.border.subtle, gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
