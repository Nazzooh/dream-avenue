import { FormEvent, useMemo, useState } from 'react';
import { CheckCircle2, Circle, Clock3, ListTodo, Plus, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { AdminTask, TaskPriority, TaskStatus, WorkspaceMember } from '../../src/api/adminWorkspace';
import { useAdminTasks, useCreateTask, useUpdateTaskStatus, useWorkspaceMembers } from '../../src/hooks/useAdminWorkspace';
import { useAdminGuard } from '../../src/hooks/useAdminGuard';
import { can } from '../../src/lib/adminPermissions';

const priorityOrder: Record<TaskPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

export function TasksModule() {
  const { profile } = useAdminGuard();
  const permitted = can(profile?.role, 'tasks');
  const { data: tasks = [], isLoading, error } = useAdminTasks(true);
  const { data: members = [] } = useWorkspaceMembers(permitted);
  const [status, setStatus] = useState<'all' | TaskStatus>('all');
  const [editorOpen, setEditorOpen] = useState(false);
  const updateStatus = useUpdateTaskStatus();
  const visible = useMemo(() => tasks.filter((task) => status === 'all' || task.status === status).sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority] || Number(new Date(a.due_at || '9999-12-31')) - Number(new Date(b.due_at || '9999-12-31'))), [status, tasks]);
  const openCount = tasks.filter((task) => task.status === 'open' || task.status === 'in_progress').length;

  if (!permitted) return <AdminLayout><section className="workspace-page"><div className="workspace-empty"><ListTodo size={28}/><h2>Task access is unavailable</h2><p>Your current role does not have workspace task access.</p></div></section></AdminLayout>;

  return <AdminLayout><section className="workspace-page">
    <header className="workspace-page-header"><div><p className="workspace-eyebrow">Operational workflow</p><h1>Team Tasks</h1><p>Keep booking follow-ups, venue preparation, and partner coordination visible to the whole team.</p></div><button className="workspace-button workspace-button-primary" onClick={() => setEditorOpen(true)}><Plus size={18}/>New task</button></header>
    <div className="task-summary"><div><strong>{openCount}</strong><span>Open work</span></div><div><strong>{tasks.filter((task) => task.priority === 'urgent' && task.status !== 'completed').length}</strong><span>Urgent</span></div><div><strong>{tasks.filter((task) => task.status === 'completed').length}</strong><span>Completed</span></div></div>
    <div className="workspace-toolbar"><div className="workspace-filter-row">{(['all', 'open', 'in_progress', 'completed', 'cancelled'] as const).map((item) => <button key={item} className={status === item ? 'is-active' : ''} onClick={() => setStatus(item)}>{item === 'all' ? 'All tasks' : item.replaceAll('_', ' ')}</button>)}</div></div>
    {isLoading ? <div className="workspace-empty">Loading tasks...</div> : error ? <div className="workspace-empty"><ListTodo size={28}/><h2>Tasks are unavailable</h2><p>Check that the workspace migration is applied and you are signed in with a team role.</p></div> : visible.length === 0 ? <div className="workspace-empty"><ListTodo size={28}/><h2>No tasks in this view</h2><p>Create a follow-up to keep the next operational action visible.</p><button className="workspace-button workspace-button-primary" onClick={() => setEditorOpen(true)}>Create task</button></div> : <div className="task-list">{visible.map((task) => <TaskRow key={task.id} task={task} assignee={members.find((member) => member.id === task.assignee_id)} updating={updateStatus.isPending} onUpdate={(next) => updateStatus.mutate({ id: task.id, status: next })} />)}</div>}
    {editorOpen && <TaskEditor members={members} defaultAssigneeId={profile?.id || ''} onClose={() => setEditorOpen(false)} />}
  </section></AdminLayout>;
}

function TaskRow({ task, assignee, updating, onUpdate }: { task: AdminTask; assignee?: WorkspaceMember; updating: boolean; onUpdate(status: TaskStatus): void }) {
  const complete = task.status === 'completed';
  return <article className={`task-row task-priority-${task.priority}`}><button className="task-complete" disabled={updating} aria-label={complete ? `Reopen ${task.title}` : `Complete ${task.title}`} onClick={() => onUpdate(complete ? 'open' : 'completed')}>{complete ? <CheckCircle2 size={21}/> : <Circle size={21}/>}</button><div className="task-row-main"><div className="task-row-title"><strong>{task.title}</strong><span className={`workspace-chip task-chip-${task.priority}`}>{task.priority}</span></div>{task.description && <p>{task.description}</p>}<span className="task-due"><Clock3 size={14}/>{task.due_at ? new Date(task.due_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'No due date'}{assignee?.email && <> · Assigned to {assignee.email}</>}</span></div><select aria-label={`Change status for ${task.title}`} value={task.status} disabled={updating} onChange={(event) => onUpdate(event.target.value as TaskStatus)}><option value="open">Open</option><option value="in_progress">In progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></article>;
}

function TaskEditor({ members, defaultAssigneeId, onClose }: { members: WorkspaceMember[]; defaultAssigneeId: string; onClose(): void }) {
  const createTask = useCreateTask();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueAt, setDueAt] = useState('');
  const [assigneeId, setAssigneeId] = useState(defaultAssigneeId);
  const submit = (event: FormEvent) => { event.preventDefault(); if (!title.trim()) return; createTask.mutate({ title: title.trim(), description: description.trim() || null, priority, due_at: dueAt ? new Date(dueAt).toISOString() : null, booking_id: null, assignee_id: assigneeId || null }, { onSuccess: onClose }); };
  return <div className="workspace-drawer-backdrop" onMouseDown={onClose}><aside className="workspace-drawer" role="dialog" aria-modal="true" aria-label="Create task" onMouseDown={(event) => event.stopPropagation()}><div className="workspace-drawer-header"><div><p className="workspace-eyebrow">Operations queue</p><h2>Create task</h2></div><button className="workspace-icon-button" onClick={onClose} aria-label="Close task editor"><X size={20}/></button></div><form className="workspace-form" onSubmit={submit}><label>Task title<input required autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Confirm floral setup time" /></label><label>Context or instructions<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What does the assignee need to know?" /></label><div className="workspace-form-grid"><label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></label><label>Due date & time<input type="datetime-local" value={dueAt} onChange={(event) => setDueAt(event.target.value)} /></label></div><label>Assign to<select value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)}><option value="">Leave unassigned</option>{members.map((member) => <option key={member.id} value={member.id}>{member.email || 'Team member'}{member.role ? ` · ${member.role}` : ''}</option>)}</select></label><div className="workspace-drawer-footer"><button type="button" className="workspace-button workspace-button-secondary" onClick={onClose}>Cancel</button><button className="workspace-button workspace-button-primary" disabled={createTask.isPending}>{createTask.isPending ? 'Creating...' : 'Create task'}</button></div></form></aside></div>;
}
