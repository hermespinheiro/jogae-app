# Quickstart: Validar Autenticação Própria

## Pré-requisitos

- PostgreSQL local ou ambiente compatível com as migrações.
- Variáveis seguras para bootstrap master e conexão do banco.
- Serviço SMTP/API de email de teste.
- Runtime Node/Next.js e dependências instaladas.

## Cenários de validação

1. Aplicar migrações em banco vazio e executar bootstrap; confirmar um único master Administrador ativo.
2. Reexecutar bootstrap; confirmar que não há duplicata nem substituição de senha.
3. Entrar com email e senha válidos; confirmar cookie de sessão opaco e rota protegida acessível.
4. Entrar com username e senha válidos; confirmar o mesmo resultado sem enumeração.
5. Sair; confirmar revogação da sessão e bloqueio de rota protegida.
6. Tentar credenciais inválidas, inexistentes e usuário desabilitado; confirmar mensagem única.
7. Exceder tentativas inválidas; confirmar `429`/atraso e posterior liberação conforme política.
8. Solicitar recuperação; confirmar resposta indistinguível, token hash no banco e uso único.
9. Confirmar recuperação; definir nova senha e confirmar revogação das sessões anteriores.
10. Solicitar troca de email; confirmar que o email atual permanece até código válido.
11. Tentar código incorreto, expirado, reutilizado e email duplicado; confirmar que nada é alterado.
12. Acessar em viewport móvel; confirmar ausência de rolagem horizontal, foco visível e botões acionáveis por toque/teclado.
13. Exportar e importar dados em ambiente equivalente; confirmar preservação da identidade sem tokens ativos.

## Verificações automatizadas

- `npm run typecheck`, `npm run lint` e `npm test`.
- Testes de contrato para todos os endpoints acima.
- Testes de integração para migrações, transações, RLS e bootstrap idempotente.
- Testes de segurança para hashes, cookies, tokens, rate limiting e ausência de segredos em logs/respostas.
- Testes de acessibilidade e end-to-end em viewport móvel e desktop.
- Build de produção em infraestrutura compatível com as variáveis documentadas.

## Resultado da última validação

Em 2026-10-27, o build Docker, `npm run typecheck`, verificação de lint baseada em TypeScript e a suíte automatizada foram executados com sucesso. A suíte apresentou 24 testes aprovados e 0 falhas. O build ainda emite somente o aviso de migração futura de `middleware` para `proxy` no Next.js.
