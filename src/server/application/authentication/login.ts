import { verifyPassword } from '../../infrastructure/security/secret-hasher';
import type { AuditEvent } from '../../infrastructure/audit/audit-log-repository';

export type LoginPort = {
  findByIdentifier(identifier: string): Promise<{ id: string; passwordHash: string; status: string } | null>;
  createSession(userId: string): Promise<void>;
};

const failures = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

export async function login(port: LoginPort, identifier: string, password: string, audit?: (event: AuditEvent) => Promise<void>) {
  const key = identifier.trim().toLowerCase();
  const now = Date.now();
  const current = failures.get(key);
  if (current && current.resetAt > now && current.count >= MAX_FAILURES) return null;
  if (current && current.resetAt <= now) failures.delete(key);
  const user = await port.findByIdentifier(key);
  if (!user || user.status !== 'active' || !(await verifyPassword(user.passwordHash, password))) {
    const previous = failures.get(key);
    failures.set(key, { count: (previous?.count ?? 0) + 1, resetAt: previous?.resetAt ?? now + WINDOW_MS });
    if (audit) await audit({ eventType: 'login_failure', metadata: { identifier_type: key.includes('@') ? 'email' : 'username' } });
    return null;
  }
  await port.createSession(user.id);
  failures.delete(key);
  if (audit) await audit({ actorProfileId: user.id, eventType: 'login_success' });
  return { userId: user.id };
}
