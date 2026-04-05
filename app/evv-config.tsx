/**
 * EVV Configuration — View aggregator setup per recipient
 * Shows which aggregator handles each state + connection status
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { IconNurture } from '@/components/icons/CareIcons';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/services/supabase';
import { AGGREGATORS, getAggregatorForState } from '@/services/evv';

interface RecipientEVV {
  id: string;
  first_name: string;
  relationship: string;
  state: string;
  aggregator: string;
  provider_id: string;
  recipient_id: string;
}

export default function EVVConfigScreen() {
  const user = useAppStore((s) => s.user);
  const [recipients, setRecipients] = useState<RecipientEVV[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('recipients')
          .select('id, first_name, relationship, state, aggregator, provider_id, recipient_id')
          .eq('caregiver_id', user!.id)
          .eq('is_active', true);
        if (data) setRecipients(data);
      } catch (e) {
        console.error('[EVVConfig]', e);
      }
      setLoading(false);
    }
    if (user?.id) load();
  }, [user?.id]);

  const aggregatorNames: Record<string, string> = {
    hhax: 'HHAeXchange',
    sandata: 'Sandata eMBS',
    tellus: 'Tellus/Optum',
    providerone: 'ProviderOne',
    calevv: 'CalEVV/CDSS',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{ color: Colors.primary, fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>

          <Text style={[Typography.sectionLabel, { color: Colors.primary }]}>EVV CONFIGURATION</Text>
          <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4 }]}>
            Auto-Submit Setup
          </Text>
          <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4, marginBottom: 24 }]}>
            CareLog auto-submits your 6 EVV data points to state Medicaid when you clock out. Here's how each recipient is configured.
          </Text>

          {/* How it works */}
          <Card variant="glass" style={{ marginBottom: 20 }}>
            <Text style={[Typography.h3, { color: Colors.primary }]}>How Auto-Submit Works</Text>
            <View style={styles.stepsList}>
              {[
                'You clock in — GPS + timestamp captured',
                'You complete care tasks during visit',
                'You clock out — GPS + timestamp captured',
                'CareLog packages all 6 required data points',
                'Auto-submitted to your state\'s EVV aggregator',
                'Green checkmark = you\'re getting paid',
              ].map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <Text style={[Typography.caption, { color: Colors.primary, fontWeight: '700', width: 18 }]}>{i + 1}</Text>
                  <Text style={[Typography.bodySm, { color: Colors.textSecondary }]}>{step}</Text>
                </View>
              ))}
            </View>
          </Card>

          {loading ? (
            <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
          ) : recipients.length === 0 ? (
            <View style={styles.emptyState}>
              <IconNurture size={48} color={Colors.textMuted} strokeWidth={1.5} />
              <Text style={[Typography.h3, { color: Colors.textSecondary, marginTop: 20 }]}>
                No recipients configured
              </Text>
              <Text style={[Typography.bodySm, { color: Colors.textMuted, marginTop: 8, textAlign: 'center' }]}>
                Add a care recipient to see their EVV configuration.
              </Text>
            </View>
          ) : (
            recipients.map((r) => {
              const hasIds = r.provider_id && r.recipient_id;
              return (
                <Card key={r.id} style={{ marginBottom: 12 }}>
                  <View style={styles.recipientHeader}>
                    <View>
                      <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
                        {r.first_name}'s EVV
                      </Text>
                      <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>
                        {r.state.toUpperCase()} · {aggregatorNames[r.aggregator] || r.aggregator}
                      </Text>
                    </View>
                    <Badge
                      label={hasIds ? 'Ready' : 'Needs attention'}
                      color={hasIds ? Colors.success : Colors.warning}
                      variant="dot"
                      size="sm"
                    />
                  </View>

                  <View style={styles.configGrid}>
                    <View style={styles.configItem}>
                      <Text style={styles.configLabel}>Aggregator</Text>
                      <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                        {aggregatorNames[r.aggregator] || r.aggregator}
                      </Text>
                    </View>
                    <View style={styles.configItem}>
                      <Text style={styles.configLabel}>Provider ID</Text>
                      <Text style={[Typography.body, { color: r.provider_id ? Colors.textPrimary : Colors.warning }]}>
                        {r.provider_id || 'Not set'}
                      </Text>
                    </View>
                    <View style={styles.configItem}>
                      <Text style={styles.configLabel}>Recipient ID</Text>
                      <Text style={[Typography.body, { color: r.recipient_id ? Colors.textPrimary : Colors.warning }]}>
                        {r.recipient_id || 'Not set'}
                      </Text>
                    </View>
                  </View>

                  {!hasIds && (
                    <Text style={[Typography.caption, { color: Colors.warning, marginTop: 12 }]}>
                      Add your Provider ID and Recipient ID in Care Recipients to enable auto-submit.
                    </Text>
                  )}
                </Card>
              );
            })
          )}
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
  stepsList: { marginTop: 12, gap: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  recipientHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  configGrid: { gap: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border.subtle },
  configItem: { gap: 2 },
  configLabel: { ...Typography.micro, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  emptyState: { alignItems: 'center', marginTop: 48, paddingHorizontal: 32 },
});
