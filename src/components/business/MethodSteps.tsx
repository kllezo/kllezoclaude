"use client";

import { useEffect, useRef, useState } from "react";
import { IconChart, IconLayers, IconRocket, IconSearch } from "./icons";
import s from "./MethodSteps.module.css";

/* How every engagement runs — four stages that light up in order as the
   track scrolls into view. */
const STEPS = [
  { icon: IconSearch, t: "Diagnose", d: "Find the leaks", when: "Week 1" },
  { icon: IconLayers, t: "Design", d: "One connected plan", when: "Week 2" },
  { icon: IconRocket, t: "Build & launch", d: "Tracked from day one", when: "Weeks 3–6" },
  { icon: IconChart, t: "Refine", d: "Monthly, by the numbers", when: "Every month" },
];

export default function MethodSteps() {
  const ref = useRef<HTMLOListElement>(null);
  const [lit, setLit] = useState(-1);

  useEffect(() => {
    const el = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = window.setTimeout(() => setLit(STEPS.length - 1), 0);
      return () => clearTimeout(t);
    }
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        STEPS.forEach((_, i) => timers.push(window.setTimeout(() => setLit(i), 250 + i * 450)));
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <ol ref={ref} className={s.track} style={{ ["--lit" as string]: Math.max(0, lit) / (STEPS.length - 1) }}>
      <i className={s.line} aria-hidden="true" />
      {STEPS.map((st, i) => {
        const Icon = st.icon;
        return (
          <li key={st.t} className={s.step} data-on={i <= lit ? "" : undefined}>
            <span className={s.dot}>
              <Icon size={24} />
            </span>
            <small>{st.when}</small>
            <b>{st.t}</b>
            <span className={s.d}>{st.d}</span>
          </li>
        );
      })}
    </ol>
  );
}
