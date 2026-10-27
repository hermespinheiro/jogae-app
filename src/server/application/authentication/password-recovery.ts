export type PasswordRecoveryPort = { sendRecovery(email: string, redirectTo: string): Promise<void> };
export async function requestPasswordRecovery(port: PasswordRecoveryPort, email: string, redirectTo: string) {
  await port.sendRecovery(email, redirectTo);
  return { ok: true };
}
