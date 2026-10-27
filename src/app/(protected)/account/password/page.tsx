'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, FormField, Input, LoadingState } from '@/components/ui';

export default function PasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, passwordConfirmation: confirmation }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(body?.error || 'Não foi possível alterar a senha.');
      }
      router.push('/');
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível alterar a senha.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="password-title">
        <p className="eyebrow">Segurança da conta</p>
        <h1 id="password-title">Defina sua nova senha</h1>
        <p className="auth-subtitle">Por segurança, altere a senha provisória antes de continuar.</p>
        <form className="auth-form" onSubmit={submit}>
          {error && <Alert>{error}</Alert>}
          <FormField label="Nova senha">
            <Input required minLength={12} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </FormField>
          <FormField label="Confirme a nova senha">
            <Input required minLength={12} type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
          </FormField>
          <Button type="submit" disabled={loading}>{loading ? <LoadingState /> : 'Salvar nova senha'}</Button>
        </form>
      </section>
    </main>
  );
}
