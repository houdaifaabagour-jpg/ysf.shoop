-- Audit logs for tracking admin actions
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references profiles(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);
alter table audit_logs enable row level security;

create policy "Admins can view audit logs"
  on audit_logs for select
  using (auth.uid() in (select id from profiles where role = 'admin'));

create policy "Service role can insert audit logs"
  on audit_logs for insert
  with check (true);
