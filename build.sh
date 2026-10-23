#!/usr/bin/env bash
# Rebuild the single-file site from _src parts.
set -euo pipefail
cd "$(dirname "$0")"
{
  awk -v f="_src/00_fonts.css" '
    /\/\*@@FONTS@@\*\// { while ((getline line < f) > 0) print line; next }
    { print }' _src/01_head.html
  cat _src/02_sections.html
  cat _src/05a_style.html
  echo '<style>'
  cat _src/08_dread_type.css _src/09_3d.css _src/11_intro.css _src/12_room.css
  echo '</style>'
  echo '<script>'
  cat _src/03_data_core.js _src/04_data_extra.js _src/04b_dread.js _src/04d_ortho.js _src/04c_plates.js \
      _src/05_app.js _src/06_music.js _src/13_yt.js _src/10_sfx.js _src/11_intro.js _src/07_canvas.js _src/08_motion.js
  echo '</script></body></html>'
} > index.html
echo "built index.html ($(wc -c < index.html) bytes)"
