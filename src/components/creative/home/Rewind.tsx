"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sfx } from "@/components/creative/kit/sfx";
import Sky from "@/components/creative/kit/Sky";

gsap.registerPlugin(ScrollTrigger);

/* Between the two acts: the tape rewinds. Scroll spins the clock back from
   midnight to 06:00 through scan lines and colour fringing, and the cold day
   bleeds into gold. */
export default function Rewind() {
  const root = useRef<HTMLElement>(null);
  const [m, setM] = useState(24 * 60);

  useLayoutEffect(() => {
    const el = root.current!;
    let lastHour = 24;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        trigger: el,
        pin: el.querySelector(".cx-rw-pin"),
        start: "top top",
        end: "+=140%",
        scrub: 0.3,
        onUpdate: (st) => {
          const p = st.progress;
          const eased = gsap.parseEase("power2.inOut")(p);
          const mins = 24 * 60 - eased * 18 * 60;
          setM(mins);
          el.style.setProperty("--rw", p.toFixed(4));
          const h = Math.floor(mins / 60);
          if (h !== lastHour && st.isActive) {
            lastHour = h;
            sfx.tick();
          }
        },
      });
    });
    return () => mm.revert();
  }, []);

  const hh = String(Math.floor(Math.min(m, 24 * 60 - 1) / 60)).padStart(2, "0");
  const mi = String(Math.floor(Math.min(m, 24 * 60 - 1) % 60)).padStart(2, "0");

  return (
    <section ref={root} className="cx-rewind" aria-label="Rewind the day">
      <div className="cx-rw-pin">
        <Sky minute={m} className="is-rewind" />
        <div className="cx-rw-scan" aria-hidden="true" />
        <div className="cx-rw-inner">
          <p className="cx-rw-label">
            <span className="cx-rw-arrows" aria-hidden="true">
              ◀◀
            </span>{" "}
            Rewind
          </p>
          <p className="cx-rw-time" data-t={`${hh}:${mi}`} aria-hidden="true">
            {hh}:{mi}
          </p>
          <p className="cx-rw-line">
            Same business. Same day. Same customers.
            <br />
            <em>Now run it with Kllezo systems.</em>
          </p>
        </div>
      </div>
    </section>
  );
}
