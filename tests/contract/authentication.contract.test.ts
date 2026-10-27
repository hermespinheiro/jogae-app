import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

test('authentication contract exposes the required operations', () => {
  const routes = [
    'login', 'logout', 'password-recovery', 'password-recovery/confirm',
    'email-change', 'email-change/confirm', 'change-password',
  ];
  for (const route of routes) assert.equal(existsSync(`src/app/api/auth/${route}/route.ts`), true, route);
  assert.equal(routes.length, 7);
});
