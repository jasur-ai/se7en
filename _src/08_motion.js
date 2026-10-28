/* ═══════════════════════════════════════════════════════════════
   MOTION · the dossier behaves like paper in a room.
   A pointer-driven camera nudges every sheet on its own axis; sheets
   tilt under the cursor with a specular pass; sections arrive out of
   depth rather than sliding in from the side. All of it is damped,
   all of it is skipped under prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

  addEventListener("pointermove", e => {
    pointer.tx = e.clientX / innerWidth;
    pointer.ty = e.clientY / innerHeight;
  }, { passive: true });

  /* ── 1 · camera vars for CSS depth layers ─────────────────── */
  if (!reduce) {
    const tick = () => {
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      root.style.setProperty("--camx", (pointer.x - 0.5).toFixed(4));
      root.style.setProperty("--camy", (pointer.y - 0.5).toFixed(4));
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ── 2 · sheet tilt: the paper leans toward the hand ──────── */
  if (!reduce && matchMedia("(hover: hover)").matches) {
    const MAX = 7.5;
    let current = null, raf = 0;
    const reset = el => {
      el.style.setProperty("--px", "0deg");
      el.style.setProperty("--py", "0deg");
      el.style.setProperty("--shx", "50%");
      el.style.setProperty("--shy", "50%");
    };
    const move = e => {
      const el = current; if (!el) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      const yaw = (nx - 0.5) * MAX * 2;
      const pitch = -(ny - 0.5) * MAX * 2;
      el.style.setProperty("--px", pitch.toFixed(2) + "deg");
      el.style.setProperty("--py", yaw.toFixed(2) + "deg");
      el.style.setProperty("--shx", (nx * 100).toFixed(1) + "%");
      el.style.setProperty("--shy", (ny * 100).toFixed(1) + "%");
    };
    document.addEventListener("pointerover", e => {
      const el = e.target.closest && e.target.closest(".card, .geo, .tl-item");
      if (el === current) return;
      if (current) reset(current);
      current = el || null;
      if (current) move(e);
    }, { passive: true });
    document.addEventListener("pointermove", e => { if (current) move(e); }, { passive: true });
    document.addEventListener("pointerleave", () => { if (current) { reset(current); current = null; } });
  }

  /* ── 3 · section depth: headers and tails parallax ───────── */
  if (!reduce) {
    const heads = [];
    document.querySelectorAll(".band").forEach(b => {
      const n = b.querySelector(".sec-num");
      const w = b.querySelector(".wrap");
      if (w) heads.push({ b, n, w, top: 0 });
    });
    let raf2 = 0, tickN = 0, seen = false;
    const loop = () => {
      raf2 = requestAnimationFrame(loop);
      if ((tickN++ & 1)) return;                 // 30 Hz is enough for parallax
      const vh = innerHeight;
      seen = false;
      for (const h of heads) {
        const r = h.b.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        seen = true;
        const p = Math.max(-1, Math.min(1, (r.top + r.height * 0.5 - vh * 0.5) / vh));
        if (h.n) h.n.style.transform = "translate3d(0," + (p * 42).toFixed(1) + "px,0)";
      }
      // nothing of the dossier is on screen: stop measuring anything
      if (!seen) { cancelAnimationFrame(raf2); raf2 = 0; }
    };
    raf2 = requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf2);
      else raf2 = requestAnimationFrame(loop);
    });
  }

  /* ── 4 · cinematic entry ──────────────────────────────────────
     the click is handled once, in 05_app.js — a second listener here
     used to add .opening first and make the real handler bail out. */

  /* ── 5 · headings are cut in, letter by letter ─────────────── */
  window.cutHeadings = () => {
    document.querySelectorAll(".sec-titles h2").forEach(h => {
      const plain = h.textContent.replace(/\s+/g, " ").trim();
      if (!plain || h.querySelector(".ch")) return;
      h.setAttribute("aria-label", plain);
      /* one span per letter, but the letters of a word travel glued
         together: a phone screen is narrow, and a per-letter inline-block
         lets the line break inside "INSTRUMENTS". */
      let i = 0;
      h.innerHTML = plain.split(" ").map(word =>
        '<span class="wd">' + Array.from(word).map(c =>
          '<span class="ch" style="--i:' + (i++) + '">' + (c === "<" ? "&lt;" : c) + "</span>").join("") + "</span>"
      ).join(" ");
    });
  };
  const run = () => window.cutHeadings();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();

  /* ── 5b · the bar on a phone ──────────────────────────────────
     a fixed 56px header over a 664px screen eats a tenth of the page.
     it stays while you read upward, and steps aside when you move down. */
  (function smartBar(){
    if (!matchMedia("(max-width: 860px)").matches) return;
    let last = scrollY, ticking = false, hidden = false;
    const apply = () => {
      const y = scrollY;
      const down = y > last + 6, up = y < last - 6;
      if (y < 120 && hidden){ hidden = false; document.body.classList.remove("bar-hide"); }
      else if (down && y > 200 && !hidden){ hidden = true; document.body.classList.add("bar-hide"); }
      else if (up && hidden){ hidden = false; document.body.classList.remove("bar-hide"); }
      last = y; ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking){ ticking = true; requestAnimationFrame(apply); } }, { passive: true });
  })();

  /* ── 6 · reveal safety net ─────────────────────────────────────
     IntersectionObserver misses elements when the page is jumped
     (nav anchors, restored scroll position, deep links): the target
     lands inside the viewport without ever crossing its edge, so a
     whole section header can stay invisible. Sweep on scroll and on
     hash change and reveal anything that is actually on screen. */
  (function revealSafetyNet(){
    let raf = 0;
    const sweep = () => {
      raf = 0;
      const vh = innerHeight || 800;
      document.querySelectorAll("[data-reveal]:not(.in)").forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.94 && r.bottom > -40) el.classList.add("in");
      });
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(sweep); };
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue, { passive: true });
    addEventListener("hashchange", () => setTimeout(queue, 80));
    document.addEventListener("click", e => {
      if (e.target.closest('a[href^="#"]')) setTimeout(queue, 120);
    }, true);
    setTimeout(queue, 300);
  })();
})();
