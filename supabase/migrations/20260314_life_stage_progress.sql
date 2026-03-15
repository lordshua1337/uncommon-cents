-- Life Stage Progress -- Supabase migration
-- Creates the life_stage_progress table with RLS policies
-- Follows the same pattern as existing tables in schema.sql
-- localStorage is the primary store; this table enables cross-device sync for authenticated users

create table if not exists life_stage_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  stage_id text not null,
  lessons_completed text[] default '{}',
  started_at timestamptz default now(),
  completed_at timestamptz,
  updated_at timestamptz default now(),
  unique (user_id, stage_id)
);

-- Row Level Security
alter table life_stage_progress enable row level security;

-- Users can read their own stage progress
create policy "Users read own stage progress"
  on life_stage_progress for select
  using (auth.uid() = user_id);

-- Users can insert their own stage progress
create policy "Users insert own stage progress"
  on life_stage_progress for insert
  with check (auth.uid() = user_id);

-- Users can update their own stage progress
create policy "Users update own stage progress"
  on life_stage_progress for update
  using (auth.uid() = user_id);

-- Index for fast lookups by user
create index if not exists life_stage_progress_user_id_idx
  on life_stage_progress (user_id);

-- Index for finding completed stages
create index if not exists life_stage_progress_completed_at_idx
  on life_stage_progress (user_id, completed_at)
  where completed_at is not null;

-- Automatically update updated_at on row changes
create or replace function update_life_stage_progress_updated_at()
  returns trigger
  language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger life_stage_progress_updated_at
  before update on life_stage_progress
  for each row
  execute function update_life_stage_progress_updated_at();
