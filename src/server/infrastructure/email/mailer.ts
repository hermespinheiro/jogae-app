import nodemailer from 'nodemailer';
import { getSmtpConfig } from '@/lib/config/env';

export type MailMessage = { to: string; subject: string; text: string };

export async function sendMail(message: MailMessage): Promise<void> {
  const config = getSmtpConfig();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.encryption === 'ssl',
    requireTLS: config.encryption === 'tls',
    auth: { user: config.user, pass: config.password },
  });
  await transporter.sendMail({ from: config.from, to: message.to, subject: message.subject, text: message.text });
}
