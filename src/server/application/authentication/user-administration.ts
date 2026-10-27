import { database } from '@/server/infrastructure/database/client';
import { validateEmail, validateUsername } from '@/server/domain/authentication/validation';
import { createOpaqueToken, hashToken } from '@/server/infrastructure/security/token-service';
import { sendMail } from '@/server/infrastructure/email/mailer';
import { getAppUrl } from '@/lib/config/env';

export const roles = ['Administrador', 'Editor', 'Leitor'] as const;
export type ManagedRole = (typeof roles)[number];

export async function listUsers() {
  const { data, error } = await database().from('users').select('id,username,email_normalized,role,status,must_change_password,created_at').order('created_at', { ascending: true });
  if (error) throw new Error('Unable to list users');
  return data ?? [];
}

export async function inviteUser(adminId: string, rawUsername: string, rawEmail: string, role: ManagedRole) {
  const username = validateUsername(rawUsername);
  const email = validateEmail(rawEmail);
  if (!roles.includes(role)) throw new Error('Invalid role');
  const { data: duplicate } = await database().from('users').select('id').or(`email_normalized.eq.${email},username.eq.${username}`).maybeSingle();
  if (duplicate) throw new Error('User already exists');
  const { data: user, error } = await database().from('users').insert({ username, email_normalized: email, role, status: 'invited', must_change_password: true }).select('id').single();
  if (error || !user) throw new Error('Unable to create invitation');
  const token = createOpaqueToken();
  const { error: tokenError } = await database().from('one_time_tokens').insert({ user_id: user.id, email, purpose: 'invitation', token_hash: hashToken(token), expires_at: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString() });
  if (tokenError) throw new Error('Unable to create invitation');
  await sendMail({ to: email, subject: 'Convite para o Jogaê', text: `Você foi convidado para acessar o Jogaê. Use este token no fluxo de ativação: ${token}\n${getAppUrl()}/login` });
  await database().from('audit_log').insert({ actor_user_id: adminId, target_user_id: user.id, event_type: 'user_invited', metadata: { email, role }, occurred_at: new Date().toISOString() });
  return user.id;
}

export async function updateUser(adminId: string, userId: string, changes: { role?: ManagedRole; status?: 'active' | 'disabled' }) {
  if (userId === adminId && changes.status === 'disabled') throw new Error('Cannot disable current administrator');
  if (changes.role && !roles.includes(changes.role)) throw new Error('Invalid role');
  const { error } = await database().from('users').update({ ...changes, updated_at: new Date().toISOString() }).eq('id', userId);
  if (error) throw new Error('Unable to update user');
  if (changes.status === 'disabled') await database().from('sessions').update({ revoked_at: new Date().toISOString() }).eq('user_id', userId).is('revoked_at', null);
  await database().from('audit_log').insert({ actor_user_id: adminId, target_user_id: userId, event_type: 'user_updated', metadata: changes, occurred_at: new Date().toISOString() });
}
