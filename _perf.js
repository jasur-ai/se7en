const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required',
    '--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const ctx = await b.newContext({viewport:{width:1440,height:1000}, permissions:['camera']});
  const p = await ctx.newPage();
  const measure = async (label, ms) => {
    const r = await p.evaluate(async (ms) => {
      return await new Promise(res => {
        let n = 0; const t0 = performance.now(); let worst = 0, last = t0;
        const tick = () => {
          const t = performance.now(); const dt = t - last; last = t;
          if (dt > worst) worst = dt;
          n++;
          if (t - t0 < ms) requestAnimationFrame(tick);
          else res({ fps: +(n / ((t - t0) / 1000)).toFixed(1), worstFrame: +worst.toFixed(1) });
        };
        requestAnimationFrame(tick);
      });
    }, ms);
    console.log(label, JSON.stringify(r));
  };
  const t0 = Date.now();
  await p.goto('http://localhost:8099/index.html?intro=0',{waitUntil:'load'});
  console.log('load ms', Date.now() - t0);
  await p.waitForTimeout(2500);
  await measure('dossier idle ', 3000);
  await p.evaluate(() => window.scrollTo(0, 4000));
  await p.waitForTimeout(1200);
  await measure('dossier scrolled', 3000);
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(1000);
  await p.click('#introStart');
  await p.waitForTimeout(6000);
  await measure('intro live   ', 3000);
  await p.waitForFunction(() => document.getElementById('intro')?.classList.contains('burn'), null, {timeout:60000});
  await p.waitForTimeout(1500);
  await measure('intro burning', 3000);
  console.log('canvas nodes:', await p.evaluate(() => document.querySelectorAll('canvas').length));
  await b.close();
})();
