# YETTI — gunoh va fazilat

A single-page reference in three languages (Uzbek · English · Russian): the seven
classical vices, each set against its reversal — one of the seven virtues — with a
local practice from Central Asian tradition and a source line for every entry.

**Live:** https://se7en-omega.vercel.app/

## What it is

* **7 pairs** — Superbia · Avaritia · Luxuria · Ira · Gula · Invidia · Acedia, and
  their reversals: humility, generosity, chastity, patience, temperance,
  goodwill, diligence.
* **Three languages**, switchable in the bar; the choice is remembered.
* **12 sources** — Gregory the Great (*Moralia in Job*, XXXI.xlv), Aquinas,
  the Catechism § 1866, Ṣaḥīḥ al-Bukhārī 2766, Ṣaḥīḥ Muslim 89 and 91, Qur'anic
  passages, Bahouddin Naqshband, the Uzbek proverb collection, Dante.
* **One file, no dependencies** — no external scripts, fonts, images, analytics
  or advertising. Font inlined as WOFF2 (IM Fell English SC, SIL OFL 1.1).

## Editorial rules

1. No claim without a source; every entry ends with a source line.
2. Neutral register: description, not horror, not religious ruling.
3. Sensitive historical material is out of scope — the page carries no accounts of
   violence, disaster, persecution, burial sites or ethnic characterisation.
4. The Latin list is used as a literary frame; the note under the table states
   plainly that the Islamic tradition counts a different seven.

## Build

```bash
python3 _build.py          # _info_template.html + _fonts/sc.woff2  ->  index.html
```

Everything lives in `_info_template.html` (styles, text in three languages,
renderer). `_build.py` only inlines the font.

## Deploy

Push to `main` — GitHub Actions runs `vercel deploy --prod` (see `DEPLOY.md`).

## Files

| path | what |
|---|---|
| `index.html` | the built page (the only file the site serves) |
| `_info_template.html` | source of the page |
| `_build.py` | build step |
| `_fonts/sc.woff2` | display face, inlined at build time |
| `_lab/` | audit scripts (`_phone.js` phone layout + taps, `_info_shot*.js` screenshots) |
| `_arxiv/` | the previous project (unpublished, not in git) — kept locally only |

`_arxiv/` is git-ignored. It holds the earlier dossier build, its sources and
scripts; nothing in it is served. Delete it with `rm -rf _arxiv` once you are
sure you will not need the old material.
