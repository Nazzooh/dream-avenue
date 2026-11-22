-- Governed public policies: content editors prepare drafts; leadership publishes.
create table if not exists public.policy_versions (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Dream Avenue Hall Rules and Guidelines',
  status text not null check (status in ('draft','published','archived')) default 'draft',
  effective_date date not null default current_date,
  created_by uuid references auth.users(id),
  published_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  source_version_id uuid references public.policy_versions(id)
);
create unique index if not exists policy_one_draft_idx on public.policy_versions (status) where status = 'draft';
create unique index if not exists policy_one_published_idx on public.policy_versions (status) where status = 'published';

create table if not exists public.policy_sections (
  id uuid primary key default gen_random_uuid(), version_id uuid not null references public.policy_versions(id) on delete cascade,
  title text not null, slug text not null, position integer not null check (position > 0), created_at timestamptz not null default now(),
  unique(version_id, slug), unique(version_id, position)
);
create table if not exists public.policy_rules (
  id uuid primary key default gen_random_uuid(), section_id uuid not null references public.policy_sections(id) on delete cascade,
  title text not null, body text not null, position integer not null check (position > 0), archived_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(section_id, position)
);
create table if not exists public.policy_change_log (
  id bigint generated always as identity primary key, version_id uuid not null references public.policy_versions(id) on delete cascade,
  actor_id uuid references auth.users(id), action text not null, details jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create index if not exists policy_sections_version_position_idx on public.policy_sections(version_id, position);
create index if not exists policy_rules_section_position_idx on public.policy_rules(section_id, position);
create index if not exists policy_change_log_version_created_idx on public.policy_change_log(version_id, created_at desc);

alter table public.policy_versions enable row level security;
alter table public.policy_sections enable row level security;
alter table public.policy_rules enable row level security;
alter table public.policy_change_log enable row level security;
grant select on public.policy_versions, public.policy_sections, public.policy_rules to anon, authenticated;
grant insert, update on public.policy_versions, public.policy_sections, public.policy_rules to authenticated;
grant select on public.policy_change_log to authenticated;

create or replace function public.policy_version_is_editable(p_version_id uuid) returns boolean language sql stable security definer set search_path = public, pg_catalog as $$
  select exists(select 1 from public.policy_versions where id = p_version_id and status = 'draft')
$$;
grant execute on function public.policy_version_is_editable(uuid) to authenticated, anon;

drop policy if exists "Public reads published policy versions" on public.policy_versions;
create policy "Public reads published policy versions" on public.policy_versions for select using (status = 'published' or public.has_admin_permission(auth.uid(), 'content'));
drop policy if exists "Public reads published policy sections" on public.policy_sections;
create policy "Public reads published policy sections" on public.policy_sections for select using (exists(select 1 from public.policy_versions v where v.id = version_id and (v.status = 'published' or public.has_admin_permission(auth.uid(), 'content'))));
drop policy if exists "Public reads published policy rules" on public.policy_rules;
create policy "Public reads published policy rules" on public.policy_rules for select using (exists(select 1 from public.policy_sections s join public.policy_versions v on v.id=s.version_id where s.id=section_id and (v.status = 'published' or public.has_admin_permission(auth.uid(), 'content'))));
drop policy if exists "Content can create policy drafts" on public.policy_versions;
create policy "Content can create policy drafts" on public.policy_versions for insert to authenticated with check (public.has_admin_permission(auth.uid(), 'content') and status = 'draft' and created_by = auth.uid());
drop policy if exists "Content can edit policy drafts" on public.policy_versions;
create policy "Content can edit policy drafts" on public.policy_versions for update to authenticated using (public.has_admin_permission(auth.uid(), 'content') and status = 'draft') with check (public.has_admin_permission(auth.uid(), 'content') and status = 'draft');
drop policy if exists "Content can edit draft sections" on public.policy_sections;
create policy "Content can edit draft sections" on public.policy_sections for all to authenticated using (public.has_admin_permission(auth.uid(), 'content') and public.policy_version_is_editable(version_id)) with check (public.has_admin_permission(auth.uid(), 'content') and public.policy_version_is_editable(version_id));
drop policy if exists "Content can edit draft rules" on public.policy_rules;
create policy "Content can edit draft rules" on public.policy_rules for all to authenticated using (public.has_admin_permission(auth.uid(), 'content') and exists(select 1 from public.policy_sections s where s.id=section_id and public.policy_version_is_editable(s.version_id))) with check (public.has_admin_permission(auth.uid(), 'content') and exists(select 1 from public.policy_sections s where s.id=section_id and public.policy_version_is_editable(s.version_id)));
drop policy if exists "Leadership reads policy audit" on public.policy_change_log;
create policy "Leadership reads policy audit" on public.policy_change_log for select to authenticated using (public.has_admin_permission(auth.uid(), 'publish'));

create or replace function public.create_policy_draft() returns public.policy_versions language plpgsql security definer set search_path = public, pg_catalog as $$
declare draft public.policy_versions; published public.policy_versions; section_row public.policy_sections; new_section_id uuid;
begin
  if not public.has_admin_permission(auth.uid(), 'content') then raise exception 'Not authorized to edit policies'; end if;
  select * into draft from public.policy_versions where status='draft' limit 1; if found then return draft; end if;
  select * into published from public.policy_versions where status='published' limit 1;
  insert into public.policy_versions(title,status,effective_date,created_by,source_version_id) values(coalesce(published.title,'Dream Avenue Hall Rules and Guidelines'),'draft',current_date,auth.uid(),published.id) returning * into draft;
  if published.id is not null then
    for section_row in select * from public.policy_sections where version_id=published.id order by position loop
      insert into public.policy_sections(version_id,title,slug,position) values(draft.id,section_row.title,section_row.slug,section_row.position) returning id into new_section_id;
      insert into public.policy_rules(section_id,title,body,position,archived_at) select new_section_id,title,body,position,archived_at from public.policy_rules where section_id=section_row.id order by position;
    end loop;
  end if;
  insert into public.policy_change_log(version_id,actor_id,action) values(draft.id,auth.uid(),'draft_created'); return draft;
end $$;
grant execute on function public.create_policy_draft() to authenticated;
revoke execute on function public.create_policy_draft() from public, anon;

create or replace function public.publish_policy_version(p_version_id uuid) returns void language plpgsql security definer set search_path = public, pg_catalog as $$
begin
  if not public.has_admin_permission(auth.uid(), 'publish') then raise exception 'Only Owners and Developers can publish policies'; end if;
  if not exists(select 1 from public.policy_versions where id=p_version_id and status='draft') then raise exception 'Only a draft policy version can be published'; end if;
  update public.policy_versions set status='archived',updated_at=now() where status='published';
  update public.policy_versions set status='published',published_at=now(),published_by=auth.uid(),effective_date=current_date,updated_at=now() where id=p_version_id;
  insert into public.policy_change_log(version_id,actor_id,action) values(p_version_id,auth.uid(),'published');
end $$;
grant execute on function public.publish_policy_version(uuid) to authenticated;
revoke execute on function public.publish_policy_version(uuid) from public, anon;
revoke execute on function public.policy_version_is_editable(uuid) from public, anon;
revoke all on public.policy_change_log from anon;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('policy-archives','policy-archives',false,10485760,array['image/png','image/jpeg','application/pdf']) on conflict (id) do update set public=false;
drop policy if exists "Content can read policy archives" on storage.objects;
create policy "Content can read policy archives" on storage.objects for select to authenticated using (bucket_id='policy-archives' and public.has_admin_permission(auth.uid(),'content'));

-- Seed the approved transcription once. Future changes are created as drafts via create_policy_draft().
do $$ declare v_id uuid; s_id uuid; seed jsonb := '[
{"title":"Payment and booking","slug":"payment-booking","rules":[["Payment obligations","The remaining rent and a security deposit of ₹25,000 must be paid at the auditorium one day before the event. The kitchen will only be accessible once full payment is received and a receipt is issued."],["Non-refundable advance","Any advance payments made are non-refundable."],["Booking party responsibility","The responsibility for the event lies solely with the booking party. Guests are not covered under the booking agreement."]]},
{"title":"Security and liability","slug":"security-liability","rules":[["Personal belongings","Keep valuables such as gold, cash, and mobiles with you. The hall is not liable for any loss."],["Plastic usage","Plastic glasses and plates are prohibited. Bookings using such items will not be accepted."],["Security arrangements","One security guard is provided by the hall. If vehicles overflow onto the road, the booking party must arrange additional security to prevent blockage."],["Power supply","If extra fans or lights are required, a generator must be brought in by the booking party."],["Accommodation","No accommodation is provided within the hall premises."]]},
{"title":"Facilities and usage","slug":"facilities-usage","rules":[["Utensils usage","Only utensils provided by the auditorium may be used. Bringing outside utensils is not allowed."],["Stage programs","Stage programs with sound are permitted only until 10 pm."],["Kitchen access","If the hall is not booked for the previous day, only the kitchen and items for preparing food will be accessible."],["Hall access for weddings","For daytime weddings, the hall is accessible from 9 am to 4 pm and 6 pm to 10 pm."]]},
{"title":"Property and damage","slug":"property-damage","rules":[["Property damage","Any damage to property within the auditorium will be charged to the booking party."],["Vehicle liability","The hall is not responsible for vehicles parked in the hall compound."]]},
{"title":"Catering and food","slug":"catering-food","rules":[["Food responsibility","The booking party is fully responsible for the food served at the event."],["Caterer dealings","The hall will not engage with the caterer appointed by the booking party."],["Video charge","A current charge of ₹500 is applicable for using the video facilities."],["Food restrictions","Do not use food items in the function hall."],["Firecracker prohibition","The bursting of firecrackers is strictly prohibited within the hall compound."],["Dining hall capacity","The dining hall can accommodate only 100 people at a time for dining."]]},
{"title":"Music and parking","slug":"music-parking","rules":[["Music festivals","Organizers must bring a generator for music festivals. The festival can only be held until 10 pm."],["Parking facilities","The auditorium compound has parking space for 30 cars; an additional parking space for 50 cars is available on the grounds outside the auditorium."]]},
{"title":"Health and safety","slug":"health-safety","rules":[["Catering requirements","The catering personnel must have a food license, and the cooking staff must possess a health card."],["Food disposal","Leftover food items must be disposed of at the booking party’s own risk."]]}]'::jsonb; item jsonb; rule jsonb; sec_pos int:=0; rule_pos int;
begin if exists(select 1 from public.policy_versions) then return; end if;
  insert into public.policy_versions(status,effective_date,published_at,title) values('published',current_date,now(),'Dream Avenue Hall Rules and Guidelines') returning id into v_id;
  for item in select * from jsonb_array_elements(seed) loop sec_pos:=sec_pos+1; insert into public.policy_sections(version_id,title,slug,position) values(v_id,item->>'title',item->>'slug',sec_pos) returning id into s_id; rule_pos:=0; for rule in select * from jsonb_array_elements(item->'rules') loop rule_pos:=rule_pos+1; insert into public.policy_rules(section_id,title,body,position) values(s_id,rule->>0,rule->>1,rule_pos); end loop; end loop;
end $$;
