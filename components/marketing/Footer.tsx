/**
 * Marketing Footer
 * Links, social, legal, trust badges
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';

export default function Footer() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Top section */}
        <View style={styles.topSection}>
          {/* About */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>CareLog</Text>
            <Text style={styles.columnText}>
              The EVV compliance platform built for paid family caregivers.
            </Text>
            <Text style={[styles.columnText, { marginTop: Layout.spacing.md }]}>
              HIPAA Compliant · AES-256 Encrypted
            </Text>
          </View>

          {/* Product */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Product</Text>
            <FooterLink text="Features" />
            <FooterLink text="Pricing" />
            <FooterLink text="EVV Aggregators" />
            <FooterLink text="State Coverage" />
          </View>

          {/* Company */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Company</Text>
            <FooterLink text="About" />
            <FooterLink text="Blog" />
            <FooterLink text="Careers" />
            <FooterLink text="Contact" />
          </View>

          {/* Legal */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Legal</Text>
            <FooterLink text="Privacy Policy" />
            <FooterLink text="Terms of Service" />
            <FooterLink text="HIPAA Compliance" />
            <FooterLink text="Security" />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <Text style={styles.copyright}>
            © 2026 CareLog. All rights reserved.
          </Text>
          <Text style={styles.supportedStates}>
            Supporting caregivers in 37 states
          </Text>
        </View>
      </View>
    </View>
  );
}

function FooterLink({ text }: { text: string }) {
  return (
    <Pressable style={styles.link}>
      <Text style={styles.linkText}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
    paddingVertical: Layout.spacing.xxl,
  },
  content: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Layout.spacing.lg,
  },
  topSection: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    gap: Layout.spacing.xl,
    marginBottom: Layout.spacing.xl,
  },
  column: {
    flex: 1,
    minWidth: 200,
  },
  columnTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Layout.spacing.md,
  },
  columnText: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  link: {
    paddingVertical: Layout.spacing.xs,
  },
  linkText: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    ...Platform.select({
      web: {
        // @ts-ignore
        cursor: 'pointer',
        transition: 'color 0.2s ease',
      },
    }),
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.subtle,
    marginBottom: Layout.spacing.lg,
  },
  bottomSection: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    gap: Layout.spacing.sm,
  },
  copyright: {
    ...Typography.bodySm,
    color: Colors.textMuted,
  },
  supportedStates: {
    ...Typography.bodySm,
    color: Colors.textMuted,
  },
});
