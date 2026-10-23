/* ═══════════════════════════════════════════════════════════════
   SFX · the door is broken, and it knows you are standing there.
   Everything here is synthesised in the Web Audio API: no sample
   files, nothing to license, nothing to download. The creak is a
   stick-slip model — hundreds of tiny filtered noise grains whose
   density and pitch wander — layered over a sub-moan and a metal
   clank, mixed through a convolution room and a compressor so it
   sounds like a door in a building, not like a browser beep.
   ═══════════════════════════════════════════════════════════════ */
const SFX = (() => {
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null, bus = null;

  /* slightly pink noise — white noise alone reads as "hiss" */
  function mkNoise(c, dur){
    const n = Math.ceil(c.sampleRate * dur);
    const b = c.createBuffer(2, n, c.sampleRate);
    for (let ch = 0; ch < 2; ch++){
      const d = b.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < n; i++){
        const w = Math.random() * 2 - 1;
        last = (last + 0.022 * w) / 1.022;
        d[i] = last * 3.2 + w * 0.22;
      }
    }
    return b;
  }

  /* a small stone room, so the creak has somewhere to go */
  function mkIR(c, dur, decay){
    dur = dur || 2.6; decay = decay || 3.1;
    const n = Math.ceil(c.sampleRate * dur);
    const b = c.createBuffer(2, n, c.sampleRate);
    for (let ch = 0; ch < 2; ch++){
      const d = b.getChannelData(ch);
      for (let i = 0; i < n; i++){
        const t = i / n;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay) * (1 - Math.exp(-i / 200));
      }
    }
    return b;
  }

  function graph(c, dest){
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -15; comp.knee.value = 9; comp.ratio.value = 5.5;
    comp.attack.value = 0.003; comp.release.value = 0.28;
    comp.connect(dest);
    const out = c.createGain(); out.gain.value = 0.9; out.connect(comp);
    const rev = c.createConvolver(); rev.buffer = mkIR(c);
    const revOut = c.createGain(); revOut.gain.value = 0.36;
    rev.connect(revOut); revOut.connect(out);
    return { c, out, rev, noise: mkNoise(c, 2.6) };
  }

  const pan = (g, node, v) => {
    if (!g.c.createStereoPanner) { node.connect(g.out); node.connect(g.rev); return; }
    const p = g.c.createStereoPanner(); p.pan.value = v;
    node.connect(p); p.connect(g.out); p.connect(g.rev);
  };

  /* ── the hinge: stick-slip grains under a sweeping resonance ── */
  function creak(g, t, dur, f0, f1, amp){
    const c = g.c;
    const src = c.createBufferSource();
    src.buffer = g.noise; src.loop = true;
    src.playbackRate.value = 1 + (Math.random() - 0.5) * 0.06;
    const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 17;
    const shine = c.createBiquadFilter(); shine.type = "peaking";
    shine.frequency.value = 2100; shine.Q.value = 1.1; shine.gain.value = 9;
    const gn = c.createGain(); gn.gain.value = 0.0001;

    src.connect(bp); bp.connect(shine); shine.connect(gn);
    pan(g, gn, (Math.random() - 0.5) * 0.34);

    const steps = Math.max(10, Math.round(dur * 36));
    let tt = t;
    for (let i = 0; i < steps; i++){
      const k = i / steps;
      const shape = Math.sin(Math.PI * Math.min(1, k * 1.12)) * 0.6 + 0.4;
      const a = (0.035 + Math.random() * 0.30) * amp * shape;
      const step = (dur / steps) * (0.55 + Math.random() * 1.0);
      gn.gain.setValueAtTime(0.0001, tt);
      gn.gain.linearRampToValueAtTime(a, tt + step * 0.26);
      gn.gain.exponentialRampToValueAtTime(0.0008, tt + step * 0.9);
      tt += step;
      if (tt > t + dur) break;
    }
    bp.frequency.setValueAtTime(f0 * (0.94 + Math.random() * 0.12), t);
    bp.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.58);
    bp.frequency.exponentialRampToValueAtTime(f0 * 1.2, t + dur);
    src.start(t); src.stop(t + dur + 0.25);
  }

  /* ── the weight behind the door: two detuned saws, low pass ── */
  function groan(g, t, dur, f0, f1, amp){
    const c = g.c, lp = c.createBiquadFilter(), gn = c.createGain();
    lp.type = "lowpass"; lp.Q.value = 7; gn.gain.value = 0;
    const a = c.createOscillator(), b = c.createOscillator(), sub = c.createOscillator();
    a.type = "sawtooth"; b.type = "sawtooth"; sub.type = "sine";
    a.frequency.value = f0 * 1.16; b.frequency.value = f0 * 1.171;
    sub.frequency.value = f0 * 0.5;
    a.connect(lp); b.connect(lp); sub.connect(lp);
    lp.connect(gn); pan(g, gn, 0);
    a.frequency.exponentialRampToValueAtTime(f0 * 0.93, t + dur);
    b.frequency.exponentialRampToValueAtTime(f0 * 0.9, t + dur);
    sub.frequency.exponentialRampToValueAtTime(f1 * 0.5, t + dur);
    lp.frequency.setValueAtTime(250, t);
    lp.frequency.linearRampToValueAtTime(760, t + dur * 0.32);
    lp.frequency.linearRampToValueAtTime(210, t + dur);
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.linearRampToValueAtTime(amp * 0.6, t + dur * 0.22);
    gn.gain.linearRampToValueAtTime(amp * 0.26, t + dur * 0.68);
    gn.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    [a, b, sub].forEach(o => { o.start(t); o.stop(t + dur + 0.1); });
  }

  /* ── the floor takes the weight ── */
  function boom(g, t, amp){
    const c = g.c;
    const o = c.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(148, t);
    o.frequency.exponentialRampToValueAtTime(33, t + 1.05);
    const gn = c.createGain();
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.linearRampToValueAtTime(amp, t + 0.012);
    gn.gain.exponentialRampToValueAtTime(0.0008, t + 1.5);
    o.connect(gn); pan(g, gn, 0);
    o.start(t); o.stop(t + 1.65);

    const s = c.createBufferSource(); s.buffer = g.noise;
    const lp = c.createBiquadFilter(); lp.type = "lowpass";
    lp.frequency.setValueAtTime(760, t);
    lp.frequency.exponentialRampToValueAtTime(110, t + 0.6);
    const ng = c.createGain();
    ng.gain.setValueAtTime(amp * 0.5, t);
    ng.gain.exponentialRampToValueAtTime(0.0005, t + 0.55);
    s.connect(lp); lp.connect(ng); pan(g, ng, 0);
    s.start(t); s.stop(t + 0.7);
  }

  /* ── iron: bolt, hasp, chain ── */
  function clank(g, t, amp){
    const c = g.c;
    [1780, 2410, 3160].forEach((f, i) => {
      const o = c.createOscillator(); o.type = "triangle";
      o.frequency.value = f * (1 + (Math.random() - 0.5) * 0.012);
      const gn = c.createGain();
      gn.gain.setValueAtTime(amp / (i + 1.5), t + i * 0.004);
      gn.gain.exponentialRampToValueAtTime(0.0005, t + 0.5 + i * 0.05);
      o.connect(gn); pan(g, gn, (i - 1) * 0.22);
      o.start(t); o.stop(t + 0.62);
    });
    const s = c.createBufferSource(); s.buffer = g.noise;
    const bp = c.createBiquadFilter(); bp.type = "bandpass";
    bp.frequency.value = 2500; bp.Q.value = 5;
    const ng = c.createGain();
    ng.gain.setValueAtTime(amp * 0.75, t);
    ng.gain.exponentialRampToValueAtTime(0.0005, t + 0.13);
    s.connect(bp); bp.connect(ng); pan(g, ng, 0.1);
    s.start(t); s.stop(t + 0.2);
  }

  /* ── dry timber giving up ── */
  function crack(g, t, amp){
    const c = g.c;
    const hits = 4 + Math.round(Math.random() * 3);
    for (let i = 0; i < hits; i++){
      const t0 = t + i * (0.014 + Math.random() * 0.05);
      const s = c.createBufferSource(); s.buffer = g.noise;
      const bp = c.createBiquadFilter(); bp.type = "bandpass";
      bp.frequency.value = 1100 + Math.random() * 2700; bp.Q.value = 1.3;
      const gn = c.createGain();
      gn.gain.setValueAtTime(0.0001, t0);
      gn.gain.linearRampToValueAtTime(amp * (0.3 + Math.random() * 0.6), t0 + 0.004);
      gn.gain.exponentialRampToValueAtTime(0.0005, t0 + 0.06 + Math.random() * 0.09);
      s.connect(bp); bp.connect(gn); pan(g, gn, (Math.random() - 0.5) * 0.6);
      s.start(t0); s.stop(t0 + 0.16);
    }
  }

  /* ── breath at the back of the room, just under the threshold ── */
  function whisper(g, t, dur, amp){
    const c = g.c;
    const s = c.createBufferSource(); s.buffer = g.noise; s.loop = true;
    const f1 = c.createBiquadFilter(); f1.type = "bandpass"; f1.frequency.value = 720; f1.Q.value = 2.4;
    const f2 = c.createBiquadFilter(); f2.type = "bandpass"; f2.frequency.value = 1180; f2.Q.value = 3.1;
    const gn = c.createGain(); gn.gain.value = 0.0001;
    const lfo = c.createOscillator(); lfo.frequency.value = 5.4;
    const lfoG = c.createGain(); lfoG.gain.value = 0.5;
    lfo.connect(lfoG); lfoG.connect(gn.gain);
    s.connect(f1); s.connect(f2); f1.connect(gn); f2.connect(gn);
    pan(g, gn, -0.35);
    f1.frequency.linearRampToValueAtTime(520, t + dur);
    f2.frequency.linearRampToValueAtTime(940, t + dur);
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.linearRampToValueAtTime(amp, t + dur * 0.35);
    gn.gain.linearRampToValueAtTime(amp * 0.4, t + dur * 0.75);
    gn.gain.exponentialRampToValueAtTime(0.0005, t + dur);
    s.start(t); s.stop(t + dur + 0.1);
    lfo.start(t); lfo.stop(t + dur + 0.1);
  }

  /* ── the whole entrance, timed against the door keyframes ── */
  function sequence(g, t0){
    clank(g, t0 + 0.00, 0.55);      // hasp lifts
    clank(g, t0 + 0.085, 0.34);     // second bolt
    boom(g,  t0 + 0.11, 0.5);
    groan(g, t0 + 0.16, 2.3, 71, 47, 0.5);
    creak(g, t0 + 0.30, 0.95, 360, 960, 0.85);
    crack(g, t0 + 0.70, 0.5);
    boom(g,  t0 + 1.22, 0.9);       // the jolt
    creak(g, t0 + 1.27, 1.05, 520, 1420, 1.0);
    crack(g, t0 + 1.60, 0.45);
    creak(g, t0 + 1.93, 0.55, 300, 720, 0.55);
    boom(g,  t0 + 2.16, 1.0);       // it stands open
    whisper(g, t0 + 2.05, 1.9, 0.12);
    return 4.4;
  }

  return {
    ensure(){
      if (!AC) return null;
      if (!ctx){ ctx = new AC(); bus = graph(ctx, ctx.destination); }
      if (ctx.state === "suspended") { try { ctx.resume(); } catch (e) {} }
      return ctx;
    },
    /* the room opens */
    enter(){
      const c = this.ensure();
      if (!c || !bus) return;
      sequence(bus, c.currentTime + 0.02);
    },
    /* a smaller, softer version for the drawer and the dock */
    tap(weight){
      const c = this.ensure();
      if (!c || !bus) return;
      const t = c.currentTime + 0.01;
      if (weight === "heavy") { boom(bus, t, 0.28); whisper(bus, t + 0.02, 0.7, 0.05); }
      else clank(bus, t, 0.12);
    },
    /* QA hook: render the same sequence offline and report levels */
    probe(seconds){
      seconds = seconds || 5;
      const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!OC || !AC) return Promise.resolve(null);
      const oc = new OC(2, Math.ceil(44100 * seconds), 44100);
      const g = graph(oc, oc.destination);
      sequence(g, 0.02);
      return oc.startRendering().then(buf => {
        let peak = 0, sum = 0, n = 0;
        for (let ch = 0; ch < buf.numberOfChannels; ch++){
          const d = buf.getChannelData(ch);
          for (let i = 0; i < d.length; i++){
            const v = Math.abs(d[i]);
            if (v > peak) peak = v;
            sum += v * v; n++;
          }
        }
        return { peak: +peak.toFixed(3), rms: +Math.sqrt(sum / n).toFixed(4), seconds: buf.duration };
      });
    }
  };
})();
try { window.SFX = SFX; } catch (e) {}
