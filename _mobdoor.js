const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const p = await b.newPage({viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('http://localhost:8099/index.html',{waitUntil:'load'});
  await p.waitForTimeout(900);
  await p.screenshot({path:'/tmp/mdoor_closed.png'});
  await p.click('#enterBtn');
  await p.waitForTimeout(1200);
  await p.screenshot({path:'/tmp/mdoor_mid.png'});
  await p.waitForTimeout(2000);
  await p.screenshot({path:'/tmp/mdoor_open.png'});
  // skip path
  await p.goto('http://localhost:8099/index.html',{waitUntil:'load'});
  await p.waitForTimeout(700);
  await p.click('#enterBtn');
  await p.waitForTimeout(700);
  await p.mouse.click(200, 700);
  await p.waitForTimeout(500);
  console.log(await p.evaluate(()=>JSON.stringify({veil:document.getElementById('veil').className, body:document.body.className})));
  await p.screenshot({path:'/tmp/mdoor_skip.png'});
  console.log('errors:', errs.length?errs.join(' | '):'none');
  await b.close();
})();
