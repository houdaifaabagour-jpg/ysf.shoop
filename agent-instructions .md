# ysf.shoop — Agent Instructions

## Mission

Build **ysf.shoop** as a production-oriented MVP e-commerce application for watches and glasses using the approved stack and architecture in this document set.[cite:54][cite:30]

## Mandatory Stack

Use only the following stack unless explicit approval is given to change it:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase
- Cash on Delivery checkout flow
- Vercel deployment target[cite:30][cite:43][cite:81]

## Working Rules

- Do not change the technology stack without explicit approval.[cite:75]
- Do not introduce online payment gateways in MVP unless explicitly requested later.[cite:81]
- Do not redesign the architecture into microservices during MVP.[cite:54][cite:57]
- Do not modify database schema casually after it is approved.
- Do not mark COD orders as delivered, refused, or collected without explicit operational status handling.[cite:85]
- Do not expose secrets or privileged keys to client-side code.[cite:43]

## Execution Method

Follow this process for every implementation cycle:[cite:68][cite:73][cite:75]

1. Read the current task from the backlog.
2. Check all dependencies before implementation.
3. Implement the smallest useful vertical slice.
4. List changed files.
5. Explain why each change was made.
6. State exactly what should be tested manually.
7. Stop after completing the requested scope.

## Required Output Format

For every task, provide:

- Task ID.
- Summary of the implementation.
- Files created or updated.
- Important architectural decisions.
- Manual test checklist.
- Any blockers or assumptions.

## Escalation Rules

Stop and ask for clarification before proceeding if any of the following happens:

- A task requires schema changes that affect existing flows.
- A COD operational rule, shipping rule, or order-status rule is unclear.
- A role or permission rule is ambiguous.
- A design choice changes the approved page structure.
- A new dependency is needed and is not already approved.[cite:73][cite:75]

## Architecture Boundaries

- Keep the project as one modular monolith during MVP.[cite:54][cite:57]
- Use server-side validation for COD checkout values, shipping values, and order totals.[cite:81][cite:94]
- Use Supabase Auth and RLS for identity and access control.[cite:43][cite:56]
- Keep catalog, cart, checkout, account, and admin as distinct feature areas.

## Quality Bar

- Code must be typed where practical.
- UI should be responsive.
- Main flows must work on mobile and desktop.
- Empty, loading, and error states should be handled.
- Changes should not break previous working flows.[cite:54][cite:43]

## Priority Order

Unless explicitly instructed otherwise, implement work in this order:

1. Setup and environment.
2. Database schema and auth.
3. Catalog.
4. Cart.
5. COD checkout, shipping, and tracking.
6. Admin, reviews, wishlist, coupons, analytics, and search improvements.
7. Multi-language support and production hardening.[cite:54][cite:43][cite:86]

## Review Standard

A task is not complete only because code exists. A task is complete when it satisfies the acceptance criteria, respects dependencies, and does not violate security or architecture constraints.[cite:63][cite:75]
