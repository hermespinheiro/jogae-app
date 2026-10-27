export type LogoutPort = { revokeSession(): Promise<void>; audit(): Promise<void> };

export async function logout(port: LogoutPort): Promise<void> {
  await port.revokeSession();
  await port.audit();
}
