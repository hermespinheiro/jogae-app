import { database } from '@/server/infrastructure/database/client';
import { validateEmail, validateVerificationCode } from '@/server/domain/authentication/validation';
import { createOpaqueToken, hashToken } from '@/server/infrastructure/security/token-service';
import { sendMail } from '@/server/infrastructure/email/mailer';
import { auditRow } from '@/server/infrastructure/audit/audit-log-repository';

const CODE_TTL_MS = 1000 * 60 * 15;

export async function requestEmailChange(userId: string, rawEmail: string): Promise<string> {
  const newEmail = validateEmail(rawEmail);
  const { data: existing } = await database().from('users').select('id').eq('email_normalized', newEmail).maybeSingle();
  if (existing) throw new Error('Email already in use');

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const { data: token, error: tokenError } = await database().from('one_time_tokens').insert({
    user_id: userId,
    email: newEmail,
    purpose: 'email_change',
    token_hash: hashToken(code),
    expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(),
  }).select('id').single();
  if (tokenError || !token) throw new Error('Unable to create email change request');

  const { error: requestError } = await database().from('email_change_requests').insert({
    user_id: userId,
    new_email_normalized: newEmail,
    token_id: token.id,
    expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(),
  });
  if (requestError) throw new Error('Unable to create email change request');

  await sendMail({ to: newEmail, subject: 'Confirmação de alteração de email', text: `Seu código de confirmação é ${code}. Ele expira em 15 minutos.` });
  await database().from('audit_log').insert(auditRow({ actorProfileId: userId, targetProfileId: userId, eventType: 'email_change_requested', metadata: { newEmail } }));
  return token.id;
}

export async function confirmEmailChange(userId: string, requestId: string, rawCode: string): Promise<void> {
  const code = validateVerificationCode(rawCode);
  const { data: request } = await database().from('email_change_requests').select('id,new_email_normalized,expires_at,verified_at,cancelled_at,token_id').eq('id', requestId).eq('user_id', userId).maybeSingle();
  if (!request || request.verified_at || request.cancelled_at || new Date(request.expires_at) <= new Date()) throw new Error('Invalid email change request');
  const { data: token } = await database().from('one_time_tokens').select('id,expires_at,used_at,revoked_at').eq('id', request.token_id).eq('token_hash', hashToken(code)).maybeSingle();
  if (!token || token.used_at || token.revoked_at || new Date(token.expires_at) <= new Date()) throw new Error('Invalid email change code');
  const { data: existing } = await database().from('users').select('id').eq('email_normalized', request.new_email_normalized).neq('id', userId).maybeSingle();
  if (existing) throw new Error('Email already in use');
  const now = new Date().toISOString();
  const { error } = await database().from('users').update({ email_normalized: request.new_email_normalized, email_verified_at: now, updated_at: now }).eq('id', userId);
  if (error) throw new Error('Unable to change email');
  await database().from('one_time_tokens').update({ used_at: now }).eq('id', token.id);
  await database().from('email_change_requests').update({ verified_at: now }).eq('id', request.id);
  await database().from('audit_log').insert(auditRow({ actorProfileId: userId, targetProfileId: userId, eventType: 'email_changed', metadata: { email: request.new_email_normalized } }));
}
