const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await (await b.newContext({viewport:{width:1366,height:900}})).newPage();
  const fps = async (l) => {
    const r = await p.evaluate(async () => await new Promise(res => {
      let n=0; const t0=performance.now();
      const tick=()=>{ n++; const t=performance.now(); if(t-t0<1600) requestAnimationFrame(tick); else res(+(n/((t-t0)/1000)).toFixed(1)); };
      requestAnimationFrame(tick);
    }));
    console.log(l.padEnd(30), r);
  };
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(2500);
  await fps('gate');
  console.log('anims:', await p.evaluate(() => document.getAnimations().map(a => (a.animationName||'?') + ':' + (a.effect?.target?.className||'').toString().slice(0,24))));
  await p.evaluate(() => document.getAnimations().forEach(a => a.pause()));
  await p.waitForTimeout(400); await fps('animations paused');
  await p.evaluate(() => document.getAnimations().forEach(a => a.cancel()));
  await p.waitForTimeout(400); await fps('animations cancelled');
  await p.evaluate(() => { const c=document.querySelector('#intro .gate-card'); if(c) c.style.boxShadow='none'; });
  await p.waitForTimeout(300); await fps('card shadow off');
  await p.evaluate(() => { const g=document.querySelector('#intro .gate'); if(g) g.style.background='#000'; });
  await p.waitForTimeout(300); await fps('gate scrim flat');
  await b.close();
})();
