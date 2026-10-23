const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const p = await b.newPage({viewport:{width:1440,height:1000}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  p.on('console',m=>{ if(m.type()==='error') errs.push('console: '+m.text().slice(0,140)); });
  await p.addInitScript(()=>{
    window.__osc=0; window.__buf=0;
    const AC = window.AudioContext;
    const co = AC.prototype.createOscillator, cb = AC.prototype.createBufferSource;
    AC.prototype.createOscillator = function(){ window.__osc++; return co.call(this); };
    AC.prototype.createBufferSource = function(){ window.__buf++; return cb.call(this); };
  });
  await p.goto('https://se7en-omega.vercel.app/',{waitUntil:'load',timeout:60000});
  await p.waitForTimeout(900);
  await p.screenshot({path:'/tmp/live_door_closed.png'});
  await p.click('#enterBtn');
  await p.waitForTimeout(900);
  await p.screenshot({path:'/tmp/live_door_mid.png'});
  await p.waitForTimeout(2200);
  await p.screenshot({path:'/tmp/live_door_open.png'});
  console.log(await p.evaluate(()=>JSON.stringify({
    veil: document.getElementById('veil').className,
    osc: window.__osc, noise: window.__buf,
    score: !!(window.SND && SND.playing), track: window.SND && SND.track().title,
    scrollY: Math.round(scrollY)
  })));
  console.log('errors:', errs.length?errs.join(' | '):'none');
  await b.close();
})();
