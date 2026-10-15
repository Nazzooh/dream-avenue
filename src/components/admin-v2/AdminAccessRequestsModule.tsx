import { useState } from 'react';
import { CheckCircle2, Clock3, Mail, Phone, ShieldCheck, Trash2, UserRound, X, XCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAdminRequests, useApproveAdminRequest, useDeleteAdminRequest, useUpdateAdminRequestStatus } from '../../src/hooks/useAdminRequests';
import { AdminRequest } from '../../src/schemas/adminRequests';
import { useAdminGuard } from '../../src/hooks/useAdminGuard';
import { can } from '../../src/lib/adminPermissions';

const statusClass = (status: AdminRequest['status']) => `request-status request-status-${status.toLowerCase()}`;

export function AdminAccessRequestsModule() {
  const { profile } = useAdminGuard();
  const { data: requests = [], isLoading, error } = useAdminRequests();
  const approve = useApproveAdminRequest();
  const update = useUpdateAdminRequestStatus();
  const remove = useDeleteAdminRequest();
  const [selected, setSelected] = useState<AdminRequest | null>(null);
  const permitted = can(profile?.role, 'access');

  if (!permitted) return <AdminLayout><section className="workspace-page"><div className="workspace-empty"><ShieldCheck size={30}/><h2>Owner access required</h2><p>Only the Owner or Developer can review and grant internal workspace access.</p></div></section></AdminLayout>;

  const pending = requests.filter((request) => request.status === 'Pending').length;
  const approveRequest = (request: AdminRequest) => {
    if (window.confirm(`Grant coordinator access to ${request.full_name}? They must already have an account using ${request.email}.`)) approve.mutate({ id: request.id, email: request.email });
  };
  const rejectRequest = (request: AdminRequest) => {
    if (window.confirm(`Reject the access request from ${request.full_name}?`)) update.mutate({ id: request.id, status: 'Rejected' });
  };
  const deleteRequest = (request: AdminRequest) => {
    if (window.confirm(`Permanently delete ${request.full_name}'s request?`)) remove.mutate(request.id, { onSuccess: () => setSelected(null) });
  };

  return <AdminLayout><section className="workspace-page access-requests-workspace">
    <header className="workspace-page-header"><div><p className="workspace-eyebrow">Workspace governance</p><h1>Access Requests</h1><p>Review internal access requests. Approvals grant the least-privileged Coordinator role; role escalation remains an Owner or Developer decision.</p></div></header>
    <div className="request-summary"><div><Clock3 size={18}/><strong>{pending}</strong><span>Pending review</span></div><div><CheckCircle2 size={18}/><strong>{requests.filter((request) => request.status === 'Approved').length}</strong><span>Approved</span></div><div><XCircle size={18}/><strong>{requests.filter((request) => request.status === 'Rejected').length}</strong><span>Declined</span></div></div>
    {isLoading ? <div className="workspace-empty">Loading access requests...</div> : error ? <div className="workspace-empty"><ShieldCheck size={28}/><h2>Requests are unavailable</h2><p>Apply the access-request migration, then reload this page.</p></div> : requests.length === 0 ? <div className="workspace-empty"><UserRound size={30}/><h2>No access requests</h2><p>New internal access requests will appear here for review.</p></div> : <div className="request-table-wrap"><table className="request-table"><thead><tr><th>Person</th><th>Contact</th><th>Requested</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{requests.map((request) => <tr key={request.id}><td><button className="request-person" onClick={() => setSelected(request)}><strong>{request.full_name}</strong><span>{request.message || 'No message provided'}</span></button></td><td><a href={`mailto:${request.email}`}>{request.email}</a>{request.phone && <a href={`tel:${request.phone}`}>{request.phone}</a>}</td><td>{new Date(request.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td><td><span className={statusClass(request.status)}>{request.status}</span></td><td><div className="request-actions">{request.status === 'Pending' && <><button className="workspace-icon-button request-approve" title="Approve as coordinator" aria-label={`Approve ${request.full_name}`} disabled={approve.isPending} onClick={() => approveRequest(request)}><CheckCircle2 size={18}/></button><button className="workspace-icon-button request-reject" title="Reject request" aria-label={`Reject ${request.full_name}`} disabled={update.isPending} onClick={() => rejectRequest(request)}><XCircle size={18}/></button></>}<button className="workspace-icon-button request-delete" title="Delete request" aria-label={`Delete ${request.full_name}`} disabled={remove.isPending} onClick={() => deleteRequest(request)}><Trash2 size={17}/></button></div></td></tr>)}</tbody></table></div>}
    {selected && <div className="workspace-drawer-backdrop" onMouseDown={() => setSelected(null)}><aside className="workspace-drawer request-detail-drawer" role="dialog" aria-modal="true" aria-label="Access request details" onMouseDown={(event) => event.stopPropagation()}><div className="workspace-drawer-header"><div><p className="workspace-eyebrow">Access request</p><h2>{selected.full_name}</h2></div><button className="workspace-icon-button" onClick={() => setSelected(null)} aria-label="Close details"><X size={20}/></button></div><div className="request-detail"><span className={statusClass(selected.status)}>{selected.status}</span><a href={`mailto:${selected.email}`}><Mail size={16}/>{selected.email}</a>{selected.phone && <a href={`tel:${selected.phone}`}><Phone size={16}/>{selected.phone}</a>}<div><p className="workspace-eyebrow">Message</p><p>{selected.message || 'No message provided.'}</p></div></div><div className="workspace-drawer-footer">{selected.status === 'Pending' && <><button className="workspace-button workspace-button-secondary" onClick={() => rejectRequest(selected)}>Reject</button><button className="workspace-button workspace-button-primary" onClick={() => approveRequest(selected)}>Approve coordinator</button></>}<button className="workspace-danger-link" onClick={() => deleteRequest(selected)}>Delete request</button></div></aside></div>}
  </section></AdminLayout>;
}
