/**
 * Timeline — How It Works visual progression
 * Step-by-step caregiver journey
 */
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';

interface TimelineStep {
  number: number;
  title: string;
  description: string;
}

interface TimelineProps {
  steps: TimelineStep[];
}

export default function Timeline({ steps }: TimelineProps) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={step.number} style={styles.step}>
          {/* Number badge */}
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{step.number}</Text>
          </View>

          {/* Connector line (except for last step) */}
          {index < steps.length - 1 && <View style={styles.connector} />}

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  step: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.xl,
    position: 'relative',
  },
  numberBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.lg,
    ...Platform.select({
      web: {
        // @ts-ignore
        boxShadow: '0 4px 12px rgba(0, 212, 170, 0.3)',
      },
      default: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  numberText: {
    ...Typography.h3,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  connector: {
    position: 'absolute',
    left: 23,
    top: 48,
    width: 2,
    height: Layout.spacing.xl + 20,
    backgroundColor: `${Colors.primary}30`,
  },
  content: {
    flex: 1,
    paddingTop: 4,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Layout.spacing.xs,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
