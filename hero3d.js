/* Marcus Wedding Studio: 3D rings hero.
   - three.js is loaded lazily (idle, after first paint) so text and buttons show instantly.
   - No WebGL / Save-Data / slow network / script blocked: a static SVG rings fallback is shown.
   - Rendering pauses when the hero is off-screen or the tab is hidden.
   - Pixel ratio is capped and drops automatically if the device can't keep up.
   - Ring size and position follow the real layout (stage + copy), so every screen size works. */
(function () {
  "use strict";
  var stage = document.getElementById("hero"),
      cv = document.getElementById("gl"),
      copy = document.getElementById("copyin");
  if (!stage || !cv) return;

  var root = document.documentElement,
      reduce = matchMedia("(prefers-reduced-motion:reduce)").matches,
      nc = navigator.connection || {},
      lite = nc.saveData || /(^|-)2g|3g/.test(nc.effectiveType || "") || (navigator.deviceMemory && navigator.deviceMemory <= 1);

  function fallback() { root.classList.add("no-gl"); }
  if (lite) { fallback(); return; }

  var THREE_URL = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  function load() {
    if (window.THREE) { start(); return; }
    var s = document.createElement("script");
    s.src = THREE_URL; s.async = true; s.crossOrigin = "anonymous";
    s.onload = start; s.onerror = fallback;
    document.head.appendChild(s);
  }
  if ("requestIdleCallback" in window) requestIdleCallback(load, { timeout: 1200 });
  else setTimeout(load, 350);

  function start() {
    if (!window.THREE) { fallback(); return; }
    var THREE = window.THREE,
        R, scene, cam, rig, ra, rb, gem, gold, champ, sparks, sp, spN,
        base = { x: 0, y: 0 }, t0 = 0, spin = 0, tx = 0, ty = 0, cx = 0, cy = 0,
        vis = true, raf = 0, last = 0, lw = 0, lh = 0, ld = 0, lay = 0, sf = 0, sdt = .016, hover = false, skip = 0,
        small = innerWidth < 720,
        dprCap = small ? 1.75 : 2, acc = 0, frames = 0;

    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function back(t) { var c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
    function cl(v) { return Math.max(0, Math.min(1, v)); }

    try { init(); } catch (e) { console.warn("3D disabled:", e); fallback(); return; }

    function buildEnv() {
      /* a tiny warm "studio" (gradient dome + soft boxes) that the metal reflects */
      var env = new THREE.Scene(),
          stops = [[0, "#0d0908"], [.45, "#3d2b27"], [.78, "#a7766b"], [1, "#f3d3c8"]].map(function (s) { return [s[0], new THREE.Color(s[1])]; });
      var dome = new THREE.SphereGeometry(20, 32, 16), pos = dome.attributes.position, cols = [];
      for (var i = 0; i < pos.count; i++) {
        var t = (pos.getY(i) / 20 + 1) / 2, c = stops[3][1];
        for (var k = 1; k < stops.length; k++) {
          if (t <= stops[k][0]) { c = stops[k - 1][1].clone().lerp(stops[k][1], (t - stops[k - 1][0]) / (stops[k][0] - stops[k - 1][0])); break; }
        }
        cols.push(c.r, c.g, c.b);
      }
      dome.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
      env.add(new THREE.Mesh(dome, new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true })));
      function box(w, h, x, y, z, col, k) {
        var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide }));
        m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m);
      }
      box(10, 4, -8, 6, 6, "#fff3e8", 6); box(4, 10, 9, 0, 5, "#ffd9cf", 4); box(12, 2, 0, -8, 6, "#ffffff", 3); box(6, 6, 0, 9, -6, "#ffe4d6", 5);
      var pm = new THREE.PMREMGenerator(R);
      scene.environment = pm.fromScene(env, .02).texture;
      pm.dispose();
      /* the env scene is only needed once */
      dome.dispose();
    }

    function init() {
      R = new THREE.WebGLRenderer({ canvas: cv, antialias: !small || devicePixelRatio < 2, alpha: true, powerPreference: small ? "default" : "high-performance" });
      R.setClearColor(0x000000, 0);
      R.outputEncoding = THREE.sRGBEncoding;
      R.toneMapping = THREE.ACESFilmicToneMapping;
      R.toneMappingExposure = 1.05;
      scene = new THREE.Scene();
      cam = new THREE.PerspectiveCamera(32, 1, .1, 100);
      cam.position.set(0, 0, 12);
      buildEnv();

      rig = new THREE.Group(); scene.add(rig);
      gold = new THREE.MeshStandardMaterial({ color: 0xe7b4a2, metalness: 1, roughness: .22, envMapIntensity: 1.3 });
      champ = new THREE.MeshStandardMaterial({ color: 0xefd2b4, metalness: 1, roughness: .2, envMapIntensity: 1.3 });
      var geo = small ? new THREE.TorusGeometry(1.5, .2, 32, 120) : new THREE.TorusGeometry(1.5, .2, 48, 180);
      ra = new THREE.Group(); ra.add(new THREE.Mesh(geo, gold));
      rb = new THREE.Group(); rb.add(new THREE.Mesh(geo, champ));
      var prong = new THREE.Mesh(new THREE.CylinderGeometry(.1, .17, .22, 16), gold);
      prong.position.set(0, 1.66, 0);
      gem = new THREE.Mesh(new THREE.OctahedronGeometry(.3, 0), new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: .05, roughness: .02, clearcoat: 1, clearcoatRoughness: 0, envMapIntensity: 3.2, flatShading: true }));
      gem.position.set(0, 1.9, 0);
      ra.add(prong); ra.add(gem);
      rig.add(ra); rig.add(rb);

      /* drifting sparkles */
      spN = small ? 80 : 160;
      sp = new Float32Array(spN * 3);
      for (var i = 0; i < spN; i++) { sp[i * 3] = (Math.random() - .5) * 18; sp[i * 3 + 1] = (Math.random() - .5) * 11.6; sp[i * 3 + 2] = -5 + Math.random() * 7; }
      var g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(sp, 3));
      var c = document.createElement("canvas"); c.width = c.height = 64;
      var x = c.getContext("2d"), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.25, "rgba(255,225,215,.7)"); gr.addColorStop(1, "rgba(255,225,215,0)");
      x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
      sparks = new THREE.Points(g, new THREE.PointsMaterial({ size: .14, map: new THREE.CanvasTexture(c), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xf4cfc6 }));
      scene.add(sparks);

      layout(); update(0, 0); R.render(scene, cam);   /* warm up shaders before the clock starts */
      stage.classList.add("gl-on");
      t0 = performance.now(); last = t0;

      cv.addEventListener("webglcontextlost", function (e) { e.preventDefault(); cancelAnimationFrame(raf); stage.classList.remove("gl-on"); fallback(); });

      /* keep the rings fitted to the real layout: stage size, copy position, web fonts */
      if ("ResizeObserver" in window) {
        var ro = new ResizeObserver(schedule); ro.observe(stage); if (copy) ro.observe(copy);
      } else addEventListener("resize", schedule);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);

      if (reduce) { update(99, 0); draw(); return; }

      if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { vis = e[0].isIntersecting; if (vis) last = performance.now(); }).observe(stage);
      document.addEventListener("visibilitychange", function () { last = performance.now(); });
      stage.addEventListener("pointermove", function (e) {
        hover = true;
        var r = stage.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - .5) * 2; ty = ((e.clientY - r.top) / r.height - .5) * 2;
      }, { passive: true });
      stage.addEventListener("pointerleave", function () { hover = false; });
      stage.addEventListener("pointercancel", function () { hover = false; });
      raf = requestAnimationFrame(loop);
    }

    function schedule() { if (lay) return; lay = requestAnimationFrame(function () { lay = 0; layout(); if (reduce) draw(); }); }

    function layout() {
      var w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      var dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      if (w !== lw || h !== lh || dpr !== ld) { lw = w; lh = h; ld = dpr; R.setPixelRatio(dpr); R.setSize(w, h, false); }
      cam.aspect = w / h; cam.updateProjectionMatrix();
      var vh = 2 * Math.tan(cam.fov * Math.PI / 360) * 12, vw = vh * cam.aspect;
      if (w < 900) {
        /* stacked: rings sit behind the headline; they are only nudged down so the diamond never touches the top edge */
        var top = copy ? copy.getBoundingClientRect().top - stage.getBoundingClientRect().top : h * .5,
            free = Math.max(top - 14, h * .24),
            s = Math.max(.4, Math.min(1, vw / 6.2, (free / h * vh) / 4.6)),
            ppw = h / vh,                       /* pixels per world unit */
            ext = 2.65 * s * ppw,               /* diamond height above the ring centre, with tilt */
            centre = Math.max(free / 2, ext + 18);
        base.x = 0;
        base.y = (h / 2 - centre) / h * vh;
        rig.scale.setScalar(s);
      } else {
        base.x = vw * .21; base.y = 0;
        rig.scale.setScalar(Math.min(1, vh / 6.6));
      }
    }

    function update(T, dt) {
      var a = ease(cl(T / 1.7)), b = ease(cl((T - .15) / 1.7)), i = 1 - a, j = 1 - b;
      ra.position.set(-.75 - 6.5 * i, 3.5 * i, -6 * i); ra.rotation.set(0, i * Math.PI * 3, i * 2.2); ra.scale.setScalar(.35 + .65 * a);
      rb.position.set(.75 + 6.5 * j, -3.5 * j, -6 * j); rb.rotation.set(Math.PI / 2 + j * 2.6, -j * Math.PI * 3, 0); rb.scale.setScalar(.35 + .65 * b);
      var flash = T > 1.75 ? Math.exp(-(T - 1.75) * 3.2) : 0;
      gold.envMapIntensity = champ.envMapIntensity = 1.3 + flash * 2.4;
      var pop = back(cl((T - 1.6) / .7));
      gem.scale.set(pop, 1.3 * pop, pop); gem.rotation.y += dt * 1.2;
      cam.position.z = 12 + 5 * (1 - ease(cl(T / 2.4)));
      if (T > 1.7) spin += dt * .3;
      /* no pointer (phones, or mouse left): a slow idle drift keeps the rings alive; follow is frame-rate independent */
      if (!hover) { tx = Math.sin(T * .35) * .35; ty = Math.cos(T * .28) * .22; }
      var k = 1 - Math.exp(-dt * 4);
      cx += (tx - cx) * k; cy += (ty - cy) * k;
      rig.rotation.y = -.6 + spin + cx * .5;
      rig.rotation.x = .4 + cy * .3 + Math.sin(T * .7) * .05;
      rig.position.set(base.x, base.y + Math.sin(T * .9) * .07, 0);
      sparks.material.opacity = .85 * cl((T - .4) / 1.2);
      skip += dt;
      if (++sf % 2 === 0) {
        for (var n = 0; n < spN; n++) { var q = n * 3 + 1; sp[q] += skip * (.15 + (n % 5) * .03); if (sp[q] > 5.8) sp[q] = -5.8; }
        sparks.geometry.attributes.position.needsUpdate = true; skip = 0;
      }
    }

    function draw() { R.render(scene, cam); }

    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (!vis || document.hidden) { last = now; return; }
      try {
        var raw = now - last, d0 = Math.min(.05, raw / 1000 || .016);
        sdt += (d0 - sdt) * .25; var dt = sdt;
        last = now;
        update((now - t0) / 1000, dt);
        draw();
        /* adaptive quality: if frames are slow, step the pixel ratio down (never up) */
        if (raw < 250) { acc += raw; frames++; }
        if (frames >= 45) {
          if (acc / frames > 26 && dprCap > 1) { dprCap = Math.max(1, dprCap - .25); layout(); }
          acc = 0; frames = 0;
        }
      } catch (e) {
        cancelAnimationFrame(raf); console.warn("3D stopped:", e); stage.classList.remove("gl-on"); fallback();
      }
    }
  }
})();
