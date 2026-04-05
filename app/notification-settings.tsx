/**
 * Notification Settings — Control what alerts you receive
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/services';

interface PrefItem {
  key: string;
  label: string;
  description: string;
}

const PREF_GROUPS: { title: string; items: PrefItem[] }[] = [
  {
    title: 'VISIT UPDATES',
    items: [
      { key: 'visit_started', label: 'Visit Started', description: 'When you clock in to a visit' },
      { key: 'visit_completed', label: 'Visit Completed', description: 'When you clock out and EVV submits' },
      { key: 'task_logged', label: 'Tasks Logged', description: 'Confirmation when tasks are saved' },
      { key: 'photo_shared', label: 'Photos Shared', description: 'When visit photos are shared with family' },
    ],
  },
  {
    title: 'COMPLIANCE',
    items: [
      { key: 'evv_submitted', label: 'EVV Submitted', description: 'Confirmation that all 6 data points were accepted' },
      { key: 'evv_error', label: 'EVV Needs Attention', description: 'When a submission fails and needs retry' },
    ],
  },
  {
    title: 'FAMILY & APPRECIATION',
    items: [
      { key: 'appreciation_received', label: 'Appreciation Received', description: 'When a family member sends you appreciation' },
      { key: 'medication_alert', label: 'Medication Reminders', description: 'Alerts for scheduled medications' },
    ],
  },
  {
    title: 'SUMMARY',
    items: [
      { key: 'weekly_summary', label: 'Weekly Summary', description: 'Visits, hours, and compliance stats every Sunday' },
    ],
  },
];

export default function NotificationSettingsScreen() {
  const user = useAppStore((s) => s.user);
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.notifications.getPreferences(user!.id);
        if (data) {
          setPrefs({
            visit_started: data.visit_started,
            visit_completed: data.visit_completed,
            task_logged: data.task_logged,
            photo_shared: data.photo_shared,
            medication_alert: data.medication_alert,
            appreciation_received: data.appreciation_received,
            evv_submitted: data.evv_submitted,
            evv_error: data.evv_error,
            weekly_summary: data.weekly_summary,
          });
        }
      } catch (e) {
        console.error('[NotificationSettings]', e);
      }
      setLoading(false);
    }
    if (user?.id) load();
  }, [user?.id]);

  const togglePref = async (key: string) => {
    const newVal = !prefs[key];
    setPrefs((prev) => ({ ...prev, [key]: newVal }));
    await api.notifications.updatePreferences(user?.id || '', { [key]: newVal });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{ color: Colors.primary, fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>

          <Text style={[Typography.sectionLabel, { color: Colors.accent.pink }]}>NOTIFICATIONS</Text>
          <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4 }]}>
            Alert Preferences
          </Text>
          <Text style={[Typography.bodySm, { color: Colors.textSecondary, marginTop: 4, marginBottom: 24 }]}>
            Choose which notifications you receive. We recommend keeping EVV alerts on — they confirm you're getting paid.
          </Text>

          {loading ? (
            <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
          ) : (
            PREF_GROUPS.map((group) => (
              <View key={group.title}>
                <Text style={[Typography.sectionLabel, { color: Colors.textMuted, marginTop: 16, marginBottom: 10 }]}>
                  {group.title}
                </Text>
                <Card padding="sm" style={{ marginBottom: 8 }}>
                  {group.items.map((item, i) => (
                    <View
                      key={item.key}
                      style={[
                        styles.prefRow,
                        i === group.items.length - 1 && { borderBottomWidth: 0 },
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[Typography.body, { color: Colors.textPrimary }]}>{item.label}</Text>
                        <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 2 }]}>
                          {item.description}
                        </Text>
                      </View>
                      <Switch
                        value={prefs[item.key] ?? true}
                        onValueChange={() => togglePref(item.key)}
                        trackColor={{ false: Colors.surface, true: Colors.primary + '50' }}
                        thumbColor={prefs[item.key] ? Colors.primary : Colors.textMuted}
                      />
                    </View>
                  ))}
                </Card>
              </View>
            ))
          )}
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
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
});
