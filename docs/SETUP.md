# Setup and configuration

Everything the merchant must configure in the Shopify admin for the theme to work as designed. Nothing here is published by the theme itself.

## 1. Preview and push

```bash
shopify theme dev --store krduy0-u5.myshopify.com
```

```bash
shopify theme push --store krduy0-u5.myshopify.com --unpublished
```

`theme dev` creates a temporary development theme. `push --unpublished` uploads a new unpublished theme for review in the editor. Do not publish without approval.

## 2. Theme settings (Online Store > Themes > Customize > Theme settings)

| Group | Setting | Needed for |
|---|---|---|
| Brand and contact | Logo, favicon | Header, footer, Organization structured data |
| Brand and contact | WhatsApp number (digits, country code, no `+`) | Every WhatsApp button. Blank hides them all |
| Brand and contact | Phone, email, showroom address | Announcement bar, footer, contact page, consultation band |
| Brand and contact | Consultation link (default `/pages/consultation`) | "Book a consultation" buttons and the room finder |
| Brand and contact | Measurement guide link (default `/pages/measurement-guide`) | Product pages and enquiry step 3 |
| Brand and contact | Enquiry page link (default `/pages/custom-enquiry`) | Cart, collection empty state, footer, header fallback, product "Request a quote" |
| Commerce | Cart type (drawer or page) | Add-to-cart behaviour |
| Commerce | Ready-stock delivery, made-to-order lead time, warranty | Product page delivery box. **Business must confirm the wording** |
| Commerce | Low-stock threshold | "Only N left" message (variants tracked by Shopify inventory) |
| Social | Profile URLs | Footer icons, Organization `sameAs` |
| Tracking | Push events to dataLayer | GTM or GA4 via the data layer (see TRACKING.md) |

## 3. Pages (Online Store > Pages)

Create each page and choose its template in the "Theme template" box.

| Page title | Handle | Template |
|---|---|---|
| Custom furniture | `custom-furniture` | `page.custom-furniture` |
| Custom enquiry | `custom-enquiry` | `page.custom-enquiry` |
| Contact | `contact` | `page.contact` |
| Book a consultation | `consultation` | `page.consultation` |
| Measurement guide | `measurement-guide` | `page.measurement-guide` |
| Wishlist | `wishlist` | `page.wishlist` (then Header → Wishlist page) |
| FAQ | `faq` | `page.faq` |
| About | `about` | `page.about` |
| Craftsmanship | `craftsmanship` | `page.craftsmanship` |
| Materials | `materials` | `page.materials` |
| Ready stock (ads) | `landing-ready-stock` | `page.landing-ready-stock` (minimal header, for paid traffic) |
| Custom furniture (ads) | `landing-custom` | `page.landing-custom` (enquiry form on the page) |
| Shipping, Returns | any | default `page`. Also fill Settings > Policies |

Default links in the templates assume these handles. If you use different handles, update the links in the theme editor.

For a collection used in ads, assign the `collection.campaign` template to that collection (minimal header, no navigation leaks).

## 4. Navigation (Online Store > Navigation)

If `tools/store-setup/run.mjs` was run, two new menus exist: **AAF main menu** (`aaf-main-menu`) and **AAF footer** (`aaf-footer`). Select them in Customize → Header → Menu and Footer → menu blocks. Your existing `main-menu` and `footer` menus are not changed.

- `main-menu`: top-level items. Items with children render a mega menu. Children with their own children render as columns. Suggested: Ready stock (with category children), Custom furniture, Collections, Materials, About.
- `footer`: customer care links (Shipping, Returns, FAQ, Contact).
- Optional: a "popular searches" menu, then choose it in Header > Search suggestions.
- Mega menu images: Header section > Add block "Mega menu promo", type the exact top-level menu title.

## 5. Product data

Full guide and metafield specification: **docs/PRODUCT-ENTRY.md**.

Products, prices, variants and inventory come from Shopify. The theme never invents them.

Create these product metafield definitions (Settings > Custom data > Products, namespace and key exactly as shown):

| Key | Type | Used for |
|---|---|---|
| `custom.fulfilment_type` | Single line text, choices `Ready stock` / `Made to order` | Badges, availability wording, which delivery text shows. Tag `made-to-order` also works |
| `custom.dimensions` | Multi-line text | Specifications |
| `custom.material` | List of metaobject references (`material`) **or** single line text | Card material line, specifications |
| `custom.finish` | Single line text | Specifications |
| `custom.upholstery` | Single line text | Specifications |
| `custom.delivery_estimate` | Single line text | Delivery box (ready stock). Overrides the theme setting |
| `custom.lead_time` | Single line text | Delivery box (made to order) |
| `custom.warranty` | Single line text | Delivery box, specifications |
| `custom.assembly` | Single line text | Specifications |
| `custom.care_instructions` | Rich text | "Care" accordion |
| `custom.highlights` | List of single line text | Benefit bullets under the price (if no highlight blocks are added in the editor) |

Metaobject definitions (Settings > Custom data > Metaobjects, enable Storefront access):

- `material`: `title` (single line text), `swatch` (file, image), `description` (multi-line text). Used by product specs and optionally by the materials section (source: metaobjects).
- `custom_category` (optional): `title`, `image`, `description`. Used by the bespoke categories section when it has no blocks.

Variant swatches: set colour/fabric option swatches in the product option settings (Shopify category metafields). The variant picker renders them automatically.

## 6. Filters (Search & Discovery app)

Install Shopify Search & Discovery, then add filters: Availability, Price, Product type, and product metafields `custom.fulfilment_type`, `custom.material`, `custom.finish`, `custom.room`. Colour filters with swatches render as swatches.

When the `custom.fulfilment_type` filter exists, collection pages show **All pieces / Ready stock / Made to order** chips above the grid automatically.

For "Pairs well with" on product pages, set complementary products in Search & Discovery → Recommendations.

## 6b. Reviews

Install a reviews app (Shopify Product Reviews, Judge.me, Yotpo, …). Add its widget as an **app block** inside the Product section (Customize → Product → Add block → Apps) or in the full-width **Reviews** (Apps) section under it. Star ratings on cards appear automatically when the app fills the standard `reviews.rating` metafield. Never add reviews by hand that customers did not write.

## 7. Custom enquiry delivery

- The guided form posts to Shopify's native contact form. Each submission is emailed to the address in Settings > Notifications > Sender email (customer support email).
- Every answer arrives as a labelled line: Category, Furniture type, Width/Depth/Height + Units, Material, Finish, Colour preference, Upholstery, Reference links, Budget, Timeline, City, contact details, Enquiry reference, Campaign (UTM / gclid), Page.
- Submissions are not stored as records in the admin. If you need a lead list, forward the inbox to a CRM, or replace the form with an app (see below).
- The consultation booking form (`page.consultation`) uses the same contact form, with the consultation type, preferred date and time, city and UTM source as labelled fields.
- File upload: the native form cannot accept files. The form offers reference links, and the success screen opens WhatsApp with the enquiry reference so customers can send image files. For true uploads, install a form app (for example Shopify Forms or another form builder) and replace the `{% form 'contact' %}` in `sections/custom-enquiry.liquid`, or embed the app block on the page.
- Spam protection: Shopify may show an hCaptcha challenge after submit. This is expected.

**Verify before launch** (not yet done, see TESTING.md): submit one enquiry on the preview, confirm the email arrives with all fields, reply from the inbox, and confirm the `generate_lead` event in GA4 DebugView.

## 8. Images to supply

All image slots show a labelled placeholder ("Placeholder: …, size") until a merchant image is chosen. Supply:

| Slot | Size (px) |
|---|---|
| Home hero (desktop / mobile) | 3200 x 1800 / 1200 x 1600 |
| Category tiles | 900 x 1125 |
| Editorial sections (bespoke, story, room-fit) | 1800 x 2250 or 1800 x 1200 |
| Collection banners (collection image) | 2400 x 1000 |
| Curated collection tiles | 1600 x 2000 |
| Consultation band | 1600 x 1200 |
| Material swatches | 600 x 600 |
| Product media | 2000 x 2500, plus room shots |
| Logo (dark and light versions) | SVG-like PNG, 600 wide |

Do not use competitor images or branding.

## 9. Copy to confirm

Texts marked "Placeholder:" in the theme editor are business claims the theme cannot know: delivery areas and timelines, installation, warranty, workshop location, budget ranges, testimonials (genuine reviews only), FAQ answers and the brand story.
