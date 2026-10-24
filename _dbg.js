const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const ctx = await b.newContext({viewport:{width:1000,height:800}, permissions:['camera']});
  const p = await ctx.newPage();
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(1200);
  const out = await p.evaluate(() => {
    const c = document.getElementById('camShot'); c.width=840; c.height=630;
    const x = c.getContext('2d');
    x.fillStyle = '#6a5c4d'; x.fillRect(0,0,840,630);
    x.fillStyle = '#d8c3a8'; x.beginPath(); x.ellipse(430,265,80,105,0,0,7); x.fill();
    const im = new Image();
    // re-create the figure to inspect the matte
    return new Promise(res => {
      im.onload = () => {
        const k = document.createElement('canvas'); k.width=840; k.height=630;
        const kx = k.getContext('2d');
        kx.drawImage(im, 100, -30, 640, 700);
        const d = kx.getImageData(0,0,840,630).data;
        let n=0, a=0, maxa=0;
        for (let i=3;i<d.length;i+=4){ if(d[i]>4){a++; if(d[i]>maxa)maxa=d[i];} n++; }
        res({opaque:+(a/n).toFixed(4), maxa, w: im.naturalWidth, h: im.naturalHeight});
      };
      im.src = FIG_SRC;
    });
  });
  console.log(JSON.stringify(out));
  await b.close();
})();
