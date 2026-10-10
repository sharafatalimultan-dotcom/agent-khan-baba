-- Agent Khan Baba: database schema with Row Level Security.
-- Run in Supabase SQL editor. Then create your admin user in Authentication > Users
-- and insert them into admin_users (see bottom).

create extension if not exists "pgcrypto";

-- ---------- Admin allow-list ----------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

alter table public.admin_users enable row level security;
-- A signed-in user may see only their own row (needed by the server-side admin check).
drop policy if exists "admin_users self read" on public.admin_users;
create policy "admin_users self read" on public.admin_users
  for select to authenticated using (user_id = auth.uid());
-- No insert/update/delete policies: manage admins from the SQL editor only.

-- ---------- Content tables ----------
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 3 and 300),
  answer text not null check (char_length(answer) between 3 and 4000),
  sort_order int not null default 100,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.helplines (
  id uuid primary key default gen_random_uuid(),
  network text not null check (char_length(network) between 2 and 100),
  number text not null check (char_length(number) between 2 and 40),
  note text check (char_length(note) <= 300),
  website text check (website is null or website ~* '^https://'),
  sort_order int not null default 100,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.official_links (
  id uuid primary key default gen_random_uuid(),
  label text not null check (char_length(label) between 2 and 120),
  url text not null check (url ~* '^https://'),
  description text check (char_length(description) <= 300),
  category text not null default 'pta' check (category in ('pta', 'report', 'other')),
  sort_order int not null default 100,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.seo_settings (
  path text primary key,
  title text not null check (char_length(title) between 5 and 70),
  description text not null check (char_length(description) between 20 and 180),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null default '' check (char_length(value) <= 500),
  updated_at timestamptz not null default now()
);

-- ---------- Contact messages ----------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) between 5 and 120),
  subject text not null check (char_length(subject) between 3 and 120),
  message text not null check (char_length(message) between 10 and 2000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- API / event log (hashes only, never raw numbers) ----------
create table if not exists public.api_logs (
  id bigint generated always as identity primary key,
  kind text not null,
  level text not null default 'info' check (level in ('info', 'warn', 'error')),
  message text not null,
  subject_hash text,
  http_status int,
  created_at timestamptz not null default now()
);
create index if not exists api_logs_created_idx on public.api_logs (created_at desc);

-- ---------- RLS ----------
alter table public.faqs enable row level security;
alter table public.helplines enable row level security;
alter table public.official_links enable row level security;
alter table public.seo_settings enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_messages enable row level security;
alter table public.api_logs enable row level security;

-- Public read of published content
create policy "faqs public read" on public.faqs for select using (published or public.is_admin());
create policy "helplines public read" on public.helplines for select using (published or public.is_admin());
create policy "links public read" on public.official_links for select using (published or public.is_admin());
create policy "seo public read" on public.seo_settings for select using (true);
create policy "settings public read" on public.site_settings for select using (true);

-- Admin write
create policy "faqs admin write" on public.faqs for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "helplines admin write" on public.helplines for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "links admin write" on public.official_links for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "seo admin write" on public.seo_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "settings admin write" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Contact: anyone may submit (length checks above); only admins read/modify
create policy "contact public insert" on public.contact_messages for insert to anon, authenticated with check (is_read = false);
create policy "contact admin read" on public.contact_messages for select to authenticated using (public.is_admin());
create policy "contact admin update" on public.contact_messages for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "contact admin delete" on public.contact_messages for delete to authenticated using (public.is_admin());

-- Logs: admins read; inserts come from the service-role key on the server only
create policy "logs admin read" on public.api_logs for select to authenticated using (public.is_admin());
create policy "logs admin delete" on public.api_logs for delete to authenticated using (public.is_admin());

-- ---------- Grant your admin (replace the email, run once after creating the user) ----------
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'you@example.com';
