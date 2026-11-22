import { supabase } from '@/utils/supabase/client';
import { INITIAL_POLICY_SECTIONS, type PolicySection } from '@/lib/policies';

export type PolicyStatus = 'draft' | 'published' | 'archived';
export interface PolicyVersion { id: string; status: PolicyStatus; effective_date: string; created_at: string; published_at?: string | null; title?: string }

const throwIfError = (error: { message: string } | null) => { if (error) throw new Error(error.message); };

export async function getPublishedPolicy(): Promise<{ version: PolicyVersion | null; sections: PolicySection[] }> {
  const { data: version, error } = await supabase.from('policy_versions').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(1).maybeSingle();
  if (error || !version) return { version: null, sections: INITIAL_POLICY_SECTIONS };
  const { data, error: sectionError } = await supabase.from('policy_sections').select('id,title,slug,position,policy_rules(id,title,body,position,archived_at)').eq('version_id', version.id).order('position');
  if (sectionError) return { version, sections: INITIAL_POLICY_SECTIONS };
  return { version, sections: (data || []).map((section: any) => ({ ...section, rules: (section.policy_rules || []).filter((rule: any) => !rule.archived_at).sort((a: any, b: any) => a.position - b.position) })) };
}

export async function getPolicyWorkspace(): Promise<{ versions: PolicyVersion[]; sections: PolicySection[] }> {
  const { data: versions, error } = await supabase.from('policy_versions').select('*').order('created_at', { ascending: false }); throwIfError(error);
  const active = (versions || []).find((version: PolicyVersion) => version.status === 'draft') || (versions || [])[0];
  if (!active) return { versions: [], sections: [] };
  const { data, error: sectionError } = await supabase.from('policy_sections').select('id,title,slug,position,policy_rules(id,title,body,position,archived_at)').eq('version_id', active.id).order('position'); throwIfError(sectionError);
  return { versions: versions || [], sections: (data || []).map((section: any) => ({ ...section, rules: (section.policy_rules || []).sort((a: any, b: any) => a.position - b.position).map((rule: any) => ({ ...rule, archived: Boolean(rule.archived_at) })) })) };
}

export async function createPolicyDraft(): Promise<PolicyVersion> { const { data, error } = await supabase.rpc('create_policy_draft'); throwIfError(error); return data as PolicyVersion; }
export async function savePolicySection(input: { id?: string; version_id: string; title: string; slug: string; position: number }) { const query = input.id ? supabase.from('policy_sections').update(input).eq('id', input.id) : supabase.from('policy_sections').insert(input); const { error } = await query; throwIfError(error); }
export async function savePolicyRule(input: { id?: string; section_id: string; title: string; body: string; position: number }) { const payload = { section_id: input.section_id, title: input.title, body: input.body, position: input.position }; const query = input.id ? supabase.from('policy_rules').update(payload).eq('id', input.id) : supabase.from('policy_rules').insert(payload); const { error } = await query; throwIfError(error); }
export async function setPolicyRuleArchived(id: string, archived: boolean) { const { error } = await supabase.from('policy_rules').update({ archived_at: archived ? new Date().toISOString() : null }).eq('id', id); throwIfError(error); }
export async function publishPolicy(versionId: string) { const { error } = await supabase.rpc('publish_policy_version', { p_version_id: versionId }); throwIfError(error); }
export async function getPolicyArchiveUrls() { const { data, error } = await supabase.storage.from('policy-archives').createSignedUrls(['source/hall-rules-part-1.png', 'source/hall-rules-part-2.png'], 300); throwIfError(error); return data || []; }
