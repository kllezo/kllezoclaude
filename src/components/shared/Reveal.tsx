"use client";

import { useEffect } from "react";

/** Adds `.is-in` to every [data-reveal] element as it enters the viewport.
    Mount once per layout; elements opt in with the attribute and an
    optional `style={{"--d": "0.1s"}}` stagger. */
export default function Reveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const scan = () => document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan();
    // Re-scan when client navigation swaps the page content — batched to one scan per
    // frame, because the live demos (lead flow, ecosystem) mutate the DOM continuously.
    let raf = 0;
    const mo = new MutationObserver(() => {
      if (!raf) raf = requestAnimationFrame(() => ((raf = 0), scan()));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
