const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const p = await b.newPage({viewport:{width:1440,height:1000}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('https://se7en-omega.vercel.app/katalog',{waitUntil:'load'});
  await p.waitForTimeout(2500);
  // open the player
  await p.click('#rExp');
  await p.waitForTimeout(6000);
  const st = await p.evaluate(()=>({ ready: !!(window.RADIO&&RADIO.ready), failed: !!(window.RADIO&&RADIO.failed),
    iframe: !!document.querySelector('#ytHost iframe'), title: (document.querySelector('#rTitle')||{}).textContent }));
  console.log('radio:', JSON.stringify(st), '| errors', errs.length?errs:'none');
  await p.screenshot({path:'/tmp/live_radio.png'});
  // let it play a moment and check state
  await p.evaluate(()=>window.RADIO && RADIO.play());
  await p.waitForTimeout(4000);
  console.log('playing:', await p.evaluate(()=>window.RADIO && RADIO.playing));
  await b.close();
})();
