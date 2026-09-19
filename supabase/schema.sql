-- Washing Machine Navi — Supabase schema
--
-- How to use: open your Supabase project -> SQL Editor -> New query,
-- paste this whole file, and click "Run". It's safe to re-run (uses
-- IF NOT EXISTS / OR REPLACE everywhere).
--
-- This creates:
--   1. old_machines           table (each user's logged old washing machine)
--   2. Row Level Security     so people can only ever see/edit their own rows
--   3. old-machine-photos     storage bucket + policies for the uploaded photos
--
-- Auth: we use Supabase's built-in email magic-link sign-in, so there is
-- no separate "users" table to create — auth.users already exists.

-- 1. Table -------------------------------------------------------------

create table if not exists public.old_machines (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text,
  width_mm    integer,
  depth_mm    integer,
  height_mm   integer,
  tap         text check (tap in ('single', 'mixer', 'unknown')) default 'unknown',
  photo_url   text,
  created_at  timestamptz not null default now()
);

create index if not exists old_machines_user_id_idx on public.old_machines(user_id);

-- 2. Row Level Security --------------------------------------------------

alter table public.old_machines enable row level security;

drop policy if exists "Users can view their own machines" on public.old_machines;
create policy "Users can view their own machines"
  on public.old_machines for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own machines" on public.old_machines;
create policy "Users can insert their own machines"
  on public.old_machines for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own machines" on public.old_machines;
create policy "Users can update their own machines"
  on public.old_machines for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own machines" on public.old_machines;
create policy "Users can delete their own machines"
  on public.old_machines for delete
  using (auth.uid() = user_id);

-- 3. Storage bucket for old-machine photos -------------------------------

insert into storage.buckets (id, name, public)
values ('old-machine-photos', 'old-machine-photos', true)
on conflict (id) do nothing;

-- Anyone can view a photo (bucket is public — links are unguessable UUIDs
-- and this is only reference photos of appliances, not sensitive data).
drop policy if exists "Public can view old machine photos" on storage.objects;
create policy "Public can view old machine photos"
  on storage.objects for select
  using (bucket_id = 'old-machine-photos');

-- Only the signed-in owner can upload into their own folder
-- (the app uploads to `<user_id>/<filename>.jpg`).
drop policy if exists "Users can upload their own machine photos" on storage.objects;
create policy "Users can upload their own machine photos"
  on storage.objects for insert
  with check (
    bucket_id = 'old-machine-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own machine photos" on storage.objects;
create policy "Users can delete their own machine photos"
  on storage.objects for delete
  using (
    bucket_id = 'old-machine-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
