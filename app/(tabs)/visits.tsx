/**
 * CareLog Visits Screen — Visit history with EVV status
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { format } from 'date-fns';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import VisitCard from '@/components/VisitCard';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/services/supabase';
import type { EVVStatus } from '@/types';

interface VisitRow {
  id: string;
  recipient_id: string;
  clock_in_time: string;
  clock_out_time: string | null;
  evv_status: EVVStatus;
  recipients: { first_name: string; last_name: string; relationship: string } | null;
}

export default function VisitsScreen() {
  const user = useAppStore((s) => s.user);
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVisits() {
      const { data } = await supabase
        .from('visits')
        .select('id, recipient_id, clock_in_time, clock_out_time, evv_status, recipients(first_name, last_name, relationship)')
        .eq('caregiver_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) setVisits(data as VisitRow[]);
      setLoading(false);
    }
    if (user?.id) loadVisits();
  }, [user?.id]);

  const formatVisitDate = (clockIn: string, clockOut: string | null) => {
    const inDate = new Date(clockIn);
    const dateStr = format(inDate, 'EEE, MMM d');
    const inTime = format(inDate, 'h:mm a');
    if (!clockOut) return `${dateStr} · ${inTime} – In Progress`;
    const outTime = format(new Date(clockOut), 'h:mm a');
    return `${dateStr} · ${inTime} – ${outTime}`;
  };

  const formatDuration = (clockIn: string, clockOut: string | null) => {
    if (!clockOut) return '—';
    const ms = new Date(clockOut).getTime() - new Date(clockIn).getTime();
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const getRecipientName = (r: VisitRow['recipients']) => {
    if (!r) return 'Unknown';
    const rel = r.relationship ? r.relationship.charAt(0).toUpperCase() + r.relationship.slice(1) : '';
    return rel ? `${rel} (${r.first_name})` : `${r.first_name} ${r.last_name}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Typography.sectionLabel, { color: Colors.primary }]}>VISIT HISTORY</Text>
        <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4, marginBottom: 24 }]}>
          Your Visits
        </Text>

        {loading ? (
          <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
        ) : visits.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>📋</Text>
            <Text style={[Typography.h3, { color: Colors.textSecondary, marginTop: 16 }]}>
              No visits yet
            </Text>
            <Text style={[Typography.bodySm, { color: Colors.textMuted, marginTop: 8, textAlign: 'center' }]}>
              Clock in from the Dashboard to start your first visit.
            </Text>
          </View>
        ) : (
          visits.map((visit) => (
            <VisitCard
              key={visit.id}
              recipientName={getRecipientName(visit.recipients)}
              date={formatVisitDate(visit.clock_in_time, visit.clock_out_time)}
              duration={formatDuration(visit.clock_in_time, visit.clock_out_time)}
              tasksCompleted={0}
              evvStatus={visit.evv_status}
            />
          ))
        )}
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
});
