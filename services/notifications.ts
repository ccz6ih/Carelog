/**
 * CareLog Notification Service
 * Push notifications for native, no-op on web
 */
import { Platform } from 'react-native';

export type NotificationType =
  | 'visit_started'
  | 'visit_completed'
  | 'task_logged'
  | 'photo_shared'
  | 'medication_alert'
  | 'appreciation_received'
  | 'evv_submitted'
  | 'evv_error'
  | 'milestone_reached'       // NEW: Visit milestones (10, 25, 50, 100 visits)
  | 'streak_achievement'      // NEW: Consecutive days worked (3, 7, 14, 30 days)
  | 'weekly_praise'           // NEW: Sunday encouragement with stats
  | 'perfect_week';           // NEW: All EVV submitted, no errors all week

interface NotificationContent {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

const NOTIFICATION_TEMPLATES: Record<NotificationType, (name: string) => NotificationContent> = {
  visit_started: (name) => ({
    title: 'Visit Started',
    body: `${name} started their visit`,
  }),
  visit_completed: (name) => ({
    title: 'Visit Completed',
    body: `${name} completed a visit`,
  }),
  task_logged: (name) => ({
    title: 'Tasks Updated',
    body: `${name} logged care tasks during the visit`,
  }),
  photo_shared: (name) => ({
    title: 'Photo Shared',
    body: `${name} shared a photo from the visit`,
  }),
  medication_alert: () => ({
    title: 'Medication Alert',
    body: 'Scheduled medication was not logged during this visit',
  }),
  appreciation_received: (name) => ({
    title: 'Appreciation Received!',
    body: `${name} sent you appreciation. You are seen.`,
  }),
  evv_submitted: () => ({
    title: 'EVV Submitted',
    body: 'All 6 data points submitted to state Medicaid',
  }),
  evv_error: () => ({
    title: 'EVV Needs Attention',
    body: 'Visit queued for retry. Tap to review.',
  }),
  milestone_reached: (count) => ({
    title: '🎉 Milestone Reached!',
    body: `${count} visits completed. You're making a real difference.`,
  }),
  streak_achievement: (days) => ({
    title: '🔥 Streak Achievement!',
    body: `${days} days in a row. Your reliability means everything.`,
  }),
  weekly_praise: (hours) => ({
    title: '💙 This Week',
    body: `${hours} hours of care. That's dedication. You are seen.`,
  }),
  perfect_week: () => ({
    title: '✨ Perfect Week!',
    body: 'All EVV submitted on time. Zero errors. You are thorough and reliable.',
  }),
};

/**
 * Request push notification permissions (native only)
 */
export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  try {
    const Notifications = require('expo-notifications');

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'CareLog',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch {
    return null;
  }
}

/**
 * Send a local notification (native only — no-op on web)
 */
export async function sendLocalNotification(
  type: NotificationType,
  caregiverName: string = 'Your caregiver'
) {
  if (Platform.OS === 'web') return;

  try {
    const Notifications = require('expo-notifications');
    const template = NOTIFICATION_TEMPLATES[type];
    if (!template) return;

    const content = template(caregiverName);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: content.title,
        body: content.body,
        data: content.data || {},
        sound: true,
      },
      trigger: null,
    });
  } catch {
    // Silently fail — notifications are not critical path
  }
}

/**
 * Notify family members about a visit event
 * Native: local notification. Web: no-op.
 * Production: would send Expo Push to family member devices.
 */
export async function notifyFamilyMembers(
  recipientId: string,
  type: NotificationType,
  caregiverName: string,
  metadata?: Record<string, unknown>
) {
  // On web, just log — no push notifications available
  if (Platform.OS === 'web') {
    console.log(`[Notifications] ${type}: ${caregiverName} (web — skipped)`);
    return;
  }

  await sendLocalNotification(type, caregiverName);
}

export default {
  registerForPushNotifications,
  sendLocalNotification,
  notifyFamilyMembers,
};
