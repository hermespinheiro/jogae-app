const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'] as const;
export function getPublicEnv(env: NodeJS.ProcessEnv = process.env) {
  for (const key of required) if (!env[key]) throw new Error(`Missing environment variable: ${key}`);
  return { url: env.NEXT_PUBLIC_SUPABASE_URL!, anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY! };
}

export type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
  encryption: 'tls' | 'ssl' | 'none';
};

export function getSmtpConfig(env: NodeJS.ProcessEnv = process.env): SmtpConfig {
  const host = env.EMAIL_HOST?.trim();
  const user = env.EMAIL_USER?.trim();
  const password = env.EMAIL_PASSWORD;
  const from = env.EMAIL_FROM?.trim();
  const port = Number(env.EMAIL_PORT ?? 587);
  const encryption = (env.EMAIL_ENCRYPTION ?? 'tls').trim().toLowerCase();
  if (!host || !user || !password || !from || !Number.isInteger(port) || port < 1 || port > 65535) throw new Error('SMTP configuration is incomplete');
  if (encryption !== 'tls' && encryption !== 'ssl' && encryption !== 'none') throw new Error('SMTP encryption is invalid');
  return { host, port, user, password, from, encryption };
}

export function getDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  const value = env.DATABASE_URL?.trim();
  if (!value) throw new Error('DATABASE_URL is not configured');
  return value;
}

export function getAppUrl(env: NodeJS.ProcessEnv = process.env): string {
  const value = env.APP_URL?.trim();
  if (!value) throw new Error('APP_URL is not configured');
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    return url.toString().replace(/\/$/, '');
  } catch {
    throw new Error('APP_URL is invalid');
  }
}
