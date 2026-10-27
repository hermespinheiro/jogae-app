export type EmailChangePort = { request(email: string): Promise<void>; confirm(requestId: string, code: string): Promise<boolean>; audit(event: string): Promise<void> };
export async function requestEmailChange(port: EmailChangePort, email: string) {
  await port.request(email);
  await port.audit('email_change_requested');
}
export async function confirmEmailChange(port: EmailChangePort, requestId: string, code: string) {
  const changed = await port.confirm(requestId, code);
  if (changed) await port.audit('email_changed');
  return changed;
}
