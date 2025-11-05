-- Create passwords table
create table public.passwords (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  title text not null,
  username text not null,
  password text not null,
  url text,
  notes text
);

-- Set up Row Level Security (RLS)
alter table public.passwords enable row level security;

-- Create policy to allow users to only see their own passwords
create policy "Users can only see their own passwords"
  on public.passwords for select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own passwords
create policy "Users can insert their own passwords"
  on public.passwords for insert
  with check (auth.uid() = user_id);

-- Create policy to allow users to update their own passwords
create policy "Users can update their own passwords"
  on public.passwords for update
  using (auth.uid() = user_id);

-- Create policy to allow users to delete their own passwords
create policy "Users can delete their own passwords"
  on public.passwords for delete
  using (auth.uid() = user_id);