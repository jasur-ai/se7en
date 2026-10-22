# -*- coding: utf-8 -*-
"""Build katalog.html — torn-paper dossier, 3D sheets, official YouTube dock."""
import base64, json, os, sys, html, random

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "_src"))
from katalog_data import RECORDS, CLASSES, UNLISTED, UI

ROOT = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(ROOT, "assets", "img")
MAN = json.load(open(os.path.join(IMG, "manifest.json"), encoding="utf-8"))
SCORES = json.load(open(os.path.join(ROOT, "_src", "scores.json")))
RADIO_JS = open(os.path.join(ROOT, "_src", "06_radio.js"), encoding="utf-8").read()

SIN_AB = ["P", "E", "G", "L", "W", "A", "S"]


def b64(pid):
    with open(os.path.join(IMG, pid + "-m.jpg"), "rb") as f:
        return "data:image/jpeg;base64," + base64.b64encode(f.read()).decode()


plates = {}
for r in RECORDS:
    if r["plate"] not in plates:
        plates[r["plate"]] = b64(r["plate"])


def e(s):
    return html.escape(s, quote=False)


def L(key):
    return "".join(f'<span class="l {lg}">{e(UI[lg][key])}</span>' for lg in ("en", "uz", "ru"))


IDX = {"en": 0, "uz": 1, "ru": 2}


def tri(t, tag, cls=""):
    def get(lg):
        return t[lg] if isinstance(t, dict) else t[IDX[lg]]
    return "".join(f'<{tag} class="l {lg} {cls}">{e(get(lg))}</{tag}>' for lg in ("en", "uz", "ru"))


# ── torn paper silhouettes ────────────────────────────────────────────
def torn(seed, jit=0.55, nick=0.10, n=30):
    """Return a clip-path polygon string with deckled (hand-torn) edges."""
    rnd = random.Random(seed)
    pts = []

    def run(x0, y0, x1, y1, axis):
        for i in range(n):
            t = i / n
            x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
            j = rnd.gauss(0, jit)
            if rnd.random() < nick:
                j += rnd.choice((-1, 1)) * rnd.uniform(1.1, 2.3)
            if axis == "x":
                x += j
            else:
                y += j
            pts.append((max(0.25, min(99.75, x)), max(0.25, min(99.75, y))))

    run(0, 0, 100, 0, "y")        # top  → jitter y
    run(100, 0, 100, 100, "x")    # right→ jitter x
    run(100, 100, 0, 100, "y")    # bottom
    run(0, 100, 0, 0, "x")        # left
    return "polygon(" + ",".join(f"{x:.2f}% {y:.2f}%" for x, y in pts) + ")"


def tilt(seed):
    rnd = random.Random(seed * 7 + 3)
    return (round(rnd.uniform(1.2, 2.8), 2), round(rnd.uniform(-2.6, -0.8), 2),
            round(rnd.uniform(-0.6, 0.6), 2))


# ── records ───────────────────────────────────────────────────────────
out = []
for rec in RECORDS:
    c = CLASSES[rec["cls"]]
    code = "%s·%s" % (c["code"], rec["no"])
    credit = MAN[rec["plate"]]["credit"]
    kind = "" if MAN[rec["plate"]]["kind"] == "ai" else "Archive photograph · "
    name = "".join(f'<span class="l {lg} nm">{e(rec[lg][0])}</span>' for lg in ("en", "uz", "ru"))
    sig = "".join(f'<p class="l {lg} sig">{e(rec[lg][1])}</p>' for lg in ("en", "uz", "ru"))
    ins = "".join(f'<p class="l {lg} ins">{e(rec[lg][2])}</p>' for lg in ("en", "uz", "ru"))

    sc = SCORES.get(rec["id"])
    prof = ""
    if sc:
        bars = "".join(f"<i style=\"--v:{v}\"></i>" for v in sc)
        ticks = "".join(f"<b>{a}</b>" for a in SIN_AB)
        prof = (f'<div class="prof"><div class="lab">{L("sigprof")}</div>'
                f'<div class="bars">{bars}</div><div class="ticks">{ticks}</div></div>')

    seed = sum(ord(ch) for ch in rec["id"]) + rec["cls"] * 31 + int(rec["no"])
    tx, ty, rz = tilt(seed)

    out.append(f'''
<article class="rec" data-id="{rec['id']}" data-cls="{rec['cls']}" tabindex="0" aria-expanded="false"
         style="--tx:{tx}deg;--ty:{ty}deg;--rz:{rz}deg;--clip:{torn(seed)}">
  <div class="sheet" style="clip-path:{torn(seed)}">
    <div class="fibre"></div>
    <div class="print">
      <img data-src="{rec['plate']}" alt="">
      <span class="tape tl"></span><span class="tape tr"></span>
      <span class="pno">{code}</span>
    </div>
    <div class="body">
      <div class="row"><span class="cls">{c['lat']}</span><span class="dots"></span><span class="no">{code}</span></div>
      <div class="lat">{rec['lat']}</div>
      <div class="sub"><i>{e(rec['sub'])}</i></div>
      <h3>{name}</h3>
      <div class="field"><div class="lab">{L('sig')}</div>{sig}</div>
      <div class="toggle"><span class="lab">{L('rule')}</span></div>
      <div class="rule">{ins}</div>
      {prof}
      <div class="credit">{kind}{e(credit)}</div>
    </div>
    <div class="stampbox">{code}</div>
  </div>
</article>''')

# ── sections ──────────────────────────────────────────────────────────
secs = []
for n, c in CLASSES.items():
    body = "".join(x for x in out if f'data-cls="{n}"' in x)
    secs.append(f'''
<section class="cls-sec" id="cls{n}">
  <header class="cls-head">
    <div class="tab"><span>{c['lat']}</span></div>
    <h2>{"".join(f'<span class="l {lg} cn">{e(c[lg][0])}</span>' for lg in ("en", "uz", "ru"))}</h2>
    <p class="cls-desc">{"".join(f'<span class="l {lg} cd">{e(c[lg][1])}</span>' for lg in ("en", "uz", "ru"))}</p>
  </header>
  <div class="recs">{body}</div>
</section>''')
secs_html = "".join(secs)

unl = UNLISTED
unl_html = f'''
<section class="cls-sec unlisted" id="cls0" aria-hidden="true">
  <header class="cls-head">
    <div class="tab burnt"><span>CLASSIS ∅ · NON ENUMERATA</span></div>
    <h2>{"".join(f'<span class="l {lg} cn">{e(unl[lg][0])}</span>' for lg in ("en", "uz", "ru"))}</h2>
  </header>
  <article class="rec" data-id="unlisted" style="--tx:2.2deg;--ty:-1.6deg;--rz:-0.4deg">
    <div class="sheet charred" style="clip-path:{torn(999, jit=1.15, nick=0.22)}">
      <div class="fibre"></div>
      <div class="print dead"><div class="static"></div><span class="pno">{unl['code']}</span></div>
      <div class="body">
        <div class="row"><span class="cls">NOMEN QUOD NEMO POSUIT</span><span class="dots"></span><span class="no">{unl['code']}</span></div>
        <div class="lat">{unl['lat']}</div>
        <div class="sub"><i>{e(unl['sub'])}</i></div>
        <h3>{''.join(f'<span class="l {lg} nm">{e(unl[lg][0])}</span>' for lg in ("en","uz","ru"))}</h3>
        <div class="field"><div class="lab">{L('sig')}</div>{''.join(f'<p class="l {lg} sig">{e(unl[lg][1])}</p>' for lg in ("en","uz","ru"))}</div>
        <div class="rule always">{''.join(f'<p class="l {lg} ins">{e(unl[lg][2])}</p>' for lg in ("en","uz","ru"))}</div>
      </div>
      <div class="stampbox">{unl['code']}</div>
    </div>
  </article>
</section>'''

CSS = r"""
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#241c14; --ink-2:#3b2f22; --ink-soft:#5d4c37; --ink-faint:#8a7557;
  --paper:#e9dfc6; --paper-2:#ddcfae; --red-ink:#8c1a17; --red-bright:#a51d19;
  --desk:#0b0908; --bone:#e9e2d3; --gild:#b08a4a;
  --serif:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,"Times New Roman",serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
  --type:"Courier New",Courier,var(--mono);
}
html{background:#08070a;color:var(--bone);scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:var(--serif);font-size:16px;line-height:1.62;overflow-x:hidden;
  background:
    radial-gradient(1200px 780px at 18% -8%, rgba(255,206,140,.11), transparent 62%),
    radial-gradient(900px 640px at 88% 104%, rgba(140,26,23,.10), transparent 68%),
    repeating-linear-gradient(92deg, rgba(255,255,255,.014) 0 2px, transparent 2px 7px),
    linear-gradient(#14110d, #0b0908 55%, #08070a);
  background-attachment:fixed}
body:before{content:"";position:fixed;inset:0;pointer-events:none;z-index:60;opacity:.34;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.86' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")}
body:after{content:"";position:fixed;inset:0;pointer-events:none;z-index:61;
  background:radial-gradient(circle at 50% 42%, transparent 30%, rgba(0,0,0,.62) 100%)}
::selection{background:#7d1512;color:#fff5e6}

.l{display:none}
html[data-lang="en"] .l.en,html[data-lang="uz"] .l.uz,html[data-lang="ru"] .l.ru{display:revert}
.rec h3 .nm{display:none}
html[data-lang="en"] .rec h3 .nm.en,html[data-lang="uz"] .rec h3 .nm.uz,html[data-lang="ru"] .rec h3 .nm.ru{display:block}

/* ── bar ─────────────────────────────────────────── */
.bar{position:fixed;top:0;left:0;right:0;z-index:70;display:flex;align-items:center;gap:16px;
  padding:11px clamp(14px,3vw,38px);background:rgba(9,8,7,.9);backdrop-filter:blur(9px);
  border-bottom:1px solid rgba(233,226,211,.10);font-family:var(--mono);font-size:9px;
  letter-spacing:.22em;text-transform:uppercase;color:#8b8274}
.bar b{color:var(--bone);font-weight:400}
.bar .sp{flex:1}
.bar .lang{display:flex;gap:2px;border:1px solid rgba(233,226,211,.14);padding:2px}
.bar .lang button{background:none;border:0;color:#8b8274;font:inherit;letter-spacing:.16em;
  padding:5px 8px;cursor:pointer;transition:.25s}
.bar .lang button[aria-pressed="true"],.bar .lang button[aria-pressed="true"]:hover{background:var(--paper);color:#14100d}
.bar .lang button:hover{color:var(--bone)}
.meter{position:fixed;top:0;left:0;height:2px;background:var(--red-bright);width:0;z-index:71;
  box-shadow:0 0 14px rgba(165,29,25,.9);transition:width .5s ease}

/* ── hero ────────────────────────────────────────── */
.hero{min-height:100svh;display:flex;flex-direction:column;justify-content:center;
  padding:120px clamp(18px,6vw,80px) 80px;position:relative;max-width:1240px;margin:0 auto}
.seal{width:60px;height:60px;margin-bottom:30px;opacity:.85}
.kick{font-family:var(--mono);font-size:9.5px;letter-spacing:.4em;text-transform:uppercase;color:var(--red-bright);margin-bottom:24px}
h1{font-size:clamp(36px,8vw,102px);line-height:.95;font-weight:400;letter-spacing:-.022em;max-width:16ch;color:#f1e9d8}
h1 em{font-style:italic;color:#c9bda4}
.hero .lede{max-width:52ch;color:#b6ab97;font-size:clamp(15px,1.5vw,18px);margin-top:28px;line-height:1.66}
.hero .meta{display:flex;flex-wrap:wrap;gap:24px;margin-top:48px;font-family:var(--mono);font-size:9px;
  letter-spacing:.2em;text-transform:uppercase;color:#6a6058;border-top:1px solid rgba(233,226,211,.1);padding-top:16px}
.hero .meta b{color:#d8cdba;font-weight:400}
.scroll{position:absolute;bottom:26px;left:clamp(18px,6vw,80px);font-family:var(--mono);font-size:9px;
  letter-spacing:.32em;text-transform:uppercase;color:#6a6058;display:flex;align-items:center;gap:12px}
.scroll i{display:block;width:44px;height:1px;background:var(--red-ink);animation:pull 2.6s infinite ease-in-out}
@keyframes pull{0%,100%{transform:scaleX(.3);transform-origin:left;opacity:.4}50%{transform:scaleX(1);opacity:1}}

/* ── class sections ──────────────────────────────── */
.cls-sec{max-width:1260px;margin:0 auto;padding:56px clamp(14px,5vw,72px) 20px;position:relative}
.cls-head{max-width:740px;margin:34px 0 46px}
.tab{display:inline-block;padding:7px 20px 9px;margin-bottom:16px;position:relative;
  font-family:var(--type);font-size:9px;letter-spacing:.3em;color:#4a3c2b;text-transform:uppercase;
  background:linear-gradient(180deg,#e6d9bb,#d8c8a3);
  clip-path:polygon(2% 0,98% 1%,100% 12%,99% 100%,1% 99%,0 14%);
  box-shadow:0 8px 18px -10px #000}
.tab.burnt{background:linear-gradient(180deg,#3a2a1c,#241a12);color:#c9a06a}
.cls-head h2{font-size:clamp(26px,3.5vw,42px);font-weight:400;letter-spacing:-.01em;line-height:1.06;color:#f0e7d5}
.cls-desc{color:#9d9284;margin-top:12px;max-width:56ch;font-size:15.5px}

/* ── the sheet ───────────────────────────────────── */
.recs{display:flex;flex-direction:column;gap:clamp(34px,4.4vw,64px);padding-bottom:40px}
.rec{perspective:1700px;cursor:pointer;outline:none;position:relative;filter:drop-shadow(0 26px 34px rgba(0,0,0,.62))}
.rec:before{content:"";position:absolute;inset:0;z-index:0;background:linear-gradient(158deg,#c9b795,#b6a17b);
  clip-path:var(--clip,inherit);transform:rotateX(var(--tx)) rotateY(var(--ty)) rotateZ(var(--rz)) translateZ(-7px);
  transition:transform .8s cubic-bezier(.2,.7,.2,1)}
.rec:hover:before{transform:rotateX(0) rotateY(0) rotateZ(0) translateZ(18px) scale(1.008)}
.sheet{z-index:1}
.rec:focus-visible{filter:drop-shadow(0 0 0 rgba(0,0,0,0)) drop-shadow(0 0 12px rgba(255,190,120,.55))}

.sheet{position:relative;display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1fr);
  gap:clamp(20px,2.8vw,42px);padding:clamp(20px,2.9vw,40px);
  transform:rotateX(var(--tx)) rotateY(var(--ty)) rotateZ(var(--rz));
  transform-style:preserve-3d;transition:transform .8s cubic-bezier(.2,.7,.2,1);
  background:
    radial-gradient(130% 100% at 6% 0%, rgba(255,252,240,.75), transparent 58%),
    radial-gradient(90% 80% at 96% 100%, rgba(139,101,50,.34), transparent 70%),
    radial-gradient(circle at 22% 76%, rgba(150,105,50,.13) 0 2.5px, transparent 3.5px),
    radial-gradient(circle at 74% 22%, rgba(150,105,50,.10) 0 1.8px, transparent 2.8px),
    radial-gradient(circle at 61% 88%, rgba(120,80,35,.11) 0 3px, transparent 4px),
    linear-gradient(158deg,#f0e7d1,#e4d8bb 46%,#d7c7a2);
  box-shadow:inset 0 0 70px rgba(116,86,42,.38), inset 0 0 12px rgba(90,62,26,.28)}
.rec:hover .sheet{transform:rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(26px) scale(1.008)}
.sheet:after{content:"";position:absolute;inset:0;pointer-events:none;z-index:3;mix-blend-mode:multiply;
  opacity:.75;
  background:
    radial-gradient(150% 130% at 46% 48%, transparent 54%, rgba(96,66,28,.30) 92%, rgba(70,46,18,.46) 100%),
    linear-gradient(90deg, transparent 44%, rgba(128,96,48,.05) 49%, rgba(255,252,240,.14) 50%, rgba(128,96,48,.04) 51%, transparent 56%),
    linear-gradient(180deg, rgba(255,255,255,.20), transparent 12%, transparent 88%, rgba(120,88,42,.10))}
.fibre{position:absolute;inset:0;pointer-events:none;opacity:.5;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7 .04' numOctaves='5'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23f)' opacity='.16'/%3E%3C/svg%3E")}

/* printed photograph, taped on */
.print{position:relative;align-self:start;background:#f8f3e6;padding:9px 9px 30px;z-index:4;
  transform:rotate(-1.15deg) translateZ(14px);
  box-shadow:0 18px 26px -12px rgba(40,26,10,.55), 0 2px 0 rgba(255,255,255,.8) inset, 0 -1px 0 rgba(120,92,55,.3) inset;
  border:1px solid rgba(120,92,55,.28)}
.print img{width:100%;display:block;aspect-ratio:3/2;object-fit:cover;
  filter:sepia(.14) saturate(.92) contrast(1.03);opacity:0;transition:opacity .8s,transform 1.4s}
.print img.on{opacity:1}
.rec:hover .print img{transform:scale(1.018)}
.pno{position:absolute;left:9px;bottom:7px;font-family:var(--type);font-size:8px;letter-spacing:.26em;
  color:#6d5b43}
.tape{position:absolute;width:74px;height:22px;background:rgba(206,186,142,.62);
  box-shadow:0 2px 8px rgba(60,40,15,.28);mix-blend-mode:multiply;
  clip-path:polygon(0 6%,100% 0,98% 94%,2% 100%)}
.tape.tl{left:-16px;top:-9px;transform:rotate(-7deg)}
.tape.tr{right:-14px;top:-7px;transform:rotate(5deg)}
.print.dead{background:#100c0a;border-color:rgba(140,26,23,.35);overflow:hidden}
.print.dead .static{position:absolute;inset:0;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='s'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23s)' opacity='.42'/%3E%3C/svg%3E");
  animation:drift 7s steps(6) infinite;opacity:.55}
@keyframes drift{0%{transform:translate3d(0,0,0)}25%{transform:translate3d(-2%,2%,0)}50%{transform:translate3d(2%,-2%,0)}75%{transform:translate3d(-1%,-1%,0)}100%{transform:translate3d(0,0,0)}}

/* ink */
.body{display:flex;flex-direction:column;min-width:0;color:var(--ink);transform:translateZ(8px)}
.row{display:flex;align-items:baseline;gap:9px;font-family:var(--type);font-size:8.2px;letter-spacing:.2em;
  text-transform:uppercase;color:var(--ink-faint)}
.dots{flex:1;border-bottom:1px dotted rgba(90,70,40,.45);transform:translateY(-3px)}
.lat{font-family:var(--type);font-size:clamp(10.5px,1.16vw,13.5px);letter-spacing:.16em;
  color:var(--red-ink);margin-top:12px;word-break:break-word;font-weight:700}
.sub{font-family:var(--type);font-size:9.4px;letter-spacing:.06em;color:var(--ink-faint);margin-top:4px}
.rec h3{font-size:clamp(24px,3vw,36px);font-weight:400;line-height:1.06;letter-spacing:-.012em;
  margin:12px 0 16px;color:#1c150f;text-shadow:0 0 .4px rgba(40,26,12,.55)}
.field .lab,.toggle .lab,.rule .lab,.prof .lab{font-family:var(--type);font-size:8px;letter-spacing:.26em;
  text-transform:uppercase;color:#8f7a56;margin-bottom:5px}
.sig{color:var(--ink-2);font-size:15.2px;line-height:1.62;max-width:56ch;text-shadow:0 0 .35px rgba(40,26,12,.45)}
.toggle{margin-top:14px;cursor:pointer;user-select:none}
.toggle .lab{margin:0;color:#8a7557;transition:.3s;display:inline-block}
.rec:hover .toggle .lab{color:var(--red-ink)}
.toggle .lab:after{content:"  +";color:var(--red-ink)}
.rec.open .toggle .lab:after{content:"  \2212"}
.rule{max-height:0;overflow:hidden;opacity:0;transition:max-height .65s cubic-bezier(.2,.7,.2,1),opacity .45s,margin .45s}
.rec.open .rule{max-height:210px;opacity:1;margin-top:12px}
.rule.always{max-height:none;opacity:1;margin-top:14px}
.ins{color:#1b140e;font-size:14.2px;line-height:1.58;border-left:2px solid var(--red-ink);padding-left:12px;max-width:52ch}

.prof{margin-top:16px;max-width:220px}
.bars{display:flex;align-items:flex-end;gap:4px;height:26px;border-bottom:1px solid rgba(90,70,40,.4);padding-bottom:2px}
.bars i{flex:1;background:linear-gradient(180deg,#a51d19,#6d1310);height:calc(var(--v)*10%);min-height:2px;display:block;opacity:.88}
.rec:hover .bars i{opacity:1}
.ticks{display:flex;gap:4px;margin-top:3px}
.ticks b{flex:1;text-align:center;font-family:var(--type);font-size:7px;letter-spacing:.08em;color:#8f7a56;font-weight:400}
.credit{font-family:var(--type);font-size:7.6px;letter-spacing:.14em;text-transform:uppercase;
  color:#9a8663;margin-top:auto;padding-top:16px}

/* rubber stamp */
.stampbox{position:absolute;right:clamp(16px,2.6vw,34px);top:clamp(14px,2.4vw,30px);
  font-family:var(--type);font-size:10px;letter-spacing:.24em;color:var(--red-ink);
  padding:5px 10px;border:2px solid rgba(140,26,23,.62);outline:1px solid rgba(140,26,23,.34);
  outline-offset:2px;transform:rotate(6deg);opacity:.62;mix-blend-mode:multiply;
  text-transform:uppercase;pointer-events:none}

/* burned 34th */
.sheet.charred{background:linear-gradient(160deg,#231a13,#160f0b 55%,#0d0907);
  box-shadow:inset 0 0 90px rgba(0,0,0,.9), inset 0 0 26px rgba(140,26,23,.16)}
.sheet.charred .fibre{opacity:.24}
.sheet.charred .body,.sheet.charred h3{color:#d9cdb6}
.sheet.charred h3{color:#e6dcc7}
.sheet.charred .lat{color:#b8332c}
.sheet.charred .sig{color:#b8ab94}
.sheet.charred .ins{color:#d3c6b0;border-left-color:#8c1a17}
.sheet.charred .stampbox{color:#a51d19;border-color:rgba(165,29,25,.6);opacity:.8;mix-blend-mode:normal}
.sheet.charred .row,.sheet.charred .sub,.sheet.charred .lab{color:#7d6f5c}
.sheet.charred .dots{border-color:rgba(150,130,100,.3)}
.unlisted{display:none;opacity:0;transition:opacity 2.2s ease}
.unlisted.on{display:block;opacity:1}
.unlisted .rec{cursor:default}

/* footer */
footer{max-width:1260px;margin:0 auto;padding:70px clamp(14px,5vw,72px) 110px;
  border-top:1px solid rgba(233,226,211,.09);display:grid;grid-template-columns:1fr 2fr;gap:36px;
  font-family:var(--mono);font-size:9.3px;letter-spacing:.15em;text-transform:uppercase;color:#5d564c;line-height:2.1}
footer .note{text-transform:none;letter-spacing:.03em;font-family:var(--serif);font-size:13.2px;
  line-height:1.75;color:#7d7466;max-width:66ch}
footer b{color:#b8ad9a;font-weight:400;display:block;margin-bottom:8px;letter-spacing:.26em}
footer a{color:var(--gild);text-decoration:none;border-bottom:1px solid rgba(176,138,74,.35)}
footer a:hover{color:#e2c894}

@media(max-width:880px){
  .sheet{grid-template-columns:1fr;gap:18px}
  .print{transform:rotate(-1.1deg)}
  footer{grid-template-columns:1fr}
  .hero{min-height:auto;padding-top:128px;padding-bottom:80px}
  .rec{filter:drop-shadow(0 18px 22px rgba(0,0,0,.6))}
}
@media(max-width:560px){
  .bar{gap:9px;font-size:8.4px;letter-spacing:.14em}
  .bar .cnt{display:none}
  .stampbox{font-size:8px;padding:4px 7px}
}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto}
  .sheet{transform:none!important}}
"""

JS = r"""
const LANGS = ["en","uz","ru"];

document.querySelectorAll("img[data-src]").forEach(img=>{
  const k = img.getAttribute("data-src");
  if(IMG[k]){ img.src = IMG[k]; img.onload = ()=> img.classList.add("on"); }
});

function setLang(l){
  document.documentElement.setAttribute("data-lang", l);
  document.querySelectorAll(".lang button").forEach(b=>b.setAttribute("aria-pressed", b.dataset.l===l));
  try{ localStorage.setItem("bur-lang", l);}catch(e){}
}
let startLang = "uz";
try{ startLang = localStorage.getItem("bur-lang") || "uz"; }catch(e){}
setLang(startLang);
document.querySelectorAll(".lang button").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.l)));

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
let unveiled = false;
function unveil(){
  if(unveiled) return; unveiled = true;
  const u = document.querySelector(".unlisted");
  setTimeout(()=>{ u.classList.add("on"); u.setAttribute("aria-hidden","false");
    setTimeout(()=>u.scrollIntoView({behavior:"smooth",block:"center"}), 400);
  }, 900);
}
meter();
"""

RADIO_CSS = r"""
/* ── official track: compact chip, expands to the YouTube player ── */
#radio{position:fixed;left:clamp(10px,2vw,22px);bottom:clamp(10px,2vw,22px);z-index:80;
  font-family:var(--mono);display:flex;flex-direction:column-reverse;align-items:flex-start;gap:7px}

#radio .meta{display:flex;align-items:center;gap:0;background:rgba(10,8,7,.94);
  border:1px solid rgba(233,226,211,.20);border-left:2px solid var(--red-ink);
  box-shadow:0 14px 30px -18px #000;backdrop-filter:blur(6px);max-width:min(330px,calc(100vw - 24px))}
#radio .play{display:flex;align-items:center;gap:7px;background:none;border:0;cursor:pointer;
  padding:8px 10px;color:#e0d5c0;font:inherit;font-size:8.4px;letter-spacing:.2em;text-transform:uppercase;
  white-space:nowrap;transition:.25s}
#radio .play:hover{color:#fff;background:rgba(140,26,23,.22)}
#radio .play .dot{width:7px;height:7px;background:var(--red-bright);border-radius:50%;flex:0 0 auto;
  box-shadow:0 0 0 0 rgba(165,29,25,.6)}
#radio.playing .play .dot{animation:pulse 1.8s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(165,29,25,.6)}70%{box-shadow:0 0 0 7px rgba(165,29,25,0)}100%{box-shadow:0 0 0 0 rgba(165,29,25,0)}}
#radio .id{display:none;min-width:0;padding:6px 4px 6px 0}
#radio .id b{display:block;font-size:8.2px;letter-spacing:.18em;text-transform:uppercase;color:#d8cdba;
  font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#radio .id span{display:block;font-size:7.2px;letter-spacing:.1em;color:#6a6058;margin-top:2px;line-height:1.5;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#radio .id a{color:var(--gild);text-decoration:none}
#radio .id a:hover{text-decoration:underline}
#radio .tog{background:none;border:0;border-left:1px solid rgba(233,226,211,.14);color:#8b8274;
  font:inherit;font-size:9px;padding:8px 10px;cursor:pointer;transition:.25s}
#radio .tog:hover{color:#fff;background:rgba(255,255,255,.05)}

#radio .frame{position:relative;width:0;height:0;overflow:hidden;background:#000;border:0;
  transition:width .55s cubic-bezier(.2,.7,.2,1),height .55s cubic-bezier(.2,.7,.2,1),border-color .4s}
#radio .frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}
#radio.expanded .frame{width:min(420px,calc(100vw - 26px));height:min(236px,calc((100vw - 26px)*.5625));
  border:1px solid rgba(233,226,211,.2);box-shadow:0 22px 46px -20px #000}
#radio.expanded .id{display:block}
#radio .plate{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:14px;
  background:linear-gradient(160deg,#171310,#0a0908);z-index:2}
#radio .plate b{font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#e0d5c0;font-weight:400}
#radio .plate{font-size:7.2px;letter-spacing:.16em;text-transform:uppercase;color:#7a7062;line-height:1.9}
#radio.ready .plate{display:none}

@media(max-width:720px){
  #radio{left:8px;bottom:8px}
  #radio .id{display:none !important}
  #radio.expanded .frame{width:calc(100vw - 20px);height:calc((100vw - 20px)*.5625)}
}
"""

HTMLDOC = f"""<!DOCTYPE html>
<html lang="uz" data-lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bezovta nomlar indeksi · The Index of Unquiet Names</title>
<meta name="description" content="Thirty-three Central Asian dread records on torn paper — case codes, Latin designations, signals and standing instructions.">
<style>{CSS}</style>
<style>{RADIO_CSS}</style>
</head>
<body>
<div class="meter"></div>
<div class="bar">
  <b>BUR</b><span class="sp"></span>
  <span class="cnt">{L('count')}&nbsp;</span><span><b id="count">0</b> / 33</span>
  <div class="lang" role="group" aria-label="Language">
    <button data-l="en" aria-pressed="false">EN</button>
    <button data-l="uz" aria-pressed="true">UZ</button>
    <button data-l="ru" aria-pressed="false">RU</button>
  </div>
</div>

<header class="hero">
  <svg class="seal" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <circle cx="50" cy="50" r="47" stroke="#b08a4a" stroke-width=".6" opacity=".55"/>
    <circle cx="50" cy="50" r="40" stroke="#8c1a17" stroke-width=".5" opacity=".7"/>
    <path d="M50 22v56M22 50h56" stroke="#f1e9d8" stroke-width=".5" opacity=".3"/>
    <circle cx="50" cy="50" r="12.5" stroke="#f1e9d8" stroke-width=".7" opacity=".75"/>
    <circle cx="50" cy="50" r="3.2" fill="#8c1a17"/>
    <path d="M50 4v8M50 88v8M4 50h8M88 50h8" stroke="#b08a4a" stroke-width=".7"/>
  </svg>
  <div class="kick">{L('mark')}</div>
  <h1><span class="l en">The Index of<br><em>Unquiet Names</em></span><span class="l uz">Bezovta<br><em>nomlar indeksi</em></span><span class="l ru">Индекс<br><em>неспокойных имён</em></span></h1>
  <p class="lede">{''.join(f'<span class="l {lg}">{e(UI[lg]["sub"])}</span>' for lg in ("en","uz","ru"))}</p>
  <div class="meta">
    <span>{L('kicker')}</span>
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
  <p class="note">{''.join(f'<span class="l {lg}">{e(UI[lg]["note"])}</span>' for lg in ("en","uz","ru"))}
  <br><br>Background: <b>Vessel — “Red Sex”</b> (Punish, Honey, 2014) · Tri Angle Records, published by Mute.
  Played from the rights holders’ official YouTube channel via the YouTube embed — no audio file is hosted here.
  Listen / buy: <a href="https://vesseluk.bandcamp.com/track/red-sex" target="_blank" rel="noopener">Bandcamp</a> ·
  <a href="https://music.apple.com/us/album/punish-honey/903921561" target="_blank" rel="noopener">Apple Music</a>.</p>
</footer>

<script>
const IMG = {json.dumps(plates)};
{JS}
</script>
<script>
{RADIO_JS}
</script>
</body>
</html>"""

open(os.path.join(ROOT, "katalog.html"), "w", encoding="utf-8").write(HTMLDOC)
print("katalog.html", len(HTMLDOC.encode()) // 1024, "KB ·", len(RECORDS), "records")
