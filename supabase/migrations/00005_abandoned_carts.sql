-- Function to get abandoned carts (carts older than 24h with items but no order)
create or replace function get_abandoned_carts(hours_threshold int default 24)
returns table (
  cart_id uuid,
  customer_id uuid,
  customer_email text,
  customer_name text,
  session_id text,
  item_count bigint,
  total_value decimal,
  last_updated timestamptz
) language plpgsql as $$
begin
  return query
  select
    c.id as cart_id,
    c.customer_id,
    p.email as customer_email,
    p.full_name as customer_name,
    c.session_id,
    count(ci.id)::bigint as item_count,
    coalesce(sum(pr.price * ci.quantity), 0) as total_value,
    c.updated_at as last_updated
  from carts c
  join cart_items ci on ci.cart_id = c.id
  join products pr on pr.id = ci.product_id
  left join profiles p on p.id = c.customer_id
  where c.updated_at < now() - (hours_threshold || ' hours')::interval
    and not exists (
      select 1 from orders o
      where o.customer_id = c.customer_id
        and o.created_at > c.updated_at
    )
  group by c.id, c.customer_id, p.email, p.full_name, c.session_id, c.updated_at
  order by c.updated_at desc;
end;
$$;
