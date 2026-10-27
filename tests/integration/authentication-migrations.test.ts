import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('authentication migrations are present and ordered', () => {
  const first = readFileSync('supabase/migrations/001_authentication.sql', 'utf8');
  const second = readFileSync('supabase/migrations/002_authentication_rls.sql', 'utf8');
  assert.match(first, /create table if not exists public\.profiles/);
  assert.match(second, /enable row level security/);
});
