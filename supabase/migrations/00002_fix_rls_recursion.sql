-- Fix infinite RLS recursion by using a security definer function for admin checks
-- See: https://github.com/orgs/supabase/discussions/15241

-- Security definer function to check admin role without triggering RLS recursion
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

do $$ begin

-- Drop old admin policies that cause recursion
drop policy if exists "profiles_admin_all" on profiles;
drop policy if exists "categories_admin_all" on categories;
drop policy if exists "products_admin_all" on products;
drop policy if exists "variants_admin_all" on product_variants;
drop policy if exists "images_admin_all" on product_images;
drop policy if exists "carts_admin_all" on carts;
drop policy if exists "cart_items_admin_all" on cart_items;
drop policy if exists "orders_admin_all" on orders;
drop policy if exists "order_items_admin_all" on order_items;
drop policy if exists "order_statuses_admin_all" on order_statuses;
drop policy if exists "coupons_admin_all" on coupons;
drop policy if exists "settings_admin_all" on store_settings;
drop policy if exists "reviews_admin_all" on reviews;
drop policy if exists "wishlist_admin_select" on wishlist_items;

-- Recreate using is_admin() function (no recursion)
create policy "profiles_admin_all" on profiles for all using (public.is_admin());
create policy "categories_admin_all" on categories for all using (public.is_admin());
create policy "products_admin_all" on products for all using (public.is_admin());
create policy "variants_admin_all" on product_variants for all using (public.is_admin());
create policy "images_admin_all" on product_images for all using (public.is_admin());
create policy "carts_admin_all" on carts for all using (public.is_admin());
create policy "cart_items_admin_all" on cart_items for all using (public.is_admin());
create policy "orders_admin_all" on orders for all using (public.is_admin());
create policy "order_items_admin_all" on order_items for all using (public.is_admin());
create policy "order_statuses_admin_all" on order_statuses for all using (public.is_admin());
create policy "coupons_admin_all" on coupons for all using (public.is_admin());
create policy "settings_admin_all" on store_settings for all using (public.is_admin());
create policy "reviews_admin_all" on reviews for all using (public.is_admin());
create policy "wishlist_admin_select" on wishlist_items for select using (public.is_admin());

end $$;
