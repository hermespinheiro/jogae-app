import assert from 'node:assert/strict';
import test from 'node:test';
import { bootstrapMaster } from '../../src/server/application/authentication/master-bootstrap';

test('master bootstrap is idempotent', async () => {
  let exists = false;
  const port = { findByEmail: async () => exists ? { id: 'master' } : null, createMaster: async () => { exists = true; return { id: 'master' }; } };
  const config = { username: 'master', email: 'master@example.com', password: 'secret' };
  assert.equal((await bootstrapMaster(port, config)).created, true);
  assert.equal((await bootstrapMaster(port, config)).created, false);
});
