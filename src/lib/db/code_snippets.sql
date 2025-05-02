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
  constraint valid_language check (language in ('javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust', 'php', 'ruby')),
  constraint valid_difficulty check (difficulty in ('beginner', 'intermediate', 'advanced'))
);

-- Enable Row Level Security
alter table public.code_snippets enable row level security;

-- Create policies
create policy "Anyone can view code snippets" on public.code_snippets
  for select using (true);

create policy "Authenticated users can create code snippets" on public.code_snippets
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update their own snippets" on public.code_snippets
  for update using (auth.uid() = author_id);

create policy "Users can delete their own snippets" on public.code_snippets
  for delete using (auth.uid() = author_id); 