-- Email logs for transactional emails
create table if not exists email_logs (
  id uuid primary key default gen_random_uuid(),
  to_email text not null,
  subject text not null,
  body text,
  order_id text,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  error text,
  created_at timestamptz not null default now()
);
alter table email_logs enable row level security;

-- Only admins can view email logs
create policy "Admins can view email logs"
  on email_logs for select
  using (auth.uid() in (select id from profiles where role = 'admin'));

-- Admin insert (for service role)
create policy "Service role can insert email logs"
  on email_logs for insert
  with check (true);
