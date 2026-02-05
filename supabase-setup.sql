-- SUPABASE SCHEMA SETUP 
-- This script sets up the database tables, relations, and security policies for GenHire AI.

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. USERS TABLE
-- Stores additional profile information for users synchronized with auth.users
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  first_name text,
  last_name text,
  phone_number text,
  address text,
  education jsonb, -- { elementary: "", high_school: "", college: "" }
  onboarding_completed boolean default false,
  subscription_plan text default 'free',
  credits decimal default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. QUESTION CATEGORIES
create table public.question_categories (
  id serial primary key,
  name text not null,
  description text,
  icon text,
  color text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. USER QUESTIONS (Question Bank usage)
create table public.user_questions (
  id text primary key, -- Format: userId_category
  "userId" uuid references public.users(id) on delete cascade,
  category text not null,
  questions jsonb, -- Array of questions
  answers jsonb default '{}'::jsonb, -- Map of index to { answer, analysis, ... }
  "batchId" text,
  "fetchDate" text,
  "updatedAt" timestamp with time zone default timezone('utc'::text, now())
);

-- 5. INTERVIEWS
create table public.interviews (
  id uuid default uuid_generate_v4() primary key,
  "userId" uuid references public.users(id) on delete cascade,
  topic text,
  "interviewType" text,
  overall_score decimal,
  analysis jsonb,
  transcription jsonb,
  recordingUrl text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. SUBSCRIPTIONS
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  "userId" uuid references public.users(id) on delete cascade,
  plan text not null, -- 'free', 'premium', 'professional'
  status text, -- 'active', 'canceled', 'past_due'
  "currentPeriodEnd" timestamp with time zone,
  "cancelAtPeriodEnd" boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. PASSWORD RESET TOKENS
create table public.password_reset_tokens (
  id serial primary key,
  user_id uuid references public.users(id) on delete cascade,
  token text not null,
  expires_at timestamp with time zone not null,
  is_used boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 8. ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.question_categories enable row level security;
alter table public.user_questions enable row level security;
alter table public.interviews enable row level security;
alter table public.subscriptions enable row level security;
alter table public.password_reset_tokens enable row level security;

-- 9. POLICIES

-- Users: anyone can see their own profile
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

-- Question Categories: everyone can read
create policy "Categories are viewable by everyone" on public.question_categories
  for select using (true);

-- User Questions: only users can access their own data
create policy "Users can manage their own questions" on public.user_questions
  for all using (auth.uid() = "userId");

-- Interviews: only users can see their own interviews
create policy "Users can manage their own interviews" on public.interviews
  for all using (auth.uid() = "userId");

-- Subscriptions: users can view their own
create policy "Users can view own subscription" on public.subscriptions
  for select using (auth.uid() = "userId");

-- 10. AUTH TRIGGER
-- Automatically create a user record in public.users when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, first_name, last_name)
  values (new.id, new.email, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 11. SEED DATA
insert into public.question_categories (name, description, icon, color, sort_order)
values 
  ('Behavioral', 'Questions about past experiences and behavior', 'user', '#3B82F6', 1),
  ('Technical', 'Technical skills and knowledge questions', 'code', '#10B981', 2),
  ('Situational', 'Hypothetical scenario-based questions', 'lightbulb', '#F59E0B', 3);
