const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required',
    '--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const ctx = await b.newContext({viewport:{width:1366,height:900}, permissions:['camera']});
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('https://se7en-omega.vercel.app/?intro=1',{waitUntil:'load',timeout:60000});
  await p.waitForTimeout(1500);
  await p.waitForFunction(() => !!document.querySelector('#print.show'), null, {timeout:120000});
  console.log(JSON.stringify(await p.evaluate(() => {
    const c = document.getElementById('printCanvas');
    const d = c.getContext('2d').getImageData(0,0,c.width,c.height).data;
    let r=0,g=0,bl=0; const n=d.length/4;
    for (let i=0;i<d.length;i+=4){ r+=d[i]; g+=d[i+1]; bl+=d[i+2]; }
    const feed = document.getElementById('camFeed');
    return { printAvg:[Math.round(r/n),Math.round(g/n),Math.round(bl/n)],
             feed:[feed.videoWidth, feed.videoHeight], hasStream: !!feed.srcObject };
  })));
  await p.screenshot({path:'/tmp/L4_print.png'});
  console.log('errors:', errs.length?errs.slice(0,2).join(' | '):'none');
  await b.close();
})();
