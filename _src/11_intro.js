/* ═══════════════════════════════════════════════════════════════
   INTRO · the room with the camera.
   Runs once per page load: consent → real getUserMedia prompt →
   the camera takes your picture → the figure that was not there →
   the printer → the print → the doors.

   Nothing leaves the browser. The frame is drawn to a canvas,
   graded, and handed to the print. No upload, no storage.
   ═══════════════════════════════════════════════════════════════ */
const INTRO = (() => {
  const root = document.getElementById("intro");
  if (!root) return { pending: () => false, willRun: () => false, mount(){} };

  const $ = (s) => root.querySelector(s);
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  const KEY = "se7en.intro.v1";
  let alive = true, stream = null, video = null, grabbed = false;

  function remember(){ try { sessionStorage.setItem(KEY, "1"); } catch(e){} }
  // first entry only. any later load — including a refresh — goes straight in.
  // ?intro forces it again; ?intro=0 skips it.
  function forced(){ return /[?&]intro(?:=1|=true)?(?:&|$)/.test(location.search); }
  function refused(){ return /[?&]intro=0(?:&|$)/.test(location.search); }
  function seen(){
    if (forced()) return false;
    if (refused()) return true;
    try { return sessionStorage.getItem(KEY) === "1"; } catch(e){ return false; }
  }

  /* ── audio helpers (the SFX module owns the graph) ──────────── */
  const noSFX = () => !window.SFX;
  function tick(n){
    if (noSFX()) return;
    try { SFX.beep(n); } catch(e){}
  }
  function sfx(name, ...args){
    if (noSFX() || typeof SFX[name] !== "function") return;
    try { SFX[name](...args); } catch(e){}
  }

  /* ── the print: your flash frame, and what stood behind you ─── */
  const PW = 840, PH = 630;

  function paintPrint(){
    const src = $("#camShot"), out = $("#printCanvas");
    out.width = PW; out.height = PH;
    const c = out.getContext("2d");
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalCompositeOperation = "source-over";
    c.globalAlpha = 1;
    c.clearRect(0, 0, PW, PH);

    // YOUR frame — the one the flash just took, kept whole
    c.fillStyle = "#0c0a09"; c.fillRect(0, 0, PW, PH);
    const hasShot = !!(src && src.width && src.height);
    if (hasShot) {
      const vr = src.width / src.height, cr = PW / PH;
      let sw = src.width, sh = src.height, sx = 0, sy = 0;
      if (vr > cr) { sw = src.height * cr; sx = (src.width - sw) / 2; }
      else { sh = src.width / cr; sy = (src.height - sh) / 2; }
      c.save();
      c.filter = "brightness(1.10) contrast(1.02) saturate(.86)";
      c.drawImage(src, sx, sy, sw, sh, 0, 0, PW, PH);
      c.restore();
    } else {
      // no camera: the photograph is of the room, taken by the camera in it
      const wl = c.createLinearGradient(0, 0, 0, PH);
      wl.addColorStop(0, "#6a5545"); wl.addColorStop(.5, "#463529"); wl.addColorStop(1, "#191310");
      c.fillStyle = wl; c.fillRect(0, 0, PW, PH);
      c.fillStyle = "#080606"; c.fillRect(PW * .06, PH * .16, PW * .24, PH * .70);
      c.save();
      const pool = c.createRadialGradient(PW * .5, PH * 1.02, 10, PW * .5, PH, PH * .85);
      pool.addColorStop(0, "rgba(255,226,190,.26)"); pool.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = pool; c.fillRect(0, PH * .55, PW, PH * .45);
      c.font = "700 " + Math.round(PH * .10) + "px Georgia, serif";
      c.fillStyle = "rgba(196,22,12,.9)"; c.textAlign = "center";
      c.fillText("S M I L E", PW * .58, PH * .40);
      c.restore();
    }

    // the flash: hot in the middle, falling away at the corners — but never black
    const fl = c.createRadialGradient(PW * .5, PH * .40, PH * .02, PW * .5, PH * .5, PH * .95);
    fl.addColorStop(0, "rgba(255,250,236,.30)");
    fl.addColorStop(.28, "rgba(255,238,214,.10)");
    fl.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = fl; c.fillRect(0, 0, PW, PH);

    // IT — standing behind your shoulder, and always has been
    drawFigure(c, PW * 0.255, PH * 1.20, PH * 1.46, 2.4);
    // a second one at the right edge of the frame, too close to the lens
    drawHead(c, PW * 0.885, PH * 0.27, PH * 0.30);

    // blood
    bloodDrips(c, PW, PH);

    // the corner falloff — light, so your own frame survives it
    const vg = c.createRadialGradient(PW * .5, PH * .46, PH * .34, PW * .5, PH * .5, PH * 1.08);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(.62, "rgba(0,0,0,.14)");
    vg.addColorStop(1, "rgba(0,0,0,.62)");
    c.fillStyle = vg; c.fillRect(0, 0, PW, PH);

    // the edges have started to burn
    burntEdge(c, PW, PH);

    // paper, chemistry, dust
    grain(c, PW, PH, 20);
    scratches(c, PW, PH);
  }

  /* the print is scorching from the outside in */
  function burntEdge(c, w, h){
    c.save();
    const g = c.createRadialGradient(w * .5, h * .5, Math.min(w, h) * .30, w * .5, h * .5, Math.max(w, h) * .72);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(.66, "rgba(40,14,4,.30)");
    g.addColorStop(.86, "rgba(96,26,6,.62)");
    g.addColorStop(1, "rgba(12,4,2,.94)");
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    // live coals along the rim
    c.globalCompositeOperation = "screen";
    for (let i = 0; i < 90; i++){
      const side = Math.floor(Math.random() * 4);
      const t = Math.random();
      let x = side === 0 ? t * w : side === 1 ? w - Math.random() * 12 : side === 2 ? t * w : Math.random() * 12;
      let y = side === 0 ? Math.random() * 12 : side === 1 ? t * h : side === 2 ? h - Math.random() * 12 : t * h;
      const r = 1 + Math.random() * 3.2;
      const gg = c.createRadialGradient(x, y, 0, x, y, r * 3);
      gg.addColorStop(0, "rgba(255,196,96,.95)");
      gg.addColorStop(.45, "rgba(255,110,30,.55)");
      gg.addColorStop(1, "rgba(255,60,0,0)");
      c.fillStyle = gg;
      c.beginPath(); c.arc(x, y, r * 3, 0, Math.PI * 2); c.fill();
    }
    c.restore();
  }

  /* a figure: too tall, too thin, lit by the flash from the front */
  function drawFigure(c, cx, footY, bodyH, blur){
    const headH = bodyH * 0.070, shoulderW = bodyH * 0.150;
    const headY = footY - bodyH + headH;
    const hipY = footY - bodyH * 0.42;
    c.save();
    c.filter = "blur(" + blur + "px)";
    const g = c.createLinearGradient(0, headY - headH, 0, footY);
    g.addColorStop(0, "rgba(206,194,176,.97)");
    g.addColorStop(.18, "rgba(178,164,146,.95)");
    g.addColorStop(.55, "rgba(120,104,88,.92)");
    g.addColorStop(1, "rgba(44,34,28,.8)");
    c.fillStyle = g;

    c.beginPath();
    c.ellipse(cx, headY, headH * 0.76, headH * 1.06, -0.09, 0, Math.PI * 2);
    c.fill();
    c.fillRect(cx - headH * .27, headY + headH * .66, headH * .54, bodyH * .11);
    c.beginPath();
    c.moveTo(cx - shoulderW * .40, headY + headH * 1.24);
    c.quadraticCurveTo(cx - shoulderW * 1.06, headY + bodyH * .15, cx - shoulderW * .60, hipY);
    c.lineTo(cx + shoulderW * .60, hipY);
    c.quadraticCurveTo(cx + shoulderW * 1.06, headY + bodyH * .15, cx + shoulderW * .40, headY + headH * 1.24);
    c.closePath(); c.fill();
    c.lineWidth = bodyH * .028; c.strokeStyle = g; c.lineCap = "round";
    c.beginPath();
    c.moveTo(cx - shoulderW * .80, headY + bodyH * .14);
    c.quadraticCurveTo(cx - shoulderW * 1.16, hipY + bodyH * .13, cx - shoulderW * .72, footY - bodyH * .08);
    c.moveTo(cx + shoulderW * .80, headY + bodyH * .14);
    c.quadraticCurveTo(cx + shoulderW * 1.16, hipY + bodyH * .13, cx + shoulderW * .72, footY - bodyH * .08);
    c.stroke();
    // no face — only a sheen where a face should be
    const sh = c.createRadialGradient(cx - headH * .2, headY - headH * .26, 1, cx, headY, headH * 1.1);
    sh.addColorStop(0, "rgba(246,238,222,.55)");
    sh.addColorStop(.48, "rgba(186,172,154,.18)");
    sh.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = sh;
    c.beginPath(); c.ellipse(cx, headY, headH * .70, headH * 1.0, -0.09, 0, Math.PI * 2); c.fill();
    c.restore();
  }

  /* only a head — coming in from outside the frame */
  function drawHead(c, cx, cy, r){
    c.save();
    c.filter = "blur(10px)";
    const g = c.createRadialGradient(cx - r * .25, cy - r * .28, r * .08, cx, cy, r * 1.2);
    g.addColorStop(0, "rgba(214,202,184,.8)");
    g.addColorStop(.42, "rgba(146,132,116,.6)");
    g.addColorStop(.78, "rgba(60,50,42,.30)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g;
    c.beginPath();
    c.ellipse(cx, cy, r * .74, r, 0.19, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  function bloodDrips(c, w, h){
    c.save();
    const xs = [0.315, 0.665, 0.805];
    for (let i = 0; i < xs.length; i++){
      const x = xs[i] * w, len = h * (0.16 + 0.20 * ((i * 37) % 5) / 5);
      const lg = c.createLinearGradient(0, 0, 0, len);
      lg.addColorStop(0, "rgba(126,8,5,.95)");
      lg.addColorStop(.55, "rgba(94,6,4,.85)");
      lg.addColorStop(1, "rgba(60,4,3,0)");
      c.fillStyle = lg;
      const wd = 6 + (i % 3) * 1.5;
      c.beginPath();
      c.moveTo(x - wd / 2, 0);
      c.bezierCurveTo(x - wd / 2, len * .5, x - wd * 1.5, len * .74, x - wd * .35, len);
      c.bezierCurveTo(x + wd * 1.5, len * .76, x + wd / 2, len * .55, x + wd / 2, 0);
      c.closePath(); c.fill();
      c.beginPath(); c.ellipse(x - wd * .25, len, wd * .8, wd * .55, 0, 0, Math.PI * 2);
      c.fillStyle = "rgba(118,9,6,.9)"; c.fill();
    }
    c.fillStyle = "rgba(104,7,5,.86)";
    c.beginPath(); c.ellipse(w * .925, h * .74, 32, 44, -.32, 0, Math.PI * 2); c.fill();
    for (let f = 0; f < 4; f++){
      c.beginPath();
      c.ellipse(w * .925 - 28 + f * 15, h * .70 - 42 + Math.abs(f - 1.5) * 7, 6.5, 21, -.28 + f * .14, 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = .5;
    c.beginPath();
    c.moveTo(w * .94, h * .76);
    c.quadraticCurveTo(w * 1.01, h * .86, w * .90, h * .96);
    c.lineTo(w, h); c.lineTo(w, h * .72);
    c.closePath(); c.fill();
    c.restore();
  }

  function grain(c, w, h, amount){
    const img = c.getImageData(0, 0, w, h), d = img.data;
    for (let i = 0; i < d.length; i += 4){
      const n = (Math.random() - 0.5) * amount;
      d[i] += n; d[i + 1] += n; d[i + 2] += n;
    }
    c.putImageData(img, 0, 0);
  }

  function scratches(c, w, h){
    c.save();
    c.globalCompositeOperation = "screen";
    for (let i = 0; i < 5; i++){
      const x = Math.random() * w;
      c.strokeStyle = "rgba(255,246,230," + (0.05 + Math.random() * 0.10).toFixed(3) + ")";
      c.lineWidth = Math.random() < .5 ? 1 : 1.6;
      c.beginPath();
      c.moveTo(x, 0);
      c.bezierCurveTo(x + 6, h * .35, x - 5, h * .7, x + 3, h);
      c.stroke();
    }
    for (let i = 0; i < 130; i++){
      c.fillStyle = "rgba(240,232,214," + (Math.random() * .34).toFixed(3) + ")";
      c.fillRect(Math.random() * w, Math.random() * h, 1.4, 1.4);
    }
    c.restore();
  }

  /* ── camera ─────────────────────────────────────────────────── */
  async function openCamera(){
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 960 }, facingMode: "user" },
        audio: false
      });
      video = $("#camFeed");
      video.srcObject = stream;
      await video.play().catch(()=>{});
      return true;
    } catch (e) { return false; }
  }
  function capture(){
    const v = $("#camFeed"), c = $("#camShot");
    const w = 840, h = 630;
    c.width = w; c.height = h;
    const x = c.getContext("2d");
    x.fillStyle = "#0a0807"; x.fillRect(0, 0, w, h);
    if (v && v.videoWidth) {
      const vr = v.videoWidth / v.videoHeight, cr = w / h;
      let sw = v.videoWidth, sh = v.videoHeight, sx = 0, sy = 0;
      if (vr > cr) { sw = v.videoHeight * cr; sx = (v.videoWidth - sw) / 2; }
      else { sh = v.videoWidth / cr; sy = (v.videoHeight - sh) / 2; }
      x.save(); x.translate(w, 0); x.scale(-1, 1);           // mirror, like a mirror
      x.drawImage(v, sx, sy, sw, sh, 0, 0, w, h);
      x.restore();
    }
  }

  /* ── scene beats ────────────────────────────────────────────── */
  async function run(){
    root.classList.add("lit");
    sfx("powerUp");
    sfx("drone", 7.5);
    await wait(4200);             // the room comes up out of the dark, unhurried

    sfx("paper");                 // somewhere at the back, something shifts
    await wait(1400);
    root.classList.add("zoom");   // the lens leans in
    await wait(4600);
    root.classList.add("live");   // and now it is looking at you
    await wait(3000);

    if (alive && !root.classList.contains("skipped")) {
      for (const n of [3, 2, 1]) {
        if (!alive) return;
        const el = $("#count");
        el.querySelector("b").textContent = String(n);
        el.classList.remove("beat");
        void el.offsetWidth;
        el.classList.add("beat");
        tick(n);
        await wait(1750);
      }
      await wait(900);

      // the flash: the room disappears, your eyes do not
      const feed = $("#camFeed");
      for (let i = 0; i < 40 && feed && !(feed.videoWidth > 0); i++) await wait(50);
      $("#flash").classList.add("fire");
      sfx("shutter");
      sfx("ring", 6.5);
      capture();
      paintPrint();
      root.classList.add("burned");
      await wait(2900);
      $("#flash").classList.remove("fire");
      root.classList.remove("live", "zoom");
      await wait(2000);           // the after-image drains away
      root.classList.remove("burned");

      // what is left of the room, and the printer in the corner
      root.classList.add("burn");
      await wait(600);
      const printer = $("#printer");
      printer.classList.add("on");
      sfx("fire", 8);
      await wait(900);
      sfx("printer", 5.2);
      printer.classList.add("out");     // the sheet starts feeding
      await wait(2600);

      // and the sheet is in your hand — it comes to the middle of the room
      const print = $("#print"), sheet = $("#printer .sheet");
      const r = sheet.getBoundingClientRect();
      const dx = (r.left + r.width / 2) - innerWidth / 2;
      const dy = (r.top + r.height / 2) - innerHeight / 2;
      print.style.transform = "";
      print.classList.add("show");
      try {
        print.animate([
          { transform: "translate(calc(-50% + " + dx + "px), calc(-50% + " + dy + "px)) rotate(11deg) scale(.05)", opacity: 0 },
          { opacity: 1, offset: .08 },
          { transform: "translate(-50%,-50%) rotate(-1.3deg) scale(1)", opacity: 1 }
        ], { duration: 2800, easing: "cubic-bezier(.33,.02,.28,1)", fill: "none" });
      } catch(e){}
      await wait(2600);
      $("#hint").classList.add("show");
      await wait(8200);           // long enough to look at what is behind you

      // darkness, then the doors
      root.classList.remove("burn");
      root.classList.add("black");
      sfx("drone", 4.2);
      await wait(2600);
      finish();
    }
  }

  /* the print can be picked up with the hand */
  function markGrab(){
    const p = $("#print");
    let dx = 0, dy = 0, dragging = false;
    const down = (e) => {
      dragging = true; grabbed = true;
      p.classList.add("grab"); p.setPointerCapture?.(e.pointerId);
      const r = p.getBoundingClientRect();
      dx = e.clientX - (r.left + r.width / 2);
      dy = e.clientY - (r.top + r.height / 2);
      sfx("paper");
    };
    const move = (e) => {
      if (!dragging) return;
      p.style.marginLeft = (e.clientX - dx - p.getBoundingClientRect().left) + "px";
      p.style.marginTop = (e.clientY - dy - p.getBoundingClientRect().top) + "px";
      p.style.transform = "translate(-50%,-50%) rotate(" + ((e.clientX - innerWidth/2) * 0.012) + "deg) scale(1.06)";
    };
    const up = () => { dragging = false; p.classList.remove("grab"); };
    p.addEventListener("pointerdown", down);
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerup", up, { passive: true });
  }

  function finish(){
    alive = false;
    remember();
    root.classList.add("done");
    if (stream) stream.getTracks().forEach(t => t.stop());
    // hand over to the dossier: the title ignites and the doors open
    try { window.dispatchEvent(new CustomEvent("dossier:open", { detail: { fromIntro: true } })); } catch(e){}
    setTimeout(()=>{ root.remove(); }, 1200);
  }

  function skip(){
    root.classList.add("skipped", "black");
    setTimeout(finish, 420);
  }

  /* ── consent gate ───────────────────────────────────────────── */
  function bindGate(){
    const gate = $("#gate");
    $("#introStart").addEventListener("click", async () => {
      const btn = $("#introStart");
      btn.disabled = true;
      btn.textContent = "REQUESTING…";
      const ok = await openCamera();     // this is the real browser prompt
      gate.classList.add("gone");
      if (ok) { root.classList.add("cam-ok"); } else { root.classList.add("cam-none"); }
      start();
    });
    $("#introDecline").addEventListener("click", () => {
      gate.classList.add("gone");
      root.classList.add("cam-none");
      start();
    });
    $("#introSkip").addEventListener("click", skip);
    addEventListener("keydown", (e) => { if (e.key === "Escape") skip(); });
  }

  function start(){
    $("#introSkip").classList.add("show");
    run();
  }

  return {
    mount(){ bindGate(); },
    /* the intro runs on a first visit, or after a reload */
    pending: () => !seen(),
    willRun: () => !seen() && !matchMedia("(prefers-reduced-motion: reduce)").matches
  };
})();
try { window.INTRO = INTRO; } catch(e){}
