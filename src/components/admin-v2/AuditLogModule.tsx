import { useMemo, useState } from 'react';
import { Activity, Download, FileClock, Search, ShieldCheck, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAdminActivity } from '../../src/hooks/useAdminWorkspace';
import { useAdminGuard } from '../../src/hooks/useAdminGuard';
import { can } from '../../src/lib/adminPermissions';
import { AdminActivity } from '../../src/api/adminWorkspace';

function exportActivity(rows: AdminActivity[]) {
  const header = ['When', 'Action', 'Resource', 'Summary', 'Actor'];
  const escape = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const data = rows.map((row) => [row.created_at, row.action, row.resource_type, row.summary, row.actor_id].map(escape).join(','));
  const url = URL.createObjectURL(new Blob([[header.join(','), ...data].join('\n')], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = `dream-avenue-audit-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url);
}

export function AuditLogModule() {
  const { profile } = useAdminGuard();
  const allowed = can(profile?.role, 'audit');
  const { data: activity = [], isLoading, error } = useAdminActivity(allowed);
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('all');
  const [resource, setResource] = useState('all');
  const [windowDays, setWindowDays] = useState('all');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<AdminActivity | null>(null);
  const actions = useMemo(() => [...new Set(activity.map((entry) => entry.action))].sort(), [activity]);
  const resources = useMemo(() => [...new Set(activity.map((entry) => entry.resource_type))].sort(), [activity]);
  const visible = useMemo(() => {
    const since = windowDays === 'all' ? null : Date.now() - Number(windowDays) * 86_400_000;
    return activity.filter((entry) => {
      const matchesSearch = `${entry.action} ${entry.resource_type} ${entry.summary} ${entry.actor_id || ''}`.toLowerCase().includes(search.toLowerCase());
      return matchesSearch && (action === 'all' || entry.action === action) && (resource === 'all' || entry.resource_type === resource) && (!since || new Date(entry.created_at).getTime() >= since);
    });
  }, [action, activity, resource, search, windowDays]);
  const pageSize = 25;
  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const pageRows = visible.slice(page * pageSize, (page + 1) * pageSize);
  const resetPage = () => setPage(0);

  if (!allowed) return <AdminLayout><section className="workspace-page"><div className="workspace-empty"><ShieldCheck size={28}/><h2>Owner access required</h2><p>The full operational audit is reserved for the Owner and Developer roles.</p></div></section></AdminLayout>;

  return <AdminLayout><section className="workspace-page">
    <header className="workspace-page-header"><div><p className="workspace-eyebrow">Owner record</p><h1>Activity & Audit</h1><p>A permanent operational history of the actions taken across Dream Avenue.</p></div><button disabled={!visible.length} onClick={() => exportActivity(visible)} className="workspace-button workspace-button-secondary"><Download size={17}/>Export CSV</button></header>
    <div className="workspace-toolbar workspace-audit-toolbar"><label className="workspace-search"><Search size={18}/><input value={search} onChange={(event) => { setSearch(event.target.value); resetPage(); }} placeholder="Search actions, records, or team members" /></label><div className="workspace-select-row"><select value={action} onChange={(event) => { setAction(event.target.value); resetPage(); }}><option value="all">All actions</option>{actions.map((item) => <option key={item} value={item}>{item}</option>)}</select><select value={resource} onChange={(event) => { setResource(event.target.value); resetPage(); }}><option value="all">All records</option>{resources.map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}</select><select value={windowDays} onChange={(event) => { setWindowDays(event.target.value); resetPage(); }}><option value="all">Any date</option><option value="1">Last 24 hours</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select></div><span className="workspace-audit-note"><ShieldCheck size={16}/> Owner & Developer</span></div>
    {isLoading ? <div className="workspace-empty">Loading activity history...</div> : error ? <div className="workspace-empty"><FileClock size={28}/><h2>Activity history is unavailable</h2><p>Check the new workspace migration has been applied in Supabase.</p></div> : visible.length === 0 ? <div className="workspace-empty"><Activity size={28}/><h2>No matching activity</h2><p>New task, partner, referral, and workspace actions will be recorded here.</p></div> : <><div className="audit-list">{pageRows.map((entry) => <button key={entry.id} className="audit-row" onClick={() => setSelected(entry)}><div className="audit-icon"><Activity size={17}/></div><div><strong>{entry.summary}</strong><p>{entry.resource_type.replaceAll('_', ' ')} · {entry.action}</p></div><time dateTime={entry.created_at}>{new Date(entry.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</time></button>)}</div><div className="workspace-pagination"><span>{visible.length} entries</span><div><button className="workspace-button workspace-button-secondary" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>Previous</button><span>Page {page + 1} of {totalPages}</span><button className="workspace-button workspace-button-secondary" disabled={page + 1 >= totalPages} onClick={() => setPage((value) => value + 1)}>Next</button></div></div></>}
    {selected && <ActivityDetail entry={selected} onClose={() => setSelected(null)} />}
  </section></AdminLayout>;
}

function ActivityDetail({ entry, onClose }: { entry: AdminActivity; onClose(): void }) {
  return <div className="workspace-drawer-backdrop" onMouseDown={onClose}><aside className="workspace-drawer" role="dialog" aria-modal="true" aria-label="Audit entry detail" onMouseDown={(event) => event.stopPropagation()}><div className="workspace-drawer-header"><div><p className="workspace-eyebrow">Audit record</p><h2>{entry.summary}</h2></div><button className="workspace-icon-button" onClick={onClose} aria-label="Close audit detail"><X size={20}/></button></div><dl className="workspace-detail-list"><div><dt>When</dt><dd>{new Date(entry.created_at).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'medium' })}</dd></div><div><dt>Action</dt><dd>{entry.action}</dd></div><div><dt>Record</dt><dd>{entry.resource_type.replaceAll('_', ' ')}{entry.resource_id ? ` · ${entry.resource_id}` : ''}</dd></div><div><dt>Actor</dt><dd>{entry.actor_id || 'System'}</dd></div></dl><p className="workspace-eyebrow">Stored change data</p><pre className="workspace-json">{JSON.stringify(entry.details, null, 2)}</pre></aside></div>;
}
