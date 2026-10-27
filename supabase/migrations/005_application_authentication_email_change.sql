alter table public.email_change_requests add column if not exists user_id uuid references public.users(id) on delete cascade;
alter table public.email_change_requests alter column profile_id drop not null;
create index if not exists email_change_requests_user_idx on public.email_change_requests (user_id);
