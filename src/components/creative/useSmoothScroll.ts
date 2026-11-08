"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/** Inertial scrolling for the Creative pages that scroll (services, contact, work, about).
    The universe home drives its own camera and never uses this. Skipped for reduced
    motion and touch screens, where native momentum is already right. Lenis drives the
    native scroll position, so the original page scripts' scroll listeners keep working. */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      anchors: true,
    });
    return () => lenis.destroy();
  }, []);
}
