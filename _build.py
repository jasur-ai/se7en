#!/usr/bin/env python3
"""Build index.html from _info_template.html.

The page is a single self-contained file: the display font (IM Fell English SC,
SIL OFL 1.1) is inlined as a data URI so the page works offline and behind any
CDN without an extra request.

    python3 _build.py
"""
import base64
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent
TPL = ROOT / "_info_template.html"
FONT = ROOT / "_fonts" / "sc.woff2"
OUT = ROOT / "index.html"
PLACEHOLDER = "/*@@FONT@@*/"


def main() -> int:
    tpl = TPL.read_text(encoding="utf-8")
    if PLACEHOLDER not in tpl:
        print("template has no font placeholder", file=sys.stderr)
        return 1
    font_b64 = base64.b64encode(FONT.read_bytes()).decode()
    html = tpl.replace(PLACEHOLDER, font_b64)
    OUT.write_text(html, encoding="utf-8")

    # the page script is the last one; the first is the tiny theme bootstrap
    m = list(re.finditer(r"<script>(.*?)</script>", html, re.S))
    if m:
        (ROOT / "_lab" / ".app.js").write_text(m[-1].group(1), encoding="utf-8")

    print(f"built index.html  {len(html.encode())} bytes  (font {FONT.stat().st_size} -> {len(font_b64)} b64)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
