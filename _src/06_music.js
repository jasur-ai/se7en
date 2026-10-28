/* ═══════════════════════════════════════════════════════════════
   SCORE · the dossier plays itself.
   Files are self-hosted, licensed for reuse, and credited in the
   footer. Nothing is streamed from a player that shows its own ads,
   its own chrome, or its own recommendations — this is a score, not
   a video. Two <audio> elements are crossfaded so the bed never stops.
   ═══════════════════════════════════════════════════════════════ */
const TRACKS = [
  { id:"deep", file:"assets/audio/deep.mp3", dur:269,
    title:"Deep", artist:"Alex-Productions", lic:"CC BY 3.0",
    src:"https://commons.wikimedia.org/wiki/File:Alex-Productions_-_Deep_(Dark_Ambient_Background_music).oga" },
  { id:"zero-point", file:"assets/audio/zero-point.mp3", dur:319,
    title:"Zero Point", artist:"Dreamstate Logic", lic:"CC BY 3.0",
    src:"https://commons.wikimedia.org/wiki/File:Dreamstate_Logic_-_Zero_Point_(space_ambient,_dark_ambient).ogg" },
  { id:"freezing-fog", file:"assets/audio/freezing-fog.mp3", dur:482,
    title:"Lost in the Freezing Fog", artist:"Fingers In The Noise", lic:"CC BY 3.0",
    src:"https://commons.wikimedia.org/wiki/File:Fingers_In_The_Noise_-_Lost_in_the_Freezing_Fog.ogg" },
  { id:"alien-atmosphere", file:"assets/audio/alien-atmosphere.mp3", dur:124,
    title:"Alien Spaceship Atmosphere", artist:"Kevin MacLeod", lic:"CC0",
    src:"https://commons.wikimedia.org/wiki/File:Kevin_MacLeod_-_Alien_Spaceship_Atmosphere_(cc0).ogg" }
];

const SND = {
  tracks: TRACKS,
  i: 0, playing: false, mode: "idle", vol: Number(store.get("vol", 42)) / 100,
  els: [], cur: 0, _fade: null, _swap: null, _booted: false, ready: false,

  track(){ return TRACKS[this.i]; },

  _mk(file, idx){
    const a = document.createElement("audio");
    a.src = file; a.loop = false; a.preload = "none"; a.volume = 0;
    a.setAttribute("playsinline", "");
    a.dataset.idx = idx;
    a.addEventListener("timeupdate", () => { if (a === this._active) this._watch(a); });
    a.addEventListener("ended", () => { if (a === this._active) this.next(1); });
    a.addEventListener("error", () => { if (a === this._active) this.next(1); });
    this.els.push(a);
    return a;
  },

  boot(){
    if (this._booted) return;
    this._booted = true;
    this._mk(TRACKS[0].file, 0);
    this._mk(TRACKS[0].file, 0);
    this._active = this.els[0];
    this._idle = this.els[1];
    this._active.dataset.tid = TRACKS[0].id;
  },

  _target(){ return Math.pow(this.vol, 1.15) * 0.9; },

  _ramp(a, to, ms){
    const from = a.volume, t0 = performance.now();
    return new Promise(res => {
      const step = () => {
        const k = Math.min(1, (performance.now() - t0) / ms);
        const e = k * k * (3 - 2 * k);
        try { a.volume = from + (to - from) * e; } catch(e) {}
        if (k < 1) requestAnimationFrame(step); else res();
      };
      requestAnimationFrame(step);
    });
  },

  async start(){
    this.boot();
    if (this.playing) return;
    const a = this._active;
    if (a.dataset.tid !== this.track().id) {
      a.src = this.track().file;
      a.dataset.tid = this.track().id;
    }
    if (a.readyState === 0) a.load();
    try { await a.play(); }
    catch(e){ this.playing = false; this.ui(false); return; }
    this.playing = true; this.mode = "file";
    this._ramp(a, this._target(), 2600);
    this.ui(true);
  },

  async stop(){
    if (!this._booted) return;
    this.playing = false;
    this.ui(false);
    const a = this._active;
    await this._ramp(a, 0, 900);
    if (!this.playing) { try { a.pause(); } catch(e) {} }
  },

  toggle(){ this.playing ? this.stop() : this.start(); },

  async next(dir){
    if (!this._booted) return;
    const n = TRACKS.length;
    const wasPlaying = this.playing;
    this.i = (this.i + (dir || 1) + n) % n;
    const pair = [this._active, this._idle];
    const out = pair[0], inc = pair[1];
    const wasVol = out.volume;

    inc.src = this.track().file;
    inc.dataset.tid = this.track().id;
    inc.currentTime = 0;
    inc.volume = 0;
    inc.load();

    this._active = inc; this._idle = out;
    if (!wasPlaying) { this.ui(false); return; }
    try { await inc.play(); } catch(e) { return; }
    this.ui(true);
    const t0 = performance.now(), ms = 2400;
    await new Promise(res => {
      const step = () => {
        const k = Math.min(1, (performance.now() - t0) / ms);
        const e = k * k * (3 - 2 * k);
        try {
          inc.volume = this._target() * e;
          out.volume = wasVol * (1 - e);
        } catch(err) {}
        if (k < 1) requestAnimationFrame(step); else res();
      };
      requestAnimationFrame(step);
    });
    try { out.pause(); } catch(e) {}
  },

  _watch(a){
    if (!a.duration || !isFinite(a.duration)) return;
    const left = a.duration - a.currentTime;
    if (left < 9 && !this._swap) {
      this._swap = setTimeout(() => { this._swap = null; }, 12000);
      this.next(1);
    }
  },

  setVol(v){
    this.vol = Math.max(0, Math.min(1, v));
    store.set("vol", Math.round(this.vol * 100));
    if (this._active && this.playing) {
      clearTimeout(this._fade);
      this._fade = setTimeout(() => this._ramp(this._active, this._target(), 350), 40);
    }
  },

  /* the score does not transpose per sin — kept so callers stay valid */
  setRoot(){},
  sinkTrack(){},

  ui(on){
    const p1 = $("#icoPlay"), p2 = $("#icoPause"), eq = $("#eq");
    if (p1) p1.style.display = on ? "none" : "block";
    if (p2) p2.style.display = on ? "block" : "none";
    if (eq) eq.classList.toggle("live", !!on);
    const sb = $("#sndBtn");
    if (sb) { sb.classList.toggle("on", !!on); sb.setAttribute("aria-pressed", on ? "true" : "false"); }
    const title = $("#dockTitle"), sub = $("#dockSub");
    if (!title) return;
    const t0 = this.track();
    title.textContent = "“" + t0.title + "” — " + t0.artist;
    sub.textContent = on
      ? (t("dock.playing") + " · " + t0.lic)
      : t("dock.paused");
    const link = $("#dockCredit");
    if (link) link.href = t0.src;
  },

  credits(){
    const host = $("#musicCredits");
    if (!host) return;
    host.innerHTML = '<h4>Score · the bed under the dossier</h4>'
      + '<p class="mc-note">Four ambient recordings, self-hosted, crossfaded, no player chrome. '
      + 'Each is licensed for reuse and credited to its author; the licence travels with the file.</p>'
      + '<ol>' + TRACKS.map(x =>
          '<li><a href="' + x.src + '" target="_blank" rel="noopener">“' + esc(x.title) + '”</a>'
          + ' — ' + esc(x.artist) + ' <span>' + esc(x.lic) + '</span></li>').join("")
      + '</ol>';
  }
};

/* exposed for the build harness */
try{ window.SND = SND; }catch(e){}
