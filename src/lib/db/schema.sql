-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users table
create table public.users (
  id uuid references auth.users not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null,
  username text not null,
  avatar_url text,
  total_tests integer default 0,
  rank_points integer default 0,
  last_active timestamp with time zone default timezone('utc'::text, now()),
  constraint username_length check (char_length(username) >= 3)
);

-- Enable RLS for users
alter table public.users enable row level security;

-- Create users policies
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

-- Create code_snippets table
create table public.code_snippets (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  content text not null,
  language text not null,
  difficulty text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author_id uuid references public.users,
  likes integer default 0,
  times_completed integer default 0,
  source_url text,
  constraint valid_language check (language in ('javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust', 'php', 'ruby', 'kotlin', 'swift', 'scala', 'r', 'matlab', 'sql', 'perl', 'haskell')),
  constraint valid_difficulty check (difficulty in ('beginner', 'intermediate', 'advanced'))
);

-- Enable RLS for code_snippets
alter table public.code_snippets enable row level security;

-- Create code_snippets policies
create policy "Anyone can view code snippets" on public.code_snippets
  for select using (true);

create policy "Authenticated users can create code snippets" on public.code_snippets
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update their own snippets" on public.code_snippets
  for update using (auth.uid() = author_id);

create policy "Users can delete their own snippets" on public.code_snippets
  for delete using (auth.uid() = author_id);

-- Create typing_results table
create table public.typing_results (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.users not null,
  wpm integer not null,
  accuracy numeric not null,
  duration integer not null,
  text_type text not null,
  language text,
  code_snippet_id uuid references public.code_snippets
);

-- Enable RLS for typing_results
alter table public.typing_results enable row level security;

-- Create typing_results policies
create policy "Users can view all typing results" on public.typing_results
  for select using (true);

create policy "Users can insert their own results" on public.typing_results
  for insert with check (auth.uid() = user_id);

-- Create leaderboard_cache table
create table public.leaderboard_cache (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  period text not null,
  category text not null,
  score numeric not null,
  rank integer not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint valid_period check (period in ('daily', 'weekly', 'monthly', 'all_time')),
  constraint valid_category check (category in ('wpm', 'accuracy', 'tests_completed'))
);

-- Enable RLS for leaderboard_cache
alter table public.leaderboard_cache enable row level security;

-- Create leaderboard_cache policies
create policy "Anyone can view leaderboard" on public.leaderboard_cache
  for select using (true);

-- Create race_rooms table
create table public.race_rooms (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_by uuid references public.users not null,
  status text not null default 'waiting',
  max_players integer not null default 5,
  current_players integer not null default 0,
  text_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  finished_at timestamp with time zone,
  is_private boolean not null default false,
  access_code text,
  constraint valid_status check (status in ('waiting', 'in_progress', 'completed'))
);

-- Enable RLS for race_rooms
alter table public.race_rooms enable row level security;

-- Create race_rooms policies
create policy "Anyone can view public race rooms" on public.race_rooms
  for select using (not is_private or auth.uid() = created_by);

create policy "Authenticated users can create race rooms" on public.race_rooms
  for insert with check (auth.role() = 'authenticated');

-- Create race_participants table
create table public.race_participants (
  id uuid default uuid_generate_v4() primary key,
  race_id uuid references public.race_rooms not null,
  user_id uuid references public.users not null,
  status text not null default 'waiting',
  progress integer not null default 0,
  wpm integer not null default 0,
  accuracy numeric not null default 0,
  finished_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint valid_status check (status in ('waiting', 'ready', 'racing', 'finished'))
);

-- Enable RLS for race_participants
alter table public.race_participants enable row level security;

-- Create race_participants policies
create policy "Anyone can view race participants" on public.race_participants
  for select using (true);

create policy "Authenticated users can join races" on public.race_participants
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update their own race progress" on public.race_participants
  for update using (auth.uid() = user_id); 