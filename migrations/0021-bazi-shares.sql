-- server/migrations/0021-bazi-shares.sql
--
-- WHY. The owner asked on 11 November 2026 for two things at the BaZi
-- Academy: a Desk that holds more than six charts, so a teacher is not held
-- to five students, and a way for a student to share a chart, from their own
-- account, with a teacher's account.
--
-- WHAT THIS DOES.
--   bazi_charts_cap()  the Desk's limit goes from six charts to twenty four.
--   bazi_shares        one row per chart a student has offered to a teacher.
--                      The student makes the row with a code they hand to
--                      the teacher themselves. Until it is taken up the row
--                      holds the code and no teacher; once taken up it holds
--                      the teacher and no code. with_progress says whether
--                      the teacher may also see which scrolls the student
--                      has marked as read. Created with row level security
--                      ON and NO policy, so nothing reaches it until 0022.
--   bazi_share_claim() the one way a teacher takes a code up. It names the
--                      caller as the teacher and burns the code. It refuses
--                      a signed out caller, a password alone on an account
--                      with an authenticator, a code that is wrong, spent or
--                      older than seven days, and a student's own code.
--
-- WHAT IS NOT HERE. No name, address or number of either person is stored
-- or shown to the other. Nobody is looked up by email. A teacher's notes and
-- the scrolls they mark as taught stay on the teacher's device.
--
-- DELETING IS DELETING. A share goes when the student removes it, when the
-- teacher lets it go, when the chart is burned, and when either account is
-- deleted (both keys cascade).
--
-- ORDER. 0019 and 0020 first. Then this, then 0022, then run
-- server/mfa-policies.sql again (bazi_shares is in its list). The Academy
-- build that reads its own rows by user_id must be live BEFORE 0022: an
-- older build asks for every chart it may see and would show a shared chart
-- as the teacher's own.
--
-- Run in the Supabase dashboard: SQL Editor, paste, Run. Safe to run again.
--
-- DOWN (run to undo; ends every share and puts the Desk back to six):
--   drop function if exists public.bazi_share_claim(text);
--   drop trigger if exists bazi_shares_guard on public.bazi_shares;
--   drop function if exists public.bazi_shares_guard();
--   drop table if exists public.bazi_shares;
--   create or replace function public.bazi_charts_cap()
--   returns trigger language plpgsql security definer set search_path = ''
--   as $bz$
--   begin
--   if auth.uid() is not null and new.user_id is distinct from auth.uid() then
--   raise exception 'bazi_charts_owner';
--   end if;
--   perform 1 from public.bazi_charts where user_id = new.user_id for update;
--   if (select count(*) from public.bazi_charts where user_id = new.user_id) >= 6 then
--   raise exception 'bazi_charts_full';
--   end if;
--   return new;
--   end;
--   $bz$;

-- Twenty four charts a reader. Everything else is 0019's function unchanged.
create or replace function public.bazi_charts_cap()
returns trigger
language plpgsql security definer set search_path = ''
as $bz$
begin
  if auth.uid() is not null and new.user_id is distinct from auth.uid() then
    raise exception 'bazi_charts_owner';
  end if;
  perform 1 from public.bazi_charts where user_id = new.user_id for update;
  if (select count(*) from public.bazi_charts where user_id = new.user_id) >= 24 then
    raise exception 'bazi_charts_full';
  end if;
  return new;
end;
$bz$;

revoke all on function public.bazi_charts_cap() from public;

create table if not exists public.bazi_shares (
  id bigint generated always as identity primary key,
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  chart_id bigint not null references public.bazi_charts(id) on delete cascade,
  code text unique check (code is null or (length(code) = 10 and code !~ '[^A-HJ-NP-Z2-9]')),
  teacher_id uuid references auth.users(id) on delete cascade,
  with_progress boolean not null default false,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  claimed_at timestamptz,
  -- Offered: a code and no teacher. Taken up: a teacher and no code.
  check ((teacher_id is null) <> (code is null)),
  check (teacher_id is null or teacher_id <> owner_id)
);

alter table public.bazi_shares enable row level security;

create index if not exists bazi_shares_owner on public.bazi_shares (owner_id);
create index if not exists bazi_shares_chart on public.bazi_shares (chart_id);
create unique index if not exists bazi_shares_once on public.bazi_shares (chart_id, teacher_id) where teacher_id is not null;

-- What a student may put in a new row. The chart has to be their own, the
-- row starts offered and never taken up, the seven days are the server's,
-- and a chart carries at most three shares and a reader at most sixty.
create or replace function public.bazi_shares_guard()
returns trigger
language plpgsql security definer set search_path = ''
as $bz$
begin
  if auth.uid() is not null and new.owner_id is distinct from auth.uid() then
    raise exception 'bazi_shares_owner';
  end if;
  if not exists (select 1 from public.bazi_charts c where c.id = new.chart_id and c.user_id = new.owner_id) then
    raise exception 'bazi_shares_chart';
  end if;
  if new.code is null then
    raise exception 'bazi_shares_code';
  end if;
  new.teacher_id := null;
  new.claimed_at := null;
  new.created_at := now();
  new.expires_at := now() + interval '7 days';
  perform 1 from public.bazi_shares where owner_id = new.owner_id for update;
  if (select count(*) from public.bazi_shares where chart_id = new.chart_id) >= 3 then
    raise exception 'bazi_shares_full';
  end if;
  if (select count(*) from public.bazi_shares where owner_id = new.owner_id) >= 60 then
    raise exception 'bazi_shares_full';
  end if;
  return new;
end;
$bz$;

revoke all on function public.bazi_shares_guard() from public;

drop trigger if exists bazi_shares_guard on public.bazi_shares;
create trigger bazi_shares_guard before insert on public.bazi_shares
  for each row execute function public.bazi_shares_guard();

-- A teacher takes a code up. It runs as its owner because the caller cannot
-- see an offered row, so it asks the two-step question itself: the same test
-- server/mfa-policies.sql puts on every table.
create or replace function public.bazi_share_claim(p_code text)
returns bigint
language plpgsql security definer set search_path = ''
as $bz$
declare
  v_me uuid := auth.uid();
  v_row public.bazi_shares%rowtype;
begin
  if v_me is null then
    raise exception 'bazi_share_signin';
  end if;
  if exists (select 1 from auth.mfa_factors where user_id = v_me and status = 'verified')
     and coalesce(auth.jwt() ->> 'aal', '') <> 'aal2' then
    raise exception 'bazi_share_signin';
  end if;
  select * into v_row from public.bazi_shares
    where code = upper(btrim(coalesce(p_code, ''))) and teacher_id is null
    for update;
  if not found or v_row.expires_at <= now() or v_row.owner_id = v_me then
    raise exception 'bazi_share_none';
  end if;
  if (select count(*) from public.bazi_shares where teacher_id = v_me) >= 200 then
    raise exception 'bazi_share_full';
  end if;
  if exists (select 1 from public.bazi_shares where chart_id = v_row.chart_id and teacher_id = v_me) then
    -- Already held: the spare offer is spent and nothing else changes.
    delete from public.bazi_shares where id = v_row.id;
    return v_row.chart_id;
  end if;
  update public.bazi_shares
    set teacher_id = v_me, code = null, claimed_at = now()
    where id = v_row.id;
  return v_row.chart_id;
end;
$bz$;

revoke all on function public.bazi_share_claim(text) from public;
revoke all on function public.bazi_share_claim(text) from anon;
grant execute on function public.bazi_share_claim(text) to authenticated;

-- To check it took: the table exists with row level security on and no
-- policy yet, and the Desk's limit reads 24.
--   select relname, relrowsecurity from pg_class where relname = 'bazi_shares';
--   select count(*) from pg_policies where tablename = 'bazi_shares';
--   select prosrc like '%>= 24%' from pg_proc where proname = 'bazi_charts_cap';
