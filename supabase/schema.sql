-- Uncommon Cents V3 -- Supabase Schema
-- Run this in the Supabase SQL editor to create all tables

-- User profiles with financial situation
create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  money_script text check (money_script in ('avoidance', 'worship', 'status', 'vigilance')),
  financial_situation jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table user_profiles enable row level security;
create policy "Users read own profile" on user_profiles for select using (auth.uid() = id);
create policy "Users update own profile" on user_profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on user_profiles for insert with check (auth.uid() = id);

-- Reading progress (concepts, strategies, defenses, etc.)
create type content_type_enum as enum (
  'concept', 'strategy', 'defense', 'script', 'loop_step', 'calculator', 'lesson'
);

create table if not exists reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  content_type content_type_enum not null,
  content_id text not null,
  completed boolean default false,
  progress_pct integer default 0 check (progress_pct >= 0 and progress_pct <= 100),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, content_type, content_id)
);

alter table reading_progress enable row level security;
create policy "Users read own progress" on reading_progress for select using (auth.uid() = user_id);
create policy "Users write own progress" on reading_progress for insert with check (auth.uid() = user_id);
create policy "Users update own progress" on reading_progress for update using (auth.uid() = user_id);

-- Daily streaks
create table if not exists daily_streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_active_date date,
  created_at timestamptz default now()
);

alter table daily_streaks enable row level security;
create policy "Users read own streak" on daily_streaks for select using (auth.uid() = user_id);
create policy "Users write own streak" on daily_streaks for insert with check (auth.uid() = user_id);
create policy "Users update own streak" on daily_streaks for update using (auth.uid() = user_id);

-- Bookmarks / saved items
create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  content_type content_type_enum not null,
  content_id text not null,
  created_at timestamptz default now(),
  unique (user_id, content_type, content_id)
);

alter table bookmarks enable row level security;
create policy "Users read own bookmarks" on bookmarks for select using (auth.uid() = user_id);
create policy "Users write own bookmarks" on bookmarks for insert with check (auth.uid() = user_id);
create policy "Users delete own bookmarks" on bookmarks for delete using (auth.uid() = user_id);

-- Quiz results (money scripts, financial DNA)
create table if not exists quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  quiz_type text not null,
  answers jsonb not null default '{}',
  results jsonb not null default '{}',
  created_at timestamptz default now()
);

alter table quiz_results enable row level security;
create policy "Users read own results" on quiz_results for select using (auth.uid() = user_id);
create policy "Users write own results" on quiz_results for insert with check (auth.uid() = user_id);

-- Saved calculator results
create table if not exists saved_calculations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  calculator_id text not null,
  inputs jsonb not null default '{}',
  results jsonb not null default '{}',
  label text,
  created_at timestamptz default now()
);

alter table saved_calculations enable row level security;
create policy "Users read own calcs" on saved_calculations for select using (auth.uid() = user_id);
create policy "Users write own calcs" on saved_calculations for insert with check (auth.uid() = user_id);
create policy "Users delete own calcs" on saved_calculations for delete using (auth.uid() = user_id);

-- Operating loop progress
create table if not exists loop_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  completed_steps integer[] default '{}',
  notes jsonb default '{}',
  updated_at timestamptz default now()
);

alter table loop_progress enable row level security;
create policy "Users read own loop" on loop_progress for select using (auth.uid() = user_id);
create policy "Users write own loop" on loop_progress for insert with check (auth.uid() = user_id);
create policy "Users update own loop" on loop_progress for update using (auth.uid() = user_id);

-- Analytics events
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  content_type content_type_enum,
  content_id text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

alter table analytics_events enable row level security;
create policy "Insert analytics" on analytics_events for insert with check (true);
create policy "Users read own analytics" on analytics_events for select using (auth.uid() = user_id);
