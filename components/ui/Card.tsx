/**
 * CareLog Card — Glassmorphic elevated surface
 * Frosted glass with subtle border glow, layered depth
 */
import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

interface CardProps {
  children: React.ReactNode;
  borderColor?: string;
  style?: ViewStyle;
  elevated?: boolean;
  variant?: 'default' | 'glass' | 'outline';
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  borderColor,
  style,
  elevated = false,
  variant = 'default',
  padding = 'md',
}: CardProps) {
  const paddingMap = {
    sm: Layout.spacing.md,
    md: Layout.spacing.lg,
    lg: Layout.spacing.xl,
  };

  const cardStyle = [
    styles.card,
    { padding: paddingMap[padding] },
    variant === 'glass' && styles.glass,
    variant === 'outline' && styles.outline,
    elevated && Layout.shadow.md,
    borderColor && { borderLeftWidth: 3, borderLeftColor: borderColor },
    style,
  ];

  if (variant === 'glass' && Platform.OS === 'web') {
    return (
      <View
        style={[
          cardStyle,
          {
            // @ts-ignore — web-only CSS
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          } as any,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.card,
  },
  glass: {
    backgroundColor: Colors.glass.background,
    borderColor: Colors.glass.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: Colors.border.cardHover,
  },
});
