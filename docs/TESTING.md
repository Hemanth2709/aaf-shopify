# Testing report

Date: 2026-11-19. Branch `claude/nifty-darwin-kio1sd`.

## What was run

| Check | Result |
|---|---|
| `shopify theme check` (theme-check:recommended) | 0 errors, 0 warnings |
| Shopify AI Toolkit `validate.mjs --api liquid` (full theme mode, 61 changed files) | All files valid |
| `node --check` on every `{% javascript %}` block (15 files) | All parse; none contain Liquid |
| Offline render harness (`tools/preview-harness`), 8 pages × desktop 1440 / mobile 390 | Render without missing translation keys or console errors |
| Horizontal overflow scan at 390 px | 0 px on all 8 pages (after fixes below) |
| Scripted enquiry flow (Playwright, mobile) | Passed, details below |
| Overlays: mega menu hover/leave, mobile menu, cart drawer open/close, filter drawer, sticky mobile buy bar | Working |

## Bugs found and fixed during testing

1. Header height feedback loop: `min-height: var(--header-height)` combined with the script that measures the header made it grow 1 px per frame. Fixed with a separate `--header-bar-height` token.
2. `ul[role=list]` reset outranked component padding, so the mobile menu and cart drawer content touched the screen edge. Reset moved into `:where()`.
3. Mobile horizontal scroll on collection (sort select) and product (grid min-width). Fixed.
4. Floating WhatsApp button covered Add to cart on 1440 × 900 product pages and Continue on the enquiry. Hidden there on desktop, raised above sticky bars on mobile (inline WhatsApp links remain).
5. "Step 1 of 9" shown twice on the enquiry. Legend label hidden when the stepper is active.
6. Rich-text headings leaked `<em>` into analytics list names. Stripped.
7. Image-tag filter arguments with chained filters (`alt: x | default: y`) would have corrupted the `<img>` output in Shopify. Moved to pre-assigned variables.

## Enquiry flow test (Playwright, 390 px)

- URL prefill: `?category=Beds&product=Noor bed` selects the category and fills the design notes and hidden "Based on product"; `utm_source` / `utm_campaign` captured into `contact[Campaign]`.
- Validation blocks progress with inline messages for: no category, negative width, invalid URL, empty project description, invalid email, too-short phone.
- Type options switch with the chosen category.
- Review step lists every answer; "Edit" jumps back to the right step.
- Submit: all 30 fields present with readable labels (`contact[Category]`, `contact[Width]`, `contact[Units]`, `contact[Colour preference]`, `contact[Enquiry reference]` …); the button enters its loading state, and a double submit is blocked.
- Draft restore: reloading mid-way returns to the same step with category, type and dimensions kept.
- Events fired: `enquiry_start`, `enquiry_step`, `enquiry_submit`.

## Live store preview (`shopify theme dev`, krduy0-u5, dev theme only, live theme untouched)

| Check | Result |
|---|---|
| Home, /collections/all, /collections, /cart, /search, 404 | 200, no Liquid errors, no missing translations |
| All 9 page templates and `collection.campaign` (previewed with `?view=` on the existing Contact page; no pages were created) | 200, no Liquid errors |
| Desktop 1440 / mobile 390 screenshots, 8 pages | No horizontal overflow; Playfair Display + Work Sans load; header height stable (81 / 73 px) |
| Browser console | No errors from theme code. Only Shopify platform messages (CORS on the local dev proxy, Shop Pay iframe CSP), identical on every page |
| Guided enquiry on Shopify | All 9 steps, validation and review work; submit triggers Shopify's hCaptcha bot protection (expected) |
| Enquiry success state (`contact_posted=true`) | Success panel with reference renders; `generate_lead` fires once with `enquiry_reference`, deduplicated on reload |
| Contact form success | `generate_lead` with `lead_type: contact_form` |

### Bugs found on the live store and fixed

8. `structured-data.liquid`: Shopify's parser rejected `{search_term_string}` inside an output tag (theme check and LiquidJS accepted it). Every page returned 500 until fixed with a `capture` + `raw` block.
9. Analytics events fired from section scripts before `AAF.track` existed, because Shopify bundles section scripts before snippet scripts. `generate_lead`, `view_item`, `view_item_list` and `sign_up` would have been silently lost. The tracker now lives in an inline head snippet (`analytics-init`).
10. Closing the hCaptcha window left the Send button spinning. It now resets after 8 s with a hint (enquiry and contact form).
11. Shopify's generic placeholder art (shoes, bags) replaced with furniture line drawings; the collection banner is now full width; the landing layout uses the correct header offset; no focus ring on script-focused panels.

## Not tested (blocked)

| Item | Blocker |
|---|---|
| Enquiry email actually arriving in the store inbox | Shopify's hCaptcha correctly blocks automated submissions, so a person has to submit one test enquiry |
| Real product page, variant switching via Section Rendering API, AJAX add to cart, cart drawer updates, filters | Requires the store, and the store has no products yet |
| Checkout and purchase events | Requires products and a test payment method |
| GA4 / Google Ads / Meta event verification | No account IDs supplied |
| Lighthouse / Core Web Vitals on real images | Needs the store preview and real photography |
| Real fonts in screenshots | The harness falls back to system serif/sans fonts |

Screenshots in the harness use mock gradients labelled "MOCK IMAGE" and mock prices. They are not store data.
