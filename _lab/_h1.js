const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const [name, vp] of [['d1440', { width: 1440, height: 900 }], ['d1024', { width: 1024, height: 800 }]]) {
    const p = await (await b.newContext({ viewport: vp })).newPage();
    await p.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'load' });
    await p.waitForTimeout(400);
    const m = await p.evaluate(() => { const h = document.querySelector('h1'); const r = h.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), parent: Math.round(h.parentElement.getBoundingClientRect().width), lines: Math.round(r.height / parseFloat(getComputedStyle(h).fontSize) / 0.9) }; });
    console.log(name, JSON.stringify(m));
    await p.screenshot({ path: `/tmp/h1_${name}.png`, clip: { x: 0, y: 60, width: vp.width, height: 420 } });
  }
  const p = await (await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 })).newPage();
  await p.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'load' });
  await p.waitForTimeout(500);
  const m = await p.evaluate(() => { const h = document.querySelector('h1'); const r = h.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), ox: document.documentElement.scrollWidth - innerWidth }; });
  console.log('mobile', JSON.stringify(m));
  await p.screenshot({ path: '/tmp/h1_m.png', clip: { x: 0, y: 0, width: 390, height: 330 } });
  await b.close();
})();
