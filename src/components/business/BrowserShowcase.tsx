"use client";

import { useEffect, useRef } from "react";
import ServiceDemo from "@/components/shared/ServiceDemo";
import s from "./BrowserShowcase.module.css";

/* Signature interaction 05 — browser windows respond to scroll:
   stacked in perspective at first, they fan out into a row as the
   section passes through the viewport. */
export default function BrowserShowcase() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height * 0.4)));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={s.show}>
      <div className={`${s.win} ${s.w1}`}>
        <span className={s.label}>Lead generation</span>
        <ServiceDemo kind="funnel" />
      </div>
      <div className={`${s.win} ${s.w2}`}>
        <span className={s.label}>Business website</span>
        <ServiceDemo kind="browser" />
      </div>
      <div className={`${s.win} ${s.w3}`}>
        <span className={s.label}>E-commerce</span>
        <ServiceDemo kind="store" />
      </div>
    </div>
  );
}
