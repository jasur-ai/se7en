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

    /* 1 · the frame the camera actually took */
    c.fillStyle = "#0c0a09"; c.fillRect(0, 0, PW, PH);
    const hasShot = !!(src && src.width && src.height);
    if (hasShot) {
      /* a webcam in a dim room is not a photograph. measure it, and give
         it the exposure the flash would have given it. */
      let mean = 0;
      try {
        const d = src.getContext("2d").getImageData(0, 0, src.width, src.height).data;
        for (let i = 0; i < d.length; i += 64) mean += (d[i] + d[i + 1] + d[i + 2]) / 3;
        mean /= (d.length / 64);
      } catch(e){ mean = 90; }
      const lift = Math.max(1.0, Math.min(2.9, 118 / Math.max(24, mean)));
      const vr = src.width / src.height, cr = PW / PH;
      let sw = src.width, sh = src.height, sx = 0, sy = 0;
      if (vr > cr) { sw = src.height * cr; sx = (src.width - sw) / 2; }
      else { sh = src.width / cr; sy = (src.height - sh) / 2; }
      c.save();
      c.filter = "brightness(" + (lift).toFixed(2) + ") contrast(1.04) saturate(.88)";
      c.drawImage(src, sx, sy, sw, sh, 0, 0, PW, PH);
      c.restore();
    } else {
      paintRoomPlate(c);
    }

    /* 2 · her. Behind you, in the same flash, blocking the same wall. */
    const drawn = layFigure(c);

    /* 3 · the flash itself: hard in the middle, gone at the corners */
    const fl = c.createRadialGradient(PW * .5, PH * .40, PH * .02, PW * .5, PH * .5, PH * .95);
    fl.addColorStop(0, "rgba(255,250,236,.42)");
    fl.addColorStop(.28, "rgba(255,238,214,.15)");
    fl.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = fl; c.fillRect(0, 0, PW, PH);

    /* 4 · blood, because the room has been waiting */
    blood(c, PW, PH);

    /* 5 · the falloff that makes the corners worthless */
    const vg = c.createRadialGradient(PW * .5, PH * .46, PH * .34, PW * .5, PH * .5, PH * 1.08);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(.62, "rgba(0,0,0,.16)");
    vg.addColorStop(1, "rgba(0,0,0,.66)");
    c.fillStyle = vg; c.fillRect(0, 0, PW, PH);

    /* 6 · the paper has started to burn */
    burntEdge(c, PW, PH);

    /* 7 · film */
    grain(c, PW, PH, 20);
    scratches(c, PW, PH);

    // if the figure was still decoding, paint again when it lands
    if (!drawn) {
      const im = figure();
      if (im && !im._hooked) { im._hooked = true; im.addEventListener("load", () => { try { paintPrint(); } catch(e){} }, { once: true }); }
    }
  }


  /* ── the figure, as a photograph ──────────────────────────────
     FIG_SRC is a picture of a standing body, keyed out of a white
     studio. It is composited in multiply, so it blocks the flash
     where it stands instead of sitting on top of the frame — that is
     the difference between "something in the room" and "a sticker". */
  let fig = null;
  function figure(){
    if (fig) return fig;
    if (typeof FIG_SRC !== "string") return null;
    fig = new Image();
    fig.decoding = "async";
    fig.src = FIG_SRC;
    return fig;
  }

  const smooth = (t) => { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); };

  /* ── her ────────────────────────────────────────────────────────
     A photograph is not enough on its own: pasted on top it reads as a
     sticker. Three things make her belong to the room, and all three are
     done per pixel, once, when the print is made:

       1  a shadow thrown on the wall. The flash is at the lens, so her
          shadow is almost directly behind her — slightly offset, much
          softer, wider by the time it reaches the plaster.
       2  a matte built from YOUR own brightness. Wherever the flash has
          lit your face or your clothes, she is hidden behind you. She can
          only be seen where the wall can be seen — which is the whole
          logic of something standing behind a person.
       3  the same falloff as the room. Her hair catches the flash at the
          top of her head and her feet fall away into the black, exactly
          like every other object at that distance.
     Nothing about her is drawn; the photograph supplies all of it. */
  function layFigure(c){
    const im = figure();
    if (!im || !im.complete || !im.naturalWidth) return false;

    const h = PH * 0.94;
    const w = h * (im.naturalWidth / im.naturalHeight);
    const cx = PW * 0.215, foot = PH * 1.05, tilt = -0.016;
    const top = foot - h;

    const mk = () => { const k = document.createElement("canvas"); k.width = PW; k.height = PH; return k; };
    const body = mk(), soft = mk(), edge = mk();

    const draw = (ctx, blur, dx, dy) => {
      ctx.save();
      ctx.translate(cx + (dx || 0), foot + (dy || 0));
      ctx.rotate(tilt); ctx.translate(-cx, -foot);
      ctx.filter = blur ? "blur(" + blur + "px)" : "none";
      ctx.drawImage(im, cx - w / 2, foot - h, w, h);
      ctx.restore();
    };
    draw(body.getContext("2d"), 0);
    draw(soft.getContext("2d"), 26, -26, 16);   // her shadow, thrown away from the lens
    draw(edge.getContext("2d"), 3.4);

    {
      const pc = soft.getContext("2d");
      pc.save();
      pc.filter = "blur(16px)";
      pc.fillStyle = "rgba(0,0,0,.55)";
      pc.beginPath();
      pc.ellipse(cx + 10, foot - 6, w * 0.62, h * 0.035, 0, 0, Math.PI * 2);
      pc.fill();
      pc.restore();
    }

    const bd = body.getContext("2d").getImageData(0, 0, PW, PH).data;
    const sd = soft.getContext("2d").getImageData(0, 0, PW, PH).data;
    const ed = edge.getContext("2d").getImageData(0, 0, PW, PH).data;
    const grd = c.getImageData(0, 0, PW, PH);
    const gd = grd.data;

    /* how bright is the room where she is standing? a flash photograph
       exposes the nearest thing to the same value as the wall it is in
       front of. without this she would be a bright cut-out on a dark
       room, or a dark one on a bright room — the tell. */
    let amb = 0, ambN = 0;
    {
      const x0 = Math.max(0, Math.round(cx - w * 0.9)), x1 = Math.min(PW, Math.round(cx + w * 0.9));
      for (let y = Math.max(0, Math.round(top)); y < Math.min(PH, Math.round(foot)); y += 3){
        for (let x = x0; x < x1; x += 3){
          const j = (y * PW + x) * 4;
          amb += (0.2126 * gd[j] + 0.7152 * gd[j + 1] + 0.0722 * gd[j + 2]) / 255;
          ambN++;
        }
      }
      amb = ambN ? amb / ambN : 0.35;
    }
    const exposure = Math.max(0.42, Math.min(0.92, amb / 0.34));

    /* the sitter is in front of her. anything in the frame that is
       noticeably brighter than the wall around it is nearer the lens than
       she is, and she cannot be painted over it. */
    const near = new Float32Array(PW * PH);
    {
      const trig = amb * 255 + 26;
      for (let j = 0, q = 0; j < gd.length; j += 4, q++){
        const l = 0.2126 * gd[j] + 0.7152 * gd[j + 1] + 0.0722 * gd[j + 2];
        near[q] = 1 - smooth((l - trig) / 42);
      }
    }

    /* she is lit by the same flash, from further away: her body lands
       within a fifth of the wall she stands against. that, plus the
       shadow and the sitter cutting into her, is what "behind you"
       means in a photograph. */
    const wall = Math.max(0.10, Math.min(0.62, amb));
    const lumW = wall;
    /* her average brightness in the source photo, so the light that
       reaches her lands on the wall's value and not above it */
    let sumB = 0, nB = 0;
    for (let j = 0; j < bd.length; j += 4)
      if (bd[j + 3] > 200){ sumB += (0.2126*bd[j] + 0.7152*bd[j+1] + 0.0722*bd[j+2]) / 255; nB++; }
    const lit = (wall * 1.12) / Math.max(0.10, nB ? sumB / nB : 0.55);
    const fx = PW * 0.5, fy = PH * 0.40, fr = PH * 0.95;
    for (let y = 0, i = 0; y < PH; y++){
      for (let x = 0; x < PW; x++, i += 4){
        const sA = sd[i + 3], bA = bd[i + 3], eA = ed[i + 3];
        if (!sA && !bA && !eA) continue;

        const R = gd[i], G = gd[i + 1], B = gd[i + 2];
        let k = near[y * PW + x];
        {
          const ex = (x / PW - 0.50) / 0.36, ey = (y / PH - 0.56) / 0.48;
          const e = Math.sqrt(ex * ex + ey * ey);
          k *= smooth((e - 0.72) / 0.42);
        }

        let r = R, g = G, bl = B;

        // 1 · her shadow, thrown past her by a flash that is in the lens
        const sh = (sA / 255) * k * 0.55;
        r *= 1 - sh; g *= 1 - sh; bl *= 1 - sh;

        // 2 · her body: the flash's falloff down her length, her own forms
        //     inside it, and nothing that outshines the wall
        const aB = (bA / 255) * k * 0.95;
        if (aB > 0.002){
          const yn = Math.max(0, Math.min(1, (y - top) / h));
          const drop = 0.92 - 0.46 * Math.pow(yn, 0.9);      // feet in the dark
          /* her own photograph, multiplied by the light that reaches
             her: hair stays black because hair is black, the dress goes
             bright where the flash hits, and fold detail survives. */
          const gain = lit * drop;
          const al = 1 - smooth((lumW - 0.30) / 0.42);
          r = r * (1 - aB * al) + Math.min(255, bd[i] * gain * 1.03 + 1) * aB * al;
          g = g * (1 - aB * al) + Math.min(255, bd[i + 1] * gain * 0.99 + 1) * aB * al;
          bl = bl * (1 - aB * al) + Math.min(255, bd[i + 2] * gain * 1.07 + 2) * aB * al;

          // 3 · the flash finds the edge of her hair, one shoulder
          const rim = Math.max(0, bA - eA) / 255;
          if (rim > 0.01){
            const yr = 1 - Math.min(1, Math.abs((y - (top + h * 0.16)) / (h * 0.40)));
            const s2 = rim * (0.34 + 0.55 * yr) * Math.min(1, wall * 2.2);
            r = Math.min(255, r + s2 * 226); g = Math.min(255, g + s2 * 204); bl = Math.min(255, bl + s2 * 174);
          }
        }
        gd[i] = r; gd[i + 1] = g; gd[i + 2] = bl;
      }
    }
    c.putImageData(grd, 0, 0);
    return true;
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
    c.globalCompositeOperation = "screen";
    for (let i = 0; i < 90; i++){
      const side = Math.floor(Math.random() * 4);
      const t = Math.random();
      const x = side === 0 ? t * w : side === 1 ? w - Math.random() * 12 : side === 2 ? t * w : Math.random() * 12;
      const y = side === 0 ? Math.random() * 12 : side === 1 ? t * h : side === 2 ? h - Math.random() * 12 : t * h;
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

  /* no camera: the room, photographed by the camera in it */
  function paintRoomPlate(c){
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

  /* ── blood ──────────────────────────────────────────────────────
     Four runs that come down from above the frame, each one a path with
     a wobble of its own, wider where it started and narrower when it
     dried, ending in a bead heavy enough to hang. Painted into its own
     layer, blurred by half a pixel, then multiplied — so it sits in the
     emulsion of the print instead of on top of it. No handprint, no
     cartoon. */
  function blood(c, w, h){
    const B = document.createElement("canvas"); B.width = w; B.height = h;
    const b = B.getContext("2d");
    b.fillStyle = "#000"; b.globalCompositeOperation = "source-over";

    const runs = [
      { x: .300, len: .27, w0: 3.4, w1: 1.2, drift: -7, seed: 11 },
      { x: .318, len: .17, w0: 1.5, w1: .7, drift: 5, seed: 23 },
      { x: .664, len: .38, w0: 4.6, w1: 1.5, drift: 6, seed: 37 },
      { x: .702, len: .15, w0: 1.2, w1: .6, drift: -6, seed: 41 },
      { x: .812, len: .31, w0: 2.7, w1: 1.0, drift: -9, seed: 53 },
      { x: .858, len: .11, w0: .9, w1: .5, drift: 4, seed: 67 }
    ];
    const rnd = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };

    for (const R of runs){
      const x0 = R.x * w, len = R.len * h;
      const steps = Math.max(8, Math.round(len / 5));
      const L = [], Rt = [];
      for (let i = 0; i <= steps; i++){
        const t = i / steps;
        const y = t * len;
        const wob = (rnd(R.seed + i * 1.7) - .5) * 2.6 * (1 - t) + Math.sin(t * 5.1 + R.seed) * 1.9 * (1 - t);
        const cx = x0 + R.drift * t + wob;
        const half = ((R.w0 * (1 - t) + R.w1 * t) * (0.82 + rnd(R.seed + i * 3.1) * 0.42)) / 2;
        L.push([cx - half, y]); Rt.push([cx + half, y]);
      }
      const g = b.createLinearGradient(0, 0, 0, len);
      g.addColorStop(0, "#6d0f0a");
      g.addColorStop(.35, "#5a0b07");
      g.addColorStop(.8, "#480805");
      g.addColorStop(1, "#3a0604");
      b.fillStyle = g;
      b.beginPath();
      b.moveTo(L[0][0], -8);
      for (const [x, y] of L) b.lineTo(x, y);
      for (let i = Rt.length - 1; i >= 0; i--) b.lineTo(Rt[i][0], Rt[i][1]);
      b.lineTo(Rt[0][0], -8);
      b.closePath(); b.fill();

      // the bead, heavier than the run, hanging where it stopped
      const bx = (L[L.length - 1][0] + Rt[Rt.length - 1][0]) / 2;
      const br = R.w1 * 1.35 + 1.4;
      const bg = b.createRadialGradient(bx - br * .35, len - br * .5, br * .1, bx, len, br * 1.5);
      bg.addColorStop(0, "#7d120b");
      bg.addColorStop(.55, "#4d0806");
      bg.addColorStop(1, "#330504");
      b.fillStyle = bg;
      b.beginPath(); b.ellipse(bx, len, br * .92, br * 1.15, 0, 0, Math.PI * 2); b.fill();

      // two or three drops that let go and fell short
      const nd = 2 + Math.floor(rnd(R.seed) * 3);
      for (let i = 0; i < nd; i++){
        const dy = len * (.42 + rnd(R.seed + i * 9) * .5);
        const dx = x0 + (rnd(R.seed + i * 13) - .5) * 26;
        const rr = .8 + rnd(R.seed + i * 17) * 1.9;
        b.fillStyle = "#4a0806";
        b.beginPath();
        b.moveTo(dx, dy - rr * 2.1);
        b.quadraticCurveTo(dx + rr * 1.2, dy - rr * .3, dx, dy + rr);
        b.quadraticCurveTo(dx - rr * 1.2, dy - rr * .3, dx, dy - rr * 2.1);
        b.fill();
      }
    }

    c.save();
    c.globalCompositeOperation = "multiply";
    c.globalAlpha = .92;
    c.filter = "blur(.45px)";
    c.drawImage(B, 0, 0);
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
  /* ── the camera ────────────────────────────────────────────────
     On a desktop with a phone plugged in (DroidCam, Iriun, Continuity
     Camera) the browser will happily hand over the PHONE. We want the
     machine's own camera: it is the one that is pointed at the room
     and at the person sitting in it. So: ask for permission once, read
     the labels the browser only reveals afterwards, and if the default
     is a phone, switch to the built-in one. */
  const PHONE = /(phone|droidcam|iriun|epoc|camo|continuity|iphone|android|pixel|galaxy|oneplus|xiaomi|huawei|redmi)/i;
  const BUILTIN = /(integrated|built-?in|internal|facetime|hd webcam|webcam|front|user facing|ir camera)/i;

  async function openCamera(){
    const md = navigator.mediaDevices;
    if (!md || !md.getUserMedia) return false;
    const size = { width: { ideal: 640 }, height: { ideal: 480 } };

    /* 1 · ask plainly. Whatever the browser offers by default, take it —
           a refusal or a dead device stops us here, honestly. */
    try {
      stream = await md.getUserMedia({ video: size, audio: false });
    } catch (e) {
      try { stream = await md.getUserMedia({ video: true, audio: false }); }
      catch (e2) { return false; }
    }

    /* 2 · now that permission is granted the labels are readable. If the
           thing we were handed is a phone (DroidCam, Iriun, Continuity),
           switch to the machine's own camera — but never at the cost of a
           working stream: every attempt has its own try/catch and the first
           good one wins. */
    let want = null;
    try {
      const list = (await md.enumerateDevices()).filter(d => d.kind === "videoinput" && d.deviceId);
      const notPhone = list.filter(d => !PHONE.test(d.label || ""));
      const pool = notPhone.length ? notPhone : list;
      const builtin = pool.find(d => BUILTIN.test(d.label || ""));
      want = (builtin || pool[0]).deviceId;
    } catch (e) { want = null; }

    const current = stream.getVideoTracks()[0]?.getSettings?.()?.deviceId;
    if (want && want !== current) {
      let better = null;
      try { better = await md.getUserMedia({ video: Object.assign({ deviceId: { exact: want } }, size), audio: false }); }
      catch (e) {
        try { better = await md.getUserMedia({ video: Object.assign({ deviceId: want }, size), audio: false }); }
        catch (e2) { better = null; }
      }
      if (better && better.getVideoTracks().length) {
        stream.getTracks().forEach(t => t.stop());
        stream = better;
      }
      /* if the switch failed, the original stream is still live and untouched */
    }

    try { stream.getVideoTracks()[0].applyConstraints(size); } catch(e){}

    video = $("#camFeed");
    if (video.srcObject !== stream) {
      video.srcObject = stream;
      /* it is two pixels wide and invisible, but it must keep running:
         a paused video hands back the frame it stopped on, and an empty
         camera hands back black. */
      try { await video.play(); } catch(e){}
    }
    return true;
  }
  function capture(){
    const v = $("#camFeed"), c = $("#camShot");
    const w = 840, h = 630;
    c.width = w; c.height = h;
    const x = c.getContext("2d");

    const draw = () => {
      x.setTransform(1, 0, 0, 1, 0, 0);
      x.fillStyle = "#0a0807"; x.fillRect(0, 0, w, h);
      if (!v || !v.videoWidth) return 0;
      const vr = v.videoWidth / v.videoHeight, cr = w / h;
      let sw = v.videoWidth, sh = v.videoHeight, sx = 0, sy = 0;
      if (vr > cr) { sw = v.videoHeight * cr; sx = (v.videoWidth - sw) / 2; }
      else { sh = v.videoWidth / cr; sy = (v.videoHeight - sh) / 2; }
      x.save(); x.translate(w, 0); x.scale(-1, 1);           // mirror, like a mirror
      x.drawImage(v, sx, sy, sw, sh, 0, 0, w, h);
      x.restore();
      // how much of the frame is actually something?
      const d = x.getImageData(0, 0, w, h).data;
      let sum = 0, lit = 0;
      for (let i = 0; i < d.length; i += 32){ const l = (d[i] + d[i+1] + d[i+2]) / 3; sum += l; if (l > 24) lit++; }
      const n = d.length / 32;
      return { avg: sum / n, lit: lit / n };
    };

    /* the camera needs a moment after the flash, and a laptop camera in a
       dim room hands back black for the first few frames. keep asking
       until there is a picture, then keep it. */
    return new Promise((resolve) => {
      let tries = 0;
      const tick = () => {
        const r = draw();
        const ok = r && r.avg > 8 && r.lit > 0.06;
        if (ok || tries++ > 14) return resolve(!!ok);
        setTimeout(tick, 90);
      };
      tick();
    });
  }

  /* ── scene beats ────────────────────────────────────────────── */
  async function run(){
    try { if (window.DEPTH && DEPTH.pause) DEPTH.pause(); } catch(e){}
    root.classList.add("lit");
    sfx("powerUp");
    sfx("drone", 7.5);
    await wait(4200);             // the room comes up out of the dark, unhurried

    sfx("paper");                 // somewhere at the back, something shifts
    await wait(1400);
    root.classList.add("zoom");   // the lens leans in
    await wait(4600);
    root.classList.add("live");   // and now it is looking at you
    try { if (video) await video.play().catch(()=>{}); } catch(e){}
    await wait(4200);

    if (alive && !root.classList.contains("skipped")) {
      await wait(2400);            // no countdown, no warning: a game does not ask

      // the flash: the room disappears, your eyes do not
      const feed = $("#camFeed");
      for (let i = 0; i < 40 && feed && !(feed.videoWidth > 0); i++) await wait(50);
      $("#flash").classList.add("fire");
      sfx("shutter");
      sfx("ring", 6.5);
      capture().then(() => paintPrint());
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
    document.body.classList.remove("intro-run");
    try { if (window.DEPTH && DEPTH.resume) DEPTH.resume(); } catch(e){}
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

  /* ── the camera, without ceremony ─────────────────────────────
     No card, no list of terms, no button. The room calls getUserMedia
     the moment it opens; if the browser has never been told who may use
     the camera, it puts up its own small prompt — and that is the only
     place permission is asked. If it is refused, the room simply plays
     with the plate behind the lens. Nothing is ever shown to you. */
  function bindKeys(){
    addEventListener("keydown", (e) => { if (e.key === "Escape") skip(); });
  }

  function start(){
    run();
  }


  return {
    _paint: paintPrint,
    mount(){
      document.body.classList.add("intro-run");
      bindKeys();
      /* the room begins at once. the camera is asked for in parallel, and
         a prompt left hanging can never hold the scene hostage. */
      start();
      const deadline = new Promise((r) => setTimeout(() => r("timeout"), 12000));
      Promise.race([openCamera(), deadline]).then((ok) => {
        root.classList.add(ok === true ? "cam-ok" : "cam-none");
      }).catch(() => root.classList.add("cam-none"));
    },
    /* the intro runs on a first visit, or after a reload */
    pending: () => !seen(),
    willRun: () => !seen() && !matchMedia("(prefers-reduced-motion: reduce)").matches
  };
})();
try { window.INTRO = INTRO; } catch(e){}
