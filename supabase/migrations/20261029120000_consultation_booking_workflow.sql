-- Consultation-led booking workflow. Profiles.role remains the authority for staff access.
begin;

alter table public.bookings
  add column if not exists appointment_at timestamptz,
  add column if not exists consultation_notes text,
  add column if not exists quoted_total numeric(12,2),
  add column if not exists final_price_locked_at timestamptz,
  add column if not exists lifecycle_reason text,
  add column if not exists contact_outcome text;

do $$
declare status_constraint text;
begin
  select conname into status_constraint
  from pg_constraint
  where conrelid = 'public.bookings'::regclass
    and contype = 'c'
    -- Target only the legacy booking status check. Do not drop unrelated checks
    -- merely because their definition mentions a status-like column.
    and pg_get_constraintdef(oid) ~ '^CHECK \(\(status (IN|= ANY)'
  limit 1;
  if status_constraint is not null then
    execute format('alter table public.bookings drop constraint %I', status_constraint);
  end if;
end $$;

alter table public.bookings
  add constraint bookings_status_check
  check (status in ('pending', 'appointment_scheduled', 'quotation_in_progress', 'confirmed', 'completed', 'declined', 'cancelled')) not valid;

create table if not exists public.booking_workflow_history (
  id bigint generated always as identity primary key,
  booking_id uuid not null references public.bookings(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  from_status text,
  to_status text,
  note text,
  changes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.booking_partner_refs (
  booking_id uuid not null references public.bookings(id) on delete cascade,
  partner_id uuid not null references public.partners(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (booking_id, partner_id)
);

create index if not exists bookings_workflow_status_idx on public.bookings(status, booking_date desc);
create index if not exists booking_workflow_history_booking_idx on public.booking_workflow_history(booking_id, created_at desc);

alter table public.booking_workflow_history enable row level security;
alter table public.booking_partner_refs enable row level security;
alter table public.bookings enable row level security;
revoke all on public.booking_workflow_history, public.booking_partner_refs from public, anon;
revoke all on public.bookings from anon;
grant select on public.booking_workflow_history, public.booking_partner_refs to authenticated;
grant select on public.bookings to authenticated;

drop policy if exists "Operations team can read bookings" on public.bookings;
create policy "Operations team can read bookings" on public.bookings
  for select to authenticated using (public.has_admin_permission(auth.uid(), 'operations'));
drop policy if exists "Operations team can update bookings" on public.bookings;
create policy "Operations team can update bookings" on public.bookings
  for update to authenticated using (public.has_admin_permission(auth.uid(), 'operations')) with check (public.has_admin_permission(auth.uid(), 'operations'));

-- Public requests go through a narrow RPC, rather than a table INSERT policy.
-- This prevents callers from supplying admin pricing, workflow, ownership, or
-- audit fields even if the client is modified.
drop policy if exists "Public can create pending booking requests" on public.bookings;

create or replace function public.submit_booking_request(
  p_full_name text,
  p_mobile text,
  p_booking_date date,
  p_start_time time,
  p_end_time time,
  p_guest_count integer default 0,
  p_package_id uuid default null,
  p_special_requests text default null,
  p_email text default null,
  p_additional_notes text default null
) returns uuid
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare booking_id uuid;
begin
  if nullif(trim(p_full_name), '') is null or length(trim(p_full_name)) > 100 then
    raise exception 'A valid name is required';
  end if;
  if nullif(trim(p_mobile), '') is null or length(trim(p_mobile)) > 20 then
    raise exception 'A valid mobile number is required';
  end if;
  if p_booking_date < current_date or (p_start_time is not null and p_end_time is not null and p_start_time >= p_end_time) then
    raise exception 'Invalid booking schedule';
  end if;

  insert into public.bookings (
    full_name, mobile, booking_date, start_time, end_time, guest_count,
    package_id, special_requests, email, additional_notes, status
  ) values (
    trim(p_full_name), trim(p_mobile), p_booking_date, p_start_time, p_end_time,
    greatest(coalesce(p_guest_count, 0), 0), p_package_id, p_special_requests,
    nullif(trim(coalesce(p_email, '')), ''), p_additional_notes, 'pending'
  ) returning id into booking_id;

  return booking_id;
end;
$$;

drop policy if exists "Operations team can read booking workflow history" on public.booking_workflow_history;
create policy "Operations team can read booking workflow history" on public.booking_workflow_history
  for select to authenticated using (public.has_admin_permission(auth.uid(), 'operations'));
drop policy if exists "Operations team can read booking partner references" on public.booking_partner_refs;
create policy "Operations team can read booking partner references" on public.booking_partner_refs
  for select to authenticated using (public.has_admin_permission(auth.uid(), 'operations'));

create or replace function public.admin_transition_booking(
  p_booking_id uuid,
  p_to_status text,
  p_note text default null,
  p_appointment_at timestamptz default null,
  p_contact_outcome text default null
) returns public.bookings
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare current_booking public.bookings;
declare previous_status text;
begin
  if not public.has_admin_permission(auth.uid(), 'operations') then
    raise exception 'Operations permission required';
  end if;
  select * into current_booking from public.bookings where id = p_booking_id for update;
  if not found then raise exception 'Booking not found'; end if;
  previous_status := current_booking.status;
  if p_to_status not in ('pending', 'appointment_scheduled', 'quotation_in_progress', 'confirmed', 'completed', 'declined', 'cancelled') then
    raise exception 'Unknown booking status';
  end if;
  if not ((current_booking.status = 'pending' and p_to_status in ('appointment_scheduled', 'quotation_in_progress', 'declined'))
    or (current_booking.status = 'appointment_scheduled' and p_to_status in ('quotation_in_progress', 'declined'))
    or (current_booking.status = 'quotation_in_progress' and p_to_status in ('confirmed', 'declined'))
    or (current_booking.status = 'confirmed' and p_to_status in ('completed', 'cancelled'))) then
    raise exception 'Invalid transition from % to %', current_booking.status, p_to_status;
  end if;
  if p_to_status in ('declined', 'cancelled') and nullif(trim(coalesce(p_note, '')), '') is null then
    raise exception 'A reason is required';
  end if;
  update public.bookings set
    status = p_to_status,
    appointment_at = coalesce(p_appointment_at, appointment_at),
    contact_outcome = coalesce(p_contact_outcome, contact_outcome),
    lifecycle_reason = case when p_to_status in ('declined', 'cancelled') then p_note else lifecycle_reason end,
    final_price = case when p_to_status = 'confirmed' then coalesce(quoted_total, final_price) else final_price end,
    final_price_locked_at = case when p_to_status = 'confirmed' then now() else final_price_locked_at end,
    updated_at = now()
  where id = p_booking_id returning * into current_booking;
  insert into public.booking_workflow_history (booking_id, actor_id, action, from_status, to_status, note, changes)
  values (p_booking_id, auth.uid(), 'status_changed', previous_status, p_to_status, p_note,
    jsonb_build_object('appointment_at', p_appointment_at, 'contact_outcome', p_contact_outcome));
  return current_booking;
end;
$$;

create or replace function public.admin_update_booking_consultation(
  p_booking_id uuid,
  p_appointment_at timestamptz default null,
  p_consultation_notes text default null,
  p_quoted_total numeric default null,
  p_contact_outcome text default null,
  p_partner_ids uuid[] default null,
  p_change_note text default null
) returns public.bookings
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare updated_booking public.bookings;
begin
  if not public.has_admin_permission(auth.uid(), 'operations') then raise exception 'Operations permission required'; end if;
  select * into updated_booking from public.bookings where id = p_booking_id for update;
  if not found then raise exception 'Booking not found'; end if;
  if updated_booking.status not in ('pending', 'appointment_scheduled', 'quotation_in_progress', 'confirmed') then
    raise exception 'This booking cannot be edited in its current state';
  end if;
  if updated_booking.status = 'confirmed' and nullif(trim(coalesce(p_change_note, '')), '') is null then
    raise exception 'A reason is required for a confirmed booking amendment';
  end if;
  update public.bookings set
    appointment_at = coalesce(p_appointment_at, appointment_at),
    consultation_notes = coalesce(p_consultation_notes, consultation_notes),
    quoted_total = coalesce(p_quoted_total, quoted_total),
    contact_outcome = coalesce(p_contact_outcome, contact_outcome),
    updated_at = now()
  where id = p_booking_id returning * into updated_booking;
  if p_partner_ids is not null then
    delete from public.booking_partner_refs where booking_id = p_booking_id;
    insert into public.booking_partner_refs (booking_id, partner_id)
    select p_booking_id, partner_id from unnest(p_partner_ids) partner_id;
  end if;
  insert into public.booking_workflow_history (booking_id, actor_id, action, note, changes)
  values (p_booking_id, auth.uid(), 'consultation_updated', p_change_note,
    jsonb_build_object('appointment_at', p_appointment_at, 'quoted_total', p_quoted_total, 'contact_outcome', p_contact_outcome));
  return updated_booking;
end;
$$;

create or replace function public.admin_booking_stats()
returns table(total bigint, pending bigint, appointment_scheduled bigint, quotation_in_progress bigint, confirmed bigint, completed bigint, declined bigint, cancelled bigint)
language plpgsql stable security definer set search_path = public, pg_catalog as $$
begin
  if not public.has_admin_permission(auth.uid(), 'operations') then
    raise exception 'Operations permission required';
  end if;
  return query
    select count(*), count(*) filter (where status = 'pending'), count(*) filter (where status = 'appointment_scheduled'),
      count(*) filter (where status = 'quotation_in_progress'), count(*) filter (where status = 'confirmed'),
      count(*) filter (where status = 'completed'), count(*) filter (where status = 'declined'), count(*) filter (where status = 'cancelled')
    from public.bookings;
end;
$$;

revoke all on function public.submit_booking_request(text, text, date, time, time, integer, uuid, text, text, text), public.admin_transition_booking(uuid, text, text, timestamptz, text), public.admin_update_booking_consultation(uuid, timestamptz, text, numeric, text, uuid[], text), public.admin_booking_stats() from public, anon;
grant execute on function public.submit_booking_request(text, text, date, time, time, integer, uuid, text, text, text) to anon, authenticated;
grant execute on function public.admin_transition_booking(uuid, text, text, timestamptz, text), public.admin_update_booking_consultation(uuid, timestamptz, text, numeric, text, uuid[], text), public.admin_booking_stats() to authenticated;
commit;
