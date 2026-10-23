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

    // the photograph itself — flash on, room behind
    c.fillStyle = "#0b0908"; c.fillRect(0, 0, PW, PH);
    if (src && src.width && src.height) {
      const vr = src.width / src.height, cr = PW / PH;
      let sw = src.width, sh = src.height, sx = 0, sy = 0;
      if (vr > cr) { sw = src.height * cr; sx = (src.width - sw) / 2; }
      else { sh = src.width / cr; sy = (src.height - sh) / 2; }
      c.save();
      c.filter = "grayscale(.30) contrast(1.22) brightness(1.04) saturate(.9)";
      c.drawImage(src, sx, sy, sw, sh, 0, 0, PW, PH);
      c.restore();
    } else {
      // no camera: the photograph is of the room, taken by the camera in it
      const wl = c.createLinearGradient(0, 0, 0, PH);
      wl.addColorStop(0, "#5c4a3b"); wl.addColorStop(.5, "#3a2e25"); wl.addColorStop(1, "#14100d");
      c.fillStyle = wl; c.fillRect(0, 0, PW, PH);
      // a doorway, open
      c.fillStyle = "#070505";
      c.fillRect(PW * .06, PH * .16, PW * .24, PH * .70);
      c.fillStyle = "rgba(70,56,44,.5)";
      c.fillRect(PW * .06, PH * .18, PW * .26, 6);
      // the flash pool on the floor
      c.save();
      const pool = c.createRadialGradient(PW * .5, PH * 1.02, 10, PW * .5, PH, PH * .8);
      pool.addColorStop(0, "rgba(255,226,190,.20)");
      pool.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = pool; c.fillRect(0, PH * .6, PW, PH * .4);
      c.restore();
      // and the word on the wall, because it is always on the wall
      c.save();
      c.font = "700 " + Math.round(PH * .10) + "px Georgia, serif";
      c.fillStyle = "rgba(176,18,10,.92)"; c.textAlign = "center";
      c.fillText("S M I L E", PW * .58, PH * .40);
      c.restore();
    }

    // the flash: hard light from the lens, a limp falloff behind you
    const fl = c.createRadialGradient(PW * .5, PH * .42, PH * .04, PW * .5, PH * .46, PH * .92);
    fl.addColorStop(0, "rgba(255,246,228,.20)");
    fl.addColorStop(.34, "rgba(255,236,208,.05)");
    fl.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = fl; c.fillRect(0, 0, PW, PH);

    // IT — in the doorway, at the left edge, a head above yours
    drawFigure(c, PW * 0.185, PH * 1.12, PH * 1.34, 3.2);

    // and another, older, at the right edge, too close to the lens
    drawHead(c, PW * 0.895, PH * 0.30, PH * 0.26);

    // blood
    bloodDrips(c, PW, PH);

    // the falloff that makes the corners of the frame worthless
    const vg = c.createRadialGradient(PW * .5, PH * .44, PH * .22, PW * .5, PH * .5, PH * 1.04);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(.52, "rgba(0,0,0,.22)");
    vg.addColorStop(.82, "rgba(1,1,1,.66)");
    vg.addColorStop(1, "rgba(0,0,0,.95)");
    c.fillStyle = vg; c.fillRect(0, 0, PW, PH);

    // paper, chemistry, dust
    grain(c, PW, PH, 24);
    scratches(c, PW, PH);

    const stamp = "31 10 1997   03:14";
    c.font = "600 15px ui-monospace, Menlo, Consolas, monospace";
    c.fillStyle = "rgba(238,128,70,.9)";
    c.shadowColor = "rgba(255,110,40,.85)"; c.shadowBlur = 10;
    c.fillText(stamp, 22, PH - 26);
    c.shadowBlur = 0;
  }

  /* a figure: too tall, too thin, lit by the flash from the front */
  function drawFigure(c, cx, footY, bodyH, blur){
    const headH = bodyH * 0.068, shoulderW = bodyH * 0.150;
    const headY = footY - bodyH + headH;
    const hipY = footY - bodyH * 0.42;
    c.save();
    c.filter = "blur(" + blur + "px)";
    const g = c.createLinearGradient(0, headY - headH, 0, footY);
    g.addColorStop(0, "rgba(146,134,120,.95)");
    g.addColorStop(.22, "rgba(120,108,96,.92)");
    g.addColorStop(.62, "rgba(78,66,58,.88)");
    g.addColorStop(1, "rgba(26,20,17,.7)");
    c.fillStyle = g;

    // skull — a smooth egg, tipped a degree too far
    c.beginPath();
    c.ellipse(cx, headY, headH * 0.76, headH * 1.04, -0.08, 0, Math.PI * 2);
    c.fill();
    // the neck is longer than a neck
    c.fillRect(cx - headH * .26, headY + headH * .68, headH * .52, bodyH * .105);
    // shoulders, torso
    c.beginPath();
    c.moveTo(cx - shoulderW * .40, headY + headH * 1.22);
    c.quadraticCurveTo(cx - shoulderW * 1.05, headY + bodyH * .15, cx - shoulderW * .60, hipY);
    c.lineTo(cx + shoulderW * .60, hipY);
    c.quadraticCurveTo(cx + shoulderW * 1.05, headY + bodyH * .15, cx + shoulderW * .40, headY + headH * 1.22);
    c.closePath(); c.fill();
    // arms, past the knees
    c.lineWidth = bodyH * .028; c.strokeStyle = g; c.lineCap = "round";
    c.beginPath();
    c.moveTo(cx - shoulderW * .80, headY + bodyH * .14);
    c.quadraticCurveTo(cx - shoulderW * 1.14, hipY + bodyH * .12, cx - shoulderW * .72, footY - bodyH * .09);
    c.moveTo(cx + shoulderW * .80, headY + bodyH * .14);
    c.quadraticCurveTo(cx + shoulderW * 1.14, hipY + bodyH * .12, cx + shoulderW * .72, footY - bodyH * .09);
    c.stroke();
    // the face is not a face: a smooth sheen where features should be
    const sh = c.createRadialGradient(cx - headH * .18, headY - headH * .22, 1, cx, headY, headH);
    sh.addColorStop(0, "rgba(232,222,204,.5)");
    sh.addColorStop(.5, "rgba(170,158,142,.16)");
    sh.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = sh;
    c.beginPath(); c.ellipse(cx, headY, headH * .70, headH * .98, -0.08, 0, Math.PI * 2); c.fill();
    c.restore();
  }

  /* only a head — coming in from outside the frame */
  function drawHead(c, cx, cy, r){
    c.save();
    c.filter = "blur(11px)";
    const g = c.createRadialGradient(cx - r * .25, cy - r * .28, r * .08, cx, cy, r * 1.2);
    g.addColorStop(0, "rgba(196,184,166,.7)");
    g.addColorStop(.42, "rgba(128,116,102,.5)");
    g.addColorStop(.78, "rgba(52,44,38,.28)");
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
      lg.addColorStop(0, "rgba(112,8,5,.95)");
      lg.addColorStop(.55, "rgba(88,6,4,.85)");
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
    // a palm print, half off the frame
    c.fillStyle = "rgba(104,7,5,.86)";
    c.beginPath(); c.ellipse(w * .925, h * .74, 32, 44, -.32, 0, Math.PI * 2); c.fill();
    for (let f = 0; f < 4; f++){
      c.beginPath();
      c.ellipse(w * .925 - 28 + f * 15, h * .70 - 42 + Math.abs(f - 1.5) * 7, 6.5, 21, -.28 + f * .14, 0, Math.PI * 2);
      c.fill();
    }
    // the smear it pulled away
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
    sfx("drone", 2.4);
    await wait(1500);            // the room, the word, the tripod

    root.classList.add("zoom");  // the lens comes closer
    sfx("paper");
    await wait(850);

    root.classList.add("live");  // now it is looking at you
    await wait(520);

    if (alive && !root.classList.contains("skipped")) {
      for (const n of [3, 2, 1]) {
        if (!alive) return;
        const el = $("#count");
        el.querySelector("b").textContent = String(n);
        el.classList.remove("beat");
        void el.offsetWidth;
        el.classList.add("beat");
        tick(n);
        await wait(620);
      }
      await wait(160);
      $("#flash").classList.add("fire");
      sfx("shutter");
      capture();
      paintPrint();
      await wait(460);
      $("#flash").classList.remove("fire");
      root.classList.remove("live", "zoom");
      await wait(340);
    }

    // the printer wakes up in the corner
    const printer = $("#printer");
    printer.classList.add("on");
    await wait(300);
    sfx("printer", 3.2);
    printer.classList.add("out");     // the sheet starts feeding
    await wait(1150);

    // and the sheet is in your hand — it comes to the middle of the room
    const print = $("#print"), sheet = $("#printer .sheet");
    const r = sheet.getBoundingClientRect();
    const dx = (r.left + r.width / 2) - innerWidth / 2;
    const dy = (r.top + r.height / 2) - innerHeight / 2;
    print.style.transform = "";
    print.classList.add("show");
    // out of the printer and into the middle of the room, on the compositor
    try {
      print.animate([
        { transform: "translate(calc(-50% + " + dx + "px), calc(-50% + " + dy + "px)) rotate(9deg) scale(.06)", opacity: 0 },
        { opacity: 1, offset: .10 },
        { transform: "translate(-50%,-50%) rotate(-1.3deg) scale(1)", opacity: 1 }
      ], { duration: 1500, easing: "cubic-bezier(.33,.02,.28,1)", fill: "none" });
    } catch(e){}
    $("#hint").classList.add("show");
    await wait(1500);

    markGrab();
    await wait(2600);

    // darkness, then the doors
    root.classList.add("black");
    sfx("drone", 2.8);
    await wait(1300);
    finish();
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
