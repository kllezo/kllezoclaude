"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** A studio film that opens from a small window to the full frame as you scroll
    into it, with its title held in place. The source loads only when near. */
export default function Film({ src, poster }: { src: string; poster?: string }) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useLayoutEffect(() => {
    const el = root.current!;
    const v = video.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el.querySelector(".cx-film-window"),
        { clipPath: "inset(22% 30% 22% 30% round 22px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "+=110%", scrub: 0.6, pin: true },
        },
      );
      gsap.fromTo(el.querySelector(".cx-film-title"), { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "+=110%", scrub: 0.6 } });
    });
    return () => {
      io.disconnect();
      mm.revert();
    };
  }, []);

  return (
    <section ref={root} className="cx-film" aria-label="Studio film">
      <div className="cx-film-window">
        <video ref={video} src={near ? src : undefined} poster={poster} muted loop playsInline preload="none" aria-hidden="true" />
      </div>
      <p className="cx-film-title">
        Made to be <em>watched.</em>
      </p>
    </section>
  );
}
