-- Door Operations Tracker: one-time Supabase setup
-- Run this entire file in Supabase Dashboard > SQL Editor.

create table if not exists public.app_state (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.authorized_users (
  email text primary key,
  created_at timestamptz not null default now(),
  constraint authorized_users_email_lowercase check (email = lower(email))
);

revoke all on table public.authorized_users from anon, authenticated;

create or replace function public.is_tracker_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.authorized_users
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_tracker_user() from public, anon;
grant execute on function public.is_tracker_user() to authenticated;

alter table public.app_state enable row level security;
alter table public.app_state force row level security;

revoke all on table public.app_state from anon;
grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.app_state to authenticated;

drop policy if exists "Authenticated users can read tracker data" on public.app_state;
drop policy if exists "Authenticated users can insert tracker data" on public.app_state;
drop policy if exists "Authenticated users can update tracker data" on public.app_state;
drop policy if exists "Authenticated users can delete tracker data" on public.app_state;

create policy "Authenticated users can read tracker data"
on public.app_state for select to authenticated using (public.is_tracker_user());

create policy "Authenticated users can insert tracker data"
on public.app_state for insert to authenticated with check (public.is_tracker_user());

create policy "Authenticated users can update tracker data"
on public.app_state for update to authenticated using (public.is_tracker_user()) with check (public.is_tracker_user());

create policy "Authenticated users can delete tracker data"
on public.app_state for delete to authenticated using (public.is_tracker_user());

create or replace function public.set_tracker_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tracker_updated_at on public.app_state;
create trigger set_tracker_updated_at
before insert or update on public.app_state
for each row execute function public.set_tracker_updated_at();

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
        where day_entry.key::date >= current_date - 6
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

select cron.schedule(
  'door-tracker-seven-day-cleanup',
  '15 6 * * *',
  $$ select public.cleanup_door_tracker(); $$
);

