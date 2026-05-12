# ysf.shoop — Technical Plan

## Architecture Summary

The recommended stack for **ysf.shoop** is Next.js App Router for the web application, TypeScript for application logic, Tailwind CSS for UI styling, Supabase for database, authentication, and storage, and Vercel for deployment, with Cash on Delivery as the initial payment method.[cite:30][cite:43][cite:81]

This stack is suitable for a modern e-commerce MVP because it supports fast storefront development, secure server-side operations, COD order handling, and production deployment without requiring a heavy custom backend from day one.[cite:54][cite:57][cite:81]

## Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | Next.js App Router + React + TypeScript | Modern routing, server capabilities, reusable UI [cite:30][cite:54] |
| Styling | Tailwind CSS | Fast UI composition and design system consistency [cite:54] |
| Database | Supabase Postgres | Structured relational catalog and order model [cite:43] |
| Auth | Supabase Auth | Simple customer and admin authentication [cite:43] |
| Storage | Supabase Storage | Product image storage for MVP [cite:43] |
| Payments | Cash on Delivery workflow | Lower initial integration complexity and good local-market fit when paired with strong status management [cite:81][cite:82][cite:85] |
| Hosting | Vercel | Easy deployment for Next.js applications [cite:30] |

## Code Organization

The project should start as a modular monolith. This means one codebase, one web app, and clear internal separation by business feature instead of splitting into multiple services too early.[cite:54][cite:57]

Suggested structure:

```text
src/
  app/
  components/
  features/
    catalog/
    cart/
    checkout/
    account/
    admin/
  lib/
    supabase/
    stripe/
    auth/
    validation/
  types/
  actions/
```

## Data Model

Core tables should include:

- `profiles`
- `products`
- `product_variants`
- `product_images`
- `categories`
- `inventory_movements`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `coupons`
- `store_settings`
- `admin_roles`

The catalog must be designed so that watches and glasses can each have category-specific attributes without forcing a full schema redesign later.[cite:57][cite:71]

## Authentication and Authorization

Supabase Auth should manage both customer sessions and admin sessions. Role checks must be enforced server-side for admin routes and sensitive write actions.[cite:43][cite:56]

RLS policies must be enabled for customer-owned and admin-managed data, because production guidance for Supabase emphasizes secure policy design before launch.[cite:43][cite:56]

## Checkout Flow

The COD order flow must follow this order:[cite:81][cite:82][cite:85]

1. Customer adds items to cart.
2. Server validates current product prices, shipping zone, and availability.
3. Customer submits COD checkout form with delivery details.
4. Server creates the order in pending confirmation state.
5. Admin or workflow confirms the order.
6. Order status moves through packed, shipped, delivered, refused, or returned states.
7. Inventory and operational reporting are updated as statuses change.

## Deployment Plan

- Source control via GitHub.
- Automatic deployment through Vercel.
- Environment variables separated between local and production.
- Supabase production checklist review before launch.
- Courier and COD workflow readiness review before launch.[cite:30][cite:43][cite:81]

## Security Rules

- Never expose service role keys to the client.[cite:43]
- Never trust client-side prices or shipping values for order creation.[cite:81]
- Never mark a COD order as delivered or collected without explicit operational status update. [cite:85]
- Protect all admin pages with server-side checks.[cite:43]
- Keep media upload permissions restricted to authorized users where applicable.[cite:43]

## Delivery Strategy

Development should proceed in this order:

1. Project setup.
2. Database schema and auth.
3. Catalog and product pages.
4. Cart and order draft logic.
5. COD checkout, shipping logic, and customer tracking.
6. Admin panel, analytics, reviews, wishlist, and coupons.
7. Production hardening, i18n, search improvements, and deployment.[cite:54][cite:43][cite:86]

## Additional Feature Architecture

- Multi-language support should use locale-aware routing in Next.js and a translation strategy for UI strings and product content.[cite:86][cite:92]
- Wishlist should store authenticated user-product relations and optionally surface insights for merchandising decisions.[cite:87][cite:93]
- Reviews should be tied to products and ideally linked to verified orders or moderated workflows.[cite:90]
- Analytics should include dashboards for revenue, orders, product trends, wishlist signals, and low-stock alerts.[cite:87][cite:93]
- Search should start with structured database querying and remain extensible for stronger relevance logic later.[cite:86]
- Shipping logic should include country zones, rates, and COD-specific operational statuses.[cite:83][cite:94]
