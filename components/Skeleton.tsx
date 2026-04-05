/**
 * Skeleton — Loading placeholder with shimmer effect
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = Layout.radius.sm,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: Colors.surface,
          opacity,
        },
        style,
      ]}
    />
  );
}

/** Card-shaped skeleton for loading states */
export function SkeletonCard({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardHeader}>
        <Skeleton width={120} height={14} />
        <Skeleton width={60} height={14} />
      </View>
      <Skeleton width="80%" height={12} style={{ marginTop: 12 }} />
      <View style={styles.cardFooter}>
        <Skeleton width={60} height={20} />
        <Skeleton width={40} height={20} />
      </View>
    </View>
  );
}

/** Stat card skeleton */
export function SkeletonStat({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.stat, style]}>
      <Skeleton width={48} height={28} borderRadius={6} />
      <Skeleton width={40} height={10} style={{ marginTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.card,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: Layout.spacing.xl,
    marginTop: 16,
  },
  stat: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.card,
    padding: Layout.spacing.lg,
    alignItems: 'center',
    paddingVertical: 20,
  },
});
