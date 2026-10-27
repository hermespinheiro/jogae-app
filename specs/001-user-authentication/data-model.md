# Data Model: Autenticação de Usuários

## users

Identidade da aplicação e fonte de verdade do usuário.

| Campo | Regra |
|---|---|
| id | UUID; chave primária |
| username | normalizado, obrigatório, único e imutável |
| email_normalized | normalizado, obrigatório e único case-insensitive |
| role | Administrador, Editor ou Leitor |
| status | invited, active ou disabled |
| must_change_password | true para master inicial até troca bem-sucedida |
| email_verified_at | obrigatório antes de operações sensíveis |
| created_at / updated_at | timestamps obrigatórios |

## password_credentials

| Campo | Regra |
|---|---|
| user_id | chave primária e referência a users |
| password_hash | hash Argon2id preferencial ou bcrypt; nunca senha original |
| password_changed_at | timestamp da última troca |
| failed_attempts / locked_until | controle de rate limiting por identidade |
| created_at / updated_at | timestamps obrigatórios |

## sessions

| Campo | Regra |
|---|---|
| id | UUID; chave primária |
| user_id | referência a users |
| token_hash | hash do token opaco; nunca token original |
| expires_at | obrigatório e futuro na criação |
| revoked_at | preenchido no logout ou invalidação |
| created_at / last_seen_at | timestamps |

## one_time_tokens

Tokens de recuperação de senha, convite e confirmação de email.

| Campo | Regra |
|---|---|
| id | UUID; chave primária |
| user_id / email | alvo do fluxo, conforme finalidade |
| purpose | password_reset, email_verification, email_change ou invitation |
| token_hash | hash do token/código; nunca valor recuperável |
| expires_at | validade limitada |
| used_at / revoked_at | estado terminal; não pode ser reutilizado |
| created_at | timestamp obrigatório |

## invitations

Convite controlado para criação de usuário sem cadastro público, com email normalizado, papel,
criador, validade, uso e revogação.

## email_change_requests

Pedido autenticado de troca de email com user_id, novo email normalizado, token associado,
validade, confirmação e cancelamento. O email atual permanece até confirmação bem-sucedida.

## audit_log

Evento imutável com ator opcional, alvo opcional, tipo, metadados mínimos não secretos e data.
Metadados nunca podem conter senha, hash de senha, token, código ou segredo de configuração.

## State transitions

- `invited -> active` após convite aceito, credencial criada e email confirmado.
- `active -> disabled` por ação administrativa; sessões ativas devem ser revogadas.
- `active + must_change_password=true -> active + false` após troca obrigatória.
- Sessão: `active -> revoked` ou `expired`.
- Token: `pending -> used`, `expired` ou `revoked`; estados terminais não podem ser reutilizados.
- Troca de email: `pending -> verified` ou `expired/cancelled`; somente `verified` atualiza users.

## Integrity and access rules

- Username e email têm unicidade case-insensitive e normalização no servidor.
- Somente servidor autorizado altera role, status, username e hashes.
- Usuário autenticado só cria pedido de troca para si mesmo.
- RLS nega acesso direto incompatível com papel e identidade da sessão.
- Cada transação protegida recebe, pelo servidor, `SET LOCAL app.user_id`, `SET LOCAL app.role` e
  `SET LOCAL app.session_id`; contexto ausente deve negar acesso.
- RLS nunca deve confiar em `user_id`, `role` ou `session_id` enviados pelo cliente.
- Usuários comuns não alteram nem excluem audit_log.
- Alterações de identidade e auditoria correspondente devem ser atômicas.
- Exportação/importação deve preservar IDs, timestamps, papéis, estado e hashes compatíveis sem exportar tokens ativos.
