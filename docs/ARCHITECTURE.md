# AAF Custom Furniture — Architecture and Integration Plan (Phase 2)

Status: planning. No theme code changed in this phase. Baseline `shopify theme check`: 39 files, 0 offenses.

## 1. Tooling status

| Item | Status |
|---|---|
| Shopify CLI | 5.0.2 (works in PowerShell; Git Bash cannot find `node`) |
| Node | 22.23.5 |
| `learn_shopify_api` | Not exposed in this environment. The Shopify AI Toolkit skill (`shopify-plugin:shopify`, v2.1.2) was loaded instead. Topics read: `liquid`, `custom-data`. Docs searched via `search_docs.mjs`. |
| Dev store / `shopify theme dev` | Not connected. Needs `shopify auth login` and a store domain. |
| Validation | `shopify theme check` plus the toolkit `validate.mjs --api liquid` per file set. |

## 2. Principles (from AGENTS.md and the Liquid reference)

- Build as sections, blocks and snippets. Templates are JSON and merchant-composable.
- Snippets and statically rendered blocks carry a `{% doc %}` header.
- CSS and JS live in `{% stylesheet %}` / `{% javascript %}` in each component. Only `critical.css` is global. Liquid is not rendered inside those tags, so per-instance values go through CSS variables set inline.
- Every user-facing string uses `| t` with keys in `locales/en.default.json` (max 3 levels, snake_case, sentence case). Schema labels use `t:` keys in `en.default.schema.json`.
- Single-property settings use CSS variables. Multi-property settings use CSS classes.
- Metafield reads happen once, outside loops. Essential content is rendered server-side in Liquid and enhanced with small scripts.
- No JS or CSS libraries. Native web components and `<dialog>` / `<details>`.

## 3. Page map

| Page | Template | Main sections |
|---|---|---|
| Home | `index.json` | hero, featured-collections, featured-products, custom-intro, craftsmanship, editorial-gallery, brand-story, testimonials, newsletter |
| Ready-stock collection | `collection.json` | collection-banner, main-collection (filters, sort, grid) |
| Collection list | `list-collections.json` | collection-grid |
| Product | `product.json` | main-product, product-specs, product-recommendations |
| Cart | `cart.json` plus drawer | main-cart, cart-drawer (global, in layout) |
| Search | `search.json` | main-search (predictive search in header) |
| Custom furniture landing | `page.custom-furniture.json` | custom-hero, custom-categories, process-steps, material-showcase, inspiration-gallery, custom-cta |
| Custom enquiry | `page.custom-enquiry.json` | custom-enquiry (multi-step form) |
| About / Craftsmanship / Materials | `page.json` or alternates | image-with-text, brand-story, material-showcase, craftsmanship |
| Contact | `page.contact.json` | contact-form |
| FAQ | `page.faq.json` | faq |
| Shipping, Returns, Privacy, Terms | `page.json` | rich text, policy content from Shopify admin |
| 404, account, password, gift card | existing | restyle only |

## 4. Component plan

Snippets: `product-card`, `price`, `badges`, `variant-picker`, `quantity-selector`, `breadcrumbs`, `icon`, `responsive-image` (extend existing `image`), `button`, `section-heading`.

Blocks: `heading`, `text`, `button`, `image`, `group` (exists), `testimonial`, `faq-item`, `process-step`, `material-card`.

JS (in `assets/`, loaded per section): `cart-drawer`, `variant-picker`, `product-gallery`, `mega-menu`, `enquiry-form`.

Global settings (`settings_schema.json`): colour schemes (ivory, cream, walnut, charcoal), heading font (serif) and body font (sans), spacing scale, page width, button style, radius (near zero), animation toggle.

## 5. Data model

### Ready stock (all in Shopify admin)
- Products, variants, inventory, collections and prices come from Shopify.
- Product metafields (namespace `custom`), created in admin or via CLI `store execute` on a named store:

| Key | Type | Use |
|---|---|---|
| `material` | list of metaobject reference to `material` | Spec and swatches |
| `dimensions` | multi-line text | Specs |
| `finish` | single line text | Specs |
| `lead_time` | single line text | Delivery info |
| `care_instructions` | rich text | Specs |
| `delivery_note` | rich text | Product page |

### Custom furniture (extendable)
Metaobject definitions:

- `material`: name, type (wood, upholstery, finish), swatch image, colour, description.
- `custom_category`: name, handle, image, description, furniture types (list of text), available materials (list of `material`), min/max dimensions.
- `testimonial`: author, location, quote, rating.

New categories or materials are new metaobject entries, so no code change. The enquiry form reads `custom_category` entries on the page.

Note: the toolkit `custom-data` guidance targets app-owned definitions in `shopify.app.toml`. This project is a theme with no app, so definitions are merchant-owned (`custom` namespace) and made in the admin or through the Admin API on a named store.

## 6. Custom enquiry delivery

Findings from Shopify docs:
- The `{% form 'contact' %}` tag accepts extra `contact[...]` fields. They are emailed to the store's customer email and listed in admin. It has no file upload.
- A file input inside `{% form 'product' %}` with `properties[...]` uploads to Shopify CDN as a line item property. This needs a product to add to the cart, and the file goes with an order, not an enquiry.

| Option | Uploads | Cost | Notes |
|---|---|---|---|
| A. Native contact form, with a reference-image URL field | No (links only) | Free | No external dependency. **Default for Phase 6.** |
| B. Shopify Forms app | Yes | Free app | Merchant installs it, then the theme embeds the app block. |
| C. Third-party form service (Formspree and similar) | Yes | Free to paid | Sends data off-platform. Needs a privacy policy update. |
| D. Hidden zero-price enquiry product with line item properties | Yes | Free | Pollutes orders. Not recommended. |

Decision needed from the merchant: A (ships now) or B/C (adds uploads). The form is built so the destination can be swapped without changing the UI.

Behaviour to implement: required-field validation, loading and success states, error handling, disabled submit while sending, input preserved on error.

## 7. Integrations and admin setup (merchant side)

1. Dev store and CLI login.
2. Online Store navigation menus (main, footer) with mega menu links.
3. Collections: ready-stock categories.
4. Products with images, variants, metafields.
5. Metaobject definitions (`material`, `custom_category`, `testimonial`) and entries.
6. Storefront filtering: enable in the Search & Discovery app.
7. Policy pages and legal text.
8. Customer accounts enabled; customer email set for enquiry delivery.
9. Brand assets: logo, fonts if licensed, photography. Placeholders will be marked.

## 8. Risks

- `settings_data.json` and JSON templates are rewritten by the theme editor. Commit changes made in the editor before editing locally.
- No store means no live check of checkout, filters or forms until a dev store is linked.
- Predictive search, filtering and the cart drawer depend on the Section Rendering API and Cart AJAX API. They need a real storefront to verify.
- Image and font licensing is not resolved.

## 9. Phase 3 next

Design tokens and settings schema, base CSS, typography and buttons, then layout, header and footer.
