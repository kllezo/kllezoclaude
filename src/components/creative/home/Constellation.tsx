"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { orbs } from "@/content/creativeMedia";
import { sfx } from "@/components/creative/kit/sfx";

/* "One system" — the four orbs hang on gold strings from the Kllezo core.
   Grab one and throw it: the strings stretch, glow with tension, pull the
   others along and bring everything back together. Pointer and touch. */

const NODES = [
  { key: "content", orb: orbs.content, label: "Content", href: "/creative/services/content-growth", hx: -0.3, hy: -0.24 },
  { key: "websites", orb: orbs.websites, label: "Websites", href: "/creative/services/business-website", hx: 0.3, hy: -0.24 },
  { key: "calling", orb: orbs.calling, label: "AI Calling", href: "/creative/services/ai-calling", hx: 0.3, hy: 0.26 },
  { key: "texting", orb: orbs.texting, label: "AI Texting", href: "/creative/services/ai-texting", hx: -0.3, hy: 0.26 },
];
const LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
];

type P = { x: number; y: number; vx: number; vy: number };

export default function Constellation() {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current!;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".cx-node"));
    const core = el.querySelector<HTMLElement>(".cx-core")!;
    const lines = Array.from(el.querySelectorAll<SVGLineElement>("line"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = el.clientWidth;
    let Hh = el.clientHeight;
    const home = (i: number) => ({ x: W / 2 + NODES[i].hx * W, y: Hh / 2 + NODES[i].hy * Hh });
    const pts: P[] = NODES.map((_, i) => ({ ...home(i), vx: 0, vy: 0 }));
    const c: P = { x: W / 2, y: Hh / 2, vx: 0, vy: 0 };
    let drag = -1;
    let dragOff = { x: 0, y: 0 };
    let last = { x: 0, y: 0, t: 0 };
    let visible = false;
    let raf = 0;
    let moved = false;

    const ro = new ResizeObserver(() => {
      W = el.clientWidth;
      Hh = el.clientHeight;
    });
    ro.observe(el);

    let drawn = false;
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (!visible && drawn) return;
      drawn = true;
      const t = now / 1000;
      // core drifts back to centre
      c.vx += (W / 2 - c.x) * 0.02;
      c.vy += (Hh / 2 - c.y) * 0.02;
      pts.forEach((p, i) => {
        if (i === drag) return;
        const h = home(i);
        const sway = reduce ? 0 : 6;
        p.vx += (h.x + Math.sin(t * 0.7 + i) * sway - p.x) * 0.018;
        p.vy += (h.y + Math.cos(t * 0.6 + i * 2) * sway - p.y) * 0.018;
      });
      // neighbour strings keep the shape
      LINKS.forEach(([a, b]) => {
        const pa = pts[a];
        const pb = pts[b];
        const ha = home(a);
        const hb = home(b);
        const rest = Math.hypot(hb.x - ha.x, hb.y - ha.y);
        const dx = pb.x - pa.x;
        const dy = pb.y - pa.y;
        const d = Math.hypot(dx, dy) || 1;
        const f = (d - rest) * 0.004;
        if (a !== drag) {
          pa.vx += (dx / d) * f * d * 0.1;
          pa.vy += (dy / d) * f * d * 0.1;
        }
        if (b !== drag) {
          pb.vx -= (dx / d) * f * d * 0.1;
          pb.vy -= (dy / d) * f * d * 0.1;
        }
      });
      // core is tugged by every string
      pts.forEach((p, i) => {
        const h = home(i);
        c.vx += (p.x - h.x) * 0.004;
        c.vy += (p.y - h.y) * 0.004;
      });
      [...pts, c].forEach((p, i) => {
        if (i === drag) return;
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;
        // soft walls
        const pad = 50;
        if (p.x < pad) p.vx += (pad - p.x) * 0.1;
        if (p.x > W - pad) p.vx -= (p.x - (W - pad)) * 0.1;
        if (p.y < pad) p.vy += (pad - p.y) * 0.1;
        if (p.y > Hh - pad) p.vy -= (p.y - (Hh - pad)) * 0.1;
      });
      // draw
      items.forEach((n, i) => (n.style.transform = `translate3d(${pts[i].x}px, ${pts[i].y}px, 0) translate(-50%, -50%)`));
      core.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) translate(-50%, -50%)`;
      const seg = (l: SVGLineElement, a: P, b: P, rest: number) => {
        l.setAttribute("x1", String(a.x));
        l.setAttribute("y1", String(a.y));
        l.setAttribute("x2", String(b.x));
        l.setAttribute("y2", String(b.y));
        const stretch = Math.max(0, Math.hypot(b.x - a.x, b.y - a.y) / rest - 1);
        l.style.strokeWidth = String(1 + stretch * 3);
        l.style.opacity = String(Math.min(1, 0.35 + stretch * 1.5));
      };
      pts.forEach((p, i) => {
        const h = home(i);
        seg(lines[i], c, p, Math.hypot(h.x - W / 2, h.y - Hh / 2));
      });
      LINKS.forEach(([a, b], k) => {
        const ha = home(a);
        const hb = home(b);
        seg(lines[4 + k], pts[a], pts[b], Math.hypot(hb.x - ha.x, hb.y - ha.y));
      });
    };
    raf = requestAnimationFrame(step);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const downs = items.map((n, i) => (e: PointerEvent) => {
      e.preventDefault();
      drag = i;
      moved = false;
      const p = local(e);
      dragOff = { x: pts[i].x - p.x, y: pts[i].y - p.y };
      last = { ...p, t: performance.now() };
      n.setPointerCapture(e.pointerId);
      n.dataset.grab = "";
    });
    const move = (e: PointerEvent) => {
      if (drag < 0) return;
      const p = local(e);
      const now = performance.now();
      const pt = pts[drag];
      if (Math.hypot(p.x - last.x, p.y - last.y) > 3) moved = true;
      pt.vx = ((p.x - last.x) / Math.max(1, now - last.t)) * 16;
      pt.vy = ((p.y - last.y) / Math.max(1, now - last.t)) * 16;
      pt.x = p.x + dragOff.x;
      pt.y = p.y + dragOff.y;
      last = { ...p, t: now };
    };
    const up = () => {
      if (drag < 0) return;
      const h = home(drag);
      const stretch = Math.hypot(pts[drag].x - h.x, pts[drag].y - h.y);
      if (stretch > 40) sfx.pluck(220 + Math.min(600, stretch * 1.4));
      delete items[drag].dataset.grab;
      drag = -1;
    };
    // a click that didn't drag follows the link
    const clicks = items.map(() => (e: MouseEvent) => {
      if (moved) e.preventDefault();
    });
    items.forEach((n, i) => {
      n.addEventListener("pointerdown", downs[i]);
      n.addEventListener("click", clicks[i]);
    });
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      items.forEach((n, i) => {
        n.removeEventListener("pointerdown", downs[i]);
        n.removeEventListener("click", clicks[i]);
      });
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <section className="cx-constellation" aria-labelledby="const-h">
      <div className="cx-wrap cx-const-head">
        <p className="cx-kicker">One studio</p>
        <h2 id="const-h" className="cx-display-md" data-cx-fade>
          Pull it apart.
          <br />
          <em>It holds together.</em>
        </h2>
        <p className="cx-toy-body" data-cx-fade="0.1">
          Content, websites, calling and texting — built by one team and connected on purpose, so nothing is lost between them. Grab an orb and throw it.
        </p>
      </div>
      <div ref={stage} className="cx-const-stage">
        <svg className="cx-const-lines" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} />
          ))}
        </svg>
        <div className="cx-core" aria-hidden="true">
          <Image src={orbs.gold.src} alt="" width={800} height={800} sizes="160px" unoptimized draggable={false} />
          <span>Kllezo</span>
        </div>
        {NODES.map((n) => (
          <Link key={n.key} href={n.href} className="cx-node" data-cursor="Throw" draggable={false}>
            <Image src={n.orb.src} alt="" width={1024} height={1024} sizes="150px" unoptimized draggable={false} />
            <span>{n.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
