export function normalizeIdentifier(value: string): string {
  return value.trim().toLocaleLowerCase('en-US');
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateUsername(value: string): string {
  const username = normalizeIdentifier(value);
  if (!/^[a-z0-9][a-z0-9._-]{2,31}$/.test(username)) {
    throw new Error('Invalid username');
  }
  return username;
}

export function validateEmail(value: string): string {
  const email = normalizeIdentifier(value);
  if (!isEmail(email) || email.length > 254) throw new Error('Invalid email');
  return email;
}

export function validatePassword(value: string): string {
  if (value.length < 12 || value.length > 128) throw new Error('Invalid password');
  return value;
}

export function validateVerificationCode(value: string): string {
  const code = value.trim();
  if (!/^\d{6,8}$/.test(code)) throw new Error('Invalid verification code');
  return code;
}
