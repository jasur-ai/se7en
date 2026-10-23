const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const p = await b.newPage({viewport:{width:1440,height:1000}});
  await p.goto('http://localhost:8099/index.html',{waitUntil:'load'});
  await p.waitForTimeout(900);
  await p.evaluate(()=>{
    const v=document.getElementById('veil');
    v.classList.add('opening');
    document.body.classList.add('awake');
    document.getElementById('hero').classList.add('arrive');
    const st=document.createElement('style');
    st.textContent='#veil .door,#veil .seam i{animation-play-state:paused !important}';
    document.head.appendChild(st);
    window.__v=v;
  });
  for (const t of [0.25,0.6,1.0,1.25,1.6,2.0,2.3]) {
    await p.evaluate((t)=>{
      document.querySelectorAll('#veil .door,#veil .seam i').forEach(el=>{ el.style.animationDelay = (-t)+'s'; });
      window.__v.classList.remove('gone');
    }, t);
    await p.waitForTimeout(250);
    await p.screenshot({path:`/tmp/pose_${String(t).replace('.','_')}.png`});
  }
  await b.close();
})();
