/* ═══════════════════════════════════════════════════════════════
   DEPTH · a real 3D field behind the dossier.
   Two passes on one canvas: a volumetric fog plate (fbm, tinted
   soot/rust/mould) and a few hundred dust motes in perspective
   space. The camera drifts with the pointer and dollies with the
   scroll, so the field has actual parallax instead of a looped
   background image. Falls back silently to the CSS gradient.
   ═══════════════════════════════════════════════════════════════ */
const DEPTH = (() => {
  const canvas = document.getElementById("depth");
  if (!canvas) return null;
  let gl = null;
  try {
    gl = canvas.getContext("webgl", { antialias:false, alpha:false, depth:false, powerPreference:"low-power" });
  } catch(e) { gl = null; }
  if (!gl) { canvas.style.display = "none"; return null; }

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const V2 = (s, t) => { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(sh)); return null; } return sh; };
  const prog = (vs, fs) => {
    const p = gl.createProgram();
    const a = V2(vs, gl.VERTEX_SHADER), b = V2(fs, gl.FRAGMENT_SHADER);
    if (!a || !b) return null;
    gl.attachShader(p, a); gl.attachShader(p, b); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(p)); return null; }
    return p;
  };

  /* ── pass 1 · fog plate ─────────────────────────────────────── */
  const fogVS = `
    attribute vec2 aPos;
    void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;
  const fogFS = `
    precision mediump float;
    uniform vec2 uRes; uniform float uTime; uniform vec2 uCam;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p){ float v = 0.0, a = 0.55; for (int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
    void main(){
      vec2 uv = gl_FragCoord.xy / uRes;
      vec2 q = uv * vec2(uRes.x / uRes.y, 1.0);
      float t = uTime * 0.021;
      vec2 drift = uCam * 0.16;
      float f1 = fbm(q * 2.1 + vec2(t, -t * 0.55) + drift);
      float f2 = fbm(q * 4.6 - vec2(t * 0.7, t * 0.28) + drift * 1.8);
      vec3 col = vec3(0.021, 0.017, 0.019);
      col += vec3(0.34, 0.055, 0.040) * pow(f1, 2.6) * 0.62;
      col += vec3(0.085, 0.095, 0.065) * pow(f2, 3.1) * 0.34;
      float shaft = exp(-pow((uv.x - 0.5 + uCam.x * 0.10) * 3.2, 2.0)) * smoothstep(0.0, 0.62, uv.y);
      col += vec3(0.20, 0.155, 0.105) * shaft * 0.30;
      float vig = smoothstep(1.30, 0.22, length(uv - 0.5) * 1.62);
      gl_FragColor = vec4(col * vig, 1.0);
    }`;

  /* ── pass 2 · dust in perspective ───────────────────────────── */
  const dustVS = `
    attribute vec3 aPos;
    attribute vec2 aSeed;   /* x: phase, y: kind 0..1 */
    attribute float aSize;
    uniform mat4 uProj;
    uniform vec3 uCam;      /* yaw, pitch, dolly */
    uniform float uTime;
    uniform float uDpr;
    varying float vFade; varying float vKind;
    void main(){
      vec3 p = aPos;
      p.y = mod(p.y + uTime * (0.055 + aSeed.y * 0.05) + aSeed.x * 9.0, 9.0) - 4.5;
      p.x += sin(uTime * 0.13 + aSeed.x * 6.283) * (0.10 + aSeed.y * 0.20);
      p.z += cos(uTime * 0.11 + aSeed.x * 5.1) * 0.14;

      float cy = cos(uCam.x), sy = sin(uCam.x);
      p = vec3(p.x * cy - p.z * sy, p.y, p.x * sy + p.z * cy);
      float cx = cos(uCam.y), sx = sin(uCam.y);
      p = vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
      p.z -= uCam.z;

      gl_Position = uProj * vec4(p, 1.0);
      float depth = clamp(-p.z, 0.9, 14.0);
      gl_PointSize = clamp(aSize * uDpr * (9.5 / depth), 0.55, 4.2);
      vFade = smoothstep(1.0, 3.4, depth) * (1.0 - smoothstep(8.0, 13.2, depth));
      vKind = aSeed.y;
    }`;
  const dustFS = `
    precision mediump float;
    varying float vFade; varying float vKind;
    void main(){
      vec2 d = gl_PointCoord - 0.5;
      float r = length(d);
      float a = smoothstep(0.5, 0.03, r);
      a *= a;
      vec3 ash = vec3(0.88, 0.80, 0.64);
      vec3 ember = vec3(0.78, 0.17, 0.11);
      vec3 col = mix(ash, ember, smoothstep(0.82, 1.0, vKind));
      gl_FragColor = vec4(col, a * vFade * (0.10 + vKind * 0.30));
    }`;

  const pFog = prog(fogVS, fogFS);
  const pDust = prog(dustVS, dustFS);
  if (!pFog || !pDust) { canvas.style.display = "none"; return null; }

  /* fog quad */
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const aFogPos = gl.getAttribLocation(pFog, "aPos");
  const uFogRes = gl.getUniformLocation(pFog, "uRes");
  const uFogTime = gl.getUniformLocation(pFog, "uTime");
  const uFogCam = gl.getUniformLocation(pFog, "uCam");

  /* dust cloud */
  const N = matchMedia("(max-width: 820px)").matches ? 420 : 900;
  const pos = new Float32Array(N * 3), seed = new Float32Array(N * 2), size = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 9.5;
    pos[i*3+1] = (Math.random() - 0.5) * 9.0;
    pos[i*3+2] = -Math.random() * 12.5 + 1.2;
    const ph = Math.random();
    seed[i*2] = ph;
    seed[i*2+1] = Math.random() < 0.07 ? (0.85 + Math.random() * 0.15) : Math.random() * 0.35;
    size[i] = 0.5 + Math.random() * 1.7;
  }
  const bPos = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bPos); gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
  const bSeed = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bSeed); gl.bufferData(gl.ARRAY_BUFFER, seed, gl.STATIC_DRAW);
  const bSize = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bSize); gl.bufferData(gl.ARRAY_BUFFER, size, gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(pDust, "aPos");
  const aSeed = gl.getAttribLocation(pDust, "aSeed");
  const aSize = gl.getAttribLocation(pDust, "aSize");
  const uProj = gl.getUniformLocation(pDust, "uProj");
  const uCam = gl.getUniformLocation(pDust, "uCam");
  const uTime = gl.getUniformLocation(pDust, "uTime");
  const uDpr = gl.getUniformLocation(pDust, "uDpr");

  /* The plate is a soft fog and soft motes; it is composited behind
     everything and slightly translucent. Rendering it at a third of the
     screen and letting the compositor scale it is free, and it is the
     difference between a 4 fps page and a 60 fps one. */
  let W = 0, H = 0, dpr = 1, scale = 0.36;
  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cap = 980;                             // never more than this wide
    const w = Math.min(innerWidth, cap) * scale * dpr;
    W = Math.max(320, Math.round(w));
    H = Math.max(200, Math.round(W * innerHeight / innerWidth));
    canvas.width = W; canvas.height = H;
    canvas.style.imageRendering = "auto";
    gl.viewport(0, 0, W, H);
  }
  resize();
  addEventListener("resize", resize, { passive: true });

  /* camera state, damped */
  const cam = { x: 0, y: 0, z: 0 }, camT = { x: 0, y: 0, z: 0 };
  addEventListener("pointermove", e => {
    camT.x = (e.clientX / innerWidth - 0.5) * 0.26;
    camT.y = (e.clientY / innerHeight - 0.5) * 0.16;
  }, { passive: true });
  addEventListener("scroll", () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    camT.z = (scrollY / max) * 6.4;
  }, { passive: true });

  function proj(fovy, aspect, near, far){
    const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, 2 * far * near * nf, 0
    ]);
  }

  const start = performance.now();
  let raf = 0, alive = true, last = 0, acc = 0, frames = 0, slow = 0;
  const FOG_HZ = 1 / 11;                         // 11 redraws a second is plenty
  let dustAt = -1;
  let fogAt = -1;

  function frame(now){
    if (!alive && !reduce) return;
    const t = (now - start) / 1000;
    cam.x += (camT.x - cam.x) * 0.045;
    cam.y += (camT.y - cam.y) * 0.045;
    cam.z += (camT.z - cam.z) * 0.055;

    const aspect = W / H;
    gl.disable(gl.BLEND);

    if (t - fogAt > FOG_HZ){
      fogAt = t;
      gl.useProgram(pFog);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(aFogPos);
      gl.vertexAttribPointer(aFogPos, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(uFogRes, W, H);
      gl.uniform1f(uFogTime, t);
      gl.uniform2f(uFogCam, cam.x, cam.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    if (t - dustAt < 1 / 30) { last = now; return; }
    dustAt = t;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.useProgram(pDust);
    gl.uniformMatrix4fv(uProj, false, proj(55 * Math.PI / 180, aspect, 0.1, 60));
    gl.uniform3f(uCam, cam.x, cam.y, cam.z);
    gl.uniform1f(uTime, t);
    gl.uniform1f(uDpr, dpr);

    gl.bindBuffer(gl.ARRAY_BUFFER, bPos); gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bSeed); gl.enableVertexAttribArray(aSeed);
    gl.vertexAttribPointer(aSeed, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bSize); gl.enableVertexAttribArray(aSize);
    gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, N);

    /* adaptive: if this machine is struggling, drop the plate resolution
       once and leave it there — no endless oscillation */
    if (last) {
      const dt = now - last;
      acc += dt; frames++;
      if (acc > 1400) {
        const fps = frames / (acc / 1000);
        if (fps < 40) { slow++; }
        else slow = 0;
        if (slow >= 2 && scale > 0.2) { scale *= 0.6; slow = 0; resize(); }
        acc = 0; frames = 0;
      }
    }
    last = now;
  }

  /* ── the honesty test ─────────────────────────────────────────
     Some machines (old laptops, software GL, a phone in a background
     tab) cannot composite a live WebGL plate without dragging the whole
     page under 30 fps. Rather than guess from the user agent, the first
     second of real frames is measured: if the page cannot hold ~45 fps,
     the plate is put away and a painted CSS fog takes its place. The
     dossier stays fast, and nobody has to know. */
  let probeT = 0, probeN = 0, probed = false;
  function probe(now){
    if (probed) return;
    if (!probeT){ probeT = now; return; }
    probeN++;
    const dt = now - probeT;
    if (dt < 1400) return;
    probed = true;
    const fps = probeN / (dt / 1000);
    if (fps < 45) {
      alive = false;
      cancelAnimationFrame(raf);
      canvas.style.display = "none";
      document.body.classList.add("no-depth");
      console.info("[depth] plate off — measured " + fps.toFixed(0) + " fps");
    }
  }

  function tick(now){
    if (!alive) return;
    probe(now);
    frame(now);
    raf = requestAnimationFrame(tick);
  }

  if (reduce) { alive = false; frame(start); }
  else raf = requestAnimationFrame(tick);

  /* stop burning frames when the tab is hidden */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { alive = false; cancelAnimationFrame(raf); }
    else if (!reduce && !(probed && document.body.classList.contains("no-depth"))) {
      alive = true;
      raf = requestAnimationFrame(tick);
    }
  });

  /* the intro owns the screen; nothing behind it needs a single frame */
  return {
    cam,
    pause(){ if (!alive) return; alive = false; cancelAnimationFrame(raf); },
    resume(){ if (alive || reduce || (probed && document.body.classList.contains("no-depth"))) return;
              alive = true; last = 0; raf = requestAnimationFrame(tick); }
  };
})();
