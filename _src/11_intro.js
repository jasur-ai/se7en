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
  /* a phone is watched in the hand, not in an armchair: the same beats,
     played a little quicker, so the room opens in half a minute instead
     of three quarters of one. */
  const PACE = (typeof matchMedia === "function" && matchMedia("(max-width: 860px)").matches) ? 0.58 : 1;
  const wait = (ms) => new Promise(r => setTimeout(r, ms * PACE));
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
      const lift = Math.max(0.62, Math.min(2.30, 92 / Math.max(22, mean)));
      const vr = src.width / src.height, cr = PW / PH;
      let sw = src.width, sh = src.height, sx = 0, sy = 0;
      if (vr > cr) { sw = src.height * cr; sx = (src.width - sw) / 2; }
      else { sh = src.width / cr; sy = (src.height - sh) / 2; }
      c.save();
      c.filter = "brightness(" + (lift).toFixed(2) + ") contrast(1.16) saturate(.74)";
      c.drawImage(src, sx, sy, sw, sh, 0, 0, PW, PH);
      c.restore();
    } else {
      paintRoomPlate(c);
    }

    /* 2 · her, before the lens has its say. Everything that belongs to
           the camera — the focus, the film, the falloff — is applied
           AFTER she is in the frame, so she is inside the same exposure
           and not laid over it. */
    const drawn = layFigure(c);

    /* 2b · the floor. A flash photograph of a person in a room always
            has this: the dark where their body keeps the light off the
            floor, running towards the camera. It is the cheapest and
            most convincing piece of physics in the whole frame. */
    {
      const fsh = c.createLinearGradient(0, PH * 0.30, 0, PH);
      fsh.addColorStop(0, "rgba(0,0,0,0)");
      fsh.addColorStop(.55, "rgba(6,5,4,.30)");
      fsh.addColorStop(1, "rgba(4,3,3,.72)");
      c.save();
      c.globalCompositeOperation = "source-over";
      c.fillStyle = fsh; c.fillRect(0, PH * 0.30, PW, PH * 0.70);
      c.restore();
    }

    /* 3 · a breath of bloom where the flash hits the air */
    const fl = c.createRadialGradient(PW * .5, PH * .40, PH * .02, PW * .5, PH * .5, PH * .95);
    fl.addColorStop(0, "rgba(255,248,232,.12)");
    fl.addColorStop(.30, "rgba(255,236,210,.04)");
    fl.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = fl; c.fillRect(0, 0, PW, PH);

    /* 4 · one lens for the whole frame. A cheap camera is soft; a
           photograph of an old print is softer. This single pass is what
           stops anything from looking pasted on. */
    unify(c, PW, PH);

    /* 5 · the falloff that makes the corners worthless */
    const vg = c.createRadialGradient(PW * .5, PH * .46, PH * .28, PW * .5, PH * .5, PH * 1.02);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(.50, "rgba(0,0,0,.16)");
    vg.addColorStop(1, "rgba(0,0,0,.72)");
    c.fillStyle = vg; c.fillRect(0, 0, PW, PH);

    /* 6 · an old photograph, not a burnt one: paper, silver, time */
    oldPhoto(c, PW, PH);

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
  const x_of = (q, w) => q % w;
  const y_of = (q, w) => (q / w) | 0;

  function layFigure(c){
    const im = figure();
    if (!im || !im.complete || !im.naturalWidth) return false;

    /* ══ how a figure is made to belong ══════════════════════════
       Not by lighting her well. By giving her three things that only
       exist inside a real frame:

       1  THE ROOM'S OWN LIGHT, measured as a map, not a number. The
          wall behind her is brighter at the top and darker at the
          floor, brighter near the flash and dimmer at the edge. She
          inherits that exact gradient, so the light that falls on the
          plaster falls on her too.
       2  THE CAMERA'S OWN DETAIL. Measured, not guessed: the room's
          high-frequency energy is sampled, then her blur is searched
          until her detail matches it. If she is sharper than the room
          she is a sticker, every time.
       3  THE LIGHT SHE TAKES AWAY. Her shadow on the plaster, and the
          dark she leaves on the floor.
       Everything else — the hairstyle, the dress, the shape of a
       person — is the photograph. Nothing is drawn. */

    const h = PH * 1.16;
    const w = h * (im.naturalWidth / im.naturalHeight);
    const cx = PW * 0.215, top = PH * 0.055;

    /* ── 1 · the flash goes off in the room ───────────────────────
       Before anything is placed, the frame is lit by the flash that
       took it: hard in the middle, gone at the corners. This is the
       light she will inherit. */
    {
      c.save();
      c.globalCompositeOperation = "screen";
      const fg = c.createRadialGradient(PW * .5, PH * .42, PH * .04, PW * .5, PH * .52, PH * 1.10);
      fg.addColorStop(0,   "rgba(255,246,232,.30)");
      fg.addColorStop(.20, "rgba(255,240,222,.16)");
      fg.addColorStop(.52, "rgba(244,226,204,.06)");
      fg.addColorStop(1,   "rgba(0,0,0,0)");
      c.fillStyle = fg; c.fillRect(0, 0, PW, PH);
      c.restore();
    }

    /* ── 2 · the room's light, as a map ───────────────────────────
       A tiny copy of the frame, blurred hard, scaled back up: every
       pixel now knows how bright the wall around it is. */
    const A = new Float32Array(PW * PH);
    {
      const sw = 42, sh = Math.round(sw * PH / PW);
      const sm = document.createElement("canvas"); sm.width = sw; sm.height = sh;
      const sx2 = sm.getContext("2d");
      sx2.filter = "blur(1.6px)";
      sx2.drawImage(c.canvas, 0, 0, sw, sh);
      const sd = sx2.getImageData(0, 0, sw, sh).data;
      for (let y = 0; y < PH; y++){
        const fy = (y / PH) * (sh - 1);
        const y0 = Math.floor(fy), y1 = Math.min(sh - 1, y0 + 1), ty = fy - y0;
        for (let x = 0; x < PW; x++){
          const fx = (x / PW) * (sw - 1);
          const x0 = Math.floor(fx), x1 = Math.min(sw - 1, x0 + 1), tx = fx - x0;
          const at = (xx, yy) => { const j = (yy * sw + xx) * 4; return (0.2126*sd[j] + 0.7152*sd[j+1] + 0.0722*sd[j+2]) / 255; };
          const v00 = at(x0, y0), v10 = at(x1, y0), v01 = at(x0, y1), v11 = at(x1, y1);
          A[y * PW + x] = (v00 * (1 - tx) + v10 * tx) * (1 - ty) + (v01 * (1 - tx) + v11 * tx) * ty;
        }
      }
    }

    /* ── 3 · her body, at the camera's resolution ─────────────────  */
    const lw = Math.round(PW * 0.5), lh = Math.round(lw * PH / PW);
    const small = document.createElement("canvas"); small.width = lw; small.height = lh;
    small.getContext("2d").drawImage(im, 0, 0, lw, lh);
    const bdSmall = small.getContext("2d").getImageData(0, 0, lw, lh).data;

    const mkBody = (blur) => {
      const k = document.createElement("canvas"); k.width = PW; k.height = PH;
      const kc = k.getContext("2d");
      kc.imageSmoothingEnabled = true; kc.imageSmoothingQuality = "high";
      kc.filter = "blur(" + blur.toFixed(2) + "px)";
      kc.drawImage(small, (cx - w / 2), top, w, h);
      return k;
    };

    /* ── 4 · match her detail to the room's detail ────────────────
       The room is measured: how much does its luminance change over
       two pixels, averaged over the wall she stands against? Then her
       own blur is searched for the value that lands on it. A figure
       in sharper focus than the photograph she is in is a cut-out. */
    const grd = c.getImageData(0, 0, PW, PH);
    const gd = grd.data;
    const roomHF = (() => {
      let acc = 0, n = 0;
      const x0 = Math.max(8, Math.round(cx - w * 0.75)), x1 = Math.min(PW - 8, Math.round(cx + w * 0.75));
      const y0 = Math.max(8, Math.round(top + h * 0.05)), y1 = Math.min(PH - 8, Math.round(top + h * 0.92));
      for (let y = y0; y < y1; y += 3){
        for (let x = x0; x < x1; x += 3){
          const i = (y * PW + x) * 4;
          const c0 = 0.2126*gd[i] + 0.7152*gd[i+1] + 0.0722*gd[i+2];
          const i1 = (y * PW + Math.min(PW - 1, x + 2)) * 4;
          const i2 = (y * PW + Math.max(0, x - 2)) * 4;
          const c1 = 0.2126*gd[i1] + 0.7152*gd[i1+1] + 0.0722*gd[i1+2];
          const c2 = 0.2126*gd[i2] + 0.7152*gd[i2+1] + 0.0722*gd[i2+2];
          acc += Math.abs(c1 - c2); n++;
        }
      }
      return n ? acc / n : 3;
    })();

    let bestBlur = 1.2, bestErr = 1e9, bestBody = null;
    for (const bl of [0.6, 1.0, 1.5, 2.1, 2.8]) {
      const body = mkBody(bl);
      const bdata = body.getContext("2d").getImageData(0, 0, PW, PH).data;
      let acc = 0, n = 0;
      const y0 = Math.max(2, Math.round(top + h * 0.10)), y1 = Math.min(PH - 2, Math.round(top + h * 0.88));
      for (let y = y0; y < y1; y += 4){
        for (let x = Math.max(2, Math.round(cx - w * 0.35)); x < Math.min(PW - 2, Math.round(cx + w * 0.35)); x += 4){
          const i = (y * PW + x) * 4;
          if (bdata[i + 3] < 200) continue;
          const c0 = 0.2126*bdata[i] + 0.7152*bdata[i+1] + 0.0722*bdata[i+2];
          const i1 = (y * PW + x + 2) * 4, i2 = (y * PW + x - 2) * 4;
          const c1 = 0.2126*bdata[i1] + 0.7152*bdata[i1+1] + 0.0722*bdata[i1+2];
          const c2 = 0.2126*bdata[i2] + 0.7152*bdata[i2+1] + 0.0722*bdata[i2+2];
          acc += Math.abs(c1 - c2); n++;
        }
      }
      const hf = n ? acc / n : 0;
      const err = Math.abs(hf - roomHF);
      if (err < bestErr){ bestErr = err; bestBlur = bl; bestBody = body; }
    }
    const body = bestBody || mkBody(2.2);
    const bd = body.getContext("2d").getImageData(0, 0, PW, PH).data;

    /* ── 5 · her luminance range, and the room's ────────────────── */
    let hMean = 0.6, n2 = 0;
    for (let j = 0; j < bd.length; j += 4){
      if (bd[j + 3] < 200) continue;
      hMean += (0.2126*bd[j] + 0.7152*bd[j+1] + 0.0722*bd[j+2]) / 255; n2++;
    }
    hMean = n2 ? hMean / n2 : 0.6;

    /* ── 6 · what is in front of her ─────────────────────────────
       Not a shape on the frame. A test, pixel by pixel: is this part
       of the picture brighter than the wall immediately around it?
       If it is, it is nearer the lens than the plaster is — so it is
       nearer than she is, and she cannot be painted over it. This
       works for any framing: a head, a shoulder, a hand, a chair.
       The light map A was measured before her shadow went in, so the
       comparison is always against the bare wall. */
    const near = new Float32Array(PW * PH);
    {
      const bare = Float32Array.from(A);
      const bx0 = cx - w * 0.56, bx1 = cx + w * 0.56;
      for (let q = 0, i = 0; q < near.length; q++, i += 4){
        const xx = q % PW, yy = (q / PW) | 0;
        const inBody = xx > bx0 && xx < bx1 && yy > top - PH * 0.02;
        const l = (0.2126*gd[i] + 0.7152*gd[i+1] + 0.0722*gd[i+2]) / 255;
        const ref = Math.max(0.045, bare[q] * 1.06);
        const ratio = l / ref;                     // 1.0 = the wall itself
        /* only clearly brighter than its own wall is an object in
           front of her — and never inside the figure's own footprint */
        let occl = smooth((ratio - 1.34) / 0.40);
        if (inBody) occl *= 0.20;
        /* and the very centre of the frame is the sitter's, always */
        const ex = (xx / PW - 0.52) / 0.26;
        const ey = (yy / PH - 0.52) / 0.44;
        const core = 1 - smooth((Math.sqrt(ex * ex + ey * ey) - 0.55) / 0.45);
        occl = Math.max(occl, core * 0.96);
        near[q] = 1 - occl;
      }
    }

    const grainA = new Uint8Array(PW * PH);
    for (let q = 0; q < grainA.length; q++) grainA[q] = Math.random() * 255;

    /* ── 7 · her shadow, carved into the wall she stands against ───
       Her shadow is drawn into the light map, so it is not a grey
       shape on top of the picture: the wall behind her is genuinely
       darker where the flash could not reach. */
    {
      const sh = document.createElement("canvas"); sh.width = PW; sh.height = PH;
      const sc = sh.getContext("2d");
      sc.filter = "blur(18px)"; sc.drawImage(body, -14, 9);
      sc.filter = "blur(7px)";  sc.drawImage(body, 5, 3);
      sc.filter = "blur(12px)"; sc.fillStyle = "rgba(0,0,0,.8)";
      sc.beginPath(); sc.ellipse(cx + 6, PH * 1.015 - 6, w * 0.44, h * 0.022, 0, 0, Math.PI * 2); sc.fill();
      const sd = sc.getImageData(0, 0, PW, PH).data;
      for (let q = 0, i = 0; q < A.length; q++, i += 4){
        if (bd[i + 3] > 40) continue;               // never inside her own body
        const a = (sd[i + 3] / 255) * near[q];
        if (a > 0.003) A[q] *= 1 - Math.min(0.66, a * 0.58);
      }
    }

    /* ── 8 · her, into the same exposure ──────────────────────────
       Her own reflectance against the wall's local light. She is
       nearer the flash than the plaster is, so she can take a little
       more of it — but only a little: a person is not a lamp. */
    for (let y = 0, i = 0; y < PH; y++){
      for (let x = 0; x < PW; x++, i += 4){
        const bA = bd[i + 3];
        if (bA < 6) continue;

        const ex = (x / PW - 0.215) / 0.255, ey = (y / PH - 0.60) / 0.72;
        const r = Math.sqrt(ex * ex + ey * ey);
        const fray = (grainA[y * PW + x] / 255 - 0.5) * 0.20;
        const soft = 1 - smooth((r - 0.62 + fray) / 0.46);
        if (soft <= 0.002) continue;

        const ao = Math.max(0, Math.min(1, (bA - 26) / 92));
        const aB = ao * soft * near[y * PW + x];
        if (aB <= 0.004) continue;

        const hl = (0.2126*bd[i] + 0.7152*bd[i+1] + 0.0722*bd[i+2]) / 255;
        const refl = hl / Math.max(0.05, hMean);

        /* the wall's own light, measured where she stands */
        const amb = A[y * PW + x];

        /* Her reflectance on the wall's own light. The contrast is
           hers, not the room's: her hair goes a third of the way to
           black, her lit shoulder half again brighter than the plaster.
           A figure with real light on it reads as a body; a figure
           shaded to match the wall reads as a smudge. */
        const r2 = Math.max(0, Math.min(2.0, refl));
        const v = amb * 255 * (0.34 + 1.06 * Math.pow(r2, 0.92)) + 4;
        const vv = Math.min(242, v);

        const nz = (grainA[y * PW + x] / 255 - 0.5) * 7;
        gd[i]     = gd[i] * (1 - aB) + (vv * 1.02 + nz) * aB;
        gd[i + 1] = gd[i + 1] * (1 - aB) + (vv * 0.985 + nz) * aB;
        gd[i + 2] = gd[i + 2] * (1 - aB) + (vv * 0.94 + nz) * aB;
      }
    }

    c.putImageData(grd, 0, 0);
    try { window.__lay = { roomHF: +roomHF.toFixed(2), blur: +bestBlur.toFixed(2), hMean: +hMean.toFixed(3) }; } catch(e){}
    return true;
  }

  /* ── one lens for the whole frame ───────────────────────────────
     Drawn back over itself at half strength through a one-pixel blur:
     everything in the picture, her included, is now behind the same
     glass. This is the pass that stops a composite looking pasted. */
  function unify(c, w, h){
    const tmp = document.createElement("canvas"); tmp.width = w; tmp.height = h;
    tmp.getContext("2d").drawImage(c.canvas, 0, 0);
    c.save();
    c.globalAlpha = 0.55;
    c.filter = "blur(1.05px)";
    c.drawImage(tmp, 0, 0);
    c.restore();
  }

  /* ── an old photograph ────────────────────────────────────────────
     Silver, not digital: a slow tone curve into warm grey, a soft
     paper edge, fine dust, and the grain of the emulsion. No burn, no
     coals, no coloured dots — a print that has been in a drawer. */
  function oldPhoto(c, w, h){
    c.save();

    /* silver: pull the colour out, then put a little warmth back */
    c.globalCompositeOperation = "saturation";
    c.fillStyle = "rgba(128,128,128,.78)";
    c.fillRect(0, 0, w, h);

    c.globalCompositeOperation = "overlay";
    const warm = c.createLinearGradient(0, 0, 0, h);
    warm.addColorStop(0, "rgba(150,126,96,.16)");
    warm.addColorStop(.55, "rgba(126,110,92,.10)");
    warm.addColorStop(1, "rgba(86,74,62,.20)");
    c.fillStyle = warm; c.fillRect(0, 0, w, h);

    /* the paper's own edge, soft and uneven */
    c.globalCompositeOperation = "multiply";
    const edge = c.createRadialGradient(w * .5, h * .48, Math.min(w, h) * .30, w * .5, h * .5, Math.max(w, h) * .70);
    edge.addColorStop(0, "rgba(255,255,255,1)");
    edge.addColorStop(.72, "rgba(236,230,220,1)");
    edge.addColorStop(.92, "rgba(196,186,172,1)");
    edge.addColorStop(1, "rgba(150,140,126,1)");
    c.fillStyle = edge; c.fillRect(0, 0, w, h);
    c.restore();

    /* dust and the odd hair of a scratch */
    c.save();
    c.globalCompositeOperation = "screen";
    for (let i = 0; i < 140; i++){
      const x = Math.random() * w, y = Math.random() * h;
      const r = Math.random() * 1.1 + .2;
      c.fillStyle = "rgba(255,252,244," + (0.05 + Math.random() * 0.10).toFixed(3) + ")";
      c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    }
    c.restore();

    /* the print curve: black stays black, the flash-lit subject stays lit */
    c.save();
    c.globalCompositeOperation = "multiply";
    const pc = c.createRadialGradient(w * .5, h * .44, Math.min(w, h) * .18, w * .5, h * .5, Math.max(w, h) * .62);
    pc.addColorStop(0, "rgba(255,255,255,1)");
    pc.addColorStop(.55, "rgba(206,200,190,1)");
    pc.addColorStop(1, "rgba(96,90,84,1)");
    c.fillStyle = pc; c.fillRect(0, 0, w, h);
    c.restore();

    grain(c, w, h, 30);
    scratches(c, w, h);
  }

  /* ── no camera: the room the lens is pointed at ───────────────── */
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

  /* the print is scorching from the outside in */
  function burntEdge(c, w, h){
    c.save();
    const g = c.createRadialGradient(w * .5, h * .5, Math.min(w, h) * .34, w * .5, h * .5, Math.max(w, h) * .74);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(.70, "rgba(40,14,4,.26)");
    g.addColorStop(.88, "rgba(96,26,6,.58)");
    g.addColorStop(1, "rgba(12,4,2,.92)");
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.globalCompositeOperation = "screen";
    for (let i = 0; i < 70; i++){
      const side = Math.floor(Math.random() * 4);
      const t = Math.random();
      const x = side === 0 ? t * w : side === 1 ? w - Math.random() * 12 : side === 2 ? t * w : Math.random() * 12;
      const y = side === 0 ? Math.random() * 12 : side === 1 ? t * h : side === 2 ? h - Math.random() * 12 : t * h;
      const r = 1 + Math.random() * 2.6;
      const gg = c.createRadialGradient(x, y, 0, x, y, r * 3);
      gg.addColorStop(0, "rgba(255,196,96,.85)");
      gg.addColorStop(.45, "rgba(255,110,30,.45)");
      gg.addColorStop(1, "rgba(255,60,0,0)");
      c.fillStyle = gg;
      c.beginPath(); c.arc(x, y, r * 3, 0, Math.PI * 2); c.fill();
    }
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
      /* three, two, one. no preview of you — only the ring, the sweep and
         the number, the way a camera counts before it takes something. */
      const count = $("#count");
      for (const n of [3, 2, 1]) {
        if (!alive || root.classList.contains("skipped")) return;
        count.querySelector("b").textContent = String(n);
        count.classList.remove("beat");
        void count.offsetWidth;
        count.classList.add("beat");
        tick(n);
        sfx("drone", 1.7);
        await wait(1560);
      }
      count.classList.remove("beat");

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
      await wait(2400);           // the after-image drains away

      /* the bulb was the only light, and the flash killed it. what is left
         is the room, the printer, and the sheet coming out of it. */
      root.classList.add("burn");
      sfx("paper");
      await wait(900);
      const printer = $("#printer");
      printer.classList.add("on");
      sfx("drone", 7.5);
      await wait(1200);
      sfx("printer", 5.2);
      printer.classList.add("out");     // the sheet starts feeding
      await wait(3000);

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
    /* the skip key in the corner was printed but never wired: on a handset
       that dead button was the whole difference between "the film" and
       "the site is frozen". it now does what it says. */
    const sk = $("#introSkip");
    if (sk){
      sk.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); skip(); });
      setTimeout(() => { if (alive) sk.classList.add("show"); }, 3600);
    }
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
