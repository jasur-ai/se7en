# -*- coding: utf-8 -*-
"""Build katalog.html — The Index of Unquiet Names (single self-contained file)."""
import base64, json, os, sys, html
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "_src"))
from katalog_data import RECORDS, CLASSES, UNLISTED, UI
SCORES = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "_src", "scores.json")))
IDXV = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "_src", "idx.json")))
SIN_AB = ["P","E","G","L","W","A","S"]

ROOT = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(ROOT, "assets", "img")
MAN = json.load(open(os.path.join(IMG, "manifest.json"), encoding="utf-8"))

def b64(pid):
    with open(os.path.join(IMG, pid + "-m.jpg"), "rb") as f:
        return "data:image/jpeg;base64," + base64.b64encode(f.read()).decode()

plates = {}
for r in RECORDS:
    plates.setdefault(r["plate"], b64(r["plate"]))

def e(s):
    return html.escape(s, quote=False)

def L(key, tag="span", cls=""):
    """tri-lingual element"""
    return "".join(
        '<%s class="l %s %s">%s</%s>' % (tag, lg, cls, e(UI[lg][key]), tag) for lg in ("en", "uz", "ru")
    )

IDX = {"en": 0, "uz": 1, "ru": 2}
def tri(t, tag, cls=""):
    def get(lg):
        return t[lg] if isinstance(t, dict) else t[IDX[lg]]
    return "".join(
        '<%s class="l %s %s">%s</%s>' % (tag, lg, cls, e(get(lg)), tag) for lg in ("en", "uz", "ru")
    )

# ── records ───────────────────────────────────────────────────────────
out = []
for r in RECORDS:
    c = CLASSES[r["cls"]]
    code = "%s·%s" % (c["code"], r["no"])
    credit = MAN[r["plate"]]["credit"]
    _k = MAN[r["plate"]]["kind"]
    kind = "" if _k == "ai" else "Archive photograph · "
    name = "".join('<span class="l %s name nm">%s</span>' % (lg, e(r[lg][0])) for lg in ("en", "uz", "ru"))
    sig  = "".join('<p class="l %s sig">%s</p>' % (lg, e(r[lg][1])) for lg in ("en", "uz", "ru"))
    ins  = "".join('<p class="l %s ins">%s</p>' % (lg, e(r[lg][2])) for lg in ("en", "uz", "ru"))
    sc = SCORES.get(r["id"])
    prof = ""
    if sc:
        bars = "".join(f'<i style="--v:{v}"></i>' for v in sc)
        ticks = "".join(f"<b>{a}</b>" for a in SIN_AB)
        prof = (f'<div class="prof"><div class="lab">{L("sigprof")}</div>'
                f'<div class="bars">{bars}</div><div class="ticks">{ticks}</div></div>')
    out.append(f'''
<article class="rec" data-id="{r['id']}" data-cls="{r['cls']}" tabindex="0" aria-expanded="false">
  <div class="plate">
    <img data-src="{r['plate']}" alt="">
    <span class="stamp">{code}</span>
    <span class="cross"></span>
  </div>
  <div class="body">
    <div class="row"><span class="cls">{c['lat']}</span><span class="dots"></span><span class="no">{code}</span></div>
    <div class="lat">{r['lat']}</div>
    <div class="sub"><i>{e(r['sub'])}</i></div>
    <h3>{name}</h3>
    <div class="field"><div class="lab">{L('sig')}</div>{sig}</div>
    <div class="toggle"><span class="lab">{L('rule')}</span></div>
    <div class="rule">{ins}</div>
    {prof}
    <div class="credit">{kind}{e(credit)}</div>
  </div>
</article>''')

recs_html = "".join(out)

# ── class sections ────────────────────────────────────────────────────
secs = []
for n, c in CLASSES.items():
    body = "".join(x for x in out if f'data-cls="{n}"' in x)
    secs.append(f'''
<section class="cls-sec" id="cls{n}">
  <header class="cls-head">
    <div class="cls-rule"></div>
    <div class="cls-kick">{c['lat']}</div>
    <h2>{"".join(f'<span class="l {lg} cn">{e(c[lg][0])}</span>' for lg in ("en","uz","ru"))}</h2>
    <p class="cls-desc">{"".join(f'<span class="l {lg} cd">{e(c[lg][1])}</span>' for lg in ("en","uz","ru"))}</p>
  </header>
  <div class="recs">{body}</div>
</section>''')
secs_html = "".join(secs)

unl = UNLISTED
unl_html = f'''
<section class="cls-sec unlisted" id="cls0" aria-hidden="true">
  <header class="cls-head">
    <div class="cls-rule"></div>
    <div class="cls-kick">CLASSIS ∅ · NON ENUMERATA</div>
    <h2>{"".join(f'<span class="l {lg} cn">{e(unl[lg][0])}</span>' for lg in ("en","uz","ru"))}</h2>
  </header>
  <article class="rec" data-id="unlisted">
    <div class="plate dead"><div class="static"></div><span class="stamp">{unl['code']}</span></div>
    <div class="body">
      <div class="row"><span class="cls">NOMEN QUOD NEMO POSUIT</span><span class="dots"></span><span class="no">{unl['code']}</span></div>
      <div class="lat">{unl['lat']}</div>
      <div class="sub">*{e(unl['sub'])}*</div>
      <h3>{''.join(f'<span class="l {lg} name">{e(unl[lg][0])}</span>' for lg in ("en","uz","ru"))}</h3>
      <div class="field"><div class="lab">{L('sig')}</div>{''.join(f'<p class="l {lg} sig">{e(unl[lg][1])}</p>' for lg in ("en","uz","ru"))}</div>
      <div class="rule"><div class="lab">{L('rule')}</div>{''.join(f'<p class="l {lg} ins">{e(unl[lg][2])}</p>' for lg in ("en","uz","ru"))}</div>
    </div>
  </article>
</section>'''

CSS = r"""
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --void:#050406; --panel:#0a080b; --bone:#e9e2d3; --bone-2:#c9c0ae;
  --mute:#8b8274; --mute-2:#5d564c; --blood:#9d1119; --blood-2:#c2181f; --gild:#b08a4a;
  --serif:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,"Times New Roman",serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
html{background:var(--void);color:var(--bone);scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:var(--serif);font-size:16px;line-height:1.62;letter-spacing:.005em;
  background:
    radial-gradient(1200px 700px at 50% -10%, rgba(157,17,25,.10), transparent 70%),
    radial-gradient(900px 600px at 100% 100%, rgba(176,138,74,.05), transparent 70%),
    var(--void);
  overflow-x:hidden}
body:before{content:"";position:fixed;inset:0;pointer-events:none;z-index:9;opacity:.40;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E")}
body:after{content:"";position:fixed;inset:0;pointer-events:none;z-index:10;
  background:radial-gradient(circle at 50% 45%, transparent 35%, rgba(0,0,0,.55) 100%)}
::selection{background:var(--blood);color:#fff}

/* language */
.l{display:none}
html[data-lang="en"] .l.en,html[data-lang="uz"] .l.uz,html[data-lang="ru"] .l.ru{display:revert}
.rec h3 .nm{display:none}
html[data-lang="en"] .rec h3 .nm.en,html[data-lang="uz"] .rec h3 .nm.uz,html[data-lang="ru"] .rec h3 .nm.ru{display:block}

/* top bar */
.bar{position:fixed;top:0;left:0;right:0;z-index:40;display:flex;align-items:center;gap:18px;
  padding:12px clamp(16px,3vw,40px);background:rgba(5,4,6,.86);backdrop-filter:blur(8px);
  border-bottom:1px solid rgba(233,226,211,.09);font-family:var(--mono);font-size:9.5px;
  letter-spacing:.24em;text-transform:uppercase;color:var(--mute)}
.bar b{color:var(--bone-2);font-weight:400}
.bar .sp{flex:1}
.bar .lang{display:flex;gap:2px;border:1px solid rgba(233,226,211,.13);padding:2px}
.bar .lang button{background:none;border:0;color:var(--mute);font:inherit;letter-spacing:.16em;
  padding:5px 8px;cursor:pointer;transition:.25s}
.bar .lang button[aria-pressed="true"],.bar .lang button[aria-pressed="true"]:hover{background:var(--bone);color:#070506}
.bar .lang button:hover{color:var(--bone)}
.meter{position:fixed;top:0;left:0;height:2px;background:var(--blood-2);width:0;z-index:41;
  box-shadow:0 0 12px rgba(194,24,31,.8);transition:width .5s ease}

/* hero */
.hero{min-height:100svh;display:flex;flex-direction:column;justify-content:center;
  padding:120px clamp(18px,6vw,80px) 70px;position:relative;max-width:1240px;margin:0 auto}
.seal{width:64px;height:64px;margin-bottom:34px;opacity:.9}
.kick{font-family:var(--mono);font-size:10px;letter-spacing:.42em;text-transform:uppercase;color:var(--blood-2);margin-bottom:26px}
h1{font-size:clamp(38px,8.2vw,104px);line-height:.94;font-weight:400;letter-spacing:-.022em;max-width:16ch}
h1 em{font-style:italic;color:var(--bone-2)}
.hero .lede{max-width:52ch;color:var(--bone-2);font-size:clamp(15px,1.5vw,18.5px);margin-top:30px;line-height:1.66}
.hero .meta{display:flex;flex-wrap:wrap;gap:26px;margin-top:52px;font-family:var(--mono);font-size:9.5px;
  letter-spacing:.2em;text-transform:uppercase;color:var(--mute-2);border-top:1px solid rgba(233,226,211,.1);padding-top:18px}
.hero .meta b{color:var(--bone);font-weight:400}
.scroll{position:absolute;bottom:26px;left:clamp(18px,6vw,80px);font-family:var(--mono);font-size:9px;
  letter-spacing:.34em;text-transform:uppercase;color:var(--mute-2);display:flex;align-items:center;gap:12px}
.scroll i{display:block;width:44px;height:1px;background:var(--blood);animation:pull 2.6s infinite ease-in-out}
@keyframes pull{0%,100%{transform:scaleX(.3);transform-origin:left;opacity:.4}50%{transform:scaleX(1);opacity:1}}

/* class sections */
.cls-sec{max-width:1240px;margin:0 auto;padding:70px clamp(18px,6vw,80px) 30px;border-top:1px solid rgba(233,226,211,.08)}
.cls-head{max-width:720px;margin-bottom:54px}
.cls-rule{width:100%;height:1px;background:linear-gradient(90deg,var(--blood),rgba(157,17,25,0) 60%);margin-bottom:22px}
.cls-kick{font-family:var(--mono);font-size:9.5px;letter-spacing:.34em;color:var(--gild);margin-bottom:14px}
.cls-head h2{font-size:clamp(27px,3.6vw,44px);font-weight:400;letter-spacing:-.01em;line-height:1.06}
.cls-desc{color:var(--mute);margin-top:14px;max-width:56ch;font-size:15.5px}

/* record */
.rec{display:grid;grid-template-columns:minmax(0,.94fr) minmax(0,1fr);gap:clamp(22px,3.4vw,54px);
  padding:34px 0 40px;border-bottom:1px solid rgba(233,226,211,.07);cursor:pointer;position:relative}
.rec:first-child{border-top:1px solid rgba(233,226,211,.07)}
.rec:focus-visible{outline:1px solid var(--blood-2);outline-offset:6px}
.plate{position:relative;overflow:hidden;background:#08070a;aspect-ratio:3/2;align-self:start;
  box-shadow:0 22px 60px -30px #000,inset 0 0 0 1px rgba(233,226,211,.10)}
.plate img{width:100%;height:100%;object-fit:cover;display:block;
  filter:contrast(1.02) saturate(.9);transition:transform 1.6s cubic-bezier(.2,.7,.2,1),filter .8s;opacity:0}
.plate img.on{opacity:1}
.rec:hover .plate img{transform:scale(1.045);filter:contrast(1.08) saturate(1)}
.plate:after{content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,rgba(0,0,0,.34),transparent 30%,transparent 62%,rgba(0,0,0,.52))}
.stamp{position:absolute;left:0;bottom:0;z-index:2;font-family:var(--mono);font-size:9px;letter-spacing:.3em;
  padding:7px 11px;background:rgba(5,4,6,.78);color:var(--bone-2);border-top:1px solid rgba(233,226,211,.14) ;
  border-right:1px solid rgba(233,226,211,.14)}
.cross{position:absolute;right:12px;top:10px;width:12px;height:12px;z-index:2;opacity:.6}
.cross:before,.cross:after{content:"";position:absolute;background:var(--blood-2)}
.cross:before{left:5px;top:0;width:1px;height:12px}
.cross:after{top:5px;left:0;height:1px;width:12px}

.body{display:flex;flex-direction:column;min-width:0}
.row{display:flex;align-items:baseline;gap:10px;font-family:var(--mono);font-size:8.6px;letter-spacing:.24em;
  text-transform:uppercase;color:var(--mute-2)}
.dots{flex:1;border-bottom:1px dotted rgba(233,226,211,.16);transform:translateY(-3px)}
.lat{font-family:var(--mono);font-size:clamp(11px,1.22vw,14px);letter-spacing:.18em;color:var(--gild);
  margin-top:14px;word-break:break-word}
.sub{font-family:var(--mono);font-size:9.6px;letter-spacing:.1em;color:var(--mute-2);margin-top:5px}
.rec h3{font-size:clamp(24px,3.1vw,38px);font-weight:400;line-height:1.08;letter-spacing:-.012em;margin:14px 0 18px}
.rec h3 .name{font-style:normal}
.field .lab,.toggle .lab,.rule .lab{font-family:var(--mono);font-size:8.6px;letter-spacing:.3em;
  text-transform:uppercase;color:var(--blood-2);margin-bottom:6px}
.rule .lab{margin-bottom:8px}
.toggle{margin-top:16px;display:flex;align-items:center;gap:8px;user-select:none}
.toggle .lab{margin:0;color:var(--mute-2);transition:.3s}
.rec:hover .toggle .lab{color:var(--blood-2)}
.toggle .lab:after{content:"  +";color:var(--blood-2);letter-spacing:0}
.rec.open .toggle .lab:after{content:"  \2212"}
.sig{color:var(--bone-2);font-size:15.5px;line-height:1.6;max-width:56ch}
.rule{max-height:0;overflow:hidden;opacity:0;transition:max-height .6s cubic-bezier(.2,.7,.2,1),opacity .5s,margin .5s;margin-top:0}
.rec.open .rule{max-height:220px;opacity:1;margin-top:16px}
.ins{color:var(--bone);font-size:14.5px;line-height:1.6;border-left:1px solid var(--blood);padding-left:13px;max-width:52ch}
.prof{margin-top:18px;max-width:230px}
.prof .lab{font-family:var(--mono);font-size:8.6px;letter-spacing:.3em;text-transform:uppercase;color:var(--mute-2);margin-bottom:7px}
.bars{display:flex;align-items:flex-end;gap:4px;height:30px;border-bottom:1px solid rgba(233,226,211,.14);padding-bottom:2px}
.bars i{flex:1;background:linear-gradient(180deg,var(--blood-2),rgba(157,17,25,.22));height:calc(var(--v)*10%);min-height:2px;display:block;transition:filter .4s}
.rec:hover .bars i{filter:brightness(1.25)}
.ticks{display:flex;gap:4px;margin-top:4px}
.ticks b{flex:1;text-align:center;font-family:var(--mono);font-size:7.5px;letter-spacing:.1em;color:var(--mute-2);font-weight:400}
.unl{display:none}
.credit{font-family:var(--mono);font-size:8.2px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--mute-2);margin-top:auto;padding-top:22px}
.rec:hover .credit{color:var(--mute)}

/* unlisted */
.unlisted{display:none;border-top:1px solid var(--blood);margin-top:40px;opacity:0;transition:opacity 2.4s ease}
.unlisted.on{display:block;opacity:1}
.unlisted .plate{background:#000;box-shadow:0 0 0 1px rgba(157,17,25,.45),0 0 80px -24px rgba(157,17,25,.5) inset}
.static{position:absolute;inset:-40%;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='s'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23s)' opacity='.5'/%3E%3C/svg%3E");
  animation:drift 7s steps(6) infinite;opacity:.5}
@keyframes drift{0%{transform:translate3d(0,0,0)}25%{transform:translate3d(-3%,2%,0)}50%{transform:translate3d(2%,-3%,0)}75%{transform:translate3d(-2%,-1%,0)}100%{transform:translate3d(0,0,0)}}
.unlisted .rec{cursor:default}
.unlisted .rule{max-height:none;opacity:1;margin-top:16px}
.unlisted .rec h3{color:var(--bone)}
.unlisted .lat{color:var(--blood-2)}

/* foot */
footer{max-width:1240px;margin:0 auto;padding:70px clamp(18px,6vw,80px) 90px;border-top:1px solid rgba(233,226,211,.1);
  display:grid;grid-template-columns:1fr 2fr;gap:40px;font-family:var(--mono);font-size:9.4px;
  letter-spacing:.16em;text-transform:uppercase;color:var(--mute-2);line-height:2.1}
footer .note{text-transform:none;letter-spacing:.03em;font-family:var(--serif);font-size:13.4px;
  line-height:1.75;color:var(--mute-2);max-width:64ch}
footer b{color:var(--bone-2);font-weight:400;display:block;margin-bottom:10px;letter-spacing:.3em}

@media(max-width:560px){
  .bar{gap:10px;font-size:8.6px;letter-spacing:.16em}
  .bar .cnt{display:none}
  h1{letter-spacing:-.01em}
}
@media(max-width:820px){
  .rec{grid-template-columns:1fr;gap:20px}
  .plate{aspect-ratio:16/10}
  footer{grid-template-columns:1fr}
  .hero{min-height:auto;padding-top:130px;padding-bottom:90px}
}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto}}
"""

JS = r"""
const IMG = __IMG__;

const LANGS = ["en","uz","ru"];

/* reveal images */
document.querySelectorAll("img[data-src]").forEach(img=>{
  const k = img.getAttribute("data-src");
  if(IMG[k]){ img.src = IMG[k]; img.onload = ()=> img.classList.add("on"); }
});

/* language */
function setLang(l){
  document.documentElement.setAttribute("data-lang", l);
  document.querySelectorAll(".lang button").forEach(b=>b.setAttribute("aria-pressed", b.dataset.l===l));
  try{ localStorage.setItem("bur-lang", l);}catch(e){}
}
let startLang = "uz";
try{ startLang = localStorage.getItem("bur-lang") || "uz"; }catch(e){}
setLang(startLang);
document.querySelectorAll(".lang button").forEach(b=>b.addEventListener("click",()=>{
  setLang(b.dataset.l); document.querySelectorAll(".relabel").forEach(n=>{});
  relabelHints();
}));

/* records */
const read = new Set();
const TOTAL = document.querySelectorAll(".rec[data-cls]").length;
function meter(){
  const p = Math.min(1, read.size/TOTAL);
  document.querySelector(".meter").style.width = (p*100).toFixed(1)+"%";
  document.querySelector("#count").textContent = read.size;
  if(read.size >= TOTAL) unveil();
}
document.querySelectorAll(".rec[data-cls]").forEach(rec=>{
  const open = ()=>{
    rec.classList.toggle("open");
    rec.setAttribute("aria-expanded", rec.classList.contains("open"));
    if(rec.classList.contains("open")){ read.add(rec.dataset.id); meter(); }
  };
  rec.addEventListener("click", open);
  rec.addEventListener("keydown", e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); open(); }});
});
function relabelHints(){}
let unveiled = false;
function unveil(){
  if(unveiled) return; unveiled = true;
  const u = document.querySelector(".unlisted");
  setTimeout(()=>{ u.classList.add("on"); u.setAttribute("aria-hidden","false");
    setTimeout(()=>u.scrollIntoView({behavior:"smooth",block:"center"}), 350);
  }, 900);
}
meter();
"""

HTMLDOC = f"""<!DOCTYPE html>
<html lang="uz" data-lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bezovta nomlar indeksi · The Index of Unquiet Names</title>
<meta name="description" content="Thirty-three Central Asian dread records — case codes, Latin designations, signals and standing instructions.">
<style>{CSS}</style>
</head>
<body>
<div class="meter"></div>
<div class="bar">
  <b>BUR</b><span class="sp"></span>
  <span class="cnt"><span class="l en">Records read</span><span class="l uz">O‘qilgan yozuvlar</span><span class="l ru">Прочитано записей</span>&nbsp;</span><span><b id="count">0</b> / 33</span>
  <div class="lang" role="group" aria-label="Language">
    <button data-l="en" aria-pressed="false">EN</button>
    <button data-l="uz" aria-pressed="true">UZ</button>
    <button data-l="ru" aria-pressed="false">RU</button>
  </div>
</div>

<header class="hero">
  <svg class="seal" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <circle cx="50" cy="50" r="47" stroke="#b08a4a" stroke-width=".6" opacity=".55"/>
    <circle cx="50" cy="50" r="40" stroke="#9d1119" stroke-width=".5" opacity=".7"/>
    <path d="M50 22v56M22 50h56" stroke="#e9e2d3" stroke-width=".5" opacity=".35"/>
    <circle cx="50" cy="50" r="12.5" stroke="#e9e2d3" stroke-width=".7" opacity=".8"/>
    <circle cx="50" cy="50" r="3.2" fill="#9d1119"/>
    <path d="M50 4v8M50 88v8M4 50h8M88 50h8" stroke="#b08a4a" stroke-width=".7"/>
  </svg>
  <div class="kick">{"".join(f'<span class="l {lg}">{e(UI[lg]["mark"])}</span>' for lg in ("en","uz","ru"))}</div>
  <h1><span class="l en">The Index of<br><em>Unquiet Names</em></span><span class="l uz">Bezovta<br><em>nomlar indeksi</em></span><span class="l ru">Индекс<br><em>неспокойных имён</em></span></h1>
  <p class="lede">{''.join(f'<span class="l {lg}">{e(UI[lg]["sub"])}</span>' for lg in ("en","uz","ru"))}</p>
  <div class="meta">
    <span>{''.join(f'<span class="l {lg}">{e(UI[lg]["kicker"])}</span>' for lg in ("en","uz","ru"))}</span>
    <span><b>33</b> records</span>
    <span>42.87° N · 59.98° E</span>
    <span>MMXXVI</span>
  </div>
  <div class="scroll"><i></i><span><span class="l en">Descend to I·01</span><span class="l uz">I·01 dan boshla</span><span class="l ru">Начать с I·01</span></span></div>
</header>
{secs_html}
{unl_html}

<footer>
  <div><b>Bureau of Unquiet Records</b>Vol. IV · Index<br>Tashkent · MMXXVI</div>
  <p class="note">{''.join(f'<span class="l {lg}">{e(UI[lg]["note"])}</span>' for lg in ("en","uz","ru"))}</p>
</footer>

<script>
const IMG = {json.dumps(plates)};
{JS.replace("__IMG__","{}").replace('const IMG = {};','')}
</script>
</body>
</html>"""

# assemble script properly
script = "const IMG = " + json.dumps(plates) + ";\n" + JS.replace("const IMG = __IMG__;\n","")
HTMLDOC = HTMLDOC.replace(HTMLDOC[HTMLDOC.index("<script>"):], "<script>\n" + script + "\n</script>\n</body>\n</html>\n")

open(os.path.join(ROOT, "katalog.html"), "w", encoding="utf-8").write(HTMLDOC)
print("katalog.html", len(HTMLDOC.encode()) // 1024, "KB ·", len(RECORDS), "records")
