---
name: ysf.shoop
description: Luxury watches and glasses e-commerce
colors:
  primary: "#1B2A4A"
  primary-light: "#2A4066"
  accent: "#C9A84C"
  accent-light: "#D4BA6A"
  accent-dark: "#A08530"
  neutral-bg: "#FDFBF7"
  neutral-warm: "#F9F7F4"
  neutral-muted: "#F5F3EF"
  neutral-text: "#1A1A1A"
  neutral-text-muted: "#6B6B6B"
  neutral-border: "#E8E4DC"
  neutral-border-light: "#F0EDE7"
  danger: "#DC2626"
  success: "#16A34A"
  glass-bg: "rgba(255, 255, 255, 0.85)"
  glass-border: "rgba(201, 168, 76, 0.15)"
typography:
  display:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.05
  headline:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.15
  title:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.01em"
  small:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.3
rounded:
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  full: "9999px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2.5rem"
  xl: "4rem"
  section: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "0.75rem 1.75rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-light}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "0.75rem 1.75rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "0.75rem 1.75rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "0.5rem 1rem"
  card:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  input:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.sm}"
    padding: "0.625rem 1rem"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.full}"
    padding: "0.5rem 1rem"
  nav-item-active:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "0.5rem 1rem"
---

# Design System: ysf.shoop

## 1. Overview

**Creative North Star: "The Quiet Prestige"**

ysf.shoop is a functional e-commerce interface for luxury watches and glasses in the Middle East. The design serves the product without competing with it. Every pixel earns its place through restraint: generous whitespace, a refined navy-and-cream palette, and gold used as a deliberate accent rather than decoration.

The system rejects the tropes of fast fashion e-commerce — no countdown timers, no flashing badges, no urgency patterns. Instead, it communicates quality through calm: clear hierarchy, consistent spacing, and interactions that feel solid and considered. The interface disappears into the task of browsing and purchasing.

Polaris (Shopify's design system) informs the functional clarity of the commerce flows. The luxury register sets the atmosphere. The two together create a store that feels both trustworthy and exclusive.

**Key Characteristics:**
- Calm, unhurried browsing experience
- Product imagery leads; UI steps back
- Consistent, predictable interaction patterns
- Gold as a rare accent, never as decoration
- Generous spacing with purposeful density where needed (admin, order details)

## 2. Colors

The palette centers on deep navy (trust, stability), warm cream (approachable luxury), and a restrained gold accent (exclusivity). The one accent rule keeps gold rare enough that it signals importance.

### Primary
- **Deep Navy** (`#1B2A4A`): Primary actions, navigation backgrounds, headings. Conveys stability and craftsmanship.
- **Navy Light** (`#2A4066`): Hover state for primary buttons, selected states.

### Accent
- **Warm Gold** (`#C9A84C`): Primary CTA on dark backgrounds, price display, star ratings, selected indicators. Use on ≤5% of any given screen. Rarity is the point.
- **Gold Light** (`#D4BA6A`): Hover state for gold elements, subtle highlights.
- **Gold Deep** (`#A08530`): Active/disabled state for gold elements.

### Neutral
- **Warm Cream** (`#FDFBF7`): Page background. Slightly warm tint distinguishes from sterile white.
- **Warm Tone** (`#F9F7F4`): Secondary surface (cards on cream, sidebars, containers).
- **Muted Tone** (`#F5F3EF`): Tertiary surface, hover states, skeleton backgrounds.
- **Warm Ash** (`#E8E4DC`): Borders, dividers, subtle separators.
- **Light Ash** (`#F0EDE7`): Lighter borders, input resting borders.
- **Deep Text** (`#1A1A1A`): Body text, headings. High contrast on cream backgrounds.
- **Muted Text** (`#6B6B6B`): Secondary text, placeholders, metadata.
- **White** (`#FFFFFF`): Card surfaces, glass backgrounds, elevated containers.

### Semantic
- **Red** (`#DC2626`): Errors, stock warnings, destructive actions.
- **Green** (`#16A34A`): Success, in-stock, confirmed states, delivered.

### Glass
- **Glass White** (`rgba(255, 255, 255, 0.85)`): Navbar, floating panels.
- **Glass Gold Edge** (`rgba(201, 168, 76, 0.15)`): Glass element borders, subtle gold glow.

## 3. Typography

**Display & Body Font:** Geist Sans (`var(--font-geist-sans)`) with system-ui fallback.

One family serves all roles. Geist provides the geometric clarity that luxury product pages need paired with the readability that checkout and admin demand. No serif pairing: the products themselves are decorative enough.

### Hierarchy
- **Display** (700, `clamp(2rem, 5vw, 3.5rem)`, 1.05): Hero headlines, section titles on home and category pages. Letter-spacing: `-0.02em` for large sizes.
- **Headline** (600, `clamp(1.5rem, 3vw, 2.25rem)`, 1.15): Section headings, product titles on listing pages.
- **Title** (600, `1.125rem`, 1.3): Card titles, product names, admin section headers.
- **Body** (400, `0.9375rem`, 1.6): Product descriptions, paragraphs, most running text. Capped at 70ch for readability.
- **Label** (500, `0.8125rem`, 1.2, `0.01em`): Button text, form labels, nav links, tags, metadata, table headers.
- **Small** (400, `0.75rem`, 1.3): Captions, footnotes, timestamps, secondary metadata.

**Max line length:** 70ch for product descriptions and content. Compact layouts (tables, data rows, admin panels) can run denser.

**RTL:** Arabic text uses the same Geist stack with `"Segoe UI", Tahoma` fallback for wider glyph support. Scale and weights carry across.

## 4. Elevation

The system is flat by default. Depth is created through color and tonal layering (cream → warm → white card), not through shadows. Shadows appear only as a response to state: hover, focus, and temporary elevation (dropdowns, modals).

- **Tonal layering** is the primary depth mechanism. Cards sit on cream backgrounds through white contrast. Modals and dialogs sit on a semi-transparent backdrop.
- **Shadows** are reserved for interactive state changes. A card hover, a button press, a dropdown menu — these earn shadow, not resting surfaces.

### Shadow Vocabulary
- **Card hover** (`0 8px 32px rgba(0, 0, 0, 0.08)`): Subtle lift on interactive cards.
- **Dropdown** (`0 4px 24px rgba(0, 0, 0, 0.1)`): Menus, popovers, select dropdowns.
- **Modal** (`0 12px 48px rgba(0, 0, 0, 0.15)`): Dialog boxes, side panels.
- **Gold glow** (`0 0 20px rgba(201, 168, 76, 0.2)`): Active gold elements, CTA hover state.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. A shadow must be earned by state. If a card looks elevated while static, the shadow is too strong.

## 5. Components

### Buttons
- **Shape:** Fully rounded pills (`border-radius: 9999px`).
- **Primary (Navy):** Deep navy background, white text. On hover, navy-light background + `translateY(-2px)` lift + subtle shadow. Active: `scale(0.98)` press. Transition: 300ms cubic-bezier.
- **Secondary (Outline):** Transparent background, navy text + 1px warm-ash border. On hover, muted background + gold border. Same lift/press.
- **Ghost (Text):** Transparent background, navy text. On hover, muted background. No lift. For secondary actions within cards.
- **Gold:** Gold background, white text. Used only for the primary CTA on dark backgrounds (hero banners, dark sections). On hover: gold-deep.

### Cards & Containers
- **Corner Style:** 1rem (`rounded-md`) for product cards, 0.75rem (`rounded-sm`) for admin panels, 1.5rem (`rounded-lg`) for featured/hero cards.
- **Background:** White on cream. No shadow at rest.
- **Border:** None for product cards (full reliance on tonal contrast). Subtle 1px warm-ash for admin panels.
- **Internal Padding:** 1.5rem (`spacing.md`) default, 1rem (`spacing.sm`) for compact layouts.
- **Hover:** Product cards get a subtle shadow lift (`box-shadow: var(--shadow-hover)`) + `translateY(-2px)` on hover.

### Inputs / Fields
- **Style:** 1px light-ash border, white background, 0.75rem radius.
- **Focus:** Navy border (1.5px) + subtle gold glow. No ring offset.
- **Label:** Small (0.8125rem) above the field, 500 weight, muted-text color.
- **Error:** Red border + red label + inline error message below.
- **Disabled:** Muted background, muted-text, no border change.
- **Placeholder:** Muted-text at 400 weight, 0.875rem size.

### Navigation (Storefront header)
- **Style:** Floating glass pill (`backdrop-blur(20px)`, white 85% opacity, gold-tinged border). Detached from top edge with `mt-4`, centered, `w-max` on desktop.
- **Logo:** Bold display-weight brand name in navy.
- **Links:** Label-weight, navy text. Active/location indicator uses pill-shaped navy background.
- **Mobile:** Hamburger morphs to X, full-screen glass overlay with staggered link reveal.
- **Hover:** Subtle muted background on nav items.

### Navigation (Admin sidebar)
- **Style:** Fixed left sidebar, warm-tone background, full height.
- **Links:** Label-weight, full-width, rounded hover background.
- **Active:** Navy pill background + white text.
- **Mobile:** Collapsed to bottom tab bar with icons only.

### Chips / Tags
- **Style:** Small pill (`border-radius: 9999px`), muted background + muted text.
- **Selected:** Navy background + white text.
- **Filter chips:** Outline style (1px border) when unselected, filled navy when selected.

### Star Rating
- Gold stars, 5-point scale. Numeric average displayed alongside in small weight.

## 6. Do's and Don'ts

### Do:
- **Do** let product imagery lead. The largest viewport area belongs to the product photo.
- **Do** use gold sparingly — price, star rating, primary CTA on dark. Nothing else.
- **Do** maintain consistent spacing rhythm. Same padding between related items signals relationship.
- **Do** use tonal layering (cream → warm → white) for depth before reaching for shadows.
- **Do** keep buttons pill-shaped and consistent across the entire surface.
- **Do** show skeleton states for loading content, not spinners.
- **Do** treat empty states as teaching moments: "Add your first product" with a CTA.

### Don't:
- **Don't** use gold as decoration — no gold borders on non-interactive elements, no gold dividers, no gold icons that aren't interactive.
- **Don't** use glassmorphism on scrolling content. `backdrop-blur` is for fixed/sticky elements only.
- **Don't** animate layout properties (`top`, `left`, `width`, `height`). Use `transform` and `opacity` only.
- **Don't** use urgency patterns (countdown timers, "only X left", flashing badges).
- **Don't** use display fonts in UI labels, buttons, or form controls.
- **Don't** use side-stripe borders (`border-left` / `border-right` > 1px as accent).
- **Don't** use gradient text (`background-clip: text`).
- **Don't** nest cards inside cards.
- **Don't** use identical card grids repeated endlessly. Vary card sizes where content warrants it.
- **Don't** reinvent standard affordances. Use familiar form controls, navigation patterns, and interaction models.
- **Don't** use bounce or elastic easings. Stick to exponential ease-out curves.
