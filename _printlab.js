const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const ctx = await b.newContext({viewport:{width:1000,height:800}});
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(1200);
  await p.evaluate(async () => {
    // build a plausible "sitter" into #camShot and paint the print
    const c = document.getElementById('camShot'); c.width = 840; c.height = 630;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0,0,0,630);
    g.addColorStop(0,'#4a3f38'); g.addColorStop(.6,'#2a231f'); g.addColorStop(1,'#141110');
    x.fillStyle = g; x.fillRect(0,0,840,630);
    x.fillStyle = 'rgba(255,240,214,.06)'; x.beginPath(); x.arc(420,120,300,0,7); x.fill();
    x.fillStyle = '#6b5b4c'; x.beginPath();
    x.moveTo(220,630); x.quadraticCurveTo(300,430,360,400); x.lineTo(560,400);
    x.quadraticCurveTo(620,430,700,630); x.closePath(); x.fill();
    x.fillStyle = '#c6ab92'; x.fillRect(400,330,60,80);
    x.beginPath(); x.ellipse(430,265,80,105,0,0,7); x.fill();
    x.fillStyle = '#2b201a';
    x.beginPath(); x.ellipse(402,255,11,6,0,0,7); x.fill();
    x.beginPath(); x.ellipse(458,255,11,6,0,0,7); x.fill();
    x.beginPath(); x.ellipse(430,315,24,7,0,0,7); x.fill();
    window.INTRO._paint && window.INTRO._paint();
  });
  await p.waitForTimeout(900);
  await p.evaluate(() => {
    const src = document.getElementById('printCanvas');
    const cv = document.createElement('canvas');
    cv.width = src.width; cv.height = src.height;
    cv.getContext('2d').drawImage(src, 0, 0);
    cv.id = 'labCanvas';
    cv.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:900px;height:675px;z-index:99999;box-shadow:0 0 0 14px #ded2bd,0 0 0 15px #000';
    document.body.appendChild(cv);
  });
  await p.screenshot({path:'/tmp/lab_print.png'});
  console.log('errors:', errs.join(' | ') || 'none');
  await b.close();
})();
