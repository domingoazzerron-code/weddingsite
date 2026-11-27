/* Page changes: helpers for transitions.css. Must load in <head> (not deferred). */
(function () {
  "use strict";
  var D = document, R = D.documentElement;

  addEventListener("pageswap", function (e) {
    if (e.viewTransition) R.classList.add("vt-leaving");
  });
  addEventListener("pageshow", function () { R.classList.remove("vt-leaving"); });

  addEventListener("pagereveal", function (e) {
    R.classList.remove("vt-leaving");
    var vt = e.viewTransition;
    if (!vt) return;                       /* first visit or reload: keep the normal entrance effects */
    var act = window.navigation && window.navigation.activation,
        back = !!act && act.navigationType === "traverse";
    /* on touch screens, going back or forward often has the phone's own swipe animation */
    if (back && matchMedia("(pointer:coarse)").matches) vt.skipTransition();
    arrive(back);
  });

  function onScreen(el) {
    var r = el.getBoundingClientRect();
    return r.top < innerHeight && r.bottom > 0;
  }

  /* After a page change, what is on screen is already in place: no second round of animation.
     Content further down still reveals as you scroll. */
  function arrive(back) {
    R.classList.add("vt-arrive");
    if (!back) jumpToAnchor();             /* going back keeps the scroll position you left */
    [].forEach.call(D.querySelectorAll(".rv"), function (el) { if (onScreen(el)) el.classList.add("in"); });
    if (!D.getAnimations) return;
    D.getAnimations().forEach(function (a) {
      var fx = a.effect, el = fx && fx.target;
      if (!el || fx.pseudoElement && fx.pseudoElement.indexOf("view-transition") > -1) return;
      if (!isFinite(fx.getComputedTiming().endTime) || !onScreen(el)) return;   /* leave looping effects alone */
      try { a.finish(); } catch (err) {}
    });
  }

  /* links such as index.html#faq: be at the section already, without a scroll animation */
  function jumpToAnchor() {
    if (location.hash.length < 2) return;
    var el = null;
    try { el = D.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (err) {}
    if (!el) return;
    R.style.scrollBehavior = "auto";
    el.scrollIntoView();
    requestAnimationFrame(function () { R.style.scrollBehavior = ""; });
  }
})();
