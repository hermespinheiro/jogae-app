import test from 'node:test';
import assert from 'node:assert/strict';
import { login } from '../../src/server/application/authentication/login';

test('login resolves username before authenticating', async () => {
  const calls: string[] = [];
  const result = await login({
    findEmailByUsername: async (username) => { calls.push(`lookup:${username}`); return 'user@example.com'; },
    signIn: async (email) => { calls.push(`signin:${email}`); return { userId: 'user-1' }; },
  }, 'user-name', 'password');
  assert.equal(result?.userId, 'user-1');
  assert.deepEqual(calls, ['lookup:user-name', 'signin:user@example.com']);
});
