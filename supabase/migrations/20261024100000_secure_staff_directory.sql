-- Private staff directory. Profiles.role remains authorization source of truth.
begin;

create table if not exists public.staff_directory (
  id uuid primary key references public.profiles(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  work_started_on date,
  portrait_path text,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.staff_directory enable row level security;
revoke all on table public.staff_directory from anon, authenticated;

-- The Edge Function uses service role after checking the caller's database role.
-- No direct browser reads or writes are granted for these identifying records.

insert into storage.buckets (id, name, public)
values ('staff-portraits', 'staff-portraits', false)
on conflict (id) do update set public = false;

drop policy if exists "Leadership manages private staff portraits" on storage.objects;
create policy "Leadership manages private staff portraits"
on storage.objects for all to authenticated
using (bucket_id = 'staff-portraits' and public.admin_role(auth.uid()) in ('developer', 'owner'))
with check (bucket_id = 'staff-portraits' and public.admin_role(auth.uid()) in ('developer', 'owner'));

drop trigger if exists staff_directory_activity on public.staff_directory;
create trigger staff_directory_activity after insert or update or delete on public.staff_directory
for each row execute function public.log_admin_activity();

commit;
