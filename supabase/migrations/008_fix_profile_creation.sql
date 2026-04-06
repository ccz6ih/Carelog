-- ============================================================
-- Fix Profile Creation Bug
-- Issue: RLS blocks trigger from inserting new profiles
-- Solution: Add INSERT policy for authenticated users during signup
-- ============================================================

-- Drop and recreate the trigger function to bypass RLS
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();

create or replace function handle_new_user()
returns trigger
security definer
set search_path = public
as $$
begin
  -- Insert into profiles with RLS bypassed (security definer + set search_path)
  insert into public.profiles (id, first_name, last_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.email
  );
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Add INSERT policy for profiles (as safety net)
-- This allows new users to be created during the signup flow
create policy "Enable insert for authentication"
  on profiles for insert
  with check (auth.uid() = id);

-- Verification
do $$
begin
  raise notice 'Migration 008 complete: Profile creation trigger fixed';
end $$;
