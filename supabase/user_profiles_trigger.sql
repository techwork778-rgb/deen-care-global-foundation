-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- AFTER you have applied the Drizzle schema (which creates public.users).
--
-- This trigger mirrors new Supabase Auth users into the public.users table so
-- the admin dashboard can join request rows to a profile (name, email, avatar)
-- without needing the service-role key.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        avatar_url = excluded.avatar_url;
  return new;
end;
$$;

-- Replace any existing trigger of the same name, so this is safe to re-run.
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
