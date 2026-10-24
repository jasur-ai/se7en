const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required',
    '--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const ctx = await b.newContext({viewport:{width:1366,height:900}, permissions:['camera']});
  const p = await ctx.newPage();
  const fps = async (l) => {
    const r = await p.evaluate(async () => await new Promise(res => {
      let n=0; const t0=performance.now();
      const tick=()=>{ n++; const t=performance.now(); if(t-t0<1600) requestAnimationFrame(tick); else res(+(n/((t-t0)/1000)).toFixed(1)); };
      requestAnimationFrame(tick);
    }));
    console.log(l.padEnd(28), r);
  };
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(2000);
  await p.click('#introStart');
  await p.waitForTimeout(3000);
  await fps('room lit');
  console.log('anims', await p.evaluate(() => document.getAnimations().map(a=>(a.animationName||'?')+':'+(a.effect?.target?.className||'').toString().slice(0,20))));
  await p.evaluate(() => document.getAnimations().forEach(a=>a.cancel()));
  await p.waitForTimeout(400); await fps('+ anims cancelled');
  await p.evaluate(() => { const g=document.querySelector('#intro .grain'); if(g) g.style.display='none'; });
  await p.waitForTimeout(300); await fps('+ grain off');
  await p.evaluate(() => { const g=document.querySelector('#intro .filament'); if(g) g.style.display='none'; });
  await p.waitForTimeout(300); await fps('+ filament off');
  await p.evaluate(() => { const v=document.getElementById('camFeed'); if(v) v.style.display='none'; });
  await p.waitForTimeout(300); await fps('+ video hidden');
  await p.evaluate(() => { const g=document.querySelector('#intro .edge'); if(g) g.style.display='none'; });
  await p.waitForTimeout(300); await fps('+ edge off');
  await p.evaluate(() => { const g=document.querySelector('#intro .plate'); if(g) g.style.display='none'; });
  await p.waitForTimeout(300); await fps('+ plate off');
  await b.close();
})();
