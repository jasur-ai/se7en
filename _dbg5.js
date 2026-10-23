const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await b.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:2});
  await p.goto('file:///home/user/index.html');
  await p.waitForTimeout(600);
  await p.click('text=ENTER THE DOSSIER');
  await p.waitForTimeout(900);
  await p.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='UZB');b&&b.click();});
  await p.waitForTimeout(800);
  await p.evaluate(()=>{const el=document.querySelector('#geography');window.scrollTo({top:el.offsetTop-40,behavior:'instant'});});
  await p.waitForTimeout(1200);
  const box = await p.evaluate(()=>{const c=document.querySelectorAll('.geo')[2];const r=c.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:250};});
  await p.screenshot({path:'/tmp/geo.png', clip: box});
  await b.close();
})();
