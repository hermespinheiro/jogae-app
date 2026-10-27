import assert from 'node:assert/strict';
import test from 'node:test';
import { sanitizeAuditMetadata } from '../../src/server/infrastructure/audit/audit-log-repository';

test('audit metadata removes secrets', () => {
  assert.deepEqual(sanitizeAuditMetadata({ email: 'a@b.com', password: 'secret', code: '123' }), { email: 'a@b.com' });
});
