-- migrations/0020-bazi-academy-policies.sql (to move into inCommon's server/migrations)
--
-- WHY. Who may touch the Academy's two tables (0019). A reader reaches their
-- own rows and nobody else's; anon reaches nothing.
--
-- WHAT THIS DOES.
--   bazi_charts    read, add and delete the reader's own. Update is allowed
--                  on one column only, birth_sex, because that is the one
--                  thing the Desk lets a reader change after casting; the
--                  pillars are never rewritten in place.
--   bazi_progress  read, add, update (the upsert a second mark makes) and
--                  delete the reader's own.
-- user_id cannot be chosen: every check is user_id = auth.uid().
--
-- Then run server/mfa-policies.sql again with both tables in its list.
--
-- Run in the Supabase dashboard: SQL Editor, paste, Run. Safe to run again.
--
-- DOWN (run to undo; the tables stay, closed to everybody):
--   drop policy if exists bazi_charts_read on public.bazi_charts;
--   drop policy if exists bazi_charts_add on public.bazi_charts;
--   drop policy if exists bazi_charts_sex on public.bazi_charts;
--   drop policy if exists bazi_charts_delete on public.bazi_charts;
--   drop policy if exists bazi_progress_read on public.bazi_progress;
--   drop policy if exists bazi_progress_add on public.bazi_progress;
--   drop policy if exists bazi_progress_update on public.bazi_progress;
--   drop policy if exists bazi_progress_delete on public.bazi_progress;

revoke all on public.bazi_charts from anon;
revoke all on public.bazi_progress from anon;
revoke update on public.bazi_charts from authenticated;
grant select, insert, delete on public.bazi_charts to authenticated;
grant update (birth_sex) on public.bazi_charts to authenticated;
grant select, insert, update, delete on public.bazi_progress to authenticated;

drop policy if exists bazi_charts_read on public.bazi_charts;
create policy bazi_charts_read on public.bazi_charts
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists bazi_charts_add on public.bazi_charts;
create policy bazi_charts_add on public.bazi_charts
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists bazi_charts_sex on public.bazi_charts;
create policy bazi_charts_sex on public.bazi_charts
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists bazi_charts_delete on public.bazi_charts;
create policy bazi_charts_delete on public.bazi_charts
  for delete to authenticated using (user_id = (select auth.uid()));

drop policy if exists bazi_progress_read on public.bazi_progress;
create policy bazi_progress_read on public.bazi_progress
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists bazi_progress_add on public.bazi_progress;
create policy bazi_progress_add on public.bazi_progress
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists bazi_progress_update on public.bazi_progress;
create policy bazi_progress_update on public.bazi_progress
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists bazi_progress_delete on public.bazi_progress;
create policy bazi_progress_delete on public.bazi_progress
  for delete to authenticated using (user_id = (select auth.uid()));
