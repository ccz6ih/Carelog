/**
 * CareLog — Caregiver Appreciation Service
 * Celebrates milestones, streaks, and achievements
 * Purpose: Show caregivers they are SEEN and VALUED beyond payment
 */
import { supabase } from '@/services/supabase';
import { sendLocalNotification } from '@/services/notifications';

interface VisitStats {
  totalVisits: number;
  consecutiveDays: number;
  hoursThisWeek: number;
  perfectWeek: boolean; // All EVV submitted, no errors
}

/**
 * Check for milestones and send appreciation notifications
 * Call this after each completed visit
 */
export async function checkMilestones(userId: string): Promise<void> {
  try {
    const stats = await getStats(userId);

    // Visit count milestones (10, 25, 50, 100, 250, 500, 1000)
    const milestones = [10, 25, 50, 100, 250, 500, 1000];
    if (milestones.includes(stats.totalVisits)) {
      await sendLocalNotification('milestone_reached', stats.totalVisits.toString());
    }

    // Streak achievements (3, 7, 14, 30, 60, 90 days)
    const streaks = [3, 7, 14, 30, 60, 90];
    if (streaks.includes(stats.consecutiveDays)) {
      await sendLocalNotification('streak_achievement', stats.consecutiveDays.toString());
    }
  } catch (error) {
    console.error('[CaregiverAppreciation] Milestone check failed:', error);
  }
}

/**
 * Send weekly praise notification (every Sunday at 6pm)
 * Production: would be a Supabase Edge Function cron job
 */
export async function sendWeeklyPraise(userId: string): Promise<void> {
  try {
    const stats = await getStats(userId);
    
    if (stats.hoursThisWeek > 0) {
      const hours = Math.round(stats.hoursThisWeek);
      await sendLocalNotification('weekly_praise', hours.toString());
    }

    // Perfect week bonus (all visits submitted, zero errors)
    if (stats.perfectWeek) {
      await sendLocalNotification('perfect_week', '');
    }
  } catch (error) {
    console.error('[CaregiverAppreciation] Weekly praise failed:', error);
  }
}

/**
 * Get caregiver stats for milestone/streak calculations
 */
async function getStats(userId: string): Promise<VisitStats> {
  // Total visits completed
  const { count: totalVisits } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .eq('caregiver_id', userId)
    .not('clock_out_time', 'is', null);

  // Consecutive days worked (simplified — production would use SQL window functions)
  const { data: recentVisits } = await supabase
    .from('visits')
    .select('clock_in_time')
    .eq('caregiver_id', userId)
    .not('clock_out_time', 'is', null)
    .order('clock_in_time', { ascending: false })
    .limit(90);

  const consecutiveDays = calculateStreak(recentVisits?.map((v) => v.clock_in_time) || []);

  // Hours this week (Sunday 00:00 to now)
  const weekStart = getWeekStart();
  const { data: weekVisits } = await supabase
    .from('visits')
    .select('clock_in_time, clock_out_time')
    .eq('caregiver_id', userId)
    .gte('clock_in_time', weekStart.toISOString())
    .not('clock_out_time', 'is', null);

  const hoursThisWeek = calculateHours(weekVisits || []);

  // Perfect week check (all EVV submitted, no errors)
  const { count: errorCount } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .eq('caregiver_id', userId)
    .gte('clock_in_time', weekStart.toISOString())
    .eq('evv_status', 'error');

  const perfectWeek = (weekVisits?.length || 0) > 0 && errorCount === 0;

  return {
    totalVisits: totalVisits || 0,
    consecutiveDays,
    hoursThisWeek,
    perfectWeek,
  };
}

/**
 * Calculate consecutive days worked from visit timestamps
 */
function calculateStreak(timestamps: string[]): number {
  if (timestamps.length === 0) return 0;

  const dates = timestamps.map((ts) => new Date(ts).toDateString());
  const uniqueDates = [...new Set(dates)];

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const curr = new Date(uniqueDates[i]);
    const prev = new Date(uniqueDates[i - 1]);
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++;
    } else {
      break; // Streak broken
    }
  }

  return streak;
}

/**
 * Calculate total hours from visit records
 */
function calculateHours(
  visits: Array<{ clock_in_time: string; clock_out_time: string }>
): number {
  return visits.reduce((total, visit) => {
    const start = new Date(visit.clock_in_time);
    const end = new Date(visit.clock_out_time);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return total + hours;
  }, 0);
}

/**
 * Get start of current week (Sunday at 00:00)
 */
function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const diff = now.getDate() - day;
  const weekStart = new Date(now.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

export default {
  checkMilestones,
  sendWeeklyPraise,
};
