import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeIdentifier, validateUsername } from '../../src/server/domain/authentication/validation';
import { requireRole } from '../../src/server/auth/authorization';

test('normalizes identifiers and accepts valid usernames', () => {
  assert.equal(normalizeIdentifier(' User.Name '), 'user.name');
  assert.equal(validateUsername('User.Name'), 'user.name');
});

test('rejects non-administrator user administration', () => {
  assert.throws(() => requireRole({ id: '1', role: 'Leitor', status: 'active', mustChangePassword: false }, 'Administrador'));
});
