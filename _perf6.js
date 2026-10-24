const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
  const measure = async (label) => {
    const r = await p.evaluate(async () => await new Promise(res => {
      let n=0; const t0=performance.now(); let last=t0, worst=0;
      const tick=()=>{const t=performance.now(); const dt=t-last; last=t; if(dt>worst)worst=dt; n++;
        if(t-t0<2000) requestAnimationFrame(tick); else res({fps:+(n/((t-t0)/1000)).toFixed(1)});};
      requestAnimationFrame(tick);
    }));
    console.log(label.padEnd(30), JSON.stringify(r));
  };
  await p.goto('http://localhost:8099/index.html?intro=0',{waitUntil:'load'});
  await p.waitForTimeout(2500);
  await measure('as shipped');
  for (const name of ['slowspin','floorDrift','floorSway','drop','sigilFloat','compassIn']) {
    await p.evaluate((nm) => document.getAnimations().forEach(a => { if (a.animationName === nm) a.cancel(); }), name);
    await p.waitForTimeout(300);
    await measure('cancelled ' + name);
  }
  await p.evaluate(() => {
    const c = document.querySelector('.hero-compass'); if (c) c.style.display = 'none';
  });
  await p.waitForTimeout(300); await measure('compass hidden');
  await p.evaluate(() => { const g = document.querySelector('.depth-grid'); if (g) g.style.display='none'; });
  await p.waitForTimeout(300); await measure('floor hidden');
  await b.close();
})();
