-- AI-15: Initial schema — profiles, canvas_sessions, clients + RLS
-- =================================================================

-- Enable moddatetime for auto-updating updated_at
create extension if not exists moddatetime with schema extensions;

-- ---------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  locale text default 'en',
  role text default 'user' check (role in ('admin', 'user')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "profiles: users read own"
  on public.profiles for select
  using (auth.uid() = id);

-- Admin can read all profiles
create policy "profiles: admin reads all"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Users can update their own profile
create policy "profiles: users update own"
  on public.profiles for update
  using (auth.uid() = id);

-- Allow trigger (security definer) to insert
create policy "profiles: insert via trigger"
  on public.profiles for insert
  with check (true);

-- Auto-update updated_at
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure extensions.moddatetime(updated_at);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, locale)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'en'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- canvas_sessions
-- ---------------------------------------------------------------------------
create table public.canvas_sessions (
  id uuid primary key default gen_random_uuid(),
  lead_name text,
  lead_email text,
  lead_company text,
  language text default 'en',
  source text default 'direct',
  domain_graph jsonb not null default '{"entities":[],"relationships":[],"notes":[]}',
  messages jsonb not null default '[]',
  summary text,
  fit_score int check (fit_score between 1 and 10),
  fit_reason text,
  status text default 'active' check (status in ('active','completed','reviewed','accepted','declined')),
  tokens_used int default 0,
  cost_usd numeric(8,4) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.canvas_sessions enable row level security;

-- Anon/authenticated can create a session
create policy "canvas_sessions: anyone can insert"
  on public.canvas_sessions for insert
  with check (true);

-- Admin can read all sessions
create policy "canvas_sessions: admin reads all"
  on public.canvas_sessions for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Admin can update sessions
create policy "canvas_sessions: admin updates all"
  on public.canvas_sessions for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Auto-update updated_at
create trigger canvas_sessions_updated_at
  before update on public.canvas_sessions
  for each row execute procedure extensions.moddatetime(updated_at);

-- ---------------------------------------------------------------------------
-- clients
-- ---------------------------------------------------------------------------
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  canvas_session_id uuid references public.canvas_sessions(id),
  name text not null,
  email text,
  company text,
  source text default 'direct',
  status text default 'lead' check (status in ('lead','active','completed','returning','declined')),
  fit_score int,
  budget_range text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.clients enable row level security;

-- Admin only: select
create policy "clients: admin reads all"
  on public.clients for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Admin only: insert
create policy "clients: admin inserts"
  on public.clients for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Admin only: update
create policy "clients: admin updates"
  on public.clients for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Admin only: delete
create policy "clients: admin deletes"
  on public.clients for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Auto-update updated_at
create trigger clients_updated_at
  before update on public.clients
  for each row execute procedure extensions.moddatetime(updated_at);
