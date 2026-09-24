-- Gallery is public to read, but only users whose profile is an admin may
-- create, edit, or delete gallery records.
alter table public.gallery enable row level security;

grant select on table public.gallery to anon, authenticated;
grant insert, update, delete on table public.gallery to authenticated;
grant select on table public.profiles to authenticated;

-- The app uses profiles.role as its sole non-service admin authority.
-- PostgreSQL combines permissive policies with OR, so remove the older policy
-- that also allowed ordinary admins through a different authorization model.
drop policy if exists "Admin can manage gallery secure" on public.gallery;

drop policy if exists "Gallery is publicly readable" on public.gallery;
create policy "Gallery is publicly readable"
  on public.gallery
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert gallery items" on public.gallery;
create policy "Admins can insert gallery items"
  on public.gallery
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can update gallery items" on public.gallery;
create policy "Admins can update gallery items"
  on public.gallery
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can delete gallery items" on public.gallery;
create policy "Admins can delete gallery items"
  on public.gallery
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );
