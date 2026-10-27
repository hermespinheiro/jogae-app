import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('RLS migration requires server-provided session context', () => {
  const migration = readFileSync('supabase/migrations/004_application_authentication_rls.sql', 'utf8');
  assert.match(migration, /app_user_id/);
  assert.match(migration, /app_role/);
  assert.match(migration, /app_session_id/);
  assert.match(migration, /enable row level security/i);
});
