-- Dream Avenue operational admin workspace: roles, tasks, audit history, partners, and referrals.
-- Profiles remain the authorization source of truth. app_metadata is intentionally not used by RLS.

do $$
begin
  if exists (select 1 from pg_constraint where conname = 'profiles_role_check') then
    alter table public.profiles drop constraint profiles_role_check;
  end if;
exception when undefined_table then null;
end $$;

alter table public.profiles
  alter column role set default 'coordinator';

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('developer', 'owner', 'manager', 'coordinator')) not valid;

-- Preserve all current admin accounts as managers before assigning the known leadership accounts.
update public.profiles
set role = 'manager'
where role = 'admin';

update public.profiles
set role = case lower(email)
  when 'nasoohkp23@gmail.com' then 'developer'
  when 'koyaferoke@gmail.com' then 'owner'
  when 'dream-avenue.krt@gmail.com' then 'manager'
  else role
end
where lower(email) in ('nasoohkp23@gmail.com', 'koyaferoke@gmail.com', 'dream-avenue.krt@gmail.com');

-- `profiles.role` is canonical. Legacy user_roles/admin rows are intentionally
-- left untouched so deployments with legacy role constraints migrate safely.

create or replace function public.admin_role(uid uuid)
returns text
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select role from public.profiles where id = uid
$$;

create or replace function public.has_admin_access(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select coalesce(public.admin_role(uid) in ('developer', 'owner', 'manager', 'coordinator'), false)
$$;

create or replace function public.has_admin_permission(uid uuid, permission text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select case public.admin_role(uid)
    when 'developer' then true
    when 'owner' then true
    when 'manager' then permission in ('operations', 'content', 'partners', 'referrals', 'tasks', 'analytics')
    when 'coordinator' then permission in ('operations', 'partners', 'referrals', 'tasks')
    else false
  end
$$;

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$ select public.has_admin_access(uid) $$;

grant execute on function public.admin_role(uuid), public.has_admin_access(uuid), public.has_admin_permission(uuid, text), public.is_admin(uuid) to authenticated;

create table if not exists public.admin_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 2 and 180),
  description text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed', 'cancelled')),
  assignee_id uuid references public.profiles(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  due_at timestamptz,
  created_by uuid not null references public.profiles(id),
  completed_by uuid references public.profiles(id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_activity (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  summary text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 160),
  categories text[] not null default '{}',
  tags text[] not null default '{}',
  service_area text,
  website text,
  social_url text,
  notes text,
  is_preferred boolean not null default false,
  is_active boolean not null default true,
  created_by uuid not null references public.profiles(id),
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partner_contacts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  name text not null,
  role_title text,
  phone text,
  email text,
  is_whatsapp boolean not null default false,
  is_primary boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partner_referrals (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete restrict,
  booking_id uuid references public.bookings(id) on delete set null,
  prospect_reference text,
  service_requested text not null,
  owner_id uuid references public.profiles(id) on delete set null,
  status text not null default 'introduced' check (status in ('introduced', 'in_discussion', 'converted', 'not_converted')),
  referral_value numeric(12,2),
  commission_value numeric(12,2),
  commission_status text not null default 'not_applicable' check (commission_status in ('not_applicable', 'expected', 'received', 'waived')),
  outcome_notes text,
  created_by uuid not null references public.profiles(id),
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_tasks_status_due_idx on public.admin_tasks(status, due_at);
create index if not exists admin_activity_created_at_idx on public.admin_activity(created_at desc);
create index if not exists partners_search_idx on public.partners using gin (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(service_area, '')));
create index if not exists partner_referrals_partner_status_idx on public.partner_referrals(partner_id, status);

alter table public.admin_tasks enable row level security;
alter table public.admin_activity enable row level security;
alter table public.partners enable row level security;
alter table public.partner_contacts enable row level security;
alter table public.partner_referrals enable row level security;

-- Admin workspace data must never be discoverable or reachable with the
-- project's anonymous key. Authenticated access is governed by RLS below.
revoke all on table public.admin_tasks, public.admin_activity, public.partners, public.partner_contacts, public.partner_referrals from anon;

create policy "Admin team can read tasks" on public.admin_tasks for select to authenticated using (public.has_admin_access(auth.uid()));
create policy "Admin team can manage tasks" on public.admin_tasks for all to authenticated using (public.has_admin_permission(auth.uid(), 'tasks')) with check (public.has_admin_permission(auth.uid(), 'tasks'));
create policy "Leadership can read audit history" on public.admin_activity for select to authenticated using (public.admin_role(auth.uid()) in ('developer', 'owner'));
-- No client write policy for admin_activity: it is populated only by the
-- security-definer trigger below and is therefore immutable from the UI.
create policy "Admin team can read partners" on public.partners for select to authenticated using (public.has_admin_access(auth.uid()));
create policy "Partner editors can manage partners" on public.partners for all to authenticated using (public.has_admin_permission(auth.uid(), 'partners')) with check (public.has_admin_permission(auth.uid(), 'partners'));
create policy "Admin team can read partner contacts" on public.partner_contacts for select to authenticated using (public.has_admin_access(auth.uid()));
create policy "Partner editors can manage partner contacts" on public.partner_contacts for all to authenticated using (public.has_admin_permission(auth.uid(), 'partners')) with check (public.has_admin_permission(auth.uid(), 'partners'));
create policy "Admin team can read referrals" on public.partner_referrals for select to authenticated using (public.has_admin_access(auth.uid()));
create policy "Referral editors can manage referrals" on public.partner_referrals for all to authenticated using (public.has_admin_permission(auth.uid(), 'referrals')) with check (public.has_admin_permission(auth.uid(), 'referrals'));

-- Rebase legacy gallery rules away from the retired `admin` role.
drop policy if exists "Admins can insert gallery items" on public.gallery;
drop policy if exists "Admins can update gallery items" on public.gallery;
drop policy if exists "Admins can delete gallery items" on public.gallery;
create policy "Content editors can insert gallery items" on public.gallery for insert to authenticated with check (public.has_admin_permission(auth.uid(), 'content'));
create policy "Content editors can update gallery items" on public.gallery for update to authenticated using (public.has_admin_permission(auth.uid(), 'content')) with check (public.has_admin_permission(auth.uid(), 'content'));
create policy "Leadership can delete gallery items" on public.gallery for delete to authenticated using (public.has_admin_permission(auth.uid(), 'destructive'));

-- Access requests are optional in older Dream Avenue deployments. Configure
-- them only when the legacy table exists.
do $$
begin
  if to_regclass('public.admin_requests') is not null then
    alter table public.admin_requests enable row level security;
    drop policy if exists "Admins can manage admin requests" on public.admin_requests;
    drop policy if exists "Allow admin manage admin requests" on public.admin_requests;
    drop policy if exists "Leadership can manage admin requests" on public.admin_requests;
    create policy "Leadership can manage admin requests" on public.admin_requests for all to authenticated using (public.has_admin_permission(auth.uid(), 'access')) with check (public.has_admin_permission(auth.uid(), 'access'));
  end if;
end $$;

create or replace function public.log_admin_activity()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  target_id uuid;
begin
  target_id := coalesce(new.id, old.id);
  insert into public.admin_activity (actor_id, action, resource_type, resource_id, summary, details)
  values (
    auth.uid(),
    lower(tg_op),
    tg_table_name,
    target_id,
    initcap(lower(tg_op)) || ' ' || replace(tg_table_name, '_', ' '),
    jsonb_build_object('before', case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end, 'after', case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end)
  );
  return coalesce(new, old);
end $$;

-- This trigger function must not be callable through the public RPC API.
-- Triggers continue to invoke it internally after these EXECUTE grants are removed.
revoke all on function public.log_admin_activity() from public, anon, authenticated;

drop trigger if exists admin_task_activity on public.admin_tasks;
create trigger admin_task_activity after insert or update or delete on public.admin_tasks for each row execute function public.log_admin_activity();
drop trigger if exists partner_activity on public.partners;
create trigger partner_activity after insert or update or delete on public.partners for each row execute function public.log_admin_activity();
drop trigger if exists partner_contact_activity on public.partner_contacts;
create trigger partner_contact_activity after insert or update or delete on public.partner_contacts for each row execute function public.log_admin_activity();
drop trigger if exists partner_referral_activity on public.partner_referrals;
create trigger partner_referral_activity after insert or update or delete on public.partner_referrals for each row execute function public.log_admin_activity();

-- Existing operational records gain the same immutable history. Availability
-- actions are represented by their booking/status records in the current schema.
do $$
begin
  if to_regclass('public.bookings') is not null then
    drop trigger if exists booking_activity on public.bookings;
    create trigger booking_activity after insert or update or delete on public.bookings for each row execute function public.log_admin_activity();
  end if;
  if to_regclass('public.gallery') is not null then
    drop trigger if exists gallery_activity on public.gallery;
    create trigger gallery_activity after insert or update or delete on public.gallery for each row execute function public.log_admin_activity();
  end if;
  if to_regclass('public.packages') is not null then
    drop trigger if exists package_activity on public.packages;
    create trigger package_activity after insert or update or delete on public.packages for each row execute function public.log_admin_activity();
  end if;
  if to_regclass('public.facilities') is not null then
    drop trigger if exists facility_activity on public.facilities;
    create trigger facility_activity after insert or update or delete on public.facilities for each row execute function public.log_admin_activity();
  end if;
  if to_regclass('public.admin_requests') is not null then
    drop trigger if exists admin_request_activity on public.admin_requests;
    create trigger admin_request_activity after insert or update or delete on public.admin_requests for each row execute function public.log_admin_activity();
  end if;
end $$;
