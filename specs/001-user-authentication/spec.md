# Feature Specification: Autenticação de Usuários

**Feature Branch**: `001-user-authentication`

**Created**: 2026-10-27

**Status**: Draft

**Input**: User description: "Autenticação própria: o usuário deve fazer autenticação com seu email ou username + senha, sem depender de um provedor externo de autenticação, para permitir migração futura da hospedagem e dos serviços. O sistema deve ter um usuário master logo de início."

## Clarifications

### Session 2026-10-27

- Q: Como o usuário master inicial deve ser provisionado? → A: Username, email e senha inicial fornecidos por configuração segura de implantação, com troca obrigatória da senha no primeiro acesso.
- Q: Quem pode alterar username e email? → A: Username imutável após criação; usuário autenticado pode alterar o próprio email após validar um código enviado ao novo endereço.
- Q: Como o usuário recupera a senha? → A: Recuperação por email com link de uso único e validade limitada.
- Q: Onde devem ficar as credenciais e sessões? → A: Sob controle da aplicação e de sua persistência, sem uso de serviço externo de identidade; a solução deve permitir migrar a hospedagem e o banco mediante procedimento documentado.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entrar com email ou username (Priority: P1)

Como usuário autorizado, quero entrar usando meu email ou username e senha para acessar as funcionalidades permitidas ao meu perfil.

**Why this priority**: A autenticação é a porta de entrada obrigatória para proteger os registros compartilhados.

**Independent Test**: Criar um usuário autorizado, realizar login com email e com username em sessões separadas e verificar acesso autenticado; repetir com credenciais inválidas e verificar recusa.

**Acceptance Scenarios**:

1. **Given** um usuário ativo com email, username e senha válidos, **When** informa o email e a senha, **Then** o sistema autentica o usuário e inicia uma sessão.
2. **Given** um usuário ativo com email, username e senha válidos, **When** informa o username e a senha, **Then** o sistema autentica o usuário e inicia uma sessão.
3. **Given** credenciais inválidas, **When** o usuário tenta entrar, **Then** o sistema recusa o acesso e informa uma mensagem genérica sem revelar qual credencial falhou.
4. **Given** um usuário autenticado, **When** solicita sair, **Then** a sessão é encerrada e recursos protegidos deixam de estar acessíveis.
5. **Given** um usuário autenticado, **When** solicita alterar seu email e informa o código enviado ao novo endereço, **Then** o email é atualizado após a validação bem-sucedida.

### User Story 2 - Disponibilizar usuário master inicial (Priority: P1)

Como responsável pela implantação, quero que exista um usuário master inicial para acessar o sistema pela primeira vez e administrar os usuários autorizados.

**Why this priority**: Sem uma identidade administrativa inicial, o sistema não pode ser configurado nem operar em um ambiente sem cadastro público.

**Independent Test**: Inicializar um ambiente novo com credenciais secretas de implantação, verificar a existência de exatamente um usuário master, entrar com ele, trocar a senha e confirmar que pode administrar usuários; confirmar que a senha não aparece em código, logs ou respostas públicas.

**Acceptance Scenarios**:

1. **Given** um ambiente novo sem usuários e credenciais secretas de implantação configuradas, **When** a inicialização é concluída, **Then** um único usuário master é criado com perfil Administrador, estado ativo e troca de senha obrigatória no primeiro acesso.
2. **Given** o usuário master inicial já existe, **When** a inicialização é executada novamente, **Then** o sistema não cria duplicatas nem substitui credenciais existentes silenciosamente.
3. **Given** o usuário master inicial autenticado, **When** acessa a administração de usuários, **Then** pode convidar ou administrar usuários conforme as permissões administrativas.

### Edge Cases

- O sistema recusa login de usuário inexistente, desativado ou sem perfil válido com a mesma mensagem genérica usada para credenciais inválidas.
- Email e username são tratados sem ambiguidade e sem permitir que diferenças de capitalização criem identidades duplicadas.
- Tentativas repetidas de login inválido são limitadas ou atrasadas para reduzir abuso de credenciais.
- A inicialização falha de forma explícita e segura quando as configurações obrigatórias do usuário master estão ausentes ou inválidas.
- A senha inicial deve ser alterada ou invalidada após a primeira entrada, conforme a política definida para a implantação.
- Código de alteração de email incorreto, expirado ou já utilizado não altera o email atual.
- Um novo email já associado a outra identidade não pode ser confirmado para o usuário solicitante.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir autenticação usando email ou username junto com senha.
- **FR-002**: O sistema MUST aceitar somente usuários ativos e autorizados.
- **FR-003**: O sistema MUST iniciar uma sessão autenticada após credenciais válidas.
- **FR-004**: O sistema MUST encerrar a sessão quando o usuário solicitar saída.
- **FR-005**: O sistema MUST recusar credenciais inválidas, inexistentes ou associadas a usuário desativado.
- **FR-006**: O sistema MUST usar mensagens de erro que não revelem se email, username ou senha está incorreto.
- **FR-007**: O sistema MUST criar um usuário master inicial com perfil Administrador em um ambiente novo, usando configuração segura de implantação.
- **FR-007a**: O sistema MUST receber username, email e senha inicial do usuário master por configuração segura de implantação, sem valores padrão embutidos no código.
- **FR-007b**: O sistema MUST exigir a troca da senha inicial do usuário master no primeiro acesso antes de liberar as demais operações administrativas.
- **FR-008**: O processo de inicialização MUST ser idempotente e MUST NOT criar usuário master duplicado nem substituir credenciais existentes sem ação explícita.
- **FR-009**: O usuário master MUST poder administrar usuários e convites conforme as regras de autorização do sistema.
- **FR-010**: O sistema MUST proteger credenciais, sessões e configurações do usuário master contra exposição em interface, logs, código ou respostas públicas.
- **FR-010a**: A aplicação MUST controlar o ciclo de vida das credenciais e sessões sem depender de um serviço externo de identidade, mantendo a possibilidade de migrar a hospedagem e a persistência por procedimento documentado.
- **FR-010b**: O sistema MUST armazenar somente verificadores irreversíveis de senha e de tokens de sessão, nunca senhas ou tokens recuperáveis em texto puro.
- **FR-011**: O sistema MUST aplicar uma proteção contra tentativas repetidas de autenticação inválida.
- **FR-012**: O sistema MUST registrar eventos relevantes de autenticação e administração sem armazenar senhas ou segredos.
- **FR-013**: O sistema MUST permitir solicitar recuperação de senha por email para usuário autorizado.
- **FR-014**: O sistema MUST emitir link de recuperação de uso único e com validade limitada, invalidando-o após o uso ou expiração.
- **FR-015**: O sistema MUST permitir que um usuário autenticado solicite a alteração do próprio email.
- **FR-016**: O sistema MUST enviar um código de validação ao novo email antes de efetivar a alteração.
- **FR-017**: O sistema MUST atualizar o email somente após validar um código correto, não expirado e ainda não utilizado.
- **FR-018**: O sistema MUST manter o email anterior quando a validação falhar, expirar ou não for concluída.
- **FR-019**: O sistema MUST registrar a alteração de email como evento auditável sem armazenar o código de validação.

### Key Entities

- **Usuário**: identidade autorizada com email, username único, estado, perfil, credencial protegida e datas de criação/atualização.
- **Sessão**: vínculo temporário controlado pela aplicação que representa a autenticação ativa de um usuário e pode ser encerrado ou invalidado.
- **Token de recuperação**: autorização temporária, não reutilizável e não recuperável, vinculada a uma solicitação de recuperação ou confirmação de email.
- **Convite**: autorização controlada para inclusão de novos usuários, com validade, uso e revogação.
- **Evento de auditoria**: registro de autenticação, saída, falha relevante ou administração, com usuário, operação e data, sem credenciais.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pelo menos 95% dos usuários autorizados concluem uma entrada válida em até 60 segundos na primeira tentativa.
- **SC-002**: 100% das tentativas com credenciais inválidas, usuário desativado ou inexistente são recusadas sem revelar qual dado falhou.
- **SC-003**: Em uma inicialização repetida, permanece exatamente um usuário master inicial e nenhuma credencial existente é substituída silenciosamente.
- **SC-004**: 100% das sessões encerradas deixam de permitir acesso a recursos protegidos.
- **SC-005**: 100% dos eventos de autenticação definidos como auditáveis ficam registrados sem senha ou segredo recuperável.
- **SC-006**: A aplicação pode ser executada em uma infraestrutura de hospedagem diferente sem alterar a identidade dos usuários, desde que as variáveis de ambiente e a persistência documentadas sejam disponibilizadas.
- **SC-007**: Nenhuma senha, token de sessão ou token de recuperação armazenado pela aplicação pode ser recuperado em seu valor original.

## Assumptions

- O cadastro público permanece desabilitado; novos usuários entram por convite ou ação administrativa.
- O usuário master inicial recebe o perfil Administrador, é configurado por segredos do ambiente de implantação e deve trocar a senha no primeiro acesso.
- Email e username são identificadores alternativos da mesma identidade, e ambos são únicos sem distinção de capitalização. O username é imutável após criação; o usuário autenticado pode alterar o próprio email mediante código enviado ao novo endereço.
- A autenticação, as sessões e os fluxos de recuperação são responsabilidade da aplicação; o banco de dados é a fonte de verdade das identidades, perfis, auditoria e estados de autenticação.
- A hospedagem da aplicação e o serviço de persistência podem ser substituídos futuramente sem exigir migração para um provedor específico de identidade.
- Autenticação multifator e federação de identidade estão fora do escopo desta feature, salvo inclusão posterior em uma especificação própria.

