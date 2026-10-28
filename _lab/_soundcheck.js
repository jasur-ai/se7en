const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const p = await (await b.newContext({viewport:{width:1200,height:800}})).newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(3500);
  console.log('t=3.5s', JSON.stringify(await p.evaluate(() => SFX.probe(500))));
  await p.waitForTimeout(6000);
  console.log('t=9.5s', JSON.stringify(await p.evaluate(() => SFX.probe(500))));
  console.log('errors:', errs.join(' | ') || 'none');
  await b.close();
})();
