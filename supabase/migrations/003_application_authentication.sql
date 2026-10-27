create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  email_normalized text not null,
  role text not null check (role in ('Administrador', 'Editor', 'Leitor')),
  status text not null default 'invited' check (status in ('active', 'invited', 'disabled')),
  must_change_password boolean not null default false,
  email_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists users_username_lower_idx on public.users (lower(username));
create unique index if not exists users_email_lower_idx on public.users (lower(email_normalized));

create table if not exists public.password_credentials (
  user_id uuid primary key references public.users(id) on delete cascade,
  password_hash text not null,
  password_changed_at timestamptz not null default now(),
  failed_attempts integer not null default 0 check (failed_attempts >= 0),
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists sessions_user_idx on public.sessions (user_id);
create index if not exists sessions_expiry_idx on public.sessions (expires_at) where revoked_at is null;

create table if not exists public.one_time_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  email text,
  purpose text not null check (purpose in ('password_reset', 'email_verification', 'email_change', 'invitation')),
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  check (not (used_at is not null and revoked_at is not null))
);

alter table public.invitations add column if not exists user_id uuid references public.users(id);
alter table public.email_change_requests add column if not exists token_id uuid references public.one_time_tokens(id);
