const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'] });
  const ctx = await b.newContext({ ...devices['iPhone 13'], permissions: ['camera'] });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message.slice(0,80)));
  const t0 = Date.now();
  await page.goto('http://127.0.0.1:8099/index.html?intro=1', { waitUntil: 'load' });
  let done = 0, printShown = 0;
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(1000);
    const s = await page.evaluate(() => ({ awake: document.body.classList.contains('awake'), print: document.querySelector('#print') ? document.querySelector('#print').classList.contains('show') : false }));
    if (s.print && !printShown) printShown = Math.round((Date.now()-t0)/1000);
    if (s.awake) { done = Math.round((Date.now()-t0)/1000); break; }
  }
  console.log(JSON.stringify({ printAtSec: printShown, awakeAtSec: done, errs }));
  await b.close();
})();
