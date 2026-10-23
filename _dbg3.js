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
  const card = await p.$('.card');
  await card.screenshot({path:'/tmp/card.png'});
  console.log(await p.evaluate(()=>{
    const c=document.querySelector('.card');
    return c.querySelector('.dread').outerHTML.slice(0,300)+'\n---\n'+c.querySelector('.sub').outerHTML;
  }));
  await b.close();
})();
