import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/auth/session';
import { listUsers, inviteUser, updateUser, type ManagedRole } from '@/server/application/authentication/user-administration';

async function adminSession() {
  const session = await getCurrentSession();
  const user = session && (Array.isArray(session.users) ? session.users[0] : session.users);
  return session && user?.status === 'active' && user.role === 'Administrador' ? session : null;
}

export async function GET() {
  if (!(await adminSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  try { return NextResponse.json({ users: await listUsers() }); } catch { return NextResponse.json({ error: 'Unable to list users' }, { status: 500 }); }
}

export async function POST(request: Request) {
  const session = await adminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const body = await request.json().catch(() => null) as { username?: string; email?: string; role?: ManagedRole } | null;
  if (!body?.username || !body.email || !body.role) return NextResponse.json({ error: 'Invalid invitation' }, { status: 400 });
  try { const id = await inviteUser(session.user_id, body.username, body.email, body.role); return NextResponse.json({ ok: true, userId: id }, { status: 201 }); } catch { return NextResponse.json({ error: 'Unable to create invitation' }, { status: 400 }); }
}

export async function PATCH(request: Request) {
  const session = await adminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const body = await request.json().catch(() => null) as { userId?: string; role?: ManagedRole; status?: 'active' | 'disabled' } | null;
  if (!body?.userId || (!body.role && !body.status)) return NextResponse.json({ error: 'Invalid update' }, { status: 400 });
  try { await updateUser(session.user_id, body.userId, { role: body.role, status: body.status }); return NextResponse.json({ ok: true }); } catch { return NextResponse.json({ error: 'Unable to update user' }, { status: 400 }); }
}
