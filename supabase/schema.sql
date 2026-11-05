-- T-HYDRA · accounts and requests
-- Run once in Supabase → SQL Editor → New query → Run.
-- Visitors see and create only their own requests; only studio admins (table public.admins) can see all
-- requests and change their status. Enforced by row-level security on the server, not by the website.

create table if not exists public.requests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  user_email  text default (auth.jwt() ->> 'email'),
  ref         text not null check (char_length(ref) <= 40),
  kind        text not null check (kind in ('brief', 'message')),
  product     text check (char_length(product) <= 200),
  summary     text check (char_length(summary) <= 500),
  brief       jsonb not null default '{}'::jsonb,
  status      text not null default 'new' check (status in ('new', 'in_review', 'in_progress', 'done', 'declined')),
  studio_note text check (char_length(studio_note) <= 500),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists requests_user_created on public.requests (user_id, created_at desc);

-- Studio admins: add your own email after you have signed up on the site (see setup/ACCOUNTS-SETUP.md).
create table if not exists public.admins (email text primary key);
alter table public.admins enable row level security;   -- no policies: not readable from the website

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists requests_touch on public.requests;
create trigger requests_touch before update on public.requests for each row execute function public.touch_updated_at();

alter table public.requests enable row level security;

drop policy if exists "read own or admin" on public.requests;
create policy "read own or admin" on public.requests for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "create own new requests" on public.requests;
create policy "create own new requests" on public.requests for insert to authenticated
  with check (user_id = auth.uid() and status = 'new' and studio_note is null
              and user_email = (auth.jwt() ->> 'email'));

drop policy if exists "studio updates" on public.requests;
create policy "studio updates" on public.requests for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- No delete policy: requests are kept. The studio can delete rows in the Supabase dashboard if needed.
grant select, insert, update on public.requests to authenticated;
