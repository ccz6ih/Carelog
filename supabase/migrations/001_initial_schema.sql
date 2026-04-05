-- ============================================================
-- CareLog Database Schema
-- Supabase (PostgreSQL) — Initial Migration
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";  -- for GPS location queries

-- ============================================================
-- ENUMS
-- ============================================================

create type subscription_tier as enum ('basic', 'pro', 'family');
create type evv_status as enum ('idle', 'clocked_in', 'clocked_out', 'submitted', 'error');
create type aggregator_type as enum ('hhax', 'sandata', 'tellus', 'providerone', 'calevv');
create type task_category as enum ('personal_care', 'meals', 'medication', 'mobility', 'companionship', 'other');
create type payment_method as enum ('venmo', 'zelle', 'paypal', 'cashapp');
create type family_role as enum ('viewer', 'admin');

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  tier subscription_tier not null default 'basic',
  is_onboarded boolean not null default false,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, first_name, last_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- CARE RECIPIENTS
-- ============================================================

create table recipients (
  id uuid primary key default uuid_generate_v4(),
  caregiver_id uuid not null references profiles(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  relationship text not null,        -- e.g. 'mother', 'father', 'spouse'
  provider_id text not null,         -- state Medicaid provider ID
  recipient_id text not null,        -- state Medicaid recipient ID
  state char(2) not null,            -- US state code
  aggregator aggregator_type not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_recipients_caregiver on recipients(caregiver_id);

-- ============================================================
-- VISITS
-- ============================================================

create table visits (
  id uuid primary key default uuid_generate_v4(),
  caregiver_id uuid not null references profiles(id) on delete cascade,
  recipient_id uuid not null references recipients(id) on delete cascade,
  clock_in_time timestamptz not null default now(),
  clock_out_time timestamptz,
  clock_in_lat double precision,
  clock_in_lng double precision,
  clock_out_lat double precision,
  clock_out_lng double precision,
  notes text default '',
  photos text[] default '{}',
  evv_status evv_status not null default 'clocked_in',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_visits_caregiver on visits(caregiver_id);
create index idx_visits_recipient on visits(recipient_id);
create index idx_visits_created on visits(created_at desc);

-- ============================================================
-- TASK LOGS (per visit)
-- ============================================================

create table task_logs (
  id uuid primary key default uuid_generate_v4(),
  visit_id uuid not null references visits(id) on delete cascade,
  name text not null,
  category task_category not null default 'other',
  completed boolean not null default false,
  timestamp timestamptz not null default now()
);

create index idx_task_logs_visit on task_logs(visit_id);

-- ============================================================
-- EVV SUBMISSIONS (audit trail + retry queue)
-- ============================================================

create table evv_submissions (
  id uuid primary key default uuid_generate_v4(),
  visit_id uuid not null references visits(id) on delete cascade,
  aggregator aggregator_type not null,
  payload jsonb not null,              -- the 6 EVV data points sent
  response_status int,                 -- HTTP status from aggregator
  response_body jsonb,                 -- aggregator response
  confirmation_id text,                -- aggregator confirmation ID
  success boolean not null default false,
  retry_count int not null default 0,
  next_retry_at timestamptz,           -- for exponential backoff
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_evv_visit on evv_submissions(visit_id);
create index idx_evv_pending on evv_submissions(success, next_retry_at)
  where success = false;

-- ============================================================
-- FAMILY MEMBERS (viewers of care activity)
-- ============================================================

create table family_members (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,  -- null if invite pending
  recipient_id uuid not null references recipients(id) on delete cascade,
  name text not null,
  email text not null,
  relationship text not null,
  role family_role not null default 'viewer',
  invite_accepted boolean not null default false,
  invited_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create index idx_family_recipient on family_members(recipient_id);
create unique index idx_family_unique on family_members(email, recipient_id);

-- ============================================================
-- FAMILY ACTIVITY FEED
-- ============================================================

create table family_activity (
  id uuid primary key default uuid_generate_v4(),
  recipient_id uuid not null references recipients(id) on delete cascade,
  visit_id uuid references visits(id) on delete set null,
  actor_name text not null,            -- caregiver name for display
  activity_type text not null,         -- 'visit_started', 'visit_completed', 'task_logged', 'photo_shared'
  summary text not null,               -- human-readable description
  metadata jsonb default '{}',         -- extra data (task count, photo url, etc.)
  created_at timestamptz not null default now()
);

create index idx_activity_recipient on family_activity(recipient_id);
create index idx_activity_created on family_activity(created_at desc);

-- ============================================================
-- APPRECIATION PAYMENTS
-- ============================================================

create table appreciation_payments (
  id uuid primary key default uuid_generate_v4(),
  from_family_member_id uuid not null references family_members(id) on delete cascade,
  to_caregiver_id uuid not null references profiles(id) on delete cascade,
  amount decimal(10,2) not null check (amount > 0),
  method payment_method not null,
  message text,
  created_at timestamptz not null default now()
);

create index idx_appreciation_caregiver on appreciation_payments(to_caregiver_id);

-- ============================================================
-- UPDATED_AT TRIGGER (auto-update timestamp)
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on profiles
  for each row execute function update_updated_at();
create trigger set_updated_at before update on recipients
  for each row execute function update_updated_at();
create trigger set_updated_at before update on visits
  for each row execute function update_updated_at();
create trigger set_updated_at before update on evv_submissions
  for each row execute function update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table profiles enable row level security;
alter table recipients enable row level security;
alter table visits enable row level security;
alter table task_logs enable row level security;
alter table evv_submissions enable row level security;
alter table family_members enable row level security;
alter table family_activity enable row level security;
alter table appreciation_payments enable row level security;

-- PROFILES: users can read/update their own profile
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- RECIPIENTS: caregivers manage their own recipients
create policy "Caregivers can view own recipients"
  on recipients for select using (auth.uid() = caregiver_id);
create policy "Caregivers can insert recipients"
  on recipients for insert with check (auth.uid() = caregiver_id);
create policy "Caregivers can update own recipients"
  on recipients for update using (auth.uid() = caregiver_id);
create policy "Caregivers can delete own recipients"
  on recipients for delete using (auth.uid() = caregiver_id);

-- VISITS: caregivers manage their own visits
create policy "Caregivers can view own visits"
  on visits for select using (auth.uid() = caregiver_id);
create policy "Caregivers can insert visits"
  on visits for insert with check (auth.uid() = caregiver_id);
create policy "Caregivers can update own visits"
  on visits for update using (auth.uid() = caregiver_id);

-- Family members can view visits for their linked recipients
create policy "Family can view recipient visits"
  on visits for select using (
    exists (
      select 1 from family_members fm
      where fm.user_id = auth.uid()
        and fm.recipient_id = visits.recipient_id
        and fm.invite_accepted = true
    )
  );

-- TASK LOGS: accessible via visit ownership
create policy "View task logs for own visits"
  on task_logs for select using (
    exists (select 1 from visits v where v.id = task_logs.visit_id and v.caregiver_id = auth.uid())
  );
create policy "Insert task logs for own visits"
  on task_logs for insert with check (
    exists (select 1 from visits v where v.id = task_logs.visit_id and v.caregiver_id = auth.uid())
  );
create policy "Update task logs for own visits"
  on task_logs for update using (
    exists (select 1 from visits v where v.id = task_logs.visit_id and v.caregiver_id = auth.uid())
  );

-- Family can view task logs for their recipient's visits
create policy "Family can view recipient task logs"
  on task_logs for select using (
    exists (
      select 1 from visits v
      join family_members fm on fm.recipient_id = v.recipient_id
      where v.id = task_logs.visit_id
        and fm.user_id = auth.uid()
        and fm.invite_accepted = true
    )
  );

-- EVV SUBMISSIONS: caregivers can view their own
create policy "Caregivers can view own EVV submissions"
  on evv_submissions for select using (
    exists (select 1 from visits v where v.id = evv_submissions.visit_id and v.caregiver_id = auth.uid())
  );
create policy "Caregivers can insert EVV submissions"
  on evv_submissions for insert with check (
    exists (select 1 from visits v where v.id = evv_submissions.visit_id and v.caregiver_id = auth.uid())
  );

-- FAMILY MEMBERS: caregivers manage, members see their own
create policy "Caregivers can manage family members"
  on family_members for all using (auth.uid() = invited_by);
create policy "Family members can view own record"
  on family_members for select using (auth.uid() = user_id);

-- FAMILY ACTIVITY: visible to caregiver and linked family
create policy "Caregivers can view own recipient activity"
  on family_activity for select using (
    exists (select 1 from recipients r where r.id = family_activity.recipient_id and r.caregiver_id = auth.uid())
  );
create policy "Caregivers can insert activity"
  on family_activity for insert with check (
    exists (select 1 from recipients r where r.id = family_activity.recipient_id and r.caregiver_id = auth.uid())
  );
create policy "Family can view recipient activity"
  on family_activity for select using (
    exists (
      select 1 from family_members fm
      where fm.recipient_id = family_activity.recipient_id
        and fm.user_id = auth.uid()
        and fm.invite_accepted = true
    )
  );

-- APPRECIATION PAYMENTS: family can send, caregivers can view received
create policy "Family can send appreciation"
  on appreciation_payments for insert with check (
    exists (select 1 from family_members fm where fm.id = from_family_member_id and fm.user_id = auth.uid())
  );
create policy "Caregivers can view received appreciation"
  on appreciation_payments for select using (auth.uid() = to_caregiver_id);
create policy "Family can view sent appreciation"
  on appreciation_payments for select using (
    exists (select 1 from family_members fm where fm.id = from_family_member_id and fm.user_id = auth.uid())
  );
