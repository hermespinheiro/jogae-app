export type MasterConfig = { username: string; email: string; password: string };

export function readMasterConfig(env: NodeJS.ProcessEnv = process.env): MasterConfig {
  const username = env.AUTH_MASTER_USERNAME?.trim();
  const email = env.AUTH_MASTER_EMAIL?.trim();
  const password = env.AUTH_MASTER_PASSWORD;
  if (!username || !email || !password) throw new Error('Master authentication configuration is incomplete');
  return { username, email, password };
}
