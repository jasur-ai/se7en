const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const p = await b.newPage({viewport:{width:1440,height:1000}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  p.on('console',m=>{ if(m.type()==='error') errs.push('console: '+m.text().slice(0,160)); });
  await p.goto('http://localhost:8099/index.html',{waitUntil:'load'});
  await p.waitForTimeout(900);
  const probe = await p.evaluate(()=>window.SFX.probe(5));
  console.log('offline render', JSON.stringify(probe));
  await p.click('#enterBtn');
  await p.waitForTimeout(600);
  console.log('ctx', await p.evaluate(()=>{const S=window.SFX; return JSON.stringify({has:!!S});}));
  await p.waitForTimeout(2600);
  const st = await p.evaluate(()=>({veil:document.getElementById('veil').className,
    heroTitle:getComputedStyle(document.querySelector('#hero .hero-title span')).opacity,
    track: window.SND && SND.track && SND.track().title}));
  console.log('state', JSON.stringify(st));
  console.log('errors:', errs.length?errs.join(' | '):'none');
  await b.close();
})();
