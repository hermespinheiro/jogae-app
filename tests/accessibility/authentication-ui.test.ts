import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const pages = [
  'src/app/(auth)/login/page.tsx',
  'src/app/(auth)/forgot-password/page.tsx',
  'src/app/(auth)/reset-password/page.tsx',
  'src/app/(protected)/account/email/page.tsx',
  'src/app/(protected)/account/password/page.tsx',
];

test('authentication screens expose mobile and accessible form structure', () => {
  for (const file of pages) {
    const source = readFileSync(file, 'utf8');
    assert.match(source, /<form/);
    assert.match(source, /<Input/);
    assert.match(source, /<Button/);
    assert.match(source, /FormField/);
  }
});

test('Material Design CSS preserves focus, touch targets and responsive width', () => {
  const css = readFileSync('src/app/globals.css', 'utf8');
  assert.match(css, /focus-visible/);
  assert.match(css, /min-height:\s*3rem/);
  assert.match(css, /width:\s*min\(100%/);
  assert.match(css, /@media\s*\(min-width:\s*600px\)/);
});
