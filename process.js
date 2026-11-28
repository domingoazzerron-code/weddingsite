/* How we work with you: Premiere Pro style timeline.
   Reads the five steps from the <ol class="steps"> already in index.html (so the text lives in one place),
   builds the editing window, and drives it from the page scroll.
   - Scroll to play. Click a clip to jump. Drag the ruler to scrub. Space plays or pauses.
   - Only does work while something is moving (no always-running loop).
   - On short screens, with reduced motion, or if it would not fit, it falls back to an unpinned layout. */
(function () {
  "use strict";
  var sec = document.getElementById("workflow"),
      list = sec && sec.querySelector("ol.steps"),
      scene = document.getElementById("ppScene"),
      stage = document.getElementById("ppStage"),
      win = document.getElementById("ppWin"),
      cta = sec && sec.querySelector(".pp-cta"),
      cnt = document.getElementById("ppCnt"),
      hint = document.getElementById("ppHint");
  if (!sec || !list || !list.children.length || !scene || !stage || !win || !cta) return;

  var reduceMQ = matchMedia("(prefers-reduced-motion:reduce)"),
      shortMQ = matchMedia("(max-height:640px), (max-width:859px) and (max-height:700px)"),
      FPS = 24, TOTAL = 300, RUN = 17;

  /* ---------- data ---------- */
  var META = [{ l: "Brief", g: 0 }, { l: "Details", g: 0 }, { l: "Editing", g: 1 }, { l: "Final cut", g: 1 }, { l: "Handover", g: 2 }];
  var GROUPS = [{ k: "Your part", t: "V3" }, { k: "Together", t: "V2" }, { k: "Our delivery", t: "V1" }];
  var steps = [].map.call(list.children, function (li, i) {
    var h = li.querySelector("h3"), p = li.querySelector("p"), m = META[i] || {};
    var t = h ? h.textContent.trim() : "Step " + (i + 1);
    return { t: t, h: p ? p.innerHTML : "", l: m.l || t.split(" ")[0], g: m.g != null ? m.g : 0 };
  });
  var N = steps.length;
  if (N > 5) steps.forEach(function (s, i) { s.g = Math.min(2, Math.floor(i * 3 / N)); });

  /* ---------- helpers ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tc(p) {
    var fr = Math.round(p * TOTAL * FPS), s = Math.floor(fr / FPS);
    return pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60) + ":" + pad(fr % FPS);
  }
  function clamp(v, a, b) { return Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, v)); }
  var ic = {
    menu: '<svg viewBox="0 0 16 16"><path d="M3 4.5h10M3 8h10M3 11.5h10"/></svg>',
    eye: '<svg viewBox="0 0 16 16"><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="1.8"/></svg>',
    lock: '<svg viewBox="0 0 16 16"><rect x="3.5" y="7" width="9" height="6.5" rx="1.2"/><path d="M5.5 7V5.2a2.5 2.5 0 015 0V7"/></svg>',
    mic: '<svg viewBox="0 0 16 16"><rect x="6" y="2" width="4" height="7" rx="2"/><path d="M3.5 7.5a4.5 4.5 0 009 0M8 12v2"/></svg>',
    sel: '<svg viewBox="0 0 16 16" class="f"><path d="M4 2.2l8 5.8-3.6.7L7 12.8z"/></svg>',
    trk: '<svg viewBox="0 0 16 16"><path d="M3 4h7M3 8h10M3 12h7M12 2.5l2 1.5-2 1.5"/></svg>',
    rip: '<svg viewBox="0 0 16 16"><path d="M5 3v10M8.5 5L12 8l-3.5 3"/></svg>',
    cut: '<svg viewBox="0 0 16 16"><path d="M8 2v12M4.5 5.5L8 2l3.5 3.5"/></svg>',
    hand: '<svg viewBox="0 0 16 16"><path d="M6 8V3.7a1 1 0 012 0V7m0-2.3a1 1 0 012 0V8m0-2a1 1 0 012 0v3.2A4.3 4.3 0 018 13.5a3.4 3.4 0 01-2.7-1.3L3.2 9.4a1 1 0 011.6-1.2L6 9.6"/></svg>',
    snap: '<svg viewBox="0 0 16 16"><path d="M4 3v5a4 4 0 008 0V3M4 5.5h2.2M9.8 5.5H12"/></svg>',
    link: '<svg viewBox="0 0 16 16"><path d="M6.8 9.2a2.5 2.5 0 003.5 0l2-2a2.5 2.5 0 00-3.5-3.5l-.6.6M9.2 6.8a2.5 2.5 0 00-3.5 0l-2 2a2.5 2.5 0 003.5 3.5l.6-.6"/></svg>',
    play: '<svg class="f pl" viewBox="0 0 16 16"><path d="M5 3l8 5-8 5z"/></svg><svg class="f pa" viewBox="0 0 16 16"><path d="M4.5 3h2.5v10H4.5zM9 3h2.5v10H9z"/></svg>',
    prev: '<svg class="f" viewBox="0 0 16 16"><path d="M3.5 3h1.6v10H3.5zM13 3L6.3 8 13 13z"/></svg>',
    next: '<svg class="f" viewBox="0 0 16 16"><path d="M10.9 3h1.6v10h-1.6zM3 3l6.7 5L3 13z"/></svg>'
  };

  /* waveform: a deterministic pseudo-random "song" so it looks the same on every visit */
  function wave() {
    var s = 7, W = 400, H = 24, d = "";
    function rnd() { s = (s * 16807) % 2147483647; return s / 2147483647; }
    for (var x = 0; x < W; x += 2) {
      var env = .35 + .65 * Math.abs(Math.sin(x / 38 + 1.3)) * (.6 + .4 * Math.sin(x / 11)), a = Math.max(1.2, (H / 2 - 1) * env * (.55 + .45 * rnd()));
      d += "M" + x + " " + (H / 2 - a).toFixed(1) + "h1.2v" + (a * 2).toFixed(1) + "h-1.2z";
    }
    return '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none" aria-hidden="true"><path d="' + d + '"/></svg>';
  }

  /* ---------- build the window ---------- */
  var rows = ["", "", ""], clips = "", xd = ["", "", ""], ruler = "", marks = "";
  steps.forEach(function (s, i) {
    clips += "";
    rows[s.g] += '<button type="button" class="pp-clip' + (s.g ? " t" + (s.g + 1) : "") + '" style="--i:' + i + '" data-i="' + i + '" aria-label="Step ' + (i + 1) + ": " + s.t.replace(/"/g, "&quot;") + '">' +
      '<span class="pp-cn" aria-hidden="true"><em>fx</em><b>' + pad(i + 1) + "</b><span>" + s.l + "</span></span></button>";
    if (i > 0 && steps[i - 1].g === s.g) xd[s.g] += '<i class="pp-xd" style="--i:' + i + '" aria-hidden="true"></i>';
    ruler += '<span class="pp-rl" style="--x:' + (i * 100 / N).toFixed(3) + '">' + Math.floor(i * TOTAL / N / 60) + ":" + pad(Math.round(i * TOTAL / N) % 60) + "</span>";
  });
  /* ruler markers: reply, Frame.io draft, sign-off */
  [[.09, "Reply within a day", ""], [.5, "Frame.io draft", "b"], [.79, "Final approval", ""]].forEach(function (m) {
    marks += '<i class="pp-mk ' + m[2] + '" style="--x:' + (m[0] * 100) + '" title="' + m[1] + '" aria-hidden="true"></i>';
  });

  win.innerHTML =
    '<div class="pp-top">' +
      '<section class="pp-pn pp-mon" aria-label="Program monitor">' +
        '<div class="pp-tab" aria-hidden="true"><b>Program: How we work with you</b><span class="pp-mnu">' + ic.menu + "</span></div>" +
        '<div class="pp-mb"><div class="pp-frame" aria-hidden="true"><div class="pp-safe"></div><div class="pp-card" id="ppCard"><span class="pp-chip" id="ppChip"></span><h3 class="pp-ttl" id="ppTtl"></h3></div><span class="pp-num" id="ppNum"></span></div></div>' +
        '<div class="pp-ctl"><span class="pp-tcb" id="ppTc1" aria-hidden="true">00:00:00:00</span>' +
          '<div class="pp-btns" role="group" aria-label="Playback">' +
            '<button type="button" id="ppPrev" aria-label="Previous step">' + ic.prev + "</button>" +
            '<button type="button" class="pp-play" id="ppPlay" aria-label="Play timeline">' + ic.play + "</button>" +
            '<button type="button" id="ppNext" aria-label="Next step">' + ic.next + "</button></div>" +
          '<span class="pp-dur" aria-hidden="true">' + tc(1) + "</span></div>" +
      "</section>" +
      '<section class="pp-pn pp-tx" aria-label="Step details">' +
        '<div class="pp-tab" aria-hidden="true"><b>Text</b><span class="pp-mnu">' + ic.menu + "</span></div>" +
        '<div class="pp-sub" aria-hidden="true"><span class="on">Transcript</span><span>Captions</span><span>Graphics</span></div>' +
        '<div class="pp-trw" id="ppTrw"></div>' +
      "</section>" +
    "</div>" +
    '<div class="pp-tl">' +
      '<div class="pp-tools" aria-hidden="true"><i class="on">' + ic.sel + "</i><i>" + ic.trk + "</i><i>" + ic.rip + "</i><i>" + ic.cut + "</i><i>" + ic.hand + "</i></div>" +
      '<div class="pp-tm">' +
        '<div class="pp-tlh" aria-hidden="true"><b>How we work with you</b><span class="pp-tltc" id="ppTc2">00:00:00:00</span><span class="pp-opts">' + ic.snap + ic.link + ic.menu + "</span></div>" +
        '<div class="pp-grid">' +
          '<div class="pp-hd" aria-hidden="true"><div class="pp-th"></div>' +
            '<div class="pp-th"><span>V3</span>' + ic.eye + ic.lock + "</div>" +
            '<div class="pp-th"><span>V2</span>' + ic.eye + ic.lock + "</div>" +
            '<div class="pp-th"><span>V1</span>' + ic.eye + ic.lock + "</div>" +
            '<div class="pp-th au"><span>A1</span><s>M</s><s>S</s>' + ic.mic + "</div></div>" +
          '<div class="pp-lane" id="ppLane">' +
            '<div class="pp-ruler" id="ppRuler" role="slider" tabindex="0" aria-label="Timeline position" aria-valuemin="1" aria-valuemax="' + N + '" aria-valuenow="1"><i class="pp-rb"></i>' + ruler + marks + "</div>" +
            '<div class="pp-row">' + rows[0] + xd[0] + "</div>" +
            '<div class="pp-row">' + rows[1] + xd[1] + "</div>" +
            '<div class="pp-row">' + rows[2] + xd[2] + "</div>" +
            '<div class="pp-row au" aria-hidden="true"><div class="pp-aud"><span class="pp-cn"><b>Your song.wav</b></span>' + wave() + wave() + "</div></div>" +
            '<div class="pp-ph" id="ppPh" aria-hidden="true"></div>' +
          "</div>" +
        "</div>" +
      "</div>" +
    "</div>";

  var $ = function (id) { return document.getElementById(id); },
      lane = $("ppLane"), ph = $("ppPh"), rulerEl = $("ppRuler"), trw = $("ppTrw"),
      chip = $("ppChip"), ttl = $("ppTtl"), num = $("ppNum"), card = $("ppCard"),
      tc1 = $("ppTc1"), tc2 = $("ppTc2"), playBtn = $("ppPlay"), prevBtn = $("ppPrev"), nextBtn = $("ppNext"),
      clipEls = [].slice.call(win.querySelectorAll(".pp-clip")),
      legacy = [sec.querySelector(".pp-legacy")];

  /* transcript: every step is stacked in one grid cell so the panel never changes height */
  function words(root) {
    var out = [];
    (function walk(n) {
      [].slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var f = document.createDocumentFragment();
          c.nodeValue.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) f.appendChild(document.createTextNode(p));
            else { var s = document.createElement("span"); s.className = "pp-w"; s.textContent = p; f.appendChild(s); out.push(s); }
          });
          c.parentNode.replaceChild(f, c);
        } else if (c.nodeType === 1) walk(c);
      });
    })(root);
    return out;
  }
  var trs = steps.map(function (s, i) {
    var d = document.createElement("div");
    d.className = "pp-tr";
    d.setAttribute("inert", "");
    d.innerHTML = '<div class="pp-who"><span class="pp-av">M</span><b>Marcus Studio</b><span class="pp-ts">' + tc(i / N) + "</span></div><p>" + s.h + "</p>";
    s.w = words(d.querySelector("p"));
    trw.appendChild(d);
    return d;
  });

  /* ---------- state ---------- */
  var pinned = false, free = false, tgt = 0, cur = 0, idx = -1, lastK = -1, laneW = 0, topOff = 0,
      raf = 0, prevT = 0, playing = false, drag = false, lastTc = "", hintOn = true, endOn = false;

  function sceneTop() { return scene.getBoundingClientRect().top + window.pageYOffset; }
  function span() { return Math.max(1, scene.offsetHeight - stage.offsetHeight); }
  function fromScroll() { tgt = clamp((window.pageYOffset + topOff - sceneTop()) / span()); }
  function toScroll(p) { return sceneTop() - topOff + span() * p; }

  function measure() {
    var h = document.getElementById("site"), t = 0;
    if (h) {
      var cs = getComputedStyle(h);
      if (cs.display !== "none" && (cs.position === "sticky" || cs.position === "fixed")) t = Math.round(h.getBoundingClientRect().height);
    }
    topOff = t;
    sec.style.setProperty("--pp-top", t + "px");
    laneW = lane.clientWidth;
  }

  function mode() {
    var want = !reduceMQ.matches && !shortMQ.matches && !free;
    pinned = want;
    sec.classList.toggle("pp-pin", pinned);
    sec.style.setProperty("--pp-n", N);
    measure();
    /* safety net: if the pinned layout cannot show everything, fall back to the flowing layout */
    if (pinned) {
      var tx = win.querySelector(".pp-tx .pp-trw"), fr = win.querySelector(".pp-frame");
      if ((tx && tx.scrollHeight > tx.clientHeight + 2) || (fr && fr.clientHeight < 64)) {
        free = true; pinned = false; sec.classList.remove("pp-pin"); measure();
      }
    }
    if (pinned) fromScroll();
    endOn = null;
    paint(true);
  }
  /* ---------- painting ---------- */
  function setStep(i) {
    idx = i; lastK = -1;
    var s = steps[i], g = GROUPS[s.g] || GROUPS[0];
    chip.innerHTML = g.k + " <i>· " + g.t + "</i>";
    chip.style.setProperty("--c", s.g === 0 ? "#6a63d9" : s.g === 1 ? "#3b82b8" : "#cf6b86");
    ttl.textContent = s.t;
    num.textContent = pad(i + 1);
    if (cnt) cnt.textContent = "STEP " + pad(i + 1) + " / " + pad(N);
    clipEls.forEach(function (c, k) { c.classList.toggle("on", k === i); c.classList.toggle("seen", k < i); c.setAttribute("aria-current", k === i ? "step" : "false"); });
    trs.forEach(function (t, k) { t.classList.toggle("on", k === i); if (k === i) t.removeAttribute("inert"); else t.setAttribute("inert", ""); });
    rulerEl.setAttribute("aria-valuenow", i + 1);
    rulerEl.setAttribute("aria-valuetext", "Step " + (i + 1) + ": " + s.t);
    prevBtn.disabled = i === 0; nextBtn.disabled = i === N - 1;
    if (card.animate && !reduceMQ.matches && idx !== -1) card.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: "cubic-bezier(.22,.8,.24,1)" });
  }
  function paint(force) {
    var x = cur * N, i = Math.min(N - 1, Math.floor(x)), f = x - i;
    if (i !== idx || force) setStep(i);
    lane.style.setProperty("--pp-p", cur.toFixed(4));
    ph.style.transform = "translate3d(" + (cur * laneW).toFixed(1) + "px,0,0)";
    var t = tc(cur);
    if (t !== lastTc) { lastTc = t; tc1.textContent = t; tc2.textContent = t; }
    /* transcript words light up as the playhead moves through the step */
    var w = steps[i].w, k = Math.round(clamp(f / .85) * w.length);
    if (k !== lastK) {
      for (var n = 0; n < w.length; n++) w[n].className = "pp-w" + (n < k - 1 ? " p" : n === k - 1 ? " c" : "");
      lastK = k;
    }
    var h = cur <= .03, e = cur > .86;
    if (h !== hintOn && hint) { hintOn = h; hint.style.opacity = h ? 1 : 0; }
    if (e !== endOn) {
      endOn = e; cta.classList.toggle("pp-end", e);
      var c = cta.querySelector(".cta");
      if (c) { if (e || !pinned) c.removeAttribute("inert"); else c.setAttribute("inert", ""); }
    }
  }

  /* ---------- motion loop: runs only while something is moving ---------- */
  function kick() { if (!raf) { prevT = 0; raf = requestAnimationFrame(tick); } }
  function tick(t) {
    raf = 0;
    var dt = prevT ? Math.min(.05, (t - prevT) / 1000) : .016; prevT = t;
    if (playing) {
      var p = clamp(tgt + dt / RUN);
      if (pinned) { window.scrollTo({ top: toScroll(p), behavior: "instant" }); fromScroll(); } else tgt = p;
      if (p >= 1) stop();
    }
    var d = tgt - cur;
    cur = reduceMQ.matches || Math.abs(d) < .0004 ? tgt : cur + d * (1 - Math.exp(-dt * 9));
    paint();
    if (playing || cur !== tgt) raf = requestAnimationFrame(tick);
  }
  function play() {
    if (cur > .985) { tgt = 0; if (pinned) window.scrollTo({ top: toScroll(0), behavior: "instant" }); }
    playing = true; sec.classList.add("pp-playing");
    playBtn.setAttribute("aria-label", "Pause timeline"); kick();
  }
  function stop() {
    if (!playing) return;
    playing = false; sec.classList.remove("pp-playing");
    playBtn.setAttribute("aria-label", "Play timeline");
  }
  function goTo(i) {
    i = clamp(i, 0, N - 1); stop();
    var p = (i + .5) / N;
    if (pinned) window.scrollTo({ top: toScroll(p), behavior: reduceMQ.matches ? "auto" : "smooth" });
    else { tgt = p; kick(); }
  }
  function scrub(e) {
    var r = lane.getBoundingClientRect(), p = clamp((e.clientX - r.left) / r.width);
    if (pinned) window.scrollTo({ top: toScroll(p), behavior: "instant" }); else { tgt = p; kick(); }
  }

  /* ---------- events ---------- */
  window.addEventListener("scroll", function () { if (pinned) { fromScroll(); kick(); } }, { passive: true });
  clipEls.forEach(function (c) { c.addEventListener("click", function () { goTo(+c.getAttribute("data-i")); }); });
  playBtn.addEventListener("click", function () { playing ? stop() : play(); });
  prevBtn.addEventListener("click", function () { goTo(idx - 1); });
  nextBtn.addEventListener("click", function () { goTo(idx + 1); });
  rulerEl.addEventListener("pointerdown", function (e) { stop(); drag = true; lane.classList.add("pp-drag"); try { rulerEl.setPointerCapture(e.pointerId); } catch (x) {} scrub(e); });
  rulerEl.addEventListener("pointermove", function (e) { if (drag) scrub(e); });
  function endDrag() { drag = false; lane.classList.remove("pp-drag"); }
  rulerEl.addEventListener("pointerup", endDrag); rulerEl.addEventListener("pointercancel", endDrag);
  rulerEl.addEventListener("keydown", function (e) {
    var k = e.key;
    if (k === "ArrowRight" || k === "ArrowDown") goTo(idx + 1);
    else if (k === "ArrowLeft" || k === "ArrowUp") goTo(idx - 1);
    else if (k === "Home") goTo(0);
    else if (k === "End") goTo(N - 1);
    else return;
    e.preventDefault();
  });
  win.addEventListener("keydown", function (e) {
    if (e.key === " " && !/^(BUTTON|A)$/.test(e.target.tagName)) { e.preventDefault(); playing ? stop() : play(); }
  });
  /* the reader takes over: any real scroll, touch or key press pauses playback */
  function inside(e, sel) { return !!(e.target && e.target.closest && e.target.closest(sel)); }
  window.addEventListener("wheel", function () { stop(); }, { passive: true });
  window.addEventListener("touchstart", function (e) { if (!inside(e, ".pp-btns")) stop(); }, { passive: true });
  window.addEventListener("keydown", function (e) { if (!inside(e, "#ppWin")) stop(); }, { passive: true });

  if ("ResizeObserver" in window) new ResizeObserver(function () { measure(); if (pinned) fromScroll(); kick(); }).observe(lane);
  window.addEventListener("resize", function () { free = false; mode(); kick(); });
  [reduceMQ, shortMQ].forEach(function (m) { (m.addEventListener ? m.addEventListener("change", mode) : m.addListener(mode)); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { mode(); kick(); });

  /* ---------- go ---------- */
  legacy.forEach(function (el) { if (el) el.setAttribute("inert", ""); });
  list.removeAttribute("tabindex");
  sec.classList.add("pp-on");
  mode();
  cur = tgt;
  paint(true);
})();
