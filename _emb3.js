const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const p = await b.newPage();
  await p.goto('https://se7en-omega.vercel.app/katalog', {waitUntil:'load'});
  await p.click('#rExp');           // forces the API to load
  await p.waitForFunction(()=>window.YT && window.YT.Player, {timeout:20000});
  const res = await p.evaluate(async () => {
    const IDS = ["8iPoS9zqmoQ","A4eB0B-FGOg","KIjoqpG4B9w","rTSh2gnrbD4","gZD36RI9jTg","JrmgwCGhnm8"];
    const out = {};
    for (let i=0;i<IDS.length;i++){
      const id = IDS[i];
      await new Promise(resolve => {
        const host = document.createElement('div');
        host.id = 'tt'+i; host.style.cssText='position:fixed;left:-9999px;width:320px;height:180px';
        document.body.appendChild(host);
        let done = false;
        const finish = v => { if(done) return; done = true; out[id] = v; setTimeout(resolve, 100); };
        const pl = new YT.Player(host.id, { videoId: id,
          playerVars:{autoplay:1,controls:0,playsinline:1,origin:location.origin},
          events:{
            onReady(){ setTimeout(()=>{ try{pl.playVideo();}catch(e){} }, 400);
                       setTimeout(()=>finish({state: pl.getPlayerState()}), 3200); },
            onError(e){ finish({error:e.data}); }
          }});
        setTimeout(()=>finish({timeout:true}), 9000);
      });
    }
    return out;
  });
  console.log(JSON.stringify(res,null,1));
  await b.close();
})();
