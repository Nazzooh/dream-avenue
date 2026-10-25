import { useEffect, useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const routes: Record<string, string> = { b: '/admin/bookings', a: '/admin/analytics', p: '/admin/packages', f: '/admin/facilities', d: '/admin/dashboard', t: '/admin/tasks' };
const isBlockedTarget = (target: EventTarget | null) => {
  const node = target as HTMLElement | null;
  return !node || ['INPUT', 'TEXTAREA', 'SELECT'].includes(node.tagName) || node.isContentEditable || !!node.closest('[role="dialog"], [role="listbox"], [data-radix-popper-content-wrapper]');
};

export function AdminShortcuts() {
  const navigate = useNavigate(); const location = useLocation();
  const [open, setOpen] = useState(false); const [prefix, setPrefix] = useState<string | null>(null);
  useEffect(() => {
    let timer: number | undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || isBlockedTarget(event.target)) return;
      if (event.key === '?' || (event.key === '/' && event.shiftKey)) { event.preventDefault(); setOpen(true); return; }
      const key = event.key.toLowerCase();
      if (!prefix && ['g', 'n', 'a'].includes(key)) { setPrefix(key); timer = window.setTimeout(() => setPrefix(null), 1100); return; }
      if (!prefix) return;
      window.clearTimeout(timer); const command = prefix; setPrefix(null);
      if (command === 'g' && routes[key]) { event.preventDefault(); navigate(routes[key]); return; }
      const target = command === 'n' ? (key === 'p' ? 'new-package' : key === 'f' ? 'new-facility' : key === 't' ? 'new-task' : key === 'r' ? 'new-referral' : '') : (key === 'r' ? 'refresh' : key === 'e' ? 'export' : key === 's' ? 'search' : '');
      if (target) { event.preventDefault(); const element = document.querySelector<HTMLElement>(`[data-admin-shortcut="${target}"]`); element?.click(); if (target === 'search') document.querySelector<HTMLInputElement>('[data-admin-search]')?.focus(); }
    };
    window.addEventListener('keydown', onKeyDown); return () => { window.removeEventListener('keydown', onKeyDown); if (timer) window.clearTimeout(timer); };
  }, [navigate, prefix, location.pathname]);
  return <><button className="admin-shortcut-help" type="button" onClick={() => setOpen(true)} aria-label="Open keyboard shortcuts"><Keyboard size={18}/><span>Shortcuts</span></button>{open && <div className="admin-shortcut-backdrop" onMouseDown={() => setOpen(false)}><section className="admin-shortcut-guide" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts" onMouseDown={(event) => event.stopPropagation()}><header><div><p className="workspace-eyebrow">Keyboard shortcuts</p><h2>Move without touching the mouse</h2></div><button onClick={() => setOpen(false)} aria-label="Close shortcut guide"><X size={19}/></button></header><p>Shortcuts never run while typing, using a menu, or working inside a drawer or dialog.</p><div className="admin-shortcut-grid"><Shortcut keys="G · B" label="Go to Bookings"/><Shortcut keys="G · A" label="Go to Analytics"/><Shortcut keys="G · P" label="Go to Packages"/><Shortcut keys="G · F" label="Go to Facilities"/><Shortcut keys="N · P/F/T/R" label="New package, facility, task, or referral"/><Shortcut keys="A · R/E/S" label="Refresh, export, or focus search"/></div></section></div>}</>;
}
function Shortcut({ keys, label }: { keys: string; label: string }) { return <div><kbd>{keys}</kbd><span>{label}</span></div>; }
