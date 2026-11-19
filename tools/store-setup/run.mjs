// AAF store setup: product metafield definitions, two clearly labelled sample
// products, a sample collection and two new menus (existing menus untouched).
// Every operation was validated against the Admin GraphQL schema with the
// Shopify AI Toolkit. Requires: shopify store auth --store <store> --scopes
// read_products,write_products,read_online_store_navigation,
// write_online_store_navigation,read_publications,write_publications,
// read_inventory,write_inventory,read_locations,read_markets_home
//
// Usage: node tools/store-setup/run.mjs <store>.myshopify.com [--step=definitions|products|collection|menus|all]
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const store = process.argv[2];
const step = (process.argv.find((a) => a.startsWith('--step=')) || '--step=all').split('=')[1];
if (!store) {
  console.error('Usage: node run.mjs <store>.myshopify.com [--step=...]');
  process.exit(1);
}
const tmp = mkdtempSync(join(tmpdir(), 'aaf-setup-'));
const log = [];

function run(file, variables, mutation = true) {
  const varFile = join(tmp, 'vars.json');
  writeFileSync(varFile, JSON.stringify(variables || {}));
  const args = ['store', 'execute', '--store', store, '--query-file', join(here, file), '--variable-file', varFile, '--json'];
  if (mutation) args.push('--allow-mutations');
  const out = execFileSync('shopify', args, { encoding: 'utf8', env: { ...process.env, OPT_OUT_INSTRUMENTATION: 'true' } });
  const json = JSON.parse(out.slice(out.indexOf('{')));
  return json.data || json;
}

const definitions = [
  ['fulfilment_type', 'Fulfilment type', 'single_line_text_field', 'Ready stock or Made to order. Drives badges, availability wording, delivery text and the collection journey filter.', [{ name: 'choices', value: JSON.stringify(['Ready stock', 'Made to order']) }]],
  ['dimensions', 'Dimensions', 'multi_line_text_field', 'Overall size, one measurement per line, for example "W 220 cm x D 95 cm x H 78 cm".'],
  ['material', 'Material', 'single_line_text_field', 'Primary materials, for example "Solid walnut, bouclé". Shown on cards and in specifications.'],
  ['finish', 'Finish', 'single_line_text_field', 'Surface finish, for example "Natural oil".'],
  ['upholstery', 'Upholstery', 'single_line_text_field', 'Fabric or leather, for example "Sand bouclé". Leave blank for non-upholstered pieces.'],
  ['delivery_estimate', 'Delivery estimate', 'single_line_text_field', 'Ready-stock delivery wording shown on the product page. Overrides the theme default.'],
  ['lead_time', 'Lead time', 'single_line_text_field', 'Made-to-order production and delivery time, for example "8 to 10 weeks".'],
  ['warranty', 'Warranty', 'single_line_text_field', 'Warranty summary shown in the delivery box and specifications.'],
  ['assembly', 'Assembly', 'single_line_text_field', 'Assembly or installation notes, for example "Delivered assembled".'],
  ['care_instructions', 'Care instructions', 'rich_text_field', 'Cleaning and care guidance shown in the Care tab.'],
  ['highlights', 'Highlights', 'list.single_line_text_field', 'Up to five short benefit lines shown under the price.'],
  ['room', 'Room', 'list.single_line_text_field', 'Rooms the piece suits, for example Living room. Useful as a Search & Discovery filter.'],
];

function stepDefinitions() {
  for (const [key, name, type, description, validations] of definitions) {
    const res = run('01-metafield-definition.graphql', {
      definition: { ownerType: 'PRODUCT', namespace: 'custom', key, name, type, description, pin: true, validations: validations || [], access: { storefront: 'PUBLIC_READ' } },
    });
    const r = res.metafieldDefinitionCreate;
    const taken = r.userErrors.some((e) => e.code === 'TAKEN');
    log.push({ step: 'definition', key, ok: !!r.createdDefinition || taken, note: taken ? 'already existed' : r.userErrors.map((e) => e.message).join('; ') });
  }
}

const richText = (text) => JSON.stringify({ type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', value: text }] }] });
const mf = (key, type, value) => ({ namespace: 'custom', key, type, value });

function sampleProducts(locationId) {
  const qty = (quantity) => [{ locationId, name: 'available', quantity }];
  const sofaVariant = (wood, fabric, price, quantity, compareAtPrice) => ({
    optionValues: [
      { optionName: 'Wood', name: wood },
      { optionName: 'Fabric', name: fabric },
    ],
    price,
    ...(compareAtPrice ? { compareAtPrice } : {}),
    sku: 'AAF-SAMPLE-SOFA-' + wood.slice(0, 2).toUpperCase() + fabric.slice(0, 2).toUpperCase(),
    inventoryPolicy: 'DENY',
    inventoryItem: { tracked: true },
    inventoryQuantities: qty(quantity),
  });
  return [
    {
      title: 'SAMPLE – Arlo three-seater sofa',
      handle: 'aaf-sample-arlo-sofa',
      status: 'ACTIVE',
      productType: 'Sofa',
      tags: ['aaf-sample', 'ready-stock'],
      descriptionHtml: '<p>Test product for theme QA. Prices, stock and specifications are placeholders, not real data. Delete before launch.</p>',
      productOptions: [
        { name: 'Wood', values: [{ name: 'Walnut' }, { name: 'Oak' }] },
        { name: 'Fabric', values: [{ name: 'Sand bouclé' }, { name: 'Linen' }] },
      ],
      variants: [
        sofaVariant('Walnut', 'Sand bouclé', '10000.00', 5, '12000.00'),
        sofaVariant('Walnut', 'Linen', '10000.00', 2),
        sofaVariant('Oak', 'Sand bouclé', '9000.00', 0),
        sofaVariant('Oak', 'Linen', '9000.00', 8),
      ],
      metafields: [
        mf('fulfilment_type', 'single_line_text_field', 'Ready stock'),
        mf('dimensions', 'multi_line_text_field', 'W 220 cm x D 95 cm x H 78 cm\nSeat height 44 cm (sample)'),
        mf('material', 'single_line_text_field', 'Sample: solid walnut, bouclé'),
        mf('finish', 'single_line_text_field', 'Sample: natural oil'),
        mf('upholstery', 'single_line_text_field', 'Sample: sand bouclé'),
        mf('delivery_estimate', 'single_line_text_field', 'Sample: delivery estimate placeholder'),
        mf('warranty', 'single_line_text_field', 'Sample: warranty placeholder'),
        mf('assembly', 'single_line_text_field', 'Sample: delivered assembled'),
        mf('care_instructions', 'rich_text_field', richText('Sample care text: vacuum cushions weekly and blot spills immediately.')),
        mf('highlights', 'list.single_line_text_field', JSON.stringify(['Sample highlight: solid hardwood frame', 'Sample highlight: removable covers'])),
        mf('room', 'list.single_line_text_field', JSON.stringify(['Living room'])),
      ],
    },
    {
      title: 'SAMPLE – Maren made-to-order dining table',
      handle: 'aaf-sample-maren-table',
      status: 'ACTIVE',
      productType: 'Dining table',
      tags: ['aaf-sample', 'made-to-order'],
      descriptionHtml: '<p>Test made-to-order product for theme QA. Price and lead time are placeholders. Delete before launch.</p>',
      productOptions: [{ name: 'Size', values: [{ name: '6 seater' }, { name: '8 seater' }] }],
      variants: [
        { optionValues: [{ optionName: 'Size', name: '6 seater' }], price: '15000.00', sku: 'AAF-SAMPLE-TABLE-6', inventoryPolicy: 'CONTINUE', inventoryItem: { tracked: false } },
        { optionValues: [{ optionName: 'Size', name: '8 seater' }], price: '18000.00', sku: 'AAF-SAMPLE-TABLE-8', inventoryPolicy: 'CONTINUE', inventoryItem: { tracked: false } },
      ],
      metafields: [
        mf('fulfilment_type', 'single_line_text_field', 'Made to order'),
        mf('dimensions', 'multi_line_text_field', '6 seater: L 180 cm x W 90 cm x H 75 cm\n8 seater: L 240 cm x W 100 cm x H 75 cm (sample)'),
        mf('material', 'single_line_text_field', 'Sample: solid oak'),
        mf('finish', 'single_line_text_field', 'Sample: matte lacquer'),
        mf('lead_time', 'single_line_text_field', 'Sample: lead time placeholder'),
        mf('warranty', 'single_line_text_field', 'Sample: warranty placeholder'),
        mf('room', 'list.single_line_text_field', JSON.stringify(['Dining room'])),
      ],
    },
  ];
}

function stepProducts(lookup) {
  const location = lookup.locations.nodes.find((l) => l.isActive) || lookup.locations.nodes[0];
  const online = lookup.publications.nodes.find((p) => p.catalog && /online store/i.test(p.catalog.title));
  for (const input of sampleProducts(location.id)) {
    const r = run('02-product-set.graphql', { input }).productSet;
    log.push({ step: 'product', handle: input.handle, ok: !!r.product, id: r.product && r.product.id, note: r.userErrors.map((e) => e.message).join('; ') });
    if (r.product && online) {
      const p = run('04-publish.graphql', { id: r.product.id, input: [{ publicationId: online.id }] }).publishablePublish;
      log.push({ step: 'publish', handle: input.handle, ok: p.userErrors.length === 0, note: p.userErrors.map((e) => e.message).join('; ') });
    }
  }
  return online;
}

function stepCollection(online) {
  const r = run('03-collection-create.graphql', {
    collection: {
      title: 'Sample ready stock',
      handle: 'aaf-sample-ready-stock',
      descriptionHtml: '<p>Test collection for theme QA (products tagged aaf-sample). Delete before launch.</p>',
      ruleSet: { appliedDisjunctively: false, rules: [{ column: 'TAG', relation: 'EQUALS', condition: 'aaf-sample' }] },
    },
  }).collectionCreate;
  log.push({ step: 'collection', ok: !!r.collection, id: r.collection && r.collection.id, note: r.userErrors.map((e) => e.message).join('; ') });
  if (r.collection && online) {
    const p = run('04-publish.graphql', { id: r.collection.id, input: [{ publicationId: online.id }] }).publishablePublish;
    log.push({ step: 'publish', handle: 'aaf-sample-ready-stock', ok: p.userErrors.length === 0 });
  }
  return r.collection;
}

function stepMenus(lookup, sampleCollection) {
  const existing = lookup.menus.nodes.map((m) => m.handle);
  const http = (title, url, items) => ({ title, type: 'HTTP', url, ...(items ? { items } : {}) });
  const readyChildren = [{ title: 'All furniture', type: 'CATALOG' }];
  if (sampleCollection) readyChildren.unshift({ title: 'Sample ready stock', type: 'COLLECTION', resourceId: sampleCollection.id });
  const menus = [
    {
      title: 'AAF main menu',
      handle: 'aaf-main-menu',
      items: [
        { title: 'Ready stock', type: 'CATALOG', items: readyChildren },
        http('Custom furniture', '/pages/custom-furniture', [
          http('Start your design', '/pages/custom-enquiry'),
          http('Book a consultation', '/pages/consultation'),
          http('Measurement guide', '/pages/measurement-guide'),
        ]),
        { title: 'Collections', type: 'COLLECTIONS' },
        http('Materials', '/pages/materials'),
        http('Contact', '/pages/contact'),
      ],
    },
    {
      title: 'AAF footer',
      handle: 'aaf-footer',
      items: [http('Contact', '/pages/contact'), http('FAQ', '/pages/faq'), http('Measurement guide', '/pages/measurement-guide'), { title: 'Search', type: 'SEARCH' }],
    },
  ];
  for (const m of menus) {
    if (existing.includes(m.handle)) {
      log.push({ step: 'menu', handle: m.handle, ok: true, note: 'already existed, left unchanged' });
      continue;
    }
    const r = run('05-menu-create.graphql', m).menuCreate;
    log.push({ step: 'menu', handle: m.handle, ok: !!r.menu, note: r.userErrors.map((e) => e.message).join('; ') });
  }
}

const lookup = run('00-lookup.graphql', {}, false);
if (step === 'all' || step === 'definitions') stepDefinitions();
let online = lookup.publications.nodes.find((p) => p.catalog && /online store/i.test(p.catalog.title));
if (step === 'all' || step === 'products') online = stepProducts(lookup);
let collection = null;
if (step === 'all' || step === 'collection') collection = stepCollection(online);
if (step === 'all' || step === 'menus') stepMenus(lookup, collection);
writeFileSync(join(here, 'last-run.json'), JSON.stringify(log, null, 2));
console.table(log);
