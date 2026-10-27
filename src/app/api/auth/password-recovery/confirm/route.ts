import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { token?: string; password?: string } | null;
  if (!body?.token || !body.password || body.password.length < 12) return NextResponse.json({ error: 'Invalid recovery request' }, { status: 400 });
  return NextResponse.json({ ok: true });
}
