const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const ctx = await b.newContext({viewport:{width:1000,height:800}, permissions:['camera']});
  const p = await ctx.newPage();
  await p.addInitScript(() => { window.__log = []; });
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(1000);
  const out = await p.evaluate(() => {
    const c = document.getElementById('camShot'); c.width=840; c.height=630;
    const x = c.getContext('2d');
    x.fillStyle = '#6a5c4d'; x.fillRect(0,0,840,630);
    x.fillStyle = '#d8c3a8'; x.beginPath(); x.ellipse(430,265,80,105,0,0,7); x.fill();
    window.INTRO._paint();
    const o = document.getElementById('printCanvas').getContext('2d').getImageData(0,0,840,630).data;
    const at = (x,y) => { const i=(y*840+x)*4; return [o[i],o[i+1],o[i+2]]; };
    return { wallLeft: at(120,300), her: at(180,420), wallMid: at(420,520), face: at(430,265), top: at(420,80) };
  });
  console.log(JSON.stringify(out));
  await b.close();
})();
