const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required',
    '--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const ctx = await b.newContext({viewport:{width:1440,height:1000}, permissions:['camera']});
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(800);
  await p.evaluate(() => {
    window.__f = [];
    const t0 = performance.now();
    const iv = setInterval(() => {
      const f = document.getElementById('flash');
      if (!f) return;
      const o = Number(getComputedStyle(f).opacity);
      if (o > 0.02) window.__f.push([Math.round(performance.now()-t0), +o.toFixed(2)]);
      if (window.__f.length > 40) clearInterval(iv);
    }, 120);
  });
  await p.click('#introStart');
  await p.waitForFunction(() => !document.getElementById('intro'), null, {timeout:90000});
  console.log('flash samples:', JSON.stringify(await p.evaluate(() => window.__f.slice(0, 18))));
  await p.waitForTimeout(1500);
  console.log('score:', JSON.stringify(await p.evaluate(() => {
    const pl = window.YT && YT.get && YT.get('ytqPlayer');
    return { dock: getComputedStyle(document.getElementById('dock')).display,
      yt: pl ? {state: pl.getPlayerState(), muted: pl.isMuted(), vol: pl.getVolume()} : null,
      own: !!(window.SND && SND.playing) };
  })));
  console.log('errors:', errs.length?errs.join(' | '):'none');
  await b.close();
})();
