import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <h1>Sistema de Registros Compartilhados</h1>
      <p>Entre para acessar o sistema.</p>
      <Link href="/login">Entrar</Link>
    </main>
  );
}
