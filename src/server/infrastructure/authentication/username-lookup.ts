import { createSupabaseAdminClient } from '../supabase/admin';
import { normalizeIdentifier } from '../../domain/authentication/validation';

export async function findEmailByUsername(username: string): Promise<string | null> {
  const client = createSupabaseAdminClient();
  const { data } = await client.from('profiles').select('email_normalized').eq('username', normalizeIdentifier(username)).eq('status', 'active').maybeSingle();
  return data?.email_normalized ?? null;
}
