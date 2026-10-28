const { chromium } = require('playwright');
const probe = async (p, ms=2500) => p.evaluate((ms) => new Promise(res => {
  let n = 0; const t0 = performance.now();
  const f = () => { n++; if (performance.now() - t0 < ms) requestAnimationFrame(f); else res(Math.round(n / ((performance.now()-t0)/1000))); };
  requestAnimationFrame(f);
}), ms);
(async () => {
  for (const mode of ['no-camera','fake-camera']) {
    const b = await chromium.launch({args:['--no-sandbox',
      ...(mode==='fake-camera' ? ['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream'] : [])]});
    const ctx = await b.newContext({viewport:{width:1440,height:900}, permissions: mode==='fake-camera' ? ['camera'] : []});
    const p = await ctx.newPage();
    await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
    await p.waitForFunction(() => document.getElementById('intro')?.classList.contains('lit'), null, {timeout:30000});
    await p.waitForTimeout(1500);
    const room = [await probe(p), await probe(p)];
    await p.evaluate(() => document.getElementById('intro').classList.add('burn'));
    await p.waitForTimeout(900);
    const burn = [await probe(p), await probe(p)];
    console.log(mode, 'room', room, 'burn', burn);
    await b.close();
  }
})();
