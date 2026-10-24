const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required',
    '--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const ctx = await b.newContext({viewport:{width:1366,height:900}, permissions:['camera']});
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  const t0 = Date.now();
  await p.goto('https://se7en-omega.vercel.app/?intro=1',{waitUntil:'load',timeout:60000});
  console.log('load ms', Date.now()-t0);
  await p.waitForTimeout(2000);
  const fps = async (label, ms=2000) => {
    const r = await p.evaluate(async (ms) => await new Promise(res => {
      let n=0; const t0=performance.now();
      const tick=()=>{ n++; const t=performance.now(); if(t-t0<ms) requestAnimationFrame(tick); else res(+(n/((t-t0)/1000)).toFixed(1)); };
      requestAnimationFrame(tick);
    }), ms);
    console.log(label, r, 'fps');
  };
  await fps('gate');
  await p.click('#introStart');
  await p.waitForTimeout(6000);
  await fps('intro live');
  await p.waitForFunction(() => !!document.querySelector('#print.show'), null, {timeout:90000});
  await p.waitForTimeout(2000);
  await fps('print + fire');
  await p.screenshot({path:'/tmp/L3_print.png'});
  console.log('errors:', errs.length?errs.slice(0,2).join(' | '):'none');
  await b.close();
})();
