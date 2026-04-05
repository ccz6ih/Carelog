/**
 * CareLog Compliance Dashboard
 * EVV submission history, success rates, retry status
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
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/services/supabase';
import { getQueueCount, processQueue } from '@/services/evvQueue';

interface SubmissionRow {
  id: string;
  visit_id: string;
  aggregator: string;
  success: boolean;
  retry_count: number;
  confirmation_id: string | null;
  error_message: string | null;
  created_at: string;
}

export default function ComplianceScreen() {
  const user = useAppStore((s) => s.user);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0, pending: 0 });
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const { data: visits } = await supabase
          .from('visits')
          .select('id')
          .eq('caregiver_id', user!.id);

        if (visits && visits.length > 0) {
          const visitIds = visits.map((v) => v.id);
          const { data: subs } = await supabase
            .from('evv_submissions')
            .select('*')
            .in('visit_id', visitIds)
            .order('created_at', { ascending: false })
            .limit(50);

          if (subs) {
            setSubmissions(subs);
            const successCount = subs.filter((s) => s.success).length;
            const failedCount = subs.filter((s) => !s.success).length;
            setStats({
              total: subs.length,
              success: successCount,
              failed: failedCount,
              pending: 0,
            });
          }
        }

        const count = await getQueueCount();
        setQueueCount(count);

        const { count: pendingCount } = await supabase
          .from('visits')
          .select('*', { count: 'exact', head: true })
          .eq('caregiver_id', user!.id)
          .in('evv_status', ['clocked_out', 'error']);
        setStats((prev) => ({ ...prev, pending: (pendingCount || 0) + count }));
      } catch (e) {
        console.error('[Compliance]', e);
      }
      setLoading(false);
    }
    if (user?.id) load();
  }, [user?.id]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  const successRate = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Back + Header */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{ color: Colors.primary, fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>

          <Text style={[Typography.sectionLabel, { color: Colors.primary }]}>COMPLIANCE</Text>
          <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4, marginBottom: 24 }]}>
            EVV Dashboard
          </Text>

          {loading ? (
            <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
          ) : (
            <>
              {/* Stats Cards */}
              <View style={styles.statsGrid}>
                <Card variant="glass" padding="md" style={styles.statCard}>
                  <Text style={[Typography.display, { color: Colors.primary, fontSize: 28 }]}>
                    {successRate}%
                  </Text>
                  <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 6, textTransform: 'uppercase', letterSpacing: 1 }]}>
                    Success Rate
                  </Text>
                </Card>
                <Card variant="glass" padding="md" style={styles.statCard}>
                  <Text style={[Typography.display, { color: Colors.success, fontSize: 28 }]}>
                    {stats.success}
                  </Text>
                  <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 6, textTransform: 'uppercase', letterSpacing: 1 }]}>
                    Submitted
                  </Text>
                </Card>
                <Card variant="glass" padding="md" style={styles.statCard}>
                  <Text style={[Typography.display, { color: Colors.warning, fontSize: 28 }]}>
                    {stats.pending}
                  </Text>
                  <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 6, textTransform: 'uppercase', letterSpacing: 1 }]}>
                    Pending
                  </Text>
                </Card>
                <Card variant="glass" padding="md" style={styles.statCard}>
                  <Text style={[Typography.display, { color: Colors.error, fontSize: 28 }]}>
                    {stats.failed}
                  </Text>
                  <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 6, textTransform: 'uppercase', letterSpacing: 1 }]}>
                    Failed
                  </Text>
                </Card>
              </View>

              {/* Queue status + retry */}
              {queueCount > 0 && (
                <Card borderColor={Colors.warning} style={{ marginTop: 16, marginBottom: 8 }}>
                  <View style={styles.queueBanner}>
                    <View style={[styles.queueIcon, { backgroundColor: Colors.warning + '20' }]}>
                      <Text style={{ color: Colors.warning, fontSize: 14 }}>↑</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[Typography.h3, { color: Colors.warning }]}>
                        {queueCount} in offline queue
                      </Text>
                      <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>
                        Will retry automatically when connected
                      </Text>
                    </View>
                  </View>
                  <Button
                    title="Retry Now"
                    variant="outline"
                    size="sm"
                    style={{ marginTop: 12 }}
                    onPress={async () => {
                      const result = await processQueue();
                      const count = await getQueueCount();
                      setQueueCount(count);
                      const msg = result.succeeded > 0
                        ? `${result.succeeded} submission${result.succeeded !== 1 ? 's' : ''} succeeded!`
                        : 'Retry attempted — submissions still pending.';
                      Platform.OS === 'web' ? alert(msg) : Alert.alert('Retry Complete', msg);
                    }}
                  />
                </Card>
              )}

              {/* Submission History */}
              <Text style={[Typography.sectionLabel, { color: Colors.textMuted, marginTop: 24, marginBottom: 16 }]}>
                SUBMISSION HISTORY
              </Text>

              {submissions.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={[Typography.h3, { color: Colors.textSecondary }]}>No submissions yet</Text>
                  <Text style={[Typography.bodySm, { color: Colors.textMuted, marginTop: 8, textAlign: 'center' }]}>
                    Complete a visit to see EVV submission history.
                  </Text>
                </View>
              ) : (
                submissions.map((sub) => (
                  <Card key={sub.id} variant="glass" padding="sm" style={{ marginBottom: 8 }}>
                    <View style={styles.submissionRow}>
                      <View style={[
                        styles.submissionDot,
                        { backgroundColor: sub.success ? Colors.success : Colors.error },
                      ]} />
                      <View style={{ flex: 1 }}>
                        <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                          {sub.aggregator.toUpperCase()}
                        </Text>
                        <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 2 }]}>
                          {formatDate(sub.created_at)}
                          {sub.retry_count > 0 && ` · Attempt ${sub.retry_count + 1}`}
                        </Text>
                        {sub.error_message && (
                          <Text style={[Typography.micro, { color: Colors.error, marginTop: 4 }]} numberOfLines={1}>
                            {sub.error_message}
                          </Text>
                        )}
                      </View>
                      <Badge
                        label={sub.success ? 'OK' : 'Failed'}
                        color={sub.success ? Colors.success : Colors.error}
                        variant="dot"
                        size="sm"
                      />
                    </View>
                  </Card>
                ))
              )}
            </>
          )}
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
    paddingBottom: 48,
  },
  content: {
    width: '100%',
    maxWidth: Layout.content.maxWidth,
    padding: Layout.spacing.lg,
    paddingTop: Platform.OS === 'web' ? 24 : 16,
  },
  backBtn: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  queueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  queueIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 32,
  },
  submissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: Layout.spacing.sm,
  },
  submissionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
