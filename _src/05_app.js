
/* ═══════════════════════════════════════════════════════════════
   MUSIC · drop your own master files into /assets/audio/
   Red Sex — Vessel is a copyrighted recording and is not bundled.
   The engine falls back to a synthesised bed, retuned per sin.
   ═══════════════════════════════════════════════════════════════ */
const MUSIC = {
  master: "assets/audio/red-sex.mp3",
  perSin: {
    // pride:    "assets/audio/01-pride.mp3",
    // envy:     "assets/audio/02-envy.mp3",
    // gluttony: "assets/audio/03-gluttony.mp3",
    // lust:     "assets/audio/04-lust.mp3",
    // wrath:    "assets/audio/05-wrath.mp3",
    // greed:    "assets/audio/06-greed.mp3",
    // sloth:    "assets/audio/07-sloth.mp3"
  }
};

/* ═══════════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════════ */
const store = {
  get(k, d){ try{ const v = localStorage.getItem("seven:"+k); return v===null?d:v; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem("seven:"+k, v); }catch(e){} }
};
let lang = (store.get("lang","en") || "en");
if(!I18N[lang]) lang = "en";
let current = null;          // open myth id
let filter = "all";          // bestiary filter
const $ = (s, r) => (r||document).querySelector(s);
const $$ = (s, r) => Array.from((r||document).querySelectorAll(s));
const t = k => (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k;
const L = obj => obj ? (obj[lang] || obj.en) : {};
const SIN_ROMAN = ["I","II","III","IV","V","VI","VII"];
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

/* ═══════════════════════════════════════════════════════════════
   GLYPHS
   ═══════════════════════════════════════════════════════════════ */
const GLYPHS = {
  pride:'<path d="M22 6 L36 34 H8 Z"/><path d="M15.5 26.5h13"/><circle cx="22" cy="18.5" r="2.1"/>',
  envy:'<path d="M4 22c6-8 12-12 18-12s12 4 18 12c-6 8-12 12-18 12S10 30 4 22z"/><circle cx="22" cy="22" r="5.2"/><circle cx="22" cy="22" r="1.3" fill="currentColor" stroke="none"/>',
  gluttony:'<path d="M8 11c0 8 4 12 14 12s14-4 14-12"/><path d="M8 11h28"/><path d="M13 30l2.5 6M22 30v7M31 30l-2.5 6"/>',
  lust:'<path d="M22 6c-6 8-10 12.5-10 18a10 10 0 0 0 20 0c0-5.5-4-10-10-18z"/><path d="M22 19v11"/>',
  wrath:'<path d="M22 4v9M22 31v9M4 22h9M31 22h9M9.3 9.3l6.4 6.4M28.3 28.3l6.4 6.4M34.7 9.3l-6.4 6.4M15.7 28.3l-6.4 6.4"/><circle cx="22" cy="22" r="3.2"/>',
  greed:'<path d="M22 7 L34 22 L22 37 L10 22 Z"/><path d="M22 15.5v13M15.5 22h13"/>',
  sloth:'<path d="M13 6h18M13 38h18M15 6c0 9 7 10 7 16s-7 7-7 16M29 6c0 9-7 10-7 16s7 7 7 16"/>'
};
const glyph = id => '<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width=".95" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(GLYPHS[id]||"")+'</svg>';

const COORDS = {
  mizdakhan:"42.44°N 59.36°E", chilpyk:"42.30°N 59.60°E", barsakelmes:"46.05°N 59.60°E",
  kanigut:"40.13°N 70.83°E", shaytanjiga:"39.53°N 66.62°E", moynaq:"43.77°N 59.03°E", iskanderkul:"39.08°N 68.37°E"
};
const byId = id => MYTHS.find(m => m.id === id);
const sum = a => a.reduce((x,y)=>x+y,0);
const sinTotals = () => SINS.map((s,i)=> sum(MYTHS.map(m=>m.scores[i])));
const maxSinTotal = () => Math.max.apply(null, sinTotals());

/* ═══════════════════════════════════════════════════════════════
   STATIC I18N
   ═══════════════════════════════════════════════════════════════ */
function applyStatic(){
  $$("[data-i18n]").forEach(el => { el.innerHTML = t(el.getAttribute("data-i18n")); });
  document.documentElement.lang = lang;
  const fb = $("#footBuilt"); if(fb) fb.textContent = t("foot.built");
  $$("#lang button").forEach(b => b.classList.toggle("on", b.dataset.lang === lang));
  document.title = lang === "uz" ? "Yetti — Markaziy Osiyo qorong'u miflari"
    : lang === "ru" ? "Семь — Тёмные мифы Центральной Азии"
    : "THE SEVEN — Dark Myths of Central Asia";
}

/* ═══════════════════════════════════════════════════════════════
   RENDER · THE SEVEN
   ═══════════════════════════════════════════════════════════════ */
function renderSins(){
  const tot = sinTotals(), mx = maxSinTotal();
  $("#sinGrid").innerHTML = SINS.map((s,i)=>{
    const d = L(s);
    const pct = Math.round(tot[i]/mx*100);
    return '<article class="sin" role="button" tabindex="0" data-sin="'+s.id+'" data-reveal>'
      + '<div class="sin-top"><span class="sin-n">'+SIN_ROMAN[i]+' · '+s.la+'</span>'
      + '<span class="sin-glyph">'+glyph(s.glyph)+'</span></div>'
      + '<h3>'+esc(d.name)+'</h3>'
      + '<div class="la">'+s.la+'</div>'
      + '<p class="gloss">'+esc(d.gloss)+'</p>'
      + '<div class="meter"><i style="max-width:'+pct+'%"></i><em>'+tot[i]+' / '+mx+'</em></div>'
      + '</article>';
  }).join("");
  $$("#sinGrid .sin").forEach(b=>{
   const go = ()=>{
    const i = SINS.findIndex(s=>s.id===b.dataset.sin);
    SND.setRoot(i);
    const pool = MYTHS.slice().sort((x,y)=>y.scores[i]-x.scores[i]);
    if(pool[0]) openMyth(pool[0].id);
   };
   b.addEventListener("click",go);
   b.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); go(); } });
  });
}

/* ═══════════════════════════════════════════════════════════════
   RENDER · BESTIARY
   ═══════════════════════════════════════════════════════════════ */

/* ── dread designations ─────────────────────────────────────────── */
/* A plate reads in three registers:
   the name cut into the paper, the crime written under it, the Latin
   binomial pressed into the margin. Uzbek gets the archive spelling;
   English keeps its own epithet, the Latin is shared. */
function latinOf(m){
  const dd = (typeof DREAD !== "undefined") ? DREAD[m.id] : null;
  return (dd && dd.lat) ? dd.lat : L(m).epithet;
}
function dreadOf(m){
  const dd = (typeof DREAD !== "undefined") ? DREAD[m.id] : null;
  if(!dd) return "";
  let label = dd[lang] || dd.en || "";
  if(lang === "uz") label = inscribeText(label);
  return '<div class="dread"><b>'+esc(dd.code)+'</b><span>'+esc(label)+'</span></div>';
}
function titleOf(m){ return namePlain(m); }
function subOf(m){ return latinOf(m); }

/* torn-sheet silhouette, cycled so no two neighbours share a tear */
let TORN_I = 0;
function tornAttr(){
  TORN_I = (TORN_I + 1) % 10;
  return ' data-torn="'+TORN_I+'"';
}
function topSins(m,count){
  return m.scores.map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v).slice(0,count);
}
function renderBestiary(){
  const list = MYTHS.filter(m=>m.type==="demon")
    .filter(m => filter==="all" || m.scores[+filter] >= 7)
    .sort((a,b)=>b.idx-a.idx);
  $("#bestGrid").innerHTML = list.map(m=>{
    const d = L(m), ts = topSins(m,2);
    return '<article class="card" role="button" tabindex="0" data-myth="'+m.id+'" data-reveal'+tornAttr()+'>'
      + '<div class="card-head"><span class="card-idx">№ '+String(MYTHS.indexOf(m)+1).padStart(2,"0")+'</span>'
      + '<span class="card-ix">'+m.idx+'<small>'+t("meta.index")+'</small></span></div>'
      + '<h3 aria-label="'+esc(L(m).name)+'">'+nameHTML(m)+'</h3>'
      + dreadOf(m)
      + '<div class="sub">'+esc(subOf(m))+'</div>'
      + '<p class="gist">'+esc(d.lore)+'</p>'
      + '<div class="card-foot">'
      + ts.map(x=>'<span class="mini-sin'+(x.v>=8?' hot':'')+'">'+esc(L(SINS[x.i]).name)+' '+x.v+'</span>').join("")
      + '<span class="card-arrow">→</span></div></article>';
  }).join("");
  bindCards();
}
function renderCurses(){
  $("#curseList").innerHTML = MYTHS.filter(m=>m.type==="curse").map(m=>{
    const d = L(m);
    return '<div class="tl-item" role="button" tabindex="0" data-myth="'+m.id+'" data-reveal'+tornAttr()+'>'
      + '<div class="yr">'+esc(m.year||"")+' · '+esc(L(REGIONS[m.region]).toString())+'</div>'
      + '<h3 aria-label="'+esc(L(m).name)+'">'+nameHTML(m)+'</h3>'
      + dreadOf(m)
      + '<p>'+esc(d.lore.length>230 ? d.lore.slice(0,228)+"…" : d.lore)+'</p>'
      + '<div class="tagline">'+topSins(m,2).map(x=>'<span>'+esc(L(SINS[x.i]).name)+' '+x.v+'</span>').join("")
      + '<span>'+t("meta.index")+' '+m.idx+'</span></div></div>';
  }).join("");
  bindCards();
}
function renderGeo(){
  $("#geoGrid").innerHTML = MYTHS.filter(m=>m.type==="place").map(m=>{
    const d = L(m);
    return '<div class="geo" role="button" tabindex="0" data-myth="'+m.id+'" data-reveal'+tornAttr()+'>'
      + '<div class="coord"><span>'+esc(COORDS[m.id]||"")+'</span><span>'+m.idx+'</span></div>'
      + '<h3 aria-label="'+esc(L(m).name)+'">'+nameHTML(m)+'</h3>'
      + dreadOf(m)
      + '<div class="rg">'+esc(L(REGIONS[m.region]).toString())+'</div>'
      + '<p>'+esc(d.lore)+'</p>'
      + '<div class="bar"><i></i><em>'+esc(L(SINS[topSins(m,1)[0].i]).name)+' '+topSins(m,1)[0].v+'</em></div>'
      + '</div>';
  }).join("");
  bindCards();
}
function bindCards(){
  $$("[data-myth]").forEach(el=>{
    el.addEventListener("click",()=>{ openMyth(el.dataset.myth); });
    el.addEventListener("keydown",e=>{
      if(e.key==="Enter"||e.key===" "){ e.preventDefault(); openMyth(el.dataset.myth); }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   RENDER · MATRIX
   ═══════════════════════════════════════════════════════════════ */
function heat(v){
  const a = (v/10);
  return v===0 ? "transparent" : "rgba(157,17,25,"+(a*0.62).toFixed(3)+")";
}
function renderMatrix(){
  const HLAB = {en:"Entry",uz:"Yozuv",ru:"Запись"};
  const head = '<thead><tr><th style="text-align:left;padding-left:14px">'+(HLAB[lang]||HLAB.en)+'</th>'
    + SINS.map((s,i)=>'<th class="rot"><span>'+SIN_ROMAN[i]+' · '+esc(L(s).name)+'</span></th>').join("")
    + '<th>Σ</th></tr></thead>';
  const body = '<tbody>' + MYTHS.map(m=>{
    const d = L(m), tt = sum(m.scores);
    return '<tr data-myth="'+m.id+'"><th class="rowh"><span class="nm">'+esc(titleOf(m))+'</span>'
      + '<span class="tp">'+t("type."+m.type)+' · '+esc(L(REGIONS[m.region]).toString())+'</span></th>'
      + m.scores.map(v=>'<td class="cell'+(v===0?' zero':'')+'" style="background:'+heat(v)+'">'+v+'</td>').join("")
      + '<td class="tot">'+tt+'</td></tr>';
  }).join("") + '</tbody>';
  $("#matrixTable").innerHTML = head + body;
  $$("#matrixTable tr[data-myth]").forEach(tr=>tr.addEventListener("click",()=>openMyth(tr.dataset.myth)));
  $$("#matrixTable thead th.rot").forEach((th,i)=>th.addEventListener("click",()=>{
    const pool = MYTHS.slice().sort((a,b)=>b.scores[i]-a.scores[i]);
    if(pool[0]) openMyth(pool[0].id);
  }));
  $("#scale").innerHTML = Array.from({length:10},(_,i)=>'<i style="background:'+heat(i+1)+'"></i>').join("");
  $("#matHint").textContent = t("mat.open");
}
function renderAgg(){
  const tot = sinTotals().map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v);
  const mx = Math.max.apply(null,tot.map(x=>x.v));
  $("#aggBars").innerHTML = tot.map(x=>'<div class="agg-row">'
    + '<div class="nm">'+esc(L(SINS[x.i]).name)+'</div>'
    + '<div class="track"><i data-w="'+(x.v/mx*100).toFixed(1)+'"></i></div>'
    + '<div class="val">'+x.v+'</div></div>').join("");
}

/* ═══════════════════════════════════════════════════════════════
   RENDER · DOCTRINE / TERMS / CRAFT / RULES / SOURCES
   ═══════════════════════════════════════════════════════════════ */
function renderDoctrine(){
  $("#docGrid").innerHTML = DOCTRINE.map(d=>{
    const x = L(d);
    return '<div class="doc" data-reveal><div class="n">'+d.n+' · '+d.era+'</div>'
      + '<h3>'+esc(x.t)+'</h3><p>'+esc(x.p)+'</p></div>';
  }).join("");
  const th = TERMS.head[lang] || TERMS.head.en;
  $("#termTable").innerHTML = '<thead><tr><th>'+th[0]+'</th><th style="width:24%">'+th[1]+'</th><th>'+th[2]+'</th></tr></thead><tbody>'
    + TERMS.rows.map(r=>{ const c = r[lang]||r.en; return '<tr><td>'+esc(c[0])+'</td><td>'+esc(c[1])+'</td><td>'+esc(c[2])+'</td></tr>'; }).join("")
    + '</tbody>';
  let note = $("#termNote");
  if(!note){ note = document.createElement("p"); note.id="termNote";
    note.style.cssText="margin-top:16px;font-size:12.6px;line-height:1.75;color:var(--muted);max-width:80ch;border-left:1px solid var(--blood);padding-left:14px";
    $("#termTable").parentNode.appendChild(note); }
  note.textContent = TERMS.note[lang] || TERMS.note.en;
}
function renderCraft(){
  $("#craftGrid").innerHTML = CRAFT.map(c=>{
    const x = L(c);
    return '<div class="craft" data-reveal><div class="k">'+esc(c.k)+'</div>'
      + '<h3>'+esc(x.t)+'</h3><p>'+esc(x.p)+'</p></div>';
  }).join("");
  $("#rulesList").innerHTML = RULES.map(r=>'<li>'+esc(r[lang]||r.en)+'</li>').join("");
}
function renderSources(){
  $("#srcGrid").innerHTML = SOURCES.map(s=>{
    const h = s.h[lang] || s.h.en;
    return '<div class="src-block" data-reveal><h3>'+esc(h)+'</h3>'
      + s.items.map(i=>'<p>'+esc(i)+'</p>').join("") + '</div>';
  }).join("");
}

/* ═══════════════════════════════════════════════════════════════
   DRAWER
   ═══════════════════════════════════════════════════════════════ */
function openMyth(id){
  const m = byId(id); if(!m) return;
  current = id;
  const d = L(m);
  $("#drKind").textContent = t("type."+m.type) + " · " + (m.year || L(REGIONS[m.region]));
  $("#drTitle").innerHTML = nameHTML(m);
  $("#drTitle").setAttribute("aria-label", L(m).name);
  $("#drSub").textContent = (lang === "uz")
    ? (L(m).name + " · " + inscribeText(L(m).epithet))
    : (L(m).name + " · " + L(m).epithet);
  (function(){
    const sub = $("#drSub"); if(!sub) return;
    let el = document.getElementById("drDread");
    if(!el){ el = document.createElement("div"); el.id="drDread"; el.className="dr-dread";
      sub.parentNode.insertBefore(el, sub.nextSibling); }
    el.innerHTML = dreadOf(m);
  })();
  (function(){
    const ALIAS = {"bibi-khanym":"bibixonim"};
    const key = ALIAS[id] || id;
    const img = document.getElementById("drPlate"), cap = document.getElementById("drPlateCap");
    const fig = document.getElementById("drFig");
    if(!img || typeof PLATES === "undefined") return;
    if(PLATES[key]){
      img.src = PLATES[key];
      const mm = PLATE_META[key] || {};
      cap.textContent = (mm.kind === "ai" ? "AI reconstruction · dossier plate" : "Archive photograph · " + (mm.credit||""));
      fig.style.display = "";
    } else { fig.style.display = "none"; }
  })();
  $("#drPara").textContent = d.lore;
  const provHost = $("#drProv");
  if(provHost){
    const f2 = String(d.src||"").split(";").map(x=>x.trim()).filter(Boolean).slice(0,3);
    provHost.innerHTML = '<div class="prov-h">'+t("prov.h")+'</div>'
      + '<div class="prov-row"><i></i><b>'+t("prov.acad")+'</b></div>'
      + '<div class="prov-row"><i></i><b>'+t("prov.oral")+'</b> · '+esc(L(REGIONS[m.region]).toString())+'</div>'
      + (f2.length?'<div class="prov-row" style="align-items:flex-start"><i style="margin-top:5px"></i><span style="text-transform:none;letter-spacing:.02em;line-height:1.7">'+esc(f2.join(" · "))+'</span></div>':'')
      + '<div class="prov-row"><i></i><b>'+t("prov.press")+'</b></div>'
      + '<div class="prov-note">'+t("prov.note")+'</div>';
  }
  $("#lblThreat").textContent = t("lbl.threat");
  $("#lblWard").textContent = t("lbl.ward");
  $("#lblProfile").textContent = t("lbl.profile");
  $("#lblSrc").textContent = t("lbl.src");
  $("#drThreat").textContent = d.threat;
  $("#drWard").textContent = d.ward;
  $("#drSrc").textContent = d.src;
  $("#drBars").innerHTML = SINS.map((s,i)=>'<div class="bar-row">'
    + '<div class="l">'+esc(L(s).name)+'</div>'
    + '<div class="t"><i data-w="'+(m.scores[i]*10)+'"></i></div>'
    + '<div class="v">'+m.scores[i]+'</div></div>').join("");
  $("#drMeta").innerHTML = ['<span>'+t("meta.region")+': '+esc(L(REGIONS[m.region]).toString())+'</span>',
    '<span>'+t("meta.index")+': '+m.idx+'</span>',
    m.year?'<span>'+t("meta.year")+': '+esc(m.year)+'</span>':'',
    '<span>Σ '+sum(m.scores)+'</span>'].join("");
  const sl = $("#drSinList");
  if(sl){
    const ranked = m.scores.map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v);
    sl.innerHTML = ranked.map(x=>'<span data-sinjump="'+x.i+'">'+esc(L(SINS[x.i]).name)+' '+x.v+'</span>').join("");
    $$("#drSinList span").forEach(s2=>s2.addEventListener("click",()=>{
      const i = +s2.dataset.sinjump;
      const pool = MYTHS.filter(x=>x.type==="demon").sort((a,b)=>b.scores[i]-a.scores[i]);
      if(pool[0]) openMyth(pool[0].id);
    }));
  }
  $("#drawer").classList.add("on");
  $("#drawer").setAttribute("aria-hidden","false");
  $("#scrim").classList.add("on");
  document.body.classList.add("locked");
  requestAnimationFrame(()=>{
    $$("#drBars .t i").forEach(el=>{ el.style.transform = "scaleX("+(el.dataset.w/100)+")"; });
  });
  const topI = m.scores.indexOf(Math.max.apply(null,m.scores));
  SND.setRoot(topI);
  SND.sinkTrack(SINS[topI].id);
}
function closeDrawer(){
  current = null;
  $("#drawer").classList.remove("on");
  $("#drawer").setAttribute("aria-hidden","true");
  $("#scrim").classList.remove("on");
  document.body.classList.remove("locked");
}

/* ═══════════════════════════════════════════════════════════════
   AUDIO ENGINE
   master file first, synthesised bed as fallback
   ═══════════════════════════════════════════════════════════════ */
const SND = {
  ctx:null, master:null, filter:null, oscs:[], noise:null, lfo:null,
  el:null, mode:"idle", playing:false, vol:Number(store.get("vol",38))/100,
  root:"A3",
  note(n){
    const m = /^([A-G])(#|b)?(\d)$/.exec(n||"A3");
    if(!m) return 55;
    const base = {C:16.3516,D:18.3540,E:20.6017,F:21.8268,G:24.4997,A:27.5,B:30.8677}[m[1]];
    const semi = m[2]==="#"?1:m[2]==="b"?-1:0;
    return base * Math.pow(2, semi/12) * Math.pow(2, +m[3]);
  },
  feats(){
    try{ return !!(window.AudioContext||window.webkitAudioContext); }catch(e){ return false; }
  },
  init(){
    if(this.ctx || !this.feats()) return;
    const AC = window.AudioContext||window.webkitAudioContext;
    const ctx = this.ctx = new AC();
    const master = this.master = ctx.createGain();
    master.gain.value = 0;
    const filter = this.filter = ctx.createBiquadFilter();
    filter.type = "lowpass"; filter.frequency.value = 340; filter.Q.value = 3.4;
    filter.connect(master); master.connect(ctx.destination);

    const mk = (type, mult, det, gain, dest) => {
      const o = ctx.createOscillator(); o.type = type; o.detune.value = det;
      o.frequency.value = this.note(this.root) * mult;
      const g = ctx.createGain(); g.gain.value = gain;
      o.connect(g); g.connect(dest || filter); o.start();
      return o;
    };
    this.oscs.push(mk("sawtooth",1,-7,0.16));
    this.oscs.push(mk("sawtooth",1.5,9,0.085));
    this.oscs.push(mk("sine",0.5,0,0.20));

    // slow filter movement
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.045;
    const lg = ctx.createGain(); lg.gain.value = 150;
    lfo.connect(lg); lg.connect(filter.frequency); lfo.start(); this.lfo = lfo;

    // pink-ish noise bed
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const ch = buf.getChannelData(0);
    let b0=0,b1=0,b2=0;
    for(let i=0;i<len;i++){
      const w = Math.random()*2-1;
      b0 = 0.99765*b0 + w*0.0990460;
      b1 = 0.96300*b1 + w*0.2965164;
      b2 = 0.57000*b2 + w*1.0526913;
      ch[i] = (b0+b1+b2+w*0.1848)*0.16;
    }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=760; bp.Q.value=0.65;
    const ng = ctx.createGain(); ng.gain.value = 0.05;
    src.connect(bp); bp.connect(ng); ng.connect(master); src.start();
    this.noise = { src, bp, ng };

    // slow tremolo
    const tr = ctx.createOscillator(); tr.frequency.value = 0.062;
    const tg = ctx.createGain(); tg.gain.value = 0.035;
    tr.connect(tg); tg.connect(master.gain); tr.start();

    this.mode = "synth";
  },
  target(){ return Math.pow(this.vol, 1.35) * 0.30; },
  async start(){
    if(this.playing) return;
    // 1 · try the master file
    if(!this.el){
      const el = this.el = $("#bgm");
      el.src = MUSIC.master;
      el.volume = this.vol;
    }
    if(this.mode !== "synth" && !this.fileFailed){
      let p;
      try{ p = this.el.play(); }
      catch(e){ this.fileFailed = true; p = null; }
      if(p && p.catch){
        try{ await p; this.mode = "file"; this.playing = true; this.ui(true); return; }
        catch(e){ this.fileFailed = true; }
      } else { this.mode="file"; this.playing = true; this.ui(true); return; }
    }
    this.init();
    if(!this.ctx) { this.ui(false); return; }
    if(this.ctx.state === "suspended") await this.ctx.resume();
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(this.target(), now + 4.5);
    this.playing = true; this.mode = "synth"; this.ui(true);
  },
  stop(){
    if(this.mode === "file" && this.el){ this.el.pause(); }
    if(this.master && this.ctx){
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(this.master.gain.value, now);
      this.master.gain.linearRampToValueAtTime(0, now + 1.2);
    }
    this.playing = false; this.ui(false);
  },
  toggle(){ this.playing ? this.stop() : this.start(); },
  setVol(v){
    this.vol = Math.max(0, Math.min(1, v));
    store.set("vol", Math.round(this.vol*100));
    if(this.el) this.el.volume = this.vol;
    if(this.master && this.ctx && this.playing){
      const now = this.ctx.currentTime;
      this.master.gain.linearRampToValueAtTime(this.target(), now + 0.6);
    }
  },
  /* optional per-sin masters: assets/audio/01-pride.mp3 etc. */
  async sinkTrack(sinId){
    const src = MUSIC.perSin[sinId];
    if(!src || this._lastSin === sinId) return;
    this._lastSin = sinId;
    const el = this.el || (this.el = $("#bgm"));
    const prevMode = this.mode;
    try{
      el.volume = 0; el.src = src;
      await el.play();
      this.mode = "file"; this.playing = true; this.ui(true);
      const target = this.vol; let i = 0;
      const iv = setInterval(()=>{ i++; el.volume = Math.min(target, target*i/18); if(i>=18) clearInterval(iv); }, 55);
    }catch(e){
      this.mode = prevMode; this.ui(this.playing);
    }
  },
  setRoot(x){
    let note;
    if(typeof x === "number") note = SINS[Math.max(0,Math.min(6,x))].root;
    else if(byId(x)) note = SINS[byId(x).scores.indexOf(Math.max.apply(null, byId(x).scores))].root;
    else note = (SINS.find(s=>s.id===x)||SINS[0]).root;
    this.root = note;
    if(!this.ctx || !this.oscs.length) return;
    const f = this.note(note), now = this.ctx.currentTime;
    this.oscs[0].frequency.linearRampToValueAtTime(f, now+2.6);
    this.oscs[1].frequency.linearRampToValueAtTime(f*1.5, now+2.6);
    this.oscs[2].frequency.linearRampToValueAtTime(f*0.5, now+2.6);
  },
  ui(on){
    const p1 = $("#icoPlay"), p2 = $("#icoPause"), eq = $("#eq");
    if(p1) p1.style.display = on ? "none" : "block";
    if(p2) p2.style.display = on ? "block" : "none";
    if(eq) eq.classList.toggle("live", !!on);
    $("#sndBtn") && $("#sndBtn").classList.toggle("on", !!on);
    const title = $("#dockTitle"), sub = $("#dockSub");
    if(!title) return;
    title.textContent = "Red Sex — Vessel";
    const mode = this.mode === "file" ? "" : " · " + t("dock.bed");
    sub.textContent = on ? t("dock.playing") + mode : t("dock.paused");
  }
};

/* ═══════════════════════════════════════════════════════════════
   INTERACTIONS
   ═══════════════════════════════════════════════════════════════ */
function setLang(l){
  lang = I18N[l] ? l : "en";
  store.set("lang", lang);
  applyStatic(); renderAll();
  SND.ui(SND.playing);
  if(current) openMyth(current);
}
function renderAll(){
  renderSins(); renderBestiary(); renderCurses(); renderGeo();
  renderMatrix(); renderAgg(); renderDoctrine(); renderCraft(); renderSources();
  observeReveals();
}
function observeReveals(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin:"0px 0px -8% 0px", threshold:0.06 });
  $$("[data-reveal]").forEach(el=>{ if(!el.classList.contains("in")) io.observe(el); });
}
function progress(){
  const h = document.documentElement;
  const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
  $("#ruleTop").style.width = (p*100).toFixed(2) + "%";
}
function activeNav(){
  const ids = ["sins","bestiary","curses","geography","matrix","doctrine","craft","sources"];
  let best = null;
  ids.forEach(id=>{
    const s = document.getElementById(id); if(!s) return;
    const r = s.getBoundingClientRect();
    if(r.top < innerHeight*0.4 && r.bottom > 120) best = id;
  });
  $$("#navlinks a").forEach(a=>a.classList.toggle("on", a.dataset.nav === best));
}

/* boot */
document.addEventListener("DOMContentLoaded", ()=>{
  applyStatic(); renderAll();
  $("#lang").addEventListener("click", e=>{
    const b = e.target.closest("button[data-lang]"); if(b) setLang(b.dataset.lang);
  });
  $("#besFilters").addEventListener("click", e=>{
    const c = e.target.closest("[data-f]"); if(!c) return;
    filter = c.dataset.f;
    $$("#besFilters .chip").forEach(x=>x.classList.toggle("on", x===c));
    renderBestiary(); observeReveals();
  });
  $("#drClose").addEventListener("click", closeDrawer);
  $("#scrim").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeDrawer(); });
  $("#playBtn").addEventListener("click", ()=>SND.toggle());
  $("#sndBtn").addEventListener("click", ()=>SND.toggle());
  document.getElementById("vol").addEventListener("input", e=>SND.setVol(Number(e.target.value)/100));
  $("#vol").value = Math.round(SND.vol*100);
  $("#burger").addEventListener("click", ()=>$("#navlinks").classList.toggle("open"));
  $$("#navlinks a").forEach(a=>a.addEventListener("click", ()=>$("#navlinks").classList.remove("open")));
  addEventListener("scroll", ()=>{ progress(); activeNav(); }, { passive:true });
  progress(); activeNav();

  // enter
  $("#enterBtn").addEventListener("click", ()=>{
    $("#veil").classList.add("gone");
    document.body.classList.add("awake");
    setTimeout(()=>{ $("#veil").style.display="none"; }, 1200);
    // official track first (streamed from the rights holders' channel);
    // the synthesised bed takes over only if the player is blocked.
    let radioOK = false;
    if(window.RADIO){ try{ RADIO.play(); radioOK = true; }catch(e){} }
    if(radioOK){
      setTimeout(()=>{ if(!RADIO.ready && !RADIO.failed){ SND.start(); } }, 3200);
    } else { SND.start(); }
    setTimeout(()=>{ document.getElementById("sins").scrollIntoView({behavior:"smooth",block:"start"}); }, 900);
  });

  // retune the bed as sections change
  const ROOTS = { hero:"A3", sins:"D3", bestiary:"F3", curses:"B2", geography:"C3", matrix:"G3", doctrine:"D#3", craft:"A3", sources:"E3" };
  const secIO = new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting && ROOTS[e.target.id] && SND.playing){ SND.root = ROOTS[e.target.id]; SND.setRoot(ROOTS[e.target.id]); } });
  }, { threshold:0.28 });
  ["hero","sins","bestiary","curses","geography","matrix","doctrine","craft","sources"].forEach(id=>{
    const s = document.getElementById(id); if(s) secIO.observe(s);
  });

  // aggregates animate when visible
  const aggIO = new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        $$("#aggBars .track i").forEach(el=>{ el.style.width = el.dataset.w + "%"; });
        aggIO.disconnect();
      }
    });
  }, { threshold:0.2 });
  const agg = $("#aggWrap"); if(agg) aggIO.observe(agg);

  SND.ui(false);
});
