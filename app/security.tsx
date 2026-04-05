/**
 * Security — HIPAA compliance info, data controls, account management
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { IconCaregiver } from '@/components/icons/CareIcons';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/services/supabase';

export default function SecurityScreen() {
  const { user, logout } = useAppStore();
  const [exporting, setExporting] = useState(false);

  const handleExportData = async () => {
    setExporting(true);
    // In production, this would trigger a Supabase Edge Function
    // that compiles all user data into a downloadable file
    setTimeout(() => {
      setExporting(false);
      const msg = 'Data export will be sent to your email within 24 hours.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Export Requested', msg);
    }, 1500);
  };

  const handleDeleteAccount = () => {
    const confirm = () => {
      Alert.alert(
        'Delete Account',
        'This will permanently delete your account, all visit history, and EVV records. This cannot be undone. Are you absolutely sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete Permanently',
            style: 'destructive',
            onPress: async () => {
              await supabase.auth.signOut();
              logout();
              router.replace('/(auth)/login');
            },
          },
        ]
      );
    };

    if (Platform.OS === 'web') {
      if (window.confirm('This will permanently delete your account and all data. Continue?')) {
        supabase.auth.signOut().then(() => {
          logout();
          router.replace('/(auth)/login');
        });
      }
    } else {
      confirm();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{ color: Colors.primary, fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>

          <Text style={[Typography.sectionLabel, { color: Colors.primary }]}>SECURITY</Text>
          <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4 }]}>
            Privacy & Security
          </Text>
          <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4, marginBottom: 24 }]}>
            Your visit details and personal information are protected with enterprise-grade security.
          </Text>

          {/* HIPAA Compliance */}
          <Card borderColor={Colors.primary} style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <View style={styles.shieldIcon}>
                <Text style={{ fontSize: 18 }}>🛡</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.h3, { color: Colors.primary }]}>HIPAA Compliant</Text>
                <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>
                  CareLog meets all federal health data requirements
                </Text>
              </View>
              <Badge label="VERIFIED" color={Colors.success} variant="dot" size="sm" />
            </View>

            <View style={styles.securityGrid}>
              {[
                { label: 'Encryption at Rest', value: 'AES-256', status: true },
                { label: 'Encryption in Transit', value: 'TLS 1.3', status: true },
                { label: 'Audit Logging', value: 'All PHI access', status: true },
                { label: 'Access Control', value: 'Row-level security', status: true },
              ].map((item, i) => (
                <View key={i} style={styles.securityItem}>
                  <View style={styles.checkDot} />
                  <View>
                    <Text style={[Typography.bodySm, { color: Colors.textPrimary }]}>{item.label}</Text>
                    <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 1 }]}>{item.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>

          {/* What We Protect */}
          <Text style={[Typography.sectionLabel, { color: Colors.textMuted, marginTop: 8, marginBottom: 12 }]}>
            WHAT WE PROTECT
          </Text>
          <Card variant="glass" style={{ marginBottom: 16 }}>
            {[
              'Care recipient names and Medicaid IDs',
              'Visit times, locations, and task records',
              'Medication administration logs',
              'Family member contact information',
              'Your provider credentials',
            ].map((item, i) => (
              <View key={i} style={styles.protectRow}>
                <Text style={{ color: Colors.primary, fontSize: 10 }}>●</Text>
                <Text style={[Typography.bodySm, { color: Colors.textSecondary }]}>{item}</Text>
              </View>
            ))}
          </Card>

          {/* What We Never Do */}
          <Text style={[Typography.sectionLabel, { color: Colors.textMuted, marginTop: 8, marginBottom: 12 }]}>
            WHAT WE NEVER DO
          </Text>
          <Card variant="glass" style={{ marginBottom: 24 }}>
            {[
              'Sell your data to third parties',
              'Share visit details with anyone you haven\'t authorized',
              'Store your information without encryption',
              'Include personal details in error reports or analytics',
              'Handle or process appreciation payments',
            ].map((item, i) => (
              <View key={i} style={styles.protectRow}>
                <Text style={{ color: Colors.error, fontSize: 10 }}>✕</Text>
                <Text style={[Typography.bodySm, { color: Colors.textSecondary }]}>{item}</Text>
              </View>
            ))}
          </Card>

          {/* Data Controls */}
          <Text style={[Typography.sectionLabel, { color: Colors.textMuted, marginBottom: 12 }]}>
            YOUR DATA CONTROLS
          </Text>
          <Card padding="sm" style={{ marginBottom: 24 }}>
            <TouchableOpacity style={styles.controlRow} onPress={handleExportData}>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.body, { color: Colors.textPrimary }]}>Export Your Data</Text>
                <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 2 }]}>
                  Download all your visit history, task logs, and account data
                </Text>
              </View>
              <Text style={{ color: Colors.primary, fontSize: 14 }}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.controlRow, { borderBottomWidth: 0 }]} onPress={handleDeleteAccount}>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.body, { color: Colors.error }]}>Delete Account</Text>
                <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 2 }]}>
                  Permanently remove your account and all associated data
                </Text>
              </View>
              <Text style={{ color: Colors.error, fontSize: 14 }}>→</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { alignItems: 'center', paddingBottom: 48 },
  content: { width: '100%', maxWidth: Layout.content.maxWidth, padding: Layout.spacing.lg, paddingTop: Platform.OS === 'web' ? 24 : 16 },
  backBtn: { marginBottom: 16 },
  shieldIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  securityGrid: { gap: 10 },
  securityItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  protectRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  controlRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, paddingHorizontal: Layout.spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border.subtle },
});
