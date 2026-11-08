"use client";

import { useEffect, useRef, useState } from "react";
import s from "./LeakSimulator.module.css";

/* The hero's proof-of-problem: leads flow from attention to a booking. Without a
   system, they fall out at every gap; switch to "With Kllezo" and the same flow
   holds together. An illustrative simulation — the rates are for the picture,
   not a promise. */

const STAGES = ["Attention", "Website", "Reply", "Booked"];
const X = [0.07, 0.37, 0.67, 0.93];
// chance a lead is lost at each gate (after Attention, after Website, after Reply)
const DROP = { without: [0.45, 0.5, 0.55], with: [0.12, 0.15, 0.08] };
const WHY = { without: ["No hook", "No clear next step", "Nobody replied"], with: ["Stopped the scroll", "Clear path", "Replied in seconds"] };

type Dot = { x: number; y: number; vy: number; gate: number; falling: boolean; life: number };
type Mode = "without" | "with";

export default function LeakSimulator() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("without");
  const modeRef = useRef<Mode>("without");
  const stats = useRef({ arrived: 0, booked: 0, lost: [0, 0, 0] });
  const out = useRef<HTMLDivElement>(null);

  useEffect(() => {
    modeRef.current = mode;
    stats.current = { arrived: 0, booked: 0, lost: [0, 0, 0] };
  }, [mode]);

  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: Dot[] = [];
    let raf = 0;
    let last = performance.now();
    let spawn = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);

    const paint = () => {
      const st = stats.current;
      const el = out.current;
      if (!el) return;
      el.querySelector("[data-k=arrived]")!.textContent = String(st.arrived);
      el.querySelector("[data-k=booked]")!.textContent = String(st.booked);
      st.lost.forEach((n, i) => (el.querySelector(`[data-k=lost${i}]`)!.textContent = String(n)));
      const rate = st.arrived ? Math.round((st.booked / st.arrived) * 100) : 0;
      el.querySelector("[data-k=rate]")!.textContent = `${rate}%`;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const w = (c.width = c.clientWidth * devicePixelRatio);
      const h = (c.height = c.clientHeight * devicePixelRatio);
      const dpr = devicePixelRatio;
      const mid = h * 0.46;
      const m = modeRef.current;
      const good = m === "with";

      // spawn
      spawn -= dt;
      if (spawn <= 0 && !reduce) {
        spawn = 0.42 + Math.random() * 0.25;
        dots.push({ x: X[0] * w, y: mid + (Math.random() - 0.5) * 18 * dpr, vy: 0, gate: 0, falling: false, life: 1 });
        stats.current.arrived++;
      }

      ctx.clearRect(0, 0, w, h);
      // pipe
      ctx.lineCap = "round";
      for (let i = 0; i < 3; i++) {
        const x0 = X[i] * w;
        const x1 = X[i + 1] * w;
        ctx.strokeStyle = good ? "rgba(9,69,62,0.16)" : "rgba(9,69,62,0.1)";
        ctx.lineWidth = 32 * dpr;
        ctx.beginPath();
        // without a system the pipe has gaps
        const gap = good ? 0 : 26 * dpr;
        ctx.moveTo(x0 + 14 * dpr, mid);
        ctx.lineTo(x1 - 14 * dpr - gap, mid);
        ctx.stroke();
      }

      // dots
      const speed = 150 * dpr;
      dots.forEach((d) => {
        if (d.falling) {
          d.vy += 900 * dpr * dt;
          d.y += d.vy * dt;
          d.x += 30 * dpr * dt;
          d.life -= dt * 0.9;
          return;
        }
        d.x += speed * dt;
        // reaching the next stage: without a system, many fall out at the gap
        if (d.gate < 3 && d.x >= X[d.gate + 1] * w - 30 * dpr) {
          if (Math.random() < DROP[m][d.gate]) {
            d.falling = true;
            d.vy = -60 * dpr;
            stats.current.lost[d.gate]++;
            paint();
            return;
          }
          d.gate++;
          if (d.gate === 3) {
            stats.current.booked++;
            d.life = 0.6;
            paint();
          }
        }
        if (d.gate === 3) d.life -= dt * 1.6;
      });
      dots = dots.filter((d) => d.life > 0 && d.y < h + 40);

      dots.forEach((d) => {
        ctx.globalAlpha = Math.max(0, Math.min(1, d.life));
        ctx.fillStyle = d.falling ? "#c4553a" : d.gate === 3 ? "#c8a25a" : good ? "#09453e" : "#687b75";
        ctx.beginPath();
        ctx.arc(d.x, d.y, (d.gate === 3 ? 9 : 6.5) * dpr, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // stage nodes
      X.forEach((fx, i) => {
        const x = fx * w;
        ctx.fillStyle = i === 3 ? "#c8a25a" : "#09453e";
        ctx.beginPath();
        ctx.arc(x, mid, 16 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fffdf8";
        ctx.beginPath();
        ctx.arc(x, mid, 6 * dpr, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    raf = requestAnimationFrame(frame);
    const t = window.setInterval(paint, 500);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(t);
      io.disconnect();
    };
  }, []);

  return (
    <div className={s.card} data-mode={mode}>
      <div className={s.head}>
        <div>
          <b>Lead flow</b>
          <span>Illustrative simulation</span>
        </div>
        <div className={s.toggle} role="group" aria-label="Compare">
          <button type="button" aria-pressed={mode === "without"} onClick={() => setMode("without")}>
            Without a system
          </button>
          <button type="button" aria-pressed={mode === "with"} onClick={() => setMode("with")}>
            With Kllezo
          </button>
          <i className={s.thumb} aria-hidden="true" />
        </div>
      </div>

      <div className={s.stage}>
        <canvas ref={canvas} className={s.canvas} aria-label={mode === "without" ? "Leads falling out at every stage" : "Leads flowing through to a booking"} role="img" />
        <div className={s.labels} aria-hidden="true">
          {STAGES.map((st, i) => (
            <span key={st} style={{ left: `${X[i] * 100}%` }}>
              {st}
            </span>
          ))}
        </div>
        <div className={s.gates} aria-hidden="true">
          {WHY[mode].map((w, i) => (
            <span key={w} style={{ left: `${((X[i] + X[i + 1]) / 2) * 100}%` }}>
              {w}
            </span>
          ))}
        </div>
      </div>

      <div ref={out} className={s.stats}>
        <div>
          <span>Arrived</span>
          <b data-k="arrived">0</b>
        </div>
        <div>
          <span>Lost: no hook</span>
          <b data-k="lost0">0</b>
        </div>
        <div>
          <span>Lost: no next step</span>
          <b data-k="lost1">0</b>
        </div>
        <div>
          <span>Lost: no reply</span>
          <b data-k="lost2">0</b>
        </div>
        <div className={s.booked}>
          <span>Booked</span>
          <b>
            <em data-k="booked">0</em> <small data-k="rate">0%</small>
          </b>
        </div>
      </div>
    </div>
  );
}
