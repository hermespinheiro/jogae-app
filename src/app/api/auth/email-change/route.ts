import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/auth/session';
import { requestEmailChange } from '@/server/application/authentication/email-change';

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { newEmail } = await request.json().catch(() => ({}));
  if (typeof newEmail !== 'string') return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  try {
    const requestId = await requestEmailChange(session.user_id, newEmail);
    return NextResponse.json({ ok: true, requestId, verificationRequired: true });
  } catch {
    return NextResponse.json({ error: 'Unable to request email change' }, { status: 400 });
  }
}
