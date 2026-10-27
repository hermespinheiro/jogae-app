import { cookies } from 'next/headers';
import { database } from '../infrastructure/database/client';
import { createOpaqueToken, hashToken } from '../infrastructure/security/token-service';

export const SESSION_COOKIE = 'jogae_session';

export async function createSession(userId: string) {
  const token = createOpaqueToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
  const { error } = await database().from('sessions').insert({ user_id: userId, token_hash: hashToken(token), expires_at: expiresAt });
  if (error) throw new Error('Could not create session');
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', expires: new Date(expiresAt) });
}

export async function revokeCurrentSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) await database().from('sessions').update({ revoked_at: new Date().toISOString() }).eq('token_hash', hashToken(token)).is('revoked_at', null);
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getCurrentSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const { data } = await database().from('sessions').select('id,user_id,expires_at,revoked_at,users(status,must_change_password,role)').eq('token_hash', hashToken(token)).maybeSingle();
  if (!data || data.revoked_at || new Date(data.expires_at) <= new Date()) return null;
  return data;
}
