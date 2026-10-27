# Implementation Plan: Autenticação de Usuários

**Branch**: `001-user-authentication` | **Date**: 2026-10-27 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-user-authentication/spec.md`

## Summary

Implementar autenticação própria para usuários convidados, com credenciais e sessões controladas
pela aplicação e persistidas em PostgreSQL. O fluxo inclui login por email ou username, logout,
recuperação de senha, troca de email, bootstrap idempotente do master e autorização por papel.
A interface seguirá Material Design, com abordagem mobile-first, responsiva e acessível.

## Technical Context

**Language/Version**: TypeScript com Next.js; versão exata definida pelo setup do projeto

**Primary Dependencies**: Next.js, adaptador de PostgreSQL, biblioteca de hash Argon2id com bcrypt
como fallback documentado,
biblioteca de validação, serviço SMTP transacional e ferramenta de testes

**Storage**: PostgreSQL como fonte de verdade para usuários, credenciais, sessões, tokens,
convites, auditoria e dados da aplicação; armazenamento privado para arquivos

**Testing**: testes unitários de domínio, contratos HTTP, integração PostgreSQL, segurança,
acessibilidade e testes end-to-end; runner definido pelo setup do projeto

**Target Platform**: aplicação web responsiva executável em Vercel ou infraestrutura compatível

**Project Type**: aplicação web full-stack Next.js com Frontend, API, Aplicação, Domínio e Infraestrutura

**Performance Goals**: login válido e navegação inicial com resposta interativa em até 2 segundos
em condições normais; rate limiting e verificação de senha sem bloquear requisições legítimas

**Constraints**: sem cadastro público; sem provedor externo de identidade; senhas nunca recuperáveis;
tokens de sessão e recuperação armazenados somente como hash; username único e imutável; RLS e
auditoria obrigatórios; interface mobile-first sem dependência de hover

**RLS Session Context**: o servidor valida o cookie de sessão e, dentro de cada transação protegida,
define `SET LOCAL app.user_id`, `SET LOCAL app.role` e `SET LOCAL app.session_id`. As políticas
RLS usam somente esse contexto confiável, falham fechado quando ausente e nunca aceitam identidade
ou papel enviados pelo navegador. O uso de `SET LOCAL` impede vazamento de contexto entre conexões
do pool.

**Scale/Scope**: até 20 usuários inicialmente; Administrador, Editor e Leitor; uma implantação
inicial com um usuário master

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicidade**: PASS — autenticação própria fica no mesmo projeto e não introduz serviço de identidade separado.
- **Fronteiras**: PASS — UI, API, aplicação, domínio, persistência e email possuem contratos separados.
- **Portabilidade**: PASS — o domínio não depende de Supabase Auth, Vercel ou provedor de identidade.
- **Segurança**: PASS — hash irreversível, sessões revogáveis, tokens com expiração, rate limiting, RLS e segredos de servidor.
- **Auditoria**: PASS — eventos de autenticação e administração não armazenam senhas, tokens ou códigos.
- **Interface**: PASS — Material Design, mobile-first, estados de UI, teclado, toque e contraste serão requisitos testáveis.
- **Testabilidade**: PASS — contratos, persistência, segurança, acessibilidade e migração terão testes proporcionais.

## Phase 0: Research Decisions

As decisões técnicas e de segurança estão registradas em [research.md](research.md). Não há
`NEEDS CLARIFICATION` pendente para iniciar a implementação.

## Phase 1: Design Artifacts

- Modelo de dados: [data-model.md](data-model.md)
- Contratos HTTP e UI: [contracts/authentication.md](contracts/authentication.md)
- Validação operacional: [quickstart.md](quickstart.md)

## Project Structure

### Documentation

```text
specs/001-user-authentication/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/authentication.md
└── tasks.md
```

### Source Code

```text
src/
├── app/
│   ├── (auth)/
│   ├── (protected)/
│   └── api/auth/
├── contracts/authentication/
├── server/
│   ├── application/authentication/
│   ├── auth/
│   ├── domain/authentication/
│   └── infrastructure/
│       ├── database/
│       ├── email/
│       └── security/
├── components/ui/
└── lib/

supabase/migrations/ # PostgreSQL gerenciado; sem Supabase Auth
tests/
├── unit/
├── contract/
├── integration/
├── security/
├── accessibility/
└── e2e/
```

**Structure Decision**: manter Frontend e API no mesmo projeto Next.js. O domínio não dependerá
de Next.js, banco específico, email, Material UI ou qualquer provedor externo. Adaptadores de
persistência, hash, email e sessão serão substituíveis por interfaces explícitas.

## Complexity Tracking

| Addition | Why needed | Simpler alternative rejected because |
|---|---|---|
| Sessões e tokens próprios | Remover dependência de identidade externa e permitir migração | Usar Supabase Auth contradiz a exigência de portabilidade |
| Camada de adaptadores | Trocar PostgreSQL, SMTP ou biblioteca de hash sem alterar domínio | Acesso direto espalharia dependências e dificultaria migração |
| Design system mobile-first | Atender Material Design e acessibilidade | Estilos isolados não garantem consistência nem adaptação móvel |
