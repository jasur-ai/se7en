const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const p = await (await b.newContext({viewport:{width:1440,height:900}, permissions:['camera']})).newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForFunction(() => document.getElementById('intro')?.classList.contains('burn'), null, {timeout:60000});
  await p.waitForTimeout(400);
  const fps = await p.evaluate(() => new Promise(res => {
    let n = 0; const t0 = performance.now();
    const f = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else res(Math.round(n / ((performance.now()-t0)/1000))); };
    requestAnimationFrame(f);
  }));
  await p.screenshot({path:'/tmp/i_burn.png'});
  console.log('burn fps', fps, 'errors:', errs.join(' | ') || 'none');
  await b.close();
})();
