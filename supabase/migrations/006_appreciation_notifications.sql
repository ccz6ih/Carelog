-- ============================================================
-- Migration 006: Add caregiver appreciation notification preferences
-- ============================================================
-- Purpose: Support achievement-based appreciation notifications
-- Context: Celebrates milestones, streaks, and perfect weeks
-- Philosophy: Show caregivers they are SEEN beyond payment
-- ============================================================

alter table notification_preferences
  add column if not exists milestone_reached boolean not null default true,
  add column if not exists streak_achievement boolean not null default true,
  add column if not exists weekly_praise boolean not null default true,
  add column if not exists perfect_week boolean not null default true;

comment on column notification_preferences.milestone_reached is 'Notify on visit count milestones (10, 25, 50, 100+)';
comment on column notification_preferences.streak_achievement is 'Notify on consecutive day streaks (3, 7, 14, 30+)';
comment on column notification_preferences.weekly_praise is 'Weekly encouragement notification (Sunday 6pm): You are seen';
comment on column notification_preferences.perfect_week is 'All EVV submitted on time, zero errors all week';

-- Verify columns added successfully
DO $$
DECLARE
  col_count INT;
BEGIN
  SELECT COUNT(*) INTO col_count
  FROM information_schema.columns
  WHERE table_name = 'notification_preferences'
    AND column_name IN ('milestone_reached', 'streak_achievement', 'weekly_praise', 'perfect_week');
  
  IF col_count = 4 THEN
    RAISE NOTICE 'Success: All 4 appreciation columns added to notification_preferences';
  ELSE
    RAISE WARNING 'Column count mismatch: expected 4, found %', col_count;
  END IF;
END $$;
