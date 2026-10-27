'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Alert, Button, FormField, Input, LoadingState } from '@/components/ui';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/password-recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error();
      setSent(true);
    } catch {
      setError('Não foi possível processar a solicitação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="forgot-title">
        <p className="eyebrow">Recuperação de acesso</p>
        <h1 id="forgot-title">Recuperar senha</h1>
        <p className="auth-subtitle">Informe seu e-mail para receber as instruções.</p>
        {sent ? (
          <div className="auth-form">
            <p role="status">Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.</p>
            <Link href="/login">Voltar para o login</Link>
          </div>
        ) : (
          <form className="auth-form" onSubmit={submit}>
            {error && <Alert>{error}</Alert>}
            <FormField label="E-mail">
              <Input id="recovery-email" name="email" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </FormField>
            <Button type="submit" disabled={loading}>
              {loading ? <LoadingState /> : 'Enviar instruções'}
            </Button>
            <Link href="/login">Voltar para o login</Link>
          </form>
        )}
      </section>
    </main>
  );
}
