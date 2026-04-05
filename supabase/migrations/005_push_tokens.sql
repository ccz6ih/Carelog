-- ============================================================
-- Migration 005: Add push notification tokens
-- Stores Expo push tokens for sending notifications to family members
-- ============================================================

alter table profiles
  add column if not exists push_token text null;

-- Index for faster lookups when sending push notifications
create index if not exists idx_profiles_push_token on profiles(push_token)
  where push_token is not null;

comment on column profiles.push_token is 'Expo push notification token for this user';
