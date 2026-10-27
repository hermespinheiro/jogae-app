import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/auth/session';
import { createSession } from '@/server/auth/session';
import { completeForcedPasswordChange } from '@/server/application/authentication/forced-password-change';

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => null) as { password?: string } | null;
  if (!body?.password || body.password.length < 12) return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
  if (body.password !== (body as { passwordConfirmation?: string }).passwordConfirmation) {
    return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
  }
  try {
    await completeForcedPasswordChange(session.user_id, body.password);
    await createSession(session.user_id);
  } catch {
    return NextResponse.json({ error: 'Unable to change password' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
