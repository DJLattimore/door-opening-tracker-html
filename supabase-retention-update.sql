-- Run once in Supabase Dashboard > SQL Editor when upgrading from the
-- original seven-day retention rule.

create or replace function public.cleanup_door_tracker()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.app_state
  set data = jsonb_set(
    data,
    '{state,days}',
    coalesce(
      (
        select jsonb_object_agg(day_entry.key, day_entry.value)
        from jsonb_each(coalesce(data #> '{state,days}', '{}'::jsonb)) as day_entry
        where day_entry.key::date >= current_date - 13
           or day_entry.value ->> 'keep' = 'true'
      ),
      '{}'::jsonb
    ),
    true
  )
  where id = 'shared';
end;
$$;

revoke all on function public.cleanup_door_tracker() from public, anon, authenticated;

create extension if not exists pg_cron;

select cron.unschedule(jobid)
from cron.job
where jobname in ('door-tracker-seven-day-cleanup', 'door-tracker-fourteen-day-cleanup');

select cron.schedule(
  'door-tracker-fourteen-day-cleanup',
  '15 6 * * *',
  $$ select public.cleanup_door_tracker(); $$
);
