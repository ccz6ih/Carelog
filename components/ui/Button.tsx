/**
 * CareLog Button — Primary CTA component
 * Gradient teal on dark, matches pitch deck style
 */
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
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
}: ButtonProps) {
  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 16 },
    md: { paddingVertical: 14, paddingHorizontal: 24 },
    lg: { paddingVertical: 18, paddingHorizontal: 32 },
  };

  const textSizes = {
    sm: Typography.buttonSm,
    md: Typography.button,
    lg: Typography.button,
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[{ borderRadius: Layout.radius.md, overflow: 'hidden' }, style]}
      >
        <LinearGradient
          colors={disabled ? [Colors.textMuted, Colors.textMuted] : [Colors.primary, Colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.base, sizeStyles[size], disabled && styles.disabled]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textInverse} />
          ) : (
            <>
              {icon}
              <Text style={[textSizes[size], { color: Colors.textInverse }]}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.base,
        sizeStyles[size],
        variant === 'outline' && styles.outline,
        variant === 'secondary' && styles.secondary,
        disabled && styles.disabled,
        { borderRadius: Layout.radius.md },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? Colors.primary : Colors.textPrimary} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              textSizes[size],
              {
                color: variant === 'outline' ? Colors.primary : Colors.textPrimary,
              },
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  secondary: {
    backgroundColor: Colors.backgroundElevated,
  },
  disabled: {
    opacity: 0.5,
  },
});
