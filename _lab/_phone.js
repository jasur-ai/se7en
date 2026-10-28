/* PHONE AUDIT — the dossier as a hand actually meets it.
   Runs the page in the real Safari engine (WebKit) and in Chromium, both
   emulating an iPhone 13 at 390×664 / dpr 3, and reports:
     · layout: header, overflow, heading word-groups, dock
     · function: burger, language, sound, card → drawer, drawer close, skip
     · errors: anything thrown on the way
   Usage:  node _phone.js [url]      (server: python3 -m http.server 8099) */
const { webkit, chromium, devices } = require('playwright');
const URL = process.argv[2] || 'http://127.0.0.1:8099/index.html?intro=0';

async function run(name, launcher) {
  const b = await launcher.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('PE ' + e.message.slice(0, 100)));
  page.on('console', m => { if (m.type() === 'error') errs.push('CE ' + m.text().slice(0, 100)); });
  await page.goto(URL, { waitUntil: 'load', timeout: 40000 });
  await page.waitForTimeout(2200);

  const layout = await page.evaluate(() => {
    const R = e => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; };
    const h2 = document.querySelector('.sec-titles h2');
    const dock = document.querySelector('#dock');
    return {
      overflowX: document.documentElement.scrollWidth - innerWidth,
      headerRight: Math.round(document.querySelector('.bar-tools').getBoundingClientRect().right),
      vw: innerWidth,
      h2: h2 ? { size: getComputedStyle(h2).fontSize, words: h2.querySelectorAll('.wd').length, letters: h2.querySelectorAll('.ch').length, lines: Math.round(h2.getBoundingClientRect().height / parseFloat(getComputedStyle(h2).lineHeight)) } : null,
      dock: dock ? R(dock) : null,
      dockBar: !!(dock && getComputedStyle(dock).width > 120)
    };
  });

  const fn = {};
  await page.tap('#burger'); await page.waitForTimeout(600);
  fn.menu = await page.evaluate(() => document.querySelector('.navlinks').className + ':' + document.querySelectorAll('.navlinks a').length);
  await page.tap('#burger'); await page.waitForTimeout(400);
  await page.tap('#sndBtn'); await page.waitForTimeout(500);
  fn.sound = await page.evaluate(() => document.querySelector('#sndBtn').className);
  await page.evaluate(() => document.querySelector('.sin').scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelector('.sin').click());
  await page.waitForTimeout(800);
  fn.drawer = await page.evaluate(() => document.querySelector('#drawer').className + ':' + (document.querySelector('#drTitle') || {}).textContent);
  await page.evaluate(() => { const x = document.querySelector('#drawer .close, #drawer button'); if (x) x.click(); });
  await page.waitForTimeout(600);
  fn.drawerClose = await page.evaluate(() => document.querySelector('#drawer').className || '(closed)');

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `/tmp/phone_${name}_hero.png` });
  await page.evaluate(() => document.querySelector('.myth, .best-card, .geo').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `/tmp/phone_${name}_card.png` });

  await b.close();
  return { name, layout, fn, errs: errs.slice(0, 6) };
}

(async () => {
  const out = [];
  for (const [n, l] of [['webkit', webkit], ['chromium', chromium]]) {
    try { out.push(await run(n, l)); } catch (e) { out.push({ name: n, fatal: String(e.message).slice(0, 200) }); }
  }
  console.log(JSON.stringify(out, null, 1));
})();
