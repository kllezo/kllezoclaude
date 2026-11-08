"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────
   The Creative motion system. One place owns scrolling and every
   scroll-linked animation, so timing and easing stay consistent:

     [data-cx-lines]     masked line reveal (children: .cx-line > span)
     [data-cx-fade]      rise + fade on entry (optional value = delay)
     [data-cx-words]     words light up as the block scrolls through
     [data-cx-parallax]  drift at a depth (value: -1..1, default 0.15)
     [data-cx-clip]      image/frame unveils from a hairline
     [data-cx-magnetic]  element leans toward the pointer

   Lenis provides inertial scrolling on pointer devices and drives
   ScrollTrigger. Touch screens keep native momentum; reduced motion
   shows everything in place with no scroll-linked movement.
   ───────────────────────────────────────────────────────────────────────── */

const EASE = "expo.out";
const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Motion() {
  const pathname = usePathname();

  // Lenis: once for the experience.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    (window as unknown as { __cxLenis?: Lenis }).__cxLenis = lenis;
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __cxLenis?: Lenis }).__cxLenis;
    };
  }, []);

  // Per page: build every scroll animation, tear it all down on navigation.
  useIso(() => {
    const root = document.querySelector<HTMLElement>(".cx");
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = (window as unknown as { __cxLenis?: Lenis }).__cxLenis;
    if (!window.location.hash) {
      lenis?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    }

    if (reduce) return;

    const offs: (() => void)[] = [];
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-cx-lines]").forEach((el) => {
        const inner = el.querySelectorAll(".cx-line > span");
        gsap.fromTo(
          inner,
          // y: 0 clears the px offset GSAP reads from the CSS starting transform.
          { yPercent: 112, y: 0, rotate: 2.5 },
          {
            yPercent: 0,
            y: 0,
            rotate: 0,
            duration: 1.5,
            ease: EASE,
            stagger: 0.09,
            delay: Number(el.dataset.cxLines) || 0,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-cx-fade]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 36, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.3, ease: EASE, delay: Number(el.dataset.cxFade) || 0, scrollTrigger: { trigger: el, start: "top 97%", once: true } },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-cx-words]").forEach((el) => {
        if (!el.dataset.cxSplit) {
          splitWords(el);
          el.dataset.cxSplit = "1";
        }
        gsap.fromTo(
          el.querySelectorAll(".cx-w"),
          { opacity: 0.12 },
          { opacity: 1, ease: "none", stagger: 0.05, scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 45%", scrub: 0.6 } },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-cx-parallax]").forEach((el) => {
        const depth = Number(el.dataset.cxParallax) || 0.15;
        gsap.fromTo(
          el,
          { yPercent: -depth * 50 },
          { yPercent: depth * 50, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-cx-clip]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(48% 0% 48% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 85%", once: true } },
        );
      });
    }, root);

    // Magnetic elements (pointer devices only).
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      root.querySelectorAll<HTMLElement>("[data-cx-magnetic]").forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        offs.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }

    // Images arriving late change layout: re-measure once they're in.
    const refresh = () => ScrollTrigger.refresh();
    const imgs = Array.from(root.querySelectorAll("img")).filter((i) => !i.complete);
    imgs.forEach((i) => i.addEventListener("load", refresh, { once: true }));
    const t = window.setTimeout(refresh, 600);

    return () => {
      window.clearTimeout(t);
      offs.forEach((f) => f());
      ctx.revert();
    };
  }, [pathname]);

  return null;
}

/** Wrap each word of an element's text in .cx-w spans, keeping inline markup (em, b). */
function splitWords(el: HTMLElement) {
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? "").split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p));
          else {
            const s = document.createElement("span");
            s.className = "cx-w";
            s.textContent = p;
            frag.appendChild(s);
          }
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(el);
}
