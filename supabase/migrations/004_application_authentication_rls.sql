alter table public.users enable row level security;
alter table public.password_credentials enable row level security;
alter table public.sessions enable row level security;
alter table public.one_time_tokens enable row level security;

create or replace function public.app_user_id() returns uuid language sql stable as $$
  select nullif(current_setting('app.user_id', true), '')::uuid
$$;

create or replace function public.app_role() returns text language sql stable as $$
  select nullif(current_setting('app.role', true), '')
$$;

create policy users_self_or_admin on public.users for select using (
  id = public.app_user_id() or public.app_role() = 'Administrador'
);
create policy users_admin_write on public.users for all using (public.app_role() = 'Administrador') with check (public.app_role() = 'Administrador');
create policy credentials_server_only on public.password_credentials for all using (public.app_user_id() = user_id) with check (public.app_user_id() = user_id);
create policy sessions_self on public.sessions for all using (public.app_user_id() = user_id) with check (public.app_user_id() = user_id);
create policy tokens_server_only on public.one_time_tokens for all using (public.app_user_id() = user_id) with check (public.app_user_id() = user_id);
