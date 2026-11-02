const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const errs = [];
  const base = 'https://se7en-omega.vercel.app/';
  // desktop
  let ctx = await b.newContext({ viewport: { width: 1440, height: 980 } });
  let p = await ctx.newPage();
  p.on('pageerror', e => errs.push('D:' + e.message));
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  await p.screenshot({ path: '/tmp/f_d1.png' });
  await p.evaluate(() => document.querySelector('#yetti').scrollIntoView());
  await p.waitForTimeout(700);
  await p.screenshot({ path: '/tmp/f_d2.png' });
  const desk = await p.evaluate(() => ({
    lang: document.documentElement.lang,
    entries: document.querySelectorAll('.entry').length,
    refs: document.querySelectorAll('#src li').length,
    title: document.title,
    h1: document.querySelector('h1').textContent.trim()
  }));
  await ctx.close();
  // mobile
  ctx = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
  p = await ctx.newPage();
  p.on('pageerror', e => errs.push('M:' + e.message));
  await p.goto(base, { waitUntil: 'load' });
  await p.waitForTimeout(900);
  await p.screenshot({ path: '/tmp/f_m1.png' });
  await p.evaluate(() => document.querySelector('#yetti').scrollIntoView());
  await p.waitForTimeout(700);
  await p.screenshot({ path: '/tmp/f_m2.png' });
  await p.evaluate(() => window.scrollBy(0, 760));
  await p.waitForTimeout(600);
  await p.screenshot({ path: '/tmp/f_m3.png' });
  await p.tap('button[data-lang="ru"]'); await p.waitForTimeout(600);
  await p.screenshot({ path: '/tmp/f_m4_ru.png' });
  const mob = await p.evaluate(() => ({ ox: document.documentElement.scrollWidth - innerWidth, lang: document.documentElement.lang, first: document.querySelector('.entry h3').textContent }));
  console.log(JSON.stringify({ desk, mob, errs }, null, 1));
  await b.close();
})();
