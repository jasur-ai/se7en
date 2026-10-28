const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
  const measure = async (label) => {
    const r = await p.evaluate(async () => await new Promise(res => {
      let n=0; const t0=performance.now(); let last=t0;
      const tick=()=>{const t=performance.now(); last=t; n++;
        if(t-t0<1800) requestAnimationFrame(tick); else res({fps:+(n/((t-t0)/1000)).toFixed(1)});};
      requestAnimationFrame(tick);
    }));
    console.log(label.padEnd(34), JSON.stringify(r));
  };
  await p.goto('http://localhost:8099/index.html?intro=0',{waitUntil:'load'});
  await p.waitForTimeout(2500);
  await measure('as shipped');
  await p.evaluate(() => { document.querySelectorAll('.depth-grid,#depth').forEach(e=>e.style.display='none'); });
  await p.waitForTimeout(300); await measure('no depth+grid');
  await p.evaluate(() => { document.querySelectorAll('main > .band:not(:first-of-type)').forEach(e=>e.style.display='none'); });
  await p.waitForTimeout(300); await measure('+ only hero band');
  await p.evaluate(() => { document.querySelectorAll('#veil,#dock,header').forEach(e=>e.style.display='none'); });
  await p.waitForTimeout(300); await measure('+ no header/veil/dock');
  await p.evaluate(() => { document.querySelectorAll('#hero .hero-compass,#hero .hero-grid,.hero-ray').forEach(e=>e.style.display='none'); });
  await p.waitForTimeout(300); await measure('+ no hero decor');
  await p.evaluate(() => { const h=document.getElementById('hero'); if(h) h.style.display='none'; });
  await p.waitForTimeout(300); await measure('+ no hero');
  await p.evaluate(() => { document.querySelectorAll('main').forEach(e=>e.style.display='none'); });
  await p.waitForTimeout(300); await measure('+ nothing in main');
  await b.close();
})();
