"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** A soft gold follower that becomes a labelled disc over anything with
    data-cursor="Label" (images, reels, chapters). The system cursor stays —
    this adds intent, it never replaces the pointer. Pointer devices only. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const label = el.querySelector("span")!;
    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });
    let current = "";
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = (e.target as Element).closest<HTMLElement>("[data-cursor]");
      const next = target?.dataset.cursor ?? "";
      if (next !== current) {
        current = next;
        if (next) label.textContent = next;
        el.dataset.state = next ? "label" : "dot";
      }
      el.dataset.on = "";
    };
    const leave = () => delete el.dataset.on;
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className="cx-cursor" data-state="dot" aria-hidden="true">
      <span />
    </div>
  );
}
