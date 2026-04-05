/**
 * CareLog Card — matches pitch deck card style
 * Dark elevated surface with optional colored left border
 */
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

interface CardProps {
  children: React.ReactNode;
  borderColor?: string;
  style?: ViewStyle;
  elevated?: boolean;
}

export default function Card({
  children,
  borderColor,
  style,
  elevated = false,
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        borderColor && { borderLeftWidth: 3, borderLeftColor: borderColor },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.card,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
