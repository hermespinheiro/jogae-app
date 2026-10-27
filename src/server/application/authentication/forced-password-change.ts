export type PasswordChangePort = { updatePassword(password: string): Promise<void>; clearFlag(): Promise<void> };
export async function completeForcedPasswordChange(port: PasswordChangePort, password: string) {
  await port.updatePassword(password);
  await port.clearFlag();
}
