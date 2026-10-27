export type LogoutPort = { signOut(): Promise<void>; audit(): Promise<void> };
export async function logout(port: LogoutPort): Promise<void> {
  await port.signOut();
  await port.audit();
}
