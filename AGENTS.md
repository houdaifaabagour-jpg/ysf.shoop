<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ysf.shoop — Agent Instructions

## Mission
Build **ysf.shoop** as a production-oriented MVP e-commerce application for watches and glasses.

## Mandatory Stack
- Next.js App Router | React | TypeScript | Tailwind CSS | Supabase | COD | Vercel

## Working Rules
- Do not change the technology stack without explicit approval.
- Do not introduce online payment gateways in MVP.
- Do not redesign the architecture into microservices during MVP.
- Do not expose secrets or privileged keys to client-side code.

## Execution Method
1. Read the current task from the backlog.
2. Check all dependencies before implementation.
3. Implement the smallest useful vertical slice.
4. List changed files.
5. Explain why each change was made.
6. State exactly what should be tested manually.
7. Stop after completing the requested scope.

## Architecture Boundaries
- Keep the project as one modular monolith during MVP.
- Use server-side validation for COD checkout values, shipping values, and order totals.
- Use Supabase Auth and RLS for identity and access control.
- Keep catalog, cart, checkout, account, and admin as distinct feature areas.

## Priority Order
1. Setup and environment.
2. Database schema and auth.
3. Catalog.
4. Cart.
5. COD checkout, shipping, and tracking.
6. Admin, reviews, wishlist, coupons, analytics, and search improvements.
7. Multi-language support and production hardening.

## Review Standard
A task is complete when it satisfies the acceptance criteria, respects dependencies, and does not violate security or architecture constraints.
