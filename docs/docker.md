# Executar com Docker Compose

O Compose inicia a aplicação Next.js. O PostgreSQL e o armazenamento de arquivos são serviços externos
à aplicação e devem estar configurados separadamente, com as migrações em `supabase/migrations`
aplicadas no projeto Supabase escolhido.

1. Copie `.env.example` para `.env` e preencha as credenciais do Supabase e do usuário master.
   Mantenha esse arquivo fora do controle de versão.
2. Construa a imagem e inicie a aplicação:

   ```sh
   docker compose up --build
   ```

3. Acesse <http://localhost:3000>. Para encerrar, execute `docker compose down`.

`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` são argumentos de build porque
variáveis `NEXT_PUBLIC_*` podem ser incorporadas ao bundle do navegador pelo Next.js. As chaves
de serviço e as credenciais do usuário master são fornecidas somente ao container em execução;
não as passe como argumentos de build.
