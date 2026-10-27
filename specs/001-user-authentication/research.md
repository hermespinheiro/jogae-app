# Research: Autenticação de Usuários

## Decision: Argon2id obrigatório com bcrypt como fallback

**Rationale:** a aplicação precisa controlar a identidade sem provedor externo. A senha será
verificada no servidor e nunca será armazenada ou retornada. Argon2id será obrigatório como
padrão. Bcrypt só poderá ser usado em ambiente que comprovadamente não suporte Argon2id, com
custo mínimo documentado e identificação do algoritmo no próprio hash.

Hashes bcrypt devem ser reprocessados para Argon2id após login bem-sucedido quando o ambiente
passar a suportá-lo.

**Alternatives considered:** texto puro, hash rápido como SHA-256 e criptografia reversível foram
rejeitados por não protegerem adequadamente contra vazamento de credenciais. Usar somente bcrypt
foi rejeitado por não oferecer a mesma resistência moderna a ataques paralelos.

## Decision: Sessões opacas persistidas e revogáveis

**Rationale:** o navegador recebe apenas um identificador aleatório em cookie HttpOnly, Secure e
SameSite adequado. A aplicação persiste somente o hash do identificador, com expiração, revogação
e associação ao usuário. Isso permite logout, invalidação global e migração sem expor identidade.

**Alternatives considered:** JWT armazenado no localStorage foi rejeitado por ampliar impacto de
XSS e dificultar revogação imediata.

## Decision: Tokens de recuperação e verificação armazenados como hash

**Rationale:** links e códigos são emitidos por serviço de email, mas somente seus hashes e
metadados ficam no banco. Cada token tem expiração, uso único e finalidade explícita.

**Alternatives considered:** guardar token em texto puro foi rejeitado por permitir tomada de
conta em caso de leitura indevida do banco.

## Decision: PostgreSQL encapsulado por repositórios

**Rationale:** PostgreSQL é a fonte de verdade, mas os casos de uso não conhecerão o driver ou
provedor de hospedagem. Migrações versionadas e adaptadores permitem trocar a infraestrutura.

**Alternatives considered:** consultas diretas em componentes e dependência de tabelas Auth do
Supabase foram rejeitadas por violarem as fronteiras e a portabilidade constitucional.

## Decision: Contexto de sessão próprio para RLS

**Rationale:** o servidor valida o cookie opaco na tabela `sessions` e obtém `user_id`, `role`,
`status` e `session_id`. Antes das consultas protegidas, a mesma transação define `SET LOCAL
app.user_id`, `SET LOCAL app.role` e `SET LOCAL app.session_id`. As políticas RLS consultam apenas
essas variáveis, rejeitam contexto ausente e o servidor bloqueia usuários não ativos.

`SET LOCAL` é obrigatório para que o contexto seja limitado à transação e não seja reutilizado por
outro usuário através do pool de conexões. Nenhum valor de identidade ou papel vindo do navegador
é aceito.

**Alternatives considered:** usar conexão privilegiada que ignora RLS foi rejeitado por eliminar a
defesa no banco; confiar em campos enviados pelo cliente foi rejeitado por permitir escalada de
privilégio; manter contexto permanente na conexão foi rejeitado por risco de vazamento entre usuários.

## Decision: Email transacional por adaptador

**Rationale:** recuperação, convites e alteração de email exigem envio confiável, mas o domínio
não deve depender de um fornecedor. O adaptador SMTP/API será configurável por ambiente.

## Decision: Material Design mobile-first

**Rationale:** componentes consistentes, feedback de estado, alvos de toque e responsividade
reduzem erros em telas pequenas e atendem ao princípio VIII da constituição.

**Validation:** cada fluxo terá estados de carregamento, sucesso, erro, vazio, foco e desabilitado;
testes de teclado, contraste e viewport móvel serão parte da validação.

## Decision: Bootstrap master transacional e idempotente

**Rationale:** configuração segura cria exatamente um usuário Administrador ativo com senha inicial
e flag de troca obrigatória. Reexecução verifica identidade normalizada e não substitui senha.
