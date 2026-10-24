const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
  const measure = async (label) => {
    const r = await p.evaluate(async () => await new Promise(res => {
      let n = 0; const t0 = performance.now(); let worst = 0, last = t0;
      const tick = () => { const t = performance.now(); const dt = t - last; last = t; if (dt > worst) worst = dt; n++;
        if (t - t0 < 2200) requestAnimationFrame(tick); else res({ fps: +(n/((t-t0)/1000)).toFixed(1), worst:+worst.toFixed(0) }); };
      requestAnimationFrame(tick);
    }));
    console.log(label.padEnd(26), JSON.stringify(r));
  };
  await p.goto('http://localhost:8099/index.html?intro=0',{waitUntil:'load'});
  await p.waitForTimeout(2500);
  await measure('as shipped');
  await p.evaluate(() => { const d=document.getElementById('depth'); d.style.display='none'; });
  await p.waitForTimeout(500); await measure('no #depth');
  await p.evaluate(() => { const d=document.getElementById('depth'); d.style.display=''; });
  await p.addStyleTag({content:'*{backdrop-filter:none!important}'});
  await p.waitForTimeout(400); await measure('no backdrop');
  await p.addStyleTag({content:'.card,.geo,.tl-item,.sheet{box-shadow:none!important}'});
  await p.waitForTimeout(400); await measure('no card shadows');
  await p.addStyleTag({content:'*{filter:none!important}'});
  await p.waitForTimeout(400); await measure('no filters');
  await p.addStyleTag({content:'*{animation:none!important;transition:none!important}'});
  await p.waitForTimeout(400); await measure('no anim/transition');
  await p.addStyleTag({content:'#dust,.dust,.motes,.fog,#fog{display:none!important}'});
  await p.waitForTimeout(400); await measure('+ no dust layers');
  console.log('elements', await p.evaluate(() => document.getElementsByTagName('*').length));
  await b.close();
})();
