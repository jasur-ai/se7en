const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await b.newPage({viewport:{width:1440,height:1000}});
  await p.goto('file:///home/user/index.html');
  await p.waitForTimeout(600);
  await p.click('text=ENTER THE DOSSIER');
  await p.waitForTimeout(900);
  await p.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='UZB');b&&b.click();});
  await p.waitForTimeout(800);
  const r = await p.evaluate(()=>{
    const c=document.querySelector('.card');
    const h3=c.querySelector('h3'), dr=c.querySelector('.dread'), sb=c.querySelector('.sub');
    const g=e=>{const b=e.getBoundingClientRect();const s=getComputedStyle(e);return {tag:e.tagName+'.'+e.className, top:+b.top.toFixed(1), h:+b.height.toFixed(1), lh:s.lineHeight, fs:s.fontSize, mt:s.marginTop, mb:s.marginBottom}};
    return [g(h3),g(dr),g(sb)];
  });
  console.log(JSON.stringify(r,null,1));
  await b.close();
})();
