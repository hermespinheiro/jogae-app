import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('session cookie uses secure server-managed attributes', () => {
  const source = readFileSync('src/server/auth/session.ts', 'utf8');
  assert.match(source, /httpOnly:\s*true/);
  assert.match(source, /sameSite:\s*'lax'/);
  assert.match(source, /secure:\s*process\.env\.NODE_ENV === 'production'/);
});

test('session rotation revokes existing sessions during password reset', () => {
  const source = readFileSync('src/server/application/authentication/password-recovery.ts', 'utf8');
  assert.match(source, /sessions.*update/);
  assert.match(source, /used_at/);
});

test('middleware rejects cross-origin mutating requests', () => {
  const source = readFileSync('src/middleware.ts', 'utf8');
  assert.match(source, /request\.headers\.get\('origin'\)/);
  assert.match(source, /origin !== request\.nextUrl\.origin/);
  assert.match(source, /status: 403/);
});
