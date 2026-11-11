-- server/migrations/0022-bazi-shares-policies.sql
--
-- WHY. Who may touch a share (0021), and what a share opens.
--
-- WHAT THIS DOES.
--   bazi_shares    the student who made a row reads it, may change one
--                  column (with_progress) and may delete it. The teacher who
--                  took it up reads it and may delete it, which lets the
--                  chart go. Nobody else reaches it; anon reaches nothing.
--                  A teacher is named only by bazi_share_claim().
--   bazi_charts    one more read rule: a teacher reads a chart whose share
--                  they hold. They cannot change or delete it.
--   bazi_progress  one more read rule: a teacher reads a student's marks
--                  while that student has a share with with_progress on in
--                  the teacher's hands.
--
-- BEFORE THIS RUNS the Academy build that asks for its own rows by user_id
-- must be live. See 0021.
--
-- Then run server/mfa-policies.sql again with bazi_shares in its list.
--
-- Run in the Supabase dashboard: SQL Editor, paste, Run. Safe to run again.
--
-- DOWN (run to undo; the table stays, closed to everybody):
--   drop policy if exists bazi_progress_shared on public.bazi_progress;
--   drop policy if exists bazi_charts_shared on public.bazi_charts;
--   drop policy if exists bazi_shares_read on public.bazi_shares;
--   drop policy if exists bazi_shares_add on public.bazi_shares;
--   drop policy if exists bazi_shares_progress on public.bazi_shares;
--   drop policy if exists bazi_shares_delete on public.bazi_shares;

revoke all on public.bazi_shares from anon;
revoke all on public.bazi_shares from authenticated;
grant select, delete on public.bazi_shares to authenticated;
grant insert (chart_id, code, with_progress) on public.bazi_shares to authenticated;
grant update (with_progress) on public.bazi_shares to authenticated;

drop policy if exists bazi_shares_read on public.bazi_shares;
create policy bazi_shares_read on public.bazi_shares
  for select to authenticated
  using (owner_id = (select auth.uid()) or teacher_id = (select auth.uid()));

drop policy if exists bazi_shares_add on public.bazi_shares;
create policy bazi_shares_add on public.bazi_shares
  for insert to authenticated with check (owner_id = (select auth.uid()));

drop policy if exists bazi_shares_progress on public.bazi_shares;
create policy bazi_shares_progress on public.bazi_shares
  for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

drop policy if exists bazi_shares_delete on public.bazi_shares;
create policy bazi_shares_delete on public.bazi_shares
  for delete to authenticated
  using (owner_id = (select auth.uid()) or teacher_id = (select auth.uid()));

drop policy if exists bazi_charts_shared on public.bazi_charts;
create policy bazi_charts_shared on public.bazi_charts
  for select to authenticated
  using (exists (
    select 1 from public.bazi_shares s
    where s.chart_id = bazi_charts.id and s.teacher_id = (select auth.uid())
  ));

drop policy if exists bazi_progress_shared on public.bazi_progress;
create policy bazi_progress_shared on public.bazi_progress
  for select to authenticated
  using (exists (
    select 1 from public.bazi_shares s
    where s.owner_id = bazi_progress.user_id and s.teacher_id = (select auth.uid()) and s.with_progress
  ));
