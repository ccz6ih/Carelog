/**
 * EVV Offline Queue — Retry failed submissions with exponential backoff
 * Stores failed EVV submissions in AsyncStorage, retries on reconnect
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { submitEVV } from './evv';
import type { Visit, CareRecipient } from '@/types';

const QUEUE_KEY = 'carelog-evv-queue';
const MAX_RETRIES = 5;

interface QueuedSubmission {
  id: string;
  visit: Visit;
  recipient: CareRecipient;
  retryCount: number;
  nextRetryAt: number; // timestamp ms
  createdAt: number;
}

/**
 * Add a failed submission to the retry queue
 */
export async function enqueueEVV(visit: Visit, recipient: CareRecipient): Promise<void> {
  const queue = await getQueue();
  const entry: QueuedSubmission = {
    id: `${visit.id}-${Date.now()}`,
    visit,
    recipient,
    retryCount: 0,
    nextRetryAt: Date.now() + 30000, // retry in 30s
    createdAt: Date.now(),
  };
  queue.push(entry);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

/**
 * Get all queued submissions
 */
export async function getQueue(): Promise<QueuedSubmission[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

/**
 * Get count of pending submissions
 */
export async function getQueueCount(): Promise<number> {
  const queue = await getQueue();
  return queue.length;
}

/**
 * Process the retry queue — call this on app foreground, network reconnect, etc.
 */
export async function processQueue(): Promise<{ processed: number; succeeded: number; failed: number }> {
  const queue = await getQueue();
  const now = Date.now();
  const ready = queue.filter((q) => q.nextRetryAt <= now && q.retryCount < MAX_RETRIES);

  if (ready.length === 0) return { processed: 0, succeeded: 0, failed: 0 };

  let succeeded = 0;
  let failed = 0;
  const remaining: QueuedSubmission[] = [];

  for (const entry of queue) {
    if (!ready.includes(entry)) {
      remaining.push(entry);
      continue;
    }

    const result = await submitEVV(entry.visit, entry.recipient);

    if (result.success) {
      succeeded++;
      // Log success to DB
      await supabase.from('evv_submissions').insert({
        visit_id: entry.visit.id,
        aggregator: entry.recipient.aggregator,
        payload: entry.visit,
        success: true,
        confirmation_id: result.confirmationId,
        retry_count: entry.retryCount + 1,
      });
      await supabase.from('visits').update({ evv_status: 'submitted' }).eq('id', entry.visit.id);
    } else {
      failed++;
      if (entry.retryCount + 1 < MAX_RETRIES) {
        // Exponential backoff: 30s, 1m, 2m, 4m, 8m
        const delay = 30000 * Math.pow(2, entry.retryCount);
        remaining.push({
          ...entry,
          retryCount: entry.retryCount + 1,
          nextRetryAt: now + delay,
        });
        // Log failed attempt
        await supabase.from('evv_submissions').insert({
          visit_id: entry.visit.id,
          aggregator: entry.recipient.aggregator,
          payload: entry.visit,
          success: false,
          retry_count: entry.retryCount + 1,
          error_message: result.error,
          next_retry_at: new Date(now + delay).toISOString(),
        });
      } else {
        // Max retries exceeded — log permanent failure
        await supabase.from('evv_submissions').insert({
          visit_id: entry.visit.id,
          aggregator: entry.recipient.aggregator,
          payload: entry.visit,
          success: false,
          retry_count: entry.retryCount + 1,
          error_message: `Max retries (${MAX_RETRIES}) exceeded: ${result.error}`,
        });
        await supabase.from('visits').update({ evv_status: 'error' }).eq('id', entry.visit.id);
      }
    }
  }

  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  return { processed: ready.length, succeeded, failed };
}

/**
 * Clear the queue (for debugging)
 */
export async function clearQueue(): Promise<void> {
  await AsyncStorage.removeItem(QUEUE_KEY);
}
