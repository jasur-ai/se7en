const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const ctx = await b.newContext({
    viewport:{width:1280,height:800},
    recordVideo:{ dir:'/tmp/vid', size:{width:1280,height:800} }
  });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8099/index.html',{waitUntil:'load'});
  await p.waitForTimeout(1200);
  await p.click('#enterBtn');
  await p.waitForTimeout(3400);
  await p.waitForTimeout(600);
  const path = await p.video().path();
  console.log('video', path);
  await ctx.close(); await b.close();
})();
