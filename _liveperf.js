const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required',
    '--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const ctx = await b.newContext({viewport:{width:1366,height:900}, permissions:['camera']});
  const p = await ctx.newPage();
  const fps = async (l) => {
    const r = await p.evaluate(async () => await new Promise(res => {
      let n=0; const t0=performance.now();
      const tick=()=>{ n++; const t=performance.now(); if(t-t0<1500) requestAnimationFrame(tick); else res(+(n/((t-t0)/1000)).toFixed(1)); };
      requestAnimationFrame(tick);
    }));
    console.log(l.padEnd(26), r);
  };
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(1500);
  await p.click('#introStart');
  await p.waitForFunction(() => document.getElementById('intro')?.classList.contains('live'), null, {timeout:40000});
  await p.waitForTimeout(1200);
  await fps('live');
  await p.evaluate(() => document.getAnimations().forEach(a=>a.cancel()));
  await p.waitForTimeout(300); await fps('anims off');
  await p.evaluate(() => { document.querySelectorAll('#intro .plate,#intro .bulbglow,#intro .edge').forEach(e=>e.style.display='none'); });
  await p.waitForTimeout(300); await fps('room layers off');
  await p.evaluate(() => { document.querySelectorAll('#intro .finder .scan,#intro .finder .vig,#intro .finder .frame').forEach(e=>e.style.display='none'); });
  await p.waitForTimeout(300); await fps('finder chrome off');
  console.log('view canvas px:', await p.evaluate(() => { const c=document.getElementById('camView'); return [c.width,c.height]; }));
  await b.close();
})();
