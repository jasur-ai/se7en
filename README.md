# THE SEVEN — Dark Myths of Central Asia

A single-file, self-contained premium website: 26 dark Central Asian myths
(13 entities · 6 historical curses · 7 sites), scored against the seven deadly sins.
Dark crimson art direction, trilingual interface (EN default · UZB · RUS),
synthesised ambient score with per-sin retuning, and an optional master track.

## Files

| path | what it is |
|---|---|
| `index.html` | the whole site — CSS, JS, data, glyphs and all 26 plates inline (≈950 KB). Open it anywhere. |
| `katalog.html` | **The Index of Unquiet Names** — 33 classified records with plates, case codes, Latin designations, signals and standing instructions (EN/UZ/RU). Self-contained. |
| `assets/audio/README.txt` | how to drop in your own audio files |
| `_src/` | the same site split into build parts, for future edits |
| `build.sh` | rebuilds `index.html` from `_src/` |
| `_build_katalog.py` | rebuilds `katalog.html` from `_src/katalog_data.py` + `assets/img/` |
| `_img.py` | re-grades every plate from `image-search/` or `assets/img/raw/` |

## Sections

1. **Hero** — full-screen sigil, live counters.
2. **The Seven** — the seven sins as instruments, with live regional totals.
3. **Bestiary** — 13 entities, filterable by sin, index score per card.
4. **Curses** — 6 documented historical events (Gur-e Amir 1941, Ulugh Beg, Babur, Siyoh Choh, Kalyan, Bibi-Khanym).
5. **Geography** — 7 sites with coordinates (Mizdakhan, Chilpyk, Barsakelmes, Kan-i-Gut, Shaytan Jiga, Moynaq, Iskanderkul).
6. **Matrix** — 26 × 7 heat matrix, click a row for the entry, click a sin header to jump to its strongest myth.
7. **Doctrine** — six frameworks (Evagrius → Kubro) and the Uzbek terminology correction.
8. **Craft** — six formats, three non-negotiable rules.
9. **Sources** — academic / oral / press, always separated.

## The Index of Unquiet Names (`katalog.html`)

A second, standalone dossier. Every entry in `index.html` now carries a **dread
designation** — an archival case code (`I·04`) and a formal name ("The Lung-Thief" /
"O'pka o'g'risi" / "Похитительница лёгких") — and `katalog.html` is the full index:

* **Class I · Incarnata** (13 entities) · **Class II · Hereditaria** (6 curses) ·
  **Class III · Locata** (7 sites) · **Class IV · Registrum** (the 7 sins).
* Each record: plate, case code, Latin binomial, dread name, *signal* (what is reported),
  *standing instruction* (collapsed until opened), sin-signature bars, plate credit.
* Trilingual EN / UZB / RUS, remembered between visits.
* Click a record to mark it read. When all **33** are read, a 34th record appears that
  the Bureau insists does not exist.

The Bureau, the codes and the Latin names are an **editorial device** invented for this
dossier. The folklore, dates, places and sources are not — they are the same ones cited
in `index.html` → Sources.

## Image plates

26 plates in `assets/img/` (1400×933 master, 700 px web, 560 px index, 520 px drawer),
all graded to one duotone/grain/vignette treatment by `_img.py`:

* **10 AI reconstructions** for the entities that have no photograph (Iblis, Yalmog'iz,
  Ajina, Alvasti, Dev, Ajdarho, Gulyabani, O'bir, Qo'naqay, Jin) — labelled as
  *AI reconstruction · dossier plate*, never presented as evidence.
* **16 archive photographs** of real places and objects, credited in
  `assets/img/manifest.json` and on each plate.

## Interaction

* **Language** — EN / UZB / RUS; the choice is remembered, and the whole content set (not just the labels) switches.
* **Drawer** — click any card, row or timeline item: lore, mode of harm, ward, provenance, sin profile, sources.
* **Audio** — entry starts the bed. Hover the dock for the volume slider. Sound button in the top bar toggles it.
* **Keyboard** — Enter/Space opens focused cards, Esc closes the drawer.

## Adding your own music

1. Put your licensed file at `assets/audio/red-sex.mp3`.
2. Optional per-sin tracks: `01-pride.mp3` … `07-sloth.mp3`.
3. Nothing else to change — the player picks them up. Without files it plays the
   built-in synthesised bed, so the site never sounds empty.

## Editing content

All content lives in `_src/03_data_core.js` (`SINS`, `MYTHS`) and `_src/04_data_extra.js`
(`DOCTRINE`, `TERMS`, `CRAFT`, `RULES`, `SOURCES`). Every entry carries `en`, `uz`, `ru`
blocks plus a `scores` array in the order
`[Pride, Envy, Gluttony, Lust, Wrath, Greed, Sloth]`.
Then run `./build.sh`.

## Notes

* Fully responsive (390 px → 1440 px verified), reduced-motion aware, keyboard accessible.
* No external fonts, scripts, images or trackers — it renders identically offline.
* Myths are presented as cultural record; historical events are separated from later folkloric additions.
