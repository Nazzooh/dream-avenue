-- Dream Avenue finance ledger: actual income, expenses, and immutable corrections.
-- Booking final_price remains a forecast; this table records money actually received or spent.

begin;

create table if not exists public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_type text not null check (transaction_type in ('income', 'expense')),
  status text not null default 'draft' check (status in ('draft', 'posted')),
  amount numeric(12,2) not null check (amount > 0),
  occurred_on date not null default current_date,
  category text not null check (char_length(trim(category)) between 2 and 80),
  booking_id uuid references public.bookings(id) on delete set null,
  counterparty text,
  reference_number text,
  notes text,
  reversal_of uuid references public.financial_transactions(id) on delete restrict,
  created_by uuid not null references public.profiles(id) on delete restrict default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  posted_at timestamptz,
  posted_by uuid references public.profiles(id) on delete set null,
  check (reversal_of is null or status = 'posted')
);

create index if not exists financial_transactions_occurred_on_idx
  on public.financial_transactions (occurred_on desc, created_at desc);
create index if not exists financial_transactions_booking_idx
  on public.financial_transactions (booking_id) where booking_id is not null;
create index if not exists financial_transactions_type_status_idx
  on public.financial_transactions (transaction_type, status, occurred_on desc);

-- Expand the canonical permission helper; profiles.role remains the source of truth.
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
    when 'manager' then permission in ('operations', 'content', 'partners', 'referrals', 'tasks', 'analytics', 'finance')
    when 'coordinator' then permission in ('operations', 'partners', 'referrals', 'tasks')
    else false
  end
$$;

create or replace function public.guard_financial_transaction()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  if tg_op = 'INSERT' then
    if new.created_by is distinct from auth.uid() then
      raise exception 'Financial records must be created by the signed-in user';
    end if;
    if new.reversal_of is not null and not public.has_admin_permission(auth.uid(), 'destructive') then
      raise exception 'Only Owner or Developer can create a financial reversal';
    end if;
  else
    if old.status <> 'draft' then
      raise exception 'Posted financial records are immutable; create a reversal instead';
    end if;
    if new.created_by is distinct from old.created_by or new.reversal_of is distinct from old.reversal_of then
      raise exception 'Financial record ownership and reversal links cannot be changed';
    end if;
  end if;

  if new.status = 'posted' and new.posted_at is null then
    new.posted_at := now();
    new.posted_by := auth.uid();
  elsif new.status = 'draft' then
    new.posted_at := null;
    new.posted_by := null;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists financial_transaction_guard on public.financial_transactions;
create trigger financial_transaction_guard
  before insert or update on public.financial_transactions
  for each row execute function public.guard_financial_transaction();

alter table public.financial_transactions enable row level security;
revoke all on table public.financial_transactions from anon, authenticated;
grant select, insert, update on table public.financial_transactions to authenticated;

create policy "Finance team can read ledger"
  on public.financial_transactions for select to authenticated
  using (public.has_admin_permission(auth.uid(), 'finance'));
create policy "Finance team can insert ledger entries"
  on public.financial_transactions for insert to authenticated
  with check (
    public.has_admin_permission(auth.uid(), 'finance')
    and created_by = auth.uid()
    and (reversal_of is null or public.has_admin_permission(auth.uid(), 'destructive'))
  );
create policy "Finance team can update drafts"
  on public.financial_transactions for update to authenticated
  using (public.has_admin_permission(auth.uid(), 'finance') and status = 'draft')
  with check (public.has_admin_permission(auth.uid(), 'finance'));

drop trigger if exists financial_transaction_activity on public.financial_transactions;
create trigger financial_transaction_activity
  after insert or update on public.financial_transactions
  for each row execute function public.log_admin_activity();

revoke all on function public.guard_financial_transaction() from public, anon, authenticated;

commit;
