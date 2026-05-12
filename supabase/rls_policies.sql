-- RLS Policies for ysf.shoop

-- Profiles: users can read/update own profile; admins can read all
create policy "profiles_own_select" on profiles for select using (auth.uid() = id);
create policy "profiles_own_update" on profiles for update using (auth.uid() = id);
create policy "profiles_admin_all" on profiles for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Categories: public read; admin write
create policy "categories_public_select" on categories for select using (is_active = true);
create policy "categories_admin_all" on categories for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Products: public read active; admin write
create policy "products_public_select" on products for select using (is_active = true);
create policy "products_admin_all" on products for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Product variants: public read active; admin write
create policy "variants_public_select" on product_variants for select using (is_active = true);
create policy "variants_admin_all" on product_variants for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Product images: public read; admin write
create policy "images_public_select" on product_images for select using (true);
create policy "images_admin_all" on product_images for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Carts: own cart only; admin read all
create policy "carts_own_select" on carts for select using (customer_id = auth.uid());
create policy "carts_own_insert" on carts for insert with check (customer_id = auth.uid());
create policy "carts_own_update" on carts for update using (customer_id = auth.uid());
create policy "carts_own_delete" on carts for delete using (customer_id = auth.uid());
create policy "carts_admin_all" on carts for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Cart items: via own cart
create policy "cart_items_own_all" on cart_items for all using (
  exists (select 1 from carts where carts.id = cart_items.cart_id and carts.customer_id = auth.uid())
);
create policy "cart_items_admin_all" on cart_items for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Orders: own or admin
create policy "orders_own_select" on orders for select using (customer_id = auth.uid());
create policy "orders_admin_all" on orders for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Order items: via own orders or admin
create policy "order_items_own_select" on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.customer_id = auth.uid())
);
create policy "order_items_admin_all" on order_items for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Order statuses: own or admin
create policy "order_statuses_own_select" on order_statuses for select using (
  exists (select 1 from orders where orders.id = order_statuses.order_id and orders.customer_id = auth.uid())
);
create policy "order_statuses_admin_all" on order_statuses for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Coupons: public can read active; admin write
create policy "coupons_public_select" on coupons for select using (is_active = true);
create policy "coupons_admin_all" on coupons for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Store settings: public read (non-sensitive); admin write
create policy "settings_public_select" on store_settings for select using (true);
create policy "settings_admin_all" on store_settings for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Reviews: public read approved; own insert; admin all
create policy "reviews_public_select" on reviews for select using (is_approved = true);
create policy "reviews_own_insert" on reviews for insert with check (customer_id = auth.uid());
create policy "reviews_admin_all" on reviews for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Wishlist: own only; admin read
create policy "wishlist_own_all" on wishlist_items for all using (customer_id = auth.uid());
create policy "wishlist_admin_select" on wishlist_items for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
