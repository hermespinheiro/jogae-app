export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <section data-authenticated="true">{children}</section>;
}
