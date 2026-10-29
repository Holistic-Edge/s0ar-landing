create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "user_roles_read_own" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Public sign-up is disabled: accounts are only created by the owner via Users → Add user,
-- so every created account is a hub admin.
create or replace function public.grant_admin_on_create()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_roles(user_id, role) values (new.id, 'admin') on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created_grant_admin after insert on auth.users
  for each row execute function public.grant_admin_on_create();

create table public.preregistrations (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  schema_version text not null,
  submitted_at timestamptz not null,
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  nationality text not null,
  residence text not null default '',
  dial_code text not null,
  phone text not null,
  email text not null,
  channel text not null,
  instagram text not null default '',
  moment text not null,
  music text[] not null,
  move text not null,
  party text not null,
  occasion text not null default '',
  occasion_date date,
  consent_adult boolean not null,
  consent_policy boolean not null,
  consent_privacy boolean not null,
  consent_marketing boolean not null,
  policy_version text not null,
  privacy_version text not null,
  utm_source text not null default '',
  utm_medium text not null default '',
  utm_campaign text not null default '',
  referrer text not null default '',
  landing_path text not null default '',
  status text not null default 'new' check (status in ('new','confirmed','waitlist')),
  notes text not null default ''
);
create index preregistrations_created_idx on public.preregistrations (created_at desc);
create index preregistrations_status_idx on public.preregistrations (status);

grant insert on public.preregistrations to anon, authenticated;
grant select, update, delete on public.preregistrations to authenticated;
grant all on public.preregistrations to service_role;
alter table public.preregistrations enable row level security;

create policy "preregistrations_public_insert" on public.preregistrations for insert to anon, authenticated
  with check (status = 'new' and notes = '' and consent_adult and consent_policy and consent_privacy);
create policy "preregistrations_admin_select" on public.preregistrations for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "preregistrations_admin_update" on public.preregistrations for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "preregistrations_admin_delete" on public.preregistrations for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));