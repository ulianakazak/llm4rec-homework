const { chromium } = require('playwright');

const EXPECTED = [
  ['Pizza', 'assets/food-icons/pizza.svg'],
  ['Sushi', 'assets/food-icons/sushi.svg'],
  ['Burger', 'assets/food-icons/burger.svg'],
  ['Salad', 'assets/food-icons/salad.svg'],
  ['Tacos', 'assets/food-icons/tacos.svg'],
  ['Ramen', 'assets/food-icons/ramen.svg'],
  ['Sandwich', 'assets/food-icons/sandwich.svg'],
  ['Pasta', 'assets/food-icons/pasta.svg'],
  ['Curry', 'assets/food-icons/curry.svg'],
  ['Steak', 'assets/food-icons/steak.svg'],
  ['Soup', 'assets/food-icons/soup.svg'],
  ['BBQ', 'assets/food-icons/bbq.svg'],
];

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const consoleMsgs = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on('console', (m) => consoleMsgs.push(`[${m.type()}] ${m.text()}`));
  page.on('pageerror', (e) => pageErrors.push(e.message));
  page.on('requestfailed', (r) => failedRequests.push(`${r.url()} -> ${r.failure()?.errorText}`));

  await page.goto('http://localhost:8123/index.html', { waitUntil: 'load' });

  // ---- 1. Initial page load (the app auto-generates once) ----
  await page.waitForTimeout(900);
  const initial = await page.evaluate(() => ({
    name: document.querySelector('.food-name')?.textContent,
    img: document.querySelector('.food-icon img')?.src ?? null,
    imgLoaded: document.querySelector('.food-icon img')?.naturalWidth > 0 ?? false,
  }));
  // FA decoration glyphs present?
  const decor = await page.evaluate(() => {
    const probe = (cls) => {
      const el = document.createElement('i');
      el.className = cls;
      document.body.appendChild(el);
      const c = getComputedStyle(el, '::before').content;
      el.remove();
      return c;
    };
    return { utensils: probe('fas fa-utensils'), random: probe('fas fa-random'), spinner: probe('fas fa-spinner') };
  });

  console.log('=== 1. INITIAL PAGE LOAD ===');
  console.log('auto-generated dish name:', initial.name);
  console.log('auto-generated img src:', initial.img);
  console.log('image loaded (naturalWidth>0):', initial.imgLoaded);
  console.log('decoration glyphs ::before content:', JSON.stringify(decor));

  // ---- 2. Deterministic per-item reach: override Math.random only for the test ----
  console.log('=== 2. ALL 12 ITEMS (Math.random overridden to (i+0.5)/12 per call) ===');
  const results = [];
  for (let i = 0; i < EXPECTED.length; i++) {
    await page.evaluate((i) => {
      window.__realRandom = Math.random;
      Math.random = () => (i + 0.5) / 12;
    }, i);
    await page.click('#generateBtn');
    await page.waitForTimeout(700); // 500ms inner timeout + buffer
    const state = await page.evaluate(() => ({
      name: document.querySelector('.food-name')?.textContent,
      imgSrc: document.querySelector('.food-icon img')?.getAttribute('src') ?? null,
      imgAlt: document.querySelector('.food-icon img')?.getAttribute('alt') ?? null,
      loaded: document.querySelector('.food-icon img')?.naturalWidth > 0 ?? false,
    }));
    const [expName, expImg] = EXPECTED[i];
    const ok = state.name === expName && state.imgSrc === expImg && state.loaded === true;
    results.push({ i, expName, ok });
    console.log(
      `i=${i} exp=(${expName}, ${expImg}) got=(${state.name}, ${state.imgSrc}) alt="${state.imgAlt}" imgLoaded=${state.loaded} -> ${ok ? 'PASS' : 'FAIL'}`
    );
  }
  await page.evaluate(() => {
    if (window.__realRandom) Math.random = window.__realRandom;
  });

  // ---- 3. Button wiring sanity: real Math.random, many clicks always produce an image ----
  const spins = [];
  for (let k = 0; k < 5; k++) {
    await page.click('#generateBtn');
    await page.waitForTimeout(700);
    spins.push(await page.evaluate(() => document.querySelector('.food-icon img') !== null));
  }
  console.log('=== 3. BUTTON + REAL Math.random (5 clicks all yield an image) ===');
  console.log(JSON.stringify(spins));

  console.log('=== 4. CONSOLE / ERRORS / FAILED REQUESTS ===');
  console.log('console messages:', consoleMsgs.length ? consoleMsgs : 'none');
  console.log('page errors:', pageErrors.length ? pageErrors : 'none');
  console.log('failed requests:', failedRequests.length ? failedRequests : 'none');

  await browser.close();
}
main().catch(e => { console.error('FATAL', e); process.exit(1); });