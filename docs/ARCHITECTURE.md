# Architecture

Shopify Online Store 2.0 Liquid theme. JSON templates compose sections; snippets hold shared logic. Per-component CSS and JS live in `{% stylesheet %}` / `{% javascript %}` tags; only `assets/critical.css` is global. No external JS or CSS libraries.

## Layouts

- `layout/theme.liquid`: header group, footer group, cart drawer, floating WhatsApp, global scripts.
- `layout/landing.liquid`: same, but with the minimal `landing-header` (logo, phone, WhatsApp, cart). Used by `page.landing-*` and `collection.campaign`.

## Global snippets

| Snippet | Role |
|---|---|
| `css-variables` | Design tokens from theme settings |
| `meta-tags` | Title, description, canonical, robots, Open Graph, Twitter |
| `structured-data` | Organization, WebSite + SearchAction, Product, Article, BreadcrumbList |
| `theme-scripts` | `AAF.track` analytics helper, `AAF.cart` (add / change / render via Section Rendering API), reveal-on-scroll |
| `whatsapp-url`, `whatsapp-float` | wa.me links with pre-filled messages |
| `placeholder` | Labelled temporary image |
| `section-heading`, `icon`, `price`, `product-card`, `product-specs`, `variant-picker`, `quantity-selector` | Components |

## Sections by page

| Page | Template | Sections |
|---|---|---|
| Home | `index` | hero (dual CTA + journey cards), category-grid, featured-products (ready stock), image-with-text (bespoke), material-showcase, featured-collections, featured-products (best sellers), image-with-text (story), testimonials, trust-bar, consultation-cta, newsletter |
| Collection | `collection`, `collection.campaign` | collection (filters drawer, sort, promo tile), trust-bar |
| Product | `product` | product, product-recommendations ×2 (complementary, related), trust-bar, consultation-cta |
| Cart | `cart` | cart (+ global cart-drawer) |
| Custom landing | `page.custom-furniture` | hero, custom-categories, process-steps, image-with-text, material-showcase, journey-split, testimonials, faq, consultation-cta |
| Enquiry | `page.custom-enquiry` | custom-enquiry (9 steps), faq |
| PPC | `page.landing-ready-stock`, `page.landing-custom` | Landing layout with hero, assurance, products or embedded enquiry, social proof, FAQ |
| Content | `page.contact`, `page.faq`, `page.about`, `page.craftsmanship`, `page.materials`, `page` | contact-form, faq, page, image-with-text, process-steps, material-showcase, trust-bar, journey-split |

Every section has a colour-scheme setting (`scheme-ivory`, `scheme-cream`, `scheme-sand`, `scheme-charcoal`, `scheme-walnut`) and a preset, so merchants can add them anywhere.

## Data

- Commerce data (products, prices, variants, inventory, collections, filters) comes from Shopify only.
- Furniture attributes come from `custom.*` product metafields (see SETUP.md). Ready stock vs made to order: `custom.fulfilment_type` or the `made-to-order` tag.
- Enquiries go through `{% form 'contact' %}` → store email. No server or app required.
