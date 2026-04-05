-- ============================================================
-- Migration 004: Add user_role to profiles
-- Distinguishes caregivers from family viewers
-- ============================================================

alter table profiles
  add column if not exists user_role text not null default 'caregiver';

-- Allow family members to read activity for their linked recipients
-- (already covered by existing RLS policies, but this makes the role queryable)
