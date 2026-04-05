/**
 * CareLog Button — Enterprise-grade CTA
 * Gradient primary, glass secondary, crisp interactions
 */
import React from 'react';
import {
  TouchableOpacity,
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  Platform,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  fullWidth = false,
}: ButtonProps) {
  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: Layout.radius.sm },
    md: { paddingVertical: 14, paddingHorizontal: 28, borderRadius: Layout.radius.md },
    lg: { paddingVertical: 18, paddingHorizontal: 36, borderRadius: Layout.radius.md },
  };

  const textSizes = {
    sm: Typography.buttonSm,
    md: Typography.button,
    lg: Typography.button,
  };

  const Touchable = Platform.OS === 'web' ? Pressable : TouchableOpacity;

  if (variant === 'primary') {
    return (
      <Touchable
        onPress={onPress}
        disabled={disabled || loading}
        // @ts-ignore
        activeOpacity={0.85}
        style={[
          { borderRadius: sizeStyles[size].borderRadius, overflow: 'hidden' },
          fullWidth && { width: '100%' },
          disabled && styles.disabled,
          style,
        ]}
      >
        <LinearGradient
          colors={disabled
            ? [Colors.textMuted, Colors.textMuted]
            : Colors.gradient.primary as unknown as string[]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.base,
            sizeStyles[size],
            Layout.shadow.sm,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textInverse} size="small" />
          ) : (
            <View style={styles.content}>
              {icon}
              <Text style={[textSizes[size], styles.primaryText]}>{title}</Text>
            </View>
          )}
        </LinearGradient>
      </Touchable>
    );
  }

  const variantStyles = {
    secondary: {
      bg: Colors.surface,
      border: Colors.border.cardHover,
      textColor: Colors.textPrimary,
    },
    outline: {
      bg: 'transparent',
      border: Colors.primary + '60',
      textColor: Colors.primary,
    },
    ghost: {
      bg: 'transparent',
      border: 'transparent',
      textColor: Colors.textSecondary,
    },
  };

  const v = variantStyles[variant as keyof typeof variantStyles];

  return (
    <Touchable
      onPress={onPress}
      disabled={disabled || loading}
      // @ts-ignore
      activeOpacity={0.7}
      style={[
        styles.base,
        sizeStyles[size],
        {
          backgroundColor: v.bg,
          borderWidth: variant === 'ghost' ? 0 : 1.5,
          borderColor: v.border,
        },
        disabled && styles.disabled,
        fullWidth && { width: '100%' },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.textColor} size="small" />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={[textSizes[size], { color: v.textColor }]}>{title}</Text>
        </View>
      )}
    </Touchable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryText: {
    color: Colors.textInverse,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.4,
  },
});
