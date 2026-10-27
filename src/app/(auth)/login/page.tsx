'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Button, FormField, Input, LoadingState } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        setError('Não foi possível entrar. Verifique seus dados e tente novamente.');
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Não foi possível conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell"><section className="auth-card" aria-labelledby="login-title">
      <p className="eyebrow">Jogaê</p><h1 id="login-title">Entrar</h1>
      <p className="auth-subtitle">Use seu email ou username e senha.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <FormField label="Email ou username"><Input
          id="identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          required
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
        /></FormField>
        <FormField label="Senha"><Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        /></FormField>
        {error && <Alert>{error}</Alert>}
        <Button type="submit" disabled={loading}>{loading ? <LoadingState /> : 'Entrar'}</Button>
      </form>
      <Link href="/forgot-password">Esqueci minha senha</Link>
    </section></main>
  );
}
