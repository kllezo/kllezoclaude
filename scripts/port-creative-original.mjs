// One-time port of the original Kllezo v3 vanilla scripts into mountable ES modules.
// Usage: node port.mjs <srcDir> <outDir>
import fs from "node:fs";
import path from "node:path";

const [src, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });

const ASSETS = [
  [/(?:\.\.\/)?assets\/niche (\d)\.png/g, "/creative/assets/niche-$1.webp"],
  [/(?:\.\.\/)?assets\/whatsapp\.png/g, "/creative/assets/whatsapp.webp"],
  [/(?:\.\.\/)?assets\/instagram\.png/g, "/creative/assets/instagram.webp"],
  [/(?:\.\.\/)?assets\/kllezo bot\.png/g, "/creative/assets/kllezo-bot.webp"],
  [/(?:\.\.\/)?assets\/golden-orb\.png/g, "/creative/assets/golden-orb.webp"],
  [/(?:\.\.\/)?assets\/gold-ring\.png/g, "/creative/assets/gold-ring.webp"],
  [/(?:\.\.\/)?assets\/content creation  orb\.png/g, "/creative/assets/content-creation-orb.webp"],
  [/(?:\.\.\/)?assets\/websites orb\.png/g, "/creative/assets/websites-orb.webp"],
  [/(?:\.\.\/)?assets\/texting orb\.png/g, "/creative/assets/texting-orb.webp"],
  [/(?:\.\.\/)?assets\/calling orb\.png/g, "/creative/assets/calling-orb.webp"],
  [/(?:\.\.\/)?assets\/calling-agent-(\d)\.png/g, "/creative/assets/calling-agent-$1.webp"],
  [/(?:\.\.\/)?assets\/logo-removebg\.png/g, "/creative/assets/logo.webp"],
  [/(?:\.\.\/)?assets\/content creation\/\$\{fileInfo\.name\}\.png/g, "/creative/assets/content/${fileInfo.name}.webp"],
  [/(\.\.\/)?assets\/liquid gold\.mp4/g, "/creative/assets/liquid-gold.mp4"],
];

const LIFECYCLE = (name) => `
  /* ── Lifecycle (added for the Next.js port) ──────────────────────────
     The original ran once per page load. Inside the app it can mount and
     unmount on client navigation, so every global listener, frame loop
     and timer is tracked and released on destroy. */
  const __offs = [];
  const __on = (target, type, fn, options) => {
    target.addEventListener(type, fn, options);
    __offs.push(() => target.removeEventListener(type, fn, options));
  };
  let __dead = false;
  const __rafIds = new Set();
  const __raf = (fn) => {
    if (__dead) return 0;
    const id = requestAnimationFrame((ts) => { __rafIds.delete(id); fn(ts); });
    __rafIds.add(id);
    return id;
  };
  const __timers = new Set();
  const __setTimeout = (fn, ms, ...a) => { const id = setTimeout(() => { __timers.delete(id); if (!__dead) fn(...a); }, ms); __timers.add(id); return id; };
  const __setInterval = (fn, ms, ...a) => { const id = setInterval(() => { if (!__dead) fn(...a); }, ms); __timers.add(id); return id; };
  const __release = () => {
    __dead = true;
    __offs.splice(0).forEach((off) => off());
    __rafIds.forEach((id) => cancelAnimationFrame(id));
    __rafIds.clear();
    __timers.forEach((id) => { clearTimeout(id); clearInterval(id); });
    __timers.clear();
  };
  /* ─────────────────────────────────────────────────── ${name} ── */
`;

function lifecycleRewrite(code) {
  return code
    .replace(/^'use strict';\s*$/m, "")
    .replace(/\bwindow\.addEventListener\(/g, "__on(window, ")
    .replace(/\bdocument\.body\.addEventListener\(/g, "__on(document.body, ")
    .replace(/\bdocument\.addEventListener\(/g, "__on(document, ")
    .replace(/(?<![\w.])requestAnimationFrame\(/g, "__raf(")
    .replace(/(?<![\w.])setTimeout\(/g, "__setTimeout(")
    .replace(/(?<![\w.])setInterval\(/g, "__setInterval(");
}
function assetRewrite(code) {
  for (const [re, to] of ASSETS) code = code.replace(re, to);
  return code;
}
function indent(code) {
  return code.split("\n").map((l) => (l ? "  " + l : l)).join("\n");
}

/* ── Universe (index.html → main.js) ── */
{
  let code = fs.readFileSync(path.join(src, "main.js"), "utf8").replace(/\r\n/g, "\n");
  code = assetRewrite(code);
  code = code.replace(
    /const urls = \[\s*'services\.html#content',\s*'services\.html#websites',\s*'services\.html#calling',\s*'services\.html#texting'\s*\];/,
    "const urls = ['content', 'websites', 'calling', 'texting'].map((k) => navigateTo.service(k));"
  );
  code = code.replace(/window\.location\.href = urls\[idx\];/, "navigateTo.go(urls[idx]);");
  // three r134 (the version the original loaded) has no SRGBColorSpace: the original assigned undefined, a no-op. Keep it a no-op.
  code = code.replace(/tex\.colorSpace = THREE\.SRGBColorSpace;/, "tex.colorSpace = undefined; // r134: no SRGBColorSpace (no-op in the original)");
  /* ── Refinements (2026-11) — behaviour only; the scene, camera path and art are untouched. ── */
  const must = (re, to, why) => {
    if (!re.test(code)) throw new Error(`port patch did not apply: ${why}`);
    code = code.replace(re, to);
  };
  // Frame-rate independence: the original advanced time by 0.01 per frame, so 120Hz
  // displays ran every animation at double speed. Same pace, measured in seconds (0.01 × 60).
  must(/\n(\s*)time \+= 0\.01;\n/, "\n", "time step");
  must(/(lastAnimateTime = nowAnimate;\n)/, "$1  time += dt * 0.6; // 0.01 per 60Hz frame, now independent of refresh rate\n", "time step (dt)");
  // Lighter mode for phones and touch tablets: fewer void particles, capped pixel ratio, no MSAA.
  must(/antialias: true,/, "antialias: !__LITE,", "antialias");
  must(/renderer\.setPixelRatio\(Math\.min\(window\.devicePixelRatio, 2\)\);/, "renderer.setPixelRatio(Math.min(window.devicePixelRatio, __LITE ? 1.5 : 2));", "pixel ratio");
  must(/const VOID_COUNT = 3000;/, "const VOID_COUNT = __LITE ? 1200 : 3000;", "void count");
  // Reduced motion: the same journey, travelled in a shorter, calmer move.
  must(/let transitionDuration = 4\.8;/, "let transitionDuration = __REDUCED ? 1.8 : 4.8;", "transition duration");
  // Camera travel: quintic smootherstep instead of cubic — zero acceleration at both ends,
  // so departures and arrivals glide instead of lurching. Same phases, same duration.
  must(/const ease = t_travel \* t_travel \* \(3 - 2 \* t_travel\); \/\/ smoothstep/, "const ease = t_travel * t_travel * t_travel * (t_travel * (t_travel * 6 - 15) + 10); // smootherstep", "travel easing");
  // Pointer parallax eased per second, not per frame (identical at 60Hz, steady at 120Hz).
  must(/mouse\.sx = lerp\(mouse\.sx, mouse\.x, 0\.04\);\n(\s*)mouse\.sy = lerp\(mouse\.sy, mouse\.y, 0\.04\);/, "const __mk = 1 - Math.pow(0.96, dt * 60);\n$1mouse.sx = lerp(mouse.sx, mouse.x, __mk);\n$1mouse.sy = lerp(mouse.sy, mouse.y, __mk);", "mouse easing");
  // Chapter navigation: report the section the camera is heading to.
  must(/(\n\s*\/\/ Active section typing time accumulator)/, "\n  if (__pendingGoTo >= 0 && sectionTransitionProgress >= 1.0) { const __i = __pendingGoTo; __pendingGoTo = -1; if (__i !== currentSectionIdx) { triggerSectionTransition(__i); lastGestureTime = performance.now(); } }\n  if (__reported !== targetSectionIdx) { __reported = targetSectionIdx; navigateTo.section && navigateTo.section(targetSectionIdx); }$1", "section report");
  code = lifecycleRewrite(code);
  const body = `/* eslint-disable */
// @ts-nocheck
/**
 * KLLEZO — Universe Engine (original Creative experience, kllezo-v3 main.js).
 *
 * Ported verbatim from the original site. Changes are mechanical only:
 * module imports for THREE/GSAP, a mount/destroy lifecycle so the scene can
 * live inside the Next.js app, asset paths, and service links routed to the
 * app's URLs. Do not restyle the scene here — this is the original identity.
 * Behaviour refinements (frame-rate independent timing, a lighter mobile mode,
 * reduced motion and chapter navigation) are applied as checked patches.
 */
import * as THREE from "three";
import { gsap } from "gsap";

export function mountUniverse(navigateTo) {
${LIFECYCLE("universe")}
  const __LITE = window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
  const __REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let __reported = -1;
  let __pendingGoTo = -1;
  // The original locks page scroll for the gesture-driven journey; remember what to restore on unmount.
  const __bodyOverflow = document.body.style.overflow;
${indent(code.replace(/\nanimate\(\);\s*$/, "\n"))}

  /* ── Start ── */
  animate();

  /* ── Texture filtering (added): screens, cards and gallery images are seen at steep
     angles as the camera travels; anisotropic filtering keeps them sharp instead of smeared.
     Images load asynchronously, so the pass repeats while the scene fills in. */
  const __maxAniso = renderer.capabilities.getMaxAnisotropy();
  const __sharpen = () => scene.traverse((o) => {
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    mats.forEach((m) => { if (m.map && m.map.anisotropy !== __maxAniso) { m.map.anisotropy = __maxAniso; if (m.map.image) m.map.needsUpdate = true; } });
  });
  [0, 1500, 4000, 9000].forEach((ms) => __setTimeout(__sharpen, ms));

  function destroy() {
    __release();
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
      mats.forEach((m) => {
        Object.values(m).forEach((v) => { if (v && v.isTexture) v.dispose(); });
        if (m.uniforms) Object.values(m.uniforms).forEach((u) => { if (u && u.value && u.value.isTexture) u.value.dispose(); });
        m.dispose();
      });
    });
    renderer.dispose();
    renderer.forceContextLoss();
    window.manualServiceState = null;
    window.isInspecting = false;
    window.inspectedCardObj = null;
    window.inspectionClone = null;
    document.body.classList.remove("hov");
    // Without this, every page reached by client navigation after the universe could not scroll.
    document.body.style.overflow = __bodyOverflow;
  }
  /** Jump to a chapter (0–5). Explicit choices skip the gesture locks; a choice made while
      the camera is moving is held and taken as soon as it settles (never interrupting a move). */
  destroy.goTo = (idx) => {
    if (sectionTransitionProgress < 1.0) { __pendingGoTo = idx; return; }
    if (idx === currentSectionIdx) return;
    triggerSectionTransition(idx);
    lastGestureTime = performance.now();
  };
  return destroy;
}
`;
  fs.writeFileSync(path.join(out, "universe.js"), body);
}

/* ── Services runtime (services.js + services.html inline script) ── */
{
  let code = fs.readFileSync(path.join(src, "services.js"), "utf8").replace(/\r\n/g, "\n");
  code = assetRewrite(code);
  // DOMContentLoaded has already fired when React mounts; run the body directly.
  code = code.replace(/document\.addEventListener\('DOMContentLoaded', \(\) => \{/, "(() => {");
  code = code.replace(/\n\}\);\s*$/, "\n})();\n");
  // The cursor nodes are React-owned and already fixed at the root; moving them under <body> breaks unmount.
  code = code.replace(/\s*document\.body\.appendChild\(dot\);\s*document\.body\.appendChild\(ring\);/, "");
  // Keep the lightbox inside the scoped page root so its original styles apply and it unmounts with the page.
  code = code.replace(/document\.body\.appendChild\(lightbox\);/, "(document.querySelector('.kz-s') || document.body).appendChild(lightbox);");
  code = lifecycleRewrite(code);
  const body = `/* eslint-disable */
// @ts-nocheck
/**
 * KLLEZO — Services runtime (original Creative experience, kllezo-v3 services.js).
 * Ported verbatim; only wrapped in a mount/destroy lifecycle.
 */
export function mountServices() {
${LIFECYCLE("services")}
${indent(code)}

  return __release;
}
`;
  fs.writeFileSync(path.join(out, "services-runtime.js"), body);
}
console.log("ok");
