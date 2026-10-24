const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const ctx = await b.newContext({viewport:{width:1440,height:1000}});
  const p = await ctx.newPage();
  await p.goto('http://localhost:8099/index.html?intro=0',{waitUntil:'load'});
  await p.waitForTimeout(2000);
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Profiler.enable');
  await cdp.send('Profiler.setSamplingInterval', {interval: 400});
  await cdp.send('Profiler.start');
  await p.waitForTimeout(4000);
  const { profile } = await cdp.send('Profiler.stop');
  const self = new Map();
  const byId = new Map(profile.nodes.map(n => [n.id, n]));
  const total = profile.samples.length;
  for (const s of profile.samples) {
    const n = byId.get(s); if (!n) continue;
    const k = (n.callFrame.functionName || '(anon)') + ' @' + (n.callFrame.url.split('/').pop() || 'inline') + ':' + n.callFrame.lineNumber;
    self.set(k, (self.get(k) || 0) + 1);
  }
  [...self.entries()].sort((a,b)=>b[1]-a[1]).slice(0, 18)
    .forEach(([k,v]) => console.log((100*v/total).toFixed(1).padStart(5) + '%  ' + k));
  await b.close();
})();
