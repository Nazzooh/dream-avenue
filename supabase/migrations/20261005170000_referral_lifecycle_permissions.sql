-- Referral lifecycle rules: team members can progress an introduction, but
-- only Owner/Developer may remove an established financial record.

begin;

drop policy if exists "Referral editors can manage referrals" on public.partner_referrals;
drop policy if exists "Referral editors can create referrals" on public.partner_referrals;
drop policy if exists "Referral editors can update active referrals" on public.partner_referrals;
drop policy if exists "Leadership can delete referrals" on public.partner_referrals;

create policy "Referral editors can create referrals"
  on public.partner_referrals for insert to authenticated
  with check (public.has_admin_permission(auth.uid(), 'referrals'));

create policy "Referral editors can update active referrals"
  on public.partner_referrals for update to authenticated
  using (
    public.has_admin_permission(auth.uid(), 'referrals')
    and (status <> 'converted' or public.has_admin_permission(auth.uid(), 'destructive'))
  )
  with check (public.has_admin_permission(auth.uid(), 'referrals'));

create policy "Leadership can delete referrals"
  on public.partner_referrals for delete to authenticated
  using (public.has_admin_permission(auth.uid(), 'destructive'));

commit;
