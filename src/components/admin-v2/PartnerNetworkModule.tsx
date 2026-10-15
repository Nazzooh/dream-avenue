import { FormEvent, useMemo, useState } from 'react';
import { Building2, Check, ChevronRight, Download, LayoutGrid, LayoutList, Mail, MapPin, Phone, Plus, Search, Star, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Partner, PartnerCategory, PartnerContact, PartnerReferral, partnerCategories } from '../../src/api/adminWorkspace';
import { useCreatePartnerReferral, usePartnerReferrals, usePartners, useSavePartner, useUpdatePartnerReferral } from '../../src/hooks/useAdminWorkspace';
import { useAdminGuard } from '../../src/hooks/useAdminGuard';
import { can } from '../../src/lib/adminPermissions';

const blankContact = (): PartnerContact => ({ name: '', role_title: '', phone: '', email: '', is_primary: true, is_whatsapp: false, notes: '' });
const blankPartner = () => ({ name: '', categories: [] as PartnerCategory[], tags: '', service_area: '', website: '', social_url: '', notes: '', is_preferred: false, is_active: true, contacts: [blankContact()] });

export function PartnerNetworkModule() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PartnerCategory | 'all'>('all');
  const [preference, setPreference] = useState<'all' | 'preferred'>('all');
  const [activityState, setActivityState] = useState<'active' | 'all' | 'inactive'>('active');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [editor, setEditor] = useState<Partner | null | 'new'>(null);
  const [showReferral, setShowReferral] = useState(false);
  const [editingReferral, setEditingReferral] = useState<PartnerReferral | null>(null);
  const { data: partners = [], isLoading } = usePartners(search);
  const { data: referrals = [] } = usePartnerReferrals();
  const { profile } = useAdminGuard();
  const savePartner = useSavePartner();
  const editable = can(profile?.role, 'partners');
  const canRefer = can(profile?.role, 'referrals');
  const canSeeFinancials = can(profile?.role, 'audit');
  const visiblePartners = useMemo(() => partners.filter((partner) => {
    const inCategory = category === 'all' || partner.categories.includes(category);
    const inPreference = preference === 'all' || partner.is_preferred;
    const inActivity = activityState === 'all' || (activityState === 'active' ? partner.is_active : !partner.is_active);
    return inCategory && inPreference && inActivity;
  }), [activityState, category, partners, preference]);

  return <AdminLayout>
    <section className="workspace-page">
      <header className="workspace-page-header">
        <div><p className="workspace-eyebrow">Dream Avenue network</p><h1>Partner Network</h1><p>Trusted specialists for every client’s event—from decor to performers and transport.</p></div>
        <div className="workspace-header-actions">{canSeeFinancials && <button className="workspace-button workspace-button-secondary" onClick={() => exportReferrals(referrals)}><Download size={17}/>Export referrals</button>}{canRefer && <button className="workspace-button workspace-button-secondary" onClick={() => setShowReferral(true)}>Log referral</button>}{editable && <button className="workspace-button workspace-button-primary" onClick={() => setEditor('new')}><Plus size={18} /> Add partner</button>}</div>
      </header>
      <ReferralSummary referrals={referrals} canSeeFinancials={canSeeFinancials} />
      <ReferralPipeline referrals={referrals} editable={canRefer} onEdit={setEditingReferral} />
      <div className="workspace-toolbar">
        <label className="workspace-search"><Search size={18}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search partners, services, locations" /></label>
        <div className="workspace-select-row"><select aria-label="Partner preference" value={preference} onChange={(event) => setPreference(event.target.value as 'all' | 'preferred')}><option value="all">All partners</option><option value="preferred">Preferred only</option></select><select aria-label="Partner activity" value={activityState} onChange={(event) => setActivityState(event.target.value as 'active' | 'all' | 'inactive')}><option value="active">Active only</option><option value="all">Any status</option><option value="inactive">Inactive only</option></select><div className="workspace-view-toggle" aria-label="Partner view"><button className={view === 'grid' ? 'is-active' : ''} aria-label="Grid view" onClick={() => setView('grid')}><LayoutGrid size={17}/></button><button className={view === 'list' ? 'is-active' : ''} aria-label="List view" onClick={() => setView('list')}><LayoutList size={17}/></button></div></div>
        <div className="workspace-filter-row">
          <button className={category === 'all' ? 'is-active' : ''} onClick={() => setCategory('all')}>All</button>
          {partnerCategories.map((item) => <button key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
      </div>
      {isLoading ? <div className="workspace-empty">Loading partner network…</div> : visiblePartners.length === 0 ? <div className="workspace-empty"><Building2 size={30}/><h2>No partners found</h2><p>Build your trusted vendor network here so the team can respond to client needs quickly.</p>{editable && <button className="workspace-button workspace-button-primary" onClick={() => setEditor('new')}>Add the first partner</button>}</div> : <div className="partner-grid">
        {visiblePartners.map((partner) => <article className={`partner-card ${view === 'list' ? 'partner-card-list' : ''}`} key={partner.id}>
          <div className="partner-card-top"><div className="partner-mark"><Building2 size={20}/></div><div className="partner-card-actions">{partner.is_preferred && <span className="workspace-chip workspace-chip-gold"><Star size={13} fill="currentColor"/> Preferred</span>}{editable && <button className="workspace-icon-button" onClick={() => setEditor(partner)} aria-label={`Edit ${partner.name}`}><ChevronRight size={18}/></button>}</div></div>
          <h2>{partner.name}</h2><div className="partner-tags">{partner.categories.map((item) => <span key={item}>{item}</span>)}</div>
          {partner.service_area && <p className="partner-meta"><MapPin size={15}/>{partner.service_area}</p>}
          <div className="partner-contacts">{partner.partner_contacts?.slice(0, 2).map((contact) => <div key={contact.id || contact.name}><strong>{contact.name}</strong>{contact.role_title && <span>{contact.role_title}</span>}{contact.phone && <a href={`tel:${contact.phone}`}><Phone size={14}/>{contact.phone}</a>}{contact.email && <a href={`mailto:${contact.email}`}><Mail size={14}/>{contact.email}</a>}</div>)}</div>
        </article>)}</div>}
      {editor && <PartnerEditor partner={editor === 'new' ? undefined : editor} saving={savePartner.isPending} onClose={() => setEditor(null)} onSave={(input) => savePartner.mutate({ input, id: editor === 'new' ? undefined : editor.id }, { onSuccess: () => setEditor(null) })}/>} 
      {showReferral && <ReferralEditor partners={partners} onClose={() => setShowReferral(false)} />}
      {editingReferral && <ReferralUpdateDrawer referral={editingReferral} onClose={() => setEditingReferral(null)} />}
    </section>
  </AdminLayout>;
}

function exportReferrals(referrals: PartnerReferral[]) {
  const escape = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const rows = [['Partner', 'Service', 'Client / prospect', 'Status', 'Referral value', 'Commission value', 'Commission status', 'Created'], ...referrals.map((referral) => [referral.partners?.name || '', referral.service_requested, referral.prospect_reference || '', referral.status, referral.referral_value ?? '', referral.commission_value ?? '', referral.commission_status, new Date(referral.created_at).toLocaleDateString('en-CA')])];
  const blob = new Blob([rows.map((row) => row.map(escape).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `dream-avenue-referrals-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function ReferralSummary({ referrals, canSeeFinancials }: { referrals: { id: string; status: string; referral_value?: number | null; commission_value?: number | null; partners?: { name: string } | null; service_requested: string; created_at: string }[]; canSeeFinancials: boolean }) {
  const converted = referrals.filter((referral) => referral.status === 'converted').length;
  const value = referrals.reduce((total, referral) => total + Number(referral.referral_value || 0), 0);
  const commission = referrals.reduce((total, referral) => total + Number(referral.commission_value || 0), 0);
  return <div className="referral-strip"><div><p className="workspace-eyebrow">Referral pipeline</p><strong>{referrals.length} introductions</strong><span>{converted} converted</span>{canSeeFinancials && <span>₹{value.toLocaleString('en-IN')} referred · ₹{commission.toLocaleString('en-IN')} commission</span>}</div><div className="referral-recent">{referrals.length ? referrals.slice(0, 3).map((referral) => <span key={referral.id}>{referral.partners?.name || 'Partner'} · {referral.service_requested}</span>) : <span>Log client introductions to see your partner pipeline.</span>}</div></div>;
}

function ReferralEditor({ partners, onClose }: { partners: Partner[]; onClose(): void }) {
  const createReferral = useCreatePartnerReferral();
  const [partnerId, setPartnerId] = useState(''); const [prospect, setProspect] = useState(''); const [service, setService] = useState(''); const [notes, setNotes] = useState('');
  const submit = (event: FormEvent) => { event.preventDefault(); if (!partnerId || !service.trim()) return; createReferral.mutate({ partner_id: partnerId, prospect_reference: prospect || null, service_requested: service.trim(), status: 'introduced', referral_value: null, commission_value: null, commission_status: 'not_applicable', outcome_notes: notes || null }, { onSuccess: onClose }); };
  return <div className="workspace-drawer-backdrop" onMouseDown={onClose}><aside className="workspace-drawer" role="dialog" aria-modal="true" aria-label="Log referral" onMouseDown={(event) => event.stopPropagation()}><div className="workspace-drawer-header"><div><p className="workspace-eyebrow">Commercial introduction</p><h2>Log referral</h2></div><button className="workspace-icon-button" onClick={onClose}><X size={20}/></button></div><form className="workspace-form" onSubmit={submit}><label>Partner<select required value={partnerId} onChange={(event) => setPartnerId(event.target.value)}><option value="">Choose a partner</option>{partners.filter((partner) => partner.is_active).map((partner) => <option value={partner.id} key={partner.id}>{partner.name}</option>)}</select></label><label>Client or prospect reference<input value={prospect} onChange={(event) => setProspect(event.target.value)} placeholder="e.g. Afsal wedding enquiry"/></label><label>Service requested<input required value={service} onChange={(event) => setService(event.target.value)} placeholder="e.g. Stage decor"/></label><label>Internal note<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label><div className="workspace-drawer-footer"><button type="button" className="workspace-button workspace-button-secondary" onClick={onClose}>Cancel</button><button className="workspace-button workspace-button-primary" disabled={createReferral.isPending}>{createReferral.isPending ? 'Saving…' : 'Log referral'}</button></div></form></aside></div>;
}

function ReferralPipeline({ referrals, editable, onEdit }: { referrals: PartnerReferral[]; editable: boolean; onEdit(referral: PartnerReferral): void }) {
  if (!referrals.length) return null;
  return <section className="referral-pipeline"><div className="workspace-section-heading"><div><p className="workspace-eyebrow">Active records</p><h2>Referral pipeline</h2></div><span>{referrals.length} total</span></div><div className="referral-table">{referrals.slice(0, 8).map((referral) => <div className="referral-row" key={referral.id}><div><strong>{referral.partners?.name || 'Partner'}</strong><span>{referral.service_requested}</span></div><span className={`workspace-chip referral-status-${referral.status}`}>{referral.status.replaceAll('_', ' ')}</span><span>{new Date(referral.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>{editable && <button className="workspace-text-button" onClick={() => onEdit(referral)}>Update</button>}</div>)}</div></section>;
}

function ReferralUpdateDrawer({ referral, onClose }: { referral: PartnerReferral; onClose(): void }) {
  const updateReferral = useUpdatePartnerReferral();
  const [status, setStatus] = useState(referral.status);
  const [service, setService] = useState(referral.service_requested);
  const [prospect, setProspect] = useState(referral.prospect_reference || '');
  const [referralValue, setReferralValue] = useState(referral.referral_value?.toString() || '');
  const [commissionValue, setCommissionValue] = useState(referral.commission_value?.toString() || '');
  const [commissionStatus, setCommissionStatus] = useState(referral.commission_status);
  const [notes, setNotes] = useState(referral.outcome_notes || '');
  const submit = (event: FormEvent) => { event.preventDefault(); if (!service.trim()) return; updateReferral.mutate({ id: referral.id, input: { status, service_requested: service.trim(), prospect_reference: prospect || null, referral_value: referralValue ? Number(referralValue) : null, commission_value: commissionValue ? Number(commissionValue) : null, commission_status: commissionStatus, outcome_notes: notes || null } }, { onSuccess: onClose }); };
  return <div className="workspace-drawer-backdrop" onMouseDown={onClose}><aside className="workspace-drawer" role="dialog" aria-modal="true" aria-label="Update referral" onMouseDown={(event) => event.stopPropagation()}><div className="workspace-drawer-header"><div><p className="workspace-eyebrow">Referral record</p><h2>Update introduction</h2></div><button className="workspace-icon-button" onClick={onClose} aria-label="Close referral editor"><X size={20}/></button></div><form className="workspace-form" onSubmit={submit}><label>Status<select value={status} onChange={(event) => setStatus(event.target.value as PartnerReferral['status'])}><option value="introduced">Introduced</option><option value="in_discussion">In discussion</option><option value="converted">Converted</option><option value="not_converted">Not converted</option></select></label><label>Service requested<input required value={service} onChange={(event) => setService(event.target.value)} /></label><label>Client or prospect reference<input value={prospect} onChange={(event) => setProspect(event.target.value)} /></label><div className="workspace-form-grid"><label>Referral value<input type="number" min="0" value={referralValue} onChange={(event) => setReferralValue(event.target.value)} /></label><label>Commission value<input type="number" min="0" value={commissionValue} onChange={(event) => setCommissionValue(event.target.value)} /></label></div><label>Commission status<select value={commissionStatus} onChange={(event) => setCommissionStatus(event.target.value as PartnerReferral['commission_status'])}><option value="not_applicable">Not applicable</option><option value="expected">Expected</option><option value="received">Received</option><option value="waived">Waived</option></select></label><label>Outcome notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label><div className="workspace-drawer-footer"><button type="button" className="workspace-button workspace-button-secondary" onClick={onClose}>Cancel</button><button className="workspace-button workspace-button-primary" disabled={updateReferral.isPending}>{updateReferral.isPending ? 'Saving...' : 'Save changes'}</button></div></form></aside></div>;
}

function PartnerEditor({ partner, onClose, onSave, saving }: { partner?: Partner; onClose(): void; onSave(input: ReturnType<typeof blankPartner>): void; saving: boolean }) {
  const [form, setForm] = useState(() => partner ? { name: partner.name, categories: partner.categories, tags: partner.tags.join(', '), service_area: partner.service_area || '', website: partner.website || '', social_url: partner.social_url || '', notes: partner.notes || '', is_preferred: partner.is_preferred, is_active: partner.is_active, contacts: partner.partner_contacts?.length ? partner.partner_contacts : [blankContact()] } : blankPartner());
  const setContact = (index: number, patch: Partial<PartnerContact>) => setForm((current) => ({ ...current, contacts: current.contacts.map((contact, itemIndex) => itemIndex === index ? { ...contact, ...patch } : contact) }));
  const toggleCategory = (item: PartnerCategory) => setForm((current) => ({ ...current, categories: current.categories.includes(item) ? current.categories.filter((category) => category !== item) : [...current.categories, item] }));
  const submit = (event: FormEvent) => { event.preventDefault(); if (!form.name.trim() || !form.categories.length) return; onSave({ ...form, tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean), contacts: form.contacts }); };
  return <div className="workspace-drawer-backdrop" role="presentation" onMouseDown={onClose}><aside className="workspace-drawer" role="dialog" aria-modal="true" aria-label="Partner editor" onMouseDown={(event) => event.stopPropagation()}><div className="workspace-drawer-header"><div><p className="workspace-eyebrow">Partner profile</p><h2>{partner ? 'Edit partner' : 'Add a partner'}</h2></div><button className="workspace-icon-button" onClick={onClose}><X size={20}/></button></div><form onSubmit={submit} className="workspace-form">
    <label>Business or person name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })}/></label>
    <fieldset><legend>Services</legend><div className="workspace-check-grid">{partnerCategories.map((item) => <label key={item}><input type="checkbox" checked={form.categories.includes(item)} onChange={() => toggleCategory(item)}/>{item}</label>)}</div></fieldset>
    <div className="workspace-form-grid"><label>Service area<input value={form.service_area} onChange={(event) => setForm({ ...form, service_area: event.target.value })}/></label><label>Tags<input value={form.tags} placeholder="wedding, corporate" onChange={(event) => setForm({ ...form, tags: event.target.value })}/></label></div>
    <div className="workspace-form-grid"><label>Website<input type="url" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })}/></label><label>Social link<input type="url" value={form.social_url} onChange={(event) => setForm({ ...form, social_url: event.target.value })}/></label></div>
    <label>Internal notes<textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })}/></label>
    <div className="workspace-switch-row"><label><input type="checkbox" checked={form.is_preferred} onChange={(event) => setForm({ ...form, is_preferred: event.target.checked })}/> Preferred partner</label><label><input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })}/> Active</label></div>
    <div className="workspace-section-heading"><h3>Contacts</h3><button type="button" className="workspace-text-button" onClick={() => setForm({ ...form, contacts: [...form.contacts, blankContact()] })}><Plus size={15}/> Add contact</button></div>
    {form.contacts.map((contact, index) => <div className="workspace-contact-form" key={index}><div className="workspace-form-grid"><label>Name<input required value={contact.name} onChange={(event) => setContact(index, { name: event.target.value })}/></label><label>Role<input value={contact.role_title || ''} onChange={(event) => setContact(index, { role_title: event.target.value })}/></label></div><div className="workspace-form-grid"><label>Phone<input value={contact.phone || ''} onChange={(event) => setContact(index, { phone: event.target.value })}/></label><label>Email<input type="email" value={contact.email || ''} onChange={(event) => setContact(index, { email: event.target.value })}/></label></div>{form.contacts.length > 1 && <button type="button" className="workspace-danger-link" onClick={() => setForm({ ...form, contacts: form.contacts.filter((_, itemIndex) => itemIndex !== index) })}>Remove contact</button>}</div>)}
    <div className="workspace-drawer-footer"><button type="button" className="workspace-button workspace-button-secondary" onClick={onClose}>Cancel</button><button disabled={saving} className="workspace-button workspace-button-primary" type="submit"><Check size={17}/>{saving ? 'Saving…' : 'Save partner'}</button></div>
  </form></aside></div>;
}
