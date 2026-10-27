import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeIdentifier, validateEmail, validatePassword, validateUsername } from '../../src/server/domain/authentication/validation';
import { requireRole, requiresPasswordChange } from '../../src/server/auth/authorization';
import { hashPassword, verifyPassword } from '../../src/server/infrastructure/security/secret-hasher';
import { createOpaqueToken, hashToken } from '../../src/server/infrastructure/security/token-service';

test('normalizes identifiers and accepts valid usernames', () => {
  assert.equal(normalizeIdentifier(' User.Name '), 'user.name');
  assert.equal(validateUsername('User.Name'), 'user.name');
});

test('rejects non-administrator user administration', () => {
  assert.throws(() => requireRole({ id: '1', role: 'Leitor', status: 'active', mustChangePassword: false }, 'Administrador'));
});

test('validates password, email and forced-password state', () => {
  assert.equal(validateEmail(' User@example.com '), 'user@example.com');
  assert.equal(validatePassword('a'.repeat(12)), 'a'.repeat(12));
  assert.equal(requiresPasswordChange({ id: '1', role: 'Administrador', status: 'active', mustChangePassword: true }), true);
  assert.throws(() => validatePassword('short'));
});

test('uses Argon2id and verifies only the original password', async () => {
  const hash = await hashPassword('correct-password');
  assert.match(hash, /^\$argon2id\$/);
  assert.equal(await verifyPassword(hash, 'correct-password'), true);
  assert.equal(await verifyPassword(hash, 'wrong-password'), false);
});

test('stores opaque tokens only as non-reversible hashes', () => {
  const token = createOpaqueToken();
  const hashed = hashToken(token);
  assert.notEqual(token, hashed);
  assert.match(hashed, /^[a-f0-9]{64}$/);
  assert.notEqual(hashToken(createOpaqueToken()), hashed);
});
