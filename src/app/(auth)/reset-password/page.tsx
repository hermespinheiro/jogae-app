'use client';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, FormField, Input, LoadingState } from '@/components/ui';

export default function ResetPasswordPage() {
  const router = useRouter(); const [token, setToken] = useState(''); const [password, setPassword] = useState(''); const [confirmation, setConfirmation] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  useEffect(() => { setToken(new URLSearchParams(window.location.search).get('token') ?? ''); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(''); if (!token) { setError('Token inválido ou ausente.'); return; } if (password !== confirmation) { setError('As senhas não conferem.'); return; } setLoading(true); try { const response = await fetch('/api/auth/password-recovery/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) }); if (!response.ok) throw new Error('Token inválido ou expirado.'); router.push('/'); router.refresh(); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível redefinir a senha.'); } finally { setLoading(false); } }
  return <main className="auth-shell"><section className="auth-card" aria-labelledby="reset-title"><p className="eyebrow">Recuperação de acesso</p><h1 id="reset-title">Redefinir senha</h1><p className="auth-subtitle">Defina uma nova senha com pelo menos 12 caracteres.</p><form className="auth-form" onSubmit={submit}>{error && <Alert>{error}</Alert>}<FormField label="Nova senha"><Input required minLength={12} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></FormField><FormField label="Confirme a nova senha"><Input required minLength={12} type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></FormField><Button type="submit" disabled={loading}>{loading ? <LoadingState /> : 'Redefinir senha'}</Button></form></section></main>;
}
