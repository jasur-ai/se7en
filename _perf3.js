const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
  const measure = async (label, url) => {
    if (url) { await p.goto(url,{waitUntil:'load'}); await p.waitForTimeout(1500); }
    const r = await p.evaluate(async () => await new Promise(res => {
      let n = 0; const t0 = performance.now(); let worst = 0, last = t0;
      const tick = () => { const t = performance.now(); const dt = t - last; last = t; if (dt > worst) worst = dt; n++;
        if (t - t0 < 2000) requestAnimationFrame(tick); else res({ fps: +(n / ((t - t0) / 1000)).toFixed(1), worst: +worst.toFixed(0) }); };
      requestAnimationFrame(tick);
    }));
    console.log(label.padEnd(24), JSON.stringify(r));
  };
  await measure('blank page', 'http://localhost:8099/blank.html');
  await measure('site (no intro)', 'http://localhost:8099/index.html?intro=0');
  // long-task profile: how much JS main thread work per second
  const t = await p.evaluate(async () => {
    let long = 0, total = 0;
    const obs = new PerformanceObserver(list => { for (const e of list.getEntries()) { long++; total += e.duration; } });
    try { obs.observe({entryTypes:['longtask']}); } catch(e){}
    await new Promise(r => setTimeout(r, 3000));
    obs.disconnect();
    return { longTasks: long, totalMs: Math.round(total) };
  });
  console.log('long tasks/3s:', JSON.stringify(t));
  await b.close();
})();
