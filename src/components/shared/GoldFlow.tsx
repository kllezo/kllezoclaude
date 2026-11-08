"use client";

import { useEffect, useRef } from "react";

/* Cinematic generative backdrop: slow ribbons of gold light drifting
   through a dark field, with floating dust. Canvas 2D, DPR-capped,
   paused when off-screen or the tab is hidden, and a single still
   frame for reduced-motion users. */

interface Props {
  className?: string;
  ribbons?: number;
  intensity?: number;
  /** 0..1 — shifts the light toward the lower right when higher. */
  focus?: number;
}

export default function GoldFlow({ className, ribbons = 7, intensity = 1, focus = 0.5 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let t = Math.random() * 100;

    const dust = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.3,
      s: Math.random() * 0.00025 + 0.00006,
      a: Math.random() * 0.5 + 0.15,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#0b0b0b";
      ctx.fillRect(0, 0, w, h);

      // Soft key light
      const g = ctx.createRadialGradient(w * (0.3 + focus * 0.4), h * 0.55, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
      g.addColorStop(0, `rgba(200,162,90,${0.16 * intensity})`);
      g.addColorStop(0.45, "rgba(9,69,62,0.10)");
      g.addColorStop(1, "rgba(11,11,11,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < ribbons; i++) {
        const phase = i * 0.9;
        const amp = h * (0.08 + (i % 3) * 0.05);
        const baseY = h * (0.25 + (i / ribbons) * 0.55);
        ctx.beginPath();
        for (let x = -40; x <= w + 40; x += 14) {
          const nx = x / w;
          const y =
            baseY +
            Math.sin(nx * 3.1 + t * 0.32 + phase) * amp +
            Math.sin(nx * 7.3 - t * 0.21 + phase * 1.7) * amp * 0.28;
          if (x === -40) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const lg = ctx.createLinearGradient(0, 0, w, 0);
        const a = (0.1 + 0.08 * Math.sin(t * 0.4 + i)) * intensity;
        lg.addColorStop(0, "rgba(200,162,90,0)");
        lg.addColorStop(0.35 + 0.1 * Math.sin(t * 0.2 + i), `rgba(228,207,159,${a * 1.6})`);
        lg.addColorStop(0.7, `rgba(200,162,90,${a})`);
        lg.addColorStop(1, "rgba(200,162,90,0)");
        ctx.strokeStyle = lg;
        ctx.lineWidth = (1 + (i % 3) * 0.7) * Math.min(1.6, Math.max(1, intensity));
        ctx.shadowColor = "rgba(200,162,90,0.6)";
        ctx.shadowBlur = 18;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      for (const d of dust) {
        d.y -= d.s * 16;
        d.x += Math.sin(t * 0.3 + d.y * 10) * 0.00015;
        if (d.y < -0.02) d.y = 1.02;
        ctx.fillStyle = `rgba(228,207,159,${d.a * intensity})`;
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      t += 0.012;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce) draw();
      else if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };

    resize();
    start();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(raf);
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ribbons, intensity, focus]);

  return <canvas ref={ref} className={className} aria-hidden="true" style={{ width: "100%", height: "100%", display: "block" }} />;
}
