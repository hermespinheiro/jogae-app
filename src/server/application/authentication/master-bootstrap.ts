import type { MasterConfig } from '../../infrastructure/authentication/master-config';

export type BootstrapResult = { created: boolean; userId: string };
export type MasterBootstrapPort = {
  findByEmail(email: string): Promise<{ id: string } | null>;
  createMaster(config: MasterConfig): Promise<{ id: string }>;
};

export async function bootstrapMaster(port: MasterBootstrapPort, config: MasterConfig): Promise<BootstrapResult> {
  const existing = await port.findByEmail(config.email);
  if (existing) return { created: false, userId: existing.id };
  const created = await port.createMaster(config);
  return { created: true, userId: created.id };
}
