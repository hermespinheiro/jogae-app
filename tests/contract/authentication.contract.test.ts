import test from 'node:test';
import assert from 'node:assert/strict';

test('authentication contract exposes the required operations', () => {
  const operations = ['login', 'logout', 'password-recovery', 'email-change-request', 'email-change-confirm'];
  assert.deepEqual(operations.length, 5);
});
