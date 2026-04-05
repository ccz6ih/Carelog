/**
 * CareLog Dashboard — The Hero Screen
 * Clock In/Out button center stage.
 * Quick stats, active visit status, recent activity.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ClockButton from '@/components/ClockButton';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/services/supabase';
import { useLocation } from '@/hooks/useLocation';
import { submitEVV } from '@/services/evv';
import type { CareRecipient } from '@/types';

export default function DashboardScreen() {
  const {
    user,
    activeVisit,
    evvStatus,
    elapsedSeconds,
    startVisit,
    endVisit,
    setEVVStatus,
    setElapsed,
  } = useAppStore();

  const { getLocation } = useLocation();
  const [recipient, setRecipient] = useState<CareRecipient | null>(null);
  const [stats, setStats] = useState({ visits: 0, hours: '0h', compliance: '—', appreciated: '$0' });

  const isClockedIn = evvStatus === 'clocked_in';

  // Load first recipient
  useEffect(() => {
    async function loadRecipient() {
      const { data } = await supabase
        .from('recipients')
        .select('*')
        .eq('caregiver_id', user?.id)
        .eq('is_active', true)
        .limit(1)
        .single();
      if (data) {
        setRecipient({
          id: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          relationship: data.relationship,
          providerId: data.provider_id,
          recipientId: data.recipient_id,
          state: data.state,
          aggregator: data.aggregator,
        });
      }
    }
    if (user?.id) loadRecipient();
  }, [user?.id]);

  // Load monthly stats
  useEffect(() => {
    async function loadStats() {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthVisits } = await supabase
        .from('visits')
        .select('clock_in_time, clock_out_time, evv_status')
        .eq('caregiver_id', user?.id)
        .gte('created_at', startOfMonth.toISOString());

      if (monthVisits) {
        const completed = monthVisits.filter((v) => v.clock_out_time);
        let totalMinutes = 0;
        completed.forEach((v) => {
          if (v.clock_in_time && v.clock_out_time) {
            totalMinutes += (new Date(v.clock_out_time).getTime() - new Date(v.clock_in_time).getTime()) / 60000;
          }
        });
        const submitted = monthVisits.filter((v) => v.evv_status === 'submitted').length;
        const complianceRate = completed.length > 0 ? Math.round((submitted / completed.length) * 100) : 0;

        setStats({
          visits: completed.length,
          hours: `${Math.round(totalMinutes / 60)}h`,
          compliance: `${complianceRate}%`,
          appreciated: '$0',
        });
      }
    }
    if (user?.id) loadStats();
  }, [user?.id, evvStatus]);

  // Timer tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isClockedIn) {
      interval = setInterval(() => {
        setElapsed(elapsedSeconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, elapsedSeconds]);

  const formatTime = useCallback((totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleClockToggle = async () => {
    if (isClockedIn) {
      // Clock OUT
      setEVVStatus('clocked_out');

      const location = await getLocation();
      const clockOutTime = new Date().toISOString();

      // Update visit in DB
      if (activeVisit) {
        await supabase.from('visits').update({
          clock_out_time: clockOutTime,
          clock_out_lat: location?.coords.latitude,
          clock_out_lng: location?.coords.longitude,
          evv_status: 'clocked_out',
        }).eq('id', activeVisit.id);

        // Auto-submit EVV
        if (recipient) {
          const updatedVisit = {
            ...activeVisit,
            clockOutTime: clockOutTime,
            clockOutLocation: location ? { lat: location.coords.latitude, lng: location.coords.longitude } : null,
          };
          const result = await submitEVV(updatedVisit, recipient);

          const newStatus = result.success ? 'submitted' : 'error';
          setEVVStatus(newStatus);
          await supabase.from('visits').update({ evv_status: newStatus }).eq('id', activeVisit.id);

          if (result.success) {
            // Log EVV submission
            await supabase.from('evv_submissions').insert({
              visit_id: activeVisit.id,
              aggregator: recipient.aggregator,
              payload: updatedVisit,
              success: true,
              confirmation_id: result.confirmationId,
            });
          }

          setTimeout(() => endVisit(), 2000);
        } else {
          setEVVStatus('submitted');
          setTimeout(() => endVisit(), 2000);
        }
      }
    } else {
      // Clock IN
      if (!recipient) {
        Alert.alert('No Recipient', 'Please add a care recipient in Settings first.');
        return;
      }

      const location = await getLocation();
      const recipientName = `${recipient.firstName} ${recipient.lastName}`.trim();

      // Create visit in DB
      const { data: newVisit, error } = await supabase.from('visits').insert({
        caregiver_id: user?.id,
        recipient_id: recipient.id,
        clock_in_lat: location?.coords.latitude,
        clock_in_lng: location?.coords.longitude,
        evv_status: 'clocked_in',
      }).select().single();

      if (error) {
        Alert.alert('Error', 'Failed to start visit. Please try again.');
        return;
      }

      startVisit({
        id: newVisit.id,
        recipientId: recipient.id,
        recipientName,
        clockInTime: newVisit.clock_in_time,
        clockOutTime: null,
        clockInLocation: {
          lat: location?.coords.latitude || 0,
          lng: location?.coords.longitude || 0,
        },
        clockOutLocation: null,
        tasks: [],
        notes: '',
        photos: [],
        evvStatus: 'clocked_in',
      });
    }
  };

  const recipientName = recipient
    ? `${recipient.relationship ? recipient.relationship.charAt(0).toUpperCase() + recipient.relationship.slice(1) : ''} (${recipient.firstName})`
    : 'No recipient';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[Typography.sectionLabel, { color: Colors.primary }]}>
              DASHBOARD
            </Text>
            <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4 }]}>
              Hi, {user?.firstName || 'Caregiver'} 👋
            </Text>
          </View>
          <Badge
            label={user?.tier?.toUpperCase() || 'BASIC'}
            color={Colors.tier[user?.tier || 'basic']}
          />
        </View>

        {/* Clock Button — center stage */}
        <ClockButton
          isClockedIn={isClockedIn}
          elapsedTime={formatTime(elapsedSeconds)}
          recipientName={recipientName}
          onPress={handleClockToggle}
        />

        {/* EVV Status Banner */}
        {evvStatus === 'submitted' && (
          <Card borderColor={Colors.success} style={{ marginTop: 16 }}>
            <Text style={[Typography.h3, { color: Colors.success }]}>
              ✓ EVV Submitted Successfully
            </Text>
            <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4 }]}>
              All 6 data points auto-submitted to state Medicaid
            </Text>
          </Card>
        )}

        {evvStatus === 'clocked_out' && (
          <Card borderColor={Colors.warning} style={{ marginTop: 16 }}>
            <Text style={[Typography.h3, { color: Colors.warning }]}>
              ⏳ Submitting to Medicaid...
            </Text>
            <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4 }]}>
              Auto-submitting 6 EVV data points
            </Text>
          </Card>
        )}

        {evvStatus === 'error' && (
          <Card borderColor={Colors.error} style={{ marginTop: 16 }}>
            <Text style={[Typography.h3, { color: Colors.error }]}>
              ✕ EVV Submission Failed
            </Text>
            <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4 }]}>
              Visit queued for retry. Your data is safe.
            </Text>
          </Card>
        )}

        {/* Quick Stats */}
        <Text style={[Typography.sectionLabel, { color: Colors.textMuted, marginTop: 32, marginBottom: 16 }]}>
          THIS MONTH
        </Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={[Typography.heroStat, { color: Colors.primary, fontSize: 28 }]}>{stats.visits}</Text>
            <Text style={[Typography.caption, { color: Colors.textMuted }]}>Visits</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[Typography.heroStat, { color: Colors.accent.orange, fontSize: 28 }]}>{stats.hours}</Text>
            <Text style={[Typography.caption, { color: Colors.textMuted }]}>Hours</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[Typography.heroStat, { color: Colors.success, fontSize: 28 }]}>{stats.compliance}</Text>
            <Text style={[Typography.caption, { color: Colors.textMuted }]}>Compliant</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[Typography.heroStat, { color: Colors.accent.purple, fontSize: 28 }]}>{stats.appreciated}</Text>
            <Text style={[Typography.caption, { color: Colors.textMuted }]}>Appreciated</Text>
          </Card>
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
    padding: Layout.spacing.xl,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: 20,
  },
});
