import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/utils/supabase/client';

export function AdminResetPassword() {
  const navigate = useNavigate();
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => { if (event === 'PASSWORD_RECOVERY') setRecoveryReady(true); });
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) setRecoveryReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 12) return toast.error('Use at least 12 characters for your new password.');
    if (password !== confirmPassword) return toast.error('The password confirmation does not match.');
    setSaving(true);
    try { const { error } = await supabase.auth.updateUser({ password }); if (error) throw error; toast.success('Password updated. You can now sign in.'); await supabase.auth.signOut({ scope: 'local' }); navigate('/admin/login', { replace: true }); } catch { toast.error('The reset link is invalid or has expired. Request a new one from the login page.'); } finally { setSaving(false); }
  };

  return <main className="admin-login-shell"><section className="admin-login-intro"><p className="admin-login-kicker">Dream Avenue Event Hall</p><h1>Restore secure access.</h1><p>Your new password protects booking records and internal operations.</p></section><section className="admin-login-panel"><div className="admin-login-brand"><span>DA</span><div><strong>Dream Avenue</strong><small>Admin workspace</small></div></div><header><p className="admin-login-kicker">Password recovery</p><h2>Create a new password</h2><p>{recoveryReady ? 'Choose a long, unique password for your staff account.' : 'Open this page from the password-reset email to continue.'}</p></header>{recoveryReady ? <form className="admin-login-form" onSubmit={submit}><label className="admin-login-field">New password<input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 12 characters" /></label><label className="admin-login-field">Confirm new password<input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your password" /></label><button className="admin-login-submit" disabled={saving}>{saving ? 'Updating password…' : <><CheckCircle2 size={18}/>Update password</>}</button></form> : <Link className="admin-login-submit" to="/admin/login"><Lock size={18}/>Return to sign in</Link>}<p className="admin-login-assurance"><ShieldCheck size={16}/>Password-reset links are single-use and time-limited.</p></section></main>;
}
