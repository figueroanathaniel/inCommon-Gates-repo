-- migrations/0019-bazi-academy.sql (to move into inCommon's server/migrations)
--
-- WHY. The owner chose on 9 November 2026 to port the BaZi Academy into
-- inCommon's own site at /bazi/, with no server of its own. A signed in
-- reader's charts and the scrolls they have marked as read are kept with
-- their inCommon account; a guest's stay on the device and never reach this.
--
-- WHAT THIS DOES. Two tables, both created with row level security ON and NO
-- policy, so nothing reaches them until 0020 is applied.
--   bazi_charts    a chart cast at the Desk: its name, the birth as the
--                  reader typed it (date, wall clock time, time zone, and sex
--                  if given), and the eight characters as numbers. At most
--                  six a reader, held by a trigger.
--   bazi_progress  one row per scroll a reader has marked as read.
--
-- WHAT IS NOT HERE. The Destiny Chart (the house's own chart) is a constant
-- in the build and is never stored. No place name is stored, only the zone.
--
-- DELETING IS DELETING. user_id cascades from auth.users, so deleting an
-- account (server/account removes the auth user last) removes both.
--
-- After applying, add bazi_charts and bazi_progress to the list in
-- server/mfa-policies.sql and run that file again, or two-step sign in does
-- not cover them.
--
-- Run in the Supabase dashboard: SQL Editor, paste, Run. Safe to run again.
--
-- DOWN (run to undo; this deletes every Academy chart and mark):
--   drop trigger if exists bazi_charts_cap on public.bazi_charts;
--   drop function if exists public.bazi_charts_cap();
--   drop table if exists public.bazi_progress;
--   drop table if exists public.bazi_charts;

create table if not exists public.bazi_charts (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  label text not null check (length(label) between 1 and 120),
  birth_year smallint not null check (birth_year between 1800 and 2200),
  birth_month smallint not null check (birth_month between 1 and 12),
  birth_day smallint not null check (birth_day between 1 and 31),
  birth_hour smallint not null check (birth_hour between 0 and 23),
  birth_minute smallint not null check (birth_minute between 0 and 59),
  birth_zone text not null check (length(birth_zone) between 1 and 64),
  birth_sex text check (birth_sex in ('m', 'f')),
  year_stem smallint not null check (year_stem between 0 and 9),
  year_branch smallint not null check (year_branch between 0 and 11),
  month_stem smallint not null check (month_stem between 0 and 9),
  month_branch smallint not null check (month_branch between 0 and 11),
  day_stem smallint not null check (day_stem between 0 and 9),
  day_branch smallint not null check (day_branch between 0 and 11),
  hour_stem smallint not null check (hour_stem between 0 and 9),
  hour_branch smallint not null check (hour_branch between 0 and 11),
  created_at timestamptz not null default now()
);

alter table public.bazi_charts enable row level security;

create index if not exists bazi_charts_user on public.bazi_charts (user_id);

create table if not exists public.bazi_progress (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  lesson_id text not null check (length(lesson_id) between 1 and 32 and lesson_id !~ '[^a-z0-9]'),
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

alter table public.bazi_progress enable row level security;

-- Six charts a reader, the same cap the Desk shows. Counted under a lock on
-- the reader's own rows so two tabs cannot both add a seventh.
create or replace function public.bazi_charts_cap()
returns trigger
language plpgsql security definer set search_path = ''
as $bz$
begin
  -- A row for another reader is refused here, before it is counted, so the
  -- cap never tells one reader how many charts another holds.
  if auth.uid() is not null and new.user_id is distinct from auth.uid() then
    raise exception 'bazi_charts_owner';
  end if;
  perform 1 from public.bazi_charts where user_id = new.user_id for update;
  if (select count(*) from public.bazi_charts where user_id = new.user_id) >= 6 then
    raise exception 'bazi_charts_full';
  end if;
  return new;
end;
$bz$;

revoke all on function public.bazi_charts_cap() from public;

drop trigger if exists bazi_charts_cap on public.bazi_charts;
create trigger bazi_charts_cap before insert on public.bazi_charts
  for each row execute function public.bazi_charts_cap();

-- To check it took: both tables exist with row level security on and no
-- policy yet.
--   select relname, relrowsecurity from pg_class where relname like 'bazi_%';
--   select count(*) from pg_policies where tablename like 'bazi_%';
