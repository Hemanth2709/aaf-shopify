# Project status

Premium furniture storefront on Shopify (Liquid theme, Skeleton base). Last updated 2026-11-19.

## Summary

| Area | Status |
|---|---|
| P0 storefront (design system, header, homepage, collections, product, cart, custom landing, guided enquiry) | Built, validated, harness-tested. Not yet seen on the live store |
| P1 commercial (supporting pages, mobile, WhatsApp, metafields, SEO, tracking hooks, campaign templates) | Built. Tracking IDs and business copy pending |
| Live store preview | **Blocked**: Shopify CLI login not approved yet |
| Git push | **Blocked**: GitHub returned 403 for this repository |

## Implementation log

1. Audit: Skeleton theme with a basic first pass. No cart drawer, mega menu, guided enquiry, WhatsApp, tracking or campaign templates. Theme check was clean. `learn_shopify_api` is not available in this environment, so the Shopify AI Toolkit skill was installed and used instead (Liquid reference + validator, telemetry opted out).
2. Design system: ivory / cream / sand / taupe / walnut / charcoal tokens, serif display + sans body, colour-scheme classes per section, sharp-cornered buttons, reveal-on-scroll with reduced-motion and no-JS fallbacks, labelled image placeholders.
3. Global: announcement bar (rotating, phone / consultation / WhatsApp), header with mega menu (columns + promo images), transparent-over-hero on home, search overlay, mobile drawer with both journeys, AJAX cart drawer (Section Rendering API), floating WhatsApp, footer.
4. Homepage (12 sections, both journeys in the hero), collection (AJAX filter drawer, sort, active chips, custom-order promo tile), product (gallery, variants, stock, specs from metafields, delivery / warranty, WhatsApp, "customise this piece", sticky mobile bar, recommendations), cart page.
5. Custom furniture: landing template and a 9-step guided enquiry posting to Shopify's contact form, with progress, validation, draft saving, review, reference number, URL / UTM capture, loading / error / success states.
6. P1: contact, FAQ (FAQPage schema), about, craftsmanship, materials, two PPC landing templates and a campaign collection template on a minimal `landing` layout; Organization / WebSite / Breadcrumb / Product / Article JSON-LD; analytics helper and a custom pixel file.
7. QA: theme check, toolkit validator, JS syntax, offline render harness with Playwright. Seven bugs found and fixed (see docs/TESTING.md).

## Files

- Setup: `docs/SETUP.md` (pages, menus, metafields, settings, enquiry delivery, images)
- Tracking: `docs/TRACKING.md`, `docs/tracking/custom-pixel.js`
- Testing report: `docs/TESTING.md`
- Architecture: `docs/ARCHITECTURE.md`
- QA tool: `tools/preview-harness/`

## Outstanding dependencies

| Needed | From | Blocks |
|---|---|---|
| Approve a Shopify CLI login (device code) | Store owner | Live preview, real-page QA, enquiry email test |
| GitHub access for the Claude app on this repo | Repo owner | Pushing the branch |
| Products with prices, variants, inventory, images and metafields | Business | Testing the ready-stock journey end to end |
| Logo, hero, category, editorial, material and product photography | Business | Replacing labelled placeholders |
| WhatsApp number, phone, email, showroom address, consultation link | Business | Contact buttons (hidden until set) |
| Delivery areas / timelines, warranty, installation, returns, deposit terms, budget ranges | Business | Copy marked "Placeholder:" |
| Genuine customer reviews | Business | Testimonials (placeholders must not go live) |
| GA4, Google Ads (ID + conversion labels), Meta Pixel IDs | Marketing | Conversion tracking verification |
| Decision on file uploads (form app) and lead storage (CRM) | Business | Native form sends email only, no file upload |
| Menus `main-menu` and `footer`, pages with the right templates, Search & Discovery filters | Admin setup | Navigation and filters (see SETUP.md) |

## Next steps

1. Approve the CLI login → run `shopify theme dev`, review every page on desktop and mobile, submit a test enquiry, and confirm the email arrives.
2. Add 3–5 real products with metafields → test variants, add to cart, drawer, checkout.
3. Configure tracking IDs → verify events (checklist in TRACKING.md).
4. `shopify theme push --unpublished`, review in the theme editor, publish only on approval.
