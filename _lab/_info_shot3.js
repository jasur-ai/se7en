const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const errs = [];
  const ctx = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'load' });
  await p.waitForTimeout(800);
  await p.screenshot({ path: '/tmp/k_m1.png' });
  await p.evaluate(() => document.querySelector('#yetti').scrollIntoView());
  await p.waitForTimeout(700);
  await p.screenshot({ path: '/tmp/k_m2.png' });
  await p.evaluate(() => window.scrollBy(0, 780));
  await p.waitForTimeout(600);
  await p.screenshot({ path: '/tmp/k_m3.png' });
  await p.evaluate(() => document.querySelector('#lugat').scrollIntoView());
  await p.waitForTimeout(600);
  await p.screenshot({ path: '/tmp/k_m5.png' });
  const info = await p.evaluate(() => ({
    ox: document.documentElement.scrollWidth - innerWidth,
    navVisible: !!document.querySelector('nav.links') && getComputedStyle(document.querySelector('nav.links')).display !== 'none',
    navScrollable: (() => { const n = document.querySelector('nav.links'); return n.scrollWidth > n.clientWidth; })(),
    headH: Math.round(document.querySelector('.top').getBoundingClientRect().height),
    entries: document.querySelectorAll('.entry').length
  }));
  // tap a nav item
  await p.tap('nav.links a[data-nav="manbalar"]');
  await p.waitForTimeout(900);
  const afterTap = await p.evaluate(() => ({ y: Math.round(scrollY), at: Math.round(document.querySelector('#manbalar').getBoundingClientRect().top) }));
  await p.screenshot({ path: '/tmp/k_m6.png' });
  console.log(JSON.stringify({ info, afterTap, errs }, null, 1));
  await b.close();
})();
