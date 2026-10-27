import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getCurrentSession } from '@/server/auth/session';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  const user = Array.isArray(session.users) ? session.users[0] : session.users;
  if (!user || user.status !== 'active') redirect('/login');
  const requestHeaders = await headers();
  const currentPath = requestHeaders.get('x-invoke-path') ?? requestHeaders.get('next-url') ?? '';
  if (user.must_change_password && !currentPath.startsWith('/account/password')) {
    redirect('/account/password');
  }
  return <section data-authenticated="true">{children}</section>;
}
