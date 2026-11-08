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
 */
import * as THREE from "three";
import { gsap } from "gsap";

export function mountUniverse(navigateTo) {
${LIFECYCLE("universe")}
${indent(code.replace(/\nanimate\(\);\s*$/, "\n"))}

  /* ── Start ── */
  animate();

  return function destroy() {
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
  };
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
