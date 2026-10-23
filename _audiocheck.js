const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const p = await b.newPage({viewport:{width:1440,height:1000}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.addInitScript(()=>{
    window.__osc = 0; window.__buf = 0;
    const AC = window.AudioContext;
    const co = AC.prototype.createOscillator, cb = AC.prototype.createBufferSource;
    AC.prototype.createOscillator = function(){ window.__osc++; return co.call(this); };
    AC.prototype.createBufferSource = function(){ window.__buf++; return cb.call(this); };
  });
  await p.goto('http://localhost:8099/index.html',{waitUntil:'load'});
  await p.waitForTimeout(900);
  await p.click('#enterBtn');
  await p.waitForTimeout(2800);
  console.log(await p.evaluate(()=>JSON.stringify({
    osc: window.__osc, noiseSources: window.__buf,
    scorePlaying: !!(window.SND && SND.playing), track: window.SND && SND.track().title,
    veil: document.getElementById('veil').className
  })));
  console.log('errors:', errs.length?errs.join(' | '):'none');
  await b.close();
})();
