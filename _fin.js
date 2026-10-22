const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const p = await b.newPage({viewport:{width:1440,height:1000}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('https://se7en-omega.vercel.app/katalog',{waitUntil:'load'});
  await p.waitForTimeout(1200);
  await p.click('#rExp');
  await p.waitForTimeout(2500);
  await p.evaluate(()=>window.RADIO.play());
  await p.waitForTimeout(3500);
  const st = await p.evaluate(()=>({track: document.querySelector('#rTitle').textContent,
    sub: document.querySelector('#rSub').textContent, playing: RADIO.playing, ready: RADIO.ready}));
  console.log(JSON.stringify(st));
  await p.screenshot({path:'/tmp/f1.png', clip:{x:0,y:640,width:560,height:360}});
  await p.evaluate(()=>window.scrollTo(0, document.querySelector('#cls2').offsetTop-40));
  await p.waitForTimeout(900);
  await p.screenshot({path:'/tmp/f2.png'});
  await p.goto('https://se7en-omega.vercel.app/',{waitUntil:'load'});
  await p.waitForTimeout(800);
  await p.click('text=ENTER THE DOSSIER');
  await p.waitForTimeout(1800);
  await p.evaluate(()=>document.querySelector('#sources').scrollIntoView());
  await p.waitForTimeout(900);
  await p.screenshot({path:'/tmp/f3.png'});
  console.log('errors:', errs.length?errs:'none');
  await b.close();
})();
