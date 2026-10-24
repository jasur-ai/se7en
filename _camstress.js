// proves the camera path survives a hostile device list
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required',
    '--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const ctx = await b.newContext({viewport:{width:1200,height:800}, permissions:['camera']});
  const p = await ctx.newPage();
  await p.addInitScript(() => {
    // a phone that claims to be the default camera, and an exact-id switch
    // that the OS refuses — exactly the failure the user hit
    const md = navigator.mediaDevices;
    const realEnum = md.enumerateDevices.bind(md);
    md.enumerateDevices = async () => ([
      { kind: 'videoinput', deviceId: 'phone-1', label: 'DroidCam Source 3 (iPhone 14)', groupId: 'g' },
      { kind: 'videoinput', deviceId: 'builtin-1', label: 'Integrated Camera (04f2:b6dd)', groupId: 'g' }
    ]);
    const realGUM = md.getUserMedia.bind(md);
    md.getUserMedia = async (c) => {
      const id = c && c.video && c.video.deviceId;
      const exact = id && id.exact;
      if (exact === 'builtin-1' || id === 'builtin-1') throw new DOMException('OverconstrainedError', 'OverconstrainedError');
      return realGUM({ video: true, audio: false });
    };
  });
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('http://localhost:8099/index.html?intro=1',{waitUntil:'load'});
  await p.waitForTimeout(1500);
  await p.waitForTimeout(2500);
  console.log(JSON.stringify(await p.evaluate(() => {
    const v = document.getElementById('camFeed');
    return { stream: !!v.srcObject, tracks: v.srcObject ? v.srcObject.getTracks().map(t=>t.readyState) : [],
             width: v.videoWidth, cls: document.getElementById('intro').className };
  })));
  console.log('errors:', errs.length ? errs.slice(0,2).join(' | ') : 'none');
  await b.close();
})();
