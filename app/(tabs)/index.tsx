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
} from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ClockButton from '@/components/ClockButton';
import { useAppStore } from '@/store/useAppStore';

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

  const isClockedIn = evvStatus === 'clocked_in';

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
      // Clock OUT → auto-submit EVV
      setEVVStatus('clocked_out');
      // Simulate auto-submit
      setTimeout(() => {
        setEVVStatus('submitted');
        setTimeout(() => endVisit(), 2000);
      }, 1500);
    } else {
      // Clock IN
      startVisit({
        id: Date.now().toString(),
        recipientId: '1',
        recipientName: 'Mom (Dorothy)',
        clockInTime: new Date().toISOString(),
        clockOutTime: null,
        clockInLocation: { lat: 39.7392, lng: -104.9903 },
        clockOutLocation: null,
        tasks: [],
        notes: '',
        photos: [],
        evvStatus: 'clocked_in',
      });
    }
  };

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
          recipientName="Mom (Dorothy)"
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

        {/* Quick Stats */}
        <Text style={[Typography.sectionLabel, { color: Colors.textMuted, marginTop: 32, marginBottom: 16 }]}>
          THIS MONTH
        </Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={[Typography.heroStat, { color: Colors.primary, fontSize: 28 }]}>12</Text>
            <Text style={[Typography.caption, { color: Colors.textMuted }]}>Visits</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[Typography.heroStat, { color: Colors.accent.orange, fontSize: 28 }]}>48h</Text>
            <Text style={[Typography.caption, { color: Colors.textMuted }]}>Hours</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[Typography.heroStat, { color: Colors.success, fontSize: 28 }]}>100%</Text>
            <Text style={[Typography.caption, { color: Colors.textMuted }]}>Compliant</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[Typography.heroStat, { color: Colors.accent.purple, fontSize: 28 }]}>$75</Text>
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
