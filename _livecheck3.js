const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await b.newPage({viewport:{width:1440,height:1000}});
  await p.goto('https://se7en-omega.vercel.app/', {waitUntil:'load', timeout:60000});
  await p.waitForTimeout(800);
  await p.click('#enterBtn');
  let prev = 0;
  for (const at of [1200, 2600, 4200, 6000]) {
    await p.waitForTimeout(at - prev); prev = at;
    const st = await p.evaluate(()=>({y:Math.round(scrollY), tb:Math.round(document.querySelector('.topbar').getBoundingClientRect().top)}));
    console.log(at, JSON.stringify(st));
    await p.screenshot({path:`/tmp/lv_${at}.png`});
  }
  await b.close();
})();
