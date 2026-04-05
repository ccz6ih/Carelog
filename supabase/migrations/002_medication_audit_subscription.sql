-- ============================================================
-- CareLog Schema Migration 002
-- Medication logs, subscription tracking, audit logs,
-- notification preferences
-- ============================================================

-- ============================================================
-- MEDICATION LOGS (Pro/Family tier feature)
-- ============================================================

create table medication_logs (
  id uuid primary key default uuid_generate_v4(),
  recipient_id uuid not null references recipients(id) on delete cascade,
  visit_id uuid references visits(id) on delete set null,
  logged_by uuid not null references profiles(id),
  medication_name text not null,
  dosage text,                         -- e.g. "500mg", "2 tablets"
  scheduled_time timestamptz,          -- when it was supposed to be taken
  administered_at timestamptz,         -- when it was actually given
  skipped boolean not null default false,
  skip_reason text,                    -- why medication was skipped
  notes text,
  created_at timestamptz not null default now()
);

create index idx_medication_recipient on medication_logs(recipient_id);
create index idx_medication_visit on medication_logs(visit_id);

-- RLS
alter table medication_logs enable row level security;

create policy "Caregivers can manage medication logs"
  on medication_logs for all using (auth.uid() = logged_by);

create policy "Family can view medication logs"
  on medication_logs for select using (
    exists (
      select 1 from family_members fm
      where fm.recipient_id = medication_logs.recipient_id
        and fm.user_id = auth.uid()
        and fm.invite_accepted = true
    )
  );

-- ============================================================
-- SUBSCRIPTION FIELDS (on profiles)
-- ============================================================

alter table profiles
  add column if not exists subscription_status text not null default 'active',
  add column if not exists stripe_customer_id text,
  add column if not exists subscription_renews_at timestamptz,
  add column if not exists subscription_price decimal(6,2) default 19.99;

-- ============================================================
-- AUDIT LOGS (HIPAA compliance)
-- ============================================================

create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  action text not null,                -- 'view_visit', 'update_recipient', 'export_data', etc.
  resource_type text not null,         -- 'visit', 'recipient', 'profile', etc.
  resource_id uuid,
  ip_address text,
  user_agent text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

create index idx_audit_user on audit_logs(user_id);
create index idx_audit_created on audit_logs(created_at desc);
create index idx_audit_resource on audit_logs(resource_type, resource_id);

-- RLS — users can view their own audit trail
alter table audit_logs enable row level security;

create policy "Users can view own audit logs"
  on audit_logs for select using (auth.uid() = user_id);
create policy "System can insert audit logs"
  on audit_logs for insert with check (true);

-- ============================================================
-- NOTIFICATION PREFERENCES
-- ============================================================

create table notification_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  visit_started boolean not null default true,
  visit_completed boolean not null default true,
  task_logged boolean not null default true,
  photo_shared boolean not null default true,
  medication_alert boolean not null default true,
  appreciation_received boolean not null default true,
  evv_submitted boolean not null default true,
  evv_error boolean not null default true,
  weekly_summary boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index idx_notification_user on notification_preferences(user_id);

-- RLS
alter table notification_preferences enable row level security;

create policy "Users can manage own preferences"
  on notification_preferences for all using (auth.uid() = user_id);

-- Auto-create preferences on profile creation
create or replace function handle_new_profile_preferences()
returns trigger as $$
begin
  insert into notification_preferences (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created_add_prefs
  after insert on public.profiles
  for each row execute function handle_new_profile_preferences();

-- ============================================================
-- Add updated_at trigger for new tables
-- ============================================================

create trigger set_updated_at before update on notification_preferences
  for each row execute function update_updated_at();
