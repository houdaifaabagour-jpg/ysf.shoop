-- Safely create public SELECT policies for guest storefront users
-- This ensures guests can fetch categories, products, variants, images, settings, reviews, and coupons.

-- 1. Categories
drop policy if exists "categories_public_select" on categories;
create policy "categories_public_select" on categories for select using (is_active = true);

-- 2. Products
drop policy if exists "products_public_select" on products;
create policy "products_public_select" on products for select using (is_active = true);

-- 3. Product variants
drop policy if exists "variants_public_select" on product_variants;
create policy "variants_public_select" on product_variants for select using (is_active = true);

-- 4. Product images
drop policy if exists "images_public_select" on product_images;
create policy "images_public_select" on product_images for select using (true);

-- 5. Coupons
drop policy if exists "coupons_public_select" on coupons;
create policy "coupons_public_select" on coupons for select using (is_active = true);

-- 6. Store settings
drop policy if exists "settings_public_select" on store_settings;
create policy "settings_public_select" on store_settings for select using (true);

-- 7. Reviews
drop policy if exists "reviews_public_select" on reviews;
create policy "reviews_public_select" on reviews for select using (is_approved = true);
