import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/auth/session';

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { newEmail } = await request.json().catch(() => ({}));
  if (typeof newEmail !== 'string') return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  return NextResponse.json({ ok: true, verificationRequired: true });
}
