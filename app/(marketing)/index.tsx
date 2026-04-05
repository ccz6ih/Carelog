/**
 * CareLog Marketing Landing Page
 * Modern 2026 design with clinical caring aesthetic
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Hero from '@/components/marketing/Hero';
import FeatureCard from '@/components/marketing/FeatureCard';
import Timeline from '@/components/marketing/Timeline';
import NavBar from '@/components/marketing/NavBar';
import Footer from '@/components/marketing/Footer';
import { IconVisit, IconHeart, IconComfort } from '@/components/icons/CareIcons';
import LoginScreen from '@/app/(auth)/login';

const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: 'Sign Up',
    description: 'Add your care recipient and Medicaid provider info (takes 2 minutes)',
  },
  {
    number: 2,
    title: 'Clock In',
    description: 'GPS-verified check-in with one tap when you start providing care',
  },
  {
    number: 3,
    title: 'Provide Care',
    description: 'Log tasks, take photos, add notes—family gets real-time notifications',
  },
  {
    number: 4,
    title: 'Clock Out',
    description: 'We automatically submit the 6 EVV data points to your state aggregator',
  },
  {
    number: 5,
    title: 'Get Paid & Appreciated',
    description: 'On-time Medicaid payments + family can send appreciation via Venmo/Zelle',
  },
];

export default function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleStartTrial = () => {
    setShowLoginModal(true);
  };

  const handleLearnMore = () => {
    // Smooth scroll to "how it works" section
    // Note: Works on web; on native would need ref-based scrollTo
  };

  return (
    <View style={styles.container}>
      {/* Navigation */}
      <NavBar
        onLoginPress={() => setShowLoginModal(true)}
        onSignUpPress={() => setShowLoginModal(true)}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Hero onStartTrial={handleStartTrial} onLearnMore={handleLearnMore} />

        {/* Value Props Section */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>The Only EVV Tool Built for Individual Caregivers</Text>
            <Text style={styles.sectionSubtitle}>
              Not for agencies. Not for corporations. Built for you—the family member caring for Mom, Dad, or your loved one.
            </Text>

            <View style={styles.featuresGrid}>
              <FeatureCard
                icon={<IconVisit size={48} color={Colors.primary} strokeWidth={2} />}
                title="Auto-Submit EVV"
                description="Clock in, clock out. We handle the 6 EVV data points and submit to your state Medicaid aggregator automatically."
                badge="37 States"
                badgeColor={Colors.success}
              />
              <FeatureCard
                icon={<IconHeart size={48} color={Colors.accent.pink} strokeWidth={2} />}
                title="Family Portal"
                description="Zero extra data entry. Family members see the same visit data you already capture—real-time updates, task logs, photos—and can send appreciation directly to you."
                badge="Stay Connected"
                badgeColor={Colors.accent.pink}
              />
              <FeatureCard
                icon={<IconComfort size={48} color={Colors.accent.orange} strokeWidth={2} />}
                title="Works Offline"
                description="Poor connectivity? No problem. Clock in/out offline. We store visits locally and auto-submit when you're back online. Rural caregivers never lose a visit."
                badge="Retry Queue"
                badgeColor={Colors.primary}
              />
            </View>
          </View>
        </View>

        {/* How It Works Section */}
        <View style={[styles.section, styles.darkSection]}>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <Text style={styles.sectionSubtitle}>
              From signup to getting paid—simplified in 5 steps
            </Text>

            <Timeline steps={HOW_IT_WORKS_STEPS} />
          </View>
        </View>

        {/* Social Proof Section */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <Card padding="lg" style={styles.socialProofCard}>
              <Text style={styles.socialProofNumber}>$1,500</Text>
              <Text style={styles.socialProofText}>
                Average amount family caregivers lose per year to EVV errors. CareLog prevents this.
              </Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>★★★★★</Text>
                <Text style={styles.ratingText}>99%+ auto-submit success rate</Text>
              </View>
              <Text style={[styles.socialProofText, { marginTop: Layout.spacing.md }]}>
                Supporting caregivers in NY CDPAP (200K+), FL, CA, TX, OH, PA + 31 more states
              </Text>
            </Card>
          </View>
        </View>

        {/* Aggregator Trust Section */}
        <View style={[styles.section, styles.trustSection]}>
          <View style={styles.sectionContent}>
            <Text style={styles.trustTitle}>Integrated with Leading EVV Aggregators</Text>
            <View style={styles.aggregatorGrid}>
              <AggregatorBadge name="HHAeXchange" />
              <AggregatorBadge name="Sandata" />
              <AggregatorBadge name="Tellus" />
              <AggregatorBadge name="ProviderOne" />
            </View>
          </View>
        </View>

        {/* Final CTA Section */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <Card padding="lg" style={styles.ctaCard}>
              <Text style={styles.ctaTitle}>Stop Losing Money to EVV Errors</Text>
              <Text style={styles.ctaSubtitle}>
                Join the only EVV tool built for family caregivers. Free Family Portal included.
              </Text>
              <Button
                title="Start Your Free Trial"
                onPress={handleStartTrial}
                variant="primary"
                size="lg"
                style={styles.ctaButton}
              />
              <Text style={styles.ctaFootnote}>
                No credit card required · 14-day free trial · Cancel anytime
              </Text>
            </Card>
          </View>
        </View>

        {/* Footer */}
        <Footer />
      </ScrollView>

      {/* Login/Signup Modal */}
      {Platform.OS === 'web' && (
        <Modal
          visible={showLoginModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLoginModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <LoginScreen />
              <Button
                title="Close"
                onPress={() => setShowLoginModal(false)}
                variant="ghost"
                style={{ marginTop: Layout.spacing.md }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

function AggregatorBadge({ name }: { name: string }) {
  return (
    <View style={styles.aggregatorBadge}>
      <Text style={styles.aggregatorName}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingVertical: Layout.spacing.xxl * 2,
    paddingHorizontal: Layout.spacing.lg,
  },
  darkSection: {
    backgroundColor: Colors.surface,
  },
  sectionContent: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  sectionTitle: {
    ...Typography.h1,
    fontSize: Platform.OS === 'web' ? 42 : 32,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  sectionSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xxl,
    maxWidth: 600,
    alignSelf: 'center',
  },
  featuresGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: Layout.spacing.lg,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  socialProofCard: {
    alignItems: 'center',
    ...Platform.select({
      web: {
        // @ts-ignore
        boxShadow: '0 12px 32px rgba(0, 212, 170, 0.15)',
      },
    }),
  },
  socialProofNumber: {
    ...Typography.h1,
    fontSize: Platform.OS === 'web' ? 64 : 48,
    color: Colors.primary,
    fontWeight: '700',
  },
  socialProofText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Layout.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginTop: Layout.spacing.md,
  },
  rating: {
    fontSize: 24,
    color: Colors.accent.orange,
  },
  ratingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  trustSection: {
    backgroundColor: Colors.background,
  },
  trustTitle: {
    ...Typography.h3,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  aggregatorGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: Layout.spacing.md,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  aggregatorBadge: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  aggregatorName: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  ctaCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  ctaTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  ctaSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  ctaButton: {
    minWidth: Platform.OS === 'web' ? 240 : undefined,
  },
  ctaFootnote: {
    ...Typography.bodySm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Layout.spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: Layout.spacing.lg,
  },
});
