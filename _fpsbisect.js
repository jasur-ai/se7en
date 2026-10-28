const { chromium } = require('playwright');
const probe = async (p) => p.evaluate(() => new Promise(res => {
  let n = 0; const t0 = performance.now();
  const f = () => { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(f); else res(Math.round(n / ((performance.now()-t0)/1000))); };
  requestAnimationFrame(f);
}));
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForFunction(() => document.getElementById('intro')?.classList.contains('lit'), null, {timeout:30000});
  await p.evaluate(() => document.getElementById('intro').classList.add('burn'));
  await p.waitForTimeout(800);
  console.log('burn (all)', await probe(p));
  await p.evaluate(() => { document.querySelector('#intro .flames').style.animation='none'; });
  await p.waitForTimeout(200); console.log('flames animation off', await probe(p));
  await p.evaluate(() => { document.querySelector('#intro .flames').style.display='none'; });
  await p.waitForTimeout(200); console.log('flames hidden', await probe(p));
  await p.evaluate(() => { document.querySelector('#intro .firelight').style.display='none'; });
  await p.waitForTimeout(200); console.log('firelight hidden too', await probe(p));
  await b.close();
})();
