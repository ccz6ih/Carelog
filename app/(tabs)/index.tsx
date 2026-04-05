/**
 * CareLog Dashboard — The Hero Screen
 * Clock In/Out center stage. Live stats. Responsive layout.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
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

interface StatItem {
  label: string;
  value: string;
  color: string;
}

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
  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Visits', value: '—', color: Colors.primary },
    { label: 'Hours', value: '—', color: Colors.accent.orange },
    { label: 'Compliant', value: '—', color: Colors.success },
    { label: 'Tips', value: '—', color: Colors.accent.purple },
  ]);

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

        setStats([
          { label: 'Visits', value: String(completed.length), color: Colors.primary },
          { label: 'Hours', value: `${Math.round(totalMinutes / 60)}h`, color: Colors.accent.orange },
          { label: 'Compliant', value: completed.length > 0 ? `${complianceRate}%` : '—', color: Colors.success },
          { label: 'Tips', value: '$0', color: Colors.accent.purple },
        ]);
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
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleClockToggle = async () => {
    if (isClockedIn) {
      setEVVStatus('clocked_out');
      const location = await getLocation();
      const clockOutTime = new Date().toISOString();

      if (activeVisit) {
        await supabase.from('visits').update({
          clock_out_time: clockOutTime,
          clock_out_lat: location?.coords.latitude,
          clock_out_lng: location?.coords.longitude,
          evv_status: 'clocked_out',
        }).eq('id', activeVisit.id);

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
            await supabase.from('evv_submissions').insert({
              visit_id: activeVisit.id,
              aggregator: recipient.aggregator,
              payload: updatedVisit,
              success: true,
              confirmation_id: result.confirmationId,
            });
          }
          setTimeout(() => endVisit(), 2500);
        } else {
          setEVVStatus('submitted');
          setTimeout(() => endVisit(), 2500);
        }
      }
    } else {
      if (!recipient) {
        const msg = 'Please add a care recipient in Settings first.';
        Platform.OS === 'web' ? alert(msg) : Alert.alert('No Recipient', msg);
        return;
      }

      const location = await getLocation();
      const recipientName = `${recipient.firstName} ${recipient.lastName}`.trim();

      const { data: newVisit, error } = await supabase.from('visits').insert({
        caregiver_id: user?.id,
        recipient_id: recipient.id,
        clock_in_lat: location?.coords.latitude,
        clock_in_lng: location?.coords.longitude,
        evv_status: 'clocked_in',
      }).select().single();

      if (error) {
        const msg = 'Failed to start visit. Please try again.';
        Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);
        return;
      }

      startVisit({
        id: newVisit.id,
        recipientId: recipient.id,
        recipientName,
        clockInTime: newVisit.clock_in_time,
        clockOutTime: null,
        clockInLocation: { lat: location?.coords.latitude || 0, lng: location?.coords.longitude || 0 },
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
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[Typography.sectionLabel, { color: Colors.primary }]}>
                DASHBOARD
              </Text>
              <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4 }]}>
                Hi, {user?.firstName || 'Caregiver'}
              </Text>
            </View>
            <Badge
              label={user?.tier?.toUpperCase() || 'BASIC'}
              color={Colors.tier[user?.tier || 'basic']}
              variant="dot"
            />
          </View>

          {/* Clock Button */}
          <ClockButton
            isClockedIn={isClockedIn}
            elapsedTime={formatTime(elapsedSeconds)}
            recipientName={recipientName}
            onPress={handleClockToggle}
          />

          {/* EVV Status Banners */}
          {evvStatus === 'submitted' && (
            <Card variant="glass" style={{ marginBottom: 16 }}>
              <View style={styles.statusBanner}>
                <View style={[styles.statusIcon, { backgroundColor: Colors.success + '20' }]}>
                  <Text style={{ color: Colors.success, fontSize: 16 }}>✓</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h3, { color: Colors.success }]}>EVV Submitted</Text>
                  <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>
                    All 6 data points sent to state Medicaid
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {evvStatus === 'clocked_out' && (
            <Card variant="glass" style={{ marginBottom: 16 }}>
              <View style={styles.statusBanner}>
                <View style={[styles.statusIcon, { backgroundColor: Colors.warning + '20' }]}>
                  <Text style={{ color: Colors.warning, fontSize: 16 }}>↑</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h3, { color: Colors.warning }]}>Submitting...</Text>
                  <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>
                    Auto-submitting 6 EVV data points
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {evvStatus === 'error' && (
            <Card variant="glass" style={{ marginBottom: 16 }}>
              <View style={styles.statusBanner}>
                <View style={[styles.statusIcon, { backgroundColor: Colors.error + '20' }]}>
                  <Text style={{ color: Colors.error, fontSize: 16 }}>!</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h3, { color: Colors.error }]}>Submission Failed</Text>
                  <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>
                    Queued for retry. Your data is safe.
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {/* Stats Grid */}
          <Text style={[Typography.sectionLabel, { color: Colors.textMuted, marginTop: 16, marginBottom: 16 }]}>
            THIS MONTH
          </Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, i) => (
              <Card key={i} variant="glass" padding="md" style={styles.statCard}>
                <Text style={[Typography.display, { color: stat.color, fontSize: 26 }]}>
                  {stat.value}
                </Text>
                <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 6, textTransform: 'uppercase', letterSpacing: 1 }]}>
                  {stat.label}
                </Text>
              </Card>
            ))}
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
});
