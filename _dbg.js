const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const p = await b.newPage();
  p.on('pageerror', e => console.log('PAGEERROR:', e.message));
  p.on('console', m => { if (m.type()==='error') console.log('CONSOLE:', m.text()); });
  await p.goto('file:///home/user/index.html');
  await p.waitForTimeout(1500);
  console.log('cards:', await p.evaluate(()=>document.querySelectorAll('.card').length));
  console.log('typeof nameHTML:', await p.evaluate(()=>typeof nameHTML));
  console.log('typeof ORTHO:', await p.evaluate(()=>typeof ORTHO));
  await b.close();
})();
