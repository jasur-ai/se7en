const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const p = await b.newPage({viewport:{width:1440,height:1000}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('http://localhost:8099/index.html',{waitUntil:'load'});
  await p.waitForTimeout(900);
  await p.screenshot({path:'/tmp/d0_closed.png'});
  await p.click('#enterBtn');
  const t0 = Date.now();
  for (const [at,name] of [[260,'a'],[620,'b'],[1150,'c'],[1500,'d'],[2050,'e'],[2700,'f']]) {
    const wait = at - (Date.now()-t0);
    if (wait > 0) await p.waitForTimeout(wait);
    await p.screenshot({path:`/tmp/d_${name}.png`});
  }
  console.log('errors:', errs.length?errs.join(' | '):'none');
  await b.close();
})();
