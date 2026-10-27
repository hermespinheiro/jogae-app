import { createSupabaseAdminClient } from '../supabase/admin';
export function database() { return createSupabaseAdminClient(); }

export type SessionContext = { userId: string; role: string; sessionId: string };

/**
 * Application boundary for transaction context. The direct PostgreSQL adapter must implement
 * these values with SET LOCAL before executing protected queries; the server never accepts them
 * from request bodies.
 */
export async function withSessionContext<T>(_context: SessionContext, operation: () => Promise<T>): Promise<T> {
  return operation();
}
