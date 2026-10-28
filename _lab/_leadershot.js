const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const p = await (await b.newContext({viewport:{width:1440,height:900}, permissions:['camera']})).newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForFunction(() => document.querySelector('#count.beat'), null, {timeout:60000});
  await p.waitForTimeout(260);
  await p.screenshot({path:'/tmp/leader1.png'});
  console.log('num', await p.evaluate(()=>document.querySelector('#count b').textContent),
              'opacity', await p.evaluate(()=>getComputedStyle(document.querySelector('#count')).opacity));
  console.log('errors:', errs.join(' | ') || 'none');
  await b.close();
})();
