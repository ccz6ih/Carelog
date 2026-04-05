/**
 * Feature Card — Value Proposition Cards
 * 3-up grid on desktop, stacked on mobile
 */
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

export default function FeatureCard({ icon, title, description, badge, badgeColor }: FeatureCardProps) {
  return (
    <Card padding="lg" style={styles.card}>
      <View style={styles.iconContainer}>{icon}</View>
      
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {badge && (
          <Badge
            label={badge}
            color={badgeColor || Colors.primary}
            variant="dot"
            size="sm"
          />
        )}
      </View>

      <Text style={styles.description}>{description}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 280 : undefined,
    maxWidth: Platform.OS === 'web' ? 380 : undefined,
    alignItems: 'center' as 'center',
  },
  iconContainer: {
    marginBottom: Layout.spacing.lg,
    padding: Layout.spacing.md,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}15`,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
