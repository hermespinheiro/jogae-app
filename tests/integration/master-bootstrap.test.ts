import assert from 'node:assert/strict';
import test from 'node:test';
import { bootstrapMaster } from '../../src/server/application/authentication/master-bootstrap';
import { readMasterConfig } from '../../src/server/infrastructure/authentication/master-config';

test('master bootstrap is idempotent', async () => {
  let exists = false;
  const port = { findByEmail: async () => exists ? { id: 'master' } : null, createMaster: async () => { exists = true; return { id: 'master' }; } };
  const config = { username: 'master', email: 'master@example.com', password: 'secret-password' };
  assert.equal((await bootstrapMaster(port, config)).created, true);
  assert.equal((await bootstrapMaster(port, config)).created, false);
});

test('master bootstrap rejects missing or weak configuration', () => {
  assert.throws(() => readMasterConfig({ AUTH_MASTER_USERNAME: 'master', AUTH_MASTER_EMAIL: 'master@example.com' }), /incomplete/i);
  assert.throws(() => readMasterConfig({ AUTH_MASTER_USERNAME: 'master', AUTH_MASTER_EMAIL: 'master@example.com', AUTH_MASTER_PASSWORD: 'short' }), /Invalid password/i);
});
