import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/auth/session';
import { confirmEmailChange } from '@/server/application/authentication/email-change';

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => null) as { requestId?: string; code?: string } | null;
  if (!body?.requestId || !body.code) return NextResponse.json({ error: 'Invalid confirmation' }, { status: 400 });
  try {
    await confirmEmailChange(session.user_id, body.requestId, body.code);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid confirmation' }, { status: 400 });
  }
}
