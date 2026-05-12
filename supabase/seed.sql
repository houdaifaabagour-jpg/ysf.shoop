-- Seed categories
insert into categories (name, slug, description, sort_order) values
  ('Watches', 'watches', 'Premium timepieces for every occasion', 1),
  ('Glasses', 'glasses', 'Designer eyewear and frames', 2),
  ('Smartwatches', 'smartwatches', 'Connected watches with smart features', 3),
  ('Sunglasses', 'sunglasses', 'Stylish sunglasses for all seasons', 4);

-- Seed products (watches)
insert into products (title, slug, description, price, compare_at_price, category_id, is_featured, tags)
values
  ('Classic Chronograph', 'classic-chronograph', 'A timeless chronograph watch with leather strap and sapphire crystal.', 299.99, 399.99, (select id from categories where slug = 'watches'), true, '{"bestseller","leather","analog"}'),
  ('Minimalist Silver', 'minimalist-silver', 'Clean silver dial with ultra-thin case, perfect for daily wear.', 189.99, null, (select id from categories where slug = 'watches'), true, '{"minimalist","daily"}'),
  ('Diver Pro 300', 'diver-pro-300', 'Professional dive watch, 300m water resistance, unidirectional bezel.', 449.99, 549.99, (select id from categories where slug = 'watches'), false, '{"diver","sports","premium"}'),
  ('Aviator Pilot', 'aviator-pilot', 'Aviation-inspired pilot watch with GMT function and luminous markers.', 379.99, null, (select id from categories where slug = 'watches'), false, '{"aviator","gmt","luminous"}');

-- Seed products (glasses)
insert into products (title, slug, description, price, compare_at_price, category_id, is_featured, tags)
values
  ('Aviator Classic Gold', 'aviator-classic-gold', 'Gold-toned aviator sunglasses with gradient brown lenses.', 159.99, 219.99, (select id from categories where slug = 'glasses'), true, '{"aviator","gold","classic"}'),
  ('Wayfarer Matte Black', 'wayfarer-matte-black', 'Matte black wayfarer frames with anti-reflective lenses.', 129.99, null, (select id from categories where slug = 'glasses'), true, '{"wayfarer","matte","black"}'),
  ('Round Tortoise Shell', 'round-tortoise-shell', 'Vintage round frames in tortoise shell acetate.', 109.99, 149.99, (select id from categories where slug = 'glasses'), false, '{"round","vintage","tortoise"}'),
  ('Cat Eye Rose Gold', 'cat-eye-rose-gold', 'Elegant cat eye frames in rose gold with adjustable nose pads.', 179.99, null, (select id from categories where slug = 'glasses'), false, '{"cat-eye","rose-gold","elegant"}');

-- Seed variants for Classic Chronograph
insert into product_variants (product_id, sku, label, attributes, stock, price_override)
select id, 'CHR-BLK-BRN', 'Black Dial / Brown Strap', '{"color": "black", "strap": "brown leather"}', 15, null
from products where slug = 'classic-chronograph';

insert into product_variants (product_id, sku, label, attributes, stock, price_override)
select id, 'CHR-WHT-BLK', 'White Dial / Black Strap', '{"color": "white", "strap": "black leather"}', 10, null
from products where slug = 'classic-chronograph';

-- Seed variants for Aviator Classic Gold
insert into product_variants (product_id, sku, label, attributes, stock, price_override)
select id, 'AVG-GD-GR', 'Gold Frame / Gradient Lens', '{"frame": "gold", "lens": "gradient brown"}', 20, null
from products where slug = 'aviator-classic-gold';

insert into product_variants (product_id, sku, label, attributes, stock, price_override)
select id, 'AVG-GD-GR-M', 'Gold Frame / Mirror Lens', '{"frame": "gold", "lens": "mirror silver"}', 12, 179.99
from products where slug = 'aviator-classic-gold';

-- Seed store settings
insert into store_settings (key, value) values
  ('store_name', '"ysf.shoop"'),
  ('currency', '"USD"'),
  ('shipping_zones', '[{"name": "Domestic", "countries": ["US"], "rate": 9.99, "free_above": 100}, {"name": "International", "countries": ["*"], "rate": 24.99, "free_above": 200}]'),
  ('cod_settings', '{"enabled": true, "note": "Pay when you receive your order."}'),
  ('contact_email', '"hello@ysf.shoop"');
