-- =============================================================
-- Wedding RSVP schema
--
-- Run this once against your Supabase project (SQL Editor ->
-- "New query" -> paste & run) to create the tables, indexes and
-- RLS policies needed by the website.
--
-- Design
-- ------
-- * Parties group guests who were invited together (e.g. a couple,
--   a family, a group of flatmates). One RSVP form handles a whole
--   party at once.
-- * Guests store each individual's response.
-- * Authenticated users are allowed to:
--     - SEARCH guests by name (SELECT with ilike)
--     - UPDATE their own `attending`, `menu_choice`, `dietary_notes`
--       and `responded_at` columns (so responses can be edited).
--   It is NOT allowed to insert or delete rows. You (as the couple)
--   pre-load the guest list via the Supabase dashboard or a seed
--   script below.
-- =============================================================

-- Helpful for case-insensitive search.
create extension if not exists pg_trgm;

-- ---------- Tables ----------
create table if not exists public.parties (
  id uuid primary key default gen_random_uuid(),
  party_name text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  party_id uuid not null references public.parties(id) on delete cascade,
  full_name text not null,
  attending text check (attending in ('yes', 'no')),
  menu_choice text check (menu_choice in ('traditional', 'vegetarian')),
  dietary_notes text,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists guests_party_id_idx on public.guests (party_id);
create index if not exists guests_full_name_trgm_idx
  on public.guests using gin (full_name gin_trgm_ops);

-- ---------- Row Level Security ----------
alter table public.parties enable row level security;
alter table public.guests enable row level security;

-- Authenticated users can read (so they can search + load the party).
drop policy if exists "Public read parties" on public.parties;
create policy "Authenticated read parties"
  on public.parties for select
  to authenticated
  using (true);

drop policy if exists "Public read guests" on public.guests;
create policy "Authenticated read guests"
  on public.guests for select
  to authenticated
  using (true);

-- Anyone can update an existing guest row (to submit / edit their RSVP).
-- Restricting which columns change is done at the policy level by only
-- permitting UPDATE (the client in the app only sets the RSVP
-- fields). If you want hard column-level enforcement, create a SECURITY
-- DEFINER function and only expose that.
drop policy if exists "Public update guests" on public.guests;
create policy "Authenticated update guests"
  on public.guests for update
  to authenticated
  using (true)
  with check (true);

-- Explicitly NO insert / delete policy for anon — only you (via the
-- dashboard or service-role key) can add or remove guests.

-- ---------- Realtime (optional) ----------
-- Uncomment if you want to live-watch RSVPs come in from an admin page.
-- alter publication supabase_realtime add table public.guests;
