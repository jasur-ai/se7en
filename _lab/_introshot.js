const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:[
    '--no-sandbox','--autoplay-policy=no-user-gesture-required',
    '--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream'
  ]});
  const ctx = await b.newContext({viewport:{width:1440,height:1000}, permissions:['camera']});
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  p.on('console',m=>{ if(m.type()==='error') errs.push('console: '+m.text().slice(0,160)); });
  await p.goto('http://localhost:8099/index.html',{waitUntil:'load'});
  const state = () => p.evaluate(() => {
    const r = document.getElementById('intro');
    if (!r) return 'gone';
    return ['lit','zoom','live','black','skipped','done'].filter(c => r.classList.contains(c)).join(',') || 'idle';
  });
  const shot = async (n) => { const st = await state(); await p.screenshot({path:'/tmp/i_'+n+'.png'}); console.log(n, st); };

  await p.waitForTimeout(1200);
  await p.evaluate(() => {
    window.__t = []; const t0 = performance.now();
    const r = document.getElementById('intro');
    new MutationObserver(() => window.__t.push(Math.round(performance.now()-t0) + ' ' + r.className)).observe(r,{attributes:true,attributeFilter:['class']});
  });
  await shot('start');
  await p.waitForFunction(() => document.getElementById('intro')?.classList.contains('lit'), null, {timeout:15000});
  await p.waitForTimeout(500);  await shot('room');

  // swap the fake green test pattern for a synthesised sitter, so the print can be judged
  await p.evaluate(() => {
    const c = document.createElement('canvas'); c.width = 1280; c.height = 960;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0,0,0,960); g.addColorStop(0,'#2a2320'); g.addColorStop(1,'#0a0807');
    x.fillStyle = g; x.fillRect(0,0,1280,960);
    x.fillStyle = 'rgba(255,230,200,.05)'; x.beginPath(); x.arc(640,120,420,0,7); x.fill();
    x.fillStyle = '#3b332e';
    x.beginPath(); x.moveTo(300,960); x.quadraticCurveTo(420,700,560,640); x.lineTo(720,640);
    x.quadraticCurveTo(880,700,980,960); x.closePath(); x.fill();
    x.fillStyle = '#b9a08a'; x.fillRect(600,560,80,120);
    x.beginPath(); x.ellipse(640,430,120,155,0,0,7); x.fill();
    x.fillStyle = '#241a16';
    x.beginPath(); x.ellipse(598,415,15,9,0,0,7); x.fill();
    x.beginPath(); x.ellipse(682,415,15,9,0,0,7); x.fill();
    x.beginPath(); x.ellipse(640,505,34,10,0,0,7); x.fill();
    x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(0,0,1280,960);
    const v = document.getElementById('camFeed');
    v.srcObject = c.captureStream(30);
    v.play().catch(()=>{});
  });

  await p.waitForFunction(() => !!document.querySelector('#print.show'), null, {timeout:70000});
  const pr = await p.$('#print');
  await pr.screenshot({path:'/tmp/i_printonly.png', animations:'disabled', timeout:15000}).catch(()=>console.log('element shot skipped'));
  console.log('print element shot taken');
  await p.screenshot({path:'/tmp/i_print.png'});
  await p.waitForFunction(() => document.getElementById('intro')?.classList.contains('black'), null, {timeout:40000}).catch(()=>{});
  await p.waitForTimeout(600); await shot('black');
  await p.waitForTimeout(2500);
  console.log('timeline:', JSON.stringify(await p.evaluate(()=>window.__t)));
  console.log('errors:', errs.length?errs.join(' | '):'none');
  await b.close();
})();
