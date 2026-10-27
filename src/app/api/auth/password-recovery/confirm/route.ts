import { NextResponse } from 'next/server';
import { createSession } from '@/server/auth/session';
import { confirmPasswordRecovery } from '@/server/application/authentication/password-recovery';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { token?: string; password?: string } | null;
  if (!body?.token || !body.password || body.password.length < 12) return NextResponse.json({ error: 'Invalid recovery request' }, { status: 400 });
  try {
    const userId = await confirmPasswordRecovery(body.token, body.password);
    await createSession(userId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid recovery request' }, { status: 400 });
  }
}
