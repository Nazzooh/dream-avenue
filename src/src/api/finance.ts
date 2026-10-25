import { supabase } from '../../utils/supabase/client';

export type FinancialTransactionType = 'income' | 'expense';
export type FinancialTransactionStatus = 'draft' | 'posted';

export interface FinancialTransaction {
  id: string;
  transaction_type: FinancialTransactionType;
  status: FinancialTransactionStatus;
  amount: number;
  occurred_on: string;
  category: string;
  booking_id: string | null;
  counterparty: string | null;
  reference_number: string | null;
  notes: string | null;
  reversal_of: string | null;
  created_by: string;
  created_at: string;
  posted_at: string | null;
}

export type FinancialTransactionInput = Pick<FinancialTransaction, 'transaction_type' | 'status' | 'amount' | 'occurred_on' | 'category' | 'booking_id' | 'counterparty' | 'reference_number' | 'notes'> & { reversal_of?: string | null };

const normalize = (row: any): FinancialTransaction => ({ ...row, amount: Number(row.amount || 0) });

export async function getFinancialTransactions(): Promise<FinancialTransaction[]> {
  const { data, error } = await supabase.from('financial_transactions').select('*').order('occurred_on', { ascending: false }).order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(normalize);
}

export async function createFinancialTransaction(input: FinancialTransactionInput) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in again.');
  const { data, error } = await supabase.from('financial_transactions').insert({ ...input, created_by: user.id }).select().single();
  if (error) throw new Error(error.message);
  return normalize(data);
}

export async function updateFinancialTransaction(id: string, input: Partial<FinancialTransactionInput>) {
  const { data, error } = await supabase.from('financial_transactions').update(input).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return normalize(data);
}

export async function reverseFinancialTransaction(transaction: FinancialTransaction) {
  return createFinancialTransaction({
    transaction_type: transaction.transaction_type === 'income' ? 'expense' : 'income',
    status: 'posted', amount: transaction.amount, occurred_on: new Date().toISOString().slice(0, 10),
    category: `Reversal · ${transaction.category}`, booking_id: transaction.booking_id,
    counterparty: transaction.counterparty, reference_number: transaction.reference_number,
    notes: `Reversal of ${transaction.id}${transaction.notes ? ` — ${transaction.notes}` : ''}`,
    reversal_of: transaction.id,
  });
}
