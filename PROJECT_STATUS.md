# Project status

AAF Furniture Shopify theme (Liquid, Online Store 2.0, Skeleton base). Last updated 2026-11-19.

Statuses: NOT STARTED · IN PROGRESS · IMPLEMENTED (built, not yet verified) · TESTED (verified, evidence given) · BLOCKED (external dependency).

## Summary

| Measure | Result |
|---|---|
| Tasks in backlog | 54 |
| Implemented (IMPLEMENTED + TESTED) | 49 / 54 |
| Tested with evidence | 40 / 54 |
| Blocked by external input | 5 (sample data needs store authorisation; enquiry email confirmation; checkout test order; analytics IDs; native file upload not supported by Shopify contact forms) |
| Theme Check | 0 errors, 0 warnings (ValidScopedCSSClass disabled with evidence, see .theme-check.yml) |
| Shopify AI Toolkit Liquid validator | All 40 files changed in this phase valid |
| Automated accessibility (axe-core, WCAG 2.1 A/AA, 10 live pages) | 0 violations |
| Live preview | Development theme #191872860481 via `shopify theme dev` (session-bound). Unpublished "AAF Furniture" #191873679681 holds the previous milestone. Live "Horizon" untouched |

`learn_shopify_api` is not available in this environment (no such tool exists in the session). The Shopify AI Toolkit skill (Liquid reference, Admin GraphQL search and validator) was used instead, with telemetry opted out.

## Product-entry readiness

| Criterion | Status | Evidence / blocker |
|---|---|---|
| Theme editor loads | IMPLEMENTED | All section schemas valid (theme check, toolkit). Editor itself requires admin login in a browser: owner to open the editor URL |
| Homepage content editable | TESTED | Every section has settings, blocks and presets; index.json renders on the store with 0 Liquid errors |
| Menus work | TESTED | Mega menu, mobile menu and footer menus render from `link_list` settings; hover/keyboard/close tested |
| Page templates assignable | TESTED | 14 page templates render via `?view=` on the store with 0 errors |
| Product metafields documented | TESTED | docs/PRODUCT-ENTRY.md; definitions script validated against Admin API |
| Ready-stock sample product works | BLOCKED | Needs store authorisation (CLI app) to create; script ready: `tools/store-setup/run.mjs` |
| Made-to-order sample product works | BLOCKED | As above |
| Variants work | IMPLEMENTED | Section Rendering variant switch tested in harness with mock data; needs a real product on the store |
| Stock messaging works | IMPLEMENTED | In stock / Only N left / Sold out / Made to order logic built; harness-verified; needs a real product |
| Collections and filters work | TESTED (empty store) | Collection page, sort, filter drawer, journey chips render on store with 0 products; AJAX filtering harness-tested |
| Cart works | TESTED (empty) | Cart page and drawer render on store; line updates need a product |
| Checkout tested | BLOCKED | Needs a product and a test payment method (Bogus gateway or Shopify Payments test mode) |
| Enquiries reach destination | BLOCKED | Submission reaches Shopify; hCaptcha requires a human to complete once and confirm the email |
| Mobile layout works | TESTED | 0 px horizontal overflow at 390 px and 820 px on all pages tested on the store |
| No critical Liquid/schema errors | TESTED | Theme Check 0; toolkit validator VALID; store renders 0 Liquid errors |

## Backlog

### Phase 0 — Audit reconciliation

| ID | Task | Pri | Status | Files | Evidence | Test |
|---|---|---|---|---|---|---|
| A-01 | Read AGENTS.md, brief, previous status | P0 | TESTED | — | Rules applied: LiquidDoc, t-filters, schema t-keys, CSS vars/classes | — |
| A-02 | Reconcile repo vs brief; list gaps | P0 | TESTED | PROJECT_STATUS.md | Gaps found: quick view, wishlist, recently viewed, reviews, measurement guide, room finder, consultation, predictive search, skeleton search/blog/article/404/password/collections | — |

### Phase 1 — Theme foundation

| ID | Task | Pri | Status | Files | Evidence | Test |
|---|---|---|---|---|---|---|
| F-01 | Liquid and schema validity | P0 | TESTED | all | Theme Check 0 issues | theme check, toolkit validate |
| F-02 | Locale strings complete | P0 | TESTED | locales/* | 0 TranslationKeyExists / ValidSchemaTranslations | theme check |
| F-03 | Theme settings (brand, commerce, social, tracking, measurement guide link) | P0 | TESTED | config/settings_schema.json, settings_data.json | Defaults for enquiry, consultation, guide links | store render |
| F-04 | Navigation: mega menu, mobile drawer, search overlay | P0 | TESTED | sections/header.liquid | hover/leave, Escape, drawers tested | Playwright |
| F-05 | Restyle search, collections list, blog, article, 404, password | P1 | TESTED | sections/search, collections, blog, article, 404, password; layout/password | 200 + 0 Liquid errors on store | curl + screenshots |
| F-06 | Predictive search | P1 | TESTED | sections/predictive-search.liquid, header.liquid | "con" → Contact suggestion live | Playwright on store |
| F-07 | Global `[hidden]` rule, native search clear removed | P2 | TESTED | assets/critical.css | room finder nav hides | Playwright |

### Phase 2 — Product-entry readiness

| ID | Task | Pri | Status | Files | Evidence | Test |
|---|---|---|---|---|---|---|
| P-01 | Metafield specification (12 definitions) | P0 | TESTED | docs/PRODUCT-ENTRY.md | Namespace/key/type/use documented | doc review |
| P-02 | Definitions creation script | P0 | IMPLEMENTED | tools/store-setup/* | Admin GraphQL validated (VALID) | needs auth to run |
| P-03 | Ready stock vs made to order logic | P0 | TESTED | product-card, product, quick-view | `custom.fulfilment_type` or tag `made-to-order` | harness |
| P-04 | Sample products (ready stock + MTO) | P0 | BLOCKED | tools/store-setup/run.mjs | Approved by owner; CLI authorisation timed out (5-min callback) | — |
| P-05 | Product-entry guide | P0 | TESTED | docs/PRODUCT-ENTRY.md | Step-by-step, checklist, CSV notes, sample cleanup | — |

### Phase 3 — E-commerce

| ID | Task | Pri | Status | Files | Evidence | Test |
|---|---|---|---|---|---|---|
| E-01 | Collection: filters, sort, chips, promo tile, empty state | P0 | TESTED | sections/collection.liquid | Store render + harness AJAX | Playwright |
| E-02 | Journey chips (All / Ready stock / Made to order) | P1 | IMPLEMENTED | sections/collection.liquid | Appears when Search & Discovery filter exists | needs filter + products |
| E-03 | Product page (gallery, variants, stock, specs, delivery, sticky bar) | P0 | IMPLEMENTED | sections/product.liquid | Harness-tested; store has no product | needs product |
| E-04 | Quick view | P1 | IMPLEMENTED | sections/quick-view.liquid, snippets/quick-view-dialog.liquid | Button + dialog harness-tested; content loads via Section Rendering | needs product |
| E-05 | Cart drawer and cart page | P0 | TESTED (empty) | sections/cart-drawer, cart | Renders on store; harness line items | needs product |
| E-06 | Checkout test order | P0 | BLOCKED | — | Needs product + test payment gateway | — |
| E-07 | Review app blocks + star ratings from `reviews.rating` | P1 | IMPLEMENTED | sections/product.liquid (@app), sections/apps.liquid, snippets/rating.liquid | No fake reviews; renders only with real data | needs reviews app |

### Phase 4 — Custom furniture

| ID | Task | Pri | Status | Files | Evidence | Test |
|---|---|---|---|---|---|---|
| C-01 | 9-step enquiry, validation, review, draft | P0 | TESTED | sections/custom-enquiry.liquid | Full flow on store; 30 labelled fields | Playwright on store |
| C-02 | File upload | P1 | BLOCKED (by platform) | — | Native contact form cannot accept files. Implemented: reference links + WhatsApp hand-off with reference number. True upload needs a form app | documented |
| C-03 | Enquiry delivery | P0 | BLOCKED | — | Reaches Shopify; hCaptcha needs one human submission to confirm email | owner test |
| C-04 | Consultation booking workflow | P1 | TESTED | sections/consultation-form.liquid, templates/page.consultation.json | Validation, min date, UTM capture, success + deduped lead | Playwright on store |
| C-05 | UTM / gclid / fbclid / referrer attribution | P1 | TESTED | custom-enquiry, consultation-form | `contact[Campaign]` populated | Playwright on store |
| C-06 | Success / error / CAPTCHA-close states | P0 | TESTED | custom-enquiry, contact-form | Success via contact_posted; reset after 8 s | Playwright on store |
| C-07 | Prefill from product, category, room | P1 | TESTED | custom-enquiry | `?category=Beds&room=…` | Playwright on store |

### Phase 5 — Conversion

| ID | Task | Pri | Status | Files | Evidence | Test |
|---|---|---|---|---|---|---|
| V-01 | Room finder ("room resonance" quiz) | P1 | TESTED | sections/room-finder.liquid | Validation, 3 outcomes, event | Playwright on store |
| V-02 | Quick ship / made to order distinctions | P1 | TESTED | badges, availability, lead time, quote CTA | harness | — |
| V-03 | Wishlist (device-local) | P2 | TESTED | snippets/theme-scripts, product-card, sections/wishlist, templates/page.wishlist.json | Toggle, persist, empty state | Playwright |
| V-04 | Recently viewed | P2 | IMPLEMENTED | sections/recently-viewed.liquid | Renders cards via Section Rendering | needs products |
| V-05 | Measurement guide | P1 | TESTED | sections/measurement-guide.liquid, templates/page.measurement-guide.json | Linked from product + enquiry step 3 | store render |
| V-06 | Care, warranty, delivery info | P1 | IMPLEMENTED | product.liquid, product-specs | From metafields / settings | needs product |
| V-07 | WhatsApp and consultation CTAs | P1 | TESTED | multiple | Hidden until number set; links correct | Playwright |

### Phase 6 — PPC and analytics

| ID | Task | Pri | Status | Files | Evidence | Test |
|---|---|---|---|---|---|---|
| M-01 | Ready-stock and custom landing templates (landing layout) | P0 | TESTED | layout/landing.liquid, templates/page.landing-*.json, collection.campaign.json | Store render 0 errors | curl + screenshots |
| M-02 | Event layer (dataLayer + Shopify customer events) | P0 | TESTED | snippets/analytics-init.liquid | Inline init; events seen in dataLayer | Playwright on store |
| M-03 | Duplicate event prevention | P0 | TESTED | custom-enquiry, consultation-form, contact-form | Lead fires once, not on reload | Playwright on store |
| M-04 | GA4 / Google Ads / Meta | P0 | BLOCKED | docs/tracking/custom-pixel.js | Pixel ready; no IDs supplied (none hardcoded) | — |

### Phase 7 — Quality assurance

| ID | Task | Pri | Status | Evidence |
|---|---|---|---|---|
| Q-01 | Desktop 1440 | P0 | TESTED | Screenshots of 8 pages on store |
| Q-02 | Tablet 820 | P0 | TESTED | 0 px overflow, 4 pages |
| Q-03 | Mobile 390 | P0 | TESTED | 0 px overflow, 15 pages |
| Q-04 | Accessibility | P0 | TESTED | axe-core 0 WCAG 2.1 AA violations on 10 pages after fixing 2 contrast issues; Lighthouse a11y 100 |
| Q-05 | SEO | P1 | TESTED | Lighthouse SEO 92 (only miss: store meta description empty → Online Store > Preferences) |
| Q-06 | Structured data | P1 | IMPLEMENTED | Organization, WebSite+SearchAction, Product, Article, Breadcrumb, FAQPage |
| Q-07 | Performance | P1 | TESTED (dev proxy) | CLS 0, no render-blocking theme assets, font preloads added. Dev-proxy LCP not representative; run PageSpeed Insights after launch |
| Q-08 | Console errors | P0 | TESTED | 0 theme errors on all pages (only Shopify platform CORS/CSP messages from the dev proxy) |
| Q-09 | Product/cart edge cases (sold out, low stock, MTO) | P0 | IMPLEMENTED | Harness only; needs sample products |

### Phase 8 — Delivery

| ID | Task | Status | Location |
|---|---|---|---|
| D-01 | Metafield specification | TESTED | docs/PRODUCT-ENTRY.md |
| D-02 | Product-entry guide | TESTED | docs/PRODUCT-ENTRY.md |
| D-03 | Shopify configuration guide | TESTED | docs/SETUP.md |
| D-04 | Integration docs (enquiry, tracking, reviews, filters) | TESTED | docs/SETUP.md, docs/TRACKING.md |
| D-05 | QA report | TESTED | docs/TESTING.md |
| D-06 | Outstanding dependencies | TESTED | below |

## Implementation log (this phase)

1. Reconciled repo against the brief; restarted the store preview.
2. Store-write plan approved by owner (definitions, 2 samples, sample collection, new menus). CLI authorisation link issued; the CLI's 5-minute callback window expired before the code came back. Setup script prepared and every operation validated against the Admin GraphQL schema.
3. Restyled search (+ predictive search), collections list, blog, article, 404, password.
4. Added quick view, wishlist, recently viewed, review app blocks and star ratings, measurement guide, room finder, consultation booking, journey chips, quote CTA for made-to-order.
5. Verified on Shopify that all `{% stylesheet %}` tags compile into one global stylesheet; disabled the ValidScopedCSSClass check with that evidence.
6. QA: axe found 2 real contrast failures (muted text on sand and charcoal) → fixed. Lighthouse a11y 100. Contact-form lead deduplication added. Font preloads added.

## Outstanding dependencies (owner)

| # | Needed | Unblocks |
|---|---|---|
| 1 | Be available for ~2 minutes to approve the store CLI authorisation and paste back the callback URL | Metafield definitions, sample products, sample collection, menus, then product/variant/stock/cart tests on the store |
| 2 | Submit one real custom enquiry on the preview (complete the CAPTCHA) and confirm the email arrives | Enquiry delivery confirmation |
| 3 | Enable a test payment method (Bogus gateway on a dev store, or Shopify Payments test mode) | Checkout test order |
| 4 | GA4 measurement ID, Google Ads ID + lead/purchase labels, Meta Pixel ID | Conversion tracking verification |
| 5 | Create pages with templates, set WhatsApp/phone/email, logo, store name, store meta description | Live CTAs and SEO |
| 6 | Real photography, genuine reviews, business copy marked "Placeholder:" | Launch content |
| 7 | Decide on file uploads (form app) and lead storage (CRM) | Native form is email-only, no files |

## Next actions

1. Owner says "ready" → run `shopify store auth` (new link) → `node tools/store-setup/run.mjs krduy0-u5.myshopify.com` → point header/footer to `aaf-main-menu` / `aaf-footer` → test sample products, variants, stock, quick view, wishlist, recently viewed, cart drawer, checkout reachability.
2. Owner submits one enquiry and confirms the email.
3. When approved, push to the unpublished "AAF Furniture" theme (`shopify theme push --theme 191873679681`), never `--publish`.
