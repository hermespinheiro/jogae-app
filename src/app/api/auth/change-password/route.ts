import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/auth/session';

export async function POST(request: Request) {
  if (!await getCurrentSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => null) as { password?: string } | null;
  if (!body?.password || body.password.length < 12) return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
  return NextResponse.json({ ok: true });
}
