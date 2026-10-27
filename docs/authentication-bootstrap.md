# Bootstrap do usuário master

Defina `AUTH_MASTER_USERNAME`, `AUTH_MASTER_EMAIL` e `AUTH_MASTER_PASSWORD` somente no ambiente
seguro de implantação. Primeiro aplique as migrações PostgreSQL e depois execute, no container da
aplicação:

```bash
docker compose run --rm app npm run auth:bootstrap
```

O bootstrap é idempotente e nunca imprime a senha. O primeiro login exige a troca da senha.
As variáveis `AUTH_MASTER_*` não criam o usuário automaticamente durante o login.
