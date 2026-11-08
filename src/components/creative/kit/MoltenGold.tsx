"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   Molten gold — the Creative experience's signature surface.
   A single fragment shader: domain-warped noise becomes a height field,
   lit like polished metal. Mostly shadow, with gold ribbons that move
   slowly and lean toward the pointer. Rendered at reduced resolution
   (it is smooth by nature), paused off-screen and in background tabs,
   and held as a single still frame under reduced motion.
   Raw WebGL — no 3D library needed for one full-screen surface.
   ───────────────────────────────────────────────────────────────────────── */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uIntensity;
uniform vec2 uPoint;   // pointer, in pixels
uniform float uPress;  // 0..1, eased while held

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 R = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = R * p * 2.03; a *= 0.5; }
  return v;
}
float field(vec2 p){
  float t = uTime;
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.045)), fbm(p + vec2(5.2, 1.3) - t * 0.035));
  vec2 w = vec2(fbm(p + 3.2 * q + vec2(1.7, 9.2) + t * 0.025), fbm(p + 3.2 * q + vec2(8.3, 2.8)));
  return fbm(p + 2.4 * w);
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 p = uv * 1.35 + uMouse * 0.12 + vec2(0.6, 0.0);
  // Under the pointer the metal heats: a swirl that deepens while you press.
  vec2 pu = (uPoint - 0.5 * uRes) / uRes.y;
  vec2 dv = uv - pu;
  float near = exp(-dot(dv, dv) * 14.0);
  float ang = near * (0.35 + 2.2 * uPress);
  p = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * (p - pu * 1.35) + pu * 1.35;
  float e = 0.004;
  float h = field(p);
  float hx = field(p + vec2(e, 0.0));
  float hy = field(p + vec2(0.0, e));
  vec3 n = normalize(vec3((h - hx) * 9.0, (h - hy) * 9.0, 1.0));

  vec3 L = normalize(vec3(uMouse.x * 0.8 + 0.4, uMouse.y * 0.6 + 0.55, 0.9));
  vec3 V = vec3(0.0, 0.0, 1.0);
  float diff = max(dot(n, L), 0.0);
  float spec = pow(max(dot(reflect(-L, n), V), 0.0), 28.0);
  float rim = pow(1.0 - max(n.z, 0.0), 2.0);

  // Ribbons: only the ridges of the field are metal; the rest falls into shadow.
  float ribbon = smoothstep(0.50 - near * (0.08 + 0.22 * uPress), 0.72, h);
  vec3 ink = vec3(0.027, 0.039, 0.035);
  vec3 deep = vec3(0.22, 0.15, 0.06);
  vec3 gold = vec3(0.784, 0.635, 0.353);
  vec3 hi = vec3(1.0, 0.93, 0.78);

  vec3 metal = mix(deep, gold, diff) + hi * spec * 1.1 + gold * rim * 0.35;
  vec3 col = mix(ink, metal, ribbon * uIntensity);
  // A faint forest-green breath in the shadows ties it to the brand.
  col += vec3(0.02, 0.09, 0.08) * (1.0 - ribbon) * smoothstep(0.2, 0.55, h) * 0.6;

  // Keep the left third quiet for type, and fade to ink at the bottom edge.
  float vign = smoothstep(1.45, 0.25, length(uv * vec2(0.85, 1.1)));
  col *= mix(0.35, 1.0, vign);
  col *= mix(0.45, 1.0, smoothstep(-0.65, 0.15, uv.x));
  col *= smoothstep(-0.62, -0.18, uv.y) * 0.7 + 0.3;

  // Film grain, so gradients never band.
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.025;
  gl_FragColor = vec4(col, 1.0);
}`;

export default function MoltenGold({ className, intensity = 1 }: { className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current!;
    // A fresh canvas per mount: a context released on unmount is never reused
    // (React mounts effects twice in development; client navigation remounts).
    const canvas = document.createElement("canvas");
    host.appendChild(canvas);
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) {
      host.dataset.fallback = "";
      return () => canvas.remove();
    }
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      host.dataset.fallback = "";
      return () => canvas.remove();
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uIntensity = gl.getUniformLocation(prog, "uIntensity");
    const uPoint = gl.getUniformLocation(prog, "uPoint");
    const uPress = gl.getUniformLocation(prog, "uPress");

    const small = window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scale = (small ? 0.42 : 0.6) * Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const mouse = { x: 0, y: 0, tx: 0, ty: 0, px: -9999, py: -9999, tpx: -9999, tpy: -9999, press: 0, held: false };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
      const r = canvas.getBoundingClientRect();
      mouse.tpx = (e.clientX - r.left) * (canvas.width / Math.max(1, r.width));
      mouse.tpy = (r.bottom - e.clientY) * (canvas.height / Math.max(1, r.height));
      if (mouse.px < -999) {
        mouse.px = mouse.tpx;
        mouse.py = mouse.tpy;
      }
    };
    const onDown = (e: PointerEvent) => {
      onMove(e);
      mouse.held = true;
    };
    const onUp = () => (mouse.held = false);
    window.addEventListener("pointermove", onMove, { passive: true });
    const pressTarget = host.parentElement ?? host;
    pressTarget.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    let visible = true;
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    let raf = 0;
    let t = 7.0;
    let last = performance.now();
    let shown = false;
    function frame(now: number) {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      const k = 1 - Math.pow(0.04, dt);
      mouse.x += (mouse.tx - mouse.x) * k;
      mouse.y += (mouse.ty - mouse.y) * k;
      const kp = 1 - Math.pow(0.002, dt);
      mouse.px += (mouse.tpx - mouse.px) * kp;
      mouse.py += (mouse.tpy - mouse.py) * kp;
      mouse.press += ((mouse.held ? 1 : 0) - mouse.press) * (1 - Math.pow(mouse.held ? 0.2 : 0.05, dt));
      gl!.uniform2f(uRes, canvas.width, canvas.height);
      gl!.uniform1f(uTime, t);
      gl!.uniform2f(uMouse, mouse.x, mouse.y);
      gl!.uniform1f(uIntensity, intensity);
      gl!.uniform2f(uPoint, mouse.px, mouse.py);
      gl!.uniform1f(uPress, mouse.press);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        host.dataset.ready = "";
      }
      if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(frame);
    }
    const onVis = () => {
      if (!document.hidden && visible && !raf && !reduce) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      pressTarget.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [intensity]);

  return <div ref={ref} className={className} aria-hidden="true" />;
}
