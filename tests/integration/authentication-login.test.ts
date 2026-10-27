import test from 'node:test';
import assert from 'node:assert/strict';
import { login } from '../../src/server/application/authentication/login';
import { hashPassword } from '../../src/server/infrastructure/security/secret-hasher';

test('login resolves username before authenticating', async () => {
  const calls: string[] = [];
  const result = await login({
    findByIdentifier: async (identifier) => { calls.push(`lookup:${identifier}`); return { id: 'user-1', passwordHash: 'not-a-valid-hash', status: 'active' }; },
    createSession: async (userId) => { calls.push(`session:${userId}`); },
  }, 'user-name', 'password');
  assert.equal(result, null);
  assert.deepEqual(calls, ['lookup:user-name']);
});

test('login creates a session for valid active credentials', async () => {
  const passwordHash = await hashPassword('valid-password');
  let sessionUser = '';
  const result = await login({
    findByIdentifier: async () => ({ id: 'user-1', passwordHash, status: 'active' }),
    createSession: async (userId) => { sessionUser = userId; },
  }, 'user@example.com', 'valid-password');
  assert.deepEqual(result, { userId: 'user-1' });
  assert.equal(sessionUser, 'user-1');
});

test('login rejects disabled users and rate-limits repeated failures', async () => {
  const disabled = await login({ findByIdentifier: async () => ({ id: 'disabled', passwordHash: 'invalid', status: 'disabled' }), createSession: async () => {} }, 'disabled@example.com', 'password');
  assert.equal(disabled, null);
  const port = { findByIdentifier: async () => ({ id: 'user-1', passwordHash: 'invalid', status: 'active' }), createSession: async () => {} };
  for (let attempt = 0; attempt < 6; attempt++) assert.equal(await login(port, 'limited@example.com', 'wrong'), null);
});
