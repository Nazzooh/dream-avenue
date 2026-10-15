-- Dream Avenue admin security hardening.
-- Run after 20261005143000_admin_workspace_roles_partners.sql.

begin;

-- Replace the publicly writable system-health endpoint with a developer-only
-- diagnostic tool. This retains the admin KeepAlive widget without allowing
-- anonymous or ordinary signed-in users to write arbitrary rows.
alter table public.system_health enable row level security;
drop policy if exists "Enable insert for everyone" on public.system_health;
drop policy if exists "Developers can read system health" on public.system_health;
drop policy if exists "Developers can insert system health" on public.system_health;
create policy "Developers can read system health"
  on public.system_health for select to authenticated
  using (public.admin_role(auth.uid()) = 'developer');
create policy "Developers can insert system health"
  on public.system_health for insert to authenticated
  with check (public.admin_role(auth.uid()) = 'developer');

-- The admin workspace is exclusively for signed-in staff. RLS already
-- controls staff access; revoking anon privileges also removes public GraphQL
-- schema discovery for these operational tables.
revoke all on table public.admin_tasks, public.admin_activity, public.partners, public.partner_contacts, public.partner_referrals from anon;

-- The immutable audit trigger runs internally and must not be exposed as RPC.
revoke all on function public.log_admin_activity() from public, anon, authenticated;

commit;
