export type AuditEvent = { actorProfileId?: string; targetProfileId?: string; eventType: string; metadata?: Record<string, unknown> };

const forbidden = /password|secret|token|code/i;
export function sanitizeAuditMetadata(metadata: Record<string, unknown> = {}) {
  return Object.fromEntries(Object.entries(metadata).filter(([key]) => !forbidden.test(key)));
}

export function auditRow(event: AuditEvent) {
  return { actor_profile_id: event.actorProfileId ?? null, target_profile_id: event.targetProfileId ?? null, event_type: event.eventType, metadata: sanitizeAuditMetadata(event.metadata), occurred_at: new Date().toISOString() };
}

export async function writeAuditEvent(event: AuditEvent) {
  const { createSupabaseAdminClient } = await import('../supabase/admin');
  const { error } = await createSupabaseAdminClient().from('audit_log').insert(auditRow(event));
  if (error) throw new Error('Could not write audit event');
}
