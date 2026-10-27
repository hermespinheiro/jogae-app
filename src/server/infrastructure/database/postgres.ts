import postgres, { type Sql } from 'postgres';
import { getDatabaseUrl } from '@/lib/config/env';

let client: Sql | undefined;

export function sql(): Sql {
  client ??= postgres(getDatabaseUrl(), { max: 10, idle_timeout: 20, prepare: false });
  return client;
}

export type SessionContext = { userId: string; role: string; sessionId: string };

export async function withTransaction<T>(context: SessionContext, operation: (tx: Sql) => Promise<T>): Promise<T> {
  return sql().begin(async (tx) => {
    await tx`select set_config('app.user_id', ${context.userId}, true)`;
    await tx`select set_config('app.role', ${context.role}, true)`;
    await tx`select set_config('app.session_id', ${context.sessionId}, true)`;
    return operation(tx as unknown as Sql);
  }) as Promise<T>;
}
