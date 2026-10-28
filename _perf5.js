const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
  await p.goto('http://localhost:8099/index.html?intro=0',{waitUntil:'load'});
  await p.waitForTimeout(2500);
  const anims = await p.evaluate(() => document.getAnimations().map(a => {
    const t = a.effect && a.effect.target;
    return { name: a.animationName || a.transitionProperty || '?',
      cls: t ? (t.className || t.tagName || '').toString().slice(0,40) : '?',
      state: a.playState };
  }));
  const counts = {};
  anims.forEach(a => { const k = a.name + ' · ' + a.cls; counts[k] = (counts[k]||0)+1; });
  console.log('running animations:', anims.length);
  Object.entries(counts).slice(0,30).forEach(([k,v]) => console.log('  ', v, k));
  await b.close();
})();
