/**
 * Hero Section — Landing Page
 * "Get Paid. Stay Compliant. Feel Seen."
 * Gradient background with hand-drawn caregiver illustration
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconCaregiver } from '@/components/icons/CareIcons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Button from '@/components/ui/Button';

interface HeroProps {
  onStartTrial: () => void;
  onLearnMore: () => void;
}

export default function Hero({ onStartTrial, onLearnMore }: HeroProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0B1622', '#0F2438', '#0B1622']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Mesh accent (teal/purple glow) */}
        <View style={styles.meshOverlay}>
          <LinearGradient
            colors={['rgba(0, 212, 170, 0.08)', 'rgba(155, 114, 232, 0.08)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <View style={styles.content}>
          {/* Illustration */}
          <View style={styles.illustration}>
            <IconCaregiver size={Platform.OS === 'web' ? 160 : 120} color={Colors.primary} strokeWidth={1.5} />
          </View>

          {/* Headline */}
          <Text style={styles.headline}>
            Get Paid. Stay Compliant.{'\n'}Feel Seen.
          </Text>

          {/* Subheadline */}
          <Text style={styles.subheadline}>
            The ONLY EVV tool built for individual family caregivers—not agencies.{'\n'}
            Auto-submit to Medicaid. Stop losing $1,500/year to EVV errors. Get family appreciation.
          </Text>

          {/* CTAs */}
          <View style={styles.ctaContainer}>
            <Button
              title="Start Free Trial"
              onPress={onStartTrial}
              variant="primary"
              size="lg"
              style={styles.primaryCta}
            />
            <Pressable onPress={onLearnMore} style={styles.secondaryCta}>
              <Text style={styles.secondaryCtaText}>See How It Works</Text>
            </Pressable>
          </View>

          {/* Trust badge */}
          <Text style={styles.trustBadge}>
            14-day free trial · No credit card required · HIPAA compliant
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: Platform.OS === 'web' ? 700 : 600,
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  meshOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.xxl * 2,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  illustration: {
    marginBottom: Layout.spacing.xxl,
    opacity: 0.95,
  },
  headline: {
    ...Typography.h1,
    fontSize: Platform.OS === 'web' ? 56 : 36,
    lineHeight: Platform.OS === 'web' ? 68 : 44,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
    fontWeight: '700',
  },
  subheadline: {
    ...Typography.body,
    fontSize: Platform.OS === 'web' ? 20 : 16,
    lineHeight: Platform.OS === 'web' ? 32 : 24,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xxl,
    maxWidth: 680,
  },
  ctaContainer: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: 'center',
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
  },
  primaryCta: {
    minWidth: Platform.OS === 'web' ? 200 : undefined,
    ...Platform.select({
      web: {
        // @ts-ignore
        boxShadow: '0 8px 24px rgba(0, 212, 170, 0.3)',
      },
    }),
  },
  secondaryCta: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
  },
  secondaryCtaText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  trustBadge: {
    ...Typography.bodySm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
