import { database } from '@/server/infrastructure/database/client';
import { validateEmail, validatePassword } from '@/server/domain/authentication/validation';
import { createOpaqueToken, hashToken } from '@/server/infrastructure/security/token-service';
import { sendMail } from '@/server/infrastructure/email/mailer';
import { getAppUrl } from '@/lib/config/env';

const RECOVERY_TTL_MS = 1000 * 60 * 30;

export async function requestPasswordRecovery(rawEmail: string): Promise<void> {
  const email = validateEmail(rawEmail);
  const { data: user } = await database()
    .from('users')
    .select('id,email_normalized,status')
    .eq('email_normalized', email)
    .maybeSingle();

  if (!user || user.status !== 'active') return;

  const token = createOpaqueToken();
  const { error } = await database().from('one_time_tokens').insert({
    user_id: user.id,
    email,
    purpose: 'password_reset',
    token_hash: hashToken(token),
    expires_at: new Date(Date.now() + RECOVERY_TTL_MS).toISOString(),
  });
  if (error) throw new Error('Unable to create recovery token');

  const recoveryUrl = `${getAppUrl()}/reset-password?token=${encodeURIComponent(token)}`;

  await sendMail({
    to: email,
    subject: 'Recuperação de senha',
    text: `Recebemos uma solicitação para redefinir sua senha.\n\nAcesse o link abaixo para continuar:\n${recoveryUrl}\n\nEste link expira em 30 minutos e pode ser usado uma única vez. Se você não solicitou a recuperação, ignore esta mensagem.`,
  });
}

export async function confirmPasswordRecovery(token: string, rawPassword: string): Promise<string> {
  const password = validatePassword(rawPassword);
  const tokenHash = hashToken(token);
  const { data: recovery } = await database()
    .from('one_time_tokens')
    .select('id,user_id,expires_at,used_at,revoked_at')
    .eq('token_hash', tokenHash)
    .eq('purpose', 'password_reset')
    .maybeSingle();

  if (!recovery || recovery.used_at || recovery.revoked_at || new Date(recovery.expires_at) <= new Date()) {
    throw new Error('Invalid recovery token');
  }

  const { hashPassword } = await import('@/server/infrastructure/security/secret-hasher');
  const now = new Date().toISOString();
  const { error: credentialError } = await database().from('password_credentials').upsert({
    user_id: recovery.user_id,
    password_hash: await hashPassword(password),
    password_changed_at: now,
    failed_attempts: 0,
    locked_until: null,
    updated_at: now,
  });
  if (credentialError) throw new Error('Unable to reset password');

  await database().from('users').update({ must_change_password: false, updated_at: now }).eq('id', recovery.user_id);
  await database().from('sessions').update({ revoked_at: now }).eq('user_id', recovery.user_id).is('revoked_at', null);
  const { error: tokenError } = await database().from('one_time_tokens').update({ used_at: now }).eq('id', recovery.id).is('used_at', null).is('revoked_at', null);
  if (tokenError) throw new Error('Unable to consume recovery token');
  return recovery.user_id;
}
