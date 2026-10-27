import { readMasterConfig } from '../src/server/infrastructure/authentication/master-config';
import { hashPassword } from '../src/server/infrastructure/security/secret-hasher';
import { database } from '../src/server/infrastructure/database/client';

async function main() {
  const config = readMasterConfig();
  const db = database();
  const { data: existing } = await db.from('users').select('id').eq('email_normalized', config.email.toLowerCase()).maybeSingle();
  if (existing) {
    console.log(JSON.stringify({ created: false, userId: existing.id }));
    return;
  }
  const { data: user, error } = await db.from('users').insert({ username: config.username.toLowerCase(), email_normalized: config.email.toLowerCase(), role: 'Administrador', status: 'active', must_change_password: true }).select('id').single();
  if (error || !user) throw error ?? new Error('Master creation failed');
  const { error: credentialError } = await db.from('password_credentials').insert({ user_id: user.id, password_hash: await hashPassword(config.password) });
  if (credentialError) throw credentialError;
  console.log(JSON.stringify({ created: true, userId: user.id }));
}

main().catch((error) => { console.error('Master bootstrap failed:', error instanceof Error ? error.message : (error?.message || error?.code || 'unknown database error')); process.exitCode = 1; });
