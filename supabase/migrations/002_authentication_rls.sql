alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.email_change_requests enable row level security;
alter table public.audit_log enable row level security;

create policy profiles_self_read on public.profiles for select using (id = auth.uid());
create policy profiles_admin_manage on public.profiles for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'Administrador' and p.status = 'active')
);
create policy email_change_self on public.email_change_requests for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy invitations_admin on public.invitations for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'Administrador' and p.status = 'active')
);
create policy audit_insert_server on public.audit_log for insert with check (actor_profile_id = auth.uid() or actor_profile_id is null);
