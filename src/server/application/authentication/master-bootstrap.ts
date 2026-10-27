import type { MasterConfig } from '../../infrastructure/authentication/master-config';
import { validateEmail, validatePassword, validateUsername } from '@/server/domain/authentication/validation';

export type BootstrapResult = { created: boolean; userId: string };
export type MasterBootstrapPort = {
  findByEmail(email: string): Promise<{ id: string } | null>;
  createMaster(config: MasterConfig): Promise<{ id: string }>;
};

export async function bootstrapMaster(port: MasterBootstrapPort, config: MasterConfig): Promise<BootstrapResult> {
  const normalized = { ...config, username: validateUsername(config.username), email: validateEmail(config.email), password: validatePassword(config.password) };
  const existing = await port.findByEmail(normalized.email);
  if (existing) return { created: false, userId: existing.id };
  const created = await port.createMaster(normalized);
  return { created: true, userId: created.id };
}
