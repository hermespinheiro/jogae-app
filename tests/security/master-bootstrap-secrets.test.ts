import test from 'node:test';
import assert from 'node:assert/strict';
import { readMasterConfig } from '../../src/server/infrastructure/authentication/master-config';
import { readFileSync } from 'node:fs';

test('master configuration is read from environment', () => {
  const config = readMasterConfig({ AUTH_MASTER_USERNAME: 'master', AUTH_MASTER_EMAIL: 'master@example.com', AUTH_MASTER_PASSWORD: 'local-only-password' });
  assert.equal(config.username, 'master');
  assert.equal(config.email, 'master@example.com');
  assert.equal(config.password, 'local-only-password');
});

test('bootstrap source does not expose configured master secrets or allow browser invocation', () => {
  const script = readFileSync('scripts/auth-bootstrap.ts', 'utf8');
  const entrypoint = readFileSync('src/server/auth/master-bootstrap-entrypoint.ts', 'utf8');
  assert.doesNotMatch(script, /AUTH_MASTER_PASSWORD\s*[:=]\s*['"][^'"]+/);
  assert.doesNotMatch(script, /console\.log\([^)]*password/i);
  assert.doesNotMatch(entrypoint, /NextResponse|Request|export async function POST/);
});

test('administration route requires an active administrator session', () => {
  const route = readFileSync('src/app/api/admin/users/route.ts', 'utf8');
  assert.match(route, /user\??\.status === 'active'/);
  assert.match(route, /user\.role === 'Administrador'/);
  assert.match(route, /status: 403/);
});
