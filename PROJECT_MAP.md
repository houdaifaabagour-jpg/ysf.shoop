# ysf.shoop — Project Map

## [TECH_STACK]
| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 16.2.6 |
| UI | React | 19.2.6 |
| Language | TypeScript | 6.0.3 |
| Styling | Tailwind CSS | 4.3.0 |
| Database | Supabase (Postgres) | ^2.105.4 |
| Auth | Supabase Auth + SSR | ^0.10.3 |
| Storage | Supabase Storage | ^2.105.4 |
| Payment | Cash on Delivery (COD) | — |
| Hosting | Vercel | — |
| Validation | Zod | ^3.24 |

## [SYSTEM_FLOW]
```
Visitor → [/shop → filter/sort] → [/product/[slug] → variant + addToCart]
       → [/cart → update/remove] → [/checkout → COD form → server validation]
       → [/checkout/success] → Admin [/admin → dashboard → manage orders]

Auth: /signup → /login → Supabase Auth → RLS-enforced queries → profiles(role)
```

## [ARCHITECTURE]
```
src/
  app/                (storefront)/ (admin)/ — route groups with layouts
  features/           catalog/ cart/ checkout/ account/ admin/
  components/         storefront/ admin/ shared/
  lib/                supabase/ auth/ validation/ logging/
  types/              database.ts

supabase/
  migrations/00001_schema.sql   — all tables + enums
  seed.sql                      — sample products + variants
  rls_policies.sql              — row-level security policies
```

## [ROUTES BUILT]
| Route | Status | Description |
|---|---|---|
| `/` | ✅ | Home page with featured products |
| `/shop` | ✅ | Product listing with sort |
| `/category/[slug]` | ✅ | Category filter |
| `/product/[slug]` | ✅ | PDP with variants + addToCart |
| `/cart` | ✅ | Cart with quantity control |
| `/checkout` | ✅ | COD form + server validation |
| `/checkout/success` | ✅ | Order confirmation |
| `/checkout/cancel` | ✅ | Cancellation page |
| `/login` | ✅ | Sign in |
| `/signup` | ✅ | Create account |
| `/account` | ✅ | Profile view + sign out |
| `/account/orders` | ✅ | Order history |
| `/admin` | ✅ | Dashboard (revenue, orders, products) |
| `/admin/products` | ✅ | Product CRUD |
| `/admin/categories` | ✅ | Category CRUD |
| `/admin/orders` | ✅ | Order management + status transitions |
| `/admin/settings` | ✅ | Store settings management |

## [ORPHANS & PENDING]
- **Supabase Project** — ❌ إنشاء مشروع Supabase يدوياً، ثم وضع env vars في `.env.local`
- **Run SQL** — ❌ تشغيل `supabase/migrations/00001_schema.sql` + `seed.sql` + `rls_policies.sql` في Supabase SQL Editor
- **Variant editing in admin** — ⚠️ إضافة واجهة لتحرير variants في admin/products
- **Media upload UI** — ⚠️ ربط Supabase Storage برفع الصور من admin
- **Coupon management** — ⚠️ إدارة كوبونات (admin CRUD + checkout validation)
- **Reviews/Wishlist** — ⚠️ P2 features (schema exists, UI pending)
- **Related products** — ⚠️ أسفل PDP
- **Search improvements** — ⚠️ تحسين البحث عن exact-match
- **i18n** — ⚠️ تدويل

## [VERIFICATION]
- `npm run build` ✅ — جميع الـ 17 route تبني بنجاح
- جميع الصفحات الديناميكية تستخدم Server Actions و RLS
- جميع Server Actions تتحقق من auth/role قبل التنفيذ
