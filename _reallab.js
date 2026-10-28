const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await (await b.newContext({viewport:{width:1000,height:800}})).newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(900);
  const dataUrl = 'data:image/png;base64,' + fs.readFileSync('/home/user/assets/intro/webcam_room.png').toString('base64');
  await p.evaluate(async (src) => {
    const img = new Image(); img.src = src; await img.decode();
    const cv = document.getElementById('camShot'); cv.width = 840; cv.height = 630;
    const x = cv.getContext('2d');
    const vr = img.width/img.height, cr = 840/630;
    let sw = img.width, sh = img.height, sx = 0, sy = 0;
    if (vr > cr) { sw = img.height*cr; sx = (img.width-sw)/2; } else { sh = img.width/cr; sy = (img.height-sh)/2; }
    x.save(); x.translate(840,0); x.scale(-1,1);
    x.drawImage(img, sx, sy, sw, sh, 0, 0, 840, 630);
    x.restore();
    // wait for the ghost to be decoded before the shutter
    const f = new Image(); f.src = FIG_SRC; await f.decode().catch(()=>{});
    window.INTRO._paint();
    const out = document.getElementById('printCanvas');
    let cv2 = document.getElementById('labCanvas');
    if (!cv2){ cv2 = document.createElement('canvas'); cv2.id='labCanvas';
      cv2.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:940px;height:705px;z-index:99999;box-shadow:0 0 0 12px #e6ded2'; document.body.appendChild(cv2); }
    cv2.width = out.width; cv2.height = out.height;
    cv2.getContext('2d').drawImage(out, 0, 0);
  }, dataUrl);
  await p.waitForTimeout(300);
  await p.screenshot({path:'/tmp/real_print.png'});
  console.log('errors:', errs.join(' | ') || 'none');
  await b.close();
})();
