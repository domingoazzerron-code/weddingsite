/* Marcus Wedding Studio: color palettes.
   Load in <head>, after the stylesheets, so the saved palette is applied before the page paints.
   Colors are in themes.css. Light / dark mode is still handled by the existing theme toggle.
   To add a palette: add it to LIST below, then add its colors to themes.css. */
(function () {
  "use strict";
  var D = document, R = D.documentElement, KEY = "palette",
      LIST = [
        { id: "classic", name: "Classic" },
        { id: "sage", name: "Sage & Tomato" },
        { id: "cocoa", name: "Cocoa & Baby Blue" },
        { id: "graphite", name: "Graphite & Yellow" }
      ],
      current = null,
      mq = matchMedia("(prefers-color-scheme:dark)");

  function valid(id) { return LIST.some(function (p) { return p.id === id; }); }
  function saved() {
    var v = null;
    try { v = localStorage.getItem(KEY); } catch (e) {}
    return valid(v) ? v : "classic";
  }
  function savedMode() {
    try { var m = localStorage.getItem("theme"); return m === "light" || m === "dark" ? m : null; } catch (e) { return null; }
  }
  /* the browser bar follows the page background */
  function barColor() {
    var m = D.querySelector('meta[name="theme-color"]'),
        bg = getComputedStyle(R).getPropertyValue("--bg").trim();
    if (!m) { m = D.createElement("meta"); m.name = "theme-color"; D.head.appendChild(m); }
    if (bg) m.content = bg;
  }
  /* pages without a light/dark toggle (guides) still need the mode set for the new palettes */
  function ensureMode() {
    if (current !== "classic" && !R.hasAttribute("data-theme")) {
      R.setAttribute("data-theme", savedMode() || (mq.matches ? "dark" : "light"));
    }
  }
  function apply(id) {
    var changed = id !== current;
    current = id;
    if (id === "classic") R.removeAttribute("data-palette");
    else R.setAttribute("data-palette", id);
    ensureMode();
    barColor();
    if (changed) D.dispatchEvent(new CustomEvent("palettechange", { detail: { id: id } }));
  }
  function set(id) {
    if (!valid(id) || id === current) return;
    try { localStorage.setItem(KEY, id); } catch (e) {}
    var done = function () { apply(id); };
    if (D.startViewTransition && !matchMedia("(prefers-reduced-motion:reduce)").matches) {
      R.classList.add("vt-theme");
      D.startViewTransition(done).finished.catch(function () {}).then(function () { R.classList.remove("vt-theme"); });
    } else done();
  }
  /* pick up changes made in another tab, or while this page was cached or prerendered */
  function refresh() { var v = saved(); if (v !== current) apply(v); }

  window.MWSTheme = { list: LIST, get: function () { return current; }, set: set };
  apply(saved());

  new MutationObserver(barColor).observe(R, { attributes: true, attributeFilter: ["data-theme"] });
  D.addEventListener("DOMContentLoaded", barColor);
  D.addEventListener("prerenderingchange", refresh);
  addEventListener("pageshow", refresh);
  addEventListener("storage", function (e) { if (e.key === KEY || e.key === null) refresh(); });
})();
