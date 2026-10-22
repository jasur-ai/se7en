#!/usr/bin/env bash
# Rebuild the single-file site from _src parts.
set -euo pipefail
cd "$(dirname "$0")"
{
  cat _src/01_head.html
  cat _src/02_sections.html
  cat _src/05a_style.html
  echo '<script>'
  cat _src/03_data_core.js _src/04_data_extra.js _src/04b_dread.js _src/04c_plates.js _src/05_app.js _src/06_radio.js
  echo '</script></body></html>'
} > index.html
echo "built index.html ($(wc -c < index.html) bytes)"
