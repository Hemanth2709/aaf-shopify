// Local preview harness: renders theme sections with LiquidJS + Shopify shims and mock data.
const fs = require('fs');
const path = require('path');
const { Liquid, Tag, Hash } = require('liquidjs');

const THEME = require('path').resolve(__dirname, '../..');
const OUT = require('path').join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//, '');
const readJson = (p) => JSON.parse(strip(fs.readFileSync(path.join(THEME, p), 'utf8')));
const locale = readJson('locales/en.default.json');

const css = new Map();
const js = new Map();

// ---------- mock images ----------
let imgCount = 0;
const tones = [['#cdbba2', '#8a6f55'], ['#d9cdbb', '#a08a70'], ['#bfae98', '#6e5643'], ['#e3d8c6', '#b09a7c'], ['#a89580', '#4f3d30']];
function mockImage(label, w = 1600, h = 1200) {
  imgCount++;
  const [a, b] = tones[imgCount % tones.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><rect x="${w * 0.18}" y="${h * 0.55}" width="${w * 0.64}" height="${h * 0.16}" rx="${h * 0.03}" fill="rgba(40,30,22,.35)"/><rect x="${w * 0.22}" y="${h * 0.46}" width="${w * 0.56}" height="${h * 0.12}" rx="${h * 0.03}" fill="rgba(255,255,255,.25)"/><text x="50%" y="${h * 0.9}" font-family="sans-serif" font-size="${Math.round(w / 40)}" fill="rgba(255,255,255,.8)" text-anchor="middle">MOCK IMAGE – ${label}</text></svg>`;
  const file = `img-${imgCount}.svg`;
  fs.writeFileSync(path.join(OUT, file), svg);
  return { src: file, url: file, width: w, height: h, aspect_ratio: w / h, alt: label, media_type: 'image', id: 9000 + imgCount, __image: true };
}

// ---------- mock data ----------
const money = (cents) => '₹' + (cents / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function mockProduct(i, opts = {}) {
  const titles = ['Arlo three-seater sofa', 'Maren oak dining table', 'Sable lounge chair', 'Veda walnut sideboard', 'Ilse bouclé armchair', 'Noor bed with storage', 'Tova coffee table', 'Linnea console'];
  const types = ['Sofa', 'Dining table', 'Lounge chair', 'Sideboard', 'Armchair', 'Bed', 'Coffee table', 'Console'];
  const price = (45000 + i * 13750) * 100;
  const media = [mockImage(titles[i % 8], 1200, 1500), mockImage(titles[i % 8] + ' room', 1200, 1500), mockImage('detail', 1200, 1500)];
  const variants = [
    { id: 100 + i * 10 + 1, title: 'Walnut / Sand bouclé', price, compare_at_price: i % 3 === 0 ? price + 900000 : 0, available: i !== 5, inventory_management: 'shopify', inventory_policy: 'deny', inventory_quantity: i === 1 ? 2 : 12, featured_media: media[0], weight: 42000, weight_unit: 'kg' },
    { id: 100 + i * 10 + 2, title: 'Oak / Linen', price: price + 500000, compare_at_price: 0, available: true, inventory_management: 'shopify', inventory_quantity: 6, featured_media: media[1] },
  ];
  const optionValues = (names) => names.map((n, idx) => ({ toString: () => n, id: 500 + idx + i * 10, selected: idx === 0, available: true, swatch: null, __str: n }));
  return {
    id: 7000 + i,
    title: titles[i % 8],
    handle: 'p' + i,
    url: '/products/p' + i,
    type: types[i % 8],
    vendor: 'AAF',
    price,
    price_min: price,
    price_varies: i % 2 === 0,
    compare_at_price: variants[0].compare_at_price,
    available: i !== 5,
    tags: i % 4 === 2 ? ['made-to-order'] : [],
    featured_media: media[0],
    featured_image: media[0],
    media,
    has_only_default_variant: !!opts.single,
    selected_or_first_available_variant: variants[0],
    variants,
    options_with_values: opts.single
      ? []
      : [
          { name: 'Wood', position: 1, selected_value: 'Walnut', values: optionValues(['Walnut', 'Oak', 'Teak']) },
          { name: 'Fabric', position: 2, selected_value: 'Sand bouclé', values: optionValues(['Sand bouclé', 'Linen', 'Velvet']) },
        ],
    description: '<p>A deep, low sofa with a solid hardwood frame and feather-wrapped cushions. Mock description for preview only.</p>',
    metafields: {
      custom: {
        fulfilment_type: { value: i % 4 === 2 ? 'Made to order' : 'Ready stock' },
        dimensions: { value: 'W 220 cm × D 95 cm × H 78 cm\nSeat height 44 cm' },
        material: { type: 'single_line_text_field', value: 'Solid walnut, bouclé' },
        finish: { value: 'Natural oil' },
        upholstery: { value: 'Sand bouclé' },
        warranty: { value: 'Mock: warranty text' },
      },
    },
  };
}
const products = Array.from({ length: 8 }, (_, i) => mockProduct(i, { single: i === 3 }));
const collection = {
  title: 'Sofas and seating',
  url: '/collections/sofas',
  handle: 'sofas',
  description: '<p>Deep seating in solid timber and natural fabrics. Mock collection for preview.</p>',
  image: mockImage('Collection banner', 2400, 1000),
  featured_image: mockImage('Sofas', 900, 1125),
  products,
  products_count: 8,
  all_products_count: 8,
  sort_by: 'best-selling',
  default_sort_by: 'best-selling',
  sort_options: [
    { value: 'best-selling', name: 'Best selling' },
    { value: 'price-ascending', name: 'Price, low to high' },
    { value: 'created-descending', name: 'Newest' },
  ],
  filters: [
    { type: 'list', label: 'Availability', param_name: 'filter.v.availability', active_values: [], values: [{ label: 'In stock', value: '1', param_name: 'filter.v.availability', count: 7, active: false }, { label: 'Out of stock', value: '0', param_name: 'filter.v.availability', count: 1, active: false }] },
    { type: 'list', label: 'Fulfilment', param_name: 'filter.p.m.custom.fulfilment_type', active_values: [{ label: 'Ready stock', url_to_remove: '#' }], values: [{ label: 'Ready stock', value: 'Ready stock', param_name: 'x', count: 6, active: true }, { label: 'Made to order', value: 'Made to order', param_name: 'x', count: 2, active: false }] },
    { type: 'price_range', label: 'Price', min_value: { param_name: 'filter.v.price.gte', value: null }, max_value: { param_name: 'filter.v.price.lte', value: null }, range_max: 30000000 },
  ],
};
const menu = {
  title: 'Main menu',
  links: [
    { title: 'Ready stock', url: '/collections/all', links: [
      { title: 'Living', url: '#', links: [{ title: 'Sofas', url: '#', links: [] }, { title: 'Armchairs', url: '#', links: [] }, { title: 'Coffee tables', url: '#', links: [] }] },
      { title: 'Dining', url: '#', links: [{ title: 'Dining tables', url: '#', links: [] }, { title: 'Chairs', url: '#', links: [] }] },
      { title: 'Bedroom', url: '#', links: [{ title: 'Beds', url: '#', links: [] }, { title: 'Side tables', url: '#', links: [] }] },
      { title: 'Storage', url: '#', links: [{ title: 'Sideboards', url: '#', links: [] }, { title: 'Wardrobes', url: '#', links: [] }] },
    ] },
    { title: 'Custom furniture', url: '/pages/custom-furniture', links: [{ title: 'How it works', url: '#', links: [] }, { title: 'Start your design', url: '#', links: [] }, { title: 'Materials', url: '#', links: [] }] },
    { title: 'Collections', url: '/collections', links: [] },
    { title: 'Materials', url: '/pages/materials', links: [] },
    { title: 'About', url: '/pages/about', links: [] },
  ],
};
const footerMenu = { title: 'Footer', links: [{ title: 'Shipping', url: '#' }, { title: 'Returns', url: '#' }, { title: 'FAQ', url: '#' }, { title: 'Contact', url: '#' }] };

// ---------- engine ----------
const engine = new Liquid({ root: [path.join(THEME, 'snippets')], extname: '.liquid', jsTruthy: false, dynamicPartials: true, strictFilters: false, strictVariables: false });

function lookup(key) {
  return key.split('.').reduce((o, k) => (o ? o[k] : undefined), locale);
}
engine.registerFilter('t', (key, ...args) => {
  let s = lookup(String(key));
  if (s === undefined) return `[missing:${key}]`;
  if (typeof s === 'object') s = s.other || s.one || JSON.stringify(s);
  const hash = {};
  for (let i = 0; i < args.length; i++) if (Array.isArray(args[i])) hash[args[i][0]] = args[i][1];
  if (hash.count !== undefined) {
    const v = lookup(String(key));
    if (typeof v === 'object') s = Number(hash.count) === 1 ? v.one : v.other;
  }
  return s.replace(/{{\s*(\w+)\s*}}/g, (m, k) => (hash[k] !== undefined ? hash[k] : m));
});
const kw = (args) => {
  const o = {};
  args.forEach((a) => Array.isArray(a) && (o[a[0]] = a[1]));
  return o;
};
engine.registerFilter('image_url', (img) => (img && img.src) || (typeof img === 'string' ? img : ''));
engine.registerFilter('image_tag', (src, ...args) => {
  const o = kw(args);
  const attrs = Object.entries(o).filter(([k]) => !['widths', 'preload'].includes(k)).map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<img src="${src}" ${attrs}>`;
});
engine.registerFilter('placeholder_svg_tag', (name, cls) => `<svg class="${cls || ''}" viewBox="0 0 525 525" xmlns="http://www.w3.org/2000/svg"><path d="M60 400h405M120 400V250h285v150M150 250v-50h225v50" stroke="currentColor" stroke-width="6" fill="none"/></svg>`);
engine.registerFilter('money', (c) => money(Number(c) || 0));
engine.registerFilter('money_with_currency', (c) => money(Number(c) || 0) + ' INR');
engine.registerFilter('money_without_currency', (c) => ((Number(c) || 0) / 100).toFixed(2));
engine.registerFilter('money_without_trailing_zeros', (c) => money(Number(c) || 0).replace('.00', ''));
engine.registerFilter('json', (v) => JSON.stringify(v === undefined ? null : v && v.__str ? v.__str : v));
engine.registerFilter('handleize', (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
engine.registerFilter('handle', (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'));
engine.registerFilter('asset_url', (s) => path.join(THEME, 'assets', s));
engine.registerFilter('stylesheet_tag', (s) => `<link rel="stylesheet" href="file://${s}">`);
['font_face', 'payment_button', 'structured_data', 'payment_type_svg_tag', 'video_tag', 'external_video_tag', 'media_tag'].forEach((f) => engine.registerFilter(f, () => ''));
engine.registerFilter('font_modify', (f) => f);
engine.registerFilter('default_errors', () => '<ul><li>Mock error</li></ul>');
engine.registerFilter('metafield_tag', (m) => (m && m.value) || '');
engine.registerFilter('weight_with_unit', (w) => (w / 1000).toFixed(0) + ' kg');
engine.registerFilter('url_encode', (s) => encodeURIComponent(String(s || '')));
engine.registerFilter('newline_to_br', (s) => String(s || '').replace(/\n/g, '<br />'));

const noop = (name) =>
  engine.registerTag(name, {
    parse(token, remain) {
      this.tpls = [];
      let closed = false;
      while (remain.length) {
        const t = remain.shift();
        if (t.name === 'end' + name) { closed = true; break; }
        this.tpls.push(t);
      }
      if (!closed) throw new Error('unclosed ' + name);
    },
    *render(ctx) {
      const raw = this.tpls.map((t) => t.getText()).join('');
      if (name === 'stylesheet') css.set(this.liquid.__file || raw.slice(0, 40), raw);
      if (name === 'javascript') js.set(raw.slice(0, 80), raw);
      return '';
    },
  });
['schema', 'stylesheet', 'javascript', 'doc'].forEach(noop);
engine.registerTag('style', {
  parse(token, remain) {
    this.tpls = [];
    const stream = this.liquid.parser.parseStream(remain).on('tag:endstyle', () => stream.stop()).on('template', (t) => this.tpls.push(t)).on('end', () => { throw new Error('unclosed style'); });
    stream.start();
  },
  *render(ctx, emitter) {
    const html = yield this.liquid.renderer.renderTemplates(this.tpls, ctx);
    emitter.write('<style>' + html + '</style>');
  },
});
engine.registerTag('form', {
  parse(token, remain) {
    this.args = token.args;
    this.tpls = [];
    const stream = this.liquid.parser.parseStream(remain).on('tag:endform', () => stream.stop()).on('template', (t) => this.tpls.push(t)).on('end', () => { throw new Error('unclosed form'); });
    stream.start();
  },
  *render(ctx, emitter) {
    const type = this.args.split(',')[0].trim().replace(/['"]/g, '');
    const named = this.args.split(',').slice(1).join(',').replace(/^\s*product\s*,?/, '');
    const hash = new Hash(named.replace(/^\s*product\s*$/, ''));
    const o = yield hash.render(ctx);
    const attrs = Object.entries(o).map(([k, v]) => `${k}="${v === true ? '' : v}"`).join(' ');
    const action = type === 'product' ? '/cart/add' : type === 'contact' ? '/contact' : '/account';
    ctx.push({ form: { 'posted_successfully?': !!ctx.getSync(['__posted']), errors: ctx.getSync(['__errors']) || false } });
    const html = yield this.liquid.renderer.renderTemplates(this.tpls, ctx);
    ctx.pop();
    emitter.write(`<form method="post" action="${action}" ${attrs}>${html}</form>`);
  },
});
engine.registerTag('paginate', {
  parse(token, remain) {
    this.tpls = [];
    const stream = this.liquid.parser.parseStream(remain).on('tag:endpaginate', () => stream.stop()).on('template', (t) => this.tpls.push(t)).on('end', () => { throw new Error('unclosed paginate'); });
    stream.start();
  },
  *render(ctx, emitter) {
    ctx.push({ paginate: { pages: 2, current_page: 1, next: { url: '#' }, parts: [{ title: 1, is_link: false }, { title: 2, is_link: true, url: '#' }] } });
    emitter.write(yield this.liquid.renderer.renderTemplates(this.tpls, ctx));
    ctx.pop();
  },
});
engine.registerTag('content_for', { parse() {}, render() { return ''; } });

// ---------- schema defaults ----------
function schemaOf(file) {
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
  return m ? JSON.parse(m[1]) : { settings: [] };
}
function resolveSetting(def, value) {
  if (value === undefined) value = def.default;
  if (def.type === 'link_list') return value === 'footer' ? footerMenu : value ? menu : null;
  if (def.type === 'collection') return value ? collection : null;
  if (def.type === 'image_picker') return value || null;
  return value === undefined ? null : value;
}
function settingsFrom(defs, values = {}) {
  const out = {};
  (defs || []).forEach((d) => d.id && (out[d.id] = resolveSetting(d, values[d.id])));
  return out;
}
const globalDefs = readJson('config/settings_schema.json').flatMap((g) => g.settings || []);
const settings = settingsFrom(globalDefs, {
  whatsapp_number: '910000000000',
  contact_phone: '+91 00000 00000',
  contact_email: 'hello@example.com',
  showroom_address: 'Mock showroom address\nCity 000000',
  consultation_url: '/pages/contact',
  enquiry_url: '/pages/custom-enquiry',
  ready_stock_delivery: 'Mock: delivery estimate set in theme settings',
  warranty_text: 'Mock: warranty text',
  cart_note_text: 'Mock: delivery note',
});
settings.type_primary_font = { family: '"Work Sans"', fallback_families: 'system-ui, sans-serif', style: 'normal', weight: 400 };
settings.type_heading_font = { family: '"Playfair Display"', fallback_families: 'Georgia, serif', style: 'normal', weight: 400 };

async function renderSection(type, data = {}, id) {
  const file = path.join(THEME, 'sections', type + '.liquid');
  const schema = schemaOf(file);
  const blocks = (data.block_order || Object.keys(data.blocks || {})).map((bid) => {
    const b = data.blocks[bid];
    const bdef = (schema.blocks || []).find((x) => x.type === b.type) || { settings: [] };
    return { id: bid, type: b.type, settings: settingsFrom(bdef.settings, b.settings || {}), shopify_attributes: '' };
  });
  const section = { id: id || type, settings: settingsFrom(schema.settings, data.settings || {}), blocks };
  const tpl = fs.readFileSync(file, 'utf8');
  engine.options.globals = globals();
  const html = await engine.parseAndRender(tpl, Object.assign({}, globals(), { section }));
  return `<div id="shopify-section-${section.id}" class="shopify-section">${html}</div>`;
}
let pageType = 'index';
let extra = {};
function globals() {
  return Object.assign(
    {
      settings,
      shop: { name: 'AAF', customer_accounts_enabled: true, enabled_payment_types: [], policies: [{ title: 'Refund policy', url: '#' }, { title: 'Privacy policy', url: '#' }], email: 'hello@example.com' },
      routes: { root_url: '/', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change', search_url: '/search', account_url: '/account', collections_url: '/collections', all_products_collection_url: '/collections/all', product_recommendations_url: '/recommendations/products' },
      request: { page_type: pageType, path: '/', design_mode: false, locale: { iso_code: 'en' } },
      cart: extra.cart || { item_count: 0, items: [], total_price: 0, currency: { iso_code: 'INR' }, cart_level_discount_applications: [], taxes_included: true },
      canonical_url: 'https://example.com/',
      metaobjects: { material: { values: [] }, custom_category: { values: [] } },
      recommendations: { performed: true, products_count: 4, products: products.slice(0, 4) },
    },
    extra
  );
}

async function page(name, sections, opts = {}) {
  pageType = opts.pageType || 'index';
  extra = opts.extra || {};
  css.clear();
  js.clear();
  const header = readJson('sections/header-group.json');
  const footer = readJson('sections/footer-group.json');
  let body = '';
  const groupHtml = async (g) => {
    let h = '';
    for (const sid of g.order) h += await renderSection(g.sections[sid].type, g.sections[sid], sid);
    return h;
  };
  const headerHtml = opts.landing ? await renderSection('landing-header', { settings: {} }) : await groupHtml(header);
  for (const [sid, s] of sections) body += await renderSection(s.type, s, sid);
  const footerHtml = await groupHtml(footer);
  const drawer = await renderSection('cart-drawer', {}, 'cart-drawer');
  const tplCtx = globals();
  engine.options.globals = tplCtx;
  const vars = await engine.parseAndRender(fs.readFileSync(path.join(THEME, 'snippets/css-variables.liquid'), 'utf8'), tplCtx);
  const wa = await engine.parseAndRender("{% render 'whatsapp-float' %}{% render 'theme-scripts' %}", tplCtx);
  const analytics = await engine.parseAndRender("{% render 'analytics-init' %}", tplCtx);
  // collect css from all theme files (Shopify bundles all stylesheet tags)
  let allCss = '';
  for (const dir of ['sections', 'snippets', 'blocks']) {
    for (const f of fs.readdirSync(path.join(THEME, dir))) {
      const src = fs.readFileSync(path.join(THEME, dir, f), 'utf8');
      const m = src.match(/{%\s*stylesheet\s*%}([\s\S]*?){%\s*endstylesheet\s*%}/);
      if (m) allCss += m[1];
    }
  }
  let allJs = '';
  for (const dir of ['sections', 'snippets', 'blocks']) {
    for (const f of fs.readdirSync(path.join(THEME, dir))) {
      const src = fs.readFileSync(path.join(THEME, dir, f), 'utf8');
      const m = src.match(/{%\s*javascript\s*%}([\s\S]*?){%\s*endjavascript\s*%}/);
      if (m) allJs += `\ntry{${m[1]}}catch(e){console.error('${f}',e)}\n`;
    }
  }
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Work+Sans:wght@400;500&display=swap" rel="stylesheet">
${vars}<link rel="stylesheet" href="file://${THEME}/assets/critical.css"><style>${allCss}</style>
${analytics}
</head><body class="template-${pageType}${opts.landing ? ' layout-landing' : ''}"><a class="skip-link" href="#main-content">Skip</a>${headerHtml}<main id="main-content">${body}</main>${footerHtml}${drawer}${wa}<script>${allJs}</script></body></html>`;
  const missing = [...new Set((html.match(/\[missing:[^\]]+\]/g) || []))];
  fs.writeFileSync(path.join(OUT, name + '.html'), html);
  console.log(name, 'ok', missing.length ? 'MISSING ' + missing.join(' ') : '');
}

(async () => {
  const tplSections = (file) => {
    const t = readJson('templates/' + file);
    return t.order.map((id) => [id, t.sections[id]]);
  };
  const withCollection = (secs) =>
    secs.map(([id, s]) => {
      if (s.type === 'featured-products') s = Object.assign({}, s, { settings: Object.assign({}, s.settings, { collection: 'mock' }) });
      return [id, s];
    });
  await page('home', withCollection(tplSections('index.json')));
  await page('collection', tplSections('collection.json'), { pageType: 'collection', extra: { collection } });
  await page('product', tplSections('product.json'), { pageType: 'product', extra: { product: products[0] } });
  await page('enquiry', tplSections('page.custom-enquiry.json'), { pageType: 'page' });
  await page('custom-furniture', tplSections('page.custom-furniture.json'), { pageType: 'page' });
  const cart = { item_count: 2, items: [{ product: products[0], variant: products[0].variants[0], url: products[0].url, image: products[0].media[0], quantity: 1, final_line_price: products[0].price, original_line_price: products[0].price, final_price: products[0].price, properties: [], line_level_discount_allocations: [], key: 'k1', url_to_remove: '#' }, { product: products[3], variant: products[3].variants[0], url: products[3].url, image: products[3].media[0], quantity: 1, final_line_price: products[3].price, original_line_price: products[3].price, final_price: products[3].price, properties: [], line_level_discount_allocations: [], key: 'k2', url_to_remove: '#' }], total_price: products[0].price + products[3].price, currency: { iso_code: 'INR' }, cart_level_discount_applications: [], taxes_included: true };
  await page('cart', tplSections('cart.json'), { pageType: 'cart', extra: { cart } });
  await page('landing-custom', tplSections('page.landing-custom.json'), { pageType: 'page', landing: true });
  await page('contact', tplSections('page.contact.json'), { pageType: 'page', extra: { page: { title: 'Contact' } } });
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
