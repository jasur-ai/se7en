const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const errs = [];
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('PE ' + e.message.slice(0, 120)));
  p.on('console', m => { if (m.type() === 'error') errs.push('CE ' + m.text().slice(0, 120)); });
  await p.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  await p.evaluate(() => document.querySelector('#zanjir').scrollIntoView());
  await p.waitForTimeout(600);
  await p.screenshot({ path: '/tmp/pz1.png' });

  const st = () => p.evaluate(() => ({
    count: document.querySelector('#pzCount').textContent,
    deck: [...document.querySelectorAll('#pzDeck .card')].map(c => c.dataset.card),
    slots: [...document.querySelectorAll('#pzSlots .slot')].map(s => ({ k: (s.querySelector('.nm') || {}).textContent || null, locked: s.classList.contains('locked') })),
    status: document.querySelector('#pzStatus').textContent,
    done: document.querySelector('#pzDone').classList.contains('show')
  }));

  // 1 · wrong placement: put the first deck card into slot 1 (may be wrong)
  let deck0 = (await st()).deck[0];
  await p.click(`#pzDeck [data-card="${deck0}"]`);
  await p.click('#pzSlots [data-slot="0"] .fill');
  await p.waitForTimeout(200);
  const afterPlace = await st();
  // 2 · check -> wrong card should bounce back
  await p.click('#pzCheck');
  await p.waitForTimeout(500);
  const afterCheck = await st();
  await p.screenshot({ path: '/tmp/pz2.png' });

  // 3 · hint reveals slot 1
  await p.click('#pzHint');
  await p.waitForTimeout(400);
  const afterHint = await st();
  await p.screenshot({ path: '/tmp/pz3.png' });

  // 4 · solve the rest via hints
  for (let i = 0; i < 7; i++){ await p.click('#pzHint'); await p.waitForTimeout(180); }
  const solved = await st();
  await p.waitForTimeout(700);
  await p.evaluate(() => document.querySelector('#pzDone').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(500);
  await p.screenshot({ path: '/tmp/pz4.png' });
  const pairs = await p.evaluate(() => [...document.querySelectorAll('#pzPairs li')].map(x => x.textContent.trim()));
  const sealOn = await p.evaluate(() => document.querySelectorAll('#pzSeal .ray.on').length);

  console.log(JSON.stringify({ deck0, afterPlace, afterCheck, afterHint, solved, pairs, sealOn, errs }, null, 1));
  await b.close();
})();
