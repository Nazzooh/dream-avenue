import { CheckCircle2, ClipboardList, Clock3, ListTodo, Plus } from 'lucide-react';
import { useState } from 'react';
import { useAdminActivity, useAdminTasks, useCreateTask, useUpdateTaskStatus } from '../../src/hooks/useAdminWorkspace';
import { useAdminGuard } from '../../src/hooks/useAdminGuard';
import { can } from '../../src/lib/adminPermissions';

export function OperationsPulse() {
  const { data: tasks = [], isLoading: tasksLoading } = useAdminTasks();
  const { profile } = useAdminGuard();
  const canReadAudit = can(profile?.role, 'audit');
  const { data: activity = [] } = useAdminActivity(canReadAudit);
  const completeTask = useUpdateTaskStatus();
  const createTask = useCreateTask();
  const [draft, setDraft] = useState('');
  const canManageTasks = can(profile?.role, 'tasks');
  return <section className="operations-pulse">
    <div className="operations-panel"><div className="operations-panel-header"><div><p className="workspace-eyebrow">Operations queue</p><h2>Open tasks</h2></div><span className="operations-count">{tasks.length}</span></div>
      {canManageTasks && <form className="operations-task-create" onSubmit={(event) => { event.preventDefault(); if (!draft.trim()) return; createTask.mutate({ title: draft.trim(), description: null, priority: 'medium', due_at: null, booking_id: null }, { onSuccess: () => setDraft('') }); }}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Add a follow-up task"/><button disabled={createTask.isPending} aria-label="Add task"><Plus size={17}/></button></form>}
      {tasksLoading ? <p className="operations-muted">Loading tasks…</p> : tasks.length === 0 ? <div className="operations-empty"><ListTodo size={22}/><p>No open tasks. Your venue team is up to date.</p></div> : <div className="operations-list">{tasks.map((task) => <div className="operations-task" key={task.id}><button disabled={!canManageTasks || completeTask.isPending} onClick={() => completeTask.mutate({ id: task.id, status: 'completed' })} aria-label={`Complete ${task.title}`}><CheckCircle2 size={18}/></button><div><strong>{task.title}</strong><span><Clock3 size={13}/>{task.due_at ? new Date(task.due_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'No due date'} · {task.priority}</span></div></div>)}</div>}</div>
    <div className="operations-panel"><div className="operations-panel-header"><div><p className="workspace-eyebrow">Team history</p><h2>Recent activity</h2></div><ClipboardList size={20}/></div>
      {!canReadAudit ? <div className="operations-empty"><Plus size={22}/><p>Record-level history is shown inside the work you manage.</p></div> : activity.slice(0, 5).length === 0 ? <div className="operations-empty"><Plus size={22}/><p>New workspace actions will show up here.</p></div> : <div className="operations-list">{activity.slice(0, 5).map((entry) => <div className="operations-event" key={entry.id}><span></span><div><strong>{entry.summary}</strong><small>{new Date(entry.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</small></div></div>)}</div>}</div>
  </section>;
}
