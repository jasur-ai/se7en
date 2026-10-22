# -*- coding: utf-8 -*-
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "_src"))
from katalog_data import RECORDS, CLASSES
rows = {}
for r in RECORDS:
    c = CLASSES[r["cls"]]["code"]
    rows[r["id"]] = {"code": "%s·%s" % (c, r["no"]),
                     "en": r["en"][0], "uz": r["uz"][0], "ru": r["ru"][0]}
js = ("/* DREAD DESIGNATIONS — generated from _src/katalog_data.py by _gen_dread.py.\n"
      "   Case codes and names are an editorial construction. */\n"
      "const DREAD = " + json.dumps(rows, ensure_ascii=False, indent=0) + ";\n")
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "_src", "04b_dread.js"), "w", encoding="utf-8").write(js)
print("dread rows:", len(rows))
