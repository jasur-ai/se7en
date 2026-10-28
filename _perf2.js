const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const ctx = await b.newContext({viewport:{width:1440,height:1000}});
  const p = await ctx.newPage();
  const measure = async (label) => {
    const r = await p.evaluate(async () => await new Promise(res => {
      let n = 0; const t0 = performance.now(); let worst = 0, last = t0;
      const tick = () => { const t = performance.now(); const dt = t - last; last = t; if (dt > worst) worst = dt; n++;
        if (t - t0 < 2500) requestAnimationFrame(tick); else res({ fps: +(n / ((t - t0) / 1000)).toFixed(1), worst: +worst.toFixed(0) }); };
      requestAnimationFrame(tick);
    }));
    console.log(label.padEnd(30), JSON.stringify(r));
  };
  await p.goto('http://localhost:8099/index.html?intro=0',{waitUntil:'load'});
  await p.waitForTimeout(2500);
  await measure('baseline');
  // 1: no depth canvas
  await p.evaluate(() => { const d = document.getElementById('depth'); if (d) d.style.display='none'; });
  await p.waitForTimeout(600); await measure('no #depth');
  await p.evaluate(() => { const d = document.getElementById('depth'); if (d) d.style.display=''; });
  // 2: no css filters anywhere
  const tag = await p.addStyleTag({content:'*{filter:none!important;backdrop-filter:none!important}'});
  await p.waitForTimeout(600); await measure('no css filter');
  await p.evaluate(() => document.querySelectorAll('style').forEach(s=>{ if(s.textContent.includes('filter:none!important')) s.remove(); }));
  // 3: no animations
  const t2 = await p.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
  await p.waitForTimeout(600); await measure('no animations');
  await p.evaluate(() => document.querySelectorAll('style').forEach(s=>{ if(s.textContent.includes('animation:none!important')) s.remove(); }));
  // 4: no mix-blend-mode
  const t3 = await p.addStyleTag({content:'*{mix-blend-mode:normal!important}'});
  await p.waitForTimeout(600); await measure('no blend modes');
  // count nodes
  console.log('nodes:', await p.evaluate(() => document.getElementsByTagName('*').length));
  await b.close();
})();
