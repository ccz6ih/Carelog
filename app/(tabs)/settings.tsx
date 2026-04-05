/**
 * CareLog Settings Screen
 * Account, subscription tier, recipients, security
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';

interface SettingsRowProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
}

function SettingsRow({ icon, label, value, onPress }: SettingsRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={{ fontSize: 18 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[Typography.body, { color: Colors.textPrimary }]}>{label}</Text>
        {value && (
          <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>
            {value}
          </Text>
        )}
      </View>
      {onPress && (
        <Text style={{ color: Colors.textMuted, fontSize: 18 }}>›</Text>
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { user, logout } = useAppStore();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Typography.sectionLabel, { color: Colors.primary }]}>SETTINGS</Text>
        <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4, marginBottom: 24 }]}>
          Account
        </Text>

        {/* Profile Card */}
        <Card borderColor={Colors.primary} style={{ marginBottom: 24 }}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 24 }}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={[Typography.bodySm, { color: Colors.textSecondary }]}>
                {user?.email}
              </Text>
            </View>
            <Badge
              label={user?.tier?.toUpperCase() || 'BASIC'}
              color={Colors.tier[user?.tier || 'basic']}
            />
          </View>
        </Card>

        {/* Settings Groups */}
        <Card style={{ marginBottom: 16 }}>
          <SettingsRow icon="👩‍⚕️" label="Care Recipients" value="1 recipient" onPress={() => {}} />
          <SettingsRow icon="👨‍👩‍👧" label="Family Members" value="1 viewer connected" onPress={() => {}} />
          <SettingsRow icon="💎" label="Subscription" value="Basic · $19.99/mo" onPress={() => {}} />
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <SettingsRow icon="🏥" label="EVV Configuration" value="HHAeXchange · Florida" onPress={() => {}} />
          <SettingsRow icon="📊" label="Compliance Reports" onPress={() => {}} />
          <SettingsRow icon="💰" label="Earnings History" onPress={() => {}} />
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <SettingsRow icon="🔒" label="Security" value="HIPAA · AES-256" onPress={() => {}} />
          <SettingsRow icon="🔔" label="Notifications" onPress={() => {}} />
          <SettingsRow icon="❓" label="Help & Support" onPress={() => {}} />
        </Card>

        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="outline"
          style={{ marginTop: 8 }}
        />

        <Text style={[Typography.caption, { color: Colors.textMuted, textAlign: 'center', marginTop: 24 }]}>
          CareLog v1.0.0 · Build smart. Print on automatic.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: Layout.spacing.xl,
    paddingTop: 16,
    paddingBottom: 48,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.card,
  },
});
