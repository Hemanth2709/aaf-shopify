const { chromium } = require('playwright');
const pages = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch();
  for (const name of pages) {
    for (const [label, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
      const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
      await page.goto('file://' + require('path').join(__dirname, 'out') + '/' + name + '.html', { waitUntil: 'load', timeout: 20000 }).catch(() => {});
      await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-revealed')));
      await page.waitForTimeout(700);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      await page.screenshot({ path: `' + require('path').join(__dirname, 'shots') + '/${name}-${label}.png`, fullPage: true });
      console.log(name, label, 'hscroll:', overflow, errors.filter(e=>!/ERR_|net::|Failed to load resource/.test(e)).slice(0, 5).join(' | '));
      await ctx.close();
    }
  }
  await browser.close();
})();
