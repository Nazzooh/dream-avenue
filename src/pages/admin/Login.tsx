import { FormEvent, useEffect, useState } from 'react';
import { Eye, EyeOff, KeyRound, Lock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/auth/useAuth';
import { supabase } from '@/utils/supabase/client';
import '../../styles/admin-login-pastel.css';

const resetUrl = `${window.location.origin}/admin/reset-password`;

export function AdminLogin() {
  const navigate = useNavigate();
  const { session, isAdmin, isLoading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (!isLoading && session?.user && isAdmin) navigate('/admin/dashboard', { replace: true });
  }, [isAdmin, isLoading, navigate, session?.user]);

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = 'Enter your work email address.';
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Enter your password.';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const result = await signIn(email.trim(), password);
      if (!result.user.email_confirmed_at) {
        await supabase.auth.signOut({ scope: 'local' });
        toast.error('Confirm your email before signing in. Ask an administrator to resend the invitation if needed.');
        return;
      }
      toast.success('Access granted. Welcome back.');
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error(error?.message?.includes('Email not confirmed')
        ? 'Confirm your email before signing in.'
        : 'Invalid login credentials or access denied.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestReset = async () => {
    const normalizedEmail = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setFieldErrors((errors) => ({ ...errors, email: 'Enter your work email to reset your password.' }));
      return;
    }
    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, { redirectTo: resetUrl });
      if (error) throw error;
      toast.success('If that address is an admin account, a password-reset link is on its way.');
    } catch {
      toast.error('We could not start a password reset. Please try again shortly.');
    } finally {
      setIsResetting(false);
    }
  };

  return <main className="admin-login-shell">
    <div className="admin-login-atmosphere" aria-hidden="true"><svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice"><g className="admin-login-wire"><path d="M-120 125 1720-40M-120 360 1720 195M-120 595 1720 430M-120 830 1720 665M160-180 445 1180M610-180 895 1180M1060-180 1345 1180" /></g><g className="admin-login-mist admin-login-mist-one"><path d="M-140 500C130 600 205 205 550 280s324 332 664 201 305-314 560-194v370c-284-122-377 283-687 167S826 572 503 685-2 832-140 736Z" /></g><g className="admin-login-mist admin-login-mist-two"><path d="M-90 260C152 388 265 65 506 157s310 347 586 226 336-337 614-135v214c-244-193-383 153-637 223s-362-186-596-213S157 564-90 432Z" /></g><g className="admin-login-mist admin-login-mist-three"><path d="M-155 710c279 80 354-222 621-159s317 305 546 168 336-201 714-54v258c-280-138-436 10-721 66S722 798 485 880 62 1003-155 919Z" /></g></svg></div>
    <section className="admin-login-intro" aria-label="Dream Avenue admin access"><p className="admin-login-kicker">Dream Avenue Event Hall</p><h1>Run every celebration with clarity.</h1><p>Secure staff access for bookings, venue operations, and client care.</p></section>
    <section className="admin-login-panel" aria-label="Admin sign in">
      <div className="admin-login-brand"><span aria-hidden="true">DA</span><div><strong>Dream Avenue</strong><small>Admin workspace</small></div></div>
      <header><p className="admin-login-kicker">Secure access</p><h2>Sign in</h2><p>Use your verified staff account.</p></header>
      <form noValidate onSubmit={handleSubmit} className="admin-login-form">
        <label className="admin-login-field">Work email<input type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setFieldErrors((errors) => ({ ...errors, email: undefined })); }} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'login-email-error' : undefined} placeholder="name@dreamavenue.in" />{fieldErrors.email && <small id="login-email-error" role="alert">{fieldErrors.email}</small>}</label>
        <label className="admin-login-field">Password<span className="admin-login-password-wrap"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setFieldErrors((errors) => ({ ...errors, password: undefined })); }} aria-invalid={Boolean(fieldErrors.password)} aria-describedby={fieldErrors.password ? 'login-password-error' : undefined} placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></span>{fieldErrors.password && <small id="login-password-error" role="alert">{fieldErrors.password}</small>}</label>
        <button className="admin-login-submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : <><Lock size={18}/>Sign in securely</>}</button>
      </form>
      <button className="admin-login-reset" type="button" disabled={isResetting} onClick={requestReset}><KeyRound size={16}/>{isResetting ? 'Sending reset link…' : 'Forgot your password?'}</button>
      <p className="admin-login-assurance"><ShieldCheck size={16}/>Only verified staff accounts can enter this workspace.</p>
    </section>
  </main>;
}
