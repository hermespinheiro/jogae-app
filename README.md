# Jogae App

Aplicação web para registros compartilhados, com autenticação própria, usuários convidados,
perfis de acesso e interface responsiva orientada a dispositivos móveis.

## Tecnologia do projeto

- **Frontend e backend:** Next.js com TypeScript e React.
- **Banco de dados:** PostgreSQL gerenciado, com migrações SQL e Row Level Security (RLS).
- **Autenticação:** implementada pela própria aplicação; não utiliza Supabase Auth.
- **Senhas:** Argon2id como padrão obrigatório. bcrypt é permitido somente como fallback documentado.
- **Sessões:** tokens opacos persistidos como hash e enviados em cookies HttpOnly.
- **Email:** SMTP configurável por variáveis de ambiente, usando Nodemailer.
- **Interface:** Material Design, mobile-first, responsiva e acessível.
- **Execução local:** Docker e Docker Compose.
- **Testes:** Node test runner e testes organizados por unidade, contrato, integração, segurança,
  acessibilidade e end-to-end.

## Arquitetura do projeto

O projeto é uma aplicação full-stack em um único repositório, com fronteiras lógicas entre as camadas:

```text
src/
├── app/                         # Páginas, layouts e rotas HTTP do Next.js
├── components/ui/               # Componentes visuais e tokens de design
├── contracts/                   # Schemas e contratos compartilhados
├── lib/                         # Configurações e utilitários gerais
└── server/
    ├── application/             # Casos de uso
    ├── auth/                    # Sessões e autorização
    ├── domain/                  # Regras independentes de infraestrutura
    └── infrastructure/
        ├── database/            # Repositórios e acesso ao PostgreSQL
        ├── email/               # Adaptador SMTP
        ├── security/            # Hashes e tokens
        └── audit/               # Auditoria

supabase/migrations/             # Migrações PostgreSQL e políticas RLS
tests/
├── unit/
├── contract/
├── integration/
├── security/
├── accessibility/
└── e2e/
```

O frontend não acessa o banco diretamente. As rotas validam a entrada e delegam aos casos de uso;
o domínio não depende de Next.js, componentes visuais ou provedor externo de identidade.

### Autenticação e autorização

1. O usuário envia email/username e senha para a API.
2. O servidor consulta o usuário e verifica o hash da senha.
3. Uma sessão opaca é criada e seu hash é persistido no banco.
4. O token é enviado em cookie seguro e HttpOnly.
5. Rotas protegidas validam a sessão antes de executar operações.
6. Políticas RLS recebem o contexto confiável do servidor (`app.user_id`, `app.role` e
   `app.session_id`) dentro da transação.

## Configuração do ambiente

Copie o arquivo de exemplo e preencha os valores no ambiente seguro:

```bash
cp .env.example .env
```

Principais variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVER_URL=http://host.docker.internal:54321
SUPABASE_SERVICE_ROLE_KEY=
AUTH_MASTER_USERNAME=
AUTH_MASTER_EMAIL=
AUTH_MASTER_PASSWORD=
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=
EMAIL_ENCRYPTION=tls
```

`SUPABASE_SERVER_URL` é usado pelo servidor dentro do Docker. Nunca versione `.env`, senhas,
tokens ou credenciais SMTP.

## Processo para desenvolvimento

### Pré-requisitos

- Docker e Docker Compose.
- Node.js 22 ou superior para desenvolvimento fora do container.
- PostgreSQL/Supabase local ou de desenvolvimento.

### Executar localmente com Docker

```bash
docker compose build app
docker compose up app
```

A aplicação ficará disponível em `http://localhost:3000`.

### Migrações e usuário master

Aplique as migrações PostgreSQL antes do primeiro login. Em seguida execute:

```bash
docker compose run --rm app npm run auth:bootstrap
```

O comando é idempotente: não cria duplicata nem substitui a senha existente.

### Fluxo de trabalho

O projeto utiliza o fluxo Spec Kit:

1. Atualizar a especificação (`spec.md`).
2. Criar ou revisar o plano (`plan.md`).
3. Gerar modelo, contratos e quickstart.
4. Gerar as tarefas (`tasks.md`).
5. Analisar consistência.
6. Implementar as tarefas em ordem de dependência.
7. Executar build, tipos, lint e testes.

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Processo de build

O Dockerfile usa três etapas:

1. **Dependencies:** instala as dependências.
2. **Builder:** compila o Next.js e verifica o TypeScript.
3. **Runner:** empacota `.next`, dependências, scripts e código necessário para tarefas internas.

```bash
docker compose build app
docker compose up -d app
```

O build deve passar antes de qualquer publicação.

## Processo de deploy

1. Configure as variáveis de ambiente no provedor.
2. Configure PostgreSQL e armazenamento privado compatíveis.
3. Aplique as migrações em `supabase/migrations/`.
4. Execute `npm run auth:bootstrap` no servidor ou job interno.
5. Confirme login, logout, troca obrigatória de senha, SMTP, autorização e RLS.

### Deploy com Docker

```bash
docker compose build app
docker compose up -d --force-recreate app
```

### Deploy em outro provedor

A aplicação pode ser executada em Vercel ou infraestrutura compatível com Next.js. Para migrar,
preserve usuários, perfis, hashes, auditoria e dados autorizados; não exporte tokens ativos.
Configure as variáveis, restaure o banco, aplique migrações e invalide sessões antigas.

## Segurança

- Cadastro público desabilitado.
- Senhas nunca são armazenadas em texto puro.
- Tokens e sessões são armazenados somente como hash.
- Mensagens de login não enumeram usuários.
- Segredos são lidos somente no servidor.
- Auditoria não registra senhas, tokens ou códigos.
- RLS e autorização no servidor são independentes da interface.

## Documentação relacionada

- [Autenticação](docs/authentication.md)
- [Bootstrap do usuário master](docs/authentication-bootstrap.md)
- [Autenticação em Docker](docs/docker.md)
- [Plano da feature](specs/001-user-authentication/plan.md)
- [Quickstart](specs/001-user-authentication/quickstart.md)
