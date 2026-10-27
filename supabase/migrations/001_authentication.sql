create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete restrict,
  username text not null,
  email_normalized text not null,
  role text not null check (role in ('Administrador', 'Editor', 'Leitor')),
  status text not null default 'invited' check (status in ('active', 'invited', 'disabled')),
  must_change_password boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_unique unique (username),
  constraint profiles_email_unique unique (email_normalized)
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text not null check (role in ('Administrador', 'Editor', 'Leitor')),
  invited_by uuid not null references public.profiles(id),
  expires_at timestamptz not null,
  used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  check (not (used_at is not null and revoked_at is not null))
);

create table if not exists public.email_change_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  new_email_normalized text not null,
  provider_request_id text,
  expires_at timestamptz not null,
  verified_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  check (not (verified_at is not null and cancelled_at is not null))
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id),
  event_type text not null,
  target_profile_id uuid references public.profiles(id),
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create unique index if not exists profiles_username_lower_idx on public.profiles (lower(username));
create unique index if not exists profiles_email_lower_idx on public.profiles (lower(email_normalized));
