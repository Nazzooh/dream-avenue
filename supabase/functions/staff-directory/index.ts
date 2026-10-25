import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Content-Type': 'application/json' };
const reply = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers });

serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers });
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return reply({ success: false, error: 'Sign in required.' }, 401);
  const url = Deno.env.get('SUPABASE_URL') || '';
  // Current projects provide SUPABASE_SECRET_KEY; retain the legacy name for
  // compatibility with older Dream Avenue function deployments.
  const serviceKey = Deno.env.get('SUPABASE_SECRET_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data: authData } = await admin.auth.getUser(token);
  if (!authData.user) return reply({ success: false, error: 'Invalid session.' }, 401);
  const { data: actor } = await admin.from('profiles').select('role').eq('id', authData.user.id).maybeSingle();
  if (!actor || !['developer', 'owner'].includes(actor.role)) return reply({ success: false, error: 'Only Owners and Developers can manage staff.' }, 403);
  const body = await request.json();
  if (body.action === 'list') {
    const { data, error } = await admin.from('staff_directory').select('id, full_name, work_started_on, portrait_path, is_active, profiles!staff_directory_id_fkey(email, role)').order('full_name');
    if (error) return reply({ success: false, error: error.message }, 400);
    const members = await Promise.all((data || []).map(async (member: any) => ({ id: member.id, full_name: member.full_name, email: member.profiles?.email || '', role: member.profiles?.role, work_started_on: member.work_started_on, is_active: member.is_active, portrait_url: member.portrait_path ? (await admin.storage.from('staff-portraits').createSignedUrl(member.portrait_path, 300)).data.signedUrl : null })));
    return reply({ success: true, data: members });
  }
  if (body.action === 'invite') {
    const email = String(body.email || '').trim().toLowerCase(); const fullName = String(body.full_name || '').trim(); const role = String(body.role || '');
    if (!/^\S+@\S+\.\S+$/.test(email) || fullName.length < 2 || !['developer','owner','manager','coordinator'].includes(role)) return reply({ success: false, error: 'Enter a valid name, email, and role.' }, 400);
    if (actor.role === 'owner' && !['manager', 'coordinator'].includes(role)) return reply({ success: false, error: 'Owners may only invite Managers and Coordinators.' }, 403);
    const { data: invite, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, { data: { full_name: fullName } });
    if (inviteError || !invite.user) return reply({ success: false, error: inviteError?.message || 'Could not create invitation.' }, 400);
    const id = invite.user.id;
    const { error: profileError } = await admin.from('profiles').upsert({ id, email, role }, { onConflict: 'id' });
    if (profileError) return reply({ success: false, error: profileError.message }, 400);
    const { error: staffError } = await admin.from('staff_directory').upsert({ id, full_name: fullName, work_started_on: body.work_started_on || null, created_by: authData.user.id }, { onConflict: 'id' });
    if (staffError) return reply({ success: false, error: staffError.message }, 400);
    return reply({ success: true, data: { id } });
  }
  if (body.action === 'set_portrait') {
    const { error } = await admin.from('staff_directory').update({ portrait_path: body.portrait_path, updated_at: new Date().toISOString() }).eq('id', body.id);
    return error ? reply({ success: false, error: error.message }, 400) : reply({ success: true });
  }
  return reply({ success: false, error: 'Unknown action.' }, 400);
});
