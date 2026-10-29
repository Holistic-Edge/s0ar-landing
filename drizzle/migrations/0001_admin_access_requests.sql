create table public.admin_access_requests (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  status text not null default 'pending' check (status in ('pending','approved','denied')),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid
);
grant select on public.admin_access_requests to authenticated;
grant all on public.admin_access_requests to service_role;
alter table public.admin_access_requests enable row level security;
create policy admin_access_requests_admin_select on public.admin_access_requests
  for select to authenticated using (public.has_role(auth.uid(), 'admin') or user_id = auth.uid());

-- Owner-created accounts (confirmed at creation) become admin immediately.
-- Self sign-ups: @soaroceanclub.com becomes admin once the email is verified; anyone else waits for approval.
create or replace function public.grant_admin_on_create()
returns trigger language plpgsql security definer set search_path = public as $$
declare dom text := lower(split_part(new.email, '@', 2));
begin
  if new.email_confirmed_at is not null and (tg_op = 'INSERT' or dom = 'soaroceanclub.com') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin') on conflict do nothing;
    update public.admin_access_requests set status = 'approved', decided_at = now() where user_id = new.id and status = 'pending';
  elsif tg_op = 'INSERT' and dom <> 'soaroceanclub.com' then
    insert into public.admin_access_requests(user_id, email) values (new.id, coalesce(new.email, '')) on conflict do nothing;
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_confirmed_grant_admin on auth.users;
create trigger on_auth_user_confirmed_grant_admin
after update of email_confirmed_at on auth.users
for each row when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
execute function public.grant_admin_on_create();

create or replace function public.decide_access_request(_user_id uuid, _approve boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'not authorized'; end if;
  update public.admin_access_requests set status = case when _approve then 'approved' else 'denied' end,
    decided_at = now(), decided_by = auth.uid() where user_id = _user_id;
  if _approve then
    insert into public.user_roles(user_id, role) values (_user_id, 'admin') on conflict do nothing;
  else
    delete from public.user_roles where user_id = _user_id and role = 'admin';
  end if;
end $$;
revoke execute on function public.decide_access_request(uuid, boolean) from public, anon;
grant execute on function public.decide_access_request(uuid, boolean) to authenticated;