/**
 * AAF custom pixel for Shopify Customer Events.
 *
 * Paste into: Shopify admin > Settings > Customer events > Add custom pixel.
 * Set the IDs below. Leave an ID empty to disable that platform.
 * No IDs are included on purpose: use the IDs from your own accounts.
 *
 * Prefer the official "Google & YouTube" and "Facebook & Instagram" apps for
 * the standard ecommerce events (view_item, add_to_cart, begin_checkout,
 * purchase). If you use those apps, set SEND_STANDARD_EVENTS = false here to
 * avoid double counting, and keep this pixel for the theme's lead events.
 */

const GA4_MEASUREMENT_ID = ''; // for example "G-..." from GA4 > Admin > Data streams
const GOOGLE_ADS_ID = ''; // for example "AW-..." from Google Ads > Goals > Conversions
const GOOGLE_ADS_LEAD_LABEL = ''; // conversion label for the custom furniture lead action
const GOOGLE_ADS_PURCHASE_LABEL = ''; // conversion label for the purchase action
const META_PIXEL_ID = ''; // numeric id from Meta Events Manager
const SEND_STANDARD_EVENTS = true;

const loadScript = (src) => {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

if (GA4_MEASUREMENT_ID || GOOGLE_ADS_ID) {
  loadScript('https://www.googletagmanager.com/gtag/js?id=' + (GA4_MEASUREMENT_ID || GOOGLE_ADS_ID));
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  if (GA4_MEASUREMENT_ID) window.gtag('config', GA4_MEASUREMENT_ID, { send_page_view: false });
  if (GOOGLE_ADS_ID) window.gtag('config', GOOGLE_ADS_ID);
}

if (META_PIXEL_ID) {
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', META_PIXEL_ID);
}

const gtagEvent = (name, params) => {
  if (window.gtag && GA4_MEASUREMENT_ID) window.gtag('event', name, Object.assign({ send_to: GA4_MEASUREMENT_ID }, params));
};
const fbqEvent = (name, params, custom) => {
  if (window.fbq && META_PIXEL_ID) window.fbq(custom ? 'trackCustom' : 'track', name, params || {});
};

const toItem = (line) => ({
  item_id: line.merchandise ? line.merchandise.product.id : undefined,
  item_name: line.merchandise ? line.merchandise.product.title : undefined,
  item_variant: line.merchandise ? line.merchandise.title : undefined,
  item_category: line.merchandise ? line.merchandise.product.type : undefined,
  price: line.merchandise && line.merchandise.price ? line.merchandise.price.amount : undefined,
  quantity: line.quantity,
});

analytics.subscribe('page_viewed', (event) => {
  gtagEvent('page_view', { page_location: event.context.document.location.href, page_title: event.context.document.title });
  fbqEvent('PageView');
});

if (SEND_STANDARD_EVENTS) {
  analytics.subscribe('product_viewed', (event) => {
    const variant = event.data.productVariant;
    gtagEvent('view_item', {
      currency: variant.price.currencyCode,
      value: variant.price.amount,
      items: [{ item_id: variant.product.id, item_name: variant.product.title, item_variant: variant.title, price: variant.price.amount }],
    });
    fbqEvent('ViewContent', { content_ids: [variant.product.id], content_type: 'product', value: variant.price.amount, currency: variant.price.currencyCode });
  });

  analytics.subscribe('product_added_to_cart', (event) => {
    const line = event.data.cartLine;
    if (!line) return;
    gtagEvent('add_to_cart', { currency: line.cost.totalAmount.currencyCode, value: line.cost.totalAmount.amount, items: [toItem(line)] });
    fbqEvent('AddToCart', { content_ids: [line.merchandise.product.id], content_type: 'product', value: line.cost.totalAmount.amount, currency: line.cost.totalAmount.currencyCode });
  });

  analytics.subscribe('checkout_started', (event) => {
    const checkout = event.data.checkout;
    gtagEvent('begin_checkout', { currency: checkout.currencyCode, value: checkout.totalPrice.amount, items: checkout.lineItems.map((l) => ({ item_id: l.variant && l.variant.product.id, item_name: l.title, quantity: l.quantity })) });
    fbqEvent('InitiateCheckout', { value: checkout.totalPrice.amount, currency: checkout.currencyCode, num_items: checkout.lineItems.length });
  });

  analytics.subscribe('checkout_completed', (event) => {
    const checkout = event.data.checkout;
    const transactionId = checkout.order && checkout.order.id ? checkout.order.id : checkout.token;
    gtagEvent('purchase', {
      transaction_id: transactionId,
      currency: checkout.currencyCode,
      value: checkout.totalPrice.amount,
      tax: checkout.totalTax ? checkout.totalTax.amount : undefined,
      shipping: checkout.shippingLine ? checkout.shippingLine.price.amount : undefined,
      items: checkout.lineItems.map((l) => ({ item_id: l.variant && l.variant.product.id, item_name: l.title, quantity: l.quantity, price: l.variant && l.variant.price.amount })),
    });
    if (window.gtag && GOOGLE_ADS_ID && GOOGLE_ADS_PURCHASE_LABEL) {
      window.gtag('event', 'conversion', { send_to: GOOGLE_ADS_ID + '/' + GOOGLE_ADS_PURCHASE_LABEL, value: checkout.totalPrice.amount, currency: checkout.currencyCode, transaction_id: transactionId });
    }
    fbqEvent('Purchase', { value: checkout.totalPrice.amount, currency: checkout.currencyCode, content_type: 'product' });
  });
}

/* Theme events published with Shopify.analytics.publish('aaf_<name>', data) by snippets/theme-scripts.liquid */

analytics.subscribe('aaf_generate_lead', (event) => {
  const data = event.customData || {};
  gtagEvent('generate_lead', { lead_type: data.lead_type, enquiry_reference: data.enquiry_reference, furniture_category: data.furniture_category });
  if (window.gtag && GOOGLE_ADS_ID && GOOGLE_ADS_LEAD_LABEL && (data.lead_type === 'custom_furniture_enquiry' || data.lead_type === 'consultation_request')) {
    window.gtag('event', 'conversion', { send_to: GOOGLE_ADS_ID + '/' + GOOGLE_ADS_LEAD_LABEL, transaction_id: data.enquiry_reference });
  }
  fbqEvent('Lead', { content_category: data.furniture_category || data.lead_type });
});

analytics.subscribe('aaf_contact', (event) => {
  const data = event.customData || {};
  gtagEvent('contact', { method: data.method, location: data.location });
  fbqEvent('Contact', { method: data.method });
});

analytics.subscribe('aaf_enquiry_start', () => {
  gtagEvent('enquiry_start', {});
  fbqEvent('EnquiryStart', {}, true);
});

analytics.subscribe('aaf_enquiry_step', (event) => {
  const data = event.customData || {};
  gtagEvent('enquiry_step', { step: data.step, step_name: data.step_name });
});

analytics.subscribe('aaf_select_journey', (event) => {
  const data = event.customData || {};
  gtagEvent('select_journey', { journey: data.journey, location: data.location });
});

analytics.subscribe('aaf_search', (event) => {
  gtagEvent('search', { search_term: (event.customData || {}).search_term });
  fbqEvent('Search', { search_string: (event.customData || {}).search_term });
});

analytics.subscribe('aaf_add_to_wishlist', (event) => {
  gtagEvent('add_to_wishlist', { items: [{ item_id: (event.customData || {}).item_id }] });
  fbqEvent('AddToWishlist', {});
});

analytics.subscribe('aaf_room_finder_complete', (event) => {
  const data = event.customData || {};
  gtagEvent('room_finder_complete', { room: data.room, journey: data.journey });
});

analytics.subscribe('aaf_sign_up', () => {
  gtagEvent('sign_up', { method: 'newsletter' });
  fbqEvent('CompleteRegistration', { content_name: 'newsletter' });
});
