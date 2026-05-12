export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: "customer" | "admin" | "staff";
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  category?: Category;
  variants?: ProductVariant[];
  images?: ProductImage[];
};

export type ProductVariant = {
  id: string;
  product_id: string;
  sku: string;
  label: string;
  attributes: Record<string, string>;
  price_override: number | null;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  variant_id: string | null;
  url: string;
  alt: string | null;
  sort_order: number;
  created_at: string;
};

export type Cart = {
  id: string;
  customer_id: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
};

export type CartItem = {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  created_at: string;
  product?: Product;
  variant?: ProductVariant;
};

export type OrderStatus = "pending_confirmation" | "confirmed" | "packed" | "shipped" | "delivered" | "refused" | "returned" | "cancelled";

export type Order = {
  id: string;
  customer_id: string | null;
  status: OrderStatus;
  total: number;
  shipping_cost: number;
  shipping_address: Record<string, string>;
  phone: string;
  delivery_notes: string | null;
  coupon_id: string | null;
  discount: number;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  status_history?: OrderStatusLog[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  title: string;
  variant_label: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type OrderStatusLog = {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  created_at: string;
};

export type Coupon = {
  id: string;
  code: string;
  type: "fixed" | "percentage";
  value: number;
  min_order_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
};

export type Review = {
  id: string;
  product_id: string;
  customer_id: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  profile?: Profile;
};

export type WishlistItem = {
  id: string;
  customer_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
};

export type StoreSetting = {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
};
