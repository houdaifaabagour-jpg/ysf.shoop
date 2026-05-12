# ysf.shoop — Project Specification

## Overview

**ysf.shoop** is a single-vendor e-commerce store specialized in watches and glasses. The project must include a complete storefront for customers and an internal admin panel for managing products, inventory, orders, media, and store settings.[cite:54][cite:11]

The project should be built as a modern web application using a headless-friendly architecture so that the catalog, checkout flow, and admin operations can evolve later without rebuilding the project from scratch.[cite:30][cite:57]

## Business Goal

The primary goal is to launch a production-ready MVP that can publish products, receive real orders, support Cash on Delivery (COD), and let the store owner manage daily operations from one system.[cite:81][cite:82][cite:85]

The secondary goal is to keep the system flexible enough to support future expansion into more accessories, more categories, multilingual content, advanced search, wishlist behavior tracking, and richer marketing features without changing the core architecture.[cite:86][cite:87][cite:93]

## Scope

### In Scope

- Public storefront.
- Product listing and category pages.
- Product details pages.
- Variants such as color, model, and size where applicable.
- Search and filtering.
- Shopping cart.
- Checkout via Cash on Delivery (COD) in MVP.
- Customer account basics.
- Admin panel.
- Product and category management.
- Inventory management.
- Order management.
- Store settings.
- Deployment to production.[cite:54][cite:58][cite:43]

### Out of Scope for MVP

- Marketplace with multiple sellers.
- Native mobile apps.
- Advanced loyalty systems.
- Multi-warehouse logistics.
- Full ERP integration.
- Complex promotion engines.
- AI-generated product descriptions in production flows.[cite:57][cite:67]

## User Roles

| Role | Description | Main Permissions |
|---|---|---|
| Visitor | Anonymous shopper | Browse catalog, search, filter, add to cart, checkout [cite:54] |
| Customer | Authenticated shopper | Manage profile, view order history [cite:54] |
| Admin | Store owner or manager | Full access to catalog, orders, settings, and dashboard [cite:11][cite:43] |
| Staff | Optional internal operator | Limited access to orders and catalog operations [cite:43] |

## Functional Requirements

### Storefront

- Home page with featured products, new arrivals, and category entry points.[cite:54]
- Shop page with search, filters, sorting, and pagination or load more.[cite:54][cite:57]
- Product details page with images, variant selection, price, availability, and related products.[cite:54]
- Shopping cart with quantity updates and item removal.[cite:54]
- Checkout confirmation flow for Cash on Delivery orders with clear next steps.[cite:81][cite:82]
- Success and cancel pages after payment flow.[cite:58]

### Catalog

- Products must support title, slug, description, price, compare-at price, stock status, media, category, and variant definitions.
- Variants must support attributes relevant to watches and glasses, such as color or frame style.
- Categories must support nesting or at least top-level grouping for watches and glasses.[cite:57][cite:71]

### Admin

- Secure admin login.
- Product CRUD.
- Category CRUD.
- Variant and inventory editing.
- Media upload and association.
- Order list and order status updates.
- Store settings management.[cite:11][cite:43]

### Payment and Orders

- Order draft must be created before confirming a COD order.
- Product price and shipping rate must be validated on the server before creating the final order.
- COD orders must support verification-friendly fields such as phone number, address, city, country, and delivery notes.
- Order statuses must support COD operational flow such as pending confirmation, confirmed, packed, shipped, delivered, refused, and returned.[cite:81][cite:82][cite:85]

### Extended Features

- Reviews must allow customers to rate and comment on purchased products, with moderation controls in admin.[cite:90]
- Wishlist must let authenticated users save products for later and optionally feed analytics for demand signals.[cite:87][cite:93]
- Coupons must support rules such as fixed discount, percentage discount, validity window, usage limits, and minimum order amount.[cite:67]
- Multi-language support must cover routing, translated UI labels, and translatable product content.[cite:86][cite:92]
- Search should support stronger relevance than a basic keyword filter and remain extensible for future indexing.[cite:86]
- Shipping must support country-based zones and configurable rates.[cite:94]
- Customer order tracking must expose a readable status timeline from order creation to delivery attempt.[cite:83][cite:85]
- Analytics must provide revenue, orders, low-stock items, and product performance charts in admin.[cite:87][cite:93]

## Non-Functional Requirements

- Responsive layout for mobile and desktop.
- Secure authentication and authorization.
- RLS-enabled database access for protected tables.
- Fast product pages and optimized images.
- Clean code organization for incremental development.
- Deployable on Vercel with production environment variables configured securely.[cite:43][cite:56][cite:54]

## Main Pages

| Route | Purpose |
|---|---|
| `/` | Home page |
| `/shop` | Product listing |
| `/category/[slug]` | Category listing |
| `/product/[slug]` | Product details |
| `/cart` | Shopping cart |
| `/checkout/success` | Successful payment return |
| `/checkout/cancel` | Cancelled payment return |
| `/account` | Customer account |
| `/account/orders` | Customer orders |
| `/admin` | Admin dashboard |
| `/admin/products` | Product management |
| `/admin/orders` | Order management |
| `/admin/categories` | Category management |
| `/admin/settings` | Store settings |

## Success Criteria

The MVP is successful when a visitor can browse products, add items to the cart, place a Cash on Delivery order, receive clear order-status communication, and the admin can view and manage that order in the dashboard.[cite:81][cite:82][cite:85]

The project is also considered successful when product management, inventory handling, and deployment are stable enough for day-to-day store operations.[cite:11][cite:43]
