const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const p = await b.newPage();
  await p.goto('file:///tmp/embtest.html');
  await p.waitForFunction(()=>window.RESULT, {timeout:40000});
  console.log(JSON.stringify(await p.evaluate(()=>window.RESULT),null,1));
  await b.close();
})();
