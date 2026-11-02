const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const errs = [];
  const URL_ = 'http://127.0.0.1:8099/index.html';
  const R = {};
  // desktop languages + table + sources
  let ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
  let p = await ctx.newPage();
  p.on('pageerror', e => errs.push('D ' + e.message.slice(0,80)));
  await p.goto(URL_, { waitUntil: 'load' });
  await p.waitForTimeout(500);
  R.brand = await p.evaluate(() => document.querySelector('.brand b').textContent);
  R.uz = await p.evaluate(() => ({ h1: document.querySelector('h1').textContent, nav: [...document.querySelectorAll('nav.links a')].map(a=>a.textContent), src: document.querySelectorAll('#src li').length, th: [...document.querySelectorAll('#tblHead th')].map(x=>x.textContent) }));
  await p.click('button[data-lang="ru"]'); await p.waitForTimeout(400);
  R.ru = await p.evaluate(() => ({ note: document.querySelector('#jadval .note p').textContent.slice(0, 60), card: document.querySelector('#pzDeck .card').textContent.slice(0, 30), which: document.querySelector('#pzPut .t').textContent }));
  await p.screenshot({ path: '/tmp/z_ru.png', clip: { x: 150, y: 60, width: 1140, height: 940 } });
  await p.click('button[data-lang="en"]'); await p.waitForTimeout(300);
  R.en = await p.evaluate(() => ({ h1: document.querySelector('h1').textContent, first: document.querySelector('.entry h3').textContent, deck: document.querySelectorAll('#pzDeck .card').length }));
  await ctx.close();
  // mobile full flow
  ctx = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
  p = await ctx.newPage();
  p.on('pageerror', e => errs.push('M ' + e.message.slice(0,80)));
  await p.goto(URL_, { waitUntil: 'load' });
  await p.waitForTimeout(700);
  R.mobTop = await p.evaluate(() => ({ ox: document.documentElement.scrollWidth - innerWidth, brand: document.querySelector('.brand b').textContent }));
  await p.screenshot({ path: '/tmp/z_m1.png' });
  await p.evaluate(() => document.querySelector('#zanjir').scrollIntoView());
  await p.waitForTimeout(500);
  // solve with bar
  for (let i = 0; i < 7; i++){
    const k = await p.evaluate((i) => { const order = ['kibr','hasad','buxiylik','ochkozlik','shahvat','gazab','dangasalik']; return order[i]; }, i);
    const inDeck = await p.evaluate(k => !!document.querySelector(`#pzDeck [data-card="${k}"]`), k);
    if (inDeck){ await p.tap(`#pzDeck [data-card="${k}"]`); await p.waitForTimeout(150); await p.tap(`#pzPut [data-put="${i}"]`); await p.waitForTimeout(150); }
  }
  await p.tap('#pzCheck'); await p.waitForTimeout(700);
  const solved = await p.evaluate(() => ({ count: document.querySelector('#pzCount').textContent, done: document.querySelector('#pzDone').classList.contains('show'), status: document.querySelector('#pzStatus').textContent }));
  await p.evaluate(() => document.querySelector('#pzDone').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(400);
  await p.screenshot({ path: '/tmp/z_m2.png' });
  // language switch mid-puzzle keeps it solved
  await p.tap('button[data-lang="ru"]'); await p.waitForTimeout(600);
  const afterLang = await p.evaluate(() => ({ count: document.querySelector('#pzCount').textContent, deck: document.querySelectorAll('#pzDeck .card').length, first: document.querySelector('.slot .nm') ? document.querySelector('.slot .nm').textContent : null }));
  await p.screenshot({ path: '/tmp/z_m3_ru.png' });
  R.mob = { solved, afterLang };
  console.log(JSON.stringify({ ...R, errs }, null, 1));
  await b.close();
})();
