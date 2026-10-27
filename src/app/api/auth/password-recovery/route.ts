import { NextResponse } from 'next/server';
import { requestPasswordRecovery } from '@/server/application/authentication/password-recovery';

export async function POST(request: Request) {
  const { email } = await request.json().catch(() => ({}));
  if (typeof email === 'string') {
    try { await requestPasswordRecovery(email); } catch { /* Preserve indistinguishable responses. */ }
  }
  void request;
  return NextResponse.json({ ok: true });
}
