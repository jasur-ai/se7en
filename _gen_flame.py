#!/usr/bin/env python3
"""Regenerate the baked flame plate (assets/intro/flame.webp) and inline it
into _src/14_fire.css. Pure numpy; no samples, nothing to license."""
from PIL import Image, ImageFilter
import numpy as np, base64, io, os, random, re

ROOT = os.path.dirname(os.path.abspath(__file__))
W, H = 1400, 900
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

def tongue(cx, w, h, base_y, seed):
    rnd = random.Random(seed)
    t = np.clip((base_y - yy) / h, 0, 1)
    sway = np.sin(t * 2.4 + rnd.random() * 6) * w * 0.20 * t
    xr = w * (1 - t ** 1.7) * (0.55 + 0.45 * np.cos(t * 3.1))
    dx = np.abs(xx - (cx + sway))
    f = np.clip(1 - dx / np.maximum(xr, 1), 0, 1) * np.clip(1 - t, 0, 1)
    return f ** 1.4

flame = np.zeros((H, W), np.float32)
rnd = random.Random(7)
for i in range(26):
    flame = np.maximum(flame, tongue(rnd.uniform(-60, W + 60), rnd.uniform(50, 150),
                                     rnd.uniform(220, 640), H, i))

glow = np.exp(-((yy - H) / 220) ** 2) * 0.9
glow *= np.clip(1 - np.abs(xx - W / 2) / (W * 0.62), 0, 1) ** 0.4
mass = np.clip(flame * 1.15 + glow * 0.8, 0, 1)

# deep blood-orange, almost no white: white cores go green under screen
core = np.clip(mass ** 3.4, 0, 1)
mid = np.clip(mass ** 1.5, 0, 1) * (1 - core * 0.7)
r = np.clip(core * 0.95 + mid * 0.92 + mass * 0.10, 0, 1)
g = np.clip(core * 0.46 + mid * 0.22 + mass * 0.01, 0, 1)
b = np.clip(core * 0.10 + mid * 0.015, 0, 1)
alpha = np.clip(mass * 1.25, 0, 1) ** 0.8

rgb = np.dstack([r, g, b]) * 0.80        # baked exposure: no runtime filter
im = Image.fromarray((np.dstack([rgb, alpha]) * 255).astype('uint8'), 'RGBA')
im = im.filter(ImageFilter.GaussianBlur(6)).resize((880, 566), Image.LANCZOS)

buf = io.BytesIO()
im.save(buf, 'WEBP', quality=74, method=6, alpha_quality=70)
data = buf.getvalue()
open(os.path.join(ROOT, 'assets/intro/flame.webp'), 'wb').write(data)
print('flame.webp', im.size, len(data) // 1024, 'KB')

css_path = os.path.join(ROOT, '_src/14_fire.css')
css = open(css_path, encoding='utf-8').read()
css = re.sub(r'data:image/webp;base64,[A-Za-z0-9+/=]+',
             'data:image/webp;base64,' + base64.b64encode(data).decode(), css)
open(css_path, 'w', encoding='utf-8').write(css)
print('14_fire.css', os.path.getsize(css_path) // 1024, 'KB')
