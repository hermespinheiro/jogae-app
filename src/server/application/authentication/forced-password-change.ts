import { database } from '@/server/infrastructure/database/client';
import { hashPassword } from '@/server/infrastructure/security/secret-hasher';

export async function completeForcedPasswordChange(userId: string, password: string) {
  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();

  const { error: credentialError } = await database()
    .from('password_credentials')
    .upsert({
      user_id: userId,
      password_hash: passwordHash,
      password_changed_at: now,
      failed_attempts: 0,
      locked_until: null,
      updated_at: now,
    });
  if (credentialError) throw new Error('Unable to change password');

  const { error: userError } = await database()
    .from('users')
    .update({ must_change_password: false, updated_at: now })
    .eq('id', userId);
  if (userError) throw new Error('Unable to change password');

  await database()
    .from('sessions')
    .update({ revoked_at: now })
    .eq('user_id', userId)
    .is('revoked_at', null);
}
