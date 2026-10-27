import { database } from './client';

export async function findUserByIdentifier(identifier: string) {
  const column = identifier.includes('@') ? 'email_normalized' : 'username';
  const { data } = await database().from('users').select('*, password_credentials!inner(password_hash)').eq(column, identifier).maybeSingle();
  if (!data) return null;
  const credentials = Array.isArray(data.password_credentials) ? data.password_credentials[0] : data.password_credentials;
  return { ...data, password_hash: credentials?.password_hash } as { id: string; status: string; password_hash?: string };
}
