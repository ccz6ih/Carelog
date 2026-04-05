/**
 * ClockButton — CareLog's hero interaction
 * Large pulsing circle. Tap to clock in. Tap again to clock out + auto-submit.
 * The entire EVV compliance flow in one gesture.
 */
import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';

interface ClockButtonProps {
  isClockedIn: boolean;
  elapsedTime: string;
  recipientName: string;
  onPress: () => void;
}

export default function ClockButton({
  isClockedIn,
  elapsedTime,
  recipientName,
  onPress,
}: ClockButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isClockedIn) {
      // Gentle pulse when clocked in — breathing effect
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      // Glow ring animation
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.8,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      glow.start();

      return () => {
        pulse.stop();
        glow.stop();
      };
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0.3);
    }
  }, [isClockedIn]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };

  const SIZE = Layout.clockButton.size;

  return (
    <View style={styles.container}>
      {/* Outer glow ring */}
      {isClockedIn && (
        <Animated.View
          style={[
            styles.glowRing,
            {
              width: SIZE + 40,
              height: SIZE + 40,
              borderRadius: (SIZE + 40) / 2,
              opacity: glowAnim,
            },
          ]}
        />
      )}

      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.85}
          style={[
            styles.button,
            {
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2,
              borderColor: isClockedIn ? Colors.evv.clockedIn : Colors.primary,
              backgroundColor: isClockedIn
                ? Colors.evv.clockedIn + '15'
                : Colors.primary + '10',
            },
          ]}
        >
          {isClockedIn ? (
            <>
              <Text style={styles.timerText}>{elapsedTime}</Text>
              <Text style={styles.statusText}>Visiting {recipientName}</Text>
              <Text style={styles.actionHint}>Tap to Clock Out</Text>
            </>
          ) : (
            <>
              <Text style={styles.clockInIcon}>▶</Text>
              <Text style={styles.clockInText}>Clock In</Text>
              <Text style={styles.subText}>GPS + EVV capture</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  glowRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.evv.clockedIn,
  },
  button: {
    borderWidth: Layout.clockButton.borderWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    ...Typography.heroStat,
    color: Colors.evv.clockedIn,
    fontSize: 36,
  },
  statusText: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  actionHint: {
    ...Typography.caption,
    color: Colors.evv.clockedIn,
    marginTop: 8,
    opacity: 0.8,
  },
  clockInIcon: {
    fontSize: 36,
    color: Colors.primary,
    marginBottom: 8,
  },
  clockInText: {
    ...Typography.h2,
    color: Colors.primary,
  },
  subText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
