-- Making Sense OT — database schema
-- Paste this into Supabase → SQL Editor → New query → Run.
-- Safe to re-run: it only creates things if they don't already exist.

-- Table-level access for logged-in staff (RLS below still restricts to own
-- rows). Without this you get "permission denied for table ...".
grant usage on schema public to anon, authenticated;

-- ────────────────────────────────────────────────────────────────
-- students: one row per child, owned by the staff member who added them
-- ────────────────────────────────────────────────────────────────
create table if not exists public.students (
  id         uuid primary key default gen_random_uuid(),
  staff_id   uuid not null references auth.users (id) on delete cascade,
  initials   text not null,
  year_level text not null,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.students to authenticated;
alter table public.students enable row level security;

-- Staff can only see / add / edit / delete their OWN students.
drop policy if exists "Staff manage own students" on public.students;
create policy "Staff manage own students"
  on public.students for all
  using (auth.uid() = staff_id)
  with check (auth.uid() = staff_id);

-- ────────────────────────────────────────────────────────────────
-- screenings: one row per completed screening for a student
--   responses = { "<skill-id>": "green" | "yellow" | "red", ... }
--   results   = computed summary (top concern domains, counts, etc.)
-- ────────────────────────────────────────────────────────────────
create table if not exists public.screenings (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  staff_id   uuid not null references auth.users (id) on delete cascade,
  responses  jsonb not null default '{}'::jsonb,
  results    jsonb,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.screenings to authenticated;
alter table public.screenings enable row level security;

drop policy if exists "Staff manage own screenings" on public.screenings;
create policy "Staff manage own screenings"
  on public.screenings for all
  using (auth.uid() = staff_id)
  with check (auth.uid() = staff_id);
