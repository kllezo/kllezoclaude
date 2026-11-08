"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { studioFrames } from "@/content/creativeMedia";

gsap.registerPlugin(ScrollTrigger);

const ROWS = [studioFrames.slice(0, 6), studioFrames.slice(6, 12)];

/** Two strips of studio frames drifting in opposite directions. Scrolling
    pushes them faster and leans them with the speed, then they ease back —
    the page feels like it has momentum. */
export default function Reel() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".cx-reel-row"));
    const state = rows.map((_, i) => ({ x: i === 0 ? 0 : -50, dir: i === 0 ? -1 : 1 }));
    let boost = 0;
    let skew = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        boost = gsap.utils.clamp(-12, 12, self.getVelocity() / 260);
      },
    });
    const tick = (_t: number, deltaMs: number) => {
      if (!visible) return;
      const dt = Math.min(deltaMs, 50) / 16.67;
      boost *= Math.pow(0.92, dt);
      skew += (boost * 0.55 - skew) * 0.12 * dt;
      rows.forEach((row, i) => {
        const s = state[i];
        s.x += s.dir * (0.035 + Math.abs(boost) * 0.06) * dt;
        if (s.x <= -50) s.x += 50;
        if (s.x >= 0) s.x -= 50;
        row.style.transform = `translate3d(${s.x}%,0,0) skewX(${(-skew * s.dir).toFixed(2)}deg)`;
      });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      io.disconnect();
    };
  }, []);

  return (
    <section ref={root} className="cx-reel" aria-label="Frames from the studio">
      <div className="cx-wrap cx-reel-head">
        <p className="cx-kicker">From the studio</p>
        <p className="cx-reel-note" data-cx-fade>
          Systems we design, shoot and run. <em>Every frame here was made in-house.</em>
        </p>
      </div>
      {ROWS.map((row, r) => (
        <div className="cx-reel-strip" key={r}>
          <div className="cx-reel-row">
            {[...row, ...row].map((m, i) => (
              <figure key={i} className="cx-reel-item" data-cursor="Studio">
                <Image src={m.src} alt={i < row.length ? m.alt : ""} width={m.w} height={m.h} sizes="(max-width: 760px) 70vw, 32vw" unoptimized />
              </figure>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
