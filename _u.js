const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await b.newPage({viewport:{width:1440,height:1000}});
  await p.goto('file:///home/user/katalog.html');
  await p.waitForTimeout(700);
  await p.evaluate(()=>{document.querySelectorAll('.rec[data-cls]:not(.open)').forEach(r=>r.click());});
  await p.waitForTimeout(2500);
  await p.evaluate(()=>{const u=document.querySelector('.unlisted');window.scrollTo(0,u.offsetTop-60)});
  await p.waitForTimeout(700);
  await p.screenshot({path:'/tmp/u1.png'});
  await b.close();
})();
