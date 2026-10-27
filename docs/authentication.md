# Autenticação própria

O cadastro público permanece desabilitado. Usuários entram por convite ou administração. O login aceita email ou username; o username é imutável.

## Configuração

`DATABASE_URL`, `SUPABASE_SERVER_URL` e `SUPABASE_SERVICE_ROLE_KEY` conectam a aplicação ao PostgreSQL gerenciado. A identidade não usa Supabase Auth.

Para e-mail, configure `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM` e `EMAIL_ENCRYPTION`. `APP_URL` define a origem dos links de recuperação.

O master usa `AUTH_MASTER_USERNAME`, `AUTH_MASTER_EMAIL` e `AUTH_MASTER_PASSWORD`. Execute `npm run auth:bootstrap` somente no servidor ou durante a implantação.

## Segurança e políticas

- Senhas novas usam Argon2id; bcrypt é aceito somente como fallback documentado e deve ser reprocessado quando Argon2id estiver disponível.
- Cookies de sessão são HttpOnly, SameSite Lax, Secure em produção e expiram em sete dias.
- Tokens de recuperação e códigos de e-mail são armazenados somente por hash, expiram e não podem ser reutilizados.
- O link de recuperação expira em 30 minutos e o código de alteração de e-mail em 15 minutos.
- Erros de login e recuperação não revelam se o usuário existe.
- Tentativas de login inválidas são limitadas por identidade durante uma janela de 15 minutos.
- Auditoria não registra senhas, tokens, códigos ou segredos.

## Operação

Após alterar `.env`, recrie o serviço com `docker compose up -d --force-recreate app`. Aplique as migrações versionadas antes do bootstrap. A recuperação envia um link para `${APP_URL}/reset-password?token=...`.
