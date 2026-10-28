const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await (await b.newContext({viewport:{width:1000,height:800}})).newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(900);
  const cases = {
    dark:  {bg:'#241f1b', skin:'#b49b82', cloth:'#3a332e'},
    mid:   {bg:'#6a5c4d', skin:'#d8c3a8', cloth:'#6b5b4c'},
    bright:{bg:'#cfc6b8', skin:'#f0e0cc', cloth:'#b9aa98'}
  };
  for (const [name, c] of Object.entries(cases)) {
    const stats = await p.evaluate(async (c) => {
      const cv = document.getElementById('camShot'); cv.width=840; cv.height=630;
      const x = cv.getContext('2d');
      const g = x.createLinearGradient(0,0,0,630);
      g.addColorStop(0, c.bg); g.addColorStop(1, '#141110');
      x.fillStyle = g; x.fillRect(0,0,840,630);
      x.fillStyle = c.cloth;
      x.beginPath(); x.moveTo(220,630); x.quadraticCurveTo(300,430,360,400); x.lineTo(560,400);
      x.quadraticCurveTo(620,430,700,630); x.closePath(); x.fill();
      x.fillStyle = c.skin; x.fillRect(400,330,60,80);
      x.beginPath(); x.ellipse(430,265,80,105,0,0,7); x.fill();
      x.fillStyle = '#2b201a';
      x.beginPath(); x.ellipse(402,255,11,6,0,0,7); x.fill();
      x.beginPath(); x.ellipse(458,255,11,6,0,0,7); x.fill();
      window.INTRO._paint();
      const o = document.getElementById('printCanvas').getContext('2d').getImageData(0,0,840,630).data;
      const L = (xx,yy) => { const i=(yy*840+xx)*4; return (o[i]*0.2126+o[i+1]*0.7152+o[i+2]*0.0722); };
      // her torso column and a wall column beside it
      let her=0,wl=0,n=0;
      for (let yy=180; yy<560; yy+=6){ her += L(150,yy); wl += L(60,yy); n++; }
      return { her: Math.round(her/n), wall: Math.round(wl/n), delta: Math.round((her-wl)/n) };
    }, c);
    await p.evaluate(() => {
      const src = document.getElementById('printCanvas');
      let cv = document.getElementById('labCanvas');
      if (!cv){ cv = document.createElement('canvas'); cv.id='labCanvas';
        cv.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:900px;height:675px;z-index:99999;box-shadow:0 0 0 14px #ded2bd';
        document.body.appendChild(cv); }
      cv.width = src.width; cv.height = src.height;
      cv.getContext('2d').drawImage(src,0,0);
    });
    await p.screenshot({path:`/tmp/ghost_${name}.png`});
    console.log(name, JSON.stringify(stats));
  }
  console.log('errors:', errs.join(' | ') || 'none');
  await b.close();
})();
