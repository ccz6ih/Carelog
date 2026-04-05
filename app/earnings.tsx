/**
 * Earnings History — Track visit hours and appreciation received
 * Shows monthly breakdown of visits, hours worked, and appreciation
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
import { format } from 'date-fns';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import { IconComfort } from '@/components/icons/CareIcons';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/services/supabase';
import { api } from '@/services';

export default function EarningsScreen() {
  const user = useAppStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [monthlyVisits, setMonthlyVisits] = useState(0);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [appreciationTotal, setAppreciationTotal] = useState(0);
  const [appreciationThisMonth, setAppreciationThisMonth] = useState(0);
  const [recentVisits, setRecentVisits] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: mVisits } = await supabase
          .from('visits')
          .select('clock_in_time, clock_out_time')
          .eq('caregiver_id', user!.id)
          .gte('created_at', startOfMonth.toISOString())
          .not('clock_out_time', 'is', null);

        if (mVisits) {
          setMonthlyVisits(mVisits.length);
          let mins = 0;
          mVisits.forEach((v) => {
            mins += (new Date(v.clock_out_time).getTime() - new Date(v.clock_in_time).getTime()) / 60000;
          });
          setMonthlyHours(Math.round(mins / 60 * 10) / 10);
        }

        const { data: allVisits } = await supabase
          .from('visits')
          .select('clock_in_time, clock_out_time')
          .eq('caregiver_id', user!.id)
          .not('clock_out_time', 'is', null);

        if (allVisits) {
          setTotalVisits(allVisits.length);
          let mins = 0;
          allVisits.forEach((v) => {
            mins += (new Date(v.clock_out_time).getTime() - new Date(v.clock_in_time).getTime()) / 60000;
          });
          setTotalHours(Math.round(mins / 60 * 10) / 10);
        }

        const { data: appreciationData } = await api.appreciation.getHistory(user!.id);
        if (appreciationData) {
          setAppreciationTotal(appreciationData.total);
          setAppreciationThisMonth(appreciationData.thisMonth);
        }

        const { data: recent } = await supabase
          .from('visits')
          .select('id, clock_in_time, clock_out_time, recipients(first_name, relationship)')
          .eq('caregiver_id', user!.id)
          .not('clock_out_time', 'is', null)
          .order('created_at', { ascending: false })
          .limit(10);
        if (recent) setRecentVisits(recent);
      } catch (e) {
        console.error('[Earnings]', e);
      }
      setLoading(false);
    }
    if (user?.id) load();
  }, [user?.id]);

  const formatDuration = (clockIn: string, clockOut: string) => {
    const ms = new Date(clockOut).getTime() - new Date(clockIn).getTime();
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{ color: Colors.primary, fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>

          <Text style={[Typography.sectionLabel, { color: Colors.success }]}>EARNINGS</Text>
          <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4 }]}>
            Your Care History
          </Text>
          <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4, marginBottom: 24 }]}>
            Track your visits, hours, and appreciation received.
          </Text>

          {loading ? (
            <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
          ) : (
            <>
              {/* This Month */}
              <Text style={[Typography.sectionLabel, { color: Colors.textMuted, marginBottom: 12 }]}>
                THIS MONTH
              </Text>
              <View style={styles.statsGrid}>
                <Card variant="glass" padding="md" style={styles.statCard}>
                  <Text style={[Typography.display, { color: Colors.primary, fontSize: 28 }]}>{monthlyVisits}</Text>
                  <Text style={styles.statLabel}>Visits</Text>
                </Card>
                <Card variant="glass" padding="md" style={styles.statCard}>
                  <Text style={[Typography.display, { color: Colors.accent.orange, fontSize: 28 }]}>{monthlyHours}h</Text>
                  <Text style={styles.statLabel}>Hours</Text>
                </Card>
                <Card variant="glass" padding="md" style={styles.statCard}>
                  <Text style={[Typography.display, { color: Colors.accent.purple, fontSize: 28 }]}>${appreciationThisMonth}</Text>
                  <Text style={styles.statLabel}>Appreciated</Text>
                </Card>
              </View>

              {/* All Time */}
              <Text style={[Typography.sectionLabel, { color: Colors.textMuted, marginTop: 24, marginBottom: 12 }]}>
                ALL TIME
              </Text>
              <Card variant="glass" style={{ marginBottom: 24 }}>
                <View style={styles.allTimeRow}>
                  <View style={styles.allTimeStat}>
                    <Text style={[Typography.h2, { color: Colors.textPrimary }]}>{totalVisits}</Text>
                    <Text style={[Typography.caption, { color: Colors.textMuted }]}>Total Visits</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.allTimeStat}>
                    <Text style={[Typography.h2, { color: Colors.textPrimary }]}>{totalHours}h</Text>
                    <Text style={[Typography.caption, { color: Colors.textMuted }]}>Total Hours</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.allTimeStat}>
                    <Text style={[Typography.h2, { color: Colors.textPrimary }]}>${appreciationTotal}</Text>
                    <Text style={[Typography.caption, { color: Colors.textMuted }]}>Appreciated</Text>
                  </View>
                </View>
              </Card>

              {/* Recent Visits */}
              <Text style={[Typography.sectionLabel, { color: Colors.textMuted, marginBottom: 12 }]}>
                RECENT VISITS
              </Text>
              {recentVisits.map((v) => (
                <Card key={v.id} variant="glass" padding="sm" style={{ marginBottom: 8 }}>
                  <View style={styles.visitRow}>
                    <View style={styles.visitDot} />
                    <View style={{ flex: 1 }}>
                      <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                        {v.recipients?.first_name || 'Visit'}
                      </Text>
                      <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 2 }]}>
                        {format(new Date(v.clock_in_time), 'EEE, MMM d · h:mm a')}
                      </Text>
                    </View>
                    <Text style={[Typography.h3, { color: Colors.primary }]}>
                      {formatDuration(v.clock_in_time, v.clock_out_time)}
                    </Text>
                  </View>
                </Card>
              ))}

              {recentVisits.length === 0 && (
                <View style={styles.emptyState}>
                  <IconComfort size={48} color={Colors.textMuted} strokeWidth={1.5} />
                  <Text style={[Typography.h3, { color: Colors.textSecondary, marginTop: 20 }]}>
                    No completed visits yet
                  </Text>
                </View>
              )}
            </>
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
  statsGrid: { flexDirection: 'row', gap: Layout.spacing.sm },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 20 },
  statLabel: { ...Typography.micro, color: Colors.textMuted, marginTop: 6, textTransform: 'uppercase', letterSpacing: 1 },
  allTimeRow: { flexDirection: 'row', alignItems: 'center' },
  allTimeStat: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  divider: { width: 1, height: 32, backgroundColor: Colors.border.subtle },
  visitRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: Layout.spacing.sm },
  visitDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  emptyState: { alignItems: 'center', marginTop: 48 },
});
