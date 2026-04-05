# CareLog Database Schema

## Overview
PostgreSQL via Supabase. All tables have Row Level Security (RLS) enabled. UUIDs for all primary keys. Timestamps in UTC.

## Entity Relationship

```
auth.users (Supabase managed)
  └─ profiles (1:1, auto-created on signup)
       └─ recipients (1:many — caregivers have multiple care recipients)
            ├─ visits (1:many — each recipient has many visits)
            │    ├─ task_logs (1:many — tasks performed during visit)
            │    └─ evv_submissions (1:many — submission attempts to aggregator)
            ├─ family_members (1:many — family viewers per recipient)
            │    └─ appreciation_payments (1:many — payments to caregiver)
            └─ family_activity (1:many — activity feed entries)
```

## Tables

### profiles
Extends Supabase auth.users. Auto-created via trigger on signup.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | References auth.users(id) |
| first_name | text | From signup metadata |
| last_name | text | From signup metadata |
| email | text | |
| phone | text | Optional |
| tier | subscription_tier | 'basic', 'pro', 'family' |
| is_onboarded | boolean | Has completed recipient setup |
| avatar_url | text | Optional |
| created_at | timestamptz | |
| updated_at | timestamptz | Auto-updated via trigger |

### recipients
Care recipients linked to a caregiver.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| caregiver_id | uuid FK → profiles | |
| first_name | text | |
| last_name | text | |
| relationship | text | e.g. 'mother', 'spouse' |
| provider_id | text | State Medicaid provider ID |
| recipient_id | text | State Medicaid recipient ID |
| state | char(2) | US state code |
| aggregator | aggregator_type | Which EVV aggregator to submit to |
| is_active | boolean | |

### visits
Clock in/out records with GPS.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| caregiver_id | uuid FK → profiles | |
| recipient_id | uuid FK → recipients | |
| clock_in_time | timestamptz | |
| clock_out_time | timestamptz | Null while active |
| clock_in_lat | float | GPS latitude |
| clock_in_lng | float | GPS longitude |
| clock_out_lat | float | |
| clock_out_lng | float | |
| notes | text | |
| photos | text[] | URLs |
| evv_status | evv_status | 'clocked_in' → 'clocked_out' → 'submitted' |

### task_logs
Care tasks performed during a visit.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| visit_id | uuid FK → visits | |
| name | text | e.g. 'Medication administered' |
| category | task_category | personal_care, meals, medication, mobility, companionship, other |
| completed | boolean | |
| timestamp | timestamptz | |

### evv_submissions
Audit trail of every EVV submission attempt.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| visit_id | uuid FK → visits | |
| aggregator | aggregator_type | |
| payload | jsonb | The 6 EVV data points sent |
| response_status | int | HTTP status from aggregator |
| response_body | jsonb | Raw response |
| confirmation_id | text | Aggregator confirmation |
| success | boolean | |
| retry_count | int | Exponential backoff counter |
| next_retry_at | timestamptz | When to retry |
| error_message | text | |

### family_members
Family/friends who can view care activity for a recipient.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK → profiles | Null if invite pending |
| recipient_id | uuid FK → recipients | |
| name | text | |
| email | text | Unique per recipient |
| relationship | text | |
| role | family_role | 'viewer' or 'admin' |
| invite_accepted | boolean | |
| invited_by | uuid FK → profiles | |

### family_activity
Activity feed visible to family members.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| recipient_id | uuid FK → recipients | |
| visit_id | uuid FK → visits | Optional |
| actor_name | text | Caregiver display name |
| activity_type | text | visit_started, visit_completed, task_logged, photo_shared |
| summary | text | Human-readable description |
| metadata | jsonb | Extra context |

### appreciation_payments
Family → caregiver appreciation/tips.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| from_family_member_id | uuid FK → family_members | |
| to_caregiver_id | uuid FK → profiles | |
| amount | decimal(10,2) | Must be > 0 |
| method | payment_method | venmo, zelle, paypal, cashapp |
| message | text | Optional |

## Row Level Security Summary

| Table | Caregiver | Family Member |
|-------|-----------|---------------|
| profiles | Own only | — |
| recipients | Own only | — |
| visits | Own only | Linked recipients (accepted invite) |
| task_logs | Own visits | Linked recipients (accepted invite) |
| evv_submissions | Own visits | — |
| family_members | Manage (as inviter) | View own record |
| family_activity | Own recipients | Linked recipients (accepted invite) |
| appreciation_payments | View received | Send & view sent |

## Enums

- **subscription_tier:** basic, pro, family
- **evv_status:** idle, clocked_in, clocked_out, submitted, error
- **aggregator_type:** hhax, sandata, tellus, providerone, calevv
- **task_category:** personal_care, meals, medication, mobility, companionship, other
- **payment_method:** venmo, zelle, paypal, cashapp
- **family_role:** viewer, admin

## Migration
Run against Supabase SQL editor or via CLI:
```sql
-- File: supabase/migrations/001_initial_schema.sql
```
