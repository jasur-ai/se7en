const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const errs = [];
  // desktop wrong-then-check
  let ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
  let p = await ctx.newPage();
  p.on('pageerror', e => errs.push('D ' + e.message.slice(0,90)));
  await p.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'load' });
  await p.evaluate(() => document.querySelector('#zanjir').scrollIntoView());
  await p.waitForTimeout(600);
  const deck0 = await p.evaluate(() => document.querySelector('#pzDeck .card').dataset.card);
  await p.click(`#pzDeck [data-card="${deck0}"]`);
  await p.click('#pzSlots [data-slot="0"] .fill');
  await p.click('#pzCheck');
  await p.waitForTimeout(600);
  const wrong = await p.evaluate(() => ({ status: document.querySelector('#pzStatus').textContent, deck: document.querySelectorAll('#pzDeck .card').length, count: document.querySelector('#pzCount').textContent }));
  await p.screenshot({ path: '/tmp/pz_wrong.png', clip: { x: 180, y: 200, width: 1000, height: 700 } });
  // solve via hints
  for (let i = 0; i < 7; i++){ await p.click('#pzHint'); await p.waitForTimeout(150); }
  await p.waitForTimeout(600);
  await p.evaluate(() => document.querySelector('#pzDone').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(500);
  await p.screenshot({ path: '/tmp/pz_win.png' });
  const win = await p.evaluate(() => ({ checkVisible: getComputedStyle(document.querySelector('#pzCheck')).display, rays: document.querySelectorAll('#pzSeal .ray.on').length }));
  await ctx.close();
  // mobile
  ctx = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
  p = await ctx.newPage();
  p.on('pageerror', e => errs.push('M ' + e.message.slice(0,90)));
  await p.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'load' });
  await p.evaluate(() => document.querySelector('#zanjir').scrollIntoView());
  await p.waitForTimeout(700);
  await p.screenshot({ path: '/tmp/pz_m1.png' });
  const d0 = await p.evaluate(() => document.querySelector('#pzDeck .card').dataset.card);
  await p.tap(`#pzDeck [data-card="${d0}"]`);
  await p.tap('#pzSlots [data-slot="0"] .fill');
  await p.tap('#pzCheck');
  await p.waitForTimeout(500);
  await p.screenshot({ path: '/tmp/pz_m2.png' });
  const mob = await p.evaluate(() => ({ ox: document.documentElement.scrollWidth - innerWidth, status: document.querySelector('#pzStatus').textContent, h: Math.round(document.querySelector('#zanjir').getBoundingClientRect().height) }));
  console.log(JSON.stringify({ deck0, wrong, win, mob, errs }, null, 1));
  await b.close();
})();
