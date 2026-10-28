/* ═══════════════════════════════════════════════════════════════
   INSCRIBED NAMES · the archive spelling
   On the plates a name is cut the way the 19th-century Orientalists
   cut it: macron for vowel length, gh for غ / g‘, w for و / v, and a
   dotless q where the throat closes. The living spelling is given
   under it, in the same breath. Editorial construction, like the codes.
   ═══════════════════════════════════════════════════════════════ */
const ORTHO = {
  iblis:"Iblīs", yalmogiz:"Yalmōghiz", ajina:"Ājinnā", alvasti:"Alwāstī",
  dev:"Dēw", ajdarho:"Azhdarhā", gulyabani:"Ghūlyabānī", obir:"Ōbir",
  qonaqay:"Qōnaqāy", jin:"Jinn", suvegesi:"Sūw Egāsī", arvoh:"Arwōh",
  almas:"Almās",
  gureamir:"Gūr-i Amīr", ulugbek:"Ulūgh Bēg", bobur:"Bābūr",
  siyohchoh:"Siyōh Chōh", kalyan:"Kalyān", bibixonim:"Bibī Khānim",
  mizdakhan:"Mizdakhān", chilpyk:"Chilpiq", barsakelmes:"Bārsa-Kelmes",
  kanigut:"Kān-i Gūt", shaytanjiga:"Shaytān Jīga", moynaq:"Mōynaq",
  iskanderkul:"Iskandarkūl"
};

/* the same hand applied to the trait lines, so one plate reads as one cut */
function inscribeText(s){
  return String(s || "")
    .replace(/o‘/g, "ō").replace(/O‘/g, "Ō")
    .replace(/g‘/g, "gh").replace(/G‘/g, "Gh")
    .replace(/x/g, "kh").replace(/X/g, "Kh")
    .replace(/v/g, "w").replace(/V/g, "W");
}

/* ── worn type: each letter sits a fraction off its baseline, as if the
      plate had been cut by hand and then printed twice. Deterministic,
      so a name looks the same every time it is opened. ── */
const MACRON = "āēīōūĀĒĪŌŪ";
function letterMark(i, ch){
  const h = (i * 37 + ch.codePointAt(0) * 13) % 1000;
  let y = ((h % 7) - 3) * 0.22;
  let s = 0.975 + (h % 5) * 0.012;
  let r = (((h / 7 | 0) % 5) - 2) * 0.35;
  if (MACRON.indexOf(ch) >= 0) { s += 0.035; y -= 0.7; r *= 0.4; }
  return { y: y.toFixed(2), s: s.toFixed(3), r: r.toFixed(2) };
}
function namePlain(m){
  const d = (typeof DREAD !== "undefined") ? DREAD[m.id] : null;
  if (lang === "uz") return ORTHO[m.id] || (d && d.uz) || L(m).name;
  return ORTHO[m.id] || (d && d.en) || L(m).name;
}
function inscribe(str, cls){
  const out = [];
  const chars = Array.from(String(str));
  for (let i = 0; i < chars.length; i++){
    const ch = chars[i];
    if (ch === " ") { out.push(" "); continue; }
    const k = letterMark(i, ch);
    out.push('<i style="--y:' + k.y + 'px;--s:' + k.s + ';--r:' + k.r + 'deg">' + esc(ch) + '</i>');
  }
  return '<span class="insc' + (cls ? " " + cls : "") + '" aria-hidden="true">' + out.join("") + '</span>';
}
function nameHTML(m){
  return inscribe(namePlain(m));
}
