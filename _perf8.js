const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
  const measure = async (l) => {
    const r = await p.evaluate(async () => await new Promise(res => {
      let n=0; const t0=performance.now();
      const tick=()=>{ n++; if(performance.now()-t0<1800) requestAnimationFrame(tick); else res({fps:+(n/((performance.now()-t0)/1000)).toFixed(1)}); };
      requestAnimationFrame(tick);
    }));
    console.log(l.padEnd(30), JSON.stringify(r));
  };
  await p.goto('http://localhost:8099/index.html?intro=0',{waitUntil:'load'});
  await p.waitForTimeout(2500);
  await measure('as shipped');
  await p.evaluate(() => { const g=document.querySelector('.depth-grid'); if(g) g.style.display='none'; });
  await p.waitForTimeout(300); await measure('grid hidden (fog on)');
  await p.evaluate(() => { const d=document.getElementById('depth'); if(d) d.style.display='none'; });
  await p.waitForTimeout(300); await measure('fog hidden too');
  await p.evaluate(() => { const d=document.getElementById('depth'); if(d) d.style.display=''; });
  await p.evaluate(() => { if (window.DEPTH && DEPTH.pause) DEPTH.pause(); });
  await p.waitForTimeout(300); await measure('fog visible, paused');
  console.log('canvas size:', await p.evaluate(() => { const c=document.getElementById('depth'); return c?[c.width,c.height]:null; }));
  await b.close();
})();
