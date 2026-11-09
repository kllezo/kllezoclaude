"use client";

import { useEffect } from "react";

/* Homepage only: tells the shared nav when it is floating over a dark section
   (any element with data-tone="dark" under the top 72px) so it can switch to
   its transparent, light-type style. */
export default function NavTone() {
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.navHome = "1";
    const check = () => {
      const darks = document.querySelectorAll<HTMLElement>("[data-tone='dark']");
      let isDark = false;
      darks.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= 36 && r.bottom >= 36) isDark = true;
      });
      const v = isDark ? "dark" : "light";
      if (html.dataset.nav !== v) html.dataset.nav = v;
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      delete html.dataset.navHome;
      delete html.dataset.nav;
    };
  }, []);
  return null;
}
