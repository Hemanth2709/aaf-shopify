# Preview harness

Offline QA tool. Renders the real theme sections with LiquidJS, simple Shopify filter shims and mock products (`MOCK IMAGE` gradients, mock prices), then screenshots them with Playwright.

It is **not** a Shopify renderer: filters like `image_url`, `money`, `form` and `paginate` are approximations, and Shopify-specific behaviour (sections API, cart AJAX, contact form posting) is not exercised. Use it to catch layout, CSS and front-end script bugs. Final checks must happen on `shopify theme dev`.

```bash
cd tools/preview-harness && npm install && npm run render && npm run shots && npm run flow
```

Output goes to `out/` and `shots/` (git-ignored).
