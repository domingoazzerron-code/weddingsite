/* Tools slider (tools.html). Progressive enhancement: without this file the
   tools show as plain cards. Upload to the site root next to site.js. */
(function () {
  "use strict";
  var ts = document.getElementById("ts");
  if (!ts) return;
  var row = ts.querySelector(".ts-row");
  var items = [].slice.call(ts.querySelectorAll(".ts-item"));
  var bgs = [].slice.call(ts.querySelectorAll(".ts-bgl"));
  var n = items.length;
  if (!row || !n) return;

  var DWELL = 7500;                                   /* ms each tool stays open on its own */
  var wide = matchMedia("(min-width:960px)");
  var fine = matchMedia("(hover:hover) and (pointer:fine)");
  var reduced = matchMedia("(prefers-reduced-motion:reduce)");

  var tabs = [], cur = 0, fix = 0;
  items.forEach(function (it, i) { if (it.classList.contains("is-on")) cur = i; });

  /* ARIA: tabs + panels (set here so the no-JS version stays plain content) */
  ts.classList.add("ts-js");
  row.setAttribute("role", "tablist");
  row.setAttribute("aria-label", "Tools we use");
  items.forEach(function (it, i) {
    var t = it.querySelector(".ts-hd"), p = it.querySelector(".ts-panel");
    it.setAttribute("role", "presentation");
    t.setAttribute("role", "tab");
    t.setAttribute("aria-controls", p.id);
    p.setAttribute("role", "tabpanel");
    p.setAttribute("aria-labelledby", t.id);
    tabs.push(t);
    t.addEventListener("click", function () { set(i, true); });
  });
  set(cur, false, true);

  function set(i, byUser, quiet) {
    if (byUser) stop();
    if (i === cur && !quiet) return;
    cur = i;
    items.forEach(function (it, j) {
      var on = j === i;
      it.classList.toggle("is-on", on);
      tabs[j].setAttribute("aria-selected", on ? "true" : "false");
      tabs[j].tabIndex = on ? 0 : -1;
      if (bgs[j]) bgs[j].classList.toggle("is-on", on);
    });
    prog = 0; ts.style.setProperty("--p", 0);
    /* phones: the stack reflows while the old card closes, so once it has settled
       bring the opened card back into view if it ended up under the header or off screen */
    if (byUser && !wide.matches && !quiet) {
      clearTimeout(fix);
      fix = setTimeout(function () {
        var r = items[i].getBoundingClientRect();
        if (r.top < 90 || r.top > innerHeight * .6) items[i].scrollIntoView({ behavior: reduced.matches ? "auto" : "smooth", block: "start" });
      }, 720);
    }
  }

  /* keyboard: arrows, Home, End */
  row.addEventListener("keydown", function (e) {
    var k = e.key, to = -1;
    if (k === "ArrowRight" || k === "ArrowDown") to = (cur + 1) % n;
    else if (k === "ArrowLeft" || k === "ArrowUp") to = (cur - 1 + n) % n;
    else if (k === "Home") to = 0;
    else if (k === "End") to = n - 1;
    if (to < 0) return;
    e.preventDefault();
    set(to, true);
    tabs[to].focus();
  });

  /* mouse: hovering a closed card opens it (small delay, so passing over doesn't flicker) */
  var hv = 0;
  items.forEach(function (it, i) {
    it.addEventListener("mouseenter", function () {
      if (!fine.matches || !wide.matches || i === cur) return;
      clearTimeout(hv);
      hv = setTimeout(function () { set(i, false); }, 140);
    });
    it.addEventListener("mouseleave", function () { clearTimeout(hv); });
  });

  /* ---------- gentle auto-advance (desktop, stops for good after a click or key press) ---------- */
  var stopped = false, started = false, holdHover = false, holdFocus = false, holdView = true,
      raf = 0, last = 0, prog = 0;

  function stop() { stopped = true; sync(); }
  function canRun() {
    return started && !stopped && wide.matches && !reduced.matches &&
           !holdHover && !holdFocus && holdView && !document.hidden;
  }
  function tick(now) {
    var dt = now - last; last = now;
    if (dt > 250) dt = 16;                            /* tab was asleep: don't jump */
    prog += dt / DWELL;
    if (prog >= 1) { set((cur + 1) % n, false); }
    else ts.style.setProperty("--p", prog.toFixed(4));
    raf = requestAnimationFrame(tick);
  }
  function sync() {
    var show = started && !stopped && wide.matches && !reduced.matches;
    ts.classList.toggle("ts-auto", show);
    if (canRun()) {
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    } else if (raf) { cancelAnimationFrame(raf); raf = 0; }
  }

  ts.addEventListener("mouseenter", function () { holdHover = true; sync(); });
  ts.addEventListener("mouseleave", function () { holdHover = false; sync(); });
  ts.addEventListener("focusin", function () { holdFocus = true; sync(); });
  ts.addEventListener("focusout", function () { holdFocus = false; sync(); });
  document.addEventListener("visibilitychange", sync);
  [wide, reduced].forEach(function (m) {
    if (m.addEventListener) m.addEventListener("change", sync); else if (m.addListener) m.addListener(sync);
  });
  if ("IntersectionObserver" in window) {
    holdView = false;
    new IntersectionObserver(function (es) { holdView = es[0].isIntersecting; sync(); }, { threshold: .45 }).observe(ts);
  }
  /* start a moment after the page has settled in */
  setTimeout(function () { started = true; sync(); }, 1500);
})();
