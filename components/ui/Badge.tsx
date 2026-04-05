/**
 * CareLog Badge — status indicators, tier labels
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

interface BadgeProps {
  label: string;
  color?: string;
  variant?: 'filled' | 'outline';
}

export default function Badge({ label, color = Colors.primary, variant = 'filled' }: BadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        variant === 'filled'
          ? { backgroundColor: color + '22' }
          : { borderWidth: 1, borderColor: color },
      ]}
    >
      <Text style={[Typography.caption, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
});
