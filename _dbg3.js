const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await (await b.newContext({viewport:{width:1000,height:800}})).newPage();
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(800);
  console.log(await p.evaluate(async () => {
    const im = new Image(); im.src = FIG_SRC;
    await im.decode();
    const h = 630*0.94, w = h * (im.naturalWidth/im.naturalHeight);
    return JSON.stringify({nw: im.naturalWidth, nh: im.naturalHeight, h, w, ph:630, pw:840});
  }));
  await b.close();
})();
