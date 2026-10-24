const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await (await b.newContext({viewport:{width:1366,height:900}})).newPage();
  const fps = async (label) => {
    const r = await p.evaluate(async () => await new Promise(res => {
      let n=0; const t0=performance.now();
      const tick=()=>{ n++; const t=performance.now(); if(t-t0<1600) requestAnimationFrame(tick); else res(+(n/((t-t0)/1000)).toFixed(1)); };
      requestAnimationFrame(tick);
    }));
    console.log(label.padEnd(34), r);
  };
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(3000);
  console.log('no-depth?', await p.evaluate(() => document.body.classList.contains('no-depth')));
  await fps('gate (as shipped)');
  await p.evaluate(() => { const d=document.getElementById('depth'); if(d) d.style.display='none'; });
  await p.waitForTimeout(300); await fps('gate, depth off');
  await p.evaluate(() => { document.querySelectorAll('#intro .blood,#intro .bulbglow,#intro .grain,#intro .dim').forEach(e=>e.style.display='none'); });
  await p.waitForTimeout(300); await fps('+ overlays off');
  await p.evaluate(() => { const pl=document.querySelector('#intro .plate'); if(pl) pl.style.display='none'; });
  await p.waitForTimeout(300); await fps('+ plate off');
  await p.evaluate(() => { const g=document.querySelector('#intro .gate'); if(g) g.style.display='none'; });
  await p.waitForTimeout(300); await fps('+ gate card off');
  await p.evaluate(() => { const i=document.getElementById('intro'); if(i) i.style.display='none'; });
  await p.waitForTimeout(300); await fps('+ intro off (dossier)');
  await b.close();
})();
