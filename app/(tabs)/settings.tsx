/**
 * CareLog Settings Screen
 * Clean grouped sections, responsive layout
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { IconCaregiver, IconGroup, IconHeart, IconVisit, IconNurture, IconComfort } from '@/components/icons/CareIcons';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/services/supabase';

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
}

function SettingsRow({ icon, label, value, onPress, isLast }: SettingsRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, isLast && { borderBottomWidth: 0 }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.rowIcon}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[Typography.body, { color: Colors.textPrimary }]}>{label}</Text>
        {value && (
          <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 2, letterSpacing: 0.3 }]}>
            {value}
          </Text>
        )}
      </View>
      {onPress && (
        <Text style={{ color: Colors.textMuted, fontSize: 14 }}>›</Text>
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { user, logout } = useAppStore();
  const [recipientCount, setRecipientCount] = useState(0);
  const [familyCount, setFamilyCount] = useState(0);

  useEffect(() => {
    async function loadCounts() {
      const { count: rCount } = await supabase
        .from('recipients')
        .select('*', { count: 'exact', head: true })
        .eq('caregiver_id', user?.id);
      if (rCount !== null) setRecipientCount(rCount);

      const { data: recipients } = await supabase
        .from('recipients')
        .select('id')
        .eq('caregiver_id', user?.id);
      if (recipients && recipients.length > 0) {
        const ids = recipients.map((r) => r.id);
        const { count: fCount } = await supabase
          .from('family_members')
          .select('*', { count: 'exact', head: true })
          .in('recipient_id', ids);
        if (fCount !== null) setFamilyCount(fCount);
      }
    }
    if (user?.id) loadCounts();
  }, [user?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[Typography.sectionLabel, { color: Colors.primary }]}>SETTINGS</Text>
          <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4, marginBottom: 24 }]}>
            Account
          </Text>

          {/* Profile Card */}
          <Card style={{ marginBottom: 24 }}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={[Typography.h3, { color: Colors.primary }]}>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.h3, { color: Colors.textPrimary }]}>
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>
                  {user?.email}
                </Text>
              </View>
              <Badge
                label={user?.tier?.toUpperCase() || 'BASIC'}
                color={Colors.tier[user?.tier || 'basic']}
                variant="dot"
                size="sm"
              />
            </View>
          </Card>

          {/* Groups */}
          <Card padding="sm" style={{ marginBottom: 12 }}>
            <SettingsRow
              icon={<IconCaregiver size={19} color={Colors.primary} strokeWidth={2} />}
              label="Care Recipients"
              value={`${recipientCount} recipient${recipientCount !== 1 ? 's' : ''}`}
              onPress={() => {}}
            />
            <SettingsRow
              icon={<IconGroup size={19} color={Colors.accent.purple} strokeWidth={2} />}
              label="Family Members"
              value={`${familyCount} viewer${familyCount !== 1 ? 's' : ''} connected`}
              onPress={() => {}}
            />
            <SettingsRow icon={<IconHeart size={19} color={Colors.accent.orange} strokeWidth={2} />} label="Subscription" value="Basic · $19.99/mo" onPress={() => {}} isLast />
          </Card>

          <Card padding="sm" style={{ marginBottom: 12 }}>
            <SettingsRow icon={<IconNurture size={19} color={Colors.primary} strokeWidth={2} />} label="EVV Configuration" onPress={() => {}} />
            <SettingsRow icon={<IconVisit size={19} color={Colors.accent.orange} strokeWidth={2} />} label="Compliance Reports" onPress={() => router.push('/compliance')} />
            <SettingsRow icon={<IconComfort size={19} color={Colors.success} strokeWidth={2} />} label="Earnings History" onPress={() => {}} isLast />
          </Card>

          <Card padding="sm" style={{ marginBottom: 24 }}>
            <SettingsRow icon={<IconCaregiver size={19} color={Colors.primary} strokeWidth={2} />} label="Security" value="HIPAA · AES-256" onPress={() => {}} />
            <SettingsRow icon={<IconHeart size={19} color={Colors.accent.pink} strokeWidth={2} />} label="Notifications" onPress={() => {}} />
            <SettingsRow icon={<IconGroup size={19} color={Colors.accent.purple} strokeWidth={2} />} label="Help & Support" onPress={() => {}} isLast />
          </Card>

          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="outline"
            fullWidth
          />

          <Text style={[Typography.micro, { color: Colors.textMuted, textAlign: 'center', marginTop: 28, letterSpacing: 1 }]}>
            CARELOG V1.0.0
          </Text>
        </View>
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
    alignItems: 'center',
    paddingBottom: 48,
  },
  content: {
    width: '100%',
    maxWidth: Layout.content.maxWidth,
    padding: Layout.spacing.lg,
    paddingTop: Platform.OS === 'web' ? 24 : 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '15',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  rowIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
