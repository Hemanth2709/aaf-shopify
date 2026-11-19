# AAF Furniture — Shopify theme

Premium furniture storefront built on Shopify's Skeleton theme. It supports two journeys:

- **Ready stock**: collections, filters, product pages with live price, variants and inventory, cart drawer, Shopify checkout.
- **Custom furniture**: a landing page and a 9-step guided quotation enquiry delivered through Shopify's contact form.

## Start here

- [PROJECT_STATUS.md](./PROJECT_STATUS.md): what is done, what is blocked, next steps
- [docs/SETUP.md](./docs/SETUP.md): admin configuration (pages, menus, metafields, settings, enquiry delivery, images)
- [docs/TRACKING.md](./docs/TRACKING.md): analytics and conversion events
- [docs/TESTING.md](./docs/TESTING.md): testing report
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md): templates, sections and snippets

## Develop

```bash
shopify theme dev --store krduy0-u5.myshopify.com
```

```bash
shopify theme check
```

Offline layout QA without a store: see [tools/preview-harness](./tools/preview-harness/README.md).

Theme rules for contributors and agents are in [AGENTS.md](./AGENTS.md). Do not publish without approval.

Based on [Shopify Skeleton Theme](https://github.com/Shopify/skeleton-theme) (MIT).
