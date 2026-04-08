-- Grove Database Schema
-- Multi-user from day one: every table has user_id with RLS

-- 1. BRANCHES table
-- Branches are emergent, not fixed. The Gardener creates/renames/repositions them.
create table public.branches (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text not null default '#c8b47a',
  -- 3D positioning
  attachment float not null default 1.5,
  direction_x float not null default 0,
  direction_y float not null default 2,
  direction_z float not null default 0,
  -- metadata
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. LEAVES table
-- Every piece of content fed to the tree.
create table public.leaves (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  branch_id uuid references public.branches(id) on delete set null,
  type text not null check (type in ('text','image','audio','bucket','capsule','gift','own_writing')),
  content text not null,
  date date not null default current_date,
  person text,
  sealed boolean default false,
  sealed_until date,
  is_own_writing boolean default false,
  is_resurfaced boolean default false,
  bucket_done boolean default false,
  language text,
  -- media
  media_url text,
  media_type text,
  -- metadata
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. NIGHTLY_LOGS table
create table public.nightly_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null default current_date,
  entry text not null,
  positive boolean default true,
  created_at timestamptz default now() not null,
  unique(user_id, date)
);

-- 4. SEED_SUGGESTIONS table
-- Gardener's proposed features/observations.
create table public.seed_suggestions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  why text not null,
  complexity text not null check (complexity in ('small','medium','large')),
  claude_prompt text not null default '',
  status text not null default 'pending' check (status in ('pending','accepted','built','dismissed')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 5. GARDENER_CONTEXT table
-- The Gardener's layered memory: recent, patterns, portrait.
create table public.gardener_context (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  layer text not null check (layer in ('recent','patterns','portrait')),
  content text not null default '',
  updated_at timestamptz default now() not null,
  unique(user_id, layer)
);

-- =========================================
-- ROW LEVEL SECURITY
-- =========================================

alter table public.branches enable row level security;
alter table public.leaves enable row level security;
alter table public.nightly_logs enable row level security;
alter table public.seed_suggestions enable row level security;
alter table public.gardener_context enable row level security;

-- Branches: users can only see/modify their own
create policy "Users can view own branches" on public.branches
  for select using (auth.uid() = user_id);
create policy "Users can insert own branches" on public.branches
  for insert with check (auth.uid() = user_id);
create policy "Users can update own branches" on public.branches
  for update using (auth.uid() = user_id);
create policy "Users can delete own branches" on public.branches
  for delete using (auth.uid() = user_id);

-- Leaves: users can only see/modify their own
create policy "Users can view own leaves" on public.leaves
  for select using (auth.uid() = user_id);
create policy "Users can insert own leaves" on public.leaves
  for insert with check (auth.uid() = user_id);
create policy "Users can update own leaves" on public.leaves
  for update using (auth.uid() = user_id);
create policy "Users can delete own leaves" on public.leaves
  for delete using (auth.uid() = user_id);

-- Nightly logs: users can only see/modify their own
create policy "Users can view own nightly_logs" on public.nightly_logs
  for select using (auth.uid() = user_id);
create policy "Users can insert own nightly_logs" on public.nightly_logs
  for insert with check (auth.uid() = user_id);
create policy "Users can update own nightly_logs" on public.nightly_logs
  for update using (auth.uid() = user_id);
create policy "Users can delete own nightly_logs" on public.nightly_logs
  for delete using (auth.uid() = user_id);

-- Seed suggestions: users can only see/modify their own
create policy "Users can view own seed_suggestions" on public.seed_suggestions
  for select using (auth.uid() = user_id);
create policy "Users can insert own seed_suggestions" on public.seed_suggestions
  for insert with check (auth.uid() = user_id);
create policy "Users can update own seed_suggestions" on public.seed_suggestions
  for update using (auth.uid() = user_id);
create policy "Users can delete own seed_suggestions" on public.seed_suggestions
  for delete using (auth.uid() = user_id);

-- Gardener context: users can only see/modify their own
create policy "Users can view own gardener_context" on public.gardener_context
  for select using (auth.uid() = user_id);
create policy "Users can insert own gardener_context" on public.gardener_context
  for insert with check (auth.uid() = user_id);
create policy "Users can update own gardener_context" on public.gardener_context
  for update using (auth.uid() = user_id);
create policy "Users can delete own gardener_context" on public.gardener_context
  for delete using (auth.uid() = user_id);

-- =========================================
-- INDEXES for common queries
-- =========================================
create index idx_branches_user on public.branches(user_id);
create index idx_leaves_user on public.leaves(user_id);
create index idx_leaves_branch on public.leaves(branch_id);
create index idx_leaves_user_date on public.leaves(user_id, date desc);
create index idx_nightly_logs_user_date on public.nightly_logs(user_id, date desc);
create index idx_seed_suggestions_user on public.seed_suggestions(user_id);
create index idx_gardener_context_user on public.gardener_context(user_id);
