/**
 * CareLog Notification Service
 * Powers the Family Portal push notifications
 * "Maria started her visit with Mom — 9:02am"
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowInForeground: true,
  }),
});

export type NotificationType =
  | 'visit_started'
  | 'visit_completed'
  | 'task_logged'
  | 'photo_shared'
  | 'medication_alert'
  | 'appreciation_received'
  | 'evv_submitted'
  | 'evv_error';

interface NotificationContent {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

const NOTIFICATION_TEMPLATES: Record<NotificationType, (name: string) => NotificationContent> = {
  visit_started: (name) => ({
    title: '🔔 Visit Started',
    body: `${name} started their visit with Mom`,
  }),
  visit_completed: (name) => ({
    title: '✅ Visit Completed',
    body: `${name} completed a visit with Mom`,
  }),
  task_logged: (name) => ({
    title: '📋 Tasks Updated',
    body: `${name} logged care tasks during the visit`,
  }),
  photo_shared: (name) => ({
    title: '📸 Photo Shared',
    body: `${name} shared a photo from the visit`,
  }),
  medication_alert: () => ({
    title: '⚠️ Medication Alert',
    body: 'Scheduled medication was not logged during this visit',
  }),
  appreciation_received: (name) => ({
    title: '💚 Appreciation Received!',
    body: `${name} sent you appreciation. You are seen.`,
  }),
  evv_submitted: () => ({
    title: '✓ EVV Submitted',
    body: 'All 6 data points submitted to state Medicaid',
  }),
  evv_error: () => ({
    title: '✕ EVV Submission Failed',
    body: 'Visit queued for retry. Tap to review.',
  }),
};

/**
 * Request push notification permissions
 */
export async function registerForPushNotifications(): Promise<string | null> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'CareLog',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}

/**
 * Send a local notification (for testing / offline scenarios)
 */
export async function sendLocalNotification(
  type: NotificationType,
  caregiverName: string = 'Your caregiver'
) {
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
    trigger: null, // Immediate
  });
}

export default {
  registerForPushNotifications,
  sendLocalNotification,
};
