# Supabase local inteiramente via containers

A CLI do Supabase também roda em container. O único requisito no host é o Docker Engine/Compose.
A imagem da CLI é construída localmente a partir de Node e do pacote oficial `supabase`; não
depende de um repositório Docker `public.ecr.aws/supabase/cli`.

## Comandos

```bash
./scripts/supabase.sh start
./scripts/supabase.sh status
./scripts/supabase.sh db reset
./scripts/supabase.sh stop
```

O serviço `supabase-cli` usa uma imagem local que contém o pacote oficial da CLI e o socket do
Docker para iniciar o stack local. A CLI não é instalada no host.

A imagem também inclui o Docker CLI. Isso é necessário porque montar apenas
`/var/run/docker.sock` fornece o daemon, mas não o comando `docker` dentro do container.

O serviço da CLI usa `network_mode: host`. O comando `supabase start` verifica o PostgreSQL e
outros serviços em portas `127.0.0.1` do host; sem essa configuração, `127.0.0.1` apontaria para o
próprio container temporário da CLI e a inicialização falharia.

## Inicialização

O repositório já contém `supabase/config.toml`. Se a pasta ainda não existisse, o comando seria:

```bash
./scripts/supabase.sh init
```

Depois de iniciar, execute `status` e copie as chaves locais para `.env`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Segurança e rede

O bind do Docker socket concede ao container da CLI controle equivalente ao Docker do host. Use
esta configuração somente em ambiente de desenvolvimento confiável. O stack local não deve ser
exposto publicamente.

O navegador usa `127.0.0.1:54321`. Containers que precisarem acessar a API pelo host devem usar
`host.docker.internal:54321`; o Compose da aplicação já adiciona esse alias no Linux.
