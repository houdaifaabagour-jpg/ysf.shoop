-- Add preferred_locale to profiles
alter table profiles add column if not exists preferred_locale text not null default 'ar';

-- Track abandoned cart recovery emails
create table if not exists abandoned_cart_reminders (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid references carts(id) on delete cascade not null,
  customer_email text not null,
  sent_at timestamptz not null default now(),
  discount_code text
);
alter table abandoned_cart_reminders enable row level security;

create policy "Admins can select abandoned_cart_reminders"
  on abandoned_cart_reminders for select
  using (is_admin());

create policy "Service role can insert abandoned_cart_reminders"
  on abandoned_cart_reminders for insert
  with check (true);
