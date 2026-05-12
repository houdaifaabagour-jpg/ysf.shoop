-- RPC function to increment coupon usage count
-- Called by checkout server action after order creation
create or replace function public.increment_coupon_usage(p_coupon_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update coupons
  set used_count = used_count + 1
  where id = p_coupon_id;
$$;
