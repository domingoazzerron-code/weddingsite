/* About section: staggered reveal, count-up numbers, and the swipe dots for the phone team carousel.
   Everything is optional polish: without JavaScript (or with "reduce motion") the section is fully visible. */
(function () {
  "use strict";
  var sec = document.getElementById("about");
  if (!sec || !sec.classList.contains("abx")) return;
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* ---------- reveal with stagger ---------- */
  var items = [].slice.call(sec.querySelectorAll(".abx-r"));
  /* children of the same list stagger one after another */
  [".abx-stats", ".abx-team"].forEach(function (sel) {
    var g = sec.querySelector(sel);
    if (!g) return;
    [].slice.call(g.children).forEach(function (c, i) { c.classList.add("abx-r"); c.style.setProperty("--i", i); if (items.indexOf(c) < 0) items.push(c); });
  });
  [].slice.call(sec.querySelectorAll(".abx-head .abx-r")).forEach(function (c, i) { c.style.setProperty("--i", i); });

  /* ---------- count-up ---------- */
  var counters = [].slice.call(sec.querySelectorAll("[data-count]"));
  function count(el) {
    var to = parseFloat(el.getAttribute("data-count")) || 0, t0 = 0, dur = 1500;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(step); else el.textContent = to;
    }
    el.textContent = "0";
    requestAnimationFrame(step);
  }

  if (reduce || !("IntersectionObserver" in window)) {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  } else {
    sec.classList.add("abx-js");
    var done = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("on");
        io.unobserve(en.target);
        if (!done && en.target.parentElement && en.target.parentElement.classList.contains("abx-stats")) {
          done = true; counters.forEach(count);
        }
      });
    }, { threshold: .15, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- phone carousel: dots + hide the swipe hint once used ---------- */
  var team = sec.querySelector(".abx-team"), dots = sec.querySelector(".abx-dots");
  if (team && dots) {
    var n = team.children.length;
    dots.innerHTML = new Array(n + 1).join("<i></i>");
    var ds = dots.children, ticking = false;
    function sync() {
      ticking = false;
      var first = team.children[0], step = first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(team).columnGap || 16) : 1;
      var max = team.scrollWidth - team.clientWidth, i = max > 1 && team.scrollLeft >= max - 4 ? n - 1 : Math.round(team.scrollLeft / step);
      for (var k = 0; k < ds.length; k++) ds[k].classList.toggle("on", k === i);
      if (team.scrollLeft > 24) sec.classList.add("abx-swiped");
    }
    team.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(sync); } }, { passive: true });
    sync();
  }
})();
