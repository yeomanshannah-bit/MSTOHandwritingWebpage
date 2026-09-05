-- Making Sense Together — database schema
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
  term       text,
  class_name text,
  created_at timestamptz not null default now()
);

-- Added after the first release, so existing databases need these too.
-- `term` is which term of the year the profile was started in; `class_name`
-- is optional free text (e.g. "3B", "Room 12") for staff who juggle several
-- classes. Both are nullable so rows created before this change stay valid.
alter table public.students add column if not exists term text;
alter table public.students add column if not exists class_name text;

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
  shapes     jsonb not null default '{}'::jsonb,
  reflection jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Added with the iceberg screener rework.
--   shapes     = the pre-writing shape check, e.g. { "circle": "with-demo" }.
--                Kept apart from `responses` because it uses its own scale.
--   reflection = the teacher's own read: { recommendations, strengths,
--                comments }.
alter table public.screenings
  add column if not exists shapes jsonb not null default '{}'::jsonb;
alter table public.screenings
  add column if not exists reflection jsonb not null default '{}'::jsonb;

-- Added with the Year 2 form. `form_id` records WHICH screener form produced
-- these answers ('year-1' or 'year-2'), because the two forms ask different
-- statements under different item ids — without it, a saved screening cannot
-- be scored correctly later. Every screening that existed before this column
-- was the Year 1 form, which is what the default backfills them to.
alter table public.screenings
  add column if not exists form_id text not null default 'year-1';

grant select, insert, update, delete on public.screenings to authenticated;
alter table public.screenings enable row level security;

drop policy if exists "Staff manage own screenings" on public.screenings;
create policy "Staff manage own screenings"
  on public.screenings for all
  using (auth.uid() = staff_id)
  with check (auth.uid() = staff_id);

-- ────────────────────────────────────────────────────────────────
-- programs: one 20-week program for a student, built from a screening
--   domain_ids      = the chosen foundations, worst-first. This IS the
--                     tailoring — the session wording itself lives in
--                     src/lib/programContent.ts, not in the database.
--   content_version = which version of that content the program started on,
--                     so revising a session doesn't change programs already
--                     under way.
-- ────────────────────────────────────────────────────────────────
create table if not exists public.programs (
  id              uuid primary key default gen_random_uuid(),
  student_id      uuid not null references public.students (id) on delete cascade,
  staff_id        uuid not null references auth.users (id) on delete cascade,
  screening_id    uuid references public.screenings (id) on delete set null,
  domain_ids      text[] not null,
  content_version integer not null default 1,
  started_on      date not null default current_date,
  status          text not null default 'active',
  created_at      timestamptz not null default now()
);

create index if not exists programs_student_idx on public.programs (student_id);

grant select, insert, update, delete on public.programs to authenticated;
alter table public.programs enable row level security;

drop policy if exists "Staff manage own programs" on public.programs;
create policy "Staff manage own programs"
  on public.programs for all
  using (auth.uid() = staff_id)
  with check (auth.uid() = staff_id);

-- ────────────────────────────────────────────────────────────────
-- program_sessions: one row per COMPLETED week. A week with no row here
-- hasn't been done yet. Weeks unlock in order, so these are contiguous
-- from week 1.
-- ────────────────────────────────────────────────────────────────
create table if not exists public.program_sessions (
  id           uuid primary key default gen_random_uuid(),
  program_id   uuid not null references public.programs (id) on delete cascade,
  staff_id     uuid not null references auth.users (id) on delete cascade,
  week         integer not null check (week between 1 and 20),
  observation  text,
  completed_at timestamptz not null default now(),
  unique (program_id, week)
);

-- The program grew from ten weeks to twenty in Aug 2026. `create table if not
-- exists` above leaves an existing table's CHECK alone, so the old
-- "between 1 and 10" rule has to be replaced explicitly or weeks 11-20 are
-- rejected on save.
alter table public.program_sessions
  drop constraint if exists program_sessions_week_check;
alter table public.program_sessions
  add constraint program_sessions_week_check check (week between 1 and 20);

create index if not exists program_sessions_program_idx
  on public.program_sessions (program_id);

grant select, insert, update, delete on public.program_sessions to authenticated;
alter table public.program_sessions enable row level security;

drop policy if exists "Staff manage own program sessions" on public.program_sessions;
create policy "Staff manage own program sessions"
  on public.program_sessions for all
  using (auth.uid() = staff_id)
  with check (auth.uid() = staff_id);

-- ────────────────────────────────────────────────────────────────
-- Baseline photos
--
-- The image itself goes in Supabase Storage (a private bucket); this table
-- records which student it belongs to and where the file lives. Kept as a
-- table rather than a column on students so a student can have several over
-- time — a baseline now, progress photos later.
-- ────────────────────────────────────────────────────────────────
create table if not exists public.baseline_photos (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references public.students (id) on delete cascade,
  staff_id     uuid not null references auth.users (id) on delete cascade,
  storage_path text not null,
  created_at   timestamptz not null default now()
);

create index if not exists baseline_photos_student_idx
  on public.baseline_photos (student_id);

grant select, insert, update, delete on public.baseline_photos to authenticated;
alter table public.baseline_photos enable row level security;

drop policy if exists "Staff manage own baseline photos" on public.baseline_photos;
create policy "Staff manage own baseline photos"
  on public.baseline_photos for all
  using (auth.uid() = staff_id)
  with check (auth.uid() = staff_id);

-- A PRIVATE bucket: student handwriting is identifiable work, so files are
-- never served by public URL. Pages fetch short-lived signed links instead.
insert into storage.buckets (id, name, public)
values ('baselines', 'baselines', false)
on conflict (id) do nothing;

-- Files are stored under "<staff-user-id>/<student-id>/<file>", so the first
-- folder in the path is the owner. Staff can only touch their own folder.
drop policy if exists "Staff manage own baseline files" on storage.objects;
create policy "Staff manage own baseline files"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'baselines'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'baselines'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ────────────────────────────────────────────────────────────────
-- teacher_feedback: the two-minute questionnaire from the screener beta.
--
-- One row per staff member, not one per screening — it asks about the tool
-- overall, so a teacher fills it in once however many children they screened.
-- That is what the unique constraint on staff_id enforces, and it is what
-- lets the form save over itself as they type.
--
-- Every answer is nullable and the row is created on the first keystroke, so
-- an abandoned half-filled form still leaves its answers behind. `submitted_at`
-- is what separates a draft from a finished response: null means they stopped
-- partway. Read both — a partly-filled form is still feedback.
--
-- Answers live in their own columns rather than one jsonb blob so the rows
-- are readable straight from the Supabase Table Editor without unpacking.
-- ────────────────────────────────────────────────────────────────
create table if not exists public.teacher_feedback (
  id                 uuid primary key default gen_random_uuid(),
  staff_id           uuid not null unique references auth.users (id) on delete cascade,

  -- Context for the answers below.
  year_levels        text,
  children_screened  text,

  -- Q1-Q6. Stored as the literal option text ('Yes', 'Mostly', 'No', …) so a
  -- row means something on its own, without a lookup table to decode it.
  clear_and_easy     text,  -- Was the screener clear and easy to complete?
  time_per_child     text,  -- How long did it take for each child?
  reflected_class    text,  -- Did the questions reflect what you see in class?
  ratings_clear      text,  -- Were the Green/Amber/Red ratings easy to follow?
  helped_next_steps  text,  -- Did the results help you know what's needed next?
  would_use_again    text,  -- Would you use this screener again?

  most_useful        text,  -- Free text: "The most useful part was:"

  submitted_at       timestamptz,          -- null while still a draft
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

grant select, insert, update, delete on public.teacher_feedback to authenticated;
alter table public.teacher_feedback enable row level security;

-- Teachers see and edit only their own response. (The project owner reads all
-- of them from the Supabase dashboard, which runs as the service role and so
-- is not subject to this policy.)
drop policy if exists "Staff manage own feedback" on public.teacher_feedback;
create policy "Staff manage own feedback"
  on public.teacher_feedback for all
  using (auth.uid() = staff_id)
  with check (auth.uid() = staff_id);
