-- ============================================================
-- Migration 007: Add compliance fields to profiles
-- ============================================================
-- Purpose: Ensure caregivers have complete identity information
-- Context: HIPAA/compliance requires name, DOB, photo for verification
-- ============================================================

alter table profiles
  add column if not exists date_of_birth date null,
  add column if not exists address text null,
  add column if not exists city text null,
  add column if not exists state char(2) null,
  add column if not exists zip_code text null,
  add column if not exists emergency_contact_name text null,
  add column if not exists emergency_contact_phone text null;

comment on column profiles.date_of_birth is 'Caregiver date of birth for compliance/verification';
comment on column profiles.address is 'Mailing address for tax documents (1099)';
comment on column profiles.city is 'City for tax documents';
comment on column profiles.state is 'State for tax documents';
comment on column profiles.zip_code is 'ZIP code for tax documents';
comment on column profiles.emergency_contact_name is 'Emergency contact for caregiver safety';
comment on column profiles.emergency_contact_phone is 'Emergency contact phone number';

-- Verify columns added
DO $$
DECLARE
  col_count INT;
BEGIN
  SELECT COUNT(*) INTO col_count
  FROM information_schema.columns
  WHERE table_name = 'profiles'
    AND column_name IN ('date_of_birth', 'address', 'city', 'state', 'zip_code', 'emergency_contact_name', 'emergency_contact_phone');
  
  IF col_count = 7 THEN
    RAISE NOTICE 'Success: All 7 compliance columns added to profiles';
  ELSE
    RAISE WARNING 'Column count mismatch: expected 7, found %', col_count;
  END IF;
END $$;
