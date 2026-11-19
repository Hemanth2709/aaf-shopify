# Analytics and conversion tracking

No tracking IDs are hardcoded. Accounts and IDs must come from the business.

## How events flow

1. Shopify emits standard customer events on its own (`page_viewed`, `product_viewed`, `collection_viewed`, `product_added_to_cart`, `checkout_started`, `checkout_completed`, …). These cover purchase tracking and work with any pixel.
2. The theme adds lead and engagement events through `window.AAF.track(name, params)` (`snippets/theme-scripts.liquid`). Each call:
   - pushes `{ event: name, ...params }` to `window.dataLayer` when Theme settings > Tracking > dataLayer is on (for GTM),
   - publishes a Shopify custom event `aaf_<name>` with `Shopify.analytics.publish`, which custom pixels can subscribe to,
   - dispatches a DOM event `aaf:track`.

## Theme events

| Event | When | Key params |
|---|---|---|
| `view_item` | Product page load | `ecommerce.items`, `fulfilment` |
| `view_item_list` | Collection load / filter change | `item_list_name`, `items` |
| `select_item` | Product card click | `item_list_name`, `items` |
| `add_to_cart` | Successful AJAX add (product form, quick add) | `ecommerce.value`, `items` |
| `view_cart` | Cart drawer opened, cart page | `ecommerce.value` |
| `remove_from_cart` | Line removed in drawer | |
| `begin_checkout` | Checkout button clicked | `ecommerce.value` |
| `select_journey` | Ready stock / custom / consultation CTA clicks | `journey`, `location` |
| `contact` | WhatsApp or phone click | `method`, `location` |
| `enquiry_start` | First interaction with the custom enquiry | |
| `enquiry_step` | Each enquiry step shown | `step`, `step_name` |
| `enquiry_submit` | Enquiry form submitted (before server response) | `furniture_category` |
| `generate_lead` | Enquiry success screen (once per reference), contact form success | `lead_type`, `enquiry_reference`, `furniture_category`, `budget` |
| `sign_up` | Newsletter success | `method` |
| `search` | Predictive search query (header) | `search_term` |
| `quick_view` | Quick view opened | `item_id` |
| `add_to_wishlist` / `remove_from_wishlist` | Heart toggled | `item_id`, `item_name` |
| `room_finder_complete` | Room finder result shown | `room`, `journey`, `space` |
| `consultation_submit` | Consultation form submitted | |
| `generate_lead` (`lead_type: consultation_request`) | Consultation success screen (once per session) | `lead_type` |

Use `generate_lead` (not `enquiry_submit`) as the conversion: it only fires after Shopify accepted the form.

## Setup options

**Recommended:** install the Google & YouTube app (GA4 + Google Ads) and the Facebook & Instagram app (Meta Pixel + Conversions API). They handle the standard ecommerce events including purchase. Then add the custom pixel below with `SEND_STANDARD_EVENTS = false` to forward the lead events.

**Single custom pixel:** Settings > Customer events > Add custom pixel, paste `docs/tracking/custom-pixel.js`, fill in:

- `GA4_MEASUREMENT_ID` from GA4 > Admin > Data streams
- `GOOGLE_ADS_ID` and the conversion labels for Lead and Purchase from Google Ads > Goals
- `META_PIXEL_ID` from Meta Events Manager

Then Save and Connect. Set customer privacy permissions to match your consent policy.

**GTM:** keep the dataLayer setting on. Load GTM through a custom pixel or app (the theme does not inject third-party scripts). Theme events arrive in the data layer with GA4-style `ecommerce` objects.

## Verification checklist (after IDs are configured)

- [ ] GA4 DebugView shows `page_view`, `view_item`, `add_to_cart`, `begin_checkout`
- [ ] A test order shows `purchase` with the right value and currency
- [ ] Custom enquiry submission shows `generate_lead` once, with `enquiry_reference`
- [ ] Google Ads conversion actions show "Recording conversions"
- [ ] Meta Events Manager > Test events shows PageView, ViewContent, AddToCart, InitiateCheckout, Purchase, Lead
- [ ] Shopify admin > Customer events > pixel shows "Connected"

None of these have been verified yet, because no account IDs have been supplied.
