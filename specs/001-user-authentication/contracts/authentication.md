# Authentication Contracts

Contratos da API e estados mínimos da interface. A aplicação é a autoridade de identidade; não
há dependência de API de autenticação externa.

## POST /api/auth/login

**Request**: `{"identifier":"email-ou-username","password":"senha"}`

**Success**: `200` com perfil mínimo não sensível; cookie de sessão opaco é emitido com atributos seguros.

**Failure**: `401` com mensagem genérica; `429` quando o limite de tentativas for acionado.

## POST /api/auth/logout

Requer sessão. Revoga a sessão atual e retorna `204`.

## POST /api/auth/password-recovery

**Request**: `{"email":"usuario@example.com"}`. Sempre retorna resposta indistinguível para email
existente ou inexistente; emite token de uso único somente quando aplicável.

## POST /api/auth/password-recovery/confirm

**Request**: `{"token":"...","password":"nova-senha"}`. O token expira, não pode ser reutilizado
e revoga sessões anteriores.

## POST /api/auth/email-change/request

Requer sessão. `{"newEmail":"novo@example.com"}`. Valida unicidade e envia código sem alterar o
email atual.

## POST /api/auth/email-change/confirm

Requer sessão. `{"requestId":"uuid","code":"codigo"}`. Atualiza somente com código correto,
não expirado e não utilizado.

## POST /api/auth/change-password

Requer sessão. Usuário com `must_change_password=true` só pode acessar este fluxo até concluí-lo.
Após sucesso, revoga sessões antigas e remove a flag.

## Internal bootstrap

Operação de implantação fora do navegador. Lê configuração segura, cria exatamente um usuário
master com hash de senha, papel Administrador e troca obrigatória. É idempotente e não retorna
nem registra a senha.

## Authorization contract

- Rotas protegidas exigem sessão válida e usuário active.
- Role, status, convites e bootstrap exigem Administrador.
- Usuário só solicita troca do próprio email.
- RLS deve negar acesso incompatível com usuário, papel ou sessão.

## UI contract

- Formulários funcionam em viewport móvel sem rolagem horizontal.
- Todo submit mostra estado de carregamento e desabilita repetição.
- Erros são genéricos, legíveis e associados ao campo ou formulário sem expor segredos.
- Foco visível, teclado, contraste e alvo de toque mínimo devem ser preservados.
