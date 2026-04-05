-- ============================================================
-- Migration 003: Backfill notification_preferences for existing users
-- ============================================================

INSERT INTO notification_preferences (user_id)
SELECT id FROM profiles
WHERE id NOT IN (SELECT user_id FROM notification_preferences)
ON CONFLICT DO NOTHING;
