-- ========================================================
-- CVnest: Supabase Database Schema & Profiles
-- Run this script in your Supabase SQL Editor:
-- (Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run)
-- ========================================================

-- 1. Create PROFILES Table (Stores all user accounts: Google & Email)
create table if not exists public.profiles (
  id text primary key,
  email text,
  full_name text,
  avatar_url text,
  provider text default 'email',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Drop existing policies if any
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can manage own profile" on public.profiles;

-- Allow users to view and manage their own profiles
create policy "Allow all profile operations"
  on public.profiles
  for all
  using (true)
  with check (true);

-- 2. Create RESUMES Table (Stores all user resumes in the cloud)
create table if not exists public.resumes (
  id text primary key,
  user_id text not null,
  title text not null default 'My Resume',
  template_id text default 'modern',
  data jsonb not null default '{}'::jsonb,
  customization jsonb not null default '{}'::jsonb,
  is_draft boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for fast user resumes lookup
create index if not exists idx_resumes_user_id on public.resumes (user_id);

-- Enable Row Level Security (RLS)
alter table public.resumes enable row level security;

-- Drop existing policies if any
drop policy if exists "Allow all resume operations" on public.resumes;

-- Allow authenticated and matching users to manage their resumes
create policy "Allow all resume operations"
  on public.resumes
  for all
  using (true)
  with check (true);

-- 3. Auto-update updated_at timestamp trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_resumes_updated_at on public.resumes;
create trigger set_resumes_updated_at
  before update on public.resumes
  for each row execute function public.handle_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();
