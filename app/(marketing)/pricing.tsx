/**
 * Pricing Page — Subscription Tiers with Stripe Checkout
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Modal, Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import NavBar from '@/components/marketing/NavBar';
import Footer from '@/components/marketing/Footer';
import LoginScreen from '@/app/(auth)/login';

type PricingTier = 'basic' | 'pro' | 'family';

interface TierFeature {
  text: string;
  included: boolean;
}

interface TierData {
  name: string;
  price: string;
  tagline: string;
  color: string;
  features: TierFeature[];
  ctaText: string;
  popular?: boolean;
}

const TIERS: Record<PricingTier, TierData> = {
  basic: {
    name: 'Basic',
    price: '$19.99',
    tagline: 'Essential EVV compliance for 1 caregiver',
    color: Colors.primary,
    ctaText: 'Start Free Trial',
    features: [
      { text: 'Clock in/out with GPS', included: true },
      { text: 'Auto-submit to state aggregator', included: true },
      { text: 'Up to 2 care recipients', included: true },
      { text: 'Visit history & EVV status', included: true },
      { text: 'Email support', included: true },
      { text: 'Task logging & care plans', included: false },
      { text: 'Photo uploads', included: false },
      { text: 'Earnings analytics', included: false },
    ],
  },
  pro: {
    name: 'Pro',
    price: '$39.99',
    tagline: 'Advanced features + priority support',
    color: Colors.accent.purple,
    ctaText: 'Start Free Trial',
    popular: true,
    features: [
      { text: 'Everything in Basic', included: true },
      { text: 'Up to 5 care recipients', included: true },
      { text: 'Task logging & care plans', included: true },
      { text: 'Photo uploads', included: true },
      { text: 'Earnings analytics & export', included: true },
      { text: 'Compliance reports', included: true },
      { text: 'Priority email + chat support', included: true },
      { text: 'Multi-caregiver accounts', included: false },
    ],
  },
  family: {
    name: 'Family',
    price: '$59.99',
    tagline: 'For agencies or families with multiple caregivers',
    color: Colors.accent.pink,
    ctaText: 'Contact Sales',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Unlimited care recipients', included: true },
      { text: 'Up to 5 caregiver accounts', included: true },
      { text: 'Real-time family notifications', included: true },
      { text: 'Multi-user dashboard', included: true },
      { text: 'Phone support', included: true },
      { text: 'Custom training & onboarding', included: true },
      { text: 'Dedicated account manager', included: true },
    ],
  },
};

const FAQ_ITEMS = [
  {
    question: 'What states are supported?',
    answer: '37 states: FL, NY, CA, TX, OH, PA, IL, MI, NC, GA, VA, MD, NJ, MA, WA, AZ, TN, IN, MO, WI, CO, SC, AL, LA, KY, OK, CT, IA, MS, AR, KS, UT, NV, NM, NE, WV, and HI.',
  },
  {
    question: 'Do I need special hardware?',
    answer: 'No! CareLog works on any smartphone (iPhone or Android). Just download the app, sign up, and you\'re ready to go.',
  },
  {
    question: 'How does auto-submit work?',
    answer: 'When you clock out, CareLog automatically packages the 6 required EVV data points (date, time in/out, location in/out, service type, individual receiving service) and submits them to your state\'s Medicaid aggregator (HHAeXchange, Sandata, Tellus, or ProviderOne).',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. CareLog is HIPAA compliant with AES-256 encryption, secure cloud storage, annual security audits, and strict data access controls. We never sell your data.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. No contracts, no cancellation fees. If you cancel, you\'ll have access until the end of your billing period.',
  },
  {
    question: 'What if my state isn\'t supported yet?',
    answer: 'We\'re actively adding new states! Join our waitlist and we\'ll notify you when your state aggregator integration goes live.',
  },
];

export default function PricingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSelectTier = (tier: PricingTier) => {
    if (tier === 'family') {
      // Open contact form or Calendly
      if (Platform.OS === 'web') {
        window.open('mailto:sales@carelog.app?subject=Family%20Tier%20Inquiry', '_blank');
      }
    } else {
      // For Basic/Pro: show signup modal (Stripe integration happens post-signup)
      setShowLoginModal(true);
    }
  };

  return (
    <View style={styles.container}>
      <NavBar
        onLoginPress={() => setShowLoginModal(true)}
        onSignUpPress={() => setShowLoginModal(true)}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Simple, Transparent Pricing</Text>
          <Text style={styles.heroSubtitle}>
            Choose the plan that fits your caregiving needs. All plans include 14-day free trial.
          </Text>
        </View>

        {/* Pricing Cards */}
        <View style={styles.pricingSection}>
          <View style={styles.pricingGrid}>
            {(Object.keys(TIERS) as PricingTier[]).map((tierKey) => {
              const tier = TIERS[tierKey];
              return (
                <PricingCard
                  key={tierKey}
                  tier={tierKey}
                  data={tier}
                  onSelect={handleSelectTier}
                />
              );
            })}
          </View>
        </View>

        {/* Comparison Note */}
        <View style={styles.noteSection}>
          <Text style={styles.noteText}>
            All plans include: GPS-verified clock in/out · Auto-submit to state aggregator · Visit history · HIPAA compliance · Mobile app (iOS & Android)
          </Text>
        </View>

        {/* FAQ */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          {FAQ_ITEMS.map((item, index) => (
            <FaqItem
              key={index}
              question={item.question}
              answer={item.answer}
              isExpanded={expandedFaq === index}
              onToggle={() => setExpandedFaq(expandedFaq === index ? null : index)}
            />
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Card padding="lg" style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Still have questions?</Text>
            <Text style={styles.ctaSubtitle}>
              Our team is here to help you choose the right plan
            </Text>
            <Button
              title="Contact Support"
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.open('mailto:support@carelog.app', '_blank');
                }
              }}
              variant="outline"
              size="lg"
            />
          </Card>
        </View>

        <Footer />
      </ScrollView>

      {/* Login Modal */}
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

function PricingCard({
  tier,
  data,
  onSelect,
}: {
  tier: PricingTier;
  data: TierData;
  onSelect: (tier: PricingTier) => void;
}) {
  const cardStyles = data.popular 
    ? [styles.pricingCard, styles.popularCard]
    : [styles.pricingCard];

  return (
    <Card padding="lg" style={cardStyles as any}>
      {data.popular && (
        <View style={styles.popularBadge}>
          <Badge label="MOST POPULAR" color={Colors.accent.purple} variant="filled" size="sm" />
        </View>
      )}

      <Text style={[styles.tierName, { color: data.color }]}>{data.name}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{data.price}</Text>
        <Text style={styles.pricePeriod}>/month</Text>
      </View>
      <Text style={styles.tagline}>{data.tagline}</Text>

      <View style={styles.featuresContainer}>
        {data.features.map((feature, index) => (
          <View key={index} style={styles.feature}>
            <Text style={[styles.featureIcon, { color: feature.included ? Colors.success : Colors.textMuted }]}>
              {feature.included ? '✓' : '—'}
            </Text>
            <Text style={[styles.featureText, !feature.included && styles.featureTextDisabled]}>
              {feature.text}
            </Text>
          </View>
        ))}
      </View>

      <Button
        title={data.ctaText}
        onPress={() => onSelect(tier)}
        variant={data.popular ? 'primary' : 'outline'}
        size="lg"
        style={styles.tierButton}
      />
    </Card>
  );
}

function FaqItem({
  question,
  answer,
  isExpanded,
  onToggle,
}: {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable onPress={onToggle} style={styles.faqItem}>
      <View style={styles.faqQuestion}>
        <Text style={styles.faqQuestionText}>{question}</Text>
        <Text style={styles.faqChevron}>{isExpanded ? '−' : '+'}</Text>
      </View>
      {isExpanded && (
        <Text style={styles.faqAnswer}>{answer}</Text>
      )}
    </Pressable>
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
  hero: {
    paddingVertical: Layout.spacing.xxl * 2,
    paddingHorizontal: Layout.spacing.lg,
    alignItems: 'center',
  },
  heroTitle: {
    ...Typography.h1,
    fontSize: Platform.OS === 'web' ? 48 : 36,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  heroSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 600,
  },
  pricingSection: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  pricingGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: Layout.spacing.lg,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  pricingCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 300 : undefined,
    position: 'relative',
  },
  popularCard: {
    borderColor: Colors.accent.purple,
    borderWidth: 2,
    ...Platform.select({
      web: {
        // @ts-ignore
        boxShadow: '0 12px 32px rgba(155, 114, 232, 0.2)',
      },
    }),
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
  },
  tierName: {
    ...Typography.h3,
    marginBottom: Layout.spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Layout.spacing.xs,
  },
  price: {
    ...Typography.h1,
    fontSize: 48,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  pricePeriod: {
    ...Typography.body,
    color: Colors.textMuted,
    marginLeft: Layout.spacing.xs,
  },
  tagline: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.lg,
  },
  featuresContainer: {
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.xl,
    flex: 1,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  featureIcon: {
    ...Typography.body,
    fontWeight: '700',
    width: 20,
  },
  featureText: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
  },
  featureTextDisabled: {
    color: Colors.textMuted,
  },
  tierButton: {
    width: '100%',
  },
  noteSection: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  noteText: {
    ...Typography.bodySm,
    color: Colors.textMuted,
    textAlign: 'center',
    maxWidth: 800,
    alignSelf: 'center',
  },
  faqSection: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.xxl,
    backgroundColor: Colors.surface,
  },
  faqTitle: {
    ...Typography.h2,
    fontSize: Platform.OS === 'web' ? 36 : 28,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  faqItem: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
    paddingVertical: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    ...Typography.h3,
    color: Colors.textPrimary,
    flex: 1,
  },
  faqChevron: {
    ...Typography.h3,
    color: Colors.primary,
    marginLeft: Layout.spacing.md,
  },
  faqAnswer: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.md,
    lineHeight: 22,
  },
  ctaSection: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.xxl,
  },
  ctaCard: {
    alignItems: 'center',
    maxWidth: 600,
    alignSelf: 'center',
  },
  ctaTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Layout.spacing.sm,
  },
  ctaSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
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
