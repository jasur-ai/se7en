const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required',
    '--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const ctx = await b.newContext({viewport:{width:1440,height:1000}, permissions:['camera']});
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  p.on('console',m=>{ if(m.type()==='error') errs.push('console: '+m.text().slice(0,140)); });
  await p.goto('https://se7en-omega.vercel.app/?intro=1',{waitUntil:'load', timeout:60000});
  await p.waitForTimeout(2500);
  await p.screenshot({path:'/tmp/L_gate.png'});
  await p.click('#introStart');
  await p.waitForFunction(() => !!document.querySelector('#print.show'), null, {timeout:60000});
  await p.screenshot({path:'/tmp/L_print.png'});
  await p.waitForFunction(() => !document.getElementById('intro'), null, {timeout:40000});
  await p.waitForTimeout(3200);
  await p.screenshot({path:'/tmp/L_open.png'});
  console.log(JSON.stringify(await p.evaluate(() => ({
    veil: document.getElementById('veil')?.className || 'none',
    body: document.body.className.slice(0,40),
    track: document.querySelector('#radio b')?.textContent || null
  }))));
  console.log('errors:', errs.length?errs.slice(0,3).join(' | '):'none');
  await b.close();
})();
