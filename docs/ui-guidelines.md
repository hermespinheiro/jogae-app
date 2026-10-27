# Diretrizes de interface

A interface usa Material Design com abordagem mobile-first.

## Componentes

Use `Button`, `Input`, `FormField`, `Alert` e `LoadingState` de `src/components/ui/`. Todo formulário deve ter label visível, feedback de erro/sucesso, estado de carregamento e botão desabilitado durante o envio.

## Responsividade e acessibilidade

- Formulários devem ocupar `min(100% - 2rem, 42rem)` e não gerar rolagem horizontal.
- Campos e botões usam altura mínima de 3rem para toque confortável.
- O foco deve permanecer visível por teclado.
- Mensagens de erro usam `role="alert"`; estados de sucesso usam `role="status"`.
- Não dependa de hover para ações essenciais.
- Valide as telas em viewport móvel e desktop antes da entrega.

## Tokens

As cores, espaçamentos, raios, tipografia e breakpoints ficam em `src/components/ui/tokens.ts` e `src/app/globals.css`. Evite estilos isolados que quebrem a consistência do design system.
