const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required',
    '--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const ctx = await b.newContext({viewport:{width:1366,height:900}, permissions:['camera']});
  const p = await ctx.newPage();
  const fps = async (l) => {
    const r = await p.evaluate(async () => await new Promise(res => {
      let n=0; const t0=performance.now();
      const tick=()=>{ n++; const t=performance.now(); if(t-t0<1500) requestAnimationFrame(tick); else res(+(n/((t-t0)/1000)).toFixed(1)); };
      requestAnimationFrame(tick);
    }));
    console.log(l.padEnd(28), r);
  };
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(1200);
  await p.click('#introStart');
  await p.waitForFunction(() => !!document.querySelector('#print.show'), null, {timeout:90000});
  await p.waitForTimeout(2200);
  await fps('as shipped');
  await p.evaluate(() => { document.querySelectorAll('#intro .flames,#intro .firelight').forEach(e=>e.style.display='none'); });
  await p.waitForTimeout(400); await fps('fire off');
  await p.evaluate(() => { document.querySelectorAll('#intro .print .embers').forEach(e=>e.style.display='none'); });
  await p.waitForTimeout(400); await fps('+ embers off');
  await p.evaluate(() => { document.querySelectorAll('#intro .plate,#intro .edge,#intro .dim').forEach(e=>e.style.display='none'); });
  await p.waitForTimeout(400); await fps('+ room off');
  await p.evaluate(() => { const pr=document.getElementById('print'); if(pr) pr.style.animation='none'; });
  await p.waitForTimeout(400); await fps('+ print float off');
  await b.close();
})();
