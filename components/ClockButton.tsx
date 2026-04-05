/**
 * ClockButton — CareLog's hero interaction
 * Concentric rings with breathing glow. One tap for full EVV compliance.
 */
import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';

interface ClockButtonProps {
  isClockedIn: boolean;
  elapsedTime: string;
  recipientName: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function ClockButton({
  isClockedIn,
  elapsedTime,
  recipientName,
  onPress,
  disabled = false,
  loading = false,
}: ClockButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const ringRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isClockedIn) {
      // Breathing pulse
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.04,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      // Glow intensity
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      glow.start();

      // Slow ring rotation
      const rotate = Animated.loop(
        Animated.timing(ringRotation, {
          toValue: 1,
          duration: 20000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      rotate.start();

      return () => {
        pulse.stop();
        glow.stop();
        rotate.stop();
      };
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
      ringRotation.setValue(0);
    }
  }, [isClockedIn]);

  const handlePress = () => {
    if (disabled || loading) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    onPress();
  };

  const SIZE = Layout.clockButton.size;
  const OUTER_RING = SIZE + 48;
  const MIDDLE_RING = SIZE + 24;

  const spin = ringRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Outermost glow ring */}
      {isClockedIn && (
        <Animated.View
          style={[
            styles.outerGlow,
            {
              width: OUTER_RING,
              height: OUTER_RING,
              borderRadius: OUTER_RING / 2,
              opacity: glowAnim,
              transform: [{ rotate: spin }],
            },
          ]}
        />
      )}

      {/* Middle ring */}
      <Animated.View
        style={[
          styles.middleRing,
          {
            width: MIDDLE_RING,
            height: MIDDLE_RING,
            borderRadius: MIDDLE_RING / 2,
            borderColor: isClockedIn
              ? Colors.primary + '30'
              : Colors.primary + '10',
          },
        ]}
      />

      {/* Main button */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={disabled || loading ? 1 : 0.85}
          disabled={disabled || loading}
          style={[
            styles.button,
            {
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2,
              opacity: disabled || loading ? 0.5 : 1,
            },
            isClockedIn && Layout.shadow.glow(Colors.primary),
          ]}
        >
          <LinearGradient
            colors={
              isClockedIn
                ? [Colors.primary + '20', Colors.primary + '08']
                : [Colors.surface, Colors.backgroundCard]
            }
            style={[
              styles.buttonInner,
              {
                width: SIZE,
                height: SIZE,
                borderRadius: SIZE / 2,
                borderWidth: 2,
                borderColor: isClockedIn ? Colors.primary + '80' : Colors.primary + '25',
              },
            ]}
          >
            {isClockedIn ? (
              <>
                <Text style={styles.timerText}>{elapsedTime}</Text>
                <View style={styles.statusRow}>
                  <View style={styles.liveDot} />
                  <Text style={styles.statusText}>{recipientName}</Text>
                </View>
                <Text style={styles.actionHint}>Tap to Clock Out</Text>
              </>
            ) : (
              <>
                <View style={styles.playIcon}>
                  <View style={styles.playTriangle} />
                </View>
                <Text style={styles.clockInText}>Clock In</Text>
                <Text style={styles.subText}>GPS + EVV auto-capture</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  outerGlow: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: Colors.primary + '25',
    borderStyle: 'dashed',
  },
  middleRing: {
    position: 'absolute',
    borderWidth: 1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    ...Typography.display,
    color: Colors.primary,
    fontSize: 34,
    letterSpacing: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  statusText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  actionHint: {
    ...Typography.micro,
    color: Colors.primary,
    marginTop: 10,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  playIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderLeftColor: Colors.primary,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 3,
  },
  clockInText: {
    ...Typography.h2,
    color: Colors.primary,
    fontWeight: '700',
  },
  subText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
