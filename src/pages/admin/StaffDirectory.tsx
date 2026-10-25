import { FormEvent, useEffect, useState } from 'react';
import { Camera, Mail, Plus, RefreshCw, ShieldCheck, UsersRound } from 'lucide-react';
import AdminLayout from '../../components/admin-v2/AdminLayout';
import { supabase } from '../../utils/supabase/client';
import { useAdminGuard } from '../../src/hooks/useAdminGuard';
import { roleLabel, type AdminRole } from '../../src/lib/adminPermissions';
import { toast } from 'sonner';
import { AdminSelect } from '../../components/admin-v2/AdminSelect';

type StaffMember = { id: string; full_name: string; email: string; role: AdminRole; work_started_on: string | null; portrait_url: string | null; is_active: boolean };
const roles: AdminRole[] = ['developer', 'owner', 'manager', 'coordinator'];

export function AdminStaffDirectory() {
  const { profile } = useAdminGuard();
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [portrait, setPortrait] = useState<File | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('staff-directory', { body: { action: 'list' } });
    if (error || !data?.success) toast.error(data?.error || error?.message || 'Staff directory is unavailable. Deploy the staff-directory function first.');
    else setMembers(data.data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const requestedRole = form.get('role') as AdminRole;
    if (profile?.role === 'owner' && !['manager', 'coordinator'].includes(requestedRole)) { toast.error('Owners can create Managers and Coordinators only.'); return; }
    setCreating(true);
    const { data, error } = await supabase.functions.invoke('staff-directory', { body: { action: 'invite', full_name: form.get('full_name'), email: form.get('email'), role: requestedRole, work_started_on: form.get('work_started_on') } });
    if (error || !data?.success) { toast.error(data?.error || error?.message || 'Could not send the staff invitation.'); setCreating(false); return; }
    if (portrait && data.data?.id) {
      const extension = portrait.name.split('.').pop() || 'jpg';
      const path = `${data.data.id}/portrait.${extension}`;
      const upload = await supabase.storage.from('staff-portraits').upload(path, portrait, { upsert: true, contentType: portrait.type });
      if (upload.error) toast.error('Invitation sent, but the portrait could not be uploaded.');
      else await supabase.functions.invoke('staff-directory', { body: { action: 'set_portrait', id: data.data.id, portrait_path: path } });
    }
    toast.success('Invitation sent. The staff member will set their own password securely.');
    event.currentTarget.reset(); setPortrait(null); setCreating(false); load();
  };

  const availableRoles = profile?.role === 'owner' ? roles.filter((role) => role === 'manager' || role === 'coordinator') : roles;
  return <AdminLayout><div className="staff-directory">
    <header className="staff-directory-header"><div><p className="workspace-eyebrow">Private team records</p><h1>Staff Directory</h1><p>Invite internal staff and keep a simple, private identification portrait for the leadership team.</p></div><div className="staff-directory-note"><ShieldCheck size={17}/><span>Owner & Developer only</span></div></header>
    <section className="staff-invite-card"><div className="staff-invite-intro"><div className="staff-icon"><UsersRound size={22}/></div><div><h2>Invite a team member</h2><p>No password is collected here. Supabase sends a secure password-setup invitation.</p></div></div>
      <form onSubmit={submit} className="staff-invite-form"><label>Full name<input name="full_name" required minLength={2} placeholder="Staff member name" /></label><label>Work start date<input name="work_started_on" type="date" required /></label><label>Email address<input name="email" type="email" required placeholder="name@example.com" /></label><label>Workspace role<AdminSelect name="role" defaultValue="coordinator" options={availableRoles.map((role) => ({ value: role, label: roleLabel(role) }))}/></label><label className="staff-portrait-input">Identification portrait <span>optional</span><input type="file" accept="image/*" capture="user" onChange={(e) => setPortrait(e.target.files?.[0] || null)} /><small><Camera size={14}/>Take a photo or select one from device</small></label><button className="workspace-button workspace-button-primary" disabled={creating}>{creating ? <RefreshCw className="animate-spin" size={17}/> : <Plus size={17}/>}Send invitation</button></form>
    </section>
    <section className="staff-list-card"><div className="staff-list-heading"><div><h2>Current team</h2><p>Portraits are private to Owners and Developers.</p></div><button className="workspace-button" onClick={load} disabled={loading}><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/>Refresh</button></div>
      {loading ? <div className="staff-empty">Loading staff directory…</div> : members.length === 0 ? <div className="staff-empty"><Mail size={26}/><p>No staff records yet. Send the first invitation above.</p></div> : <div className="staff-grid">{members.map((member) => <article className="staff-member" key={member.id}><div className="staff-avatar">{member.portrait_url ? <img src={member.portrait_url} alt="" /> : member.full_name.split(' ').map((part) => part[0]).slice(0,2).join('')}</div><div><h3>{member.full_name}</h3><p>{member.email}</p><div className="staff-meta"><span>{roleLabel(member.role)}</span><span>{member.work_started_on ? `Since ${new Date(member.work_started_on).toLocaleDateString(undefined,{month:'short',year:'numeric'})}` : 'Start date pending'}</span></div></div><span className={member.is_active ? 'staff-status active' : 'staff-status'}>{member.is_active ? 'Active' : 'Inactive'}</span></article>)}</div>}
    </section>
  </div></AdminLayout>;
}
