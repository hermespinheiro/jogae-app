import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('quickstart scenarios are documented for mobile and desktop flows', () => {
  const quickstart = readFileSync('specs/001-user-authentication/quickstart.md', 'utf8');
  assert.match(quickstart, /viewport móvel/);
  assert.match(quickstart, /email e senha válidos/);
  assert.match(quickstart, /Sair/);
  assert.match(quickstart, /recuperação/);
});
