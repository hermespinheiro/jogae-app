import assert from 'node:assert/strict';
import test from 'node:test';
import { sanitizeAuditMetadata } from '../../src/server/infrastructure/audit/audit-log-repository';
import { readFileSync } from 'node:fs';

test('audit metadata removes secrets', () => {
  assert.deepEqual(sanitizeAuditMetadata({ email: 'a@b.com', password: 'secret', code: '123' }), { email: 'a@b.com' });
});

test('authentication handlers do not return password or raw token fields', () => {
  const source = [
    'src/app/api/auth/login/route.ts',
    'src/app/api/auth/password-recovery/route.ts',
    'src/app/api/auth/password-recovery/confirm/route.ts',
  ].map((file) => readFileSync(file, 'utf8')).join('\n');
  assert.doesNotMatch(source, /JSON\.stringify\(.*password/i);
  assert.doesNotMatch(source, /JSON\.stringify\(.*token/i);
  assert.match(source, /Invalid credentials|Invalid recovery request/);
});

