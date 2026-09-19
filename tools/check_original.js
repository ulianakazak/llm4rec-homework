const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const consoleMsgs = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on('console', (m) => consoleMsgs.push(`[${m.type()}] ${m.text()}`));
  page.on('pageerror', (e) => pageErrors.push(e.message));
  page.on('requestfailed', (r) => failedRequests.push(`${r.url()} -> ${r.failure()?.errorText}`));
  page.on('requestfinished', async (r) => {
    if (/font-awesome/i.test(r.url())) {
      const resp = await r.response().catch(() => null);
      consoleMsgs.push(`[network] ${r.url()} -> ${resp ? resp.status() : 'no response'}`);
    }
  });

  await page.goto('http://localhost:8123/starter/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(1200);

  const icons = ['fa-pizza-slice','fa-fish','fa-hamburger','fa-leaf','fa-utensil-spoon','fa-bowl-hot','fa-bread-slice','fa-pasta','fa-mortar-pestle','fa-drumstick-bite','fa-bowl','fa-fire'];

  const results = await page.evaluate((iconClasses) => {
    const out = {};
    for (const cls of iconClasses) {
      const el = document.createElement('i');
      el.className = 'fas ' + cls;
      document.body.appendChild(el);
      const before = getComputedStyle(el, '::before');
      out[cls] = {
        content: before.content,          // e.g. "\f2e7" when the class has a rule, "normal"/"none" otherwise
        width: el.offsetWidth,
      };
      el.remove();
    }
    return { out,
      faCssLoaded: Array.from(document.styleSheets).map(s => {
        try { return s.href; } catch { return 'inaccessible'; }
      }).filter(h => h && /font-awesome/i.test(h)),
      fontCheck: document.fonts.check('900 2rem "Font Awesome 6 Free"'),
    };
  }, icons);

  // Also show the live DOM state after the auto-generated pick
  const dom = await page.evaluate(() => ({
    foodIconHtml: document.querySelector('.food-icon')?.innerHTML,
    foodName: document.querySelector('.food-name')?.textContent,
  }));

  console.log('=== ICON GLYPH CHECK (JS getComputedStyle, real browser) ===');
  for (const [cls, r] of Object.entries(results.out)) {
    console.log(`${cls.padEnd(20)} content: ${JSON.stringify(r.content).padEnd(12)} elemWidth: ${r.width}`);
  }
  console.log('=== FONT AWESOME STYLESHEET IN PAGE ===');
  console.log(JSON.stringify(results.faCssLoaded));
  console.log('font loaded (document.fonts.check):', results.fontCheck);
  console.log('=== LIVE DOM AFTER AUTO-GENERATE ===');
  console.log(JSON.stringify(dom));
  console.log('=== CONSOLE / ERRORS / FAILED REQUESTS ===');
  console.log('console messages:', consoleMsgs.length ? consoleMsgs : 'none');
  console.log('page errors:', pageErrors.length ? pageErrors : 'none');
  console.log('failed requests:', failedRequests.length ? failedRequests : 'none');

  await browser.close();
}
main().catch(e => { console.error('FATAL', e); process.exit(1); });