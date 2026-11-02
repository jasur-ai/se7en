const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  p.on('pageerror', e => console.log('PE', e.message.slice(0,120)));
  p.on('console', m => { if (m.type()==='error') console.log('CE', m.text().slice(0,120)); });
  await p.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'load' });
  await p.waitForTimeout(600);
  console.log(JSON.stringify(await p.evaluate(() => ({
    put: !!document.querySelector('#pzPut'),
    putT: document.querySelector('#pzPut .t') ? document.querySelector('#pzPut .t').textContent : null,
    deck: document.querySelectorAll('#pzDeck .card').length,
    slots: document.querySelectorAll('#pzSlots .slot').length,
    note: !!document.querySelector('#jadval .note p'),
    noteTxt: document.querySelector('#jadval .note p') ? document.querySelector('#jadval .note p').textContent.slice(0,40) : null
  })), null, 1));
  await b.close();
})();
