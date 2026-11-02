const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const errs = [];
  const ctx = await b.newContext({ viewport: { width: 1440, height: 950 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('PE ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('http://localhost:8099/index.html', { waitUntil: 'load' });
  await p.waitForTimeout(800);
  // full flow: solve a practice puzzle using only clicks in en
  await p.click('.lang [data-lang="en"]');
  await p.waitForTimeout(400);
  const truth = await p.evaluate(() => MUHR.truth.slice());
  for (let seat = 0; seat < 7; seat++) {
    await p.click(`#mTray [data-card="${truth[seat]}"]`);
    await p.click(`#ring .seat[data-seat="${seat}"]`);
  }
  await p.click('#mCheck');
  await p.waitForTimeout(500);
  const enDone = await p.evaluate(() => ({
    done: document.querySelector('#mDone').classList.contains('show'),
    loop: document.querySelector('#mLoop').innerText.replace(/\s+/g, ' ').trim(),
    win: document.querySelector('#mWin').innerText.replace(/\s+/g, ' ').trim(),
    again: document.querySelector('#mNext').textContent
  }));
  console.log('EN done ' + JSON.stringify(enDone));
  await p.screenshot({ path: '/tmp/f_en_done.png' });
  // fresh page, uz, phone: run mode without an account
  const ctx2 = await b.newContext({ ...devices['iPhone 13'] });
  const q = await ctx2.newPage();
  q.on('pageerror', e => errs.push('PE2 ' + e.message));
  q.on('console', m => { if (m.type() === 'error') errs.push('m2 ' + m.text()); });
  await q.goto('http://localhost:8099/index.html', { waitUntil: 'load' });
  await q.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
  await q.waitForTimeout(700);
  await q.click('#modeBar [data-mode="run"]');
  await q.waitForTimeout(400);
  const lock = await q.evaluate(() => ({
    lock: getComputedStyle(document.querySelector('#runLock')).display,
    idle: getComputedStyle(document.querySelector('#runIdle')).display,
    txt: document.querySelector('#runLock').textContent.trim().slice(0, 60)
  }));
  console.log('PHONE run-lock ' + JSON.stringify(lock));
  await q.evaluate(() => { const y = document.querySelector('#modeBar').getBoundingClientRect().top + scrollY - 70; scrollTo(0, y); });
  await q.waitForTimeout(500);
  await q.screenshot({ path: '/tmp/f_phone_lock.png' });
  await q.click('#modeBar [data-mode="solo"]');
  await q.waitForTimeout(400);
  console.log('PHONE back to solo board=' + await q.evaluate(() => getComputedStyle(document.querySelector('#mBoard')).display));
  console.log('ERRORS ' + JSON.stringify(errs));
  await b.close();
})();
