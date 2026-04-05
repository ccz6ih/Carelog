/**
 * VisitCard — Refined visit display with status indicator
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { EVVStatus } from '@/types';

interface VisitCardProps {
  recipientName: string;
  date: string;
  duration: string;
  tasksCompleted: number;
  evvStatus: EVVStatus;
}

const statusConfig: Record<EVVStatus, { label: string; color: string; icon: string }> = {
  idle: { label: 'Idle', color: Colors.textMuted, icon: '○' },
  clocked_in: { label: 'In Progress', color: Colors.evv.clockedIn, icon: '◉' },
  clocked_out: { label: 'Pending', color: Colors.evv.pending, icon: '◔' },
  submitted: { label: 'Submitted', color: Colors.evv.submitted, icon: '✓' },
  error: { label: 'Retry', color: Colors.evv.error, icon: '!' },
};

export default function VisitCard({
  recipientName,
  date,
  duration,
  tasksCompleted,
  evvStatus,
}: VisitCardProps) {
  const status = statusConfig[evvStatus];

  return (
    <Card style={{ marginBottom: Layout.spacing.md }}>
      <View style={styles.header}>
        {/* Status dot + name */}
        <View style={styles.titleRow}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <View style={{ flex: 1 }}>
            <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
              {recipientName}
            </Text>
            <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 3 }]}>
              {date}
            </Text>
          </View>
        </View>
        <Badge label={status.label} color={status.color} variant="dot" size="sm" />
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[Typography.h3, { color: Colors.textPrimary, fontWeight: '700' }]}>
            {duration}
          </Text>
          <Text style={[Typography.micro, { color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 }]}>
            Duration
          </Text>
        </View>

        {tasksCompleted > 0 && (
          <View style={styles.stat}>
            <Text style={[Typography.h3, { color: Colors.textPrimary, fontWeight: '700' }]}>
              {tasksCompleted}
            </Text>
            <Text style={[Typography.micro, { color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 }]}>
              Tasks
            </Text>
          </View>
        )}

        <View style={styles.stat}>
          <Text style={[Typography.h3, { color: status.color, fontWeight: '700' }]}>
            {status.icon}
          </Text>
          <Text style={[Typography.micro, { color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 }]}>
            EVV
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Layout.spacing.xl,
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
  },
  stat: {
    gap: 4,
  },
});
