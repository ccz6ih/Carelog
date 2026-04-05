/**
 * CareLog Badge — Status indicators with subtle glow
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';

interface BadgeProps {
  label: string;
  color?: string;
  variant?: 'filled' | 'outline' | 'dot';
  size?: 'sm' | 'md';
}

export default function Badge({
  label,
  color = Colors.primary,
  variant = 'filled',
  size = 'md',
}: BadgeProps) {
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        isSmall && styles.badgeSm,
        variant === 'filled' && { backgroundColor: color + '18' },
        variant === 'outline' && { borderWidth: 1, borderColor: color + '50' },
        variant === 'dot' && { backgroundColor: color + '18' },
      ]}
    >
      {variant === 'dot' && (
        <View style={[styles.dot, { backgroundColor: color }]} />
      )}
      <Text
        style={[
          isSmall ? Typography.micro : Typography.caption,
          { color, fontWeight: '600' },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Layout.radius.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
