from PIL import Image, ImageOps, ImageDraw, ImageFilter, ImageEnhance
import random, json, os

SEL = {
 # id: (file, kind, credit)
 "iblis":      ("assets/img/raw/iblis.png","ai","AI reconstruction · dossier plate"),
 "yalmogiz":   ("assets/img/raw/yalmogiz.png","ai","AI reconstruction · dossier plate"),
 "ajina":      ("assets/img/raw/ajina.png","ai","AI reconstruction · dossier plate"),
 "alvasti":    ("assets/img/raw/alvasti.png","ai","AI reconstruction · dossier plate"),
 "dev":        ("assets/img/raw/dev.png","ai","AI reconstruction · dossier plate"),
 "ajdarho":    ("assets/img/raw/ajdarho.png","ai","AI reconstruction · dossier plate"),
 "gulyabani":  ("assets/img/raw/gulyabani.png","ai","AI reconstruction · dossier plate"),
 "obir":       ("assets/img/raw/obir.png","ai","AI reconstruction · dossier plate"),
 "qonaqay":    ("assets/img/raw/qonaqay.png","ai","AI reconstruction · dossier plate"),
 "jin":        ("assets/img/raw/jin.png","ai","AI reconstruction · dossier plate"),
 "almas":      ("image-search/dark-pine-forest-night-fog-silhouette-fi-4.jpg","photo","dreamstime.com"),
 "arvoh":      ("image-search/old-muslim-cemetery-fog-night-graves-eer-2.jpg","photo","vecteezy.com"),
 "suvegesi":   ("image-search/dark-still-water-reeds-night-mysterious--2.jpg","photo","dreamstime.com","matte"),
 "gureamir":   ("image-search/gur-e-amir-mausoleum-samarkand-timur-tom-2.webp","photo","anastasifink.com"),
 "ulugbek":    ("image-search/ulugh-beg-observatory-sextant-undergroun-1.webp","photo","qalam.global / Alamy"),
 "bobur":      ("image-search/babur-mughal-emperor-portrait-miniature--1.jpg","photo","Mughal miniature · Fine Art America","matte"),
 "siyohchoh":  ("image-search/ark-fortress-bukhara-zindan-dungeon-dark-2.jpg","photo","chestnutjournal.com"),
 "kalyan":     ("image-search/kalyan-minaret-bukhara-tower-night-4.jpg","photo","ArtefactPorn / public post","matte"),
  "bibixonim":  ("image-search/bibi-khanym-mosque-facade-samarkand-blue-2.jpg","photo","pexels.com"),
 "mizdakhan":  ("image-search/mizdakhan-necropolis-apocalypse-clock-nu-2.jpg","photo","tourtravelworld.com"),
 "chilpyk":    ("image-search/chilpyk-zoroastrian-tower-of-silence-dak-4.jpg","photo","uz-safar.com"),
 "barsakelmes":("image-search/barsakelmes-aral-sea-salt-desert-dead-la-2.jpg","photo","ancient-origins.net"),
 "kanigut":    ("image-search/abandoned-soviet-mine-tunnel-wooden-supp-3.jpg","photo","istockphoto.com · reference plate"),
 "shaytanjiga":("image-search/shaytan-jiga-valley-of-demons-samarkand--2.jpg","photo","uzbekistan.travel"),
 "moynaq":     ("image-search/moynaq-ship-cemetery-aral-sea-rusting-sh-2.jpg","photo","burabai.kz"),
 "iskanderkul":("image-search/iskanderkul-lake-fann-mountains-tajikist-3.jpg","photo","eurasia.travel"),
}
SINS_IMG = {
 "pride":"iblis","envy":"alvasti","gluttony":"yalmogiz","lust":"ajina",
 "wrath":"ajdarho","greed":"kanigut","sloth":"arvoh"
}

W,H = 1400, 933          # 3:2
random.seed(7)

def duotone(im):
    g = ImageOps.grayscale(im)
    # per-image percentile stretch: this is what was flattening the plates
    g = ImageOps.autocontrast(g, cutoff=(0.4, 0.6))
    lut = []
    for v in range(256):
        x = v/255.0
        x = x*x*(3-2*x)*0.82 + x*0.18      # filmic S-curve
        x = 0.035 + x*0.945                 # slight shadow lift, protect highlights
        x = max(0.0, min(1.0, x))
        r = int(12 + x*(242-12))
        gg= int(10 + x*(235-10))
        b = int(14 + x*(224-14))
        lut.append((r,gg,b))
    return Image.merge("RGB", [
        g.point([c[0] for c in lut]),
        g.point([c[1] for c in lut]),
        g.point([c[2] for c in lut]),
    ])

def damage(im, k=1.0):
    d = ImageDraw.Draw(im, "RGBA")
    w,h = im.size
    # scratches
    for _ in range(int(9*k)):
        x = random.randint(0,w); y0=random.randint(0,h); ln=random.randint(h//6,h)
        a = random.randint(8,26)
        d.line([(x,y0),(x+random.randint(-9,9), y0+ln)], fill=(255,246,232,a), width=1)
    # dust
    for _ in range(int(220*k)):
        x=random.randint(0,w); y=random.randint(0,h); r=random.randint(0,1); a=random.randint(10,60)
        d.ellipse([x,y,x+r,y+r], fill=(255,250,240,a))
    # dark specks
    for _ in range(int(90*k)):
        x=random.randint(0,w); y=random.randint(0,h)
        d.ellipse([x,y,x+1,y+1], fill=(0,0,0,random.randint(40,110)))
    return im

def vignette(im, strength=0.62):
    w,h = im.size
    mask = Image.new("L",(w,h),0)
    dm = ImageDraw.Draw(mask)
    steps = 64
    for i in range(steps+1):
        t = i/steps
        pad_x = int(w*0.5*t); pad_y = int(h*0.5*t)
        v = int(255*(1 - strength*(t**2.2)))
        dm.rectangle([pad_x,pad_y,w-pad_x,h-pad_y], fill=v)
    mask = mask.filter(ImageFilter.GaussianBlur(w//30))
    black = Image.new("RGB",(w,h),(3,2,4))
    return Image.composite(im, black, mask)   # keep image where mask is white (centre)

out = {}
for mid, spec in SEL.items():
    src, kind, credit = spec[0], spec[1], spec[2]
    style = spec[3] if len(spec) > 3 else "cover"
    im = Image.open(src).convert("RGB")
    if style == "matte":
        canvas = Image.new("RGB", (W, H), (9, 8, 10))
        ih = H - 2*46
        iw = int(im.width * ih / im.height)
        if iw > W - 2*90:
            iw = W - 2*90
            ih = int(im.height * iw / im.width)
        small = im.resize((iw, ih), Image.LANCZOS)
        x, y = (W-iw)//2, (H-ih)//2
        canvas.paste(small, (x, y))
        dd = ImageDraw.Draw(canvas, "RGBA")
        dd.rectangle([x-1, y-1, x+iw, y+ih], outline=(190, 178, 158, 70), width=1)
        im = canvas
    else:
        im = ImageOps.fit(im, (W,H), method=Image.LANCZOS, centering=(0.5,0.42))
    im = duotone(im)
    im = damage(im, 1.0 if kind=="photo" else 0.75)
    im = vignette(im, 0.55 if kind=="ai" else (0.10 if style=="matte" else 0.34))
    im = im.filter(ImageFilter.GaussianBlur(0.3))
    for size,suffix in ((W,""),(700,"-s")):
        j = im.resize((size,int(size*H/W)), Image.LANCZOS)
        j.save(f"assets/img/{mid}{suffix}.jpg", quality=84, optimize=True, progressive=True)
    out[mid] = {"kind":kind,"credit":credit,"style":style}
    print("ok", mid, kind, style)

json.dump(out, open("assets/img/manifest.json","w"), indent=1)

# contact sheet of finals
files = [(k, f"assets/img/{k}.jpg") for k in SEL]
cols, cell = 5, 300
rows=(len(files)+cols-1)//cols
sheet = Image.new("RGB",(cols*cell, rows*(cell+20)),(8,7,10))
d=ImageDraw.Draw(sheet)
for i,(k,f) in enumerate(files):
    im=Image.open(f); im.thumbnail((cell-8,cell-8))
    x=(i%cols)*cell+4; y=(i//cols)*(cell+20)+4
    sheet.paste(im,(x,y)); d.text((x+2,y+cell-14),k,fill=(220,214,204))
sheet.save("/tmp/final_sheet.jpg", quality=86)
print("sheet", sheet.size)
