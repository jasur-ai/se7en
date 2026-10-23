/* ═══════════════════════════════════════════════════════════════
   THE SCORE · the playlist, in order, with no player on the page.

   A single YouTube player is mounted off-screen the moment the
   visitor first touches the page (that click is the gesture the
   browser needs). It is started muted while the intro runs, then
   brought up at the moment the doors open. Nothing of the player,
   its chrome or its titles is ever in the layout; only its sound.
   If YouTube cannot be reached or refuses the embed, the site falls
   back to its own CC score and the dock comes back on its own.
   ═══════════════════════════════════════════════════════════════ */
const YTQ = (() => {
  const LIST = "PLS41qcbRSTzvdPNfdVcjf5Uy4kWNiuKIX";
  const VOL = 58;
  let player = null, ready = false, dead = false, kicked = false;
  let wantSound = false, vol = VOL, muted = false;

  const snd = () => (window.SND && typeof SND === "object") ? SND : null;

  function offscreen(){
    let host = document.getElementById("ytq");
    if (host) return host;
    host = document.createElement("div");
    host.id = "ytq";
    host.setAttribute("aria-hidden", "true");
    host.style.cssText = "position:fixed;left:-10000px;top:0;width:320px;height:180px;opacity:0;pointer-events:none;z-index:-1";
    const inner = document.createElement("div");
    inner.id = "ytqPlayer";
    host.appendChild(inner);
    document.body.appendChild(host);
    return host;
  }

  function loadApi(){
    if (window.YT && window.YT.Player) { build(); return; }
    if (document.getElementById("ytqApi")) return;
    const s = document.createElement("script");
    s.id = "ytqApi";
    s.src = "https://www.youtube.com/iframe_api";
    s.onerror = fail;
    document.head.appendChild(s);
    // the API calls this global when it is ready
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function(){ try { prev && prev(); } catch(e){} build(); };
    // if it never arrives, let the site's own score carry the night
    setTimeout(() => { if (!ready) fail(); }, 7000);
  }

  function build(){
    if (player || dead) return;
    offscreen();
    try {
      player = new window.YT.Player("ytqPlayer", {
        width: 320, height: 180,
        playerVars: {
          listType: "playlist", list: LIST, index: 0,
          controls: 0, disablekb: 1, modestbranding: 1, rel: 0,
          iv_load_policy: 3, fs: 0, playsinline: 1, loop: 0,
          origin: location.origin
        },
        events: {
          onReady: (e) => {
            ready = true;
            document.body.classList.add("yt");
            try { e.target.setVolume(0); } catch(err){}
            if (kicked) play();
            swapCredits();
          },
          onStateChange: (e) => {
            if (e.data === 1) {           // playing
              document.body.classList.add("yt-on");
              const S = snd();
              if (S && S.playing) { try { S.stop(); } catch(err){} }
            }
            if (e.data === 0) {           // track ended — keep the order going
              try { player.nextVideo(); } catch(err){}
            }
          },
          onError: fail
        }
      });
    } catch (e) { fail(); }
  }

  function play(){
    if (!player) return;
    try {
      player.playVideo();
      if (wantSound) { player.unMute(); player.setVolume(vol); }
      else { player.mute(); player.setVolume(0); }
    } catch (e) {}
  }

  function fadeTo(target, ms){
    if (!player) return;
    let from = 0;
    try { from = player.getVolume() || 0; } catch(e){}
    const t0 = performance.now();
    const step = () => {
      if (!player) return;
      const k = Math.min(1, (performance.now() - t0) / ms);
      const v = Math.round(from + (target - from) * k);
      try { player.setVolume(v); } catch(e){}
      if (k < 1) requestAnimationFrame(step);
    };
    step();
  }

  function fail(){
    if (dead) return;
    dead = true;
    ready = false;
    document.body.classList.remove("yt", "yt-on");
    const host = document.getElementById("ytq");
    if (host) host.remove();
    const S = snd();
    if (S && !S.playing) { try { S.start(); } catch(e){} }
  }

  function swapCredits(){
    const el = document.getElementById("musicCredits");
    if (!el || el.dataset.yt) return;
    el.dataset.yt = "1";
    el.innerHTML = '<p class="mc-note">Score · <a href="https://www.youtube.com/playlist?list=' + LIST +
      '" target="_blank" rel="noopener">the playlist</a> plays in order. Every track remains the property of its owner — nothing is copied, re-hosted or altered.</p>';
  }

  function kick(){
    if (kicked || dead) return;
    kicked = true;
    loadApi();
  }

  // the first touch is the gesture the browser insists on
  document.addEventListener("pointerdown", kick, { once: true, passive: true });
  document.addEventListener("keydown", kick, { once: true });

  // the player's own controls are never on the page; take the ones we have
  document.addEventListener("click", (e) => {
    if (!ready) return;
    const t = e.target.closest && e.target.closest("#playBtn,#sndBtn");
    if (!t) return;
    e.preventDefault(); e.stopPropagation();
    muted = !muted;
    try { muted ? player.mute() : player.unMute(); } catch(err){}
    document.body.classList.toggle("yt-muted", muted);
  }, true);

  document.addEventListener("click", (e) => {
    if (!ready) return;
    const t = e.target.closest && e.target.closest("#nextBtn,#prevBtn");
    if (!t) return;
    e.preventDefault(); e.stopPropagation();
    try { t.id === "nextBtn" ? player.nextVideo() : player.previousVideo(); } catch(err){}
  }, true);

  document.addEventListener("input", (e) => {
    if (!ready || e.target.id !== "vol") return;
    e.stopPropagation();
    vol = Number(e.target.value);
    try { player.setVolume(muted ? 0 : vol); } catch(err){}
  }, true);

  return {
    ready: () => ready,
    available: () => !dead,
    /* the score comes up as the doors open */
    start(){
      wantSound = true;
      muted = false;
      if (!ready) { kick(); return; }
      try { player.unMute(); } catch(e){}
      play();
      fadeTo(Math.max(1, vol), 2200);
      document.body.classList.remove("yt-muted");
    },
    next(){ try { player && player.nextVideo(); } catch(e){} },
    prev(){ try { player && player.previousVideo(); } catch(e){} },
    setVol(v){ vol = v; try { player && player.setVolume(v); } catch(e){} }
  };
})();
try { window.YTQ = YTQ; } catch(e){}
