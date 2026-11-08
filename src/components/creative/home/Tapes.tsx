"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const A = ["Creative brains", "Automated gains", "Content that attracts", "Websites that convert", "AI that closes"];
const B = ["Stories people stop for", "Rooms people stay in", "A voice that never sleeps", "Every message answered"];

/** Two tapes crossing the page — gold over forest green. They idle slowly and surge
    with the speed and direction of your scroll. */
export default function Tapes() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".cx-tape-row"));
    const xs = [0, -50];
    let v = 0;
    let dir = 1;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (s) => {
        v = gsap.utils.clamp(-18, 18, s.getVelocity() / 200);
        dir = s.direction;
      },
    });
    const tick = (_: number, d: number) => {
      if (!visible) return;
      const k = Math.min(d, 50) / 16.67;
      v *= Math.pow(0.9, k);
      const speed = (0.04 + Math.abs(v) * 0.05) * dir * k;
      xs[0] -= speed;
      xs[1] += speed;
      rows.forEach((r, i) => {
        if (xs[i] <= -50) xs[i] += 50;
        if (xs[i] > 0) xs[i] -= 50;
        r.style.transform = `translate3d(${xs[i]}%,0,0)`;
      });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      io.disconnect();
    };
  }, []);

  const row = (words: string[]) =>
    [...words, ...words, ...words, ...words].map((w, i) => (
      <span key={i}>
        {w} <i>✦</i>
      </span>
    ));

  return (
    <section ref={root} className="cx-tapes" aria-label="Creative brains, automated gains">
      <div className="cx-tape cx-tape-a">
        <div className="cx-tape-row">{row(A)}</div>
      </div>
      <div className="cx-tape cx-tape-b" aria-hidden="true">
        <div className="cx-tape-row">{row(B)}</div>
      </div>
    </section>
  );
}
