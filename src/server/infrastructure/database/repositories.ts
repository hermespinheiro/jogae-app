import { sql, withTransaction, type SessionContext } from './postgres';
import type { Sql } from 'postgres';

export async function findUserByEmail(email: string) {
  const rows = await sql()`select * from public.users where email_normalized = ${email} limit 1`;
  return rows[0] ?? null;
}

export async function findUserCredentials(userId: string) {
  const rows = await sql()`select * from public.password_credentials where user_id = ${userId} limit 1`;
  return rows[0] ?? null;
}

export async function createSessionRecord(userId: string, tokenHash: string, expiresAt: Date) {
  const rows = await sql()`insert into public.sessions (user_id, token_hash, expires_at) values (${userId}, ${tokenHash}, ${expiresAt}) returning id`;
  return rows[0];
}

export async function revokeSessionRecord(tokenHash: string) {
  await sql()`update public.sessions set revoked_at = now() where token_hash = ${tokenHash} and revoked_at is null`;
}

export async function withRlsContext<T>(context: SessionContext, operation: (tx: Sql) => Promise<T>) {
  return withTransaction(context, operation);
}
