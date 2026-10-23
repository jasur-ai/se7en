const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const errs=[];
  const p = await b.newPage({viewport:{width:1440,height:1000}});
  p.on('pageerror',e=>errs.push(String(e)));
  p.on('console',m=>{ if(m.type()==='error') errs.push('console: '+m.text().slice(0,160)); });
  await p.goto('https://se7en-omega.vercel.app/', {waitUntil:'load', timeout:60000});
  await p.waitForTimeout(900);
  await p.screenshot({path:'/tmp/live_veil.png'});
  await p.click('#enterBtn');
  await p.waitForTimeout(3200);
  const probe = ()=>p.evaluate(()=>{
    const S = window.SND || {};
    const a = S._active;
    return { title: S.track? S.track().title : '?', playing: !!S.playing,
      t: a? +a.currentTime.toFixed(1) : null, vol: a? +a.volume.toFixed(2) : null,
      paused: a? a.paused : null, err: a? a.error && a.error.code : null };
  });
  console.log('enter', JSON.stringify(await probe()));
  await p.screenshot({path:'/tmp/live_hero.png'});
  await p.click('#nextBtn');
  await p.waitForTimeout(2600);
  console.log('next ', JSON.stringify(await probe()));
  await p.evaluate(()=>document.getElementById('bestiary').scrollIntoView({block:'start'}));
  await p.waitForTimeout(1600);
  await p.screenshot({path:'/tmp/live_bes.png'});
  console.log('errors:', errs.length?errs.join(' | '):'none');
  await b.close();
})();
