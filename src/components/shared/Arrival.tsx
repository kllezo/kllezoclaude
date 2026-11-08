"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { clearArrival } from "./experienceState";
import type { Experience } from "@/content/site";
import s from "./Arrival.module.css";

/* Receives the hand-off from the entry screen (see ./experienceState.ts).
   Creative: the letterbox opens from a line of gold light.
   Business: the grid lifts away tile by tile, top to bottom. */
export default function Arrival({ exp }: { exp: Experience }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current!;
    if (document.documentElement.dataset.arrive !== exp) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      clearArrival();
      return;
    }
    el.dataset.on = "";
    // gsap.context().revert() restores from()-tweened targets, so React StrictMode's
    // double effect run in development replays cleanly instead of sticking at opacity 0.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          delete el.dataset.on;
          clearArrival();
        },
      });
      if (exp === "creative") {
        tl.to(`.${s.line}`, { opacity: 0, duration: 0.5, ease: "power2.out" }, 0.15)
          .to(`.${s.top}`, { yPercent: -100, duration: 1.2, ease: "power4.inOut" }, 0.1)
          .to(`.${s.bottom}`, { yPercent: 100, duration: 1.2, ease: "power4.inOut" }, 0.1)
          .from(document.querySelectorAll("[data-arrive-item]"), { y: 40, opacity: 0, duration: 1.2, ease: "power3.out", stagger: 0.08 }, 0.55);
      } else {
        tl.to(`.${s.tile}`, { yPercent: -100, duration: 0.7, ease: "power3.inOut", stagger: 0.035 }).from(
          document.querySelectorAll("[data-arrive-item]"),
          { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.06 },
          0.3,
        );
      }
    }, el);
    return () => ctx.revert();
  }, [exp]);

  return (
    <div ref={ref} className={`${s.arrival} ${s[exp]}`} aria-hidden="true">
      {exp === "creative" ? (
        <>
          <span className={s.top} />
          <span className={s.bottom} />
          <span className={s.line} />
        </>
      ) : (
        Array.from({ length: 8 }, (_, i) => <span key={i} className={s.tile} />)
      )}
    </div>
  );
}
