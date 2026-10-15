-- Ensure Owner, Developer, and Manager accounts can insert, edit, and delete gallery items and details.
begin;

drop policy if exists "Leadership can delete gallery items" on public.gallery;
drop policy if exists "Gallery editors can delete gallery items" on public.gallery;
drop policy if exists "Admin team can delete gallery items" on public.gallery;

create policy "Admin team can delete gallery items"
  on public.gallery
  for delete
  to authenticated
  using (
    public.admin_role(auth.uid()) in ('developer', 'owner', 'manager')
    or public.has_admin_permission(auth.uid(), 'content')
    or public.has_admin_permission(auth.uid(), 'destructive')
  );

drop policy if exists "Content editors can update gallery items" on public.gallery;
drop policy if exists "Admin team can update gallery items" on public.gallery;

create policy "Admin team can update gallery items"
  on public.gallery
  for update
  to authenticated
  using (
    public.admin_role(auth.uid()) in ('developer', 'owner', 'manager')
    or public.has_admin_permission(auth.uid(), 'content')
  )
  with check (
    public.admin_role(auth.uid()) in ('developer', 'owner', 'manager')
    or public.has_admin_permission(auth.uid(), 'content')
  );

drop policy if exists "Content editors can insert gallery items" on public.gallery;
drop policy if exists "Admin team can insert gallery items" on public.gallery;

create policy "Admin team can insert gallery items"
  on public.gallery
  for insert
  to authenticated
  with check (
    public.admin_role(auth.uid()) in ('developer', 'owner', 'manager')
    or public.has_admin_permission(auth.uid(), 'content')
  );

commit;
