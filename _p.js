const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await b.newPage({viewport:{width:1440,height:1000}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file:///home/user/katalog.html');
  await p.waitForTimeout(900);
  await p.screenshot({path:'/tmp/p1.png'});
  await p.evaluate(()=>window.scrollTo(0, document.querySelector('#cls1').offsetTop-40));
  await p.waitForTimeout(700);
  await p.screenshot({path:'/tmp/p2.png'});
  await p.hover('.rec');
  await p.waitForTimeout(900);
  await p.screenshot({path:'/tmp/p3.png'});
  console.log('errors:', errs.length?errs:'none');
  await b.close();
})();
