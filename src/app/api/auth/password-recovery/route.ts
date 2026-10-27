import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json().catch(() => ({}));
  if (typeof email !== 'string') return NextResponse.json({ ok: true });
  // Token creation and email delivery belong to the application-owned recovery service.
  void request;
  return NextResponse.json({ ok: true });
}
