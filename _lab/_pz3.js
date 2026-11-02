const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const errs = [];
  const ctx = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(e.message.slice(0, 100)));
  await p.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'load' });
  await p.evaluate(() => document.querySelector('#zanjir').scrollIntoView());
  await p.waitForTimeout(700);
  // deck should now be first
  const ord = await p.evaluate(() => {
    const board = document.querySelector('.pz-board');
    return [...board.children].map(c => ({ first: c.querySelector('.deck') ? 'deck' : 'slots', y: Math.round(c.getBoundingClientRect().top + scrollY) }));
  });
  await p.screenshot({ path: '/tmp/q1.png' });
  // pick a card -> bar should appear
  const k = await p.evaluate(() => document.querySelector('#pzDeck .card').dataset.card);
  await p.tap(`#pzDeck [data-card="${k}"]`);
  await p.waitForTimeout(400);
  const bar = await p.evaluate(() => ({
    show: document.querySelector('#pzPut').classList.contains('show'),
    display: getComputedStyle(document.querySelector('#pzPut')).display,
    buttons: document.querySelectorAll('#pzPut [data-put]').length,
    bodyPad: getComputedStyle(document.body).paddingBottom
  }));
  await p.screenshot({ path: '/tmp/q2.png' });
  // place via the bar into slot 1, then wrong-check
  await p.tap('#pzPut [data-put="0"]');
  await p.waitForTimeout(300);
  await p.tap('#pzCheck');
  await p.waitForTimeout(500);
  const after = await p.evaluate(() => ({ status: document.querySelector('#pzStatus').textContent, count: document.querySelector('#pzCount').textContent, bar: document.querySelector('#pzPut').classList.contains('show') }));
  await p.screenshot({ path: '/tmp/q3.png' });
  console.log(JSON.stringify({ ord, bar, after, errs }, null, 1));
  await b.close();
})();
