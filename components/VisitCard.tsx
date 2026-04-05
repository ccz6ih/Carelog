/**
 * VisitCard — Shows a completed visit with EVV status
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

const statusConfig: Record<EVVStatus, { label: string; color: string }> = {
  idle: { label: 'Idle', color: Colors.textMuted },
  clocked_in: { label: 'In Progress', color: Colors.evv.clockedIn },
  clocked_out: { label: 'Pending', color: Colors.evv.pending },
  submitted: { label: '✓ Submitted', color: Colors.evv.submitted },
  error: { label: '✕ Error', color: Colors.evv.error },
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
    <Card
      borderColor={status.color}
      style={{ marginBottom: Layout.spacing.md }}
    >
      <View style={styles.header}>
        <View>
          <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
            {recipientName}
          </Text>
          <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>
            {date}
          </Text>
        </View>
        <Badge label={status.label} color={status.color} />
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={[Typography.h3, { color: Colors.primary }]}>{duration}</Text>
          <Text style={[Typography.caption, { color: Colors.textMuted }]}>Duration</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[Typography.h3, { color: Colors.accent.orange }]}>{tasksCompleted}</Text>
          <Text style={[Typography.caption, { color: Colors.textMuted }]}>Tasks</Text>
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
  stats: {
    flexDirection: 'row',
    gap: Layout.spacing.xl,
  },
  stat: {
    gap: 2,
  },
});
