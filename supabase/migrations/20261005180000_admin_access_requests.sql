-- Owner/Developer-controlled access requests. This migration is separate because
-- older Dream Avenue projects did not yet have the legacy admin_requests table.

begin;

create table if not exists public.admin_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text not null check (email = lower(trim(email))),
  phone text,
  message text,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists admin_requests_pending_email_idx
  on public.admin_requests (email) where status = 'Pending';

alter table public.admin_requests enable row level security;
revoke all on table public.admin_requests from anon;
grant insert on table public.admin_requests to anon, authenticated;
grant select, update, delete on table public.admin_requests to authenticated;

drop policy if exists "Anyone can request workspace access" on public.admin_requests;
drop policy if exists "Leadership can manage admin requests" on public.admin_requests;

create policy "Anyone can request workspace access"
  on public.admin_requests for insert to anon, authenticated
  with check (
    status = 'Pending'
    and char_length(trim(full_name)) between 2 and 120
    and email = lower(trim(email))
  );

create policy "Leadership can manage admin requests"
  on public.admin_requests for all to authenticated
  using (public.has_admin_permission(auth.uid(), 'access'))
  with check (public.has_admin_permission(auth.uid(), 'access'));

create or replace function public.approve_admin_request(request_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_email text;
begin
  if not public.has_admin_permission(auth.uid(), 'access') then
    raise exception 'Only the Owner or Developer can approve workspace access';
  end if;

  select email into request_email
  from public.admin_requests
  where id = request_id and status = 'Pending'
  for update;

  if request_email is null then
    raise exception 'This access request is no longer pending';
  end if;

  update public.profiles
  set role = 'coordinator'
  where lower(email) = request_email;

  if not found then
    raise exception 'The requested email must first create an account';
  end if;

  update public.admin_requests
  set status = 'Approved', updated_at = now()
  where id = request_id;
end;
$$;

revoke all on function public.approve_admin_request(uuid) from public, anon;
grant execute on function public.approve_admin_request(uuid) to authenticated;

-- Task assignment needs a very small, internal-only directory. Keeping it in
-- an RPC avoids widening the general profiles SELECT policy.
create or replace function public.list_workspace_team()
returns table (id uuid, email text, role text)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, p.email, p.role
  from public.profiles p
  where public.has_admin_access(auth.uid())
    and p.role in ('developer', 'owner', 'manager', 'coordinator')
  order by case p.role
    when 'owner' then 1
    when 'developer' then 2
    when 'manager' then 3
    else 4
  end, p.email;
$$;

revoke all on function public.list_workspace_team() from public, anon;
grant execute on function public.list_workspace_team() to authenticated;

drop trigger if exists admin_request_activity on public.admin_requests;
create trigger admin_request_activity
  after insert or update or delete on public.admin_requests
  for each row execute function public.log_admin_activity();

commit;
