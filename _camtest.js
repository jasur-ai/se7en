const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required',
    '--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const ctx = await b.newContext({viewport:{width:1280,height:900}, permissions:['camera']});
  const p = await ctx.newPage();
  p.on('console', m => { if (m.text().startsWith('DBG')) console.log(m.text()); });
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(800);
  await p.evaluate(() => { const st = window.setTimeout; window.setTimeout = (fn, ms, ...a) => st(fn, Math.max(60, ms*0.25), ...a); });
  await p.waitForTimeout(3000);
  console.log(await p.evaluate(() => {
    const v = document.getElementById('camFeed');
    const s = v && v.srcObject;
    return { hasStream: !!s, tracks: s ? s.getTracks().map(t=>t.readyState+':'+t.label).join(',') : '-',
      vw: v && v.videoWidth, vh: v && v.videoHeight, paused: v && v.paused, readyState: v && v.readyState };
  }));
  await p.waitForFunction(() => !!document.querySelector('#print.show'), null, {timeout:60000});
  console.log(await p.evaluate(() => {
    const c = document.getElementById('camShot');
    const x = c.getContext('2d');
    const d = x.getImageData(0,0,c.width,c.height).data;
    let r=0,g=0,bl=0; const n = d.length/4;
    for (let i=0;i<d.length;i+=4){ r+=d[i]; g+=d[i+1]; bl+=d[i+2]; }
    return { camShotSize:[c.width,c.height], avg:[Math.round(r/n),Math.round(g/n),Math.round(bl/n)] };
  }));
  const pc = await p.evaluate(() => {
    const c = document.getElementById('printCanvas');
    const d = c.getContext('2d').getImageData(0,0,c.width,c.height).data;
    let r=0,g=0,bl=0; const n=d.length/4;
    for (let i=0;i<d.length;i+=4){ r+=d[i]; g+=d[i+1]; bl+=d[i+2]; }
    return { size:[c.width,c.height], avg:[Math.round(r/n),Math.round(g/n),Math.round(bl/n)] };
  });
  console.log('print avg', JSON.stringify(pc));
  await b.close();
})();
