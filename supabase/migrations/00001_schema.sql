-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (syncs with auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table profiles enable row level security;

-- Categories
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  parent_id uuid references categories(id) on delete set null,
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table categories enable row level security;

-- Products
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  price decimal(10,2) not null check (price >= 0),
  compare_at_price decimal(10,2) check (compare_at_price >= 0),
  category_id uuid references categories(id) on delete set null,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table products enable row level security;

-- Product variants (color, size, model, frame style, etc.)
create table if not exists product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  sku text not null,
  label text not null,
  attributes jsonb not null default '{}',
  price_override decimal(10,2) check (price_override >= 0),
  stock int not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table product_variants enable row level security;

-- Product images
create table if not exists product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete set null,
  url text not null,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table product_images enable row level security;

-- Carts
create table if not exists carts (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references profiles(id) on delete set null,
  session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table carts enable row level security;

-- Cart items
create table if not exists cart_items (
  id uuid primary key default uuid_generate_v4(),
  cart_id uuid not null references carts(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete set null,
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz not null default now()
);
alter table cart_items enable row level security;

-- Coupons (must be before orders)
create table if not exists coupons (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  type text not null check (type in ('fixed', 'percentage')),
  value decimal(10,2) not null check (value > 0),
  min_order_amount decimal(10,2) check (min_order_amount >= 0),
  usage_limit int check (usage_limit > 0),
  used_count int not null default 0,
  is_active boolean not null default true,
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
alter table coupons enable row level security;

-- Orders
do $$ begin
  create type order_status as enum (
    'pending_confirmation', 'confirmed', 'packed', 'shipped', 'delivered',
    'refused', 'returned', 'cancelled'
  );
exception when duplicate_object then null;
end $$;

create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references profiles(id) on delete set null,
  status order_status not null default 'pending_confirmation',
  total decimal(10,2) not null check (total >= 0),
  shipping_cost decimal(10,2) not null default 0 check (shipping_cost >= 0),
  shipping_address jsonb not null,
  phone text not null,
  delivery_notes text,
  coupon_id uuid references coupons(id) on delete set null,
  discount decimal(10,2) not null default 0 check (discount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table orders enable row level security;

-- Order items
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete set null,
  title text not null,
  variant_label text,
  quantity int not null check (quantity > 0),
  unit_price decimal(10,2) not null check (unit_price >= 0),
  total_price decimal(10,2) not null check (total_price >= 0)
);
alter table order_items enable row level security;

-- Order status timeline
create table if not exists order_statuses (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  status order_status not null,
  note text,
  created_at timestamptz not null default now()
);
alter table order_statuses enable row level security;

-- Store settings
create table if not exists store_settings (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table store_settings enable row level security;

-- Reviews (P2 but schema upfront for data integrity)
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  customer_id uuid not null references profiles(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  unique(product_id, customer_id)
);
alter table reviews enable row level security;

-- Wishlist (P2)
create table if not exists wishlist_items (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(customer_id, product_id)
);
alter table wishlist_items enable row level security;
