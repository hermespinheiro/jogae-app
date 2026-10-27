import test from 'node:test';
import assert from 'node:assert/strict';
import { readMasterConfig } from '../../src/server/infrastructure/authentication/master-config';

test('master configuration is read from environment', () => {
  const config = readMasterConfig({ AUTH_MASTER_USERNAME: 'master', AUTH_MASTER_EMAIL: 'master@example.com', AUTH_MASTER_PASSWORD: 'local-only' });
  assert.equal(config.username, 'master');
  assert.equal(config.email, 'master@example.com');
  assert.equal(config.password, 'local-only');
});
