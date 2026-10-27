alter table public.audit_log add column if not exists actor_user_id uuid references public.users(id);
alter table public.audit_log add column if not exists target_user_id uuid references public.users(id);
create index if not exists audit_log_actor_user_idx on public.audit_log (actor_user_id);
create index if not exists audit_log_target_user_idx on public.audit_log (target_user_id);
