const { chromium } = require('playwright');

async function snapshot(url, outFile, forceIndex) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 520, height: 640 } });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(200);
  await page.evaluate((i) => { Math.random = () => (i + 0.5) / 12; }, forceIndex);
  await page.click('#generateBtn');
  await page.waitForTimeout(700);
  await page.screenshot({ path: outFile });
  await browser.close();
  console.log('saved', outFile);
}

(async () => {
  await snapshot('http://localhost:8123/starter/index.html', 'tools/screenshot-original-pasta.png', 7);
  await snapshot('http://localhost:8123/index.html', 'tools/screenshot-fixed-pasta.png', 7);
  await snapshot('http://localhost:8123/index.html', 'tools/screenshot-fixed-ramen.png', 5);
  await snapshot('http://localhost:8123/index.html', 'tools/screenshot-fixed-bbq.png', 11);
})();