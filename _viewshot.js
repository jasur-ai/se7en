const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required',
    '--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const ctx = await b.newContext({viewport:{width:1366,height:900}, permissions:['camera']});
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(1200);
  await p.click('#introStart');
  await p.waitForFunction(() => document.getElementById('intro')?.classList.contains('live'), null, {timeout:40000});
  await p.waitForTimeout(1400);
  await p.screenshot({path:'/tmp/V_live.png'});
  console.log('view canvas has pixels:', await p.evaluate(() => {
    const c = document.getElementById('camView'); const x = c.getContext('2d');
    const d = x.getImageData(0,0,c.width,c.height).data;
    let nz = 0; for (let i=0;i<d.length;i+=4) if (d[i]||d[i+1]||d[i+2]) nz++;
    return nz + '/' + (d.length/4);
  }));
  console.log('errors:', errs.length?errs.join(' | '):'none');
  await b.close();
})();
