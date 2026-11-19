const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const name of process.argv.slice(2)) {
    const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
    await p.goto('file://' + require('path').join(__dirname, 'out') + '/' + name + '.html');
    const r = await p.evaluate(() => {
      const W = window.innerWidth; const out = [];
      document.querySelectorAll('body *').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > W + 1 && rect.width > 0) {
          let a = el.parentElement, clipped = false;
          while (a) { const s = getComputedStyle(a); if (['auto','hidden','scroll','clip'].includes(s.overflowX)) { clipped = true; break; } a = a.parentElement; }
          if (!clipped && !el.closest('dialog')) out.push(el.tagName + '.' + (el.className.baseVal ?? el.className) + ' right=' + Math.round(rect.right));
        }
      });
      return out.slice(0, 8);
    });
    console.log(name, r);
  }
  await b.close();
})();
