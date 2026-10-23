#!/usr/bin/env python3
"""
Regenerate _src/12_room.css from the two source photographs in assets/intro/.

    python3 _grade_room.py

The grade is what makes the room read as a found still rather than a render:
crushed toe, cool-green shadows, dried highlights, vignette, film grain.
The CSS template (plate geometry, overlay coordinates) lives in 12_room.css
itself — this script only swaps the two embedded plates, so hand edits to the
layout survive a re-grade.
"""
from PIL import Image, ImageFilter
import numpy as np, base64, io, os, re, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
CSS = os.path.join(ROOT, "_src", "12_room.css")
SRC = os.path.join(ROOT, "assets", "intro")


def grade(path, W, q):
    im = Image.open(path).convert("RGB")
    im = im.resize((W, round(im.height * W / im.width)), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32) / 255.0

    a = np.clip((a - 0.012) / 0.988, 0, 1)
    a = a ** 1.22
    a = np.clip(a * 0.90 + 0.008, 0, 1)

    lum = (a @ np.array([0.2126, 0.7152, 0.0722], np.float32))[..., None]
    shadow = np.clip(1.0 - lum * 2.2, 0, 1)
    high = np.clip(lum * 2.0 - 0.55, 0, 1)
    a = a * (1 - 0.30 * shadow) + shadow * np.array([0.055, 0.085, 0.075], np.float32) * 0.30
    a = a + high * np.array([0.10, 0.045, -0.03], np.float32) * 0.35

    g = a @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    a = np.clip(g[..., None] + (a - g[..., None]) * 0.86, 0, 1)

    hh, ww = a.shape[:2]
    yy, xx = np.mgrid[0:hh, 0:ww].astype(np.float32)
    r = np.sqrt(((xx - ww / 2) / (ww * 0.62)) ** 2 + ((yy - hh * 0.5) / (hh * 0.78)) ** 2)
    v = np.clip(1.0 - 0.55 * np.clip((r - 0.42) / 0.75, 0, 1) ** 1.6, 0, 1)
    a *= v[..., None]

    rng = np.random.default_rng(7)
    n = rng.normal(0, 1, (hh, ww, 1)).astype(np.float32)
    n = np.asarray(Image.fromarray(((n[..., 0] * .5 + .5) * 255).astype("uint8"))
                   .filter(ImageFilter.GaussianBlur(0.6)), np.float32)[..., None] / 255.0
    a = np.clip(a + (n - 0.5) * 2 * 0.030, 0, 1)

    out = Image.fromarray(np.clip(a * 255, 0, 255).astype("uint8"))
    buf = io.BytesIO()
    out.save(buf, "JPEG", quality=q, optimize=True, progressive=True)
    data = buf.getvalue()
    print("  %-22s %s  %d KB" % (os.path.basename(path), out.size, len(data) // 1024))
    return "data:image/jpeg;base64," + base64.b64encode(data).decode()


def main():
    tpl = open(CSS, encoding="utf-8").read()
    uris = re.findall(r"data:image/jpeg;base64,[A-Za-z0-9+/=]+", tpl)
    if len(uris) != 2:
        sys.exit("expected two embedded plates in 12_room.css, found %d" % len(uris))
    tpl = tpl.replace(uris[0], "@@WIDE@@").replace(uris[1], "@@PORT@@")
    print("grading:")
    wide = grade(os.path.join(SRC, "room.jpg"), 1480, 68)
    port = grade(os.path.join(SRC, "room_portrait.jpg"), 880, 66)
    open(CSS, "w", encoding="utf-8").write(tpl.replace("@@WIDE@@", wide).replace("@@PORT@@", port))
    print("wrote %s (%d KB)" % (os.path.relpath(CSS, ROOT), os.path.getsize(CSS) // 1024))


if __name__ == "__main__":
    main()
