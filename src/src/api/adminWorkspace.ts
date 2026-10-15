import { supabase } from '../../utils/supabase/client';

export const partnerCategories = [
  'Event Management', 'Decor & Florals', 'Transport', 'Artists & Performers',
  'Anchors & Hosts', 'Photography & Video', 'Catering', 'Rentals & Production',
  'Beauty & Bridal', 'Other',
] as const;

export type PartnerCategory = (typeof partnerCategories)[number];
export type ReferralStatus = 'introduced' | 'in_discussion' | 'converted' | 'not_converted';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';

export interface PartnerContact {
  id?: string;
  partner_id?: string;
  name: string;
  role_title?: string | null;
  phone?: string | null;
  email?: string | null;
  is_whatsapp?: boolean;
  is_primary?: boolean;
  notes?: string | null;
}

export interface Partner {
  id: string;
  name: string;
  categories: PartnerCategory[];
  tags: string[];
  service_area: string | null;
  website: string | null;
  social_url: string | null;
  notes: string | null;
  is_preferred: boolean;
  is_active: boolean;
  created_at: string;
  partner_contacts?: PartnerContact[];
}

export interface PartnerInput {
  name: string;
  categories: PartnerCategory[];
  tags?: string[];
  service_area?: string;
  website?: string;
  social_url?: string;
  notes?: string;
  is_preferred?: boolean;
  is_active?: boolean;
  contacts: PartnerContact[];
}

export interface AdminTask {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  assignee_id: string | null;
  booking_id: string | null;
  due_at: string | null;
  created_at: string;
}

export interface WorkspaceMember {
  id: string;
  email: string | null;
  role: string | null;
}

export interface AdminActivity {
  id: number;
  action: string;
  resource_type: string;
  resource_id: string | null;
  summary: string;
  details: Record<string, unknown>;
  created_at: string;
  actor_id: string | null;
}

export interface PartnerReferral {
  id: string;
  partner_id: string;
  prospect_reference: string | null;
  service_requested: string;
  status: ReferralStatus;
  referral_value: number | null;
  commission_value: number | null;
  commission_status: 'not_applicable' | 'expected' | 'received' | 'waived';
  outcome_notes: string | null;
  created_at: string;
  partners?: Pick<Partner, 'name'> | null;
}

async function currentUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in again to continue.');
  return user.id;
}

export async function getPartners(search = ''): Promise<Partner[]> {
  const query = supabase
    .from('partners')
    .select('*, partner_contacts(*)')
    .order('is_preferred', { ascending: false })
    .order('name');
  const { data, error } = await query;
  if (error) throw error;
  const partners = (data || []) as Partner[];
  const term = search.trim().toLowerCase();
  if (!term) return partners;
  return partners.filter((partner) => [
    partner.name,
    partner.service_area,
    ...partner.categories,
    ...partner.tags,
    ...(partner.partner_contacts || []).flatMap((contact) => [contact.name, contact.role_title, contact.phone, contact.email]),
  ].some((value) => value?.toLowerCase().includes(term)));
}

export async function savePartner(input: PartnerInput, partnerId?: string): Promise<Partner> {
  const userId = await currentUserId();
  const payload = {
    name: input.name.trim(), categories: input.categories, tags: input.tags || [],
    service_area: input.service_area || null, website: input.website || null,
    social_url: input.social_url || null, notes: input.notes || null,
    is_preferred: Boolean(input.is_preferred), is_active: input.is_active !== false,
    ...(partnerId ? { updated_by: userId, updated_at: new Date().toISOString() } : { created_by: userId, updated_by: userId }),
  };
  const query = partnerId
    ? supabase.from('partners').update(payload).eq('id', partnerId).select().single()
    : supabase.from('partners').insert(payload).select().single();
  const { data: partner, error } = await query;
  if (error) throw error;
  const { error: removeError } = await supabase.from('partner_contacts').delete().eq('partner_id', partner.id);
  if (removeError) throw removeError;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contacts = input.contacts.filter((contact) => contact.name.trim()).map(({ id: _id, partner_id: _pid, ...rest }) => ({ ...rest, partner_id: partner.id }));
  if (contacts.length) {
    const { error: contactsError } = await supabase.from('partner_contacts').insert(contacts);
    if (contactsError) throw contactsError;
  }
  return partner as Partner;
}

export async function getTasks(includeClosed = false): Promise<AdminTask[]> {
  let query = supabase.from('admin_tasks').select('*').order('due_at', { ascending: true, nullsFirst: false }).limit(includeClosed ? 100 : 12);
  if (!includeClosed) query = query.in('status', ['open', 'in_progress']);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as AdminTask[];
}

export async function getWorkspaceMembers(): Promise<WorkspaceMember[]> {
  const { data, error } = await supabase.rpc('list_workspace_team');
  if (error) throw error;
  return (data || []) as WorkspaceMember[];
}

export async function getPartnerReferrals(): Promise<PartnerReferral[]> {
  const { data, error } = await supabase.from('partner_referrals').select('*, partners(name)').order('created_at', { ascending: false }).limit(80);
  if (error) throw error;
  return (data || []) as PartnerReferral[];
}

export async function createPartnerReferral(input: Pick<PartnerReferral, 'partner_id' | 'prospect_reference' | 'service_requested' | 'status' | 'referral_value' | 'commission_value' | 'commission_status' | 'outcome_notes'>) {
  const userId = await currentUserId();
  const { error } = await supabase.from('partner_referrals').insert({ ...input, created_by: userId, updated_by: userId });
  if (error) throw error;
}

export async function updatePartnerReferral(id: string, input: Pick<PartnerReferral, 'prospect_reference' | 'service_requested' | 'status' | 'referral_value' | 'commission_value' | 'commission_status' | 'outcome_notes'>) {
  const userId = await currentUserId();
  const { error } = await supabase.from('partner_referrals').update({ ...input, updated_by: userId, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const userId = await currentUserId();
  const completed = status === 'completed';
  const { error } = await supabase.from('admin_tasks').update({ status, completed_at: completed ? new Date().toISOString() : null, completed_by: completed ? userId : null, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

export async function getActivity(limit = 80): Promise<AdminActivity[]> {
  const { data, error } = await supabase.from('admin_activity').select('*').order('created_at', { ascending: false }).limit(limit);
  if (error) throw error;
  return (data || []) as AdminActivity[];
}

export async function createTask(input: Pick<AdminTask, 'title' | 'description' | 'priority' | 'due_at' | 'booking_id'> & { assignee_id?: string | null }) {
  const createdBy = await currentUserId();
  const { error } = await supabase.from('admin_tasks').insert({ ...input, created_by: createdBy, assignee_id: input.assignee_id ?? createdBy });
  if (error) throw error;
}
