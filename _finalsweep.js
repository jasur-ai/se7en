const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await b.newPage({viewport:{width:1440,height:1000}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('https://se7en-omega.vercel.app/', {waitUntil:'load', timeout:60000});
  await p.waitForTimeout(900);
  await p.click('#enterBtn');
  await p.waitForTimeout(2200);
  for (const id of ['sins','bestiary','geography','craft']) {
    await p.evaluate((i)=>{ const el=document.getElementById(i); window.scrollTo(0, el.offsetTop - 40); }, id);
    await p.waitForTimeout(1600);
    await p.screenshot({path:`/tmp/live_${id}.png`});
  }
  console.log('errors:', errs.length?errs.join(' | '):'none');
  await b.close();
})();
