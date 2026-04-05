/**
 * Family Activity Service
 * Auto-creates activity feed entries when care events happen
 */
import { supabase } from './supabase';

type ActivityType = 'visit_started' | 'visit_completed' | 'task_logged' | 'photo_shared';

interface CreateActivityParams {
  recipientId: string;
  visitId?: string;
  actorName: string;
  activityType: ActivityType;
  summary: string;
  metadata?: Record<string, any>;
}

/**
 * Log a family activity entry — visible to all linked family members
 */
export async function logActivity(params: CreateActivityParams) {
  return supabase.from('family_activity').insert({
    recipient_id: params.recipientId,
    visit_id: params.visitId || null,
    actor_name: params.actorName,
    activity_type: params.activityType,
    summary: params.summary,
    metadata: params.metadata || {},
  });
}

/**
 * Log visit started
 */
export function logVisitStarted(recipientId: string, visitId: string, caregiverName: string) {
  return logActivity({
    recipientId,
    visitId,
    actorName: caregiverName,
    activityType: 'visit_started',
    summary: `${caregiverName} started a visit`,
  });
}

/**
 * Log visit completed
 */
export function logVisitCompleted(
  recipientId: string,
  visitId: string,
  caregiverName: string,
  duration: string
) {
  return logActivity({
    recipientId,
    visitId,
    actorName: caregiverName,
    activityType: 'visit_completed',
    summary: `${caregiverName} completed a ${duration} visit`,
    metadata: { duration },
  });
}

/**
 * Log tasks completed
 */
export function logTasksCompleted(
  recipientId: string,
  visitId: string,
  caregiverName: string,
  taskCount: number,
  taskNames: string[]
) {
  return logActivity({
    recipientId,
    visitId,
    actorName: caregiverName,
    activityType: 'task_logged',
    summary: `${caregiverName} completed ${taskCount} care task${taskCount !== 1 ? 's' : ''}`,
    metadata: { taskCount, taskNames },
  });
}

/**
 * Log photo shared
 */
export function logPhotoShared(
  recipientId: string,
  visitId: string,
  caregiverName: string
) {
  return logActivity({
    recipientId,
    visitId,
    actorName: caregiverName,
    activityType: 'photo_shared',
    summary: `${caregiverName} shared a photo from the visit`,
  });
}
