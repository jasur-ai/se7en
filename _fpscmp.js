const { chromium } = require('playwright');
const probe = async (p) => p.evaluate(() => new Promise(res => {
  let n = 0; const t0 = performance.now();
  const f = () => { n++; if (performance.now() - t0 < 2500) requestAnimationFrame(f); else res(Math.round(n / ((performance.now()-t0)/1000))); };
  requestAnimationFrame(f);
}));
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const p = await (await b.newContext({viewport:{width:1440,height:900}, permissions:['camera']})).newPage();
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForFunction(() => document.getElementById('intro')?.classList.contains('lit'), null, {timeout:30000});
  console.log('room fps', await probe(p));
  await p.evaluate(() => document.getElementById('intro').classList.add('burn'));
  await p.waitForTimeout(600);
  console.log('burn fps', await probe(p));
  await p.evaluate(() => { document.querySelector('#intro .flames').style.display='none'; });
  await p.waitForTimeout(300);
  console.log('burn without flames fps', await probe(p));
  await b.close();
})();
