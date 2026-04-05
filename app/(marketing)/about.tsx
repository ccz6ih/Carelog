/**
 * About Page — Mission, Values, The Problem We're Solving
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Modal } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import NavBar from '@/components/marketing/NavBar';
import Footer from '@/components/marketing/Footer';
import { IconHeart, IconCaregiver, IconGroup } from '@/components/icons/CareIcons';
import LoginScreen from '@/app/(auth)/login';

export default function AboutPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <View style={styles.container}>
      <NavBar
        onLoginPress={() => setShowLoginModal(true)}
        onSignUpPress={() => setShowLoginModal(true)}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <IconHeart size={80} color={Colors.accent.pink} strokeWidth={1.5} />
            <Text style={styles.heroTitle}>
              Get Paid. Stay Compliant.{'\n'}Feel Seen.
            </Text>
            <Text style={styles.heroSubtitle}>
              CareLog is the only EVV tool built for individual family caregivers—not agencies. We help you clock in, auto-submit to Medicaid, and connect with family members who see your work.
            </Text>
          </View>
        </View>

        {/* Mission */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Why We Exist</Text>
            <Card padding="lg" style={styles.missionCard}>
              <Text style={styles.missionText}>
                You're not a nurse at an agency. You're a daughter caring for Mom. A son helping Dad. A spouse supporting your partner. You're one of 11 million paid family caregivers in the U.S., funded by Medicaid to provide personal care—bathing, meals, mobility, companionship.
                {"\n\n"}
                And you're losing an average of $1,500 per year to EVV compliance errors.
                {"\n\n"}
                Every competitor (HHAeXchange, Sandata, Time4Care) is built for agencies, not families. CareLog is the first and only consumer tool that treats you like the professional you are—while keeping things simple enough for anyone to use.
              </Text>
            </Card>
          </View>
        </View>

        {/* The Problem */}
        <View style={[styles.section, styles.darkSection]}>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>The Problem We're Solving</Text>
            
            <View style={styles.statsGrid}>
              <StatCard
                icon={<IconCaregiver size={48} color={Colors.primary} strokeWidth={2} />}
                number="11M"
                label="Paid family caregivers (US/AU/UK)"
              />
              <StatCard
                icon={<IconGroup size={48} color={Colors.accent.purple} strokeWidth={2} />}
                number="200K+"
                label="NY CDPAP caregivers (largest program)"
              />
              <StatCard
                icon={<IconHeart size={48} color={Colors.accent.pink} strokeWidth={2} />}
                number="$1,500"
                label="Avg lost per year to EVV errors"
              />
            </View>

            <View style={styles.problemList}>
              <ProblemItem text="The 21st Century Cures Act (2016) is federal law—it's not going away" />
              <ProblemItem text="If you don't submit all 6 EVV data points correctly, you don't get paid" />
              <ProblemItem text="15+ states now enforce hard denials. Ohio had 44% compliance in a recent audit." />
              <ProblemItem text="Every competitor builds for agencies. You're invisible to them." />
              <ProblemItem text="Your family has zero visibility into care visits. They worry. They call. You resent it." />
            </View>
          </View>
        </View>

        {/* Our Solution */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Our Solution</Text>
            <View style={styles.solutionGrid}>
              <SolutionCard
                title="Auto-Submit to Medicaid"
                description="We connect to HHAeXchange, Sandata, Tellus, and ProviderOne—covering 37 open-model states. Clock out, and we submit all 6 data points automatically. 99%+ success rate."
              />
              <SolutionCard
                title="Family Portal (Free for Families)"
                description="Zero extra data entry—we use the same EVV data you already capture. Your siblings see visit notifications, task logs, photos. They send appreciation (Venmo/Zelle)—often covering your subscription cost. No more surveillance phone calls."
              />
              <SolutionCard
                title="Built for You, Not Agencies"
                description="Every competitor is B2B (agency tools). CareLog is the ONLY B2C product. We're designed for the individual caregiver and your family—not corporate IT departments."
              />
              <SolutionCard
                title="Multi-Recipient Support"
                description="Caring for Mom AND Dad? Two aunts? We handle multiple recipients in one app. Pro tier supports 2 recipients, Family tier unlimited."
              />
              <SolutionCard
                title="International Coverage"
                description="US Medicaid (37 states, including 200K+ NY CDPAP caregivers). Australia NDIS (500K+ participants via NDIA API). UK Direct Payments (450K+ recipients, PDF timesheets for 348 councils)."
              />
              <SolutionCard
                title="Offline-First Resilience"
                description="Poor connectivity in rural areas? Clock in/out offline. We store visits locally with retry queue and auto-submit when you're back online. You never lose a visit or a paycheck."
              />
              <SolutionCard
                title="HIPAA Compliant & Secure"
                description="Appreciation goes straight to your Venmo/Zelle (CareLog never touches money). AES-256 encryption. Annual security audits. BAAs with all third-party services."
              />
            </View>
          </View>
        </View>

        {/* Values */}
        <View style={[styles.section, styles.darkSection]}>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Our Values</Text>
            <View style={styles.valuesGrid}>
              <ValueCard
                title="Warm, Not Clinical"
                description="We're talking to exhausted family members, not nurses. 'Mom's visit is complete' not 'Service event #4521 processed.'"
              />
              <ValueCard
                title="Confident, Not Corporate"
                description="We save you money and reduce stress. No hedging. 'CareLog pays for itself' is a real claim (via appreciation offsetting subscription cost)."
              />
              <ValueCard
                title="Human Names, Not IDs"
                description="Always 'Mom (Dorothy)' not 'Recipient #12345.' The app deals in relationships, not database records."
              />
              <ValueCard
                title="Every Feature Earns Its Place"
                description="We don't add features speculatively. Everything serves compliance, family connection, or revenue. If it doesn't, it gets cut."
              />
            </View>
          </View>
        </View>

        {/* Team */}
        <View style={[styles.section, styles.darkSection]}>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>The Team</Text>
            <View style={styles.teamGrid}>
              <Card padding="lg" style={styles.teamCard}>
                <Text style={styles.teamName}>Olivier — Co-Founder / CEO</Text>
                <Text style={styles.teamRole}>Business, Growth & B2B Sales</Text>
                <Text style={styles.teamBio}>
                  Serial entrepreneur who scaled Gaia to hundreds of thousands of paying subscribers. Deep expertise in subscription pricing, churn reduction, and affiliate program design. Runs B2B FMS outreach and GTM strategy (TikTok/Reels organic, family viral loop).
                </Text>
              </Card>
              <Card padding="lg" style={styles.teamCard}>
                <Text style={styles.teamName}>Craig — Co-Founder / CTO</Text>
                <Text style={styles.teamRole}>Architecture, Build & Execution</Text>
                <Text style={styles.teamBio}>
                  Builds the state API integrations, family portal, appreciation flow, and B2B tools. Full-stack mobile (iOS + Android, React Native). HIPAA compliance (AES-256 encryption, audit logging). The aggregator integrations and family portal are the technical moats.
                </Text>
              </Card>
            </View>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <Card padding="lg" style={styles.ctaCard}>
              <Text style={styles.ctaTitle}>Ready to stop losing money to EVV errors?</Text>
              <Text style={styles.ctaSubtitle}>
                Join 11 million family caregivers. Start your 14-day free trial—Family Portal included.
              </Text>
              <Button
                title="Start Free Trial"
                onPress={() => setShowLoginModal(true)}
                variant="primary"
                size="lg"
              />
            </Card>
          </View>
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

function StatCard({ icon, number, label }: { icon: React.ReactNode; number: string; label: string }) {
  return (
    <Card padding="lg" style={styles.statCard}>
      <View style={styles.statIcon}>{icon}</View>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function ProblemItem({ text }: { text: string }) {
  return (
    <View style={styles.problemItem}>
      <Text style={styles.problemBullet}>•</Text>
      <Text style={styles.problemText}>{text}</Text>
    </View>
  );
}

function SolutionCard({ title, description }: { title: string; description: string }) {
  return (
    <Card padding="md" style={styles.solutionCard}>
      <Text style={styles.solutionTitle}>{title}</Text>
      <Text style={styles.solutionDescription}>{description}</Text>
    </Card>
  );
}

function ValueCard({ title, description }: { title: string; description: string }) {
  return (
    <Card padding="lg" style={styles.valueCard}>
      <Text style={styles.valueTitle}>{title}</Text>
      <Text style={styles.valueDescription}>{description}</Text>
    </Card>
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
    backgroundColor: Colors.surface,
  },
  heroContent: {
    maxWidth: 800,
    alignSelf: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    ...Typography.h1,
    fontSize: Platform.OS === 'web' ? 48 : 36,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  heroSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
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
    alignSelf: 'center',
    width: '100%',
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: Platform.OS === 'web' ? 42 : 32,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xxl,
  },
  missionCard: {
    backgroundColor: Colors.background,
  },
  missionText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 28,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: Layout.spacing.lg,
    marginBottom: Layout.spacing.xxl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: Layout.spacing.md,
  },
  statNumber: {
    ...Typography.h1,
    fontSize: 48,
    color: Colors.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Layout.spacing.xs,
  },
  problemList: {
    gap: Layout.spacing.md,
  },
  problemItem: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  problemBullet: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '700',
  },
  problemText: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 26,
  },
  solutionGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: Layout.spacing.md,
  },
  solutionCard: {
    flex: Platform.OS === 'web' ? 1 : undefined,
    minWidth: Platform.OS === 'web' ? 280 : undefined,
    maxWidth: Platform.OS === 'web' ? 380 : undefined,
  },
  solutionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Layout.spacing.xs,
  },
  solutionDescription: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  valuesGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: Layout.spacing.lg,
  },
  valueCard: {
    flex: Platform.OS === 'web' ? 1 : undefined,
    minWidth: Platform.OS === 'web' ? 250 : undefined,
  },
  valueTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Layout.spacing.sm,
  },
  valueDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  teamGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: Layout.spacing.lg,
  },
  teamCard: {
    flex: 1,
  },
  teamName: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Layout.spacing.xs,
  },
  teamRole: {
    ...Typography.bodySm,
    color: Colors.primary,
    marginBottom: Layout.spacing.sm,
    fontWeight: '600',
  },
  teamBio: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  ctaCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
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
