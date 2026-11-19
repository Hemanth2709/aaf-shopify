# Delivery notes

Preview: run `shopify theme dev --store krduy0-u5.myshopify.com` (add `--port 9393` if 9292 is busy). This creates a temporary development theme. Nothing is published.

## Pages and templates

| Page | Template | Assign in admin |
|---|---|---|
| Home | `index.json` | automatic |
| Collection, product, cart, search, 404 | default templates | automatic |
| Custom furniture landing | `page.custom-furniture` | Page, choose template |
| Custom enquiry | `page.custom-enquiry` | Page, choose template |
| Contact | `page.contact` | Page, choose template |
| FAQ | `page.faq` | Page, choose template |
| About, Craftsmanship, Materials | `page.about`, `page.craftsmanship`, `page.materials` | Page, choose template |
| Shipping, Returns, Privacy, Terms | default `page` | Write content in the page body, or use Settings > Policies |

After creating the custom furniture and enquiry pages, set the "Enquiry page link" on the custom categories section and the process steps button to the enquiry page URL.

## Components

- Sections: announcement-bar, header, footer, hero, featured-collections, featured-products, image-with-text, trust-bar, testimonials, newsletter, collection, product, product-recommendations, cart, custom-categories, process-steps, material-showcase, custom-enquiry, faq, contact-form, page.
- Snippets: icon, price, product-card, variant-picker, quantity-selector, image, css-variables, meta-tags.

## Data to create in the Shopify admin

Product metafields (Settings > Custom data > Products, namespace `custom`):
`material` (list of metaobject reference to `material`), `dimensions` (multi-line text), `finish` (single line text), `lead_time` (single line text), `care_instructions` (rich text).

Metaobject definitions (Settings > Custom data > Metaobjects), with storefront access enabled:
- `material`: `title` (single line text), `swatch` (file), `description` (multi-line text).
- `custom_category`: `title` (single line text), `image` (file), `description` (multi-line text).

Other: main menu and footer menu, collections, products, Search & Discovery filters.

## Enquiry workflow

The form posts to Shopify's native contact form. Each submission is emailed to the store's customer email (Settings > Notifications > Sender email / customer email). Extra fields arrive in the email body. Submissions are not stored in the admin as a list.

Reference images are a link field. File upload is not supported by the native form. To add uploads, install a form app (for example Shopify Forms) or use a form service, then replace the form in `sections/custom-enquiry.liquid`.

Behaviour: required fields validated in the browser, duplicate submission blocked, "Sending" state, errors shown with the form re-filled from the session draft, success message.

## Testing status

- `shopify theme check`: no errors, 1 warning fixed afterwards (re-run to confirm).
- Preview server: homepage, collection, cart, search, 404 and all seven page templates return 200 with no Liquid errors.
- Not tested: product page, variant switching, add to cart, filters, related products (the store has no products), enquiry email delivery, checkout, mobile layout and visual design, Lighthouse and accessibility audit.

## Deployment

Do not publish without approval. When ready: `shopify theme push --store krduy0-u5.myshopify.com --unpublished` to upload as a new unpublished theme, review it in the theme editor, then publish from the admin.
