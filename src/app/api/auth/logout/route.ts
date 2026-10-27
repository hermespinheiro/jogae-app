import { NextResponse } from 'next/server';
import { revokeCurrentSession } from '@/server/auth/session';

export async function POST() {
  await revokeCurrentSession();
  return new NextResponse(null, { status: 204 });
}
