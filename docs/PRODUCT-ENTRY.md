# Product entry guide

How to add furniture to Shopify so every feature of the AAF theme works. Prices, stock and specifications always come from what you enter here. The theme never invents them.

## 1. One-time setup: metafield definitions

Create these under **Settings → Custom data → Products → Add definition**. Use exactly the namespace and key shown (`custom.<key>`). `tools/store-setup/run.mjs --step=definitions` creates all of them automatically once the CLI is authorised.

| Name | Namespace and key | Type | Used by the theme for |
|---|---|---|---|
| Fulfilment type | `custom.fulfilment_type` | Single line text, choices: `Ready stock`, `Made to order` | Ready stock / Made to order badge, availability wording, which delivery text shows, the collection journey chips, "Request a quote" button on made-to-order pieces |
| Dimensions | `custom.dimensions` | Multi-line text | Specifications tab. One measurement per line, e.g. `W 220 cm x D 95 cm x H 78 cm` |
| Material | `custom.material` | Single line text | Line under the title on product cards; specifications |
| Finish | `custom.finish` | Single line text | Specifications |
| Upholstery | `custom.upholstery` | Single line text | Specifications |
| Delivery estimate | `custom.delivery_estimate` | Single line text | Delivery box on ready-stock products (overrides the theme default) |
| Lead time | `custom.lead_time` | Single line text | Lead time box on made-to-order products (overrides the theme default) |
| Warranty | `custom.warranty` | Single line text | Delivery box; specifications |
| Assembly | `custom.assembly` | Single line text | Specifications |
| Care instructions | `custom.care_instructions` | Rich text | "Care" tab |
| Highlights | `custom.highlights` | List of single line text | Up to 5 benefit bullets under the price |
| Room | `custom.room` | List of single line text | Optional storefront filter (Search & Discovery) |

Turn on **Storefront access** for each definition if you want to use it as a filter.

Optional: Shopify's standard review metafields (`reviews.rating`, `reviews.rating_count`) are filled automatically by review apps such as Shopify Product Reviews or Judge.me. The theme shows stars only when a rating exists.

## 2. Adding a ready-stock product

1. **Products → Add product.** Title, description (story, comfort, materials), and **Product type** (e.g. Sofa). The product type appears above the title on cards.
2. **Media:** at least 3 images at 2000 × 2500 px (4:5 portrait): hero shot, room shot, detail. Add **alt text** to each. The second image is shown when a shopper hovers the card.
3. **Pricing:** price, and compare-at price only for a genuine sale (the card shows "Sale").
4. **Inventory:** tick **Track quantity**, set the quantity per location, and leave "Continue selling when out of stock" **off**. The theme shows "In stock", "Only N left" (at or below the low-stock threshold in Theme settings → Commerce) or "Sold out" from these numbers.
5. **Variants:** add options such as Wood, Fabric or Size. To show colour/fabric swatches, use Shopify's category metafields or option swatches on that option.
6. **Metafields** (bottom of the product page): set **Fulfilment type = Ready stock**, then dimensions, material, finish, upholstery, delivery estimate, warranty, care and highlights.
7. **Collections:** add it to its room / category collection(s).
8. **Sales channels:** make sure **Online Store** is ticked, and set status to Active.

## 3. Adding a made-to-order product

Same as above, with these differences:

- **Fulfilment type = Made to order** (or add the tag `made-to-order`).
- Inventory: either untick **Track quantity**, or tick **Continue selling when out of stock** so it can always be ordered.
- Fill **Lead time** instead of Delivery estimate.
- The product page then shows a "Made to order" badge, the lead time, and a **Request a quote for this piece** button that opens the custom enquiry with the product and category pre-filled.

## 4. Quality checklist per product

- [ ] Title and product type set
- [ ] 3+ images with alt text, the first image clean on a neutral background
- [ ] Price checked; compare-at only if genuinely on sale
- [ ] Inventory tracked (ready stock) or continue-selling (made to order)
- [ ] Fulfilment type set
- [ ] Dimensions and material filled
- [ ] In at least one collection; Online Store channel on
- [ ] SEO: search engine listing title and description (Shopify product page, bottom)

## 5. Bulk import

Use **Products → Import** with Shopify's CSV template. Metafield columns are named like `Fulfilment type (product.metafields.custom.fulfilment_type)` once the definitions exist; export one product first to get the exact column headers.

## 6. Sample products

If `tools/store-setup/run.mjs` was run, two test products exist: **SAMPLE – Arlo three-seater sofa** (ready stock, 4 variants, one sold out, one low stock) and **SAMPLE – Maren made-to-order dining table**, plus the collection **Sample ready stock**. All are tagged `aaf-sample`. Delete them before launch: Products → filter by tag `aaf-sample` → select all → Delete; then delete the collection.
