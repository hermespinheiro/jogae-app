export type LoginPort = { signIn(email: string, password: string): Promise<{ userId: string } | null>; findEmailByUsername(username: string): Promise<string | null> };
export async function login(port: LoginPort, identifier: string, password: string) {
  const email = identifier.includes('@') ? identifier : await port.findEmailByUsername(identifier);
  if (!email) return null;
  return port.signIn(email, password);
}
