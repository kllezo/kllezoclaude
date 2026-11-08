"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

/** First visit of the session: the Kllezo wings fill with liquid gold while the
    count runs to 100, then the frame splits open. Skipped on repeat visits, under
    reduced motion, and when arriving from the entry screen (which has its own hand-off). */
export default function Loader() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current!;
    let seen = false;
    try {
      seen = sessionStorage.getItem("kz-loaded") === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hide = () => (el.style.display = "none");
    if (seen || reduce || document.documentElement.dataset.arrive) {
      hide();
      return;
    }
    const lenis = (window as unknown as { __cxLenis?: { stop(): void; start(): void } }).__cxLenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const num = el.querySelector<HTMLElement>(".cx-ld-num")!;
    const state = { p: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem("kz-loaded", "1");
        } catch {}
        document.documentElement.style.overflow = "";
        lenis?.start();
        hide();
      },
    });
    tl.to(state, {
      p: 100,
      duration: 2.1,
      ease: "power2.inOut",
      onUpdate: () => {
        num.textContent = String(Math.round(state.p)).padStart(3, "0");
        el.style.setProperty("--fill", `${100 - state.p}%`);
      },
    })
      .to(el.querySelector(".cx-ld-mark"), { scale: 1.08, duration: 0.5, ease: "power2.out" }, "-=0.15")
      .to(el.querySelectorAll(".cx-ld-meta"), { autoAlpha: 0, duration: 0.3 }, "<")
      .to(el.querySelector(".cx-ld-top"), { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "+=0.05")
      .to(el.querySelector(".cx-ld-bot"), { yPercent: 100, duration: 1.1, ease: "expo.inOut" }, "<")
      .to(el.querySelector(".cx-ld-mark"), { autoAlpha: 0, scale: 1.4, duration: 0.8, ease: "expo.in" }, "<");
    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, []);

  return (
    <div ref={ref} className="cx-loader" aria-hidden="true">
      <div className="cx-ld-top" />
      <div className="cx-ld-bot" />
      <div className="cx-ld-mark">
        <span className="cx-ld-ghost" />
        <span className="cx-ld-gold" />
      </div>
      <p className="cx-ld-meta cx-ld-left">Kllezo Creative — rendering</p>
      <p className="cx-ld-meta cx-ld-num">000</p>
    </div>
  );
}
