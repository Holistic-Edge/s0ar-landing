create or replace function public.grant_admin_on_create()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email_confirmed_at is not null then
    insert into public.user_roles(user_id, role) values (new.id, 'admin') on conflict do nothing;
    update public.admin_access_requests set status = 'approved', decided_at = now() where user_id = new.id and status = 'pending';
  end if;
  return new;
end $$;

insert into public.user_roles(user_id, role)
select u.id, 'admin'::public.app_role from auth.users u
where u.email_confirmed_at is not null
  and not exists (select 1 from public.user_roles r where r.user_id = u.id and r.role = 'admin');

update public.admin_access_requests a set status = 'approved', decided_at = now()
from auth.users u where u.id = a.user_id and u.email_confirmed_at is not null and a.status = 'pending';