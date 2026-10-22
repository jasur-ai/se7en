/* ═══════════════════════════════════════════════════════════════
   RADIO · the official track, played from the rights holders' channel
   Vessel — "Red Sex" (Punish, Honey, 2014 · Tri Angle Records / Mute)
   Nothing is downloaded, ripped or re-hosted. The YouTube embed streams
   the official upload, so the copyright, the ads and the credit stay
   exactly where they belong: with the label and the artist.
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const TRACKS = [
    { id:"rTSh2gnrbD4", t:"Red Sex", s:"Vessel · Punish, Honey (2014)",
      label:"Tri Angle Records", kind:"official audio",
      href:"https://www.youtube.com/watch?v=rTSh2gnrbD4" },
    { id:"A4eB0B-FGOg", t:"Red Sex (Re-Strung)", s:"Vessel feat. Rakhi Singh · Paplu (2020)",
      label:"Vessel / Paplu", kind:"official audio",
      href:"https://www.youtube.com/watch?v=A4eB0B-FGOg" },
    { id:"8iPoS9zqmoQ", t:"Red Sex", s:"Vessel · film by Harry Wright (2014)",
      label:"Tri Angle Records", kind:"official video · 18+",
      href:"https://www.youtube.com/watch?v=8iPoS9zqmoQ" }
  ];

  const TXT = {
    en:{ play:"Play", pause:"Pause", chip:"Music", blocked:"Player blocked on this host" },
    uz:{ play:"Ijro", pause:"To‘xtat", chip:"Musiqa", blocked:"Bu manzilda pleer bloklangan" },
    ru:{ play:"Играть", pause:"Пауза", chip:"Музыка", blocked:"Плеер заблокирован здесь" }
  };
  const lang = () => document.documentElement.getAttribute("data-lang") || "en";
  const T = () => TXT[lang()] || TXT.en;

  const R = {
    idx:0, player:null, ready:false, failed:false, mounted:false, playing:false,
    wanted:false, opened:false, vol:80, el:null,

    tracks(){ return TRACKS; },

    build(){
      if(this.mounted) return;
      this.mounted = true;
      const wrap = document.createElement("div");
      wrap.id = "radio";
      wrap.innerHTML =
        '<div class="frame" id="rFrame"><div id="ytHost"></div>'
        +  '<div class="plate" id="rPlate"><span id="rPlateTxt"></span></div></div>'
        + '<div class="meta">'
        +   '<button class="play" data-a="play" id="rPlay" aria-pressed="false">'
        +     '<i class="dot"></i><span id="rPlayTxt"></span></button>'
        +   '<div class="id"><b id="rTitle"></b><span id="rSub"></span></div>'
        +   '<button class="tog" data-a="expand" id="rExp" aria-label="Show player">▾</button>'
        + '</div>';
      document.body.appendChild(wrap);
      this.el = wrap;

      wrap.querySelector("#rPlay").addEventListener("click", e=>{ e.stopPropagation(); this.toggle(); });
      wrap.querySelector("#rExp").addEventListener("click", e=>{ e.stopPropagation(); this.expand(); });
      wrap.querySelector("#rPlate").addEventListener("click", ()=>this.expand());

      this.paint();
    },

    paint(){
      const t = TRACKS[this.idx];
      this.el.querySelector("#rTitle").textContent = t.t;
      this.el.querySelector("#rSub").innerHTML =
        t.s + ' · <a href="' + t.href + '" target="_blank" rel="noopener">' + t.label + '</a>';
      this.el.querySelector("#rPlayTxt").textContent = this.playing ? T().pause : T().play;
      this.el.querySelector("#rPlay").setAttribute("aria-pressed", this.playing ? "true":"false");
      this.el.querySelector("#rPlateTxt").innerHTML =
        '<b>' + t.t + '</b><br>' + t.kind + ' · ' + t.label
        + '<br><br><span style="opacity:.6">source: youtube.com ↗</span>';
    },

    expand(){
      this.opened = true;
      this.el.classList.add("expanded");
      if(!this.player && !this.failed) this.load();
    },

    load(){
      const self = this;
      const boot = () => {
        try{
          self.player = new YT.Player("ytHost", {
            videoId: TRACKS[self.idx].id,
            playerVars:{ autoplay:0, controls:1, rel:0, modestbranding:1, playsinline:1 },
            events:{
              onReady(){
                self.ready = true; self.failed = false;
                self.el.classList.add("ready");
                try{ self.player.setVolume(self.vol); }catch(e){}
                if(self.wanted) self.play();
                self.paint();
              },
              onStateChange(ev){
                self.playing = (ev.data === 1);
                self.el.classList.toggle("playing", self.playing);
                self.paint();
                if(window.SND && self.playing && SND.stop){ try{ SND.stop(); }catch(e){} }
              },
              onError(){ self.dead(); }
            }
          });
        }catch(e){ self.dead(); }
      };

      if(window.YT && YT.Player){ boot(); return; }
      window.__ytq = window.__ytq || [];
      window.__ytq.push(boot);
      if(!window.__ytLoading){
        window.__ytLoading = true;
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        s.async = true;
        s.onerror = () => self.dead();
        document.head.appendChild(s);
        window.onYouTubeIframeAPIReady = function(){
          (window.__ytq||[]).forEach(f=>{ try{ f(); }catch(e){} });
          window.__ytq = [];
        };
        setTimeout(()=>{ if(!self.ready && !self.player) self.dead(); }, 9000);
      }
    },

    dead(){
      if(this.failed) return;
      this.failed = true;
      this.el.classList.remove("expanded");
      this.el.classList.add("blocked");
      const t = TRACKS[this.idx];
      this.el.querySelector("#rSub").innerHTML =
        '<a href="' + t.href + '" target="_blank" rel="noopener">' + T().blocked + ' · YouTube ↗</a>';
      this.el.querySelector("#rPlayTxt").textContent = "YouTube";
      /* the site's own synthesised bed takes over instead */
      if(window.SND && this.wanted){ try{ SND.start(); }catch(e){} }
    },

    play(){
      this.wanted = true;
      if(this.failed){ window.open(TRACKS[this.idx].href, "_blank", "noopener"); return; }
      if(!this.player){ this.expand(); return; }
      try{ this.player.playVideo(); }catch(e){}
    },
    pause(){ try{ this.player.pauseVideo(); }catch(e){} },
    toggle(){ this.playing ? this.pause() : this.play(); },
    setVolume(v){ this.vol = Math.round(v*100);
      if(this.player){ try{ this.player.setVolume(this.vol); }catch(e){} } }
  };

  window.RADIO = R;
  const start = () => R.build();
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
