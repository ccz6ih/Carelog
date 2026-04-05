-- ============================================================
-- Migration 003: Backfill notification_preferences for existing users
-- ============================================================
-- Purpose: Ensure all existing users have notification preferences
-- Context: notification_preferences table created in migration 002
-- Default: All preferences TRUE (opt-out model) for maximum engagement
-- 
-- This migration runs AFTER user signup, ensuring caregivers get:
-- - Visit confirmations (EVV submitted, visit completed)
-- - Compliance alerts (EVV errors, retry needed)
-- - Appreciation notifications (family sends payment)
-- - Weekly summaries (hours worked, visits completed, you are seen)
-- ============================================================

INSERT INTO notification_preferences (user_id)
SELECT id FROM profiles
WHERE id NOT IN (SELECT user_id FROM notification_preferences)
ON CONFLICT DO NOTHING;

-- Verify backfill succeeded
DO $$
DECLARE
  profiles_count INT;
  prefs_count INT;
BEGIN
  SELECT COUNT(*) INTO profiles_count FROM profiles;
  SELECT COUNT(*) INTO prefs_count FROM notification_preferences;
  
  IF profiles_count != prefs_count THEN
    RAISE WARNING 'Notification preferences mismatch: % profiles, % preferences', profiles_count, prefs_count;
  ELSE
    RAISE NOTICE 'Success: % users have notification preferences', prefs_count;
  END IF;
END $$;
