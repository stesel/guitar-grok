-- Create exercises table
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  bpm_min integer not null,
  bpm_max integer not null,
  key text not null,
  est_minutes integer not null,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  notes text,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.exercises enable row level security;
create policy "Users access own exercises" on public.exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Create sessions table
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  total_planned integer not null,
  items jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table public.sessions enable row level security;
create policy "Users access own sessions" on public.sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Create attempts table
create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete cascade,
  bpm_used integer not null,
  status text not null check (status in ('done','partial','fail')),
  timestamp timestamptz not null default now(),
  notes text
);

alter table public.attempts enable row level security;
create policy "Users access own attempts" on public.attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
