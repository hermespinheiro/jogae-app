import { NextResponse } from 'next/server';
import { normalizeIdentifier } from '@/server/domain/authentication/validation';
import { findUserByIdentifier } from '@/server/infrastructure/database/user-repository';
import { createSession } from '@/server/auth/session';
import { verifyPassword } from '@/server/infrastructure/security/secret-hasher';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { identifier?: string; password?: string } | null;
  if (!body?.identifier || !body.password) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const identifier = normalizeIdentifier(body.identifier);
  const user = await findUserByIdentifier(identifier);
  if (!user || user.status !== 'active' || !user.password_hash || !(await verifyPassword(user.password_hash, body.password))) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
