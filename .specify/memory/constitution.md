<!--
Sync Impact Report
- Version change: 1.0.0 -> 2.0.0
- Version change: 2.0.0 -> 2.1.0
- Modified principles: III (removed Supabase Auth requirement); IV (authentication is now application-owned)
- Added principle: VIII (interface moderna, responsiva e mobile-first)
- Added guidance: password/session/token protection and portability
- Removed requirement: Supabase Auth as the identity provider
- Templates requiring updates: reviewed; no template changes required
- Propagated references: feature specification, plan, research, tasks and Docker documentation
- Follow-up TODO: original ratification date remains unknown
-->

# Sistema de Registros Compartilhados Constitution

## Core Principles

### I. Simplicidade Arquitetural e Reuso com Propósito

A aplicação MUST adotar a solução mais simples que atenda aos requisitos funcionais, de segurança e manutenção. Abstrações e dependências MUST NOT ser criadas sem necessidade concreta; cada módulo MUST ter responsabilidade clara; pequenas duplicações locais são preferíveis a abstrações prematuras; a solução MUST permanecer adequada a até 20 usuários inicialmente.

### II. Separação de Responsabilidades e Fronteiras Arquiteturais

O sistema MUST separar Frontend, API, domínio e infraestrutura com contratos explícitos. O Frontend MUST cuidar da interface; a API MUST validar, autorizar e orquestrar; o domínio MUST concentrar regras independentes de interface, HTTP e infraestrutura; a persistência MUST encapsular banco e arquivos. O Frontend MUST NOT acessar tabelas diretamente. Camadas MUST NOT criar dependências circulares.

### III. Tecnologias, Persistência Gerenciada e Portabilidade

O projeto MUST utilizar TypeScript, Next.js, PostgreSQL gerenciado, armazenamento de arquivos gerenciado e GitHub. A hospedagem da aplicação e os serviços gerenciados MUST ser substituíveis por alternativas compatíveis sem vincular a identidade dos usuários a um provedor externo. Dados MUST residir em armazenamento persistente gerenciado; PostgreSQL MUST ser a fonte de verdade; arquivos MUST ficar em armazenamento privado; segredos MUST usar variáveis de ambiente; persistência MUST ser encapsulada; bibliotecas adotadas MUST ser registradas no plano técnico.

### IV. Segurança, Autenticação Própria e Autorização

Cadastro público MUST permanecer desabilitado. Usuários MUST entrar por convite ou ação administrativa. A aplicação MUST controlar credenciais, sessões, recuperação de senha e verificação de email sem depender de um provedor externo de identidade. Senhas MUST ser armazenadas somente como verificadores irreversíveis; tokens de sessão e recuperação MUST ser armazenados somente em forma não recuperável, com expiração, uso único quando aplicável e invalidação explícita. A aplicação MUST implementar Administrador, Editor e Leitor. A API MUST verificar autenticação e autorização. PostgreSQL MUST usar RLS quando aplicável. Segredos e chaves privilegiadas MUST permanecer no servidor. Entradas MUST ser validadas no servidor. Convites MUST ter validade, uso controlado e revogação. Privilégios MUST NOT depender de perfil livremente modificável. Rate limiting e auditoria sem segredos MUST ser implementados conforme o risco do fluxo.

### V. Dados Compartilhados, Histórico e Auditoria

Registros MUST ser compartilhados salvo regra explícita em contrário e possuir identificadores, datas e criador. Relacionamentos MUST ser explícitos. Histórico MUST identificar usuário, data, operação e registro. Auditoria MUST ser protegida contra alteração e exclusão por usuários comuns. Dados e auditoria MUST ser atômicos quando parte da mesma transação. Exclusões, permissões e status MUST ser auditáveis. Backups testados e restauração documentada MUST permitir recuperação.

### VI. Arquivos e Integridade dos Dados

Arquivos MUST ser recursos privados vinculados a registros autorizados. Documentos não públicos MUST usar buckets privados. Acesso MUST verificar permissões do registro. URLs assinadas MUST ter validade limitada. Tamanho, tipo e restrições MUST ser validados no servidor. Metadados MUST registrar caminho, registro, responsável e data. Falhas MUST não deixar banco e Storage inconsistentes. Extensão ou MIME declarado MUST NOT provar segurança. Limites, retenção e, quando necessário, antimalware MUST ser definidos no plano.

### VII. Qualidade, Testabilidade e Evolução Controlada

Toda alteração de comportamento MUST ser verificável por testes proporcionais ao risco. API, autorização, persistência, histórico e arquivos MUST ter testes aplicáveis. CI MUST executar tipos, lint e testes. Migrações MUST ser versionadas, revisáveis e reproduzíveis. Mudanças incompatíveis MUST ser justificadas. Falhas de segurança ou integridade MUST bloquear publicação até resolução formal.

### VIII. Interface Moderna, Responsiva e Mobile-First

A interface MUST adotar uma experiência moderna, clara e consistente, baseada nos princípios
visuais e de interação do Material Design. O layout MUST ser mobile-first e responsivo, adaptando
conteúdo, navegação, formulários e ações a telas pequenas, médias e grandes. Componentes MUST
possuir estados visuais claros para carregamento, sucesso, erro, vazio, foco, toque e desabilitado.
Interações MUST ser acessíveis por toque e teclado, respeitar contraste e tamanho mínimo de alvo,
e preservar hierarquia visual, feedback imediato e prevenção de erros. A experiência MUST evitar
dependência de hover, exigir rolagem horizontal em telas pequenas ou esconder ações essenciais em
dispositivos móveis. Padrões visuais, espaçamento, tipografia, cores e componentes reutilizáveis
MUST ser definidos de forma consistente antes da expansão das telas.

## Architectural Constraints

A organização inicial MUST contemplar Frontend, API, Aplicação, Domínio, Infraestrutura e Contratos compartilhados. O domínio MUST NOT depender de Next.js, provedor de identidade, componentes visuais ou detalhes de armazenamento. A separação MUST ser lógica desde o início; múltiplos serviços MUST NOT ser introduzidos sem necessidade comprovada.

O planejamento MUST avaliar profiles, invitations, records, form_submissions, attachments, audit_log e record_history, implementando apenas entidades necessárias. O modelo definitivo MUST ser estabelecido na especificação.

## Development Workflow and Quality Gates

O desenvolvimento MUST seguir Constitution, Specify, Plan, Tasks, Implement e, quando disponíveis, Analyze e Converge. Cada funcionalidade MUST ter critérios de aceitação verificáveis. Decisões arquiteturais MUST ser registradas. Mudanças MUST ser pequenas e revisáveis. Integração MUST verificar tipos, lint, testes e migrações. Documentação MUST acompanhar mudanças em contratos, configuração, dados, permissões ou procedimentos.

## Governance

Esta constituição é a referência normativa para especificações, planos, tarefas, implementações e revisões. Princípios são obrigatórios; incompatibilidades MUST ser corrigidas. Exceções exigem justificativa, impacto, aprovação, escopo, responsável e revisão. Alterações MUST registrar motivação e consequências. MAJOR indica mudança incompatível; MINOR indica princípio novo ou expansão material; PATCH indica esclarecimento sem mudança semântica. Planos e revisões MUST verificar conformidade; complexidade MUST ser justificada. A constituição MUST ser mantida em .specify/memory/constitution.md e versionada no GitHub.

**Version**: 2.1.0 | **Ratified**: TODO(RATIFICATION_DATE): data original não fornecida | **Last Amended**: 2026-10-27
